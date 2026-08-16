'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Calendar, Newspaper } from 'lucide-react'

type SearchHit = { id: string | number; title: string; slug: string; [key: string]: unknown }
type SearchResults = { news: SearchHit[]; events: SearchHit[]; error?: string }

export function SearchClient() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults(null)
      return
    }

    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
      } catch {
        setResults({ news: [], events: [], error: 'A keresés jelenleg nem elérhető.' })
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const hasResults = results && (results.news.length > 0 || results.events.length > 0)

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Keressen hírek és rendezvények között..."
          autoFocus
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-[#159097] focus:border-transparent"
        />
      </div>

      {isLoading && <p className="text-sm text-slate-500">Keresés...</p>}

      {results?.error && <p className="text-sm text-red-600">{results.error}</p>}

      {!isLoading && query.trim() && !hasResults && !results?.error && (
        <p className="text-sm text-slate-500 italic">Nincs találat erre: &quot;{query}&quot;</p>
      )}

      {results && results.news.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Hírek</h2>
          <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {results.news.map((hit) => (
              <li key={hit.id}>
                <Link
                  href={`/hirek/${hit.slug}`}
                  className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
                >
                  <Newspaper className="w-4 h-4 text-[#137F85] shrink-0" />
                  <span className="text-sm text-slate-800">{hit.title as string}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results && results.events.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Rendezvények</h2>
          <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {results.events.map((hit) => (
              <li key={hit.id}>
                <Link
                  href={`/esemenyek/${hit.slug}`}
                  className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-[#137F85] shrink-0" />
                  <span className="text-sm text-slate-800">{hit.title as string}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
