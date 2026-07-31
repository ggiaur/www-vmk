import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { scrapeNewsIntoPayload } from '@/lib/scraper/vmkScraper'

// Dev-only: imports real content from the live https://www.vmk.hu/ into the
// local `news` collection. See docs/SCRAPE_URL_INVENTORY.md for the source
// site's URL structure this was built against.
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const pageCount = Number(searchParams.get('pages') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '5')

  const payload = await getPayloadClient()
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Payload not available' }, { status: 500 })
  }

  const result = await scrapeNewsIntoPayload(payload, { pageCount, limit })
  return NextResponse.json({ ok: true, result })
}
