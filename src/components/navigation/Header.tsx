'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, ChevronDown, Clock, HelpCircle, Calendar, User, Globe } from 'lucide-react'

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

const LPL_NAV: NavItem[] = [
  {
    label: 'Könyvek & Média',
    href: '/reszlegek',
    children: [
      { label: 'Új könyvek a polcon', href: '/hirek' },
      { label: 'Munkatársaink ajánlják', href: '/galeria' },
      { label: 'Online Katalógus', href: 'http://tlwww.vmk.hu/tlwww', external: true },
      { label: '', href: '#', divider: true },
      { label: 'Gyermekrészleg', href: 'http://gyerek.vmk.hu/', external: true },
      { label: 'Zenei részleg', href: 'http://av.vmk.hu', external: true },
      { label: 'Helyismereti gyűjtemény', href: 'http://helyismeret.vmk.hu', external: true },
    ],
  },
  {
    label: 'Szolgáltatások & Terek',
    href: '/szolgaltatasok',
    children: [
      { label: 'Beiratkozás', href: '/kapcsolat' },
      { label: 'Teremfoglalás', href: '/teremfoglalas' },
      { label: 'Kötészet', href: '/reszlegek/koteszet' },
      { label: 'WiFi elérhetőség', href: '/szolgaltatasok' },
      { label: '', href: '#', divider: true },
      { label: 'Budai Úti Tagkönyvtár', href: '/tagkonyvtarak/budai-ut' },
      { label: 'Mészöly G. Tagkönyvtár', href: '/tagkonyvtarak/meszoly-geza' },
      { label: 'Széna Téri Tagkönyvtár', href: '/tagkonyvtarak/szena-ter' },
      { label: 'Tolnai Úti Tagkönyvtár', href: '/tagkonyvtarak/tolnai-ut' },
      { label: 'Zsolt Úti Tagkönyvtár', href: '/tagkonyvtarak/zsolt-ut' },
    ],
  },
  {
    label: 'Kutatás & Tanulás',
    href: '/reszlegek',
    children: [
      { label: 'Olvasóterem', href: '/reszlegek/olvasoterem' },
      { label: 'Digitális könyvtár', href: '/hirek' },
      { label: 'Megyei Ellátás (KSZR)', href: 'http://www.fejerkszr.hu/', external: true },
    ],
  },
  { label: 'Hírek', href: '/hirek' },
]

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchScope, setSearchScope] = useState('Katalógus')
  const [searchBy, setSearchBy] = useState('Kulcsszó')

  return (
    <header className="relative z-50">
      {/* Row 1: Utility bar */}
      <div className="utility-bar">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-[38px] text-[13px]">
          <div className="hidden sm:flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Nyelv kiválasztása</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/nyitvatartas" className="hidden sm:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Nyitvatartás és helyszínek</span>
            </Link>
            <Link href="/kapcsolat" className="hidden md:flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Segítség</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </Link>
            <a
              href="http://tlwww.vmk.hu/tlwww/olvall.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="utility-bar-loginbtn"
            >
              <User className="w-3.5 h-3.5" />
              Bejelentkezés / Fiókom
              <ChevronDown className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>
      </div>
      <div className="utility-bar-divider" />

      {/* Row 2: Logo + Search */}
      <div className="logo-row">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="lpl-logo-mark" />
            <div className="lpl-logo-text hidden sm:block">
              <div className="line1">VÖRÖSMARTY MIHÁLY</div>
              <div className="line2">KÖNYVTÁR</div>
            </div>
          </Link>

          <form
            action="/kereses"
            method="get"
            className="hidden lg:flex items-center flex-wrap gap-2"
            onSubmit={(e) => {
              if (!searchQuery.trim()) e.preventDefault()
            }}
          >
            <span className="text-sm font-bold text-[var(--text-main)]">Keresés a</span>
            <select
              value={searchScope}
              onChange={(e) => setSearchScope(e.target.value)}
              className="search-select"
              aria-label="Keresési kör"
            >
              <option>Katalógus</option>
              <option>Honlap</option>
              <option>Galéria</option>
            </select>
            <span className="text-sm font-bold text-[var(--text-main)]">szerint</span>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="search-select"
              aria-label="Keresési mező"
            >
              <option>Kulcsszó</option>
              <option>Cím</option>
              <option>Szerző</option>
            </select>
            <span className="flex">
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keresés..."
                className="search-input w-[220px]"
              />
              <button type="submit" className="search-btn">
                <Search className="w-4 h-4" />
              </button>
            </span>
          </form>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded text-slate-700 hover:bg-slate-100"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 pb-2 hidden lg:block">
          <Link href="/kereses" className="text-xs text-[var(--secondary)] hover:underline font-semibold">
            Részletes keresés
          </Link>
        </div>
      </div>

      {/* Row 3: Navigation */}
      <div className="nav-row hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-4">
          <nav className="flex items-center">
            {LPL_NAV.map((item) =>
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
                      <div className="bg-white rounded-b-md shadow-lg border border-[var(--border-light)] py-1">
                        {item.children.map((child, ci) =>
                          child.divider ? (
                            <div key={ci} className="border-t border-[var(--border-light)] my-1" />
                          ) : child.external ? (
                            <a
                              key={child.href}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[var(--bg-pale-blue)] hover:text-[var(--secondary)]"
                            >
                              {child.label}
                            </a>
                          ) : (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[var(--bg-pale-blue)] hover:text-[var(--secondary)]"
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
                <Link key={item.label} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ),
            )}
            <Link href="/esemenyek" className="nav-link flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Események
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[var(--border-light)] max-h-[80vh] overflow-y-auto">
          <form action="/kereses" method="get" className="p-4 border-b border-gray-100">
            <div className="flex">
              <input type="text" name="q" placeholder="Keresés..." className="search-input flex-1" />
              <button type="submit" className="search-btn">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <nav className="py-2">
            {LPL_NAV.map((item) => (
              <div key={item.label}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={() => !item.children && setMobileMenuOpen(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50"
                  >
                    {item.label}
                  </Link>
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
                        <a key={child.href} href={child.href} target="_blank" rel="noopener noreferrer" className="block px-8 py-2 text-sm text-gray-600 hover:text-[var(--secondary)]">
                          {child.label}
                        </a>
                      ) : (
                        <Link key={child.href} href={child.href} onClick={() => setMobileMenuOpen(false)} className="block px-8 py-2 text-sm text-gray-600 hover:text-[var(--secondary)]">
                          {child.label}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
            <Link href="/esemenyek" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              Események
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <Link href="/nyitvatartas" className="block text-sm text-gray-600 hover:text-[var(--secondary)] py-1">
              <Clock className="w-4 h-4 inline mr-1.5" />Nyitvatartás és helyszínek
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
