import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageBlockRenderer, type PageBlock } from '@/components/blocks/PageBlockRenderer'
import { getPageBySlug } from '@/lib/payload'

type Args = {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug.join('/')).catch(() => null)
  if (!page) return { title: 'Oldal – Vörösmarty Mihály Könyvtár' }
  return {
    title: `${page.title} – Vörösmarty Mihály Könyvtár`,
    description: page.metaDescription ?? undefined,
  }
}

export default async function GenericPage({ params }: Args) {
  const { slug } = await params
  const page = await getPageBySlug(slug.join('/')).catch(() => null)

  if (!page) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: page.title }]} />
      <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">{page.title}</h1>
      <PageBlockRenderer blocks={page.layout as unknown as PageBlock[]} />
    </div>
  )
}
