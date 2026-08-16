import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { EventCard } from '@/components/ui/EventCard'
import { getUpcomingEvents } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Rendezvények & Programajánló – Vörösmarty Mihály Könyvtár',
  description: 'Könyvklubok, irodalmi estek, gyermekfoglalkozások és kiállítások Székesfehérváron.',
}

export default async function EsemenyekPage({
  searchParams,
}: {
  searchParams: Promise<{ audience?: string; sort?: string }>
}) {
  const params = await searchParams
  const activeAudience = params.audience ?? 'all'
  const sortDirection = params.sort === 'desc' ? 'desc' : 'asc'

  let allEvents = await getUpcomingEvents(20, sortDirection).catch(() => [])

  if (activeAudience !== 'all') {
    allEvents = allEvents.filter((item) => item.targetAudience === activeAudience)
  }

  const sampleEvents = [
    {
      id: 'e1',
      title: 'Kortárs Könyvklub: Nyári Könyvmustra',
      startDate: '2026-08-05T17:00:00.000Z',
      locationName: 'Központi Könyvtár – Olvasóterem',
      targetAudience: 'adults',
      slug: 'kortars-konyvklub-augusztus',
    },
    {
      id: 'e2',
      title: 'Mesedélután és Kézműves Foglalkozás',
      startDate: '2026-08-12T15:30:00.000Z',
      locationName: 'Gyermekkönyvtár (Bartók B. tér 1.)',
      targetAudience: 'children',
      slug: 'mesedelutan-gyermekkonyvtar',
    },
    {
      id: 'e3',
      title: 'Szenior Helytörténeti Előadás: Régi Fehérvár',
      startDate: '2026-08-18T10:00:00.000Z',
      locationName: 'Budai Úti Tagkönyvtár',
      targetAudience: 'seniors',
      slug: 'szenior-helytorteneti-eloadas',
    },
  ]

  const displayEvents = allEvents.length > 0 ? allEvents : sampleEvents

  return (
    <PageWithSidebar>
      <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Rendezvények' }]} />

      <div className="pb-4">
        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">Rendezvények</h1>

        {/* Célcsoport szűrők + dátum-rendezés - a valós vmk.hu esemény-listája
            is szűrő legördülőkkel és dátum növekvő/csökkenő rendezéssel
            dolgozik, rácsos kártyák helyett lineáris listával. */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Minden korosztály', value: 'all' },
              { label: 'Gyerekeknek', value: 'children' },
              { label: 'Fiataloknak', value: 'teens' },
              { label: 'Felnőtteknek', value: 'adults' },
              { label: 'Szenioroknak', value: 'seniors' },
            ].map((aud) => {
              const qs = new URLSearchParams()
              if (aud.value !== 'all') qs.set('audience', aud.value)
              if (sortDirection !== 'asc') qs.set('sort', sortDirection)
              const href = qs.toString() ? `/esemenyek?${qs.toString()}` : '/esemenyek'
              return (
                <Link
                  key={aud.value}
                  href={href}
                  className={`px-4 py-2 rounded text-[13px] font-bold transition-colors ${
                    activeAudience === aud.value
                      ? 'bg-[#e4b02c] text-[#1B1B1B] shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {aud.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold">
            {(['asc', 'desc'] as const).map((dir) => {
              const qs = new URLSearchParams()
              if (activeAudience !== 'all') qs.set('audience', activeAudience)
              if (dir !== 'asc') qs.set('sort', dir)
              const href = qs.toString() ? `/esemenyek?${qs.toString()}` : '/esemenyek'
              return (
                <Link
                  key={dir}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    sortDirection === dir
                      ? 'bg-[#137F85] text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dir === 'asc' ? 'Növekvő' : 'Csökkenő'}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {displayEvents.map((event) => {
          const loc = 'location' in event ? event.location : undefined
          const locationName =
            loc && typeof loc === 'object' && 'name' in loc
              ? (loc.name as string)
              : 'locationName' in event
                ? (event.locationName as string)
                : 'VMK Székesfehérvár'
          return (
            <EventCard
              key={event.id}
              title={event.title}
              startDate={
                typeof event.startDate === 'string'
                  ? event.startDate
                  : new Date().toISOString()
              }
              locationName={locationName}
              targetAudience={event.targetAudience}
              slug={event.slug}
              registrationUrl={'registrationUrl' in event ? event.registrationUrl ?? undefined : undefined}
            />
          )
        })}
      </div>
      </div>
    </PageWithSidebar>
  )
}
