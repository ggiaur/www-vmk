import React from 'react'
import Link from 'next/link'
import { BookOpen, MapPin, Phone, Mail, Facebook, Instagram, Youtube, ExternalLink, ShieldCheck } from 'lucide-react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

export const Footer: React.FC = () => {
  return (
    // A valós vmk.hu lábléce teal (nem sötétkék) - Playwright screenshottal
    // ellenőrizve a valós oldalhoz képest.
    <footer className="bg-[#0f656a] text-teal-50 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
        {/* Column 0: Hírlevél (a valós vmk.hu lábléce ezzel kezdődik) */}
        <div className="space-y-3 md:order-first order-last">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Hírlevél</h3>
          <p className="text-xs text-teal-100/80">
            Iratkozzon fel, és elsőként értesüljön a könyvtár híreiről és programjairól!
          </p>
          <NewsletterForm />
        </div>
        {/* Column 1: Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#159097] flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg">VMK Székesfehérvár</span>
          </div>
          <p className="text-sm text-teal-100/80 leading-relaxed">
            Vörösmarty Mihály Könyvtár – Székesfehérvár Megyei Jogú Város nyilvános könyvtári hálózata.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#e4b02c] mt-0.5 shrink-0" />
              <span>8000 Székesfehérvár, Bartók Béla tér 1.</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#e4b02c] shrink-0" />
              <a href="tel:+3622340699" className="hover:text-white transition">+36 22 340 699</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#e4b02c] shrink-0" />
              <a href="mailto:kolcsonzo@vmk.hu" className="hover:text-white transition">kolcsonzo@vmk.hu</a>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Hasznos Hivatkozások</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://katalogus.vmk.hu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition inline-flex items-center gap-1"
              >
                <span>Online Katalógus (OPAC)</span>
                <ExternalLink className="w-3 h-3 text-teal-100/80" />
              </a>
            </li>
            <li>
              <Link href="/nyitvatartas" className="hover:text-white transition">
                Tagkönyvtárak & Nyitvatartás
              </Link>
            </li>
            <li>
              <Link href="/szolgaltatasok" className="hover:text-white transition">
                Beiratkozás & Díjszabás
              </Link>
            </li>
            <li>
              <Link href="/dokumentumok" className="hover:text-white transition">
                Hivatalos Dokumentumok & SZMSZ
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Social & Legal */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Közösség & Jog</h3>
          <p className="text-xs text-teal-100/80">
            Kövessen minket Facebookon a legfrissebb hírekért, rendezvényekért és könyvajánlókért!
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/vmk13"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-black/20 hover:bg-[#159097] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="VMK Facebook oldal"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/vmkszekesfehervar/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-black/20 hover:bg-[#159097] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="VMK Instagram oldal"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCteOpYySj_ik3xoR5ID5vBQ/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-black/20 hover:bg-[#159097] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="VMK YouTube csatorna"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
          <div className="text-xs text-teal-100/60 space-y-1">
            <a
              href="https://www.vmk.hu/_upload/editor/Alapdokumentumok/Adatkezelesi_tajekoztato_honlapra_VMK.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Adatvédelmi tájékoztató
            </a>
          </div>
        </div>
      </div>

      {/* Akkreditációs jelvények (a valós vmk.hu lábléce is tartalmaz
          ilyen apró minőségtanúsító jelvényeket - itt szöveges/ikonos
          formában, mert nincs valós grafikai anyagunk hozzájuk) */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4 flex flex-wrap items-center gap-4 border-b border-white/10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 text-xs text-teal-100/80">
          <ShieldCheck className="w-4 h-4 text-[#e4b02c]" />
          <span>Minősített Könyvtár</span>
        </div>
        <a
          href="https://outlook.office365.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 text-xs text-teal-100/80 hover:text-white transition-colors"
        >
          <Mail className="w-4 h-4 text-[#159097]" />
          <span>Outlook Web App</span>
        </a>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-teal-100/60">
        <p>© {new Date().getFullYear()} Vörösmarty Mihály Könyvtár. Minden jog fenntartva.</p>
        <p className="flex items-center gap-1">
          <span>Powered by Next.js 15 & Payload CMS v3</span>
        </p>
      </div>
    </footer>
  )
}
