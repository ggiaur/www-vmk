'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { openConsentSettings } from '@/lib/cookieConsent'

export const Footer: React.FC = () => {
  return (
    <footer className="nypl-footer pt-12 pb-0 mt-auto">
      <div className="max-w-[1280px] mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
        {/* Col 1: Info */}
        <div>
          <h3 className="text-white font-bold text-base mb-4">Vörösmarty Mihály Könyvtár</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#c62828]" />
              <span>8000 Székesfehérvár<br />Bartók Béla tér 1.</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-[#c62828]" />
              <a href="tel:+3622340699" className="hover:text-white">22/340-699</a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0 text-[#c62828]" />
              <a href="mailto:kolcsonzo@vmk.hu" className="hover:text-white">kolcsonzo@vmk.hu</a>
            </p>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="text-white font-bold text-base mb-4">Navigáció</h3>
          <nav className="space-y-1.5 text-sm">
            <Link href="/nyitvatartas" className="block hover:text-white">Nyitvatartás</Link>
            <Link href="/kapcsolat" className="block hover:text-white">Elérhetőség</Link>
            <Link href="/esemenyek" className="block hover:text-white">Rendezvények</Link>
            <Link href="/hirek" className="block hover:text-white">Hírek</Link>
            <Link href="/galeria" className="block hover:text-white">Galéria</Link>
            <a href="http://tlwww.vmk.hu/tlwww" target="_blank" rel="noopener noreferrer" className="block hover:text-white">Online Katalógus</a>
          </nav>
        </div>

        {/* Col 3: Services */}
        <div>
          <h3 className="text-white font-bold text-base mb-4">Szolgáltatások</h3>
          <nav className="space-y-1.5 text-sm">
            <Link href="/kapcsolat" className="block hover:text-white">Beiratkozás</Link>
            <Link href="/teremfoglalas" className="block hover:text-white">Teremfoglalás</Link>
            <Link href="/szolgaltatasok" className="block hover:text-white">WiFi Elérhetőség</Link>
            <Link href="/reszlegek/koteszet" className="block hover:text-white">Kötészet</Link>
            <a href="https://www.vmk.hu/_upload/editor/Alapdokumentumok/Adatkezelesi_tajekoztato_honlapra_VMK.pdf" target="_blank" rel="noopener noreferrer" className="block hover:text-white">Adatkezelési tájékoztató</a>
            <button type="button" onClick={() => openConsentSettings()} className="block text-left hover:text-white text-sm">Sütik kezelése</button>
          </nav>
        </div>

        {/* Col 4: Newsletter + badges */}
        <div>
          <h3 className="text-white font-bold text-base mb-4">Hírlevél</h3>
          <NewsletterForm />
          <div className="flex items-center gap-3 mt-5">
            <a href="https://outlook.office365.com" target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/icons/outlook_web_app.jpg" alt="Outlook Web App" width={120} height={52} className="bg-white rounded p-0.5 h-auto" />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/icons/min_vmk.png" alt="Minősített Könyvtár 2020" width={70} height={66} className="h-auto" />
          </div>
        </div>
      </div>

      <div className="nypl-footer-bottom">
        <div className="max-w-[1280px] mx-auto px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
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
