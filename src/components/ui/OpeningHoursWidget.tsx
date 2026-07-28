'use client'

import React, { useState } from 'react'
import { Clock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'

export interface DaySchedule {
  day: string
  hours: string
  isToday?: boolean
}

export const OpeningHoursWidget: React.FC = () => {
  const [expanded, setExpanded] = useState(false)

  // Current weekday index (0=Sunday, 1=Monday...)
  const now = new Date()
  const currentDayIndex = now.getDay() // 0: Sun, 1: Mon...

  const schedule: DaySchedule[] = [
    { day: 'Hétfő', hours: '12:00 - 18:00', isToday: currentDayIndex === 1 },
    { day: 'Kedd', hours: '09:00 - 19:00', isToday: currentDayIndex === 2 },
    { day: 'Szerda', hours: '09:00 - 19:00', isToday: currentDayIndex === 3 },
    { day: 'Csütörtök', hours: '09:00 - 19:00', isToday: currentDayIndex === 4 },
    { day: 'Péntek', hours: '09:00 - 19:00', isToday: currentDayIndex === 5 },
    { day: 'Szombat', hours: '09:00 - 16:00', isToday: currentDayIndex === 6 },
    { day: 'Vasárnap', hours: 'Zárva', isToday: currentDayIndex === 0 },
  ]

  const todaySchedule = schedule.find((s) => s.isToday) || schedule[1]

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 max-w-sm w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                Központi Könyvtár
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              Ma: <span className="text-[#8C1D11]">{todaySchedule.hours}</span>
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
          {schedule.map((item, idx) => (
            <div
              key={idx}
              className={`flex justify-between py-1 px-2 rounded ${
                item.isToday ? 'bg-amber-50 font-bold text-[#8C1D11]' : 'hover:bg-slate-50'
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
