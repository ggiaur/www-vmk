import React from 'react'
import { MapPin, Phone } from 'lucide-react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

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
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
        {/* Column 1: Hírlevél */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider border-b border-white/30 inline-block pb-1">
            Hírlevél
          </h3>
          <NewsletterForm />
        </div>

        {/* Column 2: Kapcsolat */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider border-b border-white/30 inline-block pb-1">
            Kapcsolat
          </h3>
          <div className="space-y-1.5 text-sm text-teal-50">
            <p className="font-semibold text-white">Vörösmarty Mihály Könyvtár</p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-teal-100 mt-0.5 shrink-0" />
              <span>
                Cím: 8000 Székesfehérvár, Bartók Béla tér 1.
                <br />
                8001 Székesfehérvár, Pf: 65.
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-100 shrink-0" />
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
        </div>

        {/* Column 3: Jelvények (valós képek) */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <a href="https://outlook.office365.com" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/icons/outlook_web_app.jpg"
              alt="Outlook Web App"
              width={140}
              height={60}
              className="bg-white rounded p-1"
            />
          </a>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/icons/min_vmk.png" alt="Minősített Könyvtár 2020" width={100} height={95} />
        </div>
      </div>

      {/* Bottom Bar - a valós oldalon egy árnyalattal világosabb teal sáv */}
      <div className="bg-[#33A6AF]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-teal-50">
          <p>© {new Date().getFullYear()} Vörösmarty Mihály Könyvtár. Minden jog fenntartva.</p>
          <p className="flex items-center gap-1">
            <span>Next.js 15 &amp; Payload CMS v3 alapokon</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
