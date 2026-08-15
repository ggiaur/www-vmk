import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { getLibrariesByType } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Tagkönyvtárak – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár székesfehérvári tagkönyvtárai.',
}

const FALLBACK_BRANCHES = [
  { id: 'b1', name: 'Budai Úti Tagkönyvtár', slug: 'budai-ut', address: '8000 Székesfehérvár, Budai út 44-46.', phone: '(22) 329-436' },
  { id: 'b2', name: 'Mészöly Géza Utcai Tagkönyvtár', slug: 'meszoly-geza', address: '8000 Székesfehérvár, Mészöly Géza utca 1.', phone: '(22) 315-603' },
  { id: 'b3', name: 'Széna Téri Tagkönyvtár', slug: 'szena-ter', address: '8000 Székesfehérvár, Széna tér 16.', phone: '(22) 313-643' },
  { id: 'b4', name: 'Tolnai Utcai Tagkönyvtár', slug: 'tolnai-ut', address: '8000 Székesfehérvár, Tolnai utca 30.', phone: '(22) 329-437' },
  { id: 'b5', name: 'Zsolt Utcai Tagkönyvtár', slug: 'zsolt-ut', address: '8000 Székesfehérvár, Zsolt utca 54.', phone: '(22) 329-458' },
]

export default async function TagkonyvtarakPage() {
  const branches = await getLibrariesByType('branch').catch(() => [])
  const displayBranches = branches.length > 0
    ? branches.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        address: b.address,
        phone: b.phone || '',
      }))
    : FALLBACK_BRANCHES

  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Tagkönyvtárak' }]} />

        <h1 className="font-serif text-[24px] font-bold text-slate-100 uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Tagkönyvtárak
        </h1>

        <table className="w-full border-collapse text-[14px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <thead>
            <tr>
              <th className="text-left py-[8px] px-[15px] border border-[#ddd] bg-[#818cf8] text-white font-bold">
                Tagkönyvtár neve
              </th>
              <th className="text-left py-[8px] px-[15px] border border-[#ddd] bg-[#818cf8] text-white font-bold">
                Cím
              </th>
              <th className="text-left py-[8px] px-[15px] border border-[#ddd] bg-[#818cf8] text-white font-bold w-[120px]">
                Telefon
              </th>
            </tr>
          </thead>
          <tbody>
            {displayBranches.map((branch, i) => (
              <tr key={branch.id}>
                <td
                  className="py-[8px] px-[15px] border border-[#ddd] font-semibold"
                  style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                >
                  <Link
                    href={`/tagkonyvtarak/${branch.slug}`}
                    className="text-[#f59e0b] hover:underline"
                  >
                    {branch.name}
                  </Link>
                </td>
                <td
                  className="py-[8px] px-[15px] border border-[#ddd] text-[#666]"
                  style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                >
                  {branch.address}
                </td>
                <td
                  className="py-[8px] px-[15px] border border-[#ddd] text-[#666]"
                  style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                >
                  {branch.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWithSidebar>
  )
}
