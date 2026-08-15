import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { getAllProducts } from '@/lib/payload'
import { ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bolt – Vörösmarty Mihály Könyvtár',
  description: 'Selejtezett könyvek és könyvtári ajándéktárgyak.',
}

function isMediaObject(media: unknown): media is { url?: string | null } {
  return typeof media === 'object' && media !== null
}

const categoryLabels: Record<string, string> = {
  used_book: 'Selejtezett Könyv',
  gift: 'Ajándéktárgy',
  other: 'Egyéb',
}

export default async function BoltPage() {
  const products = await getAllProducts().catch(() => [])

  return (
    <PageWithSidebar>
      <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Bolt' }]} />

      <div className="pb-4">
        <h1 className="font-serif text-[24px] font-bold text-slate-100 uppercase pt-[10px] pb-[15px] leading-[26.4px]">Bolt</h1>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-slate-400 italic text-center py-12">
          Jelenleg nincs elérhető termék.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => {
            const imageUrl = isMediaObject(product.image) ? product.image.url : undefined
            return (
              <Link
                key={product.id}
                href={`/bolt/${product.slug}`}
                className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm card-hover-effect block"
              >
                <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-[#f59e0b] font-semibold">
                    {categoryLabels[product.category] ?? product.category}
                  </span>
                  <h3 className="font-bold text-slate-900 mt-1.5">{product.title}</h3>
                  <p className="text-sm font-semibold text-slate-700 mt-1">
                    {product.price.toLocaleString('hu-HU')} Ft
                  </p>
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
