'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient, createRegistrationAtomically, createBookingAtomically } from '@/lib/payload'

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

  try {
    const result = await createRegistrationAtomically(eventId, name, email, guestCount)
    if (!result.ok) {
      if (result.error === 'full') return { ok: false, error: 'Sajnáljuk, a rendezvény betelt.' }
      if (result.error === 'not_found') return { ok: false, error: 'A rendezvény nem található.' }
      return { ok: false, error: 'A rendszer jelenleg nem elérhető, próbálja később.' }
    }
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

  try {
    const result = await createBookingAtomically(roomId, date, startTime, endTime, requesterName, requesterEmail, purpose)
    if (!result.ok) {
      if (result.error === 'overlap') return { ok: false, error: 'A kiválasztott időpont már foglalt, kérjük válasszon másikat.' }
      if (result.error === 'not_found') return { ok: false, error: 'A terem nem található.' }
      return { ok: false, error: 'A rendszer jelenleg nem elérhető, próbálja később.' }
    }
    revalidatePath('/teremfoglalas')
    return { ok: true }
  } catch (error) {
    console.error('[submitBooking] Failed to save booking:', error)
    return { ok: false, error: 'Hiba történt a foglalás rögzítésekor.' }
  }
}

// A /kapcsolat űrlapja korábban egy action és onSubmit nélküli <form> volt,
// name attribútumok nélküli mezőkkel — minden beküldött üzenet nyomtalanul
// elveszett, miközben a látogató sikeresnek hitte a küldést.
const CONTACT_SUBJECTS = ['general', 'lending', 'event', 'room', 'local-history'] as const

export async function submitContactMessage(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const subjectRaw = String(formData.get('subject') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!name || !email || !message) {
    return { ok: false, error: 'Kérjük, töltse ki a nevet, az e-mail címet és az üzenetet.' }
  }

  // A tárgy a kliensről érkezik, tehát nem megbízható: ha nem a várt
  // értékkészletből való, a Payload select mezője elutasítaná a mentést, és
  // az üzenet — megint csak — elveszne. Ismeretlen érték esetén inkább a
  // biztonságos alapértelmezésre esünk vissza, mint hogy eldobjuk a levelet.
  const subject = (CONTACT_SUBJECTS as readonly string[]).includes(subjectRaw) ? subjectRaw : 'general'

  const payload = await getPayloadClient()
  if (!payload) return { ok: false, error: 'A rendszer jelenleg nem elérhető, próbálja később.' }

  try {
    await payload.create({
      collection: 'contact-messages',
      data: { name, email, subject, message, status: 'new' },
    })
    return { ok: true }
  } catch (error) {
    console.error('[submitContactMessage] Failed to save contact message:', error)
    return { ok: false, error: 'Hiba történt az üzenet elküldésekor.' }
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
