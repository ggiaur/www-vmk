import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { NewsCard } from '@/components/ui/NewsCard'
import { getArchivedNews } from '@/lib/payload'
import { Archive } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Programarchívum – Vörösmarty Mihály Könyvtár',
  description: 'Korábbi évek programjai, rendezvényei és híranyagai a Vörösmarty Mihály Könyvtárból (2012–).',
}

function isMediaObject(media: unknown): media is { url?: string | null } {
  return typeof media === 'object' && media !== null
}

export default async function ProgramarchivumPage() {
  const archivedNews = await getArchivedNews().catch(() => [])

  return (
    <PageWithSidebar>
      <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Programarchívum' }]} />

      <div className="pb-4">
        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px] flex items-center gap-3">
          <Archive className="w-8 h-8 text-[#137F85]" />
          <span>Programarchívum</span>
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Korábbi évek lezárult programjai, rendezvényei és híranyagai — történeti gyűjtemény, nem
          aktuális esemény. Aktuális, közelgő programokért lásd az{' '}
          <Link href="/esemenyek" className="text-[#137F85] font-semibold hover:underline">
            Eseménykalendáriumot
          </Link>
          .
        </p>
      </div>

      {archivedNews.length === 0 ? (
        <p className="text-sm text-slate-500 italic text-center py-12">
          Jelenleg nincs archivált tartalom a rendszerben.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {archivedNews.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              category={item.category}
              publishedAt={item.publishedAt}
              slug={item.slug}
              imageUrl={isMediaObject(item.featuredImage) ? item.featuredImage.url ?? undefined : undefined}
            />
          ))}
        </div>
      )}
      </div>
    </PageWithSidebar>
  )
}
