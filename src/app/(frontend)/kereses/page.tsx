import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { SearchClient } from './SearchClient'

export const metadata: Metadata = {
  title: 'Keresés – Vörösmarty Mihály Könyvtár',
  description: 'Keressen a Vörösmarty Mihály Könyvtár híreiben és rendezvényeiben.',
}

export default function KeresesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Keresés' }]} />
      <h1 className="text-3xl font-black text-slate-900">Keresés</h1>
      <SearchClient />
    </div>
  )
}
