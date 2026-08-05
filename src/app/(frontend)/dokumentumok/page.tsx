import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { getAllDocuments } from '@/lib/payload'
import { Download } from 'lucide-react'

function isMediaObject(media: unknown): media is { url?: string | null } {
  return typeof media === 'object' && media !== null
}

export const metadata: Metadata = {
  title: 'Dokumentumtár – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár közérdekű dokumentumai, szabályzatai és letölthető nyomtatványai.',
}

const catLabels: Record<string, string> = {
  szmsz: 'SZMSZ & Szabályzat',
  report: 'Éves Beszámoló',
  grant: 'Pályázati Kiírás',
  form: 'Űrlap',
  other: 'Egyéb',
}

export default async function DokumentumokPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const activeCategory = params.category

  const docs = await getAllDocuments(activeCategory).catch(() => [])

  const defaultDocs = [
    { id: 'd1', title: 'VMK Szervezeti és Működési Szabályzata (SZMSZ 2026)', category: 'szmsz', year: 2026 },
    { id: 'd2', title: 'Könyvtárhasználati és Szolgáltatási Szabályzat', category: 'szmsz', year: 2026 },
    { id: 'd3', title: 'VMK Éves Szakmai és Pénzügyi Beszámoló 2025', category: 'report', year: 2025 },
    { id: 'd4', title: 'Beiratkozási és Adatkezelési Nyilatkozat Űrlap (PDF)', category: 'form', year: 2026 },
  ]

  const displayDocs = docs.length > 0 ? docs : defaultDocs

  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Dokumentumtár' }]} />

        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Dokumentumtár
        </h1>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {[
            { label: 'Összes', value: undefined },
            { label: 'SZMSZ', value: 'szmsz' },
            { label: 'Beszámolók', value: 'report' },
            { label: 'Pályázatok', value: 'grant' },
            { label: 'Űrlapok', value: 'form' },
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.value ? `/dokumentumok?category=${cat.value}` : '/dokumentumok'}
              className={`px-[12px] py-[6px] rounded text-[13px] font-bold transition-colors ${
                activeCategory === cat.value
                  ? 'bg-[#159097] text-white'
                  : 'bg-white border border-[#ddd] text-[#333] hover:bg-[#f5f5f5]'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Document table */}
        <table className="w-full border-collapse text-[14px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <thead>
            <tr>
              <th className="text-left py-[8px] px-[15px] border border-[#ddd] bg-[#159097] text-white font-bold">
                Dokumentum neve
              </th>
              <th className="text-left py-[8px] px-[15px] border border-[#ddd] bg-[#159097] text-white font-bold w-[120px]">
                Kategória
              </th>
              <th className="text-center py-[8px] px-[15px] border border-[#ddd] bg-[#159097] text-white font-bold w-[60px]">
                Év
              </th>
              <th className="text-center py-[8px] px-[15px] border border-[#ddd] bg-[#159097] text-white font-bold w-[100px]">
                Letöltés
              </th>
            </tr>
          </thead>
          <tbody>
            {displayDocs.map((doc, i) => {
              const fileUrl = 'file' in doc && isMediaObject(doc.file) ? doc.file.url ?? undefined : undefined
              return (
                <tr key={doc.id}>
                  <td
                    className="py-[8px] px-[15px] border border-[#ddd]"
                    style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                  >
                    {doc.title}
                  </td>
                  <td
                    className="py-[8px] px-[15px] border border-[#ddd] text-[#666]"
                    style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                  >
                    {catLabels[doc.category] ?? doc.category}
                  </td>
                  <td
                    className="py-[8px] px-[15px] border border-[#ddd] text-center"
                    style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                  >
                    {doc.year ?? ''}
                  </td>
                  <td
                    className="py-[8px] px-[15px] border border-[#ddd] text-center"
                    style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                  >
                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#159097] hover:underline font-semibold"
                      >
                        <Download className="w-[14px] h-[14px]" />
                        PDF
                      </a>
                    ) : (
                      <span className="text-[#999]">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </PageWithSidebar>
  )
}
