import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kapcsolat – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár elérhetőségei, megközelíthetősége és kapcsolatfelvételi űrlapja.',
}

export default function KapcsolatPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      <Breadcrumb items={[{ label: 'Kapcsolat' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900">Kapcsolat & Megközelíthetőség</h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Kérdése, észrevétele van? Lépjen kapcsolatba velünk telefonon, e-mailben vagy az alábbi űrlap segítségével!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bal oszlop: Elérhetőségek */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Központi Elérhetőségek</h2>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#F3701D] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-900">Címünk</strong>
                  <span>8000 Székesfehérvár, Bartók Béla tér 1.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#DDB837] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-900">Telefon / Kölcsönzőpult</strong>
                  <a href="tel:+3622312845" className="hover:underline">+36 22 312 845</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#F3701D] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-900">E-mail cím</strong>
                  <a href="mailto:info@vmk.hu" className="hover:underline">info@vmk.hu</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-900">Központi Nyitvatartás</strong>
                  <span>Kedd – Péntek: 09:00 - 19:00</span> <br />
                  <span>Szombat: 09:00 - 16:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobb oszlop: Üzenetküldő űrlap */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Írjon nekünk üzenetet!</h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teljes Név *</label>
                  <input
                    type="text"
                    required
                    placeholder="Minta János"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3701D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail cím *</label>
                  <input
                    type="email"
                    required
                    placeholder="janos@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3701D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tárgy / Téma</label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3701D]">
                  <option>Általános érdeklődés</option>
                  <option>Könyvhosszabbítás / Kölcsönzés</option>
                  <option>Rendezvény regisztráció</option>
                  <option>Terembérlés</option>
                  <option>Helyismereti kutatás</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Üzenet szövege *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Írja le kérdését vagy észrevételét..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3701D]"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full sm:w-auto justify-center text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Üzenet Elküldése</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
