import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Phone, Mail, Building2 } from 'lucide-react'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageBlockRenderer, type PageBlock } from '@/components/blocks/PageBlockRenderer'
import { getPageBySlug, getStaffBySlug } from '@/lib/payload'

type Args = {
  params: Promise<{ slug: string[] }>
}

type MediaDoc = { url?: string | null; alt?: string | null } | string | null | undefined
type LibraryDoc = { name?: string } | string | null | undefined

function isMediaObject(m: MediaDoc): m is { url?: string | null; alt?: string | null } {
  return typeof m === 'object' && m !== null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const joined = slug.join('/')
  const page = await getPageBySlug(joined).catch(() => null)
  if (page) {
    return { title: `${page.title} – Vörösmarty Mihály Könyvtár`, description: page.metaDescription ?? undefined }
  }
  // Individual staff bio pages (e.g. /anyos-darinka) are single-segment
  // top-level slugs sharing this same catch-all, mirroring how the
  // reference site structures them -- see src/lib/scraper/
  // vmkStaffScraper.ts backfillStaffSlugs() for the root-cause fix this
  // supports (E1 depth-2 audit, 2026-08-16).
  if (slug.length === 1) {
    const staff = await getStaffBySlug(slug[0]).catch(() => null)
    if (staff) return { title: `${staff.name} – Vörösmarty Mihály Könyvtár` }
  }
  return { title: 'Oldal – Vörösmarty Mihály Könyvtár' }
}

export default async function GenericPage({ params }: Args) {
  const { slug } = await params
  const joined = slug.join('/')
  const page = await getPageBySlug(joined).catch(() => null)

  if (page) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        <Breadcrumb items={[{ label: page.title }]} />
        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">{page.title}</h1>
        <PageBlockRenderer blocks={page.layout as unknown as PageBlock[]} />
      </div>
    )
  }

  if (slug.length === 1) {
    const staff = await getStaffBySlug(slug[0]).catch(() => null)
    if (staff) {
      const avatarUrl = isMediaObject(staff.avatar as MediaDoc) ? (staff.avatar as { url?: string | null }).url : undefined
      const department = staff.department as LibraryDoc
      const departmentName = typeof department === 'object' && department ? department.name : undefined
      return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          <Breadcrumb items={[{ label: 'Munkatársaink', href: '/munkatarsak' }, { label: staff.name as string }]} />
          <div className="flex items-start gap-5 bg-white border border-slate-200 rounded-lg p-6">
            {avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={staff.name as string} className="w-24 h-24 rounded-full object-cover shrink-0" />
            )}
            <div className="space-y-2">
              <h1 className="font-serif text-[22px] font-bold text-[#333333]">{staff.name as string}</h1>
              <p className="text-slate-600">{staff.position as string}</p>
              {departmentName && (
                <p className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Building2 className="w-4 h-4 text-[#159097]" />
                  {departmentName}
                </p>
              )}
              {staff.phone ? (
                <a href={`tel:${staff.phone}`} className="flex items-center gap-1.5 text-sm hover:underline">
                  <Phone className="w-4 h-4 text-[#159097]" />
                  {staff.phone as string}
                </a>
              ) : null}
              {staff.email ? (
                <a href={`mailto:${staff.email}`} className="flex items-center gap-1.5 text-sm text-[#159097] hover:underline">
                  <Mail className="w-4 h-4" />
                  {staff.email as string}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )
    }
  }

  notFound()
}
