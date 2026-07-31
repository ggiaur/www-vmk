import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { LibraryCard } from '@/components/ui/LibraryCard'
import { getLibrariesByType } from '@/lib/payload'
import { Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Könyvtári Részlegek – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár központi épületének szakrészlegei.',
}

const FALLBACK_DEPARTMENTS = [
  { id: 'f1', name: 'Felnőtt Kölcsönző', slug: 'felnott-kolcsonzo', address: 'Bartók Béla tér 1., földszint', type: 'department' },
  { id: 'f2', name: 'Gyermek- és Kamaszrészleg', slug: 'gyermek', address: 'Bartók Béla tér 1., 1. emelet', type: 'department' },
  { id: 'f3', name: 'Helyismereti Csoport', slug: 'helyismeret', address: 'Bartók Béla tér 1., 2. emelet', type: 'department' },
  { id: 'f4', name: 'Olvasóterem', slug: 'olvasoterem', address: 'Bartók Béla tér 1., földszint', type: 'department' },
  { id: 'f5', name: 'Pedagógiai Szakkönyvtár', slug: 'pedagogia', address: 'Bartók Béla tér 1., 2. emelet', type: 'department' },
  { id: 'f6', name: 'Zenei és Számítógépes Részleg', slug: 'zenei-es-okosterem', address: 'Bartók Béla tér 1., alagsor', type: 'department' },
  { id: 'f7', name: 'Kötészet', slug: 'koteszet', address: 'Bartók Béla tér 1., alagsor', type: 'department' },
]

export default async function ReszlegekPage() {
  const departments = await getLibrariesByType('department').catch(() => [])
  const displayDepartments = departments.length > 0 ? departments : FALLBACK_DEPARTMENTS

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Részlegek' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Layers className="w-8 h-8 text-[#8C1D11]" />
          <span>Könyvtári Részlegek</span>
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          A Központi Könyvtár szakrészlegei — mindegyik saját gyűjteménnyel és szolgáltatásokkal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayDepartments.map((dept) => (
          <LibraryCard
            key={dept.id}
            name={dept.name}
            slug={dept.slug}
            address={dept.address}
            phone={'phone' in dept ? (dept.phone ?? undefined) : undefined}
            email={'email' in dept ? (dept.email ?? undefined) : undefined}
            type={dept.type}
            href={`/reszlegek/${dept.slug}`}
          />
        ))}
      </div>
    </div>
  )
}
