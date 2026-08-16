import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { getAllLibraries, getAllOpeningHours, formatOpeningHours } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Nyitvatartás – Vörösmarty Mihály Könyvtár',
  description:
    'A Vörösmarty Mihály Könyvtár központi épületének és összes tagkönyvtárának nyitvatartási ideje.',
}

const FALLBACK_CENTRAL = [
  { label: 'Felnőtt kölcsönző részleg, Számítástechnika (Olvasóterem)', hours: 'hétfő: 13:00-18:00\nkedd-péntek: 10:00-18:00\nszombat: 9:00-16:00' },
  { label: 'Zenei és olvasótermi részleg (2026. augusztus 14-étől)', hours: 'hétfő: zárva\nkedd-péntek: 10:00-18:00\nszombat: 13:00-18:00' },
  { label: 'Pedagógiai szaktanácsadó (2026. augusztus 14-étől)', hours: 'hétfő: zárva\nkedd-péntek: 10:00-18:00\nszombat: 9:00-16:00' },
]

const FALLBACK_BRANCHES = [
  { name: 'Budai Úti Tagkönyvtár', hours: 'kedd-péntek: 10:00-17:00\nszombat: 10:00-14:00' },
  { name: 'Mészöly Géza Utcai Tagkönyvtár', hours: 'kedd: 8:00-12:00 és 13:00-17:00\nszombat: 10:00-17:00' },
  { name: 'Széna Téri Tagkönyvtár', hours: 'kedd-péntek: 11:00-19:00\nszombat: 10:00-17:00' },
  { name: 'Tolnai Utcai Tagkönyvtár', hours: 'kedd-péntek: 10:00-18:00\nszombat: 09:00-14:00' },
  { name: 'Zsolt Utcai Tagkönyvtár', hours: 'kedd-péntek: 10:00-18:00\nszombat: 9:00-18:00' },
]

export default async function NyitvatartasPage() {
  let centralSchedule = FALLBACK_CENTRAL
  let branchSchedule = FALLBACK_BRANCHES

  try {
    const [libraries, allHours] = await Promise.all([getAllLibraries(), getAllOpeningHours()])
    const central = libraries.find((l) => l.type === 'central')
    const branches = libraries.filter((l) => l.type === 'branch')

    if (central) {
      const centralHours = allHours.filter(
        (h) => (typeof h.library === 'object' ? h.library?.id : h.library) === central.id,
      )
      const formatted = formatOpeningHours(centralHours)
      if (formatted.length > 0) {
        centralSchedule = formatted.map((f) => ({ label: f.day, hours: f.hours }))
      }
    }

    if (branches.length > 0) {
      branchSchedule = branches.map((b) => {
        const bHours = allHours.filter(
          (h) => (typeof h.library === 'object' ? h.library?.id : h.library) === b.id,
        )
        const formatted = formatOpeningHours(bHours)
        return {
          name: b.name,
          hours: formatted.map((f) => `${f.day}: ${f.hours}`).join('\n') || 'Ehhez a tagkönyvtárhoz még nincs nyitvatartási adat rögzítve.',
        }
      })
    }
  } catch {
    // CMS nem elérhető
  }

  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Nyitvatartás' }]} />

        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Nyitvatartás
        </h1>

        <div className="text-[14px] leading-[20px] text-[#333] space-y-4 mb-8" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <p className="text-center font-bold text-[16px]">
            A VÖRÖSMARTY MIHÁLY KÖNYVTÁR NYÁRI NYITVATARTÁSA 2026-BAN.
          </p>
          <p className="text-center font-bold text-red-600">
            A TAGKÖNYVTÁRAK A NYÁRI SZÜNETBEN SZOMBATONKÉNT ZÁRVA TARTANAK!
          </p>
          <p className="text-center font-bold">
            AZ ELSŐ SZOMBATI NYITVATARTÁSI NAP:<br />
            2026. SZEPTEMBER 6.
          </p>
        </div>

        {/* Központi Könyvtár táblázat */}
        <table className="w-full border-collapse mb-8 text-[14px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <thead>
            <tr>
              <th
                colSpan={2}
                className="text-center text-white font-bold text-[16px] py-[10px] px-[15px] uppercase"
                style={{ backgroundColor: 'var(--accent-fill-a11y)' }}
              >
                Központi Könyvtár
              </th>
            </tr>
            <tr>
              <td colSpan={2} className="text-center py-[8px] px-[15px] font-semibold text-[#333] bg-[#f5f5f5] border border-[#ddd]">
                (Minden hónap első hétfőjén zárva)
              </td>
            </tr>
          </thead>
          <tbody>
            {centralSchedule.map((row, i) => (
              <tr key={i}>
                <td className="py-[8px] px-[15px] border border-[#ddd] align-top" style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                  {row.label}
                </td>
                <td className="py-[8px] px-[15px] border border-[#ddd] align-top whitespace-pre-line" style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                  {row.hours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tagkönyvtárak táblázat */}
        <table className="w-full border-collapse mb-8 text-[14px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <thead>
            <tr>
              <th
                colSpan={2}
                className="text-center text-[#1B1B1B] font-bold text-[16px] py-[10px] px-[15px] uppercase"
                style={{ backgroundColor: '#e4b02c' }}
              >
                Tagkönyvtárak
              </th>
            </tr>
            <tr>
              <td colSpan={2} className="text-center py-[8px] px-[15px] font-semibold text-[#333] bg-[#f5f5f5] border border-[#ddd]">
                (Minden hétfőn zárva)
              </td>
            </tr>
          </thead>
          <tbody>
            {branchSchedule.map((row, i) => (
              <tr key={i}>
                <td className="py-[8px] px-[15px] border border-[#ddd] font-semibold align-top" style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                  {row.name}
                </td>
                <td className="py-[8px] px-[15px] border border-[#ddd] align-top whitespace-pre-line" style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                  {row.hours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWithSidebar>
  )
}
