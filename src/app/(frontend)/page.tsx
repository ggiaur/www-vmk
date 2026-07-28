import React from 'react'
import Link from 'next/link'
import { Search, BookOpen, Calendar, ArrowRight, Sparkles, FileText, Bookmark, Users } from 'lucide-react'
import { OpeningHoursWidget } from '@/components/ui/OpeningHoursWidget'
import { NewsCard } from '@/components/ui/NewsCard'
import { EventCard } from '@/components/ui/EventCard'
import { LibraryCard } from '@/components/ui/LibraryCard'

export default function HomePage() {
  const sampleNews = [
    {
      title: 'Nyári olvasójáték és könyvajánló fiataloknak',
      summary:
        'Csatlakozz nyári olvasási kihívásunkhoz! Értékes könyvcsomagok és ajándékutalványok várnak a legszorgalmasabb olvasókra.',
      category: 'grant',
      publishedAt: '2026-07-20T10:00:00.000Z',
      slug: 'nyari-olvasojatek-2026',
    },
    {
      title: 'Megújult a Központi Könyvtár Helyismereti Részlege',
      summary:
        'Digitális archívumunk bővült és kényelmes kutatóboxok várják a helytörténet iránt érdeklődő látogatókat.',
      category: 'announcement',
      publishedAt: '2026-07-15T09:00:00.000Z',
      slug: 'helyismeret-megujulas',
    },
    {
      title: 'Író-olvasó találkozó a Gyermekkönyvtárban',
      summary:
        'Vendégünk lesz a népszerű ifjúsági regénysorozat szerzője. Dedikálás és beszélgetés a gyerekkönyvtári teremben.',
      category: 'general',
      publishedAt: '2026-07-10T14:00:00.000Z',
      slug: 'iro-olvaso-talalkozo',
    },
  ]

  const sampleEvents = [
    {
      title: 'Kortárs Könyvklub: Nyári Könyvmustra',
      startDate: '2026-08-05T17:00:00.000Z',
      locationName: 'Központi Könyvtár – Olvasóterem',
      targetAudience: 'adults',
      slug: 'kortars-konyvklub-augusztus',
    },
    {
      title: 'Mesedélután és Kézműves Foglalkozás',
      startDate: '2026-08-12T15:30:00.000Z',
      locationName: 'Gyermekkönyvtár (Bartók B. tér 1.)',
      targetAudience: 'children',
      slug: 'mesedelutan-gyermekkonyvtar',
    },
  ]

  const sampleLibraries = [
    {
      name: 'Központi Könyvtár',
      slug: 'kozponti-konyvtar',
      address: '8000 Székesfehérvár, Bartók Béla tér 1.',
      phone: '+36 22 312 845',
      email: 'info@vmk.hu',
      type: 'central',
    },
    {
      name: 'Budai Úti Tagkönyvtár',
      slug: 'budai-uti-tagkonyvtar',
      address: '8000 Székesfehérvár, Budai út 44-46.',
      phone: '+36 22 315 253',
      email: 'budai@vmk.hu',
      type: 'branch',
    },
    {
      name: 'Mészöly Géza Úti Tagkönyvtár',
      slug: 'meszoly-geza-uti-tagkonyvtar',
      address: '8000 Székesfehérvár, Mészöly G. u. 7.',
      phone: '+36 22 329 401',
      email: 'meszoly@vmk.hu',
      type: 'branch',
    },
  ]

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E293B] via-[#2A1619] to-[#8C1D11] text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vörösmarty Mihály Könyvtár</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              Tudás, Élménypont és Közösség <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300">
                Székesfehérvár Szívében
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Böngésszen több mint 300 000 kötetből álló katalógusunkban, fizessen elő e-könyvekre, vagy vegyen részt színes kulturális rendezvényeinken!
            </p>

            {/* Catalog Search Bar */}
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-2xl max-w-xl">
              <form
                action="https://katalogus.vmk.hu"
                method="GET"
                target="_blank"
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Szerző, cím, témakör keresése a katalógusban..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#C85A32] hover:bg-[#b04b26] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Keresés</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <OpeningHoursWidget />
          </div>
        </div>
      </section>

      {/* Hírek Section */}
      <section id="hirek" className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#8C1D11] uppercase tracking-wider">Hírek & Tájékoztatók</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Legfrissebb Könyvtári Hírek</h2>
          </div>
          <Link
            href="/#hirek"
            className="text-sm font-semibold text-[#8C1D11] hover:underline flex items-center gap-1"
          >
            <span>Összes hír megtekintése</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleNews.map((news, idx) => (
            <NewsCard key={idx} {...news} />
          ))}
        </div>
      </section>

      {/* Rendezvények Section */}
      <section id="esemenyek" className="bg-[#F5EFEE] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-[#C85A32] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Programajánló
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Közelgő Rendezvényeink</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleEvents.map((event, idx) => (
              <EventCard key={idx} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* Tagkönyvtárak Grid */}
      <section id="tagkonyvtarakt" className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#8C1D11] uppercase tracking-wider">Hálózatunk</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Tagkönyvtárak & Részlegek</h2>
          <p className="text-slate-600 text-sm mt-2">
            Találja meg az Önhöz legközelebbi tagkönyvtárunkat Székesfehérváron!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleLibraries.map((lib, idx) => (
            <LibraryCard key={idx} {...lib} />
          ))}
        </div>
      </section>

      {/* Szolgáltatások Highlights */}
      <section id="szolgaltatasok" className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#1E293B] to-[#2A1619] text-white rounded-2xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Könyvtári Szolgáltatásaink</h2>
            <p className="text-slate-300 text-sm sm:text-base">
              A könyvkölcsönzésen túl számos kényelmi és digitális szolgáltatással várjuk olvasóinkat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/10">
              <BookOpen className="w-8 h-8 text-amber-300 mb-3" />
              <h3 className="font-bold text-base mb-1">Könyv & Folyóirat</h3>
              <p className="text-xs text-slate-300">Több százezer nyomtatott dokumentum, folyóirat és dokumentumkölcsönzés.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/10">
              <FileText className="w-8 h-8 text-amber-300 mb-3" />
              <h3 className="font-bold text-base mb-1">E-Könyvek & NAVA</h3>
              <p className="text-xs text-slate-300">Digitális adatbázisok, NAVA pont és e-könyv kölcsönzési lehetőség.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/10">
              <Bookmark className="w-8 h-8 text-amber-300 mb-3" />
              <h3 className="font-bold text-base mb-1">Helyismereti Kutatás</h3>
              <p className="text-xs text-slate-300">Székesfehérvár és Fejér vármegye helytörténeti ritkaságai és kutatószolgálat.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/10">
              <Users className="w-8 h-8 text-amber-300 mb-3" />
              <h3 className="font-bold text-base mb-1">Közösségi Terek</h3>
              <p className="text-xs text-slate-300">Rendezvénytermek, wifi, tanulóboxok és kézműves műhelyek.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
