import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { Clock, MapPin, Phone, Mail, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nyitvatartási Mátrix – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár központi épületének és összes tagkönyvtárának nyitvatartási ideje Székesfehérváron.',
}

const librariesSchedule = [
  {
    name: 'Központi Könyvtár (Bartók Béla tér 1.)',
    slug: 'kozponti-konyvtar',
    address: '8000 Székesfehérvár, Bartók Béla tér 1.',
    phone: '+36 22 312 845',
    email: 'info@vmk.hu',
    type: 'Központi',
    hours: {
      Hétfő: '12:00 - 18:00',
      Kedd: '09:00 - 19:00',
      Szerda: '09:00 - 19:00',
      Csütörtök: '09:00 - 19:00',
      Péntek: '09:00 - 19:00',
      Szombat: '09:00 - 16:00',
      Vasárnap: 'Zárva',
    },
  },
  {
    name: 'Budai Úti Tagkönyvtár',
    slug: 'budai-uti-tagkonyvtar',
    address: '8000 Székesfehérvár, Budai út 44-46.',
    phone: '+36 22 315 253',
    email: 'budai@vmk.hu',
    type: 'Tagkönyvtár',
    hours: {
      Hétfő: '13:00 - 18:00',
      Kedd: '09:00 - 17:00',
      Szerda: '13:00 - 18:00',
      Csütörtök: '09:00 - 17:00',
      Péntek: '09:00 - 16:00',
      Szombat: 'Zárva',
      Vasárnap: 'Zárva',
    },
  },
  {
    name: 'Mészöly Géza Úti Tagkönyvtár',
    slug: 'meszoly-geza-uti-tagkonyvtar',
    address: '8000 Székesfehérvár, Mészöly G. u. 7.',
    phone: '+36 22 329 401',
    email: 'meszoly@vmk.hu',
    type: 'Tagkönyvtár',
    hours: {
      Hétfő: '13:00 - 18:00',
      Kedd: '09:00 - 17:00',
      Szerda: '13:00 - 18:00',
      Csütörtök: '09:00 - 17:00',
      Péntek: '09:00 - 16:00',
      Szombat: 'Zárva',
      Vasárnap: 'Zárva',
    },
  },
  {
    name: 'Zsolt Utcai Tagkönyvtár',
    slug: 'zsolt-utcai-tagkonyvtar',
    address: '8000 Székesfehérvár, Zsolt u. 32.',
    phone: '+36 22 314 550',
    email: 'zsolt@vmk.hu',
    type: 'Tagkönyvtár',
    hours: {
      Hétfő: '13:00 - 17:00',
      Kedd: '09:00 - 16:00',
      Szerda: '13:00 - 17:00',
      Csütörtök: '09:00 - 16:00',
      Péntek: 'Zárva',
      Szombat: 'Zárva',
      Vasárnap: 'Zárva',
    },
  },
]

export default function NyitvatartasPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Nyitvatartás' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Clock className="w-8 h-8 text-[#8C1D11]" />
          <span>Tagkönyvtárak & Nyitvatartási Mátrix</span>
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Tájékozódjon a Vörösmarty Mihály Könyvtár központi épületének és valamennyi székesfehérvári tagkönyvtárának rendszeres nyitvatartási rendjéről.
        </p>
      </div>

      {/* Summer / Special Notice Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Ünnepi és nyári zárva tartások tájékoztatója:</strong>
          <p className="mt-0.5 text-amber-800">
            A nemzeti ünnepnapokon (pl. augusztus 20.) könyvtárunk valamennyi részlege zárva tart. Az online katalógus és e-könyv szolgáltatásaink továbbra is 0-24 órában elérhetőek!
          </p>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="space-y-6">
        {librariesSchedule.map((lib, idx) => (
          <div
            key={idx}
            id={lib.slug}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded font-semibold bg-amber-100 text-[#8C1D11]">
                  {lib.type}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{lib.name}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#C85A32]" />
                  {lib.address}
                </span>
                <a href={`tel:${lib.phone}`} className="flex items-center gap-1 hover:underline">
                  <Phone className="w-4 h-4 text-[#C85A32]" />
                  {lib.phone}
                </a>
                <a href={`mailto:${lib.email}`} className="flex items-center gap-1 hover:underline">
                  <Mail className="w-4 h-4 text-[#C85A32]" />
                  {lib.email}
                </a>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              {Object.entries(lib.hours).map(([day, hours], hIdx) => (
                <div
                  key={hIdx}
                  className={`p-3 rounded-lg border ${
                    hours === 'Zárva'
                      ? 'bg-slate-50 border-slate-100 text-slate-400'
                      : 'bg-emerald-50/60 border-emerald-100 text-slate-900'
                  }`}
                >
                  <span className="block font-semibold text-slate-600 mb-1">{day}</span>
                  <span className={`font-bold ${hours === 'Zárva' ? 'text-slate-400' : 'text-[#8C1D11]'}`}>
                    {hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
