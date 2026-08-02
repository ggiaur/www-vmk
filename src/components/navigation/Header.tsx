'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X, Mail, Facebook, Youtube, ChevronDown } from 'lucide-react'

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

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* 1. sor: fehér, logó + közösségi ikonok + CTA gomb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/brand/vmk-logo.png"
              alt="Vörösmarty Mihály Könyvtár"
              width={200}
              height={80}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-1 shrink-0">
            <a
              href="mailto:info@vmk.hu"
              aria-label="E-mail"
              className="p-2 rounded text-slate-500 hover:text-[#159097] hover:bg-slate-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 rounded text-slate-500 hover:text-[#159097] hover:bg-slate-50 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded text-slate-500 hover:text-[#159097] hover:bg-slate-50 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://katalogus.vmk.hu"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 py-1.5 rounded bg-[#8B1E2D] hover:bg-[#6f1724] text-white text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap"
            >
              Online Katalógus / Beiratkozás
            </a>
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
              href="https://katalogus.vmk.hu"
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
