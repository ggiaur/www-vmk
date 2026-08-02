import { NextResponse } from 'next/server'
import { getPayloadClient, createRegistrationAtomically, createBookingAtomically } from '@/lib/payload'

// Dev-only: fires genuinely concurrent createRegistrationAtomically() /
// createBookingAtomically() calls against a throwaway capacity=1 event /
// single-slot room to verify the FOR UPDATE row lock actually serializes
// them, instead of trusting that the code merely compiles. Creates its own
// disposable test library/event/room and deletes them (and any
// registrations/bookings created during the run) afterward either way.
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const payload = await getPayloadClient()
  if (!payload) return NextResponse.json({ ok: false, error: 'Payload not available' }, { status: 500 })

  const results: Record<string, unknown> = {}
  const suffix = Date.now()

  const testLibrary = await payload.create({
    collection: 'libraries',
    data: { name: '__RACE_TEST_LIBRARY__', slug: `race-test-lib-${suffix}`, type: 'branch', address: 'Test address 1.' },
  })

  // --- RSVP race test: capacity=1, 10 concurrent guestCount=1 attempts ---
  const minimalRichText = {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Race test', version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }

  const testEvent = await payload.create({
    collection: 'events',
    data: {
      title: '__RACE_TEST_EVENT__',
      slug: `race-test-event-${suffix}`,
      startDate: new Date().toISOString(),
      location: testLibrary.id,
      description: minimalRichText,
      capacity: 1,
      _status: 'published',
    },
  })

  try {
    const attempts = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        createRegistrationAtomically(testEvent.id, `Test User ${i}`, `test${i}@example.com`, 1),
      ),
    )
    const succeeded = attempts.filter((a) => a.ok).length
    const fullCount = attempts.filter((a) => !a.ok && a.error === 'full').length
    results.rsvp = { succeeded, fullCount, totalAttempts: attempts.length, passed: succeeded === 1 && fullCount === 9 }
  } finally {
    await payload.delete({ collection: 'registrations', where: { event: { equals: testEvent.id } } })
    await payload.delete({ collection: 'events', id: testEvent.id })
  }

  // --- Booking race test: same room+date+time, 10 concurrent attempts ---
  const testRoom = await payload.create({
    collection: 'rooms',
    data: { name: '__RACE_TEST_ROOM__', slug: `race-test-room-${suffix}`, library: testLibrary.id, capacity: 4 },
  })

  try {
    const date = new Date().toISOString().slice(0, 10)
    const attempts = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        createBookingAtomically(testRoom.id, date, '10:00', '11:00', `Test User ${i}`, `test${i}@example.com`, 'race test'),
      ),
    )
    const succeeded = attempts.filter((a) => a.ok).length
    const overlapCount = attempts.filter((a) => !a.ok && a.error === 'overlap').length
    results.booking = { succeeded, overlapCount, totalAttempts: attempts.length, passed: succeeded === 1 && overlapCount === 9 }
  } finally {
    await payload.delete({ collection: 'bookings', where: { room: { equals: testRoom.id } } })
    await payload.delete({ collection: 'rooms', id: testRoom.id })
    await payload.delete({ collection: 'libraries', id: testLibrary.id })
  }

  return NextResponse.json({ ok: true, results })
}
