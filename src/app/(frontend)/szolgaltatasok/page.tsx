import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { getAllServices } from '@/lib/payload'
import { BookOpen, FileText, Bookmark, Users, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Szolgáltatások & Díjszabás – Vörösmarty Mihály Könyvtár',
  description: 'Könyvkölcsönzés, beiratkozási díjak, nyomtatási és rendezvényterem bérleti díjak a VMK-ban.',
}

export default async function SzolgaltatasokPage() {
  const cmsServices = await getAllServices().catch(() => [])

  const defaultPricing = [
    { item: 'Éves beiratkozási díj (felnőtt)', price: '3 600 Ft / év' },
    { item: 'Éves beiratkozási díj (diák / nyugdíjas 50%)', price: '1 800 Ft / év' },
    { item: '70 év felettiek és 16 év alattiak beiratkozása', price: 'Díjmentes' },
    { item: 'Fekete-fehér fénymásolás / nyomtatás (A4)', price: '40 Ft / oldal' },
    { item: 'Színes fénymásolás / nyomtatás (A4)', price: '200 Ft / oldal' },
    { item: 'Könyvtárközi kölcsönzés (postaköltség)', price: '1 500 Ft / kötet' },
    { item: 'Rendezvényterem bérlés (Központi Könyvtár)', price: '12 000 Ft / óra' },
  ]

  return (
    <PageWithSidebar>
      <div className="space-y-10">
      <Breadcrumb items={[{ label: 'Szolgáltatások & Díjszabás' }]} />

      <div className="pb-4">
        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">Szolgáltatások & Díjszabás</h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Ismerje meg a Vörösmarty Mihály Könyvtár által kínált kölcsönzési, digitális és közösségi szolgáltatásokat, valamint az érvényben lévő tételeket.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-3">
          <BookOpen className="w-8 h-8 text-[#137F85]" />
          <h2 className="text-xl font-bold text-slate-900">Dokumentumkölcsönzés & Olvasóterem</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Könyvek, folyóiratok, kotta- és hanganyagok kölcsönzése, valamint a helyben használható olvasótermi állomány böngészése.
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Egyidejűleg legfeljebb 10 kötet kölcsönözhető 4 hétre</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Online hosszabbítás a Katalógusban (OPAC) 2 alkalommal</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-3">
          <FileText className="w-8 h-8 text-[#e4b02c]" />
          <h2 className="text-xl font-bold text-slate-900">E-Könyvek & NAVA Pont</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Hozzáférés a Nemzeti Audiovizuális Archívum (NAVA) tartalmához, adatbázis-használat és e-könyv kölcsönzés olvasójeggyel.
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ingyenes wifi és számítógép-használat beiratkozott olvasóknak</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Szakadatbázisok (Arcanum, MeSH, EBSCO) elérése</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-3">
          <Bookmark className="w-8 h-8 text-[#137F85]" />
          <h2 className="text-xl font-bold text-slate-900">Helyismereti Kutatószolgálat</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Székesfehérvár és Fejér vármegye helytörténeti dokumentumainak, régi fotóinak és sajtóanyagának kutatási lehetősége szakértői segítséggel.
          </p>
        </div>

        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-3">
          <Users className="w-8 h-8 text-[#e4b02c]" />
          <h2 className="text-xl font-bold text-slate-900">Terembérlet & Rendezvényszervezés</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Modern előadótermeink és közösségi tereink bérlése előadásokhoz, céges képzésekhez és kulturális programokhoz.
          </p>
        </div>
      </div>

      {/* Díjtáblázat */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <h2 className="text-xl font-bold text-slate-900">Hivatalos Díjszabás (2026)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-bold text-slate-900 uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Szolgáltatás / Tétel</th>
                <th className="py-3 px-4 text-right">Díj (Bruttó)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cmsServices.length > 0
                ? cmsServices.flatMap((s) =>
                    ((s.pricingTable as Array<{ serviceItem: string; price: string }>) ?? []).map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium">{p.serviceItem}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#137F85]">{p.price}</td>
                      </tr>
                    ))
                  )
                : defaultPricing.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{item.item}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#137F85]">{item.price}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </PageWithSidebar>
  )
}
