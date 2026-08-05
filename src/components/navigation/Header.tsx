'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X, ChevronDown, Clock, MapPin, User, ExternalLink } from 'lucide-react'

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

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Könyvtáraink',
    href: '/reszlegek',
    children: [
      { label: 'Központi Könyvtár', href: '/reszlegek' },
      { label: 'Felnőtt kölcsönző részleg', href: '/reszlegek/felnott-kolcsonzo' },
      { label: 'Gyermekrészleg', href: 'http://gyerek.vmk.hu/', external: true },
      { label: 'Helyismeret', href: 'http://helyismeret.vmk.hu', external: true },
      { label: 'Olvasóterem', href: '/reszlegek/olvasoterem' },
      { label: 'Pedagógiai részleg', href: '/reszlegek/pedagogiai-reszleg' },
      { label: 'Zenei és számítógépes részleg', href: 'http://av.vmk.hu', external: true },
      { label: '', href: '#', divider: true },
      { label: 'Budai Úti Tagkönyvtár', href: '/tagkonyvtarak/budai-ut' },
      { label: 'Mészöly G. Tagkönyvtár', href: '/tagkonyvtarak/meszoly-geza' },
      { label: 'Széna Téri Tagkönyvtár', href: '/tagkonyvtarak/szena-ter' },
      { label: 'Tolnai Úti Tagkönyvtár', href: '/tagkonyvtarak/tolnai-ut' },
      { label: 'Zsolt Úti Tagkönyvtár', href: '/tagkonyvtarak/zsolt-ut' },
    ],
  },
  { label: 'Rendezvények', href: '/esemenyek' },
  { label: 'Hírek', href: '/hirek' },
  {
    label: 'Szolgáltatások',
    href: '/szolgaltatasok',
    children: [
      { label: 'Online Katalógus', href: 'http://tlwww.vmk.hu/tlwww', external: true },
      { label: 'Beiratkozás', href: '/kapcsolat' },
      { label: 'Teremfoglalás', href: '/teremfoglalas' },
      { label: 'WiFi', href: '/szolgaltatasok' },
      { label: 'Kötészet', href: '/reszlegek/koteszet' },
      { label: '', href: '#', divider: true },
      { label: 'Megyei Ellátás (KSZR)', href: 'http://www.fejerkszr.hu/', external: true },
    ],
  },
  { label: 'Galéria', href: '/galeria' },
]

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="relative z-50">
      {/* Top bar — dark strip */}
      <div className="nypl-topbar">
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between h-[32px]">
          <div className="flex items-center gap-3">
            <Link href="/nyitvatartas" className="flex items-center gap-1 hover:text-white">
              <Clock className="w-3 h-3" /> Nyitvatartás
            </Link>
            <Link href="/kapcsolat" className="flex items-center gap-1 hover:text-white">
              <MapPin className="w-3 h-3" /> Helyszínek
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a href="http://tlwww.vmk.hu/tlwww/olvall.htm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white">
              <User className="w-3 h-3" /> Fiókom
            </a>
            <a href="http://tlwww.vmk.hu/tlwww" target="_blank" rel="noopener noreferrer" className="bg-[#c62828] text-white px-3 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider hover:bg-[#b71c1c] transition-colors">
              Online Katalógus
            </a>
          </div>
        </div>
      </div>

      {/* Main header — logo + search */}
      <div className="nypl-header">
        <div className="max-w-[1280px] mx-auto px-5 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/brand/vmk-logo.png"
              alt="Vörösmarty Mihály Könyvtár"
              width={220}
              height={80}
              className="h-[65px] w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {searchOpen ? (
              <form action="/kereses" method="get" className="flex items-center">
                <input
                  type="text"
                  name="q"
                  autoFocus
                  placeholder="Keresés..."
                  className="border-2 border-gray-300 rounded-l px-3 py-2 text-sm w-[280px] outline-none focus:border-[#c62828]"
                />
                <button type="submit" className="bg-[#c62828] text-white px-4 py-2 rounded-r border-2 border-[#c62828] hover:bg-[#b71c1c] transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="ml-2 p-2 text-gray-400 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#c62828] transition-colors p-2">
                <Search className="w-5 h-5" />
                <span className="font-medium">Keresés</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded text-gray-700 hover:bg-gray-100"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Navigation strip */}
        <div className="hidden lg:block border-t border-gray-100">
          <div className="max-w-[1280px] mx-auto px-5">
            <nav className="flex items-center">
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link href={item.href} className="nypl-nav-link flex items-center gap-1">
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-40" />
                    </Link>
                    {openDropdown === item.label && (
                      <div className="absolute left-0 top-full w-72 z-50">
                        <div className="bg-white rounded-b shadow-xl border border-gray-200 py-1.5">
                          {item.children.map((child, ci) =>
                            child.divider ? (
                              <div key={ci} className="border-t border-gray-100 my-1" />
                            ) : child.external ? (
                              <a key={child.href} href={child.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#c62828]">
                                {child.label}
                                <ExternalLink className="w-3 h-3 opacity-30" />
                              </a>
                            ) : (
                              <Link key={child.href} href={child.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#c62828]">
                                {child.label}
                              </Link>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={item.label} href={item.href} className="nypl-nav-link">
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 max-h-[80vh] overflow-y-auto shadow-lg">
          <form action="/kereses" method="get" className="p-4 border-b border-gray-100">
            <div className="flex">
              <input type="text" name="q" placeholder="Keresés..." className="border-2 border-gray-200 rounded-l px-3 py-2 text-sm flex-1 outline-none focus:border-[#c62828]" />
              <button type="submit" className="bg-[#c62828] text-white px-4 py-2 rounded-r">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <nav className="py-2">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <div className="flex items-center">
                  <Link href={item.href} onClick={() => !item.children && setMobileMenuOpen(false)} className="flex-1 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                    {item.label}
                  </Link>
                  {item.children && (
                    <button onClick={() => setMobileSubmenu(mobileSubmenu === item.label ? null : item.label)} className="p-2 pr-5 text-gray-400">
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === item.label ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {item.children && mobileSubmenu === item.label && (
                  <div className="bg-gray-50 py-1">
                    {item.children.map((child, ci) =>
                      child.divider ? (
                        <div key={ci} className="border-t border-gray-200 my-1 mx-5" />
                      ) : child.external ? (
                        <a key={child.href} href={child.href} target="_blank" rel="noopener noreferrer" className="block px-9 py-2 text-sm text-gray-600 hover:text-[#c62828]">
                          {child.label}
                        </a>
                      ) : (
                        <Link key={child.href} href={child.href} onClick={() => setMobileMenuOpen(false)} className="block px-9 py-2 text-sm text-gray-600 hover:text-[#c62828]">
                          {child.label}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
