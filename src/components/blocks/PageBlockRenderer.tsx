import React from 'react'
import Link from 'next/link'
import { FileText, Download, MapPin, Phone, Mail } from 'lucide-react'
import { RichTextRenderer } from '@/components/ui/RichTextRenderer'

type MediaDoc = { url?: string | null; alt?: string | null } | string | null | undefined
type DocumentDoc = {
  id: string | number
  title: string
  file?: MediaDoc
} | string | number

type PageBlock =
  | {
      blockType: 'hero'
      id: string
      heading: string
      subheading?: string | null
      image?: MediaDoc
      ctaLabel?: string | null
      ctaHref?: string | null
    }
  | {
      blockType: 'richText'
      id: string
      content: any
    }
  | {
      blockType: 'contactInfo'
      id: string
      title?: string | null
      address?: string | null
      phone?: string | null
      email?: string | null
      mapEmbedUrl?: string | null
    }
  | {
      blockType: 'downloads'
      id: string
      title?: string | null
      documents?: DocumentDoc[] | null
    }
  | {
      blockType: 'accordion'
      id: string
      title?: string | null
      items?: { question: string; answer: any }[] | null
    }
  | {
      blockType: 'partnersGrid'
      id: string
      title?: string | null
      partners?: PartnerDoc[] | null
    }

type PartnerDoc =
  | {
      id: string | number
      name: string
      url?: string | null
      logo?: MediaDoc
    }
  | string
  | number

function isMediaObject(media: MediaDoc): media is { url?: string | null; alt?: string | null } {
  return typeof media === 'object' && media !== null
}

export function PageBlockRenderer({ blocks }: { blocks: PageBlock[] | null | undefined }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className="space-y-10">
      {blocks.map((block) => {
        switch (block.blockType) {
          case 'hero': {
            const imageUrl = isMediaObject(block.image) ? block.image.url : undefined
            return (
              <section
                key={block.id}
                className="relative rounded-2xl overflow-hidden bg-slate-900 text-white"
              >
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={isMediaObject(block.image) ? block.image.alt ?? '' : ''}
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                )}
                <div className="relative px-6 py-16 sm:py-24 text-center space-y-4 max-w-3xl mx-auto">
                  <h1 className="text-3xl sm:text-4xl font-black">{block.heading}</h1>
                  {block.subheading && (
                    <p className="text-slate-200 text-lg">{block.subheading}</p>
                  )}
                  {block.ctaLabel && block.ctaHref && (
                    <Link
                      href={block.ctaHref}
                      className="inline-block mt-2 px-5 py-2.5 rounded-lg bg-[#F3701D] hover:bg-[#D4590F] font-semibold text-sm"
                    >
                      {block.ctaLabel}
                    </Link>
                  )}
                </div>
              </section>
            )
          }
          case 'richText':
            return <RichTextRenderer key={block.id} content={block.content} />
          case 'contactInfo':
            return (
              <section
                key={block.id}
                className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
              >
                {block.title && (
                  <h2 className="text-xl font-bold text-slate-900">{block.title}</h2>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                  {block.address && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#DDB837]" />
                      {block.address}
                    </span>
                  )}
                  {block.phone && (
                    <a
                      href={`tel:${block.phone}`}
                      className="flex items-center gap-1.5 hover:underline"
                    >
                      <Phone className="w-4 h-4 text-[#DDB837]" />
                      {block.phone}
                    </a>
                  )}
                  {block.email && (
                    <a
                      href={`mailto:${block.email}`}
                      className="flex items-center gap-1.5 hover:underline"
                    >
                      <Mail className="w-4 h-4 text-[#DDB837]" />
                      {block.email}
                    </a>
                  )}
                </div>
                {block.mapEmbedUrl && (
                  <iframe
                    src={block.mapEmbedUrl}
                    title={block.title ?? 'Térkép'}
                    className="w-full h-72 rounded-lg border-0"
                    loading="lazy"
                  />
                )}
              </section>
            )
          case 'downloads':
            return (
              <section key={block.id} className="space-y-3">
                {block.title && (
                  <h2 className="text-xl font-bold text-slate-900">{block.title}</h2>
                )}
                <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {(block.documents ?? []).map((doc) => {
                    if (typeof doc !== 'object') return null
                    const fileUrl = isMediaObject(doc.file) ? doc.file.url : undefined
                    return (
                      <li key={doc.id} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50">
                        <span className="flex items-center gap-2 text-sm text-slate-800">
                          <FileText className="w-4 h-4 text-[#F3701D]" />
                          {doc.title}
                        </span>
                        {fileUrl && (
                          <a
                            href={fileUrl}
                            className="flex items-center gap-1 text-xs font-semibold text-[#F3701D] hover:underline"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Letöltés
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          case 'accordion':
            return (
              <section key={block.id} className="space-y-3">
                {block.title && (
                  <h2 className="text-xl font-bold text-slate-900">{block.title}</h2>
                )}
                <div className="space-y-2">
                  {(block.items ?? []).map((item, idx) => (
                    <details
                      key={idx}
                      className="group bg-white border border-slate-200 rounded-lg px-4 py-3"
                    >
                      <summary className="cursor-pointer font-semibold text-slate-900 text-sm">
                        {item.question}
                      </summary>
                      <div className="mt-2">
                        <RichTextRenderer content={item.answer} />
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )
          case 'partnersGrid':
            return (
              <section key={block.id} className="space-y-4">
                {block.title && (
                  <h2 className="text-xl font-bold text-slate-900">{block.title}</h2>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(block.partners ?? []).map((partner) => {
                    if (typeof partner !== 'object') return null
                    const logoUrl = isMediaObject(partner.logo) ? partner.logo.url : undefined
                    const content = (
                      <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-center h-24">
                        {logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={logoUrl}
                            alt={isMediaObject(partner.logo) ? partner.logo.alt ?? partner.name : partner.name}
                            className="max-h-16 max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-slate-600 text-center">
                            {partner.name}
                          </span>
                        )}
                      </div>
                    )
                    return partner.url ? (
                      <a key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer">
                        {content}
                      </a>
                    ) : (
                      <div key={partner.id}>{content}</div>
                    )
                  })}
                </div>
              </section>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
