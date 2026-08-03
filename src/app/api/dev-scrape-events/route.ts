import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { scrapeEventsIntoPayload } from '@/lib/scraper/vmkEventsScraper'

// Dev-only: imports real upcoming events from the live vmk.hu /events
// listing (real title, date, location, description, image).
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const pageCount = Number(searchParams.get('pages') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')

  const payload = await getPayloadClient()
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Payload not available' }, { status: 500 })
  }

  const result = await scrapeEventsIntoPayload(payload, { pageCount, limit })
  return NextResponse.json({ ok: true, result })
}
