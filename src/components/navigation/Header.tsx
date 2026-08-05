'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X, ChevronDown, Clock, MapPin, User } from 'lucide-react'

interface NavChild {
  label: string
  href: string
  external?: boolean
  divider?: boolean
}

interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

const BIBLIO_NAV: NavItem[] = [
  {
    label: 'Könyvtáraink',
    href: '/reszlegek',
    children: [
      { label: 'Központi Könyvtár', href: '/reszlegek' },
      { label: 'Felnőtt kölcsönző részleg', href: '/reszlegek/felnott-kolcsonzo' },
      { label: 'Gyermekrészleg', href: 'http://gyerek.vmk.hu/', external: true },
      { label: 'Helyismeret', href: 'http://helyismeret.vmk.hu', external: true },
      { label: 'Olvasóterem', href: '/reszlegek/olvasoterem' },
      { label: 'Zenei részleg', href: 'http://av.vmk.hu', external: true },
      { label: '', href: '#', divider: true },
      { label: 'Budai Úti Tagkönyvtár', href: '/tagkonyvtarak/budai-ut' },
      { label: 'Mészöly G. Tagkönyvtár', href: '/tagkonyvtarak/meszoly-geza' },
      { label: 'Széna Téri Tagkönyvtár', href: '/tagkonyvtarak/szena-ter' },
      { label: 'Tolnai Úti Tagkönyvtár', href: '/tagkonyvtarak/tolnai-ut' },
      { label: 'Zsolt Úti Tagkönyvtár', href: '/tagkonyvtarak/zsolt-ut' },
      { label: '', href: '#', divider: true },
      { label: 'Megyei Ellátás (KSZR)', href: 'http://www.fejerkszr.hu/', external: true },
    ],
  },
  { label: 'Rendezvények', href: '/esemenyek' },
  {
    label: 'Szolgáltatások',
    href: '/szolgaltatasok',
    children: [
      { label: 'Online Katalógus', href: 'http://tlwww.vmk.hu/tlwww', external: true },
      { label: 'Beiratkozás', href: '/kapcsolat' },
      { label: 'Teremfoglalás', href: '/teremfoglalas' },
      { label: 'WiFi Elérhetőség', href: '/szolgaltatasok' },
      { label: 'Kötészet', href: '/reszlegek/koteszet' },
    ],
  },
  { label: 'Hírek', href: '/hirek' },
  { label: 'Galéria', href: '/galeria' },
]

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="relative z-50">
      {/* Row 1: Utility bar */}
      <div className="utility-bar">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-[36px]">
          <span className="hidden sm:inline text-xs tracking-wide">
            Vörösmarty Mihály Könyvtár — Székesfehérvár
          </span>
          <div className="flex items-center gap-1 ml-auto text-[13px]">
            <Link href="/nyitvatartas" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/60">
              <Clock className="w-3.5 h-3.5" />
              <span>Nyitvatartás</span>
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/kapcsolat" className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/60">
              <MapPin className="w-3.5 h-3.5" />
              <span>Elérhetőség</span>
            </Link>
            <span className="text-gray-300">|</span>
            <a
              href="http://tlwww.vmk.hu/tlwww/olvall.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/60"
            >
              <User className="w-3.5 h-3.5" />
              <span>Fiókom</span>
            </a>
          </div>
        </div>
      </div>

      {/* Row 2: Logo + Search */}
      <div className="logo-row">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/brand/vmk-logo.png"
              alt="Vörösmarty Mihály Könyvtár"
              width={200}
              height={80}
              className="h-[70px] w-auto"
              priority
            />
          </Link>

          <form
            action="/kereses"
            method="get"
            className="hidden md:flex items-center"
            onSubmit={(e) => {
              if (!searchQuery.trim()) e.preventDefault()
            }}
          >
            <input
              type="text"
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keresés a katalógusban és a honlapon..."
              className="search-input w-[320px]"
            />
            <button type="submit" className="search-btn">
              <Search className="w-4 h-4 inline mr-1" />
              Keresés
            </button>
          </form>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded text-slate-700 hover:bg-slate-100"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Row 3: Navigation */}
      <div className="nav-row hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-4">
          <nav className="flex items-center">
            {BIBLIO_NAV.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link href={item.href} className="nav-link flex items-center gap-1">
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                  {openDropdown === item.label && (
                    <div className="absolute left-0 top-full w-64 z-50">
                      <div className="bg-white rounded-b-md shadow-lg border border-gray-200 py-1">
                        {item.children.map((child, ci) =>
                          child.divider ? (
                            <div key={ci} className="border-t border-gray-200 my-1" />
                          ) : child.external ? (
                            <a
                              key={child.href}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2980b9]"
                            >
                              {child.label}
                            </a>
                          ) : (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2980b9]"
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
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link"
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ),
            )}

            <a
              href="http://tlwww.vmk.hu/tlwww"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto nav-link flex items-center gap-1.5 text-[#2980b9] font-bold"
            >
              <Search className="w-4 h-4" />
              Online Katalógus
            </a>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 max-h-[80vh] overflow-y-auto">
          <form action="/kereses" method="get" className="p-4 border-b border-gray-100">
            <div className="flex">
              <input type="text" name="q" placeholder="Keresés..." className="search-input flex-1" />
              <button type="submit" className="search-btn">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <nav className="py-2">
            {BIBLIO_NAV.map((item) => (
              <div key={item.label}>
                <div className="flex items-center">
                  {item.href.startsWith('http') ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => !item.children && setMobileMenuOpen(false)}
                      className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.children && (
                    <button
                      onClick={() => setMobileSubmenu(mobileSubmenu === item.label ? null : item.label)}
                      className="p-2 pr-4 text-gray-400"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === item.label ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {item.children && mobileSubmenu === item.label && (
                  <div className="bg-gray-50 py-1">
                    {item.children.map((child, ci) =>
                      child.divider ? (
                        <div key={ci} className="border-t border-gray-200 my-1 mx-4" />
                      ) : child.external ? (
                        <a key={child.href} href={child.href} target="_blank" rel="noopener noreferrer" className="block px-8 py-2 text-sm text-gray-600 hover:text-[#2980b9]">
                          {child.label}
                        </a>
                      ) : (
                        <Link key={child.href} href={child.href} onClick={() => setMobileMenuOpen(false)} className="block px-8 py-2 text-sm text-gray-600 hover:text-[#2980b9]">
                          {child.label}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <Link href="/nyitvatartas" className="block text-sm text-gray-600 hover:text-[#2980b9] py-1">
              <Clock className="w-4 h-4 inline mr-1.5" />Nyitvatartás
            </Link>
            <Link href="/kapcsolat" className="block text-sm text-gray-600 hover:text-[#2980b9] py-1">
              <MapPin className="w-4 h-4 inline mr-1.5" />Elérhetőség
            </Link>
            <a href="http://tlwww.vmk.hu/tlwww" target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center mt-2">
              Online Katalógus
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
