'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ChevronRight } from 'lucide-react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { openConsentSettings } from '@/lib/cookieConsent'

export const Footer: React.FC = () => {
  return (
    <footer className="footer-lpl mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[1fr_1fr_320px] gap-10">
        {/* Left: social icons + link list */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
          <nav className="space-y-2 text-sm">
            <Link href="/hirek" className="flex items-center gap-1 hover:underline">
              <ChevronRight className="w-3.5 h-3.5 text-[var(--secondary)]" />Hírek
            </Link>
            <Link href="/esemenyek" className="flex items-center gap-1 hover:underline">
              <ChevronRight className="w-3.5 h-3.5 text-[var(--secondary)]" />Események
            </Link>
            <Link href="/galeria" className="flex items-center gap-1 hover:underline">
              <ChevronRight className="w-3.5 h-3.5 text-[var(--secondary)]" />Galéria
            </Link>
            <Link href="/reszlegek" className="flex items-center gap-1 hover:underline">
              <ChevronRight className="w-3.5 h-3.5 text-[var(--secondary)]" />Részlegeink
            </Link>
            <Link href="/tamogatas" className="flex items-center gap-1 hover:underline">
              <ChevronRight className="w-3.5 h-3.5 text-[var(--secondary)]" />Támogassa a könyvtárat
            </Link>
            <a
              href="https://www.vmk.hu/_upload/editor/Alapdokumentumok/Adatkezelesi_tajekoztato_honlapra_VMK.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <ChevronRight className="w-3.5 h-3.5 text-[var(--secondary)]" />Adatkezelési tájékoztató
            </a>
          </nav>
        </div>

        {/* Middle: newsletter */}
        <div className="space-y-3">
          <h2 className="font-bold text-[var(--text-main)] text-lg">Iratkozzon fel hírlevelünkre</h2>
          <p className="text-sm text-[var(--text-muted)]">Kapjon híreket, ajánlókat és programértesítőket a VMK-tól.</p>
          <NewsletterForm />
        </div>

        {/* Right: address box + contact button */}
        <div className="footer-address-box space-y-3">
          <p className="font-bold text-[var(--text-main)]">Vörösmarty Mihály Könyvtár</p>
          <p className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--secondary)]" />
            <span>8000 Székesfehérvár, Bartók Béla tér 1.<br />8001 Székesfehérvár, Pf: 65.</span>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 shrink-0 text-[var(--secondary)]" />
            <a href="tel:+3622340699" className="hover:underline">22/340-699</a>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 shrink-0 text-[var(--secondary)]" />
            <a href="mailto:konyvtar@vmk.hu" className="hover:underline">konyvtar@vmk.hu</a>
          </p>
          <Link href="/kapcsolat" className="footer-contact-btn">
            Kapcsolatfelvétel
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--border-light)]" />

      {/* Legal bar */}
      <div className="footer-legal-bar">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy;2015 Vörösmarty Mihály Könyvtár. Minden jog fenntartva!</p>
          <nav className="flex items-center gap-4">
            <Link href="/nyitvatartas" className="hover:underline">Nyitvatartás</Link>
            <Link href="/arato-antal-emlekere" className="hover:underline">Dr. Arató Antal (1942-2025)</Link>
            <button type="button" onClick={() => openConsentSettings()} className="hover:underline">
              Sütik kezelése
            </button>
          </nav>
        </div>
      </div>

      <div className="footer-biblio-attribution">
        Fejlesztve a Vörösmarty Mihály Könyvtár számára
      </div>
    </footer>
  )
}
