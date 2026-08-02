'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Search, Menu, X, Clock, Phone, MapPin } from 'lucide-react'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass-header">
      {/* Top Utility Bar */}
      <div className="bg-[#1E293B] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Központi Könyvtár ma: <strong className="text-white">09:00 - 19:00</strong></span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>Székesfehérvár, Bartók Béla tér 1.</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:+3622312845" className="hover:text-white transition flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+36 22 312 845</span>
            </a>
            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <button 
                title="Kontrasztos mód"
                aria-label="Kontrasztos nézet"
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-slate-600"
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#159097] to-[#e4b02c] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-[#159097]">
              Vörösmarty Mihály Könyvtár
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              Székesfehérvár Megyei Jogú Város Városi Könyvtára
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-slate-700">
          <Link href="/" className="hover:text-[#159097] transition-colors">
            Főoldal
          </Link>
          <Link href="/nyitvatartas" className="hover:text-[#159097] transition-colors">
            Nyitvatartás
          </Link>
          <Link href="/#hirek" className="hover:text-[#159097] transition-colors">
            Hírek
          </Link>
          <Link href="/#esemenyek" className="hover:text-[#159097] transition-colors">
            Események
          </Link>
          <Link href="/#szolgaltatasok" className="hover:text-[#159097] transition-colors">
            Szolgáltatások
          </Link>
          <Link href="/#kapcsolat" className="hover:text-[#159097] transition-colors">
            Kapcsolat
          </Link>
        </nav>

        {/* Catalog CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/kereses"
            aria-label="Keresés a honlapon (hírek, események)"
            title="Keresés a honlapon"
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#159097] transition-colors"
          >
            <Search className="w-4 h-4" />
          </Link>
          <a
            href="https://katalogus.vmk.hu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-catalog text-xs sm:text-sm"
          >
            <Search className="w-4 h-4" />
            <span>Online Katalógus</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
          aria-label="Menü megnyitása"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Főoldal
            </Link>
            <Link
              href="/nyitvatartas"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Nyitvatartás
            </Link>
            <Link
              href="/#hirek"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Hírek
            </Link>
            <Link
              href="/#esemenyek"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Események
            </Link>
            <Link
              href="/#szolgaltatasok"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Szolgáltatások
            </Link>
            <Link
              href="/#kapcsolat"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Kapcsolat
            </Link>
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
              <span>Online Katalógus kereső</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
