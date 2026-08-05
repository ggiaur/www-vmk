import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

// real.png pixel-mintavétel (2026-08-04, x=550 oszlop-szken a "Tájékoztatás"
// kártyán): a címsáv EGYSÉGESEN #159097 (a legtöbb kártyán, típus="type1"),
// a leírás-terület EGYSÉGESEN #1BBBC4, a szöveg ott FEKETE (nem szürke), és
// jobb alul egy fehér ">" nyíl-ikon van. A korábbi 6-elemű TILE_COLORS
// forgó paletta és a szürke leírás-háttér NEM létezik a valós oldalon - azt
// tévesen találtuk ki. (Ritka kivétel: pl. "Spiró 80" class="type5", más
// színű - ezt egyelőre nem különböztetjük meg, mert a CMS-migráció nem
// hozza át a hír-kategória-típust.)
const TITLE_BG = '#159097'
const CONTENT_BG = '#1BBBC4'

export interface HomeNewsTileProps {
  title: string
  summary: string
  publishedAt: string
  slug: string
  imageUrl?: string
  index: number
}

export function HomeNewsTile({ title, summary, slug, imageUrl }: HomeNewsTileProps) {
  return (
    <Link href={`/hirek/${slug}`} className="group flex flex-col h-full min-h-[440px]">
      {/* Képmagasság: h-[160px] — mérve a valós vmk.hu-n (real.png, kártya
          teteje y=1133, címsáv kezdete y=1293). */}
      <div className="w-full relative bg-slate-200 overflow-hidden shrink-0" style={{ aspectRatio: '720/465' }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: TITLE_BG }}>
            <span className="text-white/40 text-4xl font-black">VMK</span>
          </div>
        )}
      </div>
      <div className="p-[15px] text-white font-bold text-[20px] leading-[22px] shrink-0" style={{ backgroundColor: TITLE_BG }}>
        <h3 className="font-bold text-[20px] leading-[22px] text-white" style={{ fontFamily: 'Roboto, sans-serif' }}>{title}</h3>
      </div>
      <div
        className="relative p-[15px] pb-[30px] flex-1 text-black font-normal text-[15px] leading-[20px]"
        style={{ backgroundColor: CONTENT_BG, fontFamily: 'Roboto, sans-serif' }}
      >
        <p className="text-[15px] leading-[20px] font-normal text-black line-clamp-6">{summary}</p>
        <ChevronRight className="w-6 h-6 text-white absolute bottom-0 right-[15px]" strokeWidth={3} />
      </div>
    </Link>
  )
}
