/**
 * Payload CMS Local API wrapper
 *
 * Payload v3 Next.js-ben futva Local API-n keresztül érhető el,
 * ami közvetlen adatbázis-hozzáférést biztosít – HTTP overhead nélkül.
 * Ezért nincs szükség fetch() hívásokra a szerver komponensekben.
 */

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getPayloadClient() {
  const config = await configPromise
  return getPayload({ config })
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function getLatestNews(limit = 3) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'news',
    limit,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    depth: 1,
  })
  return result.docs
}

export async function getNewsBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getUpcomingEvents(limit = 4) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'events',
    limit,
    sort: 'startDate',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { startDate: { greater_than: new Date().toISOString() } },
      ],
    },
    depth: 1,
  })
  return result.docs
}

export async function getEventBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
}

// ─── Libraries ────────────────────────────────────────────────────────────────

export async function getAllLibraries() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'libraries',
    limit: 50,
    sort: 'name',
    depth: 1,
  })
  return result.docs
}

// ─── Opening Hours ────────────────────────────────────────────────────────────

export async function getOpeningHoursForLibrary(libraryId: string | number) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'opening-hours',
    where: { library: { equals: libraryId } },
    limit: 7,
    depth: 0,
  })
  return result.docs
}

export async function getAllOpeningHours() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'opening-hours',
    limit: 100,
    depth: 1,
  })
  return result.docs
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export async function getAllStaff() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'staff',
    limit: 100,
    sort: 'order',
    depth: 1,
  })
  return result.docs
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function getAllDocuments(category?: string) {
  const payload = await getPayloadClient()
  const where = category ? { category: { equals: category } } : undefined
  const result = await payload.find({
    collection: 'documents',
    limit: 100,
    sort: '-year',
    where,
    depth: 1,
  })
  return result.docs
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function getAllServices() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    limit: 50,
    depth: 1,
  })
  return result.docs
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_ORDER: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
}

const DAY_LABELS: Record<string, string> = {
  monday: 'Hétfő',
  tuesday: 'Kedd',
  wednesday: 'Szerda',
  thursday: 'Csütörtök',
  friday: 'Péntek',
  saturday: 'Szombat',
  sunday: 'Vasárnap',
}

/**
 * Rendezi a nyitvatartási rekordokat hétfőtől vasárnapig,
 * és visszaadja az emberi olvasható formátumot.
 */
export function formatOpeningHours(
  docs: Array<Record<string, any>>
) {
  return [...docs]
    .sort((a, b) => (DAY_ORDER[a.dayOfWeek] ?? 9) - (DAY_ORDER[b.dayOfWeek] ?? 9))
    .map((doc) => ({
      day: DAY_LABELS[doc.dayOfWeek] ?? doc.dayOfWeek,
      hours: doc.isClosed ? 'Zárva' : `${doc.openTime ?? '?'} - ${doc.closeTime ?? '?'}`,
      isToday: DAY_ORDER[doc.dayOfWeek] === (new Date().getDay() + 6) % 7,
    }))
}
