import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

// Bekapcsolja a Next.js Draft Mode-ot, majd a kért oldalra irányít.
// Ezt hívja meg a Payload admin "élő előnézet" (livePreview) és a
// dokumentum-fejléc "szem" gombja is (lásd payload.config.ts admin.livePreview
// és a News/Events/Pages collection-ök admin.livePreview/admin.preview).
//
// Csak bejelentkezett admin/editor tudja aktiválni — a Payload session
// cookie-ját ellenőrizzük ugyanazon a kéréshez tartozó fejléceken keresztül,
// amit a payload.auth() vár.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (!path || !path.startsWith('/')) {
    return new Response('Érvénytelen path paraméter.', { status: 400 })
  }

  const payload = await getPayloadClient()
  if (!payload) {
    return new Response('A CMS jelenleg nem érhető el.', { status: 503 })
  }

  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('A piszkozat-előnézethez bejelentkezés szükséges.', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
