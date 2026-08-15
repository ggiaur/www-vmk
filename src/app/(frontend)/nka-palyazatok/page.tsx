import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'

export const metadata: Metadata = {
  title: 'NKA pályázatok – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár Nemzeti Kulturális Alap pályázatai.',
}

export default function NkaPalyazatokPage() {
  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'NKA pályázatok' }]} />

        <h1 className="font-serif text-[24px] font-bold text-slate-100 uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          NKA pályázatok
        </h1>

        <div className="text-[14px] leading-[22px] text-[#333]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <p>
            A Vörösmarty Mihály Könyvtár rendszeresen pályázik a Nemzeti Kulturális Alap
            által kiírt pályázatokra, amelyek segítségével állománygyarapítást, programszervezést
            és infrastrukturális fejlesztéseket valósít meg.
          </p>
          <p className="text-center py-8 text-[#666]">
            Az aktuális NKA pályázatokról ezen az oldalon tájékoztatjuk olvasóinkat.
          </p>
        </div>
      </div>
    </PageWithSidebar>
  )
}
