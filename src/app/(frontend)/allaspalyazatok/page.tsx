import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'

export const metadata: Metadata = {
  title: 'Álláspályázatok – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár aktuális álláspályázatai.',
}

export default function AllaspalyazatokPage() {
  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Álláspályázatok' }]} />

        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Álláspályázatok
        </h1>

        <div className="text-[14px] leading-[22px] text-[#333]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <p className="text-center py-8 text-[#666]">
            Jelenleg nincs aktív álláspályázat.
          </p>
          <p className="text-center text-[13px] text-[#999]">
            Az aktuális álláspályázatokat ezen az oldalon tesszük közzé.
          </p>
        </div>
      </div>
    </PageWithSidebar>
  )
}
