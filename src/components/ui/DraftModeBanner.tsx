import React from 'react'
import Link from 'next/link'

// Csak akkor jelenik meg, ha a Next.js Draft Mode be van kapcsolva
// (lásd src/app/api/draft/route.ts) — jelzi a szerkesztőnek, hogy
// piszkozatot néz, nem a publikált tartalmat.
export function DraftModeBanner({ path }: { path: string }) {
  return (
    <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-sm px-4 py-2 flex items-center justify-between gap-4">
      <span>
        <strong>Piszkozat-előnézet</strong> — ez a tartalom még nincs publikálva.
      </span>
      <Link
        href={`/api/exit-draft?path=${encodeURIComponent(path)}`}
        className="underline font-semibold whitespace-nowrap"
      >
        Kilépés az előnézetből
      </Link>
    </div>
  )
}
