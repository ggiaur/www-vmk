import * as cheerio from 'cheerio'
import type { Payload } from 'payload'

const SOURCE_BASE = 'https://www.vmk.hu'
const USER_AGENT =
  'Mozilla/5.0 (compatible; VMKMigrationBot/1.0; +https://www.vmk.hu) institutional content migration'
const REQUEST_DELAY_MS = 300

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchHtml(path: string): Promise<string> {
  const url = path.startsWith('http') ? path : `${SOURCE_BASE}${path}`
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`)
  return res.text()
}

export type ScrapedDocument = { title: string; url: string }

/** Parses /alapdokumentumok — a freeform WYSIWYG page with inline PDF
 *  links, no consistent container markup (unlike news/staff). Selecting
 *  every `a[href$=".pdf"]` inside .col-content (to skip the nav's own
 *  couple of duplicate PDF links) is the only reliable approach here. */
export function parseDocumentsListing(html: string): ScrapedDocument[] {
  const $ = cheerio.load(html)
  const docs: ScrapedDocument[] = []
  const seen = new Set<string>()

  $('.col-content a[href$=".pdf"]').each((_, el) => {
    const href = $(el).attr('href')
    if (!href) return
    const url = href.startsWith('http') ? href : `${SOURCE_BASE}${href}`
    if (seen.has(url)) return
    seen.add(url)

    let title = $(el).text().trim()
    if (!title) {
      // Some links wrap only the pdf-icon <img>; the visible title text
      // sits just after the closing </a> as plain text in the same <span>.
      title = $(el).parent().text().trim()
    }
    if (!title) {
      title = decodeURIComponent(url.split('/').pop() || 'Dokumentum').replace(/\.pdf$/i, '')
    }

    docs.push({ title, url })
  })

  return docs
}

export function guessCategory(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('szmsz') || t.includes('szervezeti és működési')) return 'szmsz'
  if (t.includes('beszámoló')) return 'report'
  if (t.includes('pályázat')) return 'grant'
  if (t.includes('kérdőív') || t.includes('űrlap')) return 'form'
  return 'other'
}

export function guessYear(title: string, url: string): number | undefined {
  const match = (title + ' ' + url).match(/20\d{2}/)
  return match ? Number(match[0]) : undefined
}

export type DocumentsScrapeResult = {
  found: number
  created: number
  skippedDuplicate: number
  errors: { title: string; error: string }[]
}

/** Scrapes /alapdokumentumok, downloads each PDF, uploads to `media`, and
 *  creates a `documents` record. Idempotent by title. */
export async function scrapeDocumentsIntoPayload(payload: Payload): Promise<DocumentsScrapeResult> {
  const result: DocumentsScrapeResult = { found: 0, created: 0, skippedDuplicate: 0, errors: [] }

  let docs: ScrapedDocument[]
  try {
    const html = await fetchHtml('/alapdokumentumok')
    docs = parseDocumentsListing(html)
  } catch (error) {
    result.errors.push({ title: '(listing)', error: String(error) })
    return result
  }

  result.found = docs.length

  for (const doc of docs) {
    try {
      const existing = await payload.find({
        collection: 'documents',
        where: { sourceUrl: { equals: doc.url } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        result.skippedDuplicate++
        continue
      }

      const res = await fetch(doc.url, { headers: { 'User-Agent': USER_AGENT } })
      await sleep(REQUEST_DELAY_MS)
      if (!res.ok) {
        result.errors.push({ title: doc.title, error: `PDF fetch failed ${res.status}` })
        continue
      }
      const arrayBuffer = await res.arrayBuffer()
      const filename = decodeURIComponent(doc.url.split('/').pop() || 'document.pdf')

      const media = await payload.create({
        collection: 'media',
        data: { alt: doc.title },
        file: {
          data: Buffer.from(arrayBuffer),
          mimetype: 'application/pdf',
          name: filename,
          size: arrayBuffer.byteLength,
        },
      })

      await payload.create({
        collection: 'documents',
        data: {
          title: doc.title,
          file: media.id,
          category: guessCategory(doc.title),
          year: guessYear(doc.title, doc.url),
          sourceUrl: doc.url,
        },
      })
      result.created++
    } catch (error) {
      result.errors.push({ title: doc.title, error: String(error) })
    }
  }

  return result
}
