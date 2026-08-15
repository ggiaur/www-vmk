import * as cheerio from 'cheerio'
import type { Payload } from 'payload'
import { htmlFragmentToLexical } from './htmlToLexical'
import { uploadImageToMedia } from './vmkScraper'
import { VIDEO_EMBED_ALLOWED_HOSTS } from '@/blocks/PageBlocks'

const SOURCE_BASE = 'https://www.vmk.hu'
const USER_AGENT =
  'Mozilla/5.0 (compatible; VMKMigrationBot/1.0; +https://www.vmk.hu) institutional content migration'
const REQUEST_DELAY_MS = 400

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchHtml(path: string): Promise<string> {
  const url = path.startsWith('http') ? path : `${SOURCE_BASE}${path}`
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`)
  return res.text()
}

export type PageScrapeResult = {
  processed: number
  created: number
  skippedDuplicate: number
  skippedNoContent: number
  errors: { slug: string; error: string }[]
}

/** Direct-URL importer for the catch-all `pages` collection (`[...slug]`
 *  route). Unlike the news/events scrapers, this does NOT discover URLs
 *  from a listing page -- it takes an explicit slug list (the known first-
 *  hop gaps from docs/FIRST_HOP_ROUTE_MATRIX.md) and imports each one
 *  directly, since these are one-off institutional/static/announcement
 *  pages with no consistent listing to crawl. The old site's static pages
 *  share one template: `h1.page-title` inside a `.section-box` container
 *  (distinct from the `.news-details` container news/events use) --
 *  reproduced by inspecting several real missing pages (e.g. /kurrens,
 *  /wishbasket) before writing this. Idempotent: skips slugs already
 *  stored in `pages`. */
export async function scrapePagesIntoPayload(
  payload: Payload,
  { slugs }: { slugs: string[] },
): Promise<PageScrapeResult> {
  const result: PageScrapeResult = { processed: 0, created: 0, skippedDuplicate: 0, skippedNoContent: 0, errors: [] }

  for (const rawSlug of slugs) {
    const slug = rawSlug.replace(/^\/+/, '')
    result.processed++
    try {
      const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
      if (existing.docs.length > 0) {
        result.skippedDuplicate++
        continue
      }

      const html = await fetchHtml(`/${slug}`)
      await sleep(REQUEST_DELAY_MS)
      const $ = cheerio.load(html)
      const titleEl = $('h1.page-title').first()
      const title = titleEl.text().trim() || $('title').first().text().trim() || slug
      const box = titleEl.length ? titleEl.closest('.section-box') : $('.col-content').first()
      box.find('h1.page-title').remove()

      const imageUrls: string[] = []
      box.find('img').each((_, img) => {
        const src = $(img).attr('src')
        if (src) imageUrls.push(src.startsWith('http') ? src : `${SOURCE_BASE}${src}`)
      })
      // Some old-site pages express their whole body as icon-only links
      // (an <a> whose sole child is an <img>, no visible text) -- e.g.
      // a row of "open as PDF" / "open flipbook" buttons. Removing images
      // unconditionally would leave those <a> tags empty, and an
      // all-empty-link body reads as no content. Give any such link a
      // real label (from its title/aria-label, or the link target's host)
      // before the images are stripped, same fallback vmkDocumentsScraper
      // uses for icon-wrapped PDF links.
      box.find('a').each((_, a) => {
        const el = $(a)
        if (el.text().trim()) return
        const label =
          el.attr('title')?.trim() ||
          el.attr('aria-label')?.trim() ||
          el.find('img').attr('alt')?.trim() ||
          (() => {
            try {
              return new URL(el.attr('href') ?? '', SOURCE_BASE).hostname
            } catch {
              return null
            }
          })()
        el.text(label ? `Megnyitás: ${label}` : 'Megnyitás')
      })
      box.find('img').remove()
      const bodyHtml = box.html() ?? ''

      let featuredImage: string | number | undefined
      if (imageUrls[0]) {
        try {
          const media = await uploadImageToMedia(payload, imageUrls[0], title)
          featuredImage = media.id
        } catch (imgErr) {
          result.errors.push({ slug, error: `image: ${String(imgErr)}` })
        }
      }

      const lexicalContent = htmlFragmentToLexical(bodyHtml)
      const isEmpty = lexicalContent.root.children.every(
        (node) => !('children' in node) || node.children.length === 0,
      )

      const layout: Record<string, unknown>[] = []
      if (featuredImage) {
        layout.push({ blockType: 'hero', heading: title, image: featuredImage })
      }
      if (!isEmpty) {
        layout.push({ blockType: 'richText', content: lexicalContent })
      }

      // A handful of reference pages have no real body text at all -- just
      // a heading and a sidebar/box video widget (verified: /a-konyvtar-
      // hasznalata and /kozponti-konyvtar-1 both reduce to just their title
      // once the main content column is isolated). Rather than skip those
      // as "no content", fall back to a plain link to the one thing
      // actually on the page. (There's a dedicated videoEmbed block ready
      // for a real <iframe> once it can be migrated in -- see
      // src/blocks/PageBlocks.ts -- but it isn't registered yet, so this
      // stays a plain richText link for now, through the same host
      // allowlist.)
      if (!layout.length) {
        const embedUrl = $('iframe')
          .filter((_, el) => VIDEO_EMBED_ALLOWED_HOSTS.includes((() => {
            try {
              return new URL($(el).attr('src') ?? '', SOURCE_BASE).hostname
            } catch {
              return ''
            }
          })()))
          .first()
          .attr('src')
        if (embedUrl) {
          layout.push({
            blockType: 'richText',
            content: htmlFragmentToLexical(`<p>A referencia oldalon ehhez a címhez egy videó tartozik: <a href="${embedUrl}">${embedUrl}</a></p>`),
          })
        }
      }

      if (!layout.length) {
        result.skippedNoContent++
        continue
      }

      await payload.create({
        collection: 'pages',
        data: {
          title,
          slug,
          layout,
          _status: 'published',
        } as Record<string, unknown>,
      })
      result.created++
    } catch (error) {
      result.errors.push({ slug, error: String(error) })
    }
  }

  return result
}
