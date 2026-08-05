'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { REAL_CONTAINER } from '@/lib/layout'
import { openConsentSettings } from '@/lib/cookieConsent'

// A valós vmk.hu lábléce 3 oszlopos (Hírlevél | Kapcsolat | jelvények),
// NEM 4 oszlopos - Playwright getComputedStyle-lal mérve a tényleges
// színek: a fő láblécblokk háttere rgb(0, 144, 155) = #00909B, a legalsó
// copyright-sáv egy árnyalattal világosabb: rgb(51, 166, 175) = #33A6AF.
// A "Kapcsolat" oszlop a valós oldalon nem tartalmaz e-mail címet és
// nincs önálló "Hasznos Hivatkozások" oszlop sem - ezeket korábban
// tévesen fabrikáltuk hozzá. A jelvények (Outlook Web App, Minősített
// Könyvtár) a valós oldalon letöltött, tényleges képek, nem szöveges
// ikon-diszek. Közösségimédia-ikonok csak a fejlécben szerepelnek a
// valós oldalon, a láblécben nincsenek megismételve.
export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#00909B] text-teal-50 pt-10 pb-0 mt-auto">
      <div className={`${REAL_CONTAINER} grid grid-cols-1 md:grid-cols-3 gap-8 pb-10`}>
        {/* Column 1: Hírlevél - a valós oldalon a cím H2, 24px, félkövér
            (700), NEM nagybetűs, és a vonal a doboz TETEJÉN van (2px
            solid fehér border-top a wrapper divjén), nem a szöveg alatt -
            Playwright-tal getComputedStyle-lal mérve. */}
        {/* Column 1: Hírlevél */}
        <div className="space-y-3 pt-4 border-t-2 border-white">
          <h2 className="font-bold text-white text-[24px] leading-[26.4px]" style={{ fontFamily: 'Roboto, sans-serif' }}>Hírlevél</h2>
          <NewsletterForm />
        </div>

        {/* Column 2: Kapcsolat */}
        <div className="space-y-3 pt-4 border-t-2 border-white">
          <h2 className="font-bold text-white text-[24px] leading-[26.4px]" style={{ fontFamily: 'Roboto, sans-serif' }}>Kapcsolat</h2>
          <div className="space-y-1.5 text-sm text-teal-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
            <p className="font-semibold text-white">Vörösmarty Mihály Könyvtár</p>
            <p>
              Cím: 8000 Székesfehérvár, Bartók Béla tér 1.
              <br />
              8001 Székesfehérvár, Pf: 65.
            </p>
            <p>
              <a href="tel:+3622340699" className="hover:text-white transition">
                Tel.: 22/340-699
              </a>
            </p>
          </div>
          <a
            href="https://www.vmk.hu/_upload/editor/Alapdokumentumok/Adatkezelesi_tajekoztato_honlapra_VMK.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[#e4b02c] hover:text-white transition text-sm font-medium"
          >
            Adatkezelési tájékoztató
          </a>
          <button
            type="button"
            onClick={() => openConsentSettings()}
            className="block text-left text-[#e4b02c] hover:text-white transition text-sm font-medium"
          >
            Sütik kezelése
          </button>
        </div>

        {/* Column 3: Jelvények */}
        <div className="flex flex-col items-center md:items-end gap-4 pt-[30px] pb-[30px]">
          <a href="https://outlook.office365.com" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/icons/outlook_web_app.jpg"
              alt="Outlook Web App"
              width={205}
              height={88}
              className="bg-white rounded p-1 w-[267px] h-auto md:w-[205px]"
            />
          </a>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/icons/min_vmk.png"
            alt="Minősített Könyvtár 2020"
            width={205}
            height={194}
            className="w-[267px] h-auto md:w-[205px]"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#33A6AF]">
        <div className={`${REAL_CONTAINER} py-[10px] px-[15px] flex flex-col sm:flex-row items-center justify-between gap-2 text-[14px] leading-[20px] text-teal-50`} style={{ fontFamily: 'Roboto, sans-serif' }}>
          <p>©2015 Vörösmarty Mihály Könyvtár. Minden jog fenntartva! - NEOSOFT</p>
          <nav className="flex items-center gap-4 text-[14px] leading-[20px]">
            <Link href="/nyitvatartas" className="hover:text-white transition">
              Opening hours
            </Link>
            <Link href="/arato-antal-emlekere" className="hover:text-white transition">
              Dr. Arató Antal (1942-2025)
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
