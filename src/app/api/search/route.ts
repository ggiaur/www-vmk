import { NextResponse } from 'next/server'
import { meiliClient, INDEXES } from '@/lib/meilisearch'

// Server-side search endpoint — keeps the Meilisearch master key off the
// client (meiliClient is configured with it; a browser-side search widget
// would need a separate, scoped search-only key, which isn't set up here).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q) {
    return NextResponse.json({ news: [], events: [] })
  }

  try {
    const [newsResult, eventsResult] = await Promise.all([
      meiliClient.index(INDEXES.NEWS).search(q, { limit: 10 }),
      meiliClient.index(INDEXES.EVENTS).search(q, { limit: 10 }),
    ])
    return NextResponse.json({
      news: newsResult.hits,
      events: eventsResult.hits,
    })
  } catch (error) {
    console.warn('[Search API] Meilisearch query failed:', error)
    return NextResponse.json({ news: [], events: [], error: 'A keresés jelenleg nem elérhető.' }, { status: 503 })
  }
}
