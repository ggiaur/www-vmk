import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'

export const metadata: Metadata = {
  title: 'Közérdekű adatok – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár közérdekű adatai.',
}

const INFO = [
  { label: 'Hivatalos név', value: 'Vörösmarty Mihály Könyvtár' },
  { label: 'Székhely', value: '8000 Székesfehérvár, Bartók Béla tér 1.' },
  { label: 'Postacím', value: '8000 Székesfehérvár, Pf. 65.' },
  { label: 'Telefon', value: '(22) 312-684, (22) 312-845' },
  { label: 'E-mail', value: 'kolcsonzo@vmk.hu' },
  { label: 'Honlap', value: 'https://www.vmk.hu' },
  { label: 'Fenntartó', value: 'Székesfehérvár Megyei Jogú Város Önkormányzata' },
  { label: 'Típus', value: 'Megyei hatókörű városi könyvtár' },
  { label: 'Adószám', value: '15361428-2-07' },
]

export default function KozerdekulAdatokPage() {
  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Közérdekű adatok' }]} />

        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Közérdekű adatok
        </h1>

        <table className="w-full border-collapse text-[14px] mb-8" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <thead>
            <tr>
              <th
                colSpan={2}
                className="text-center text-white font-bold text-[16px] py-[10px] px-[15px] uppercase"
                style={{ backgroundColor: '#159097' }}
              >
                Alapadatok
              </th>
            </tr>
          </thead>
          <tbody>
            {INFO.map((row, i) => (
              <tr key={i}>
                <td
                  className="py-[8px] px-[15px] border border-[#ddd] font-semibold w-[200px]"
                  style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                >
                  {row.label}
                </td>
                <td
                  className="py-[8px] px-[15px] border border-[#ddd]"
                  style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                >
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-[14px] text-[#333] space-y-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <p>
            Részletes közérdekű adatok a{' '}
            <a
              href="https://kozadat.hu/kereso/kozfeladatot-ellato-szervek/adatlap/8159"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#159097] hover:underline"
            >
              Közadatkereső
            </a>{' '}
            felületén érhetők el.
          </p>
          <p>
            <Link href="/dokumentumok" className="text-[#159097] hover:underline">
              Dokumentumtár (SZMSZ, beszámolók, szabályzatok) →
            </Link>
          </p>
        </div>
      </div>
    </PageWithSidebar>
  )
}
