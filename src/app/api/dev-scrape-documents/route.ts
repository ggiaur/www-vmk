import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { scrapeDocumentsIntoPayload } from '@/lib/scraper/vmkDocumentsScraper'

// Dev-only: imports real PDF documents from the live
// https://www.vmk.hu/alapdokumentumok into the local `documents` collection.
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const payload = await getPayloadClient()
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Payload not available' }, { status: 500 })
  }

  const result = await scrapeDocumentsIntoPayload(payload)
  return NextResponse.json({ ok: true, result })
}
