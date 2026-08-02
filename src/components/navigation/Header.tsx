'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X, Mail, ChevronDown } from 'lucide-react'

// A valós www.vmk.hu fejléce KÉT sorból áll (ellenőrizve valós
// képernyőkép-összevetéssel, Playwright screenshottal):
//   1. Fehér sor: logó (valódi VMK címer + felirat kép) + közösségi ikonok +
//      "Online Katalógus / Beiratkozás" gomb.
//   2. Teal sor: fő navigáció (Nyitvatartás / Elérhetőségeink / Központi
//      Könyvtár / Tagkönyvtárak / Megyei Ellátás / Galéria) + keresés ikon.
// Korábban ez egyetlen teal sorba volt összevonva - ez javítva.
interface NavChild {
  label: string
  href: string
  external?: boolean
}

interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Nyitvatartás', href: '/nyitvatartas' },
  { label: 'Elérhetőségeink', href: '/kapcsolat' },
  {
    label: 'Központi Könyvtár',
    href: '/reszlegek',
    children: [
      { label: 'Felnőtt kölcsönző részleg', href: '/reszlegek/felnott-kolcsonzo' },
      { label: 'Gyermekrészleg', href: 'http://gyerek.vmk.hu/', external: true },
      { label: 'Helyismeret', href: 'http://helyismeret.vmk.hu', external: true },
      { label: 'Olvasóterem', href: '/reszlegek/olvasoterem' },
      { label: 'Pedagógiai részleg', href: '/reszlegek/pedagogiai-reszleg' },
      { label: 'Zenei és számítógépes részleg', href: 'http://av.vmk.hu', external: true },
      { label: 'Kötészet', href: '/reszlegek/koteszet' },
    ],
  },
  {
    label: 'Tagkönyvtárak',
    href: '/tagkonyvtarak',
    children: [
      { label: 'Budai Úti Tagkönyvtár', href: '/tagkonyvtarak/budai-ut' },
      { label: 'Mészöly Géza Utcai Tagkönyvtár', href: '/tagkonyvtarak/meszoly-geza' },
      { label: 'Széna Téri Tagkönyvtár', href: '/tagkonyvtarak/szena-ter' },
      { label: 'Tolnai Utcai Tagkönyvtár', href: '/tagkonyvtarak/tolnai-ut' },
      { label: 'Zsolt Utcai Tagkönyvtár', href: '/tagkonyvtarak/zsolt-ut' },
    ],
  },
  // Valós, élő oldalról lekérdezve: külső link a KSZR (Könyvtárellátási
  // Szolgáltató Rendszer) saját oldalára, NEM belső aloldal.
  { label: 'Megyei Ellátás', href: 'http://www.fejerkszr.hu/' },
  { label: 'Galéria', href: '/galeria' },
]

// A valós fejléc jobb oldali ikonsora (nyers HTML-ből, 1:1 letöltött
// képekkel): e-mail, YouTube, Facebook, Instagram, Wifi, nyelvi zászlók
// (HU/EN/DE), akadálymentes ("vakok és gyengénlátók") ikon - ebből a
// nyelvi/akadálymentes linkek a valós, élő vmk.hu megfelelő aloldalára
// mutatnak, mert ezeket a funkciókat (nyelvváltás, vakbarát mód) itt nem
// építettük ki.
const ICON_LINKS: Array<{ href: string; label: string; img: string; w: number; h: number }> = [
  { href: 'https://www.youtube.com/channel/UCteOpYySj_ik3xoR5ID5vBQ/videos', label: 'YouTube', img: '/brand/icons/vmk_youtube.jpg', w: 33, h: 23 },
  { href: 'https://www.facebook.com/vmk13', label: 'Facebook', img: '/brand/icons/vmk_facebook.png', w: 24, h: 24 },
  { href: 'https://www.instagram.com/vmkszekesfehervar/', label: 'Instagram', img: '/brand/icons/instagram_vmk.png', w: 24, h: 24 },
  { href: 'https://www.vmk.hu/page/menu/156/preview/1', label: 'Wifi elérhetőség', img: '/brand/icons/icon_wifi.png', w: 22, h: 20 },
]

const LANG_FLAGS: Array<{ href: string; label: string; img: string; active?: boolean }> = [
  { href: 'https://www.vmk.hu/start/index/lang/hu', label: 'Magyar', img: '/brand/icons/flag_hu.png', active: true },
  { href: 'https://www.vmk.hu/start/index/lang/en', label: 'English', img: '/brand/icons/flag_en.png' },
  { href: 'https://www.vmk.hu/start/index/lang/de', label: 'Deutsch', img: '/brand/icons/flag_de.png' },
]

const CATALOG_MENU: Array<{ href: string; label: string }> = [
  { href: 'http://tlwww.vmk.hu/tlwww', label: 'Belépés a katalógusba' },
  { href: 'http://tlwww.vmk.hu/tlwww/olvall.htm', label: 'Bejelentkezés olvasóknak' },
  { href: 'http://tlwww.vmk.hu/tlwww/partner.htm', label: 'Bejelentkezés partner könyvtáraknak' },
  { href: 'https://www.vmk.hu/regiszracios-lap', label: 'Beiratkozás' },
]

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [catalogOpen, setCatalogOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* 1. sor: fehér, logó + közösségi ikonok + CTA gomb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/brand/vmk-logo.png"
              alt="Vörösmarty Mihály Könyvtár"
              width={200}
              height={80}
              className="h-14 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <a
              href="mailto:kolcsonzo@vmk.hu"
              aria-label="E-mail"
              className="w-7 h-7 rounded bg-[#159097] flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <Mail className="w-4 h-4 text-white" strokeWidth={2} />
            </a>
            {ICON_LINKS.map((icon) => (
              <a
                key={icon.label}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={icon.label}
                className="w-7 h-7 flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icon.img} alt={icon.label} className="max-w-full max-h-full object-contain" />
              </a>
            ))}
            <span className="w-px h-6 bg-slate-200 mx-1" aria-hidden="true" />
            {LANG_FLAGS.map((flag) => (
              <a
                key={flag.label}
                href={flag.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={flag.label}
                className={flag.active ? 'opacity-100' : 'opacity-60 hover:opacity-100 transition-opacity'}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={flag.img} alt={flag.label} width={26} height={19} className="object-contain rounded-sm" />
              </a>
            ))}
            <a
              href="https://www.vmk.hu/page/blind"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Akadálymentes (vakok és gyengénlátók) nézet"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/icons/icon_vb.png" alt="Akadálymentes nézet" width={26} height={19} className="object-contain rounded-sm" />
            </a>

            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setCatalogOpen((v) => !v)}
                onBlur={() => setTimeout(() => setCatalogOpen(false), 150)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#159097] hover:bg-[#0f656a] text-white text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap"
                aria-haspopup="true"
                aria-expanded={catalogOpen}
              >
                <span>Online Katalógus / Beiratkozás</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {catalogOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 normal-case">
                  {CATALOG_MENU.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#159097]"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobil menü gomb */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Menü megnyitása"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 2. sor: teal, fő navigáció */}
      <div className="hidden lg:block bg-[#159097]">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-1 h-11 text-xs font-semibold text-white/90 uppercase tracking-wide">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div
                  key={item.href}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-0.5 px-3 py-2 rounded hover:bg-white/10 hover:text-white transition-colors"
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </Link>
                  {openDropdown === item.label && (
                    <div className="absolute left-0 top-full w-64 z-50">
                      <div className="bg-white rounded-b-lg shadow-xl border border-slate-200 py-2 normal-case">
                        {item.children.map((child) =>
                          child.external ? (
                            <a
                              key={child.href}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#159097]"
                            >
                              {child.label}
                            </a>
                          ) : (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#159097]"
                            >
                              {child.label}
                            </Link>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : item.href.startsWith('http') ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 px-3 py-2 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-0.5 px-3 py-2 rounded hover:bg-white/10 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ),
            )}

            <Link
              href="/kereses"
              aria-label="Keresés a honlapon"
              title="Keresés a honlapon"
              className="ml-auto p-2 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobil legördülő menü */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col text-sm font-medium text-slate-800">
            {NAV_ITEMS.map((item) => (
              <div key={item.href}>
                <div className="flex items-center">
                  {item.href.startsWith('http') ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 rounded-md hover:bg-slate-100"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => !item.children && setMobileMenuOpen(false)}
                      className="flex-1 px-3 py-2 rounded-md hover:bg-slate-100"
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.children && (
                    <button
                      onClick={() => setMobileSubmenu(mobileSubmenu === item.label ? null : item.label)}
                      aria-label={`${item.label} almenü`}
                      className="p-2 text-slate-500"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${mobileSubmenu === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>
                {item.children && mobileSubmenu === item.label && (
                  <div className="pl-4 border-l-2 border-slate-100 ml-3 space-y-0.5 mb-1">
                    {item.children.map((child) =>
                      child.external ? (
                        <a
                          key={child.href}
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded"
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded"
                        >
                          {child.label}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/kereses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Keresés</span>
            </Link>
          </nav>
          <div className="pt-2">
            <a
              href="http://tlwww.vmk.hu/tlwww"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-catalog w-full justify-center text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Online Katalógus / Beiratkozás</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
