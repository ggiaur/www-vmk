import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { NewsCard } from '@/components/ui/NewsCard'
import { getPaginatedNews } from '@/lib/payload'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hírek & Közlemények – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár legfrissebb hírei, tájékoztatói és pályázati kiírásai.',
}

const PAGE_SIZE = 12

export default async function HirekPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const params = await searchParams
  const activeCategory = params.category ?? 'all'
  const currentPage = Math.max(1, Number(params.page) || 1)

  const { docs: allNews, totalPages } = await getPaginatedNews({
    page: currentPage,
    limit: PAGE_SIZE,
    category: activeCategory,
  })

  // Fallback adatok ha a DB üres
  const sampleNews = [
    {
      id: 'f1',
      title: 'Nyári olvasójáték és könyvajánló fiataloknak',
      summary: 'Csatlakozz nyári olvasási kihívásunkhoz! Értékes könyvcsomagok várnak a legszorgalmasabb olvasókra.',
      category: 'grant',
      publishedAt: '2026-07-20T10:00:00.000Z',
      slug: 'nyari-olvasojatek-2026',
    },
    {
      id: 'f2',
      title: 'Megújult a Központi Könyvtár Helyismereti Részlege',
      summary: 'Digitális archívumunk bővült és kényelmes kutatóboxok várják a helytörténet iránt érdeklődőket.',
      category: 'announcement',
      publishedAt: '2026-07-15T09:00:00.000Z',
      slug: 'helyismeret-megujulas',
    },
    {
      id: 'f3',
      title: 'Író-olvasó találkozó a Gyermekkönyvtárban',
      summary: 'Vendégünk lesz a népszerű ifjúsági regénysorozat szerzője. Dedikálás és beszélgetés.',
      category: 'general',
      publishedAt: '2026-07-10T14:00:00.000Z',
      slug: 'iro-olvaso-talalkozo',
    },
  ]

  const displayNews = allNews.length > 0 ? allNews : sampleNews
  const buildPageHref = (page: number) => {
    const qs = new URLSearchParams()
    if (activeCategory !== 'all') qs.set('category', activeCategory)
    if (page > 1) qs.set('page', String(page))
    const query = qs.toString()
    return query ? `/hirek?${query}` : '/hirek'
  }

  return (
    <PageWithSidebar>
      <div className="space-y-8">
      <Breadcrumb items={[{ label: 'Hírek & Közlemények' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900">Hírek & Közlemények</h1>
        <p className="text-slate-600 mt-2">
          Kövesse figyelemmel könyvtárunk legfrissebb közleményeit, hirdetményeit és pályázatait.
        </p>

        {/* Kategória szűrő gombok */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { label: 'Összes Hír', value: 'all' },
            { label: 'Friss Hírek', value: 'general' },
            { label: 'Közlemények', value: 'announcement' },
            { label: 'Pályázatok', value: 'grant' },
            { label: 'Archívum', value: 'archive' },
          ].map((cat) => (
            <Link
              key={cat.value}
              href={cat.value === 'all' ? '/hirek' : `/hirek?category=${cat.value}`}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === cat.value
                  ? 'bg-[#159097] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayNews.map((item) => {
          const img = 'featuredImage' in item ? item.featuredImage : undefined
          const imgUrl =
            img && typeof img === 'object' && 'url' in img ? (img.url as string) : undefined
          return (
            <NewsCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              category={item.category}
              publishedAt={
                typeof item.publishedAt === 'string' ? item.publishedAt : new Date().toISOString()
              }
              slug={item.slug}
              imageUrl={imgUrl}
            />
          )
        })}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Lapozás" className="flex items-center justify-center gap-2 pt-4">
          <Link
            href={buildPageHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage <= 1}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border ${
              currentPage <= 1
                ? 'pointer-events-none opacity-40 border-slate-200 text-slate-400'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Előző</span>
          </Link>
          <span className="text-sm text-slate-500 px-2">
            {currentPage}. oldal / {totalPages}
          </span>
          <Link
            href={buildPageHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage >= totalPages}
            className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border ${
              currentPage >= totalPages
                ? 'pointer-events-none opacity-40 border-slate-200 text-slate-400'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Következő</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </nav>
      )}
      </div>
    </PageWithSidebar>
  )
}
