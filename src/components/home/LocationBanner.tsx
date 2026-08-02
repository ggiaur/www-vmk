import React from 'react'
import Link from 'next/link'

const BAR_COLORS = ['#159097', '#e4b02c', '#0f656a', '#f16f30', '#1E293B', '#159097']

export interface LocationBannerItem {
  name: string
  slug: string
}

// A valós vmk.hu főoldalán közvetlenül a fejléc alatt egy "A VÁROSBAN N
// HELYEN" sáv áll, alatta a könyvtári helyszínek felsorolásával, soronként
// eltérő háttérszínnel. Ez a komponens valós Libraries adatból építi fel -
// ha nincs elég betöltött könyvtár, nem generál kitalált helyszíneket,
// csak a ténylegesen kapott listát jeleníti meg.
export function LocationBanner({ locations }: { locations: LocationBannerItem[] }) {
  if (locations.length === 0) return null

  return (
    <div className="bg-[#1B1B1B]">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-2 text-white font-bold text-sm uppercase tracking-wide">
          A városban {locations.length} helyen
        </div>
        <div className="flex flex-col">
          {locations.map((loc, i) => (
            <Link
              key={loc.slug}
              href={`/tagkonyvtarak/${loc.slug}`}
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
