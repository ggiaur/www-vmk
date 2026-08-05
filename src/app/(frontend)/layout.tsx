import React from 'react'
import type { Metadata } from 'next'
import { Roboto, Cinzel } from 'next/font/google'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { CookieConsent } from '@/components/CookieConsent'
import './globals.css'

// Matches the real, live www.vmk.hu exactly (Roboto body text, Cinzel
// serif headings) — verified directly against its compiled CSS
// (assets/dist/style.min.*.css: body{font-family:Roboto,...},
// h1-h6{font-family:Cinzel,serif}). See docs/DESIGN_SYSTEM.md.
const roboto = Roboto({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-inter',
})
const cinzel = Cinzel({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-cardo',
})

export const metadata: Metadata = {
  title: 'Vörösmarty Mihály Könyvtár – Székesfehérvár',
  description:
    'A Vörösmarty Mihály Könyvtár hivatalos weboldala. Könyvtári katalógus, nyitvatartás, hírek, rendezvények és online szolgáltatások Székesfehérváron.',
  keywords: ['könyvtár', 'Székesfehérvár', 'VMK', 'katalógus', 'könyvek', 'rendezvények', 'nyitvatartás'],
  authors: [{ name: 'Vörösmarty Mihály Könyvtár' }],
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu" className={`h-full ${roboto.variable} ${cinzel.variable}`}>
      <body className="flex flex-col min-h-screen bg-white text-[#1B1B1B] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Széchenyi 2020 sarokjelvények — a valós vmk.hu-n position:fixed,
            bottom:0, z-index:10000, width:270px, mindkettő kattintható <a>.
            Itt 120px → 220px hover-átmenettel (felhasználó kérése). */}
        <a href="http://konyvtar.vmk.hu/efop/" target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/szechenyi2020_esza_bal.png" alt="Széchenyi 2020 ESZA" className="szlogo szlogo-left" />
        </a>
        <a href="https://www.vmk.hu/_upload/editor/2021/TOP-BudaiUtiKvtPalyazat.pdf" target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/szechenyi2020_erfa_jobb.png" alt="Széchenyi 2020 ERFA" className="szlogo szlogo-right" />
        </a>
        <CookieConsent />
      </body>
    </html>
  )
}
