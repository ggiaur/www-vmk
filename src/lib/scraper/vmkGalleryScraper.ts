import * as cheerio from 'cheerio'
import type { Payload } from 'payload'
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

type FolderLink = { href: string; title: string; bgImage: string | null }

/** The real vmk.hu /gallery browser is a 3-level nested folder structure
 *  (Év [year] -> Tagkönyvtár/Részleg [library] -> egyedi esemény-galéria
 *  valós borítóképpel) - not a flat listing. Each level uses the same
 *  `.gallery-item` card markup with a CSS background-image (not a real
 *  <img src>), so parsing has to read the inline style attribute. */
function parseGalleryFolder(html: string): FolderLink[] {
  const $ = cheerio.load(html)
  const items: FolderLink[] = []
  $('a.gallery-item').each((_, el) => {
    const href = $(el).attr('href')
    const title = $(el).attr('title') || $(el).find('h2').first().text().trim()
    const style = $(el).find('figure').attr('style') || ''
    const match = style.match(/url\((['"]?)(.*?)\1\)/)
    const bgImage = match ? match[2] : null
    if (href) items.push({ href, title, bgImage })
  })
  return items
}

function slugFromHref(href: string): string {
  return href.replace(/^\/+/, '').split('?')[0].split('/').pop() || href
}

export type GalleryScrapeResult = {
  yearFoldersScanned: number
  libraryFoldersScanned: number
  galleriesFound: number
  created: number
  skippedDuplicate: number
  errors: { context: string; error: string }[]
}

/** Crawls the real vmk.hu gallery folder tree (year -> library -> event)
 *  starting from the top-level `/gallery` index, and creates one Galleries
 *  record per level-3 event gallery found, with its real cover image
 *  downloaded and attached. Bounded by `maxYearFolders` /
 *  `maxLibraryFoldersPerYear` / `maxGalleries` to keep a single run
 *  reasonable against the source server and request timeouts - the full
 *  archive goes back to well before 2013 across many library subfolders
 *  each year, so this is a scoped recent-content migration, not an
 *  exhaustive historical crawl. Idempotent: skips slugs already stored. */
export async function scrapeGalleriesIntoPayload(
  payload: Payload,
  {
    maxYearFolders = 2,
    maxLibraryFoldersPerYear = 6,
    maxGalleries = 30,
  }: { maxYearFolders?: number; maxLibraryFoldersPerYear?: number; maxGalleries?: number } = {},
): Promise<GalleryScrapeResult> {
  const result: GalleryScrapeResult = {
    yearFoldersScanned: 0,
    libraryFoldersScanned: 0,
    galleriesFound: 0,
    created: 0,
    skippedDuplicate: 0,
    errors: [],
  }

  let yearFolders: FolderLink[]
  try {
    const topHtml = await fetchHtml('/gallery')
    yearFolders = parseGalleryFolder(topHtml).slice(0, maxYearFolders)
  } catch (error) {
    result.errors.push({ context: '/gallery', error: String(error) })
    return result
  }

  for (const yearFolder of yearFolders) {
    if (result.created >= maxGalleries) break
    result.yearFoldersScanned++
    await sleep(REQUEST_DELAY_MS)

    let libraryFolders: FolderLink[]
    try {
      const yearHtml = await fetchHtml(yearFolder.href)
      libraryFolders = parseGalleryFolder(yearHtml).slice(0, maxLibraryFoldersPerYear)
    } catch (error) {
      result.errors.push({ context: yearFolder.href, error: String(error) })
      continue
    }

    for (const libFolder of libraryFolders) {
      if (result.created >= maxGalleries) break
      result.libraryFoldersScanned++
      await sleep(REQUEST_DELAY_MS)

      let eventGalleries: FolderLink[]
      try {
        const libHtml = await fetchHtml(libFolder.href)
        eventGalleries = parseGalleryFolder(libHtml)
      } catch (error) {
        result.errors.push({ context: libFolder.href, error: String(error) })
        continue
      }

      for (const gallery of eventGalleries) {
        if (result.created >= maxGalleries) break
        result.galleriesFound++
        const slug = slugFromHref(gallery.href)

        try {
          const existing = await payload.find({
            collection: 'galleries',
            where: { slug: { equals: slug } },
            limit: 1,
          })
          if (existing.docs.length > 0) {
            result.skippedDuplicate++
            continue
          }

          let coverImage: string | number | undefined
          if (gallery.bgImage && !gallery.bgImage.includes('placehold.it')) {
            try {
              const media = await uploadImageToMedia(payload, gallery.bgImage, gallery.title)
              coverImage = media.id
            } catch (imgErr) {
              result.errors.push({ context: gallery.bgImage, error: String(imgErr) })
            }
          }

          await payload.create({
            collection: 'galleries',
            data: {
              title: gallery.title,
              slug,
              coverImage,
            },
          })
          result.created++
          await sleep(REQUEST_DELAY_MS)
        } catch (error) {
          const detail =
            error && typeof error === 'object' && 'data' in error
              ? JSON.stringify((error as { data: unknown }).data)
              : String(error)
          result.errors.push({ context: gallery.href, error: detail })
        }
      }
    }
  }

  return result
}
