import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { getAllGalleries } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Galéria – Vörösmarty Mihály Könyvtár',
  description: 'Fotógalériák a Vörösmarty Mihály Könyvtár rendezvényeiről és programjairól.',
}

const FALLBACK_CATEGORIES = [
  { label: '2026', slug: '2026' },
  { label: '2025', slug: '2025' },
  { label: '2024', slug: '2024' },
  { label: '2023', slug: '2023' },
  { label: '2022', slug: '2022' },
  { label: '2021', slug: '2021' },
  { label: '2019-2020', slug: '2019-2020' },
  { label: 'Rendezvénysorozatok', slug: 'rendezvenyek' },
  { label: 'Központi Könyvtár', slug: 'kozponti' },
  { label: 'Tagkönyvtárak', slug: 'tagkonyvtarak' },
  { label: 'Pályázatok', slug: 'palyazatok' },
]

const TEAL = '#2563eb'

export default async function GaleriaPage() {
  const galleries = await getAllGalleries().catch(() => [])

  const items = galleries.length > 0
    ? galleries.map((g) => ({ label: g.title, slug: g.slug }))
    : FALLBACK_CATEGORIES

  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Galéria' }]} />

        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Galéria
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px]">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/galeria/${item.slug}`}
              className="block relative overflow-hidden"
              style={{ backgroundColor: TEAL }}
            >
              <div className="flex items-center justify-center py-[30px] px-[20px]">
                {/* VMK logo watermark */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/logos/vmk-logo.png"
                  alt=""
                  className="w-[80px] h-[80px] object-contain opacity-50"
                  aria-hidden="true"
                />
              </div>
              <div
                className="flex items-center justify-between px-[15px] py-[8px] text-white font-bold text-[14px]"
                style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
              >
                <span>{item.label}</span>
                <span className="text-[20px]">&gt;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageWithSidebar>
  )
}
