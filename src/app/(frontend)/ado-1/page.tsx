import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'

export const metadata: Metadata = {
  title: 'Adó 1% – Vörösmarty Mihály Könyvtár',
  description: 'Támogassa adója 1%-ával a Vörösmarty Mihály Könyvtárat!',
}

export default function Ado1Page() {
  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Adó 1%' }]} />

        <h1 className="font-serif text-[24px] font-bold text-slate-100 uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Adó 1%
        </h1>

        <div className="text-[14px] leading-[22px] text-[#333] space-y-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <p className="text-[16px] font-bold text-center">
            Kérjük, támogassa személyi jövedelemadója 1%-ával a Vörösmarty Mihály Könyvtárat!
          </p>

          <table className="w-full border-collapse mb-6">
            <tbody>
              <tr>
                <td className="py-[10px] px-[15px] border border-[#ddd] font-semibold bg-[#f5f5f5] w-[200px]">
                  Kedvezményezett neve
                </td>
                <td className="py-[10px] px-[15px] border border-[#ddd] font-bold text-[#f59e0b]">
                  Vörösmarty Mihály Könyvtár
                </td>
              </tr>
              <tr>
                <td className="py-[10px] px-[15px] border border-[#ddd] font-semibold bg-[#f9f9f9] w-[200px]">
                  Adószám
                </td>
                <td className="py-[10px] px-[15px] border border-[#ddd] font-bold text-[#f59e0b] text-[18px]">
                  15361428-2-07
                </td>
              </tr>
            </tbody>
          </table>

          <p>
            Az adófelajánlásból befolyt összegből könyvtárunk állománygyarapítást,
            kulturális programokat és szolgáltatásfejlesztést valósít meg.
          </p>
          <p>
            Köszönjük, hogy Ön is támogatja könyvtárunkat!
          </p>
        </div>
      </div>
    </PageWithSidebar>
  )
}
