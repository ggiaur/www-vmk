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
        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">Keresés</h1>
        <SearchClient />
      </div>
    </PageWithSidebar>
  )
}
