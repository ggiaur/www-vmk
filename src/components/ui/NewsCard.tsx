import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

export interface NewsCardProps {
  title: string
  summary: string
  category: 'general' | 'announcement' | 'grant' | string
  publishedAt: string
  slug: string
  imageUrl?: string
}

const TITLE_BG = '#137F85'
const CONTENT_BG = '#1BBBC4'

const categoryLabels: Record<string, string> = {
  general: 'Friss Hír',
  announcement: 'Közlemény',
  grant: 'Pályázat',
  archive: 'Archívum',
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  summary,
  category,
  publishedAt,
  slug,
  imageUrl,
}) => {
  const catLabel = categoryLabels[category] || 'Hír'
  const formattedDate = new Date(publishedAt).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="flex flex-col h-full min-h-[440px]">
      <Link href={`/hirek/${slug}`} className="group flex flex-col h-full">
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
              <span className="text-white text-4xl font-black" aria-hidden="true">VMK</span>
            </div>
          )}
          <div className="absolute top-0 left-0 flex items-center gap-2 p-2">
            <span className="text-[11px] px-2 py-0.5 font-bold text-white rounded-sm" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              {catLabel}
            </span>
            <span className="text-[11px] px-2 py-0.5 text-white rounded-sm" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
              {formattedDate}
            </span>
          </div>
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
    </article>
  )
}
