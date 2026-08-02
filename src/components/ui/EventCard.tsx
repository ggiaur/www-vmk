import React from 'react'
import Link from 'next/link'
import { MapPin, Users, ArrowRight } from 'lucide-react'

export interface EventCardProps {
  title: string
  startDate: string
  locationName: string
  targetAudience?: string
  slug: string
  registrationUrl?: string
}

const audienceLabels: Record<string, string> = {
  all: 'Minden korosztály',
  children: 'Gyerekeknek',
  teens: 'Fiataloknak',
  adults: 'Felnőtteknek',
  seniors: 'Szenioroknak',
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  startDate,
  locationName,
  targetAudience = 'all',
  slug,
  registrationUrl,
}) => {
  const dateObj = new Date(startDate)
  const dayStr = dateObj.getDate().toString()
  const monthStr = dateObj.toLocaleDateString('hu-HU', { month: 'short' }).toUpperCase()
  const timeStr = dateObj.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm card-hover-effect flex gap-4">
      {/* Date badge */}
      <div className="shrink-0 w-16 h-20 rounded-lg bg-[#159097] text-white flex flex-col items-center justify-center shadow-md">
        <span className="text-2xl font-black leading-none">{dayStr}</span>
        <span className="text-xs font-semibold tracking-wider mt-1">{monthStr}</span>
        <span className="text-[10px] text-amber-200 mt-0.5">{timeStr}</span>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 flex items-center gap-1">
            <Users className="w-3 h-3 text-[#e4b02c]" />
            {audienceLabels[targetAudience] || 'Esemény'}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-[#159097] transition-colors mb-2">
          <Link href={`/esemenyek/${slug}`}>{title}</Link>
        </h3>

        <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#e4b02c] shrink-0" />
          <span className="truncate">{locationName}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold">
          <Link href={`/esemenyek/${slug}`} className="text-[#159097] hover:underline flex items-center gap-1">
            <span>Részletek</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          {registrationUrl && (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#e4b02c] hover:bg-[#b04b26] text-white px-2.5 py-1 rounded text-[11px] transition-colors"
            >
              Regisztráció
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
