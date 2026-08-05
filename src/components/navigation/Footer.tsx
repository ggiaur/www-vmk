'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { openConsentSettings } from '@/lib/cookieConsent'

export const Footer: React.FC = () => {
  return (
    <footer className="footer-biblio pt-10 pb-0 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
        {/* Column 1: Hírlevél */}
        <div className="space-y-3">
          <h2 className="font-bold text-white text-lg border-b-2 border-[#2980b9] pb-2">Hírlevél</h2>
          <NewsletterForm />
        </div>

        {/* Column 2: Kapcsolat */}
        <div className="space-y-3">
          <h2 className="font-bold text-white text-lg border-b-2 border-[#2980b9] pb-2">Kapcsolat</h2>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-white">Vörösmarty Mihály Könyvtár</p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#2980b9]" />
              <span>8000 Székesfehérvár, Bartók Béla tér 1.<br />8001 Székesfehérvár, Pf: 65.</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-[#2980b9]" />
              <a href="tel:+3622340699" className="hover:text-white transition">22/340-699</a>
            </p>
          </div>
          <div className="pt-2 space-y-1 text-sm">
            <a
              href="https://www.vmk.hu/_upload/editor/Alapdokumentumok/Adatkezelesi_tajekoztato_honlapra_VMK.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white transition"
            >
              Adatkezelési tájékoztató
            </a>
            <button
              type="button"
              onClick={() => openConsentSettings()}
              className="block text-left hover:text-white transition text-sm"
            >
              Sütik kezelése
            </button>
          </div>
        </div>

        {/* Column 3: Gyors linkek + Jelvények */}
        <div className="space-y-4">
          <h2 className="font-bold text-white text-lg border-b-2 border-[#2980b9] pb-2">Hasznos linkek</h2>
          <nav className="space-y-1.5 text-sm">
            <Link href="/nyitvatartas" className="flex items-center gap-2 hover:text-white transition">
              <Clock className="w-3.5 h-3.5 text-[#2980b9]" />Nyitvatartás
            </Link>
            <a href="http://tlwww.vmk.hu/tlwww" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">
              Online Katalógus
            </a>
            <Link href="/kapcsolat" className="block hover:text-white transition">Beiratkozás</Link>
            <Link href="/galeria" className="block hover:text-white transition">Galéria</Link>
          </nav>
          <div className="flex items-center gap-3 pt-2">
            <a href="https://outlook.office365.com" target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/icons/outlook_web_app.jpg" alt="Outlook Web App" width={140} height={60} className="bg-white rounded p-1 h-auto" />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/icons/min_vmk.png" alt="Minősített Könyvtár 2020" width={100} height={95} className="h-auto" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-copyright">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p>&copy;2015 Vörösmarty Mihály Könyvtár. Minden jog fenntartva!</p>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/nyitvatartas" className="hover:text-white transition">Opening hours</Link>
            <Link href="/arato-antal-emlekere" className="hover:text-white transition">Dr. Arató Antal (1942-2025)</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
