import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { backfillStaffSlugs } from '@/lib/scraper/vmkStaffScraper'

// Dev-only: backfills Staff.slug from /munkatarsak's real hrefs (E1 depth-2
// audit root-cause fix -- see vmkStaffScraper.ts).
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const payload = await getPayloadClient()
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Payload not available' }, { status: 500 })
  }

  const result = await backfillStaffSlugs(payload)
  return NextResponse.json({ ok: true, result })
}
