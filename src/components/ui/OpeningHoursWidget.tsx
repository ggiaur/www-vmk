'use client'

import React, { useState } from 'react'
import { Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

export interface DaySchedule {
  day: string
  hours: string
  isToday?: boolean
}

export interface OpeningHoursWidgetProps {
  /** A könyvtár neve, ami megjelenik a widgetben */
  libraryName?: string
  /** A heti nyitvatartási adatok – a Payload-ból jövő, már formázott lista */
  schedule?: DaySchedule[]
}

// Fallback: ha nincs CMS adat (pl. fejlesztési módban, üres DB)
const DEFAULT_SCHEDULE: DaySchedule[] = [
  { day: 'Hétfő', hours: '12:00 - 18:00' },
  { day: 'Kedd', hours: '09:00 - 19:00' },
  { day: 'Szerda', hours: '09:00 - 19:00' },
  { day: 'Csütörtök', hours: '09:00 - 19:00' },
  { day: 'Péntek', hours: '09:00 - 19:00' },
  { day: 'Szombat', hours: '09:00 - 16:00' },
  { day: 'Vasárnap', hours: 'Zárva' },
]

export const OpeningHoursWidget: React.FC<OpeningHoursWidgetProps> = ({
  libraryName = 'Központi Könyvtár',
  schedule,
}) => {
  const [expanded, setExpanded] = useState(false)

  // Ha van CMS-ből jövő adat, azt használjuk; különben a fallback
  const displaySchedule = schedule && schedule.length > 0 ? schedule : DEFAULT_SCHEDULE

  // Mai nap (0=H..6=V, Payload: monday=0)
  const todayEntry = displaySchedule.find((s) => s.isToday) ?? displaySchedule[1]
  const isOpenToday = todayEntry?.hours !== 'Zárva'

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 max-w-sm w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
              isOpenToday ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              {isOpenToday ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-xs font-bold uppercase tracking-wide ${
                  isOpenToday ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {libraryName}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              Ma:{' '}
              <span className={isOpenToday ? 'text-[#F3701D]' : 'text-red-500'}>
                {todayEntry?.hours ?? 'Zárva'}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Heti nyitvatartás kibontása"
        >
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
          <p className="font-semibold text-slate-900 mb-2">Heti nyitvatartási rend:</p>
          {displaySchedule.map((item, idx) => (
            <div
              key={idx}
              className={`flex justify-between py-1 px-2 rounded ${
                item.isToday ? 'bg-amber-50 font-bold text-[#F3701D]' : 'hover:bg-slate-50'
              }`}
            >
              <span>{item.day}</span>
              <span>{item.hours}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
