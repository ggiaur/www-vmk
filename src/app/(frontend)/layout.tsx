import React from 'react'
import type { Metadata } from 'next'
import { Inter, Cardo } from 'next/font/google'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' })
const cardo = Cardo({
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
    <html lang="hu" className={`h-full ${inter.variable} ${cardo.variable}`}>
      <body className="flex flex-col min-h-screen bg-white text-[#1B1B1B] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
