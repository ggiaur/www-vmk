import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { DonationForm } from '@/components/forms/DonationForm'
import { getAllPartners } from '@/lib/payload'
import { Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Támogatás – Vörösmarty Mihály Könyvtár',
  description: 'Támogassa a Vörösmarty Mihály Könyvtár programjait és gyűjteményét.',
}

function isMediaObject(media: unknown): media is { url?: string | null; alt?: string | null } {
  return typeof media === 'object' && media !== null
}

export default async function TamogatasPage() {
  const supporters = await getAllPartners('supporter').catch(() => [])

  return (
    <PageWithSidebar>
      <div className="max-w-4xl space-y-8">
      <Breadcrumb items={[{ label: 'Támogatás' }]} />

      <div className="pb-4">
        <h1 className="font-serif text-[24px] font-bold text-slate-100 uppercase pt-[10px] pb-[15px] leading-[26.4px] flex items-center gap-3">
          <Heart className="w-8 h-8 text-[#f59e0b]" />
          <span>Támogassa a Könyvtárat</span>
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Az Ön támogatása segít bővíteni gyűjteményünket, és ingyenes közösségi programokat
          szervezni Székesfehérváron. Jelenleg banki átutalással fogadjuk a felajánlásokat — töltse
          ki az alábbi űrlapot, és kollégánk felveszi Önnel a kapcsolatot.
        </p>
      </div>

      <DonationForm />

      {supporters.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Támogatóink</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {supporters.map((partner) => {
              const logoUrl = isMediaObject(partner.logo) ? partner.logo.url : undefined
              return (
                <div
                  key={partner.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-center h-24"
                >
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt={partner.name} className="max-h-16 max-w-full object-contain" />
                  ) : (
                    <span className="text-sm font-semibold text-slate-600 text-center">{partner.name}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
      </div>
    </PageWithSidebar>
  )
}
