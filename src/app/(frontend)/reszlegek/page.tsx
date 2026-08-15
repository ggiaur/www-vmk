import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { getLibrariesByType } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Központi Könyvtár – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár központi épületének szakrészlegei.',
}

const FALLBACK_DEPARTMENTS = [
  { id: 'f1', name: 'Felnőtt Kölcsönző', slug: 'felnott-kolcsonzo', address: 'Bartók Béla tér 1., földszint' },
  { id: 'f2', name: 'Gyermek- és Kamaszrészleg', slug: 'gyermek', address: 'Bartók Béla tér 1., 1. emelet' },
  { id: 'f3', name: 'Helyismereti Csoport', slug: 'helyismeret', address: 'Bartók Béla tér 1., 2. emelet' },
  { id: 'f4', name: 'Olvasóterem', slug: 'olvasoterem', address: 'Bartók Béla tér 1., földszint' },
  { id: 'f5', name: 'Pedagógiai Szakkönyvtár', slug: 'pedagogia', address: 'Bartók Béla tér 1., 2. emelet' },
  { id: 'f6', name: 'Zenei és Számítógépes Részleg', slug: 'zenei-es-okosterem', address: 'Bartók Béla tér 1., alagsor' },
  { id: 'f7', name: 'Kötészet', slug: 'koteszet', address: 'Bartók Béla tér 1., alagsor' },
]

export default async function ReszlegekPage() {
  const departments = await getLibrariesByType('department').catch(() => [])
  const displayDepartments = departments.length > 0 ? departments : FALLBACK_DEPARTMENTS

  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Központi Könyvtár' }]} />

        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Központi Könyvtár
        </h1>

        <table className="w-full border-collapse text-[14px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <thead>
            <tr>
              <th
                colSpan={2}
                className="text-center text-white font-bold text-[16px] py-[10px] px-[15px] uppercase"
                style={{ backgroundColor: '#2563eb' }}
              >
                Részlegek
              </th>
            </tr>
          </thead>
          <tbody>
            {displayDepartments.map((dept, i) => (
              <tr key={dept.id}>
                <td
                  className="py-[8px] px-[15px] border border-[#ddd]"
                  style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                >
                  <Link
                    href={`/reszlegek/${dept.slug}`}
                    className="text-[#2563eb] hover:underline font-semibold"
                  >
                    {dept.name}
                  </Link>
                </td>
                <td
                  className="py-[8px] px-[15px] border border-[#ddd] text-[#666]"
                  style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                >
                  {dept.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWithSidebar>
  )
}
