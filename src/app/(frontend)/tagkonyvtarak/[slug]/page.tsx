import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { RichTextRenderer } from '@/components/ui/RichTextRenderer'
import { getLibraryBySlug, getOpeningHoursForLibrary, formatOpeningHours } from '@/lib/payload'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

type Args = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const branch = await getLibraryBySlug(slug).catch(() => null)
  return {
    title: branch ? `${branch.name} – Vörösmarty Mihály Könyvtár` : 'Tagkönyvtár – Vörösmarty Mihály Könyvtár',
  }
}

export default async function TagkonyvtarDetailPage({ params }: Args) {
  const { slug } = await params
  const branch = await getLibraryBySlug(slug).catch(() => null)

  if (!branch || branch.type !== 'branch') {
    notFound()
  }

  const hours = await getOpeningHoursForLibrary(branch.id).catch(() => [])
  const schedule = formatOpeningHours(hours)

  return (
    <PageWithSidebar>
      <article className="max-w-4xl space-y-8">
      <Breadcrumb items={[{ label: 'Tagkönyvtárak', href: '/tagkonyvtarak' }, { label: branch.name }]} />

      <div>
        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">{branch.name}</h1>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#7c3aed]" />
            {branch.address}
          </span>
          {branch.phone && (
            <a href={`tel:${branch.phone}`} className="flex items-center gap-1.5 hover:underline">
              <Phone className="w-4 h-4 text-[#7c3aed]" />
              {branch.phone}
            </a>
          )}
          {branch.email && (
            <a href={`mailto:${branch.email}`} className="flex items-center gap-1.5 hover:underline">
              <Mail className="w-4 h-4 text-[#7c3aed]" />
              {branch.email}
            </a>
          )}
        </div>
      </div>

      {branch.description && <RichTextRenderer content={branch.description} />}

      {schedule.length > 0 && (
        <div className="bg-white rounded border border-slate-200 p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2563eb]" />
            Nyitvatartás
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            {schedule.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                <span className="block font-semibold mb-1 text-slate-600">{item.day}</span>
                <span className="font-bold text-slate-800">{item.hours}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      </article>
    </PageWithSidebar>
  )
}
