import React from 'react'
import type { Metadata } from 'next'
import { Inter, Bitter } from 'next/font/google'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { CookieConsent } from '@/components/CookieConsent'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})
const bitter = Bitter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700', '800'],
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
    <html lang="hu" className={`h-full ${inter.variable} ${bitter.variable}`}>
      <body className="flex flex-col min-h-screen bg-white text-[#1b1b1b] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
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
