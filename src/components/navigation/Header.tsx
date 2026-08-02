'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Search, Menu, X, Mail, Facebook, Youtube, ChevronDown } from 'lucide-react'

// A valós www.vmk.hu fejléce EGY vékony, teal színű navigációs sávból áll
// (nincs külön "nagy márka-sor" alatta - a cím a hero szalagban jelenik meg).
// Korábban itt egy kétsoros, modern SaaS-stílusú fejléc volt (sötét
// utility-sáv + nagy logó/cím sor) - ez vizuálisan messze állt az
// eredetitől. Ez a szerkezet a valós oldal fő navigációs elemeit követi:
// NYITVATARTÁS / ELÉRHETŐSÉGEINK / KÖZPONTI KÖNYVTÁR / TAGKÖNYVTÁRAK /
// MEGYEI ELLÁTÁS / GALÉRIA, jobb oldalon közösségi ikonokkal és az
// "Online Katalógus / Beiratkozás" gombbal.
export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Nyitvatartás', href: '/nyitvatartas' },
    { label: 'Elérhetőségeink', href: '/kapcsolat' },
    { label: 'Központi Könyvtár', href: '/reszlegek', hasDropdown: true },
    { label: 'Tagkönyvtárak', href: '/tagkonyvtarak', hasDropdown: true },
    { label: 'Megyei Ellátás', href: '/szolgaltatasok' },
    { label: 'Galéria', href: '/galeria' },
  ]

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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-0.5 px-3 py-2 rounded hover:bg-white/10 hover:text-white transition-colors"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
              </Link>
            ))}
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
        <div className="lg:hidden bg-white border-t border-[#0f656a] px-4 py-4 space-y-1">
          <nav className="flex flex-col text-sm font-medium text-slate-800">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-100"
              >
                {item.label}
              </Link>
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
