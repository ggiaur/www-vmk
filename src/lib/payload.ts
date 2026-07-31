/**
 * Payload CMS Local API wrapper
 *
 * Payload v3 Next.js-ben futva Local API-n keresztül érhető el,
 * ami közvetlen adatbázis-hozzáférést biztosít – HTTP overhead nélkül.
 * Ha az adatbázis még nincs elindítva (pl. fejlesztői környezetben),
 * a függvények biztonságosan üres listával vagy null-lal térnek vissza.
 */

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getPayloadClient() {
  try {
    const config = await configPromise
    return await getPayload({ config })
  } catch (error) {
    console.warn('[Payload CMS] Database connection offline or initializing:', error)
    return null
  }
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function getLatestNews(limit = 3) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'news',
      limit,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getPaginatedNews({
  page = 1,
  limit = 12,
  category,
}: {
  page?: number
  limit?: number
  category?: string
}) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return { docs: [], totalPages: 1, page: 1, hasNextPage: false, hasPrevPage: false }
    const where: Record<string, unknown> = { _status: { equals: 'published' } }
    if (category && category !== 'all') {
      where.category = { equals: category }
    }
    const result = await payload.find({
      collection: 'news',
      where: where as Parameters<typeof payload.find>[0]['where'],
      sort: '-publishedAt',
      page,
      limit,
      depth: 1,
    })
    return {
      docs: result.docs,
      totalPages: result.totalPages,
      page: result.page ?? 1,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    }
  } catch {
    return { docs: [], totalPages: 1, page: 1, hasNextPage: false, hasPrevPage: false }
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return null
    const result = await payload.find({
      collection: 'news',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getArchivedNews(limit = 100) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'news',
      limit,
      sort: '-publishedAt',
      where: { and: [{ _status: { equals: 'published' } }, { category: { equals: 'archive' } }] },
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getUpcomingEvents(limit = 4) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
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
  } catch {
    return []
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return null
    const result = await payload.find({
      collection: 'events',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

// ─── Libraries ────────────────────────────────────────────────────────────────

export async function getAllLibraries() {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'libraries',
      limit: 50,
      sort: 'name',
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getLibrariesByType(type: 'central' | 'branch' | 'department') {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'libraries',
      where: { type: { equals: type } },
      limit: 50,
      sort: 'name',
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getLibraryBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return null
    const result = await payload.find({
      collection: 'libraries',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

// ─── Opening Hours ────────────────────────────────────────────────────────────

export async function getOpeningHoursForLibrary(libraryId: string | number) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'opening-hours',
      where: { library: { equals: libraryId } },
      limit: 7,
      depth: 0,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getAllOpeningHours() {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'opening-hours',
      limit: 100,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export async function getAllStaff() {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'staff',
      limit: 100,
      sort: 'order',
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function getAllDocuments(category?: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const where = category ? { category: { equals: category } } : undefined
    const result = await payload.find({
      collection: 'documents',
      limit: 100,
      sort: '-year',
      where,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

// ─── Event Registrations (RSVP) ────────────────────────────────────────────────

export async function getRegistrationCountForEvent(eventId: string | number) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return 0
    const result = await payload.find({
      collection: 'registrations',
      where: { and: [{ event: { equals: eventId } }, { status: { equals: 'confirmed' } }] },
      limit: 1000,
      depth: 0,
    })
    return result.docs.reduce((sum, doc) => sum + (doc.guestCount ?? 1), 0)
  } catch {
    return 0
  }
}

// ─── Rooms & Bookings (teremfoglalás) ───────────────────────────────────────────

export async function getAllRooms() {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({ collection: 'rooms', limit: 50, depth: 1 })
    return result.docs
  } catch {
    return []
  }
}

export async function getRoomBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return null
    const result = await payload.find({
      collection: 'rooms',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getBookingsForRoomOnDate(roomId: string | number, date: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'bookings',
      where: {
        and: [
          { room: { equals: roomId } },
          { date: { equals: date } },
          { status: { not_equals: 'rejected' } },
        ],
      },
      limit: 100,
      depth: 0,
    })
    return result.docs
  } catch {
    return []
  }
}

// ─── Products (bolt) ────────────────────────────────────────────────────────────

export async function getAllProducts() {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'products',
      where: { stockStatus: { equals: 'available' } },
      limit: 100,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return null
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

// ─── Pages (generic block-based content) ───────────────────────────────────────

export async function getPageBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return null
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getAllPageSlugs() {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 0,
    })
    return result.docs.map((doc) => doc.slug)
  } catch {
    return []
  }
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function getAllServices() {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'services',
      limit: 50,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

// ─── Galleries ────────────────────────────────────────────────────────────────

export async function getAllGalleries(limit = 50) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'galleries',
      limit,
      sort: '-eventDate',
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getGalleryBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return null
    const result = await payload.find({
      collection: 'galleries',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

// ─── Partners ─────────────────────────────────────────────────────────────────

export async function getAllPartners(type?: 'partner' | 'supporter') {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const where = type ? { type: { equals: type } } : undefined
    const result = await payload.find({
      collection: 'partners',
      limit: 100,
      sort: 'order',
      where,
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
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
export function formatOpeningHours(docs: Array<Record<string, any>>) {
  if (!docs || docs.length === 0) return []
  return [...docs]
    .sort((a, b) => (DAY_ORDER[a.dayOfWeek] ?? 9) - (DAY_ORDER[b.dayOfWeek] ?? 9))
    .map((doc) => ({
      day: DAY_LABELS[doc.dayOfWeek] ?? doc.dayOfWeek,
      hours: doc.isClosed ? 'Zárva' : `${doc.openTime ?? '?'} - ${doc.closeTime ?? '?'}`,
      isToday: DAY_ORDER[doc.dayOfWeek] === (new Date().getDay() + 6) % 7,
    }))
}
