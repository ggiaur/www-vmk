import React from 'react'
import { SiteSidebar } from '@/components/layout/SiteSidebar'

// A valós www.vmk.hu MINDEN belső oldalon megtartja a teljes bal oldali
// sávot (MENÜ + widget-torony), nem csak a főoldalon - ezt Playwright
// screenshottal ellenőriztük egy tagkönyvtár-oldalon és a nyitvatartás
// oldalon is. Korábban minden aloldal saját, oldalsáv nélküli, egyoszlopos
// max-w-7xl konténert használt. Ez a wrapper adja a közös kétoszlopos
// elrendezést, amit minden (fő)oldal használ a homepage saját page.tsx-e
// mellett.
export function PageWithSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
      <SiteSidebar />
      <main className="min-w-0">{children}</main>
    </div>
  )
}
