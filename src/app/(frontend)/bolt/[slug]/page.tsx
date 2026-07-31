import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { getProductBySlug } from '@/lib/payload'
import { ShoppingBag, Mail } from 'lucide-react'

type Args = { params: Promise<{ slug: string }> }

function isMediaObject(media: unknown): media is { url?: string | null } {
  return typeof media === 'object' && media !== null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)
  return { title: product ? `${product.title} – VMK Bolt` : 'Termék – Vörösmarty Mihály Könyvtár' }
}

export default async function ProductDetailPage({ params }: Args) {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)

  if (!product) {
    notFound()
  }

  const imageUrl = isMediaObject(product.image) ? product.image.url : undefined

  return (
    <article className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Bolt', href: '/bolt' }, { label: product.title }]} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <ShoppingBag className="w-12 h-12 text-slate-300" />
          )}
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-black text-slate-900">{product.title}</h1>
          <p className="text-xl font-bold text-[#F3701D]">{product.price.toLocaleString('hu-HU')} Ft</p>
          {product.description && <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>}
          <a
            href="/kapcsolat"
            className="btn-primary inline-flex text-sm"
          >
            <Mail className="w-4 h-4" />
            <span>Érdeklődöm ezen a terméken</span>
          </a>
          <p className="text-[11px] text-slate-400">
            A vásárláshoz keresse fel személyesen a Központi Könyvtárat, vagy vegye fel velünk a
            kapcsolatot.
          </p>
        </div>
      </div>
    </article>
  )
}
