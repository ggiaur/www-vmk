import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const TILE_COLORS = ['#159097', '#8a5a3d', '#0f656a', '#e4b02c', '#1E293B', '#f16f30']

export interface HomeNewsTileProps {
  title: string
  summary: string
  publishedAt: string
  slug: string
  imageUrl?: string
  index: number
}

// A valós vmk.hu főoldali hír/esemény rácsa színes hátterű kártyákból áll
// (teal/barna/kék váltakozva), a kép felül, alatta színes sáv a címmel.
// Ez a komponens ezt a stílust követi, a jelenlegi (fehér kártyás,
// kategória-badge-es) NewsCard helyett a főoldalon.
export function HomeNewsTile({ title, summary, publishedAt, slug, imageUrl, index }: HomeNewsTileProps) {
  const color = TILE_COLORS[index % TILE_COLORS.length]
  const formattedDate = new Date(publishedAt).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/hirek/${slug}`}
      className="group block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="h-36 w-full relative bg-slate-200 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: color }}>
            <span className="text-white/40 text-4xl font-black">VMK</span>
          </div>
        )}
      </div>
      <div className="p-4 text-white" style={{ backgroundColor: color }}>
        <div className="text-[11px] font-semibold uppercase tracking-wide opacity-80 mb-1">
          {formattedDate}
        </div>
        <h3 className="font-bold text-sm leading-snug line-clamp-2">{title}</h3>
        <p className="text-xs opacity-85 mt-1 line-clamp-2">{summary}</p>
      </div>
    </Link>
  )
}
