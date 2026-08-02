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
  const dept = await getLibraryBySlug(slug).catch(() => null)
  return {
    title: dept ? `${dept.name} – Vörösmarty Mihály Könyvtár` : 'Részleg – Vörösmarty Mihály Könyvtár',
  }
}

export default async function ReszlegDetailPage({ params }: Args) {
  const { slug } = await params
  const dept = await getLibraryBySlug(slug).catch(() => null)

  if (!dept || dept.type !== 'department') {
    notFound()
  }

  const hours = await getOpeningHoursForLibrary(dept.id).catch(() => [])
  const schedule = formatOpeningHours(hours)

  return (
    <PageWithSidebar>
      <article className="max-w-4xl space-y-8">
      <Breadcrumb items={[{ label: 'Részlegek', href: '/reszlegek' }, { label: dept.name }]} />

      <div>
        <h1 className="text-3xl font-black text-slate-900">{dept.name}</h1>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#e4b02c]" />
            {dept.address}
          </span>
          {dept.phone && (
            <a href={`tel:${dept.phone}`} className="flex items-center gap-1.5 hover:underline">
              <Phone className="w-4 h-4 text-[#e4b02c]" />
              {dept.phone}
            </a>
          )}
          {dept.email && (
            <a href={`mailto:${dept.email}`} className="flex items-center gap-1.5 hover:underline">
              <Mail className="w-4 h-4 text-[#e4b02c]" />
              {dept.email}
            </a>
          )}
        </div>
      </div>

      {dept.description && <RichTextRenderer content={dept.description} />}

      {schedule.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#159097]" />
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
