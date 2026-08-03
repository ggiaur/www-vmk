import * as cheerio from 'cheerio'
import type { Payload } from 'payload'
import { htmlFragmentToLexical } from './htmlToLexical'
import { uploadImageToMedia } from './vmkScraper'

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

const HU_MONTHS: Record<string, string> = {
  január: '01',
  február: '02',
  március: '03',
  április: '04',
  május: '05',
  június: '06',
  július: '07',
  augusztus: '08',
  szeptember: '09',
  október: '10',
  november: '11',
  december: '12',
}

// Valós minta: "2026. augusztus 6. (csütörtök) 17:00 | Széna Téri Tagkönyvtár"
// - a helyszín rész opcionális, sok esemény-leadben nincs " | ..." utótag.
const DATE_RE =
  /(\d{4})\.\s*([a-záéíóöőúüű]+)\s+(\d{1,2})\.\s*\([^)]+\)\s*(\d{1,2}):(\d{2})(?:\s*\|\s*([^<]+))?/i

function parseHungarianDateLine(text: string): { startDate: Date | null; locationText: string | null } {
  const match = text.match(DATE_RE)
  if (!match) return { startDate: null, locationText: null }
  const [, year, monthName, day, hour, minute, location] = match
  const month = HU_MONTHS[monthName.toLowerCase()]
  if (!month) return { startDate: null, locationText: location?.trim() ?? null }
  const dd = day.padStart(2, '0')
  const hh = hour.padStart(2, '0')
  const date = new Date(`${year}-${month}-${dd}T${hh}:${minute}:00+02:00`)
  return { startDate: Number.isNaN(date.getTime()) ? null : date, locationText: location?.trim() ?? null }
}

export type ScrapedEventListItem = { url: string; title: string; lead: string }

function parseEventsListingPage(html: string): ScrapedEventListItem[] {
  const $ = cheerio.load(html)
  const items: ScrapedEventListItem[] = []
  $('.news-index').each((_, el) => {
    const titleEl = $(el).find('.title a').first()
    const url = titleEl.attr('href')
    const title = titleEl.text().trim()
    const lead = $(el).find('.news-lead').first().text().trim()
    if (url && title) items.push({ url, title, lead })
  })
  return items
}

function slugFromUrl(url: string): string {
  return url.replace(/^\/+/, '').split('?')[0].split('/').pop() || url
}

export type EventScrapeResult = {
  processed: number
  created: number
  skippedDuplicate: number
  skippedNoDate: number
  errors: { url: string; error: string }[]
}

/** Scrapes the real vmk.hu /events listing (same `.news-index` markup as
 *  the news scraper, contrary to the earlier assumption that this needed
 *  browser rendering - plain fetch works fine) and imports events into the
 *  local Events collection, matching each event's location text against
 *  existing Libraries by name (falls back to the central library if no
 *  match, since `location` is a required relationship field). Idempotent:
 *  skips slugs already stored. */
export async function scrapeEventsIntoPayload(
  payload: Payload,
  { pageCount = 1, limit = 10 }: { pageCount?: number; limit?: number },
): Promise<EventScrapeResult> {
  const result: EventScrapeResult = { processed: 0, created: 0, skippedDuplicate: 0, skippedNoDate: 0, errors: [] }

  const libraries = await payload.find({ collection: 'libraries', limit: 100 })
  const centralLibrary = libraries.docs.find((l) => l.type === 'central') ?? libraries.docs[0]
  if (!centralLibrary) {
    result.errors.push({ url: '(setup)', error: 'No libraries exist - cannot satisfy required `location` field.' })
    return result
  }

  const listItems: ScrapedEventListItem[] = []
  for (let page = 1; page <= pageCount; page++) {
    try {
      const html = await fetchHtml(page === 1 ? '/events' : `/events?&page=${page}`)
      listItems.push(...parseEventsListingPage(html))
      await sleep(REQUEST_DELAY_MS)
    } catch (error) {
      result.errors.push({ url: `/events?&page=${page}`, error: String(error) })
    }
  }

  for (const item of listItems) {
    if (result.created >= limit) break
    result.processed++
    const slug = slugFromUrl(item.url)

    try {
      const existing = await payload.find({ collection: 'events', where: { slug: { equals: slug } }, limit: 1 })
      if (existing.docs.length > 0) {
        result.skippedDuplicate++
        continue
      }

      const { startDate, locationText } = parseHungarianDateLine(item.lead)
      if (!startDate) {
        result.skippedNoDate++
        continue
      }

      const matchedLibrary = locationText
        ? libraries.docs.find((l) => (l.name as string).toLowerCase().includes(locationText.toLowerCase().split(' ')[0]))
        : null

      const detailHtml = await fetchHtml(item.url)
      await sleep(REQUEST_DELAY_MS)
      const $ = cheerio.load(detailHtml)
      const bodyContainer = $('.news-details').first()
      const imageUrls: string[] = []
      bodyContainer.find('img').each((_, img) => {
        const src = $(img).attr('src')
        if (src) imageUrls.push(src.startsWith('http') ? src : `${SOURCE_BASE}${src}`)
      })
      bodyContainer.find('img').remove()
      const bodyHtml = bodyContainer.html() ?? ''

      let featuredImage: string | number | undefined
      if (imageUrls[0]) {
        try {
          const media = await uploadImageToMedia(payload, imageUrls[0], item.title)
          featuredImage = media.id
        } catch (imgErr) {
          result.errors.push({ url: imageUrls[0], error: String(imgErr) })
        }
      }

      const lexicalContent = htmlFragmentToLexical(bodyHtml)
      const isEmpty = lexicalContent.root.children.every(
        (node) => !('children' in node) || node.children.length === 0,
      )
      if (isEmpty) {
        lexicalContent.root.children = [
          {
            type: 'paragraph',
            children: [
              { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: item.lead || item.title, version: 1 },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        ]
      }

      await payload.create({
        collection: 'events',
        data: {
          title: item.title,
          slug,
          startDate: startDate.toISOString(),
          location: (matchedLibrary ?? centralLibrary).id,
          targetAudience: 'all',
          description: lexicalContent,
          featuredImage,
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
