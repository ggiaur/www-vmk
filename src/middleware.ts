import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Runs on the Edge runtime (Next.js middleware default) — it cannot import
// Payload/Postgres directly, so it calls /api/news-slug-lookup (a normal
// Node.js-runtime route handler) instead. See that route for the actual
// Payload query.
//
// Legacy www.vmk.hu served news articles at the site root (e.g.
// /202605_szena_ter_kolcsonozheto_diavetitok), while the new site nests
// them under /hirek/<slug>. Rather than hardcode a redirect entry per
// article in next.config.ts (500+ and growing as the migration scraper
// imports more), this checks whether an unmatched single-segment path
// matches a News document's slug and 301-redirects to /hirek/<slug> if so.
// Falls through (NextResponse.next()) for everything else, including
// genuinely-missing paths — the [...slug] catch-all route still handles
// the final 404.
const RESERVED_FIRST_SEGMENTS = new Set([
  'hirek',
  'esemenyek',
  'nyitvatartas',
  'reszlegek',
  'tagkonyvtarak',
  'galeria',
  'programarchivum',
  'dokumentumok',
  'munkatarsak',
  'kapcsolat',
  'szolgaltatasok',
  'teremfoglalas',
  'tamogatas',
  'bolt',
  'elerhetosegeink',
  'rolunk',
  'hasznalat',
  'admin',
  'api',
  '_next',
  'favicon.ico',
  'assets',
  'sitemap.xml',
  'robots.txt',
])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length !== 1) return NextResponse.next()
  const [slug] = segments
  if (RESERVED_FIRST_SEGMENTS.has(slug)) return NextResponse.next()

  try {
    const lookupUrl = new URL(`/api/news-slug-lookup?slug=${encodeURIComponent(slug)}`, request.url)
    const res = await fetch(lookupUrl)
    if (res.ok) {
      const { exists } = (await res.json()) as { exists: boolean }
      if (exists) {
        return NextResponse.redirect(new URL(`/hirek/${slug}`, request.url), 301)
      }
    }
  } catch {
    // Lookup unavailable — fall through, don't block the request.
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
