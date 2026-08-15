import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'

export const metadata: Metadata = {
  title: 'Foglalkozáskereső – Vörösmarty Mihály Könyvtár',
  description: 'Keresse meg a könyvtárunk által kínált foglalkozásokat.',
}

export default function FoglalkozasKeresoPage() {
  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Foglalkozáskereső' }]} />

        <h1 className="font-serif text-[24px] font-bold text-slate-100 uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Foglalkozáskereső
        </h1>

        <div className="text-[14px] leading-[22px] text-[#333]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <p>
            Keresse meg a könyvtárunk által kínált könyvtári foglalkozásokat korosztály, téma és helyszín szerint.
          </p>
          <p className="text-center py-8 text-[#666]">
            A foglalkozáskereső hamarosan elérhető lesz ezen az oldalon.
          </p>
        </div>
      </div>
    </PageWithSidebar>
  )
}
