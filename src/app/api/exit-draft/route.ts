import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

// A DraftModeBanner "Kilépés az előnézetből" linkje hívja: kikapcsolja a
// Next.js Draft Mode-ot, majd visszairányít az aktuális oldalra (a
// /api/draft route párja, lásd ott).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  const draft = await draftMode()
  draft.disable()
  redirect(path && path.startsWith('/') ? path : '/')
}
