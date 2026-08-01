'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient, getRegistrationCountForEvent, getBookingsForRoomOnDate } from '@/lib/payload'

export type ActionResult = { ok: true } | { ok: false; error: string }

export async function submitRsvp(formData: FormData): Promise<ActionResult> {
  const eventId = String(formData.get('eventId') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const guestCount = Number(formData.get('guestCount') ?? 1)
  const eventSlug = String(formData.get('eventSlug') ?? '')

  if (!eventId || !name || !email) {
    return { ok: false, error: 'Kérjük, töltse ki a nevet és az e-mail címet.' }
  }

  const payload = await getPayloadClient()
  if (!payload) return { ok: false, error: 'A rendszer jelenleg nem elérhető, próbálja később.' }

  try {
    const event = await payload.findByID({ collection: 'events', id: eventId })
    if (event.capacity) {
      const currentCount = await getRegistrationCountForEvent(eventId)
      if (currentCount + guestCount > event.capacity) {
        return { ok: false, error: 'Sajnáljuk, a rendezvény betelt.' }
      }
    }

    await payload.create({
      collection: 'registrations',
      data: { event: eventId, name, email, guestCount, status: 'confirmed' },
    })
    revalidatePath(`/esemenyek/${eventSlug}`)
    return { ok: true }
  } catch (error) {
    console.error('[submitRsvp] Failed to save registration:', error)
    return { ok: false, error: 'Hiba történt a jelentkezés rögzítésekor.' }
  }
}

export async function submitBooking(formData: FormData): Promise<ActionResult> {
  const roomId = String(formData.get('roomId') ?? '')
  const date = String(formData.get('date') ?? '')
  const startTime = String(formData.get('startTime') ?? '')
  const endTime = String(formData.get('endTime') ?? '')
  const requesterName = String(formData.get('requesterName') ?? '').trim()
  const requesterEmail = String(formData.get('requesterEmail') ?? '').trim()
  const purpose = String(formData.get('purpose') ?? '').trim()

  if (!roomId || !date || !startTime || !endTime || !requesterName || !requesterEmail) {
    return { ok: false, error: 'Kérjük, töltsön ki minden kötelező mezőt.' }
  }

  const payload = await getPayloadClient()
  if (!payload) return { ok: false, error: 'A rendszer jelenleg nem elérhető, próbálja később.' }

  try {
    const existing = await getBookingsForRoomOnDate(roomId, date)
    const overlaps = existing.some(
      (b) => startTime < (b.endTime as string) && endTime > (b.startTime as string),
    )
    if (overlaps) {
      return { ok: false, error: 'A kiválasztott időpont már foglalt, kérjük válasszon másikat.' }
    }

    await payload.create({
      collection: 'bookings',
      data: { room: roomId, date, startTime, endTime, requesterName, requesterEmail, purpose, status: 'pending' },
    })
    revalidatePath('/teremfoglalas')
    return { ok: true }
  } catch (error) {
    console.error('[submitBooking] Failed to save booking:', error)
    return { ok: false, error: 'Hiba történt a foglalás rögzítésekor.' }
  }
}

export async function submitDonationPledge(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const amountRaw = formData.get('amount')
  const amount = amountRaw ? Number(amountRaw) : undefined
  const message = String(formData.get('message') ?? '').trim()

  if (!name || !email) {
    return { ok: false, error: 'Kérjük, töltse ki a nevet és az e-mail címet.' }
  }

  const payload = await getPayloadClient()
  if (!payload) return { ok: false, error: 'A rendszer jelenleg nem elérhető, próbálja később.' }

  try {
    await payload.create({
      collection: 'donation-pledges',
      data: { name, email, amount, message, status: 'new' },
    })
    return { ok: true }
  } catch (error) {
    console.error('[submitDonationPledge] Failed to save donation pledge:', error)
    return { ok: false, error: 'Hiba történt a felajánlás rögzítésekor.' }
  }
}
