import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

// Runs in the Node.js runtime (the default for route handlers), so it can
// use Payload's Local API / Postgres driver — unlike middleware.ts, which
// runs on the Edge runtime and calls this route over HTTP instead of
// importing Payload directly. See src/middleware.ts for why.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ exists: false })

  const payload = await getPayloadClient()
  if (!payload) return NextResponse.json({ exists: false })

  try {
    const result = await payload.find({
      collection: 'news',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      depth: 0,
    })
    return NextResponse.json({ exists: result.docs.length > 0 })
  } catch {
    return NextResponse.json({ exists: false })
  }
}
