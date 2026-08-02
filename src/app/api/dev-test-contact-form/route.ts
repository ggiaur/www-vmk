import { NextResponse } from 'next/server'
import { submitContactMessage } from '@/app/actions'
import { getPayloadClient } from '@/lib/payload'

// Fejlesztői ellenőrző végpont a /kapcsolat űrlap javításához.
//
// Miért API route és nem sima vitest teszt: a submitContactMessage a Payload
// Local API-t használja, ami a projekt jelenlegi Node-verzióján önálló
// szkriptből ERR_REQUIRE_ASYNC_MODULE hibával elszáll. A már futó dev-szerver
// folyamatán belülről viszont hibátlanul működik — ezt a mintát használja a
// dev-test-race-condition útvonal is.
//
// Éles környezetben nem elérhető (lásd a NODE_ENV ellenőrzést).
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const marker = `__CONTACT_TEST_${Date.now()}__`
  const results: Record<string, unknown> = {}

  try {
    // 1) Érvényes beküldés — el kell jutnia az adatbázisig
    const validForm = new FormData()
    validForm.set('name', marker)
    validForm.set('email', 'teszt@example.com')
    validForm.set('subject', 'room')
    validForm.set('message', 'Automata ellenőrzés: a kapcsolati űrlap tényleg ment-e.')
    results.validSubmit = await submitContactMessage(validForm)

    // 2) Hiányzó kötelező mező — elutasításnak kell lennie, nem néma elnyelésnek
    const emptyForm = new FormData()
    emptyForm.set('name', '')
    emptyForm.set('email', '')
    emptyForm.set('message', '')
    results.emptyRejected = await submitContactMessage(emptyForm)

    // 3) Ismeretlen tárgy-érték — NEM veszhet el az üzenet, 'general'-re esik vissza
    const badSubjectForm = new FormData()
    badSubjectForm.set('name', `${marker}_BADSUBJ`)
    badSubjectForm.set('email', 'teszt2@example.com')
    badSubjectForm.set('subject', 'ez-nem-letezo-ertek')
    badSubjectForm.set('message', 'Ismeretlen tárgy-érték kezelése.')
    results.badSubjectSubmit = await submitContactMessage(badSubjectForm)

    // Visszaolvasás az adatbázisból: tényleg ott van-e, amit beküldtünk?
    const payload = await getPayloadClient()
    if (!payload) {
      return NextResponse.json({ error: 'Payload client unavailable' }, { status: 500 })
    }

    const found = await payload.find({
      collection: 'contact-messages',
      where: { name: { like: marker } },
      limit: 10,
    })

    results.persistedCount = found.totalDocs
    results.persisted = found.docs.map((d: Record<string, unknown>) => ({
      name: d.name,
      email: d.email,
      subject: d.subject,
      status: d.status,
    }))

    // Takarítás: a teszt-rekordok ne maradjanak az éles adatok között
    for (const doc of found.docs) {
      await payload.delete({ collection: 'contact-messages', id: (doc as { id: string }).id })
    }
    results.cleanedUp = found.docs.length

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      { error: String(error), partialResults: results },
      { status: 500 },
    )
  }
}
