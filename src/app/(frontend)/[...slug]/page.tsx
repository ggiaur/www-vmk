import React from 'react'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Phone, Mail, Building2 } from 'lucide-react'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageBlockRenderer, type PageBlock } from '@/components/blocks/PageBlockRenderer'
import { getPageBySlug, getStaffBySlug, getGalleryBySlug } from '@/lib/payload'
import { legacyGalleryArchiveSlugSet } from '@/data/legacyGalleryArchiveSlugs'

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
    const gallery = await getGalleryBySlug(slug[0]).catch(() => null)
    if (gallery) return { title: `${gallery.title} – VMK Galéria` }
  }
  return { title: 'Oldal – Vörösmarty Mihály Könyvtár' }
}

export default async function GenericPage({ params }: Args) {
  const { slug } = await params
  const joined = slug.join('/')

  // The reference's own gallery URL scheme (/gallery/folder/NNNN, and one
  // discovered oddity, /gallery/gallery/NNNN -- apparently a stray link on
  // the reference's own markup, not a typo on our side) is multi-segment,
  // outside the single-segment resolver below. Handled here directly:
  // never a path any of our own content would link to, but still a
  // discovered gallery-archive-family member that needs a controlled,
  // non-404 target per the H2 full-sweep requirement. Broadened to any
  // `/gallery/...` first segment rather than enumerating each specific
  // sub-scheme, so it also covers variants the crawl didn't happen to hit.
  if (slug[0] === 'gallery') redirect('/galeria')

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
                  <Building2 className="w-4 h-4 text-[#137F85]" />
                  {departmentName}
                </p>
              )}
              {staff.phone ? (
                <a href={`tel:${staff.phone}`} className="flex items-center gap-1.5 text-sm hover:underline">
                  <Phone className="w-4 h-4 text-[#137F85]" />
                  {staff.phone as string}
                </a>
              ) : null}
              {staff.email ? (
                <a href={`mailto:${staff.email}`} className="flex items-center gap-1.5 text-sm text-[#137F85] hover:underline">
                  <Mail className="w-4 h-4" />
                  {staff.email as string}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )
    }
    // H2 (full-site saturation crawl, 2026-08-16): the reference's
    // multi-year /gallery/folder/ photo-archive links to ~1600+ individual
    // dated event/album slugs at this same top-level namespace (e.g.
    // /a-ko-marad-2025-01-29). Re-hosting that archive 1:1 (which would
    // mean actually re-uploading years of photos, not just text) is out of
    // scope for this round -- but every one of those URLs still needs a
    // real, deterministic clone target instead of a 404. Two-tier
    // resolution, not per-URL redirects:
    //  1. If a real Gallery with this exact slug already exists (44/46 of
    //     our currently-imported galleries share the reference's exact
    //     slug), send the visitor straight to that real gallery page.
    //  2. Otherwise, if the slug is a known member of the reference's
    //     gallery-archive family (docs/FULL_SITE_ROUTE_MATRIX.md has the
    //     family-membership rule and full count), fall back to the
    //     general /galeria listing rather than 404ing.
    const gallery = await getGalleryBySlug(slug[0]).catch(() => null)
    if (gallery) redirect(`/galeria/${gallery.slug}`)
    if (legacyGalleryArchiveSlugSet.has(slug[0])) redirect('/galeria')
  }

  notFound()
}
