import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { scrapeStaffIntoPayload } from '@/lib/scraper/vmkStaffScraper'

// Dev-only: imports real staff directory data from the live
// https://www.vmk.hu/munkatarsak into the local `staff` collection.
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const payload = await getPayloadClient()
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Payload not available' }, { status: 500 })
  }

  const result = await scrapeStaffIntoPayload(payload)
  return NextResponse.json({ ok: true, result })
}
