import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAY_LABELS = ['H', 'K', 'SZ', 'CS', 'P', 'SZO', 'V']
const MONTH_NAMES_HU = [
  'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
  'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December',
]

export interface EventCalendarWidgetProps {
  /** Az esemény napok (a hónap napjai, 1-31) amiket ki kell emelni. */
  highlightedDays: number[]
  year: number
  month: number // 0-indexelt (JS Date konvenció)
}

// A valós vmk.hu főoldalán jobb oldalt egy "ESEMÉNYNAPTÁR" mini-naptár
// widget áll, ami az aktuális hónapot mutatja, az esemény-napok
// kiemelésével. Ez a verzió statikus (nem lapozható) - csak a jelen
// hónapot rendereli, valós esemény-dátumok alapján kiemelve.
export function EventCalendarWidget({ highlightedDays, year, month }: EventCalendarWidgetProps) {
  const firstDayOfMonth = new Date(year, month, 1)
  // JS: vasárnap=0 ... szombat=6. A magyar naptár hétfővel kezdődik, ezért eltoljuk.
  const startWeekday = (firstDayOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: Array<number | null> = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <button aria-label="Előző hónap" disabled className="p-1 text-slate-300">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-bold text-sm text-slate-800">
          {year}. {MONTH_NAMES_HU[month]}
        </h3>
        <button aria-label="Következő hónap" disabled className="p-1 text-slate-300">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="text-slate-400 font-semibold py-1">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          const isHighlighted = day !== null && highlightedDays.includes(day)
          const isToday = isCurrentMonth && day === today.getDate()
          return (
            <div
              key={i}
              className={`h-7 flex items-center justify-center rounded ${
                day === null
                  ? ''
                  : isHighlighted
                    ? 'bg-[#e4b02c] text-[#1B1B1B] font-bold'
                    : isToday
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-600'
              }`}
            >
              {day ?? ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}
