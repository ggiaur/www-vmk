import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { LibraryCard } from '@/components/ui/LibraryCard'
import { getLibrariesByType } from '@/lib/payload'
import { Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tagkönyvtárak – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár székesfehérvári tagkönyvtárai.',
}

const FALLBACK_BRANCHES = [
  { id: 'b1', name: 'Budai Úti Tagkönyvtár', slug: 'budai-ut', address: 'Budai út 44-46.', type: 'branch' },
  { id: 'b2', name: 'Mészöly Géza Utcai Tagkönyvtár', slug: 'meszoly-geza', address: 'Mészöly Géza u. 4.', type: 'branch' },
  { id: 'b3', name: 'Széna Téri Tagkönyvtár', slug: 'szena-ter', address: 'Széna tér 3.', type: 'branch' },
  { id: 'b4', name: 'Tolnai Utcai Tagkönyvtár', slug: 'tolnai-ut', address: 'Tolnai u. 24.', type: 'branch' },
  { id: 'b5', name: 'Zsolt Utcai Tagkönyvtár', slug: 'zsolt-ut', address: 'Zsolt u. 6.', type: 'branch' },
]

export default async function TagkonyvtarakPage() {
  const branches = await getLibrariesByType('branch').catch(() => [])
  const displayBranches = branches.length > 0 ? branches : FALLBACK_BRANCHES

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Tagkönyvtárak' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-[#8C1D11]" />
          <span>Tagkönyvtárak</span>
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Öt székesfehérvári városrészben — mindenhol elérhető közelségben.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayBranches.map((branch) => (
          <LibraryCard
            key={branch.id}
            name={branch.name}
            slug={branch.slug}
            address={branch.address}
            phone={'phone' in branch ? (branch.phone ?? undefined) : undefined}
            email={'email' in branch ? (branch.email ?? undefined) : undefined}
            type={branch.type}
            href={`/tagkonyvtarak/${branch.slug}`}
          />
        ))}
      </div>
    </div>
  )
}
