import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAY_LABELS = ['H', 'K', 'SZ', 'CS', 'P', 'SZO', 'V']
const MONTH_NAMES_HU = [
  'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
  'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December',
]

export interface EventCalendarWidgetProps {
  highlightedDays: number[]
  year: number
  month: number
}

export function EventCalendarWidget({ highlightedDays, year, month }: EventCalendarWidgetProps) {
  const firstDayOfMonth = new Date(year, month, 1)
  const startWeekday = (firstDayOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const cells: Array<{ day: number; current: boolean }> = []
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true })
  }
  const remaining = 7 - (cells.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, current: false })
    }
  }

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  return (
    <div>
      <div className="flex items-center" style={{ backgroundColor: 'var(--accent-fill-a11y)' }}>
        <button aria-label="Előző hónap" disabled className="px-[10px] py-[5px] text-white">
          <ChevronLeft className="w-[26px] h-[26px]" />
        </button>
        <h3 className="flex-1 text-center text-white font-normal text-[22px] py-[15px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {year}. {MONTH_NAMES_HU[month].toUpperCase()}
        </h3>
        <button aria-label="Következő hónap" disabled className="px-[10px] py-[5px] text-white">
          <ChevronRight className="w-[26px] h-[26px]" />
        </button>
      </div>
      <table className="w-full border-collapse" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((d) => (
              <th key={d} className="text-center text-[14px] font-bold text-black py-2">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, row) => (
            <tr key={row}>
              {cells.slice(row * 7, row * 7 + 7).map((cell, col) => {
                const isHighlighted = cell.current && highlightedDays.includes(cell.day)
                const isToday = cell.current && isCurrentMonth && cell.day === today.getDate()
                return (
                  <td
                    key={col}
                    className="text-center text-[20px] py-[10px]"
                    style={{
                      fontWeight: isHighlighted || isToday ? 700 : 400,
                      backgroundColor: isHighlighted ? '#e4b02c' : isToday ? 'var(--accent-fill-a11y)' : 'transparent',
                      // #ccc on white was 1.6:1 (WCAG needs 4.5:1) -- #767676 is a
                      // standard "just passes" AA gray, keeps the intended faded look.
                      // White text on #e4b02c (highlighted days) was 1.99:1 -- #1B1B1B
                      // is the same dark shade already used for gold-background text
                      // elsewhere (CookieConsent's "Elfogadom" button).
                      color: !cell.current ? '#767676' : isHighlighted ? '#1B1B1B' : isToday ? '#fff' : '#555',
                    }}
                  >
                    {cell.day}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
