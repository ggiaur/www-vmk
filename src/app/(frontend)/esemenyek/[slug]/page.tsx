import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { RichTextRenderer } from '@/components/ui/RichTextRenderer'
import { RsvpForm } from '@/components/forms/RsvpForm'
import { getEventBySlug, getRegistrationCountForEvent } from '@/lib/payload'
import { Calendar, MapPin, Users, ArrowLeft, ExternalLink } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug).catch(() => null)
  return {
    title: event ? `${event.title} – VMK Esemény` : 'Rendezvény – Vörösmarty Mihály Könyvtár',
    description: 'Rendezvény részletei',
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEventBySlug(slug).catch(() => null)

  const title = event?.title ?? 'Kortárs Könyvklub: Nyári Könyvmustra'
  const startDate = event?.startDate ?? '2026-08-05T17:00:00.000Z'
  const dateObj = new Date(startDate)
  const formattedDate = dateObj.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  const formattedTime = dateObj.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })

  const loc = event?.location
  const locationName =
    loc && typeof loc === 'object' && 'name' in loc
      ? (loc.name as string)
      : 'Központi Könyvtár – Olvasóterem (Bartók Béla tér 1.)'

  const remainingSpots =
    event?.capacity != null
      ? event.capacity - (await getRegistrationCountForEvent(event.id))
      : null

  return (
    <article className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Rendezvények', href: '/esemenyek' },
          { label: title },
        ]}
      />

      <div className="space-y-4">
        <Link
          href="/esemenyek"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#159097] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Vissza a rendezvényekhez</span>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          {title}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-amber-50/80 p-5 rounded-xl border border-amber-200 text-sm">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#159097] shrink-0" />
          <div>
            <span className="block text-xs text-slate-500 font-medium">Időpont</span>
            <strong className="text-slate-900">{formattedDate} ({formattedTime})</strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-[#e4b02c] shrink-0" />
          <div>
            <span className="block text-xs text-slate-500 font-medium">Helyszín</span>
            <strong className="text-slate-900">{locationName}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#159097] shrink-0" />
          <div>
            <span className="block text-xs text-slate-500 font-medium">Célcsoport</span>
            <strong className="text-slate-900">Minden érdeklődő</strong>
          </div>
        </div>
      </div>

      {event?.description ? (
        <RichTextRenderer content={event.description} />
      ) : (
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
          <p>
            Szeretettel várunk minden könyvbarátot havi rendszerességű könyvklubunk következő alkalmára! A találkozó során a legújabb kortárs magyar és külföldi regényeket beszéljük át egy kellemes tea/kávé mellett.
          </p>
          <p>
            A belépés ingyenes, de az olvasóterem befogadóképessége miatt előzetes regisztráció ajánlott!
          </p>
        </div>
      )}

      {event?.capacity != null && event.id && (
        <RsvpForm eventId={String(event.id)} eventSlug={slug} remainingSpots={remainingSpots} />
      )}

      {event?.registrationUrl && (
        <div className="p-6 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <h3 className="font-bold text-lg">Regisztráció a rendezvényre</h3>
            <p className="text-xs text-slate-300">Biztosítsa helyét időben az ingyenes alkalmon!</p>
          </div>
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-catalog shrink-0 text-sm"
          >
            <span>Regisztráció most</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </article>
  )
}
