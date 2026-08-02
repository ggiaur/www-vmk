'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Search, Menu, X, Mail, Facebook, Youtube, ChevronDown } from 'lucide-react'

// A valós www.vmk.hu fejléce EGY vékony, teal színű navigációs sávból áll
// (nincs külön "nagy márka-sor" alatta - a cím a hero szalagban jelenik meg).
// A "Központi Könyvtár" és "Tagkönyvtárak" menüpontok almenüi a valós oldal
// tényleges (lekérdezett, nem kitalált) menüszerkezetét követik. A belső
// aldomaineken élő részlegek (Gyermekrészleg, Helyismeret, Zenei és
// számítógépes részleg) külső linkek maradnak, mert ezek a valós oldalon is
// önálló aldomainek, nem a fő www-vmk projekt része.
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
  { label: 'Megyei Ellátás', href: '/szolgaltatasok' },
  { label: 'Galéria', href: '/galeria' },
]

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-[#159097] shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Kis embléma + rövid név (a nagy márka-sor helyett) */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded bg-white/15 flex items-center justify-center text-white group-hover:bg-white/25 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline text-white font-bold text-sm tracking-wide">
              VMK
            </span>
          </Link>

          {/* Fő navigáció */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-white/90 uppercase tracking-wide">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div
                  key={item.href}
                  className="relative"
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
                    <div className="absolute left-0 top-full pt-1 w-64 z-50">
                      <div className="bg-white rounded-lg shadow-xl border border-slate-200 py-2 normal-case">
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
          </nav>

          {/* Jobb oldal: közösségi ikonok + CTA gomb */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <a
              href="mailto:info@vmk.hu"
              aria-label="E-mail"
              className="p-2 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <Link
              href="/kereses"
              aria-label="Keresés a honlapon"
              title="Keresés a honlapon"
              className="p-2 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>
            <a
              href="https://katalogus.vmk.hu"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 py-1.5 rounded bg-[#e4b02c] hover:bg-[#c99a1f] text-[#1B1B1B] text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap"
            >
              Online Katalógus / Beiratkozás
            </a>
          </div>

          {/* Mobil menü gomb */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded text-white hover:bg-white/10 focus:outline-none"
            aria-label="Menü megnyitása"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobil legördülő menü */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#0f656a] px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col text-sm font-medium text-slate-800">
            {NAV_ITEMS.map((item) => (
              <div key={item.href}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={() => !item.children && setMobileMenuOpen(false)}
                    className="flex-1 px-3 py-2 rounded-md hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
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
