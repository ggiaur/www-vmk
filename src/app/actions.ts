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

export async function submitWishRequest(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '').trim()
  const shownName = String(formData.get('shownName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const libraryCard = String(formData.get('libraryCard') ?? '').trim()
  const writer = String(formData.get('writer') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const comment = String(formData.get('comment') ?? '').trim()

  if (!name || !email || !libraryCard || !writer || !title) {
    return { ok: false, error: 'Kérjük, töltse ki a kötelező mezőket (Név, E-mail, Olvasójegy száma, Szerző, Cím).' }
  }

  const payload = await getPayloadClient()
  if (!payload) return { ok: false, error: 'A rendszer jelenleg nem elérhető, próbálja később.' }

  try {
    await payload.create({
      collection: 'wish-requests',
      data: {
        name,
        shownName: shownName || undefined,
        email,
        libraryCard,
        writer,
        title,
        comment: comment || undefined,
        status: 'pending',
      },
    })
    revalidatePath('/wishbasket')
    return { ok: true }
  } catch (error) {
    console.error('[submitWishRequest] Failed to save wish request:', error)
    return { ok: false, error: 'Hiba történt a kívánság rögzítésekor.' }
  }
}

export async function submitWishComment(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '').trim()
  const shownName = String(formData.get('shownName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const comment = String(formData.get('comment') ?? '').trim()

  if (!name || !email || !comment) {
    return { ok: false, error: 'Kérjük, töltse ki a nevet, az e-mail címet és a hozzászólást.' }
  }

  const payload = await getPayloadClient()
  if (!payload) return { ok: false, error: 'A rendszer jelenleg nem elérhető, próbálja később.' }

  try {
    await payload.create({
      collection: 'wish-comments',
      data: { name, shownName: shownName || undefined, email, comment, status: 'pending' },
    })
    revalidatePath('/wishbasket')
    return { ok: true }
  } catch (error) {
    console.error('[submitWishComment] Failed to save wish comment:', error)
    return { ok: false, error: 'Hiba történt a hozzászólás rögzítésekor.' }
  }
}

export async function submitNewsletterSignup(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get('email') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()

  if (!email) {
    return { ok: false, error: 'Kérjük, adja meg az e-mail címét.' }
  }

  const payload = await getPayloadClient()
  if (!payload) return { ok: false, error: 'A rendszer jelenleg nem elérhető, próbálja később.' }

  try {
    await payload.create({
      collection: 'newsletter-subscribers',
      data: { email, name },
    })
    return { ok: true }
  } catch (error) {
    // A unique constraint (már feliratkozott e-mail) NE hibaként jelenjen
    // meg a felhasználónak - a végeredmény ugyanaz (fel van iratkozva).
    //
    // Payload ezt magyarul lokalizált ValidationError-ként dobja ("A
    // következő mező érvénytelen: email"), tehát angol "unique"/"duplicate"
    // szóra illesztés SOHA nem talált volna - a strukturált error.data.errors
    // tömböt kell ellenőrizni, ami a hibás mező path-ját tartalmazza.
    const validationErrors = (error as { data?: { errors?: Array<{ path?: string }> } })?.data?.errors
    const isEmailFieldError = Array.isArray(validationErrors) && validationErrors.some((e) => e.path === 'email')
    if (isEmailFieldError) {
      return { ok: true }
    }
    console.error('[submitNewsletterSignup] Failed to save subscriber:', error)
    return { ok: false, error: 'Hiba történt a feliratkozás során.' }
  }
}
