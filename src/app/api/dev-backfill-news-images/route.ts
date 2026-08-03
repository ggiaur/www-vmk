import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { backfillMissingNewsImages } from '@/lib/scraper/vmkScraper'

// Dev-only: for News records that already exist in the local DB but have no
// featuredImage, re-fetches their real article page from vmk.hu and
// attaches the real image. Does not create new records. See
// docs/SCRAPE_URL_INVENTORY.md for the source site's URL structure.
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') ?? '20')

  const payload = await getPayloadClient()
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Payload not available' }, { status: 500 })
  }

  const result = await backfillMissingNewsImages(payload, { limit })
  return NextResponse.json({ ok: true, result })
}
