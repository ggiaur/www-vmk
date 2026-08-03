import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { scrapeGalleriesIntoPayload } from '@/lib/scraper/vmkGalleryScraper'

// Dev-only: imports real gallery albums (year -> library -> event, each with
// a real cover image) from the live https://www.vmk.hu/gallery folder tree.
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const maxYearFolders = Number(searchParams.get('years') ?? '2')
  const maxLibraryFoldersPerYear = Number(searchParams.get('libs') ?? '6')
  const maxGalleries = Number(searchParams.get('limit') ?? '30')

  const payload = await getPayloadClient()
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Payload not available' }, { status: 500 })
  }

  const result = await scrapeGalleriesIntoPayload(payload, {
    maxYearFolders,
    maxLibraryFoldersPerYear,
    maxGalleries,
  })
  return NextResponse.json({ ok: true, result })
}
