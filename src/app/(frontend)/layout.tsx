import React from 'react'
import type { Metadata } from 'next'
import { Roboto, Cinzel } from 'next/font/google'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
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
      </body>
    </html>
  )
}
