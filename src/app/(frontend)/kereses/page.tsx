import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { SearchClient } from './SearchClient'

export const metadata: Metadata = {
  title: 'Keresés – Vörösmarty Mihály Könyvtár',
  description: 'Keressen a Vörösmarty Mihály Könyvtár híreiben és rendezvényeiben.',
}

export default function KeresesPage() {
  return (
    <PageWithSidebar>
      <div className="max-w-3xl space-y-8">
        <Breadcrumb items={[{ label: 'Keresés' }]} />
        <h1 className="text-3xl font-black text-slate-900">Keresés</h1>
        <SearchClient />
      </div>
    </PageWithSidebar>
  )
}
