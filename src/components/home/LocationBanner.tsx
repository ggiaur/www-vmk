import React from 'react'
import Image from 'next/image'

export interface LocationBannerItem {
  name: string
  slug: string
  type: 'central' | 'branch'
}

// A valós vmk.hu főoldalán közvetlenül a fejléc alatt egy statikus banner-kép
// áll ("A VÁROSBAN 6 HELYEN", a hat könyvtári helyszín nevével, egy
// egy-diás Bootstrap carousel egyetlen elemeként - a valós oldal nyers
// HTML-jéből ellenőrizve: <a href="">, tehát nem kattintható, pusztán
// dekoratív elem). Ez a komponens a valós, letöltött banner-képet
// jeleníti meg 1:1, ahelyett hogy szín-sávokkal próbálná utánozni.
export function LocationBanner({ locations }: { locations: LocationBannerItem[] }) {
  if (locations.length === 0) return null

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-[1170px] mx-auto">
        <Image
          src="/brand/varosban-6-helyen-banner.png"
          alt={`A városban ${locations.length} helyen: ${locations.map((l) => l.name).join(', ')}`}
          width={1170}
          height={400}
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  )
}
