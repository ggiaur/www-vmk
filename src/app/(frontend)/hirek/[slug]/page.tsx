import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { RichTextRenderer } from '@/components/ui/RichTextRenderer'
import { getNewsBySlug } from '@/lib/payload'
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsBySlug(slug).catch(() => null)
  return {
    title: article ? `${article.title} – VMK Hírek` : 'Hír – Vörösmarty Mihály Könyvtár',
    description: article?.summary ?? 'Könyvtári hír részletei',
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getNewsBySlug(slug).catch(() => null)

  const title = article?.title ?? 'Nyári olvasójáték és könyvajánló fiataloknak'
  const summary =
    article?.summary ??
    'Csatlakozz nyári olvasási kihívásunkhoz! Értékes könyvcsomagok és ajándékutalványok várnak a legszorgalmasabb olvasókra a Vörösmarty Mihály Könyvtárban.'
  const publishedAt = article?.publishedAt ?? '2026-07-20T10:00:00.000Z'

  const formattedDate = new Date(publishedAt).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const featuredImage = article?.featuredImage
  const featuredImageUrl =
    featuredImage && typeof featuredImage === 'object' ? featuredImage.url : undefined
  const featuredImageAlt =
    (featuredImage && typeof featuredImage === 'object' ? featuredImage.alt : undefined) ?? title

  return (
    <PageWithSidebar>
      <article className="max-w-4xl space-y-8">
      <Breadcrumb
        items={[
          { label: 'Hírek', href: '/hirek' },
          { label: title },
        ]}
      />

      <div className="space-y-4">
        <Link
          href="/hirek"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#159097] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Vissza a hírekhez</span>
        </Link>

        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-200 pb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-[#e4b02c]" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4 text-[#e4b02c]" />
            VMK Szerkesztőség
          </span>
        </div>
      </div>

      {featuredImageUrl && (
        <div className="rounded overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featuredImageUrl} alt={featuredImageAlt} className="w-full h-auto object-cover" />
        </div>
      )}

      <div className="bg-amber-50/60 border-l-4 border-[#159097] p-4 rounded-r-lg text-slate-800 text-base leading-relaxed font-medium">
        {summary}
      </div>

      {article?.content ? (
        <RichTextRenderer content={article.content} />
      ) : (
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
          <p>
            Kedves Olvasóink! Örömmel értesítjük Önöket, hogy a Vörösmarty Mihály Könyvtár minden tagkönyvtárában elindult az idei nyári könyvajánló és olvasóprogram.
          </p>
          <p>
            A részvételhez elegendő érvényes olvasójeggyel rendelkezni és kikölcsönözni legalább 3 kiemelt könyvet a nyári ajánlólistánkról. A részletes szabályzat és a könyvlista beszerezhető a könyvtárak kölcsönző pultjainál.
          </p>
        </div>
      )}

      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <Link
          href="/hirek"
          className="btn-primary text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Összes hír</span>
        </Link>

        <button
          onClick={undefined}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Megosztás</span>
        </button>
      </div>
      </article>
    </PageWithSidebar>
  )
}
