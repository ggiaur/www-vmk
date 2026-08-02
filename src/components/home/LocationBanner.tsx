import React from 'react'
import Link from 'next/link'

const BAR_COLORS = ['#159097', '#8a9a3a', '#0f656a', '#5b8fa8', '#8a5a3d', '#159097']

export interface LocationBannerItem {
  name: string
  slug: string
  type: 'central' | 'branch'
}

// A valós vmk.hu főoldalán közvetlenül a fejléc alatt egy "A VÁROSBAN N
// HELYEN" sáv áll (világosszürke háttér, nem fekete - Playwright
// screenshottal ellenőrizve a valós oldalhoz képest), alatta a könyvtári
// helyszínek felsorolásával, soronként eltérő háttérszínnel. Ez a
// komponens valós Libraries adatból építi fel - ha nincs elég betöltött
// könyvtár, nem generál kitalált helyszíneket, csak a ténylegesen kapott
// listát jeleníti meg.
export function LocationBanner({ locations }: { locations: LocationBannerItem[] }) {
  if (locations.length === 0) return null

  return (
    <div className="bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-2 text-slate-700 font-bold text-sm uppercase tracking-wide">
          A városban {locations.length} helyen
        </div>
        <div className="flex flex-col">
          {locations.map((loc, i) => (
            <Link
              key={loc.slug}
              // A Központi Könyvtárnak nincs önálló /tagkonyvtarak/[slug]
              // oldala (az a route csak 'branch' típust fogad el) -
              // a nyitvatartás oldalra visz, ami a központi adatait is
              // tartalmazza.
              href={loc.type === 'central' ? '/nyitvatartas' : `/tagkonyvtarak/${loc.slug}`}
              className="px-4 py-2 text-white text-sm font-semibold hover:brightness-110 transition-all uppercase tracking-wide"
              style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
            >
              {loc.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
