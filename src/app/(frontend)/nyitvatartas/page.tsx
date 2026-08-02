import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { Clock, MapPin, Phone, Mail, AlertTriangle } from 'lucide-react'
import { getAllLibraries, getAllOpeningHours, formatOpeningHours } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Nyitvatartási Mátrix – Vörösmarty Mihály Könyvtár',
  description:
    'A Vörösmarty Mihály Könyvtár központi épületének és összes tagkönyvtárának nyitvatartási ideje Székesfehérváron.',
}

// Fallback adatok, ha a CMS még üres
const FALLBACK_LIBRARIES = [
  {
    id: 'fallback-1',
    name: 'Központi Könyvtár (Bartók Béla tér 1.)',
    slug: 'kozponti-konyvtar',
    address: '8000 Székesfehérvár, Bartók Béla tér 1.',
    phone: '+36 22 312 845',
    email: 'info@vmk.hu',
    type: 'central',
    schedule: [
      { day: 'Hétfő', hours: '12:00 - 18:00', isToday: false },
      { day: 'Kedd', hours: '09:00 - 19:00', isToday: false },
      { day: 'Szerda', hours: '09:00 - 19:00', isToday: false },
      { day: 'Csütörtök', hours: '09:00 - 19:00', isToday: false },
      { day: 'Péntek', hours: '09:00 - 19:00', isToday: false },
      { day: 'Szombat', hours: '09:00 - 16:00', isToday: false },
      { day: 'Vasárnap', hours: 'Zárva', isToday: false },
    ],
  },
  {
    id: 'fallback-2',
    name: 'Budai Úti Tagkönyvtár',
    slug: 'budai-uti-tagkonyvtar',
    address: '8000 Székesfehérvár, Budai út 44-46.',
    phone: '+36 22 315 253',
    email: 'budai@vmk.hu',
    type: 'branch',
    schedule: [
      { day: 'Hétfő', hours: '13:00 - 18:00', isToday: false },
      { day: 'Kedd', hours: '09:00 - 17:00', isToday: false },
      { day: 'Szerda', hours: '13:00 - 18:00', isToday: false },
      { day: 'Csütörtök', hours: '09:00 - 17:00', isToday: false },
      { day: 'Péntek', hours: '09:00 - 16:00', isToday: false },
      { day: 'Szombat', hours: 'Zárva', isToday: false },
      { day: 'Vasárnap', hours: 'Zárva', isToday: false },
    ],
  },
]

const TYPE_LABELS: Record<string, string> = {
  central: 'Központi Könyvtár',
  branch: 'Tagkönyvtár',
  department: 'Részleg',
}

export default async function NyitvatartasPage() {
  // CMS adatok lekérése
  let librariesWithSchedule: {
    id: string | number
    name: string
    slug: string
    address: string
    phone?: string | null
    email?: string | null
    type: string
    schedule: ReturnType<typeof formatOpeningHours>
  }[] = []

  try {
    const [libraries, allHours] = await Promise.all([getAllLibraries(), getAllOpeningHours()])

    librariesWithSchedule = libraries.map((lib) => {
      const libHours = allHours.filter(
        (h) =>
          (typeof h.library === 'object' ? h.library?.id : h.library) === lib.id
      )
      return {
        id: lib.id,
        name: lib.name,
        slug: lib.slug,
        address: lib.address,
        phone: lib.phone,
        email: lib.email,
        type: lib.type,
        schedule: formatOpeningHours(libHours),
      }
    })
  } catch {
    // CMS nem elérhető – fallback adatok
  }

  const displayLibraries =
    librariesWithSchedule.length > 0 ? librariesWithSchedule : FALLBACK_LIBRARIES

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Nyitvatartás' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Clock className="w-8 h-8 text-[#159097]" />
          <span>Tagkönyvtárak & Nyitvatartási Mátrix</span>
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Tájékozódjon a Vörösmarty Mihály Könyvtár központi épületének és valamennyi
          székesfehérvári tagkönyvtárának rendszeres nyitvatartási rendjéről.
        </p>
      </div>

      {/* Ünnepi / Nyári tájékoztató */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Ünnepi és nyári zárva tartások tájékoztatója:</strong>
          <p className="mt-0.5 text-amber-800">
            A nemzeti ünnepnapokon (pl. augusztus 20.) könyvtárunk valamennyi részlege zárva tart.
            Az online katalógus és e-könyv szolgáltatásaink továbbra is 0-24 órában elérhetőek!
          </p>
        </div>
      </div>

      {/* Könyvtárak mátrix */}
      <div className="space-y-6">
        {displayLibraries.map((lib) => (
          <div
            key={lib.id}
            id={lib.slug}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4"
          >
            {/* Fejléc */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded font-semibold bg-amber-100 text-[#159097]">
                  {TYPE_LABELS[lib.type] ?? lib.type}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{lib.name}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#e4b02c]" />
                  {lib.address}
                </span>
                {lib.phone && (
                  <a href={`tel:${lib.phone}`} className="flex items-center gap-1 hover:underline">
                    <Phone className="w-4 h-4 text-[#e4b02c]" />
                    {lib.phone}
                  </a>
                )}
                {lib.email && (
                  <a href={`mailto:${lib.email}`} className="flex items-center gap-1 hover:underline">
                    <Mail className="w-4 h-4 text-[#e4b02c]" />
                    {lib.email}
                  </a>
                )}
              </div>
            </div>

            {/* Heti rács */}
            {lib.schedule.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
                {lib.schedule.map((item, hIdx) => (
                  <div
                    key={hIdx}
                    className={`p-3 rounded-lg border ${
                      item.isToday
                        ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                        : item.hours === 'Zárva'
                          ? 'bg-slate-50 border-slate-100 text-slate-400'
                          : 'bg-emerald-50/60 border-emerald-100 text-slate-900'
                    }`}
                  >
                    <span
                      className={`block font-semibold mb-1 ${item.isToday ? 'text-[#159097]' : 'text-slate-600'}`}
                    >
                      {item.day}
                      {item.isToday && (
                        <span className="ml-1 text-[10px] font-bold text-amber-600">● Ma</span>
                      )}
                    </span>
                    <span
                      className={`font-bold ${
                        item.hours === 'Zárva'
                          ? 'text-slate-400'
                          : item.isToday
                            ? 'text-[#159097]'
                            : 'text-slate-800'
                      }`}
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic text-center py-4">
                Ehhez a tagkönyvtárhoz még nincs nyitvatartási adat rögzítve a rendszerben.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
