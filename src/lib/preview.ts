// Az admin "élő előnézet" (livePreview) és a dokumentum-fejléc "szem" gombja
// (admin.preview) is ezt hívja: a /api/draft route ellenőrzi, hogy a kérő
// be van-e jelentkezve, majd bekapcsolja a Next.js Draft Mode-ot és a
// tényleges frontend oldalra irányít. Enélkül a piszkozat sosem jelenne meg
// (lásd src/app/api/draft/route.ts).
export function buildPreviewUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'
  return `${base}/api/draft?path=${encodeURIComponent(path)}`
}
