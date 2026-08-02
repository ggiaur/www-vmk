import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { EventCard } from '@/components/ui/EventCard'
import { getUpcomingEvents } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Rendezvények & Programajánló – Vörösmarty Mihály Könyvtár',
  description: 'Könyvklubok, irodalmi estek, gyermekfoglalkozások és kiállítások Székesfehérváron.',
}

export default async function EsemenyekPage({
  searchParams,
}: {
  searchParams: Promise<{ audience?: string }>
}) {
  const params = await searchParams
  const activeAudience = params.audience ?? 'all'

  let allEvents = await getUpcomingEvents(20).catch(() => [])

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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Rendezvények' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900">Rendezvények & Programajánló</h1>
        <p className="text-slate-600 mt-2">
          Könyvtárunk gazdag kulturális és közösségi programokkal várja az érdeklődőket.
        </p>

        {/* Célcsoport szűrők */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { label: 'Minden korosztály', value: 'all' },
            { label: 'Gyerekeknek', value: 'children' },
            { label: 'Fiataloknak', value: 'teens' },
            { label: 'Felnőtteknek', value: 'adults' },
            { label: 'Szenioroknak', value: 'seniors' },
          ].map((aud) => (
            <Link
              key={aud.value}
              href={aud.value === 'all' ? '/esemenyek' : `/esemenyek?audience=${aud.value}`}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeAudience === aud.value
                  ? 'bg-[#e4b02c] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {aud.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  )
}
