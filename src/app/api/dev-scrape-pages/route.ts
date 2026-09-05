import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { scrapePagesIntoPayload } from '@/lib/scraper/vmkPageScraper'

// Dev-only: imports real content from explicit vmk.hu slugs into the local
// `pages` collection (the [...slug] catch-all's data source). See
// docs/FIRST_HOP_ROUTE_MATRIX.md for how the slug list was derived.
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const body = await request.json().catch(() => ({}))
  const slugs = Array.isArray(body.slugs) ? (body.slugs as string[]) : []
  if (!slugs.length) {
    return NextResponse.json({ ok: false, error: 'Provide { "slugs": ["..."] }' }, { status: 400 })
  }

  const payload = await getPayloadClient()
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Payload not available' }, { status: 500 })
  }

  const result = await scrapePagesIntoPayload(payload, { slugs })
  return NextResponse.json({ ok: true, result })
}
