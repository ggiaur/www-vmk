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
      {/* A valós vmk.hu banner a Bootstrap .container padding-ján belül van
          (15px mindkét oldalon), így 1440px viewport-on 1140px széles (1170-30),
          nem 1170px. Mérve: real.png x=150..1289. A px-[15px] ezt reprodukálja. */}
      <div className="max-w-[750px] min-[992px]:max-w-[970px] min-[1200px]:max-w-[1170px] mx-auto px-[15px]">
        {/* Bootstrap carousel wrapper: position:relative kell a carousel-control-okhoz */}
        <div style={{ position: 'relative' }}>
          <Image
            src="/brand/varosban-6-helyen-banner.png"
            alt={`A városban ${locations.length} helyen: ${locations.map((l) => l.name).join(', ')}`}
            width={1170}
            height={400}
            className="w-full h-auto"
            priority
          />
          {/* Bootstrap .carousel-control.left: bal oldali szürke gradiens overlay + nyíl
              Valós Bootstrap 3 CSS: width:15%, bal-jobb gradiens rgba(0,0,0,.5)→transparent,
              opacity:0.5, fehér szöveg középre igazítva */}
          <a
            href="#"
            aria-label="Előző"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '15%',
              opacity: 0.5,
              color: '#fff',
              textAlign: 'center',
              textShadow: '0 1px 2px rgba(0,0,0,.6)',
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,.5) 0%, rgba(0,0,0,.0001) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '30px', fontWeight: 700 }}>&#8249;</span>
          </a>
          {/* Bootstrap .carousel-control.right */}
          <a
            href="#"
            aria-label="Következő"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '15%',
              opacity: 0.5,
              color: '#fff',
              textAlign: 'center',
              textShadow: '0 1px 2px rgba(0,0,0,.6)',
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,.0001) 0%, rgba(0,0,0,.5) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '30px', fontWeight: 700 }}>&#8250;</span>
          </a>
        </div>
      </div>
    </div>
  )
}
