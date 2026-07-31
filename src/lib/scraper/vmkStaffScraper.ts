import * as cheerio from 'cheerio'
import type { Payload } from 'payload'

const SOURCE_BASE = 'https://www.vmk.hu'
const USER_AGENT =
  'Mozilla/5.0 (compatible; VMKMigrationBot/1.0; +https://www.vmk.hu) institutional content migration'

async function fetchHtml(path: string): Promise<string> {
  const url = path.startsWith('http') ? path : `${SOURCE_BASE}${path}`
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`)
  return res.text()
}

export type ScrapedStaffMember = {
  name: string
  position: string
  phone?: string
  email?: string
}

/** Parses /munkatarsak — a single-page staff directory reusing the same
 *  .news-index/.title/.news-lead markup as the news listing. */
export function parseStaffListing(html: string): ScrapedStaffMember[] {
  const $ = cheerio.load(html)
  const members: ScrapedStaffMember[] = []

  $('.news-index').each((_, el) => {
    const name = $(el).find('.title a').first().text().trim()
    if (!name) return
    const position = $(el).find('.title .date').first().text().trim()
    const leadText = $(el).find('.news-lead').first()
    // Each field sits on its own line inside .news-lead (real DOM whitespace
    // between sibling <div>s), so "Telefonszám: ..." never shares a line
    // with "E-mail cím: ..." — capture up to the next newline, full stop.
    const phoneMatch = leadText.text().match(/Telefonszám:\s*([^\n]+)/)
    const email = leadText.find('a.mailto').first().text().trim() || undefined
    const phone = phoneMatch ? phoneMatch[1].trim() : undefined

    members.push({ name, position, phone, email })
  })

  return members
}

export type StaffScrapeResult = {
  found: number
  created: number
  skippedDuplicate: number
  errors: { name: string; error: string }[]
}

/** Scrapes /munkatarsak and imports into the `staff` collection.
 *  Idempotent by name (skips members already present). This is real
 *  personal data (names, direct phone extensions, work email) — but it is
 *  already published publicly on the institution's own live site, which
 *  is exactly the source of truth the Staff collection is meant to
 *  mirror. Department/library linkage is intentionally left unset here
 *  (the old site's 7-way library filter doesn't map cleanly onto what's
 *  seeded yet) — an editor can assign it in the admin panel. */
export async function scrapeStaffIntoPayload(payload: Payload): Promise<StaffScrapeResult> {
  const result: StaffScrapeResult = { found: 0, created: 0, skippedDuplicate: 0, errors: [] }

  let members: ScrapedStaffMember[]
  try {
    const html = await fetchHtml('/munkatarsak')
    members = parseStaffListing(html)
  } catch (error) {
    result.errors.push({ name: '(listing)', error: String(error) })
    return result
  }

  result.found = members.length

  for (const member of members) {
    try {
      const existing = await payload.find({
        collection: 'staff',
        where: { name: { equals: member.name } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        result.skippedDuplicate++
        continue
      }

      await payload.create({
        collection: 'staff',
        data: {
          name: member.name,
          position: member.position || 'Munkatárs',
          phone: member.phone,
          email: member.email,
        },
      })
      result.created++
    } catch (error) {
      result.errors.push({ name: member.name, error: String(error) })
    }
  }

  return result
}
