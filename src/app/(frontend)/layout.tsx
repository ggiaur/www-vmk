import React from 'react'
import type { Metadata } from 'next'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import './globals.css'

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
    <html lang="hu" className="h-full">
      <body className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#1E293B] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
