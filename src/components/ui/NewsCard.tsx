import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'

export interface NewsCardProps {
  title: string
  summary: string
  category: 'general' | 'announcement' | 'grant' | string
  publishedAt: string
  slug: string
  imageUrl?: string
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  general: { label: 'Friss Hír', color: 'bg-amber-100 text-amber-800' },
  announcement: { label: 'Közlemény', color: 'bg-red-100 text-red-800' },
  grant: { label: 'Pályázat', color: 'bg-emerald-100 text-emerald-800' },
  archive: { label: 'Archívum', color: 'bg-slate-200 text-slate-700' },
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  summary,
  category,
  publishedAt,
  slug,
  imageUrl,
}) => {
  const catInfo = categoryLabels[category] || { label: 'Hír', color: 'bg-slate-100 text-slate-800' }
  const formattedDate = new Date(publishedAt).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm card-hover-effect flex flex-col h-full">
      {imageUrl && (
        <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${catInfo.color}`}>
            {catInfo.label}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 line-clamp-2 hover:text-[#F3701D] transition-colors">
          <Link href={`/hirek/${slug}`}>{title}</Link>
        </h3>

        <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">{summary}</p>

        <div className="pt-3 border-t border-slate-100 mt-auto">
          <Link
            href={`/hirek/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F3701D] hover:text-[#D4590F] transition-colors group"
          >
            <span>Tovább a cikkhez</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}
