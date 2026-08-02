import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { getAllDocuments } from '@/lib/payload'
import { FileText, Download, Filter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hivatalos Dokumentumok & Letöltések – Vörösmarty Mihály Könyvtár',
  description: 'SZMSZ, Éves beszámolók, Pályázati kiírások és letölthető űrlapok.',
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
    {
      id: 'd1',
      title: 'VMK Szervezeti és Működési Szabályzata (SZMSZ 2026)',
      category: 'szmsz',
      year: 2026,
      downloadCount: 142,
    },
    {
      id: 'd2',
      title: 'Könyvtárhasználati és Szolgáltatási Szabályzat',
      category: 'szmsz',
      year: 2026,
      downloadCount: 298,
    },
    {
      id: 'd3',
      title: 'VMK Éves Szakmai es Pénzügyi Beszámoló 2025',
      category: 'report',
      year: 2025,
      downloadCount: 87,
    },
    {
      id: 'd4',
      title: 'Beiratkozási és Adatkezelési Nyilatkozat Űrlap (PDF)',
      category: 'form',
      year: 2026,
      downloadCount: 512,
    },
  ]

  const displayDocs = docs.length > 0 ? docs : defaultDocs

  const catLabels: Record<string, string> = {
    szmsz: 'SZMSZ & Szabályzat',
    report: 'Éves Beszámoló',
    grant: 'Pályázati Kiírás',
    form: 'Űrlap',
    other: 'Egyéb',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Dokumentumok' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900">Hivatalos Dokumentumok & Letöltési Tár</h1>
        <p className="text-slate-600 mt-2">
          A Vörösmarty Mihály Könyvtár közérdekű adatai, beszámolói, szabályzatai és letölthető nyomtatványai.
        </p>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { label: 'Összes Dokumentum', value: undefined },
            { label: 'SZMSZ & Szabályzatok', value: 'szmsz' },
            { label: 'Éves Beszámolók', value: 'report' },
            { label: 'Pályázatok', value: 'grant' },
            { label: 'Letölthető Űrlapok', value: 'form' },
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.value ? `/dokumentumok?category=${cat.value}` : '/dokumentumok'}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.value
                  ? 'bg-[#159097] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Document table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {displayDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#159097] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700 inline-block mb-1">
                    {catLabels[doc.category] ?? doc.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{doc.title}</h3>
                  <span className="text-xs text-slate-400">
                    Vonatkozó év: {doc.year ?? 2026} • Letöltve: {doc.downloadCount ?? 0} alkalommal
                  </span>
                </div>
              </div>

              <a
                href="#"
                className="btn-primary text-xs shrink-0 justify-center"
              >
                <Download className="w-4 h-4" />
                <span>Letöltés (PDF)</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
