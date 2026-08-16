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
import type { Pool } from 'pg'

// Payload's generated types (payload-types.ts) can't be produced in this
// environment (`payload generate:types` fails on Node 24 with
// ERR_REQUIRE_ASYNC_MODULE, an upstream ESM/CJS interop bug), so
// collection docs come back as the generic JsonObject fallback type.
// This mirrors the OpeningHours collection schema (src/collections/OpeningHours.ts)
// exactly, so it's safe to assert onto payload.find()'s result there.
type OpeningHoursDoc = {
  dayOfWeek: string
  isClosed?: boolean | null
  openTime?: string | null
  closeTime?: string | null
}

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

export async function getUpcomingEvents(limit = 4, sortDirection: 'asc' | 'desc' = 'asc') {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'events',
      limit,
      sort: sortDirection === 'desc' ? '-startDate' : 'startDate',
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
    return result.docs as unknown as OpeningHoursDoc[]
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
    return result.docs as unknown as (OpeningHoursDoc & {
      library: string | number | { id: string | number }
    })[]
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
      limit: 250,
      sort: 'order,name',
      depth: 1,
    })
    return result.docs
  } catch {
    return []
  }
}

export async function getStaffBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    if (!payload) return null
    const result = await payload.find({
      collection: 'staff',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
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

export type CreateRegistrationResult =
  | { ok: true }
  | { ok: false; error: 'full' | 'not_found' | 'db_error' }

/**
 * Atomically checks capacity and inserts a registration inside a single
 * Postgres transaction, row-locking the event first (`SELECT ... FOR
 * UPDATE`). Without this, submitRsvp()'s previous check-then-create
 * (getRegistrationCountForEvent, then payload.create separately) had a
 * genuine TOCTOU race: two concurrent submissions for the last spot could
 * both pass the capacity check before either had committed, silently
 * overbooking a capacity-limited event with no human review step to catch
 * it (registrations default straight to status: 'confirmed').
 *
 * Uses payload.db.pool directly (the raw `pg.Pool` the Postgres adapter is
 * built on) rather than the Local API for the locked section, since
 * payload.create() has no way to run inside an explicit FOR UPDATE lock.
 */
export async function createRegistrationAtomically(
  eventId: string | number,
  name: string,
  email: string,
  guestCount: number,
): Promise<CreateRegistrationResult> {
  const payload = await getPayloadClient()
  if (!payload) return { ok: false, error: 'db_error' }

  const pool = (payload.db as unknown as { pool: Pool }).pool
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const eventRes = await client.query('SELECT id, capacity FROM events WHERE id = $1 FOR UPDATE', [eventId])
    if (eventRes.rowCount === 0) {
      await client.query('ROLLBACK')
      return { ok: false, error: 'not_found' }
    }

    const capacity = eventRes.rows[0].capacity as string | null
    if (capacity !== null) {
      const countRes = await client.query(
        "SELECT COALESCE(SUM(guest_count), 0) AS total FROM registrations WHERE event_id = $1 AND status = 'confirmed'",
        [eventId],
      )
      const currentCount = Number(countRes.rows[0].total)
      if (currentCount + guestCount > Number(capacity)) {
        await client.query('ROLLBACK')
        return { ok: false, error: 'full' }
      }
    }

    await client.query(
      `INSERT INTO registrations (event_id, name, email, guest_count, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'confirmed', now(), now())`,
      [eventId, name, email, guestCount],
    )
    await client.query('COMMIT')
    return { ok: true }
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[createRegistrationAtomically] transaction failed:', err)
    return { ok: false, error: 'db_error' }
  } finally {
    client.release()
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

export type CreateBookingResult =
  | { ok: true }
  | { ok: false; error: 'overlap' | 'not_found' | 'db_error' }

/**
 * Atomically checks for an overlapping booking and inserts the new one
 * inside a single Postgres transaction, row-locking the room first
 * (`SELECT ... FOR UPDATE`). Same TOCTOU race as
 * createRegistrationAtomically() (see its comment) - submitBooking()'s
 * previous check-then-create had a window where two concurrent requests
 * for the same overlapping slot could both pass the overlap check. Lower
 * real-world severity here since bookings default to status: 'pending'
 * (a human reviews before confirming), but worth closing for real, not
 * just relying on that review step to catch it.
 */
export async function createBookingAtomically(
  roomId: string | number,
  date: string,
  startTime: string,
  endTime: string,
  requesterName: string,
  requesterEmail: string,
  purpose: string,
): Promise<CreateBookingResult> {
  const payload = await getPayloadClient()
  if (!payload) return { ok: false, error: 'db_error' }

  const pool = (payload.db as unknown as { pool: Pool }).pool
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const roomRes = await client.query('SELECT id FROM rooms WHERE id = $1 FOR UPDATE', [roomId])
    if (roomRes.rowCount === 0) {
      await client.query('ROLLBACK')
      return { ok: false, error: 'not_found' }
    }

    const overlapRes = await client.query(
      `SELECT id FROM bookings
       WHERE room_id = $1 AND date = $2 AND status != 'rejected'
         AND start_time < $4 AND end_time > $3`,
      [roomId, date, startTime, endTime],
    )
    if ((overlapRes.rowCount ?? 0) > 0) {
      await client.query('ROLLBACK')
      return { ok: false, error: 'overlap' }
    }

    await client.query(
      `INSERT INTO bookings (room_id, date, start_time, end_time, requester_name, requester_email, purpose, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', now(), now())`,
      [roomId, date, startTime, endTime, requesterName, requesterEmail, purpose || null],
    )
    await client.query('COMMIT')
    return { ok: true }
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[createBookingAtomically] transaction failed:', err)
    return { ok: false, error: 'db_error' }
  } finally {
    client.release()
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
export function formatOpeningHours(docs: OpeningHoursDoc[]) {
  if (!docs || docs.length === 0) return []
  return [...docs]
    .sort((a, b) => (DAY_ORDER[a.dayOfWeek] ?? 9) - (DAY_ORDER[b.dayOfWeek] ?? 9))
    .map((doc) => ({
      day: DAY_LABELS[doc.dayOfWeek] ?? doc.dayOfWeek,
      hours: doc.isClosed ? 'Zárva' : `${doc.openTime ?? '?'} - ${doc.closeTime ?? '?'}`,
      isToday: DAY_ORDER[doc.dayOfWeek] === (new Date().getDay() + 6) % 7,
    }))
}

// ─── Wishbasket (/wishbasket) ───────────────────────────────────────────────

export type PublicWish = {
  id: string | number
  shownName: string | null
  writer: string
  title: string
  adminNote: string | null
  createdAt: string
}

/**
 * Only ever selects public-safe fields (shownName/writer/title/adminNote),
 * never name/email/libraryCard/comment -- defense in depth on top of the
 * collection's own field-level access control (WishRequests.ts), so a bug
 * in that access config can't leak PII through this call site.
 */
export async function getApprovedWishes(limit = 30): Promise<PublicWish[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'wish-requests',
      where: { status: { equals: 'approved' } },
      select: { shownName: true, writer: true, title: true, adminNote: true, createdAt: true },
      sort: '-createdAt',
      limit,
      depth: 0,
    })
    return result.docs.map((doc) => ({
      id: doc.id,
      shownName: (doc as Record<string, unknown>).shownName as string | null,
      writer: (doc as Record<string, unknown>).writer as string,
      title: (doc as Record<string, unknown>).title as string,
      adminNote: (doc as Record<string, unknown>).adminNote as string | null,
      createdAt: (doc as Record<string, unknown>).createdAt as string,
    }))
  } catch {
    return []
  }
}

export type PublicWishComment = {
  id: string | number
  shownName: string | null
  comment: string
  createdAt: string
}

export async function getApprovedWishComments(limit = 30): Promise<PublicWishComment[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) return []
    const result = await payload.find({
      collection: 'wish-comments',
      where: { status: { equals: 'approved' } },
      select: { shownName: true, comment: true, createdAt: true },
      sort: '-createdAt',
      limit,
      depth: 0,
    })
    return result.docs.map((doc) => ({
      id: doc.id,
      shownName: (doc as Record<string, unknown>).shownName as string | null,
      comment: (doc as Record<string, unknown>).comment as string,
      createdAt: (doc as Record<string, unknown>).createdAt as string,
    }))
  } catch {
    return []
  }
}
