import { NextResponse } from 'next/server'
import { seedRuntimeData } from '../../../../scripts/seed'

// Dev-only convenience endpoint: `payload generate:types` / standalone tsx scripts
// hit a Node 24 + tsx CJS-register ESM interop bug in this environment
// (ERR_REQUIRE_ASYNC_MODULE / Cannot destructure loadEnvConfig), but Payload's
// Local API works fine inside the running Next.js dev process — so we seed through
// a route handler instead. Not reachable outside development.
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }
  try {
    await seedRuntimeData()
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
