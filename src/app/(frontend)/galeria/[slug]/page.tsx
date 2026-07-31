import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { getGalleryBySlug } from '@/lib/payload'
import { Image as ImageIcon } from 'lucide-react'

type Args = { params: Promise<{ slug: string }> }

function isMediaObject(media: unknown): media is { url?: string | null; alt?: string | null } {
  return typeof media === 'object' && media !== null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const gallery = await getGalleryBySlug(slug).catch(() => null)
  return {
    title: gallery ? `${gallery.title} – VMK Galéria` : 'Galéria – Vörösmarty Mihály Könyvtár',
  }
}

export default async function GaleriaDetailPage({ params }: Args) {
  const { slug } = await params
  const gallery = await getGalleryBySlug(slug).catch(() => null)

  if (!gallery) {
    notFound()
  }

  const images: { url?: string | null; alt?: string | null }[] = (gallery.images ?? []).filter(
    isMediaObject,
  )

  return (
    <article className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Galéria', href: '/galeria' }, { label: gallery.title }]} />

      <h1 className="text-3xl font-black text-slate-900">{gallery.title}</h1>

      {images.length === 0 ? (
        <p className="text-sm text-slate-400 italic flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Ehhez a galériához még nincsenek feltöltött képek.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img: { url?: string | null; alt?: string | null }, idx: number) => (
            <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
              {img.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt={img.alt ?? gallery.title} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
