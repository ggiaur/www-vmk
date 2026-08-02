import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { getAllGalleries } from '@/lib/payload'
import { Image as ImageIcon, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Galéria – Vörösmarty Mihály Könyvtár',
  description: 'Fotógalériák a Vörösmarty Mihály Könyvtár rendezvényeiről és programjairól.',
}

function isMediaObject(media: unknown): media is { url?: string | null; alt?: string | null } {
  return typeof media === 'object' && media !== null
}

export default async function GaleriaPage() {
  const galleries = await getAllGalleries().catch(() => [])

  return (
    <PageWithSidebar>
      <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Galéria' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-[#159097]" />
          <span>Galéria</span>
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Pillanatképek rendezvényeinkről, foglalkozásainkról és programjainkról.
        </p>
      </div>

      {galleries.length === 0 ? (
        <p className="text-sm text-slate-400 italic text-center py-12">
          Jelenleg nincs feltöltött galéria. Nézzen vissza később!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleries.map((gallery) => {
            const coverUrl = isMediaObject(gallery.coverImage) ? gallery.coverImage.url : undefined
            return (
              <Link
                key={gallery.id}
                href={`/galeria/${gallery.slug}`}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm card-hover-effect block"
              >
                <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                  {coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverUrl} alt={gallery.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900">{gallery.title}</h3>
                  {gallery.eventDate && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(gallery.eventDate).toLocaleDateString('hu-HU')}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
      </div>
    </PageWithSidebar>
  )
}
