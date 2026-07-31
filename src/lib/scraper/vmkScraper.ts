import * as cheerio from 'cheerio'
import type { Payload } from 'payload'
import { htmlFragmentToLexical } from './htmlToLexical'

const SOURCE_BASE = 'https://www.vmk.hu'
const USER_AGENT =
  'Mozilla/5.0 (compatible; VMKMigrationBot/1.0; +https://www.vmk.hu) institutional content migration'
const REQUEST_DELAY_MS = 400 // be gentle with the source server

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchHtml(path: string): Promise<string> {
  const url = path.startsWith('http') ? path : `${SOURCE_BASE}${path}`
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`)
  return res.text()
}

export type ScrapedListItem = { url: string; title: string; lead: string }

/** Parses one /news?&page=N listing page for article links + excerpts. */
export function parseNewsListingPage(html: string): ScrapedListItem[] {
  const $ = cheerio.load(html)
  const items: ScrapedListItem[] = []
  $('.news-index').each((_, el) => {
    const titleEl = $(el).find('.title a').first()
    const url = titleEl.attr('href')
    const title = titleEl.text().trim()
    const lead = $(el).find('.news-lead').first().text().trim()
    if (url && title) items.push({ url, title, lead })
  })
  return items
}

export async function fetchNewsListingPage(pageNum: number): Promise<ScrapedListItem[]> {
  const html = await fetchHtml(`/news?&page=${pageNum}`)
  return parseNewsListingPage(html)
}

export type ScrapedArticle = {
  title: string
  bodyHtml: string
  imageUrls: string[]
}

/** Parses an individual article detail page (.news-details-title / .news-details). */
export function parseArticleDetail(html: string): ScrapedArticle {
  const $ = cheerio.load(html)
  const title = $('.news-details-title').first().text().trim()
  const bodyContainer = $('.news-details').first()
  const imageUrls: string[] = []
  bodyContainer.find('img').each((_, img) => {
    const src = $(img).attr('src')
    if (src) imageUrls.push(src.startsWith('http') ? src : `${SOURCE_BASE}${src}`)
  })
  bodyContainer.find('img').remove()
  const bodyHtml = bodyContainer.html() ?? ''
  return { title, bodyHtml, imageUrls }
}

/** Guesses a publish date from the old site's inconsistent slug conventions
 *  (YYYYMMDD_, YYYY-MM-DD-, YYYYMM_) documented in DISCOVERY_AUDIT.md.
 *  Falls back to `now` — the caller should flag guessed dates. */
export function guessDateFromSlug(slug: string): { date: Date; guessed: boolean } {
  const isoMatch = slug.match(/^(\d{4})-(\d{2})-(\d{2})-/)
  if (isoMatch) {
    return { date: new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T10:00:00Z`), guessed: false }
  }
  const compactMatch = slug.match(/^(\d{4})(\d{2})(\d{2})_/)
  if (compactMatch) {
    return {
      date: new Date(`${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}T10:00:00Z`),
      guessed: false,
    }
  }
  const monthMatch = slug.match(/^(\d{4})(\d{2})_/)
  if (monthMatch) {
    return { date: new Date(`${monthMatch[1]}-${monthMatch[2]}-01T10:00:00Z`), guessed: true }
  }
  const underscoreMonthMatch = slug.match(/^(\d{4})_(\d{2})_/)
  if (underscoreMonthMatch) {
    return {
      date: new Date(`${underscoreMonthMatch[1]}-${underscoreMonthMatch[2]}-01T10:00:00Z`),
      guessed: true,
    }
  }
  const trailingCompactMatch = slug.match(/-((?:19|20)\d{2})(\d{2})(\d{2})(?:-|$)/)
  if (trailingCompactMatch) {
    return {
      date: new Date(`${trailingCompactMatch[1]}-${trailingCompactMatch[2]}-${trailingCompactMatch[3]}T10:00:00Z`),
      guessed: true,
    }
  }
  const yearPrefixMatch = slug.match(/^(\d{4})-/)
  if (yearPrefixMatch) {
    return { date: new Date(`${yearPrefixMatch[1]}-01-01T10:00:00Z`), guessed: true }
  }
  // Last resort: a plausible (19xx/20xx) year anywhere in the slug, e.g.
  // "kortars-muveszeti-fesztival-2017" or "orszagos-konyvtari-napok-2016-1"
  // — real, common patterns on this site. Without this, these silently
  // defaulted to the scrape date instead of anything resembling reality.
  const yearAnywhereMatch = slug.match(/(?:^|-)((?:19|20)\d{2})(?:-|$)/)
  if (yearAnywhereMatch) {
    return { date: new Date(`${yearAnywhereMatch[1]}-01-01T10:00:00Z`), guessed: true }
  }
  return { date: new Date(), guessed: true }
}

function slugFromUrl(url: string): string {
  return url.replace(/^\/+/, '').split('?')[0].split('/').pop() || url
}

async function uploadImageToMedia(payload: Payload, imageUrl: string, altText: string) {
  const res = await fetch(imageUrl, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`Image fetch failed ${res.status} for ${imageUrl}`)
  const arrayBuffer = await res.arrayBuffer()
  const filename = imageUrl.split('/').pop()?.split('?')[0] || 'image.jpg'
  const mimetype = res.headers.get('content-type') || 'image/jpeg'

  return payload.create({
    collection: 'media',
    data: { alt: altText },
    file: { data: Buffer.from(arrayBuffer), mimetype, name: filename, size: arrayBuffer.byteLength },
  })
}

export type ScrapeRunResult = {
  processed: number
  created: number
  skippedDuplicate: number
  errors: { url: string; error: string }[]
}

/** Scrapes `pageCount` listing pages (starting at 1) and imports up to
 *  `limit` new articles into the `news` collection. Idempotent: skips URLs
 *  already stored (matched by slug). Designed to be called from a dev-only
 *  Next.js route handler (see src/app/api/dev-scrape-news/route.ts) — NOT
 *  a standalone script, because standalone tsx execution hits the Node 24
 *  ESM/CJS interop bug documented in .ai/context/current_state.md. */
export async function scrapeNewsIntoPayload(
  payload: Payload,
  { pageCount = 1, limit = 5 }: { pageCount?: number; limit?: number },
): Promise<ScrapeRunResult> {
  const result: ScrapeRunResult = { processed: 0, created: 0, skippedDuplicate: 0, errors: [] }
  const listItems: ScrapedListItem[] = []

  const anyUser = await payload.find({ collection: 'users', limit: 1 })
  const authorId = anyUser.docs[0]?.id
  if (!authorId) {
    result.errors.push({ url: '(setup)', error: 'No users exist in Payload — create an admin user before scraping.' })
    return result
  }

  for (let page = 1; page <= pageCount; page++) {
    try {
      const items = await fetchNewsListingPage(page)
      listItems.push(...items)
      await sleep(REQUEST_DELAY_MS)
    } catch (error) {
      result.errors.push({ url: `/news?&page=${page}`, error: String(error) })
    }
  }

  for (const item of listItems) {
    if (result.created >= limit) break
    result.processed++
    const slug = slugFromUrl(item.url)

    try {
      const existing = await payload.find({
        collection: 'news',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        result.skippedDuplicate++
        continue
      }

      const detailHtml = await fetchHtml(item.url)
      await sleep(REQUEST_DELAY_MS)
      const article = parseArticleDetail(detailHtml)
      const { date, guessed } = guessDateFromSlug(slug)

      let featuredImage: string | number | undefined
      if (article.imageUrls[0]) {
        try {
          const media = await uploadImageToMedia(payload, article.imageUrls[0], article.title || item.title)
          featuredImage = media.id
        } catch (imgErr) {
          result.errors.push({ url: article.imageUrls[0], error: String(imgErr) })
        }
      }

      const lexicalContent = htmlFragmentToLexical(article.bodyHtml)
      const isEffectivelyEmpty = lexicalContent.root.children.every(
        (node) => !('children' in node) || node.children.length === 0,
      )
      if (isEffectivelyEmpty) {
        // Many vmk.hu "news" items are a poster image with no separate body
        // text — Payload's required richText validator rejects a
        // structurally-empty document, so fall back to the listing lead text.
        const fallbackText = item.lead || article.title || item.title || 'Lásd a mellékelt képet.'
        lexicalContent.root.children = [
          {
            type: 'paragraph',
            children: [
              { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: fallbackText, version: 1 },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        ]
      }

      await payload.create({
        collection: 'news',
        data: {
          title: article.title || item.title,
          slug,
          publishedAt: date.toISOString(),
          category: 'general',
          summary: (item.lead || article.title || item.title).slice(0, 300),
          content: lexicalContent,
          featuredImage,
          author: authorId,
          sourceNote: guessed ? 'Dátum becsülve a régi URL slugből (vmk.hu migráció)' : undefined,
          _status: 'published',
        } as Record<string, unknown>,
      })
      result.created++
    } catch (error) {
      const detail =
        error && typeof error === 'object' && 'data' in error
          ? JSON.stringify((error as { data: unknown }).data)
          : String(error)
      result.errors.push({ url: item.url, error: detail })
    }
  }

  return result
}
