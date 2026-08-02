import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { MapPin, Phone, Mail, Clock, Building2 } from 'lucide-react'
import { ContactForm } from '@/components/forms/ContactForm'
import { getAllLibraries } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Kapcsolat – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár elérhetőségei, megközelíthetősége és kapcsolatfelvételi űrlapja.',
}

// A valós www.vmk.hu "Elérhetőségeink" oldala elsősorban egy munkatárs- és
// tagkönyvtár-elérhetőségi jegyzék (vezetőség, osztályok, majd mind az 5
// tagkönyvtár saját címe/telefonja), NEM egy általános üzenetküldő űrlap -
// ezt lekérdezve derült ki. A felhasználó ugyanakkor explicit kérte, hogy a
// kapcsolatfelvételi űrlap MŰKÖDJÖN (korábban ma javítva) - ezért az űrlapot
// megtartjuk, és kiegészítjük a hiányzó, valós tagkönyvtár-jegyzékkel.
export default async function KapcsolatPage() {
  const libraries = await getAllLibraries()
  const branches = libraries.filter((l) => l.type === 'branch')
  return (
    <PageWithSidebar>
      <div className="space-y-10">
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
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#159097] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-900">Címünk</strong>
                  <span>8000 Székesfehérvár, Bartók Béla tér 1.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#e4b02c] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-900">Telefon / Kölcsönzőpult</strong>
                  <a href="tel:+3622312845" className="hover:underline">+36 22 312 845</a>
                  <span className="mx-1">·</span>
                  <a href="tel:+3622312684" className="hover:underline">+36 22 312 684</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#159097] flex items-center justify-center shrink-0 mt-0.5">
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

            <ContactForm />
          </div>
        </div>
      </div>

      {branches.length > 0 && (
        <div className="border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#159097]" />
            Tagkönyvtáraink Elérhetőségei
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Keresse fel az Önhöz legközelebbi tagkönyvtárunkat közvetlenül is.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <Link
                key={branch.id}
                href={`/tagkonyvtarak/${branch.slug}`}
                className="block bg-white p-4 rounded-lg border border-slate-200 hover:border-[#159097] hover:shadow-sm transition-all"
              >
                <h3 className="font-bold text-slate-900 text-sm mb-2">{branch.name}</h3>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#e4b02c] shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>
                  {branch.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#e4b02c] shrink-0" />
                      <span>{branch.phone}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </PageWithSidebar>
  )
}
