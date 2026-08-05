import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, MapPin, BookOpen, Users, Wifi, Search, Library, Monitor, Database, Quote, Star } from 'lucide-react'
import {
  getLatestNews,
  getUpcomingEvents,
  getAllLibraries,
  getAllGalleries,
} from '@/lib/payload'

const MONTHS_HU = ['JAN', 'FEB', 'MÁR', 'ÁPR', 'MÁJ', 'JÚN', 'JÚL', 'AUG', 'SZEP', 'OKT', 'NOV', 'DEC']

function formatDateHu(dateStr: string) {
  const d = new Date(dateStr)
  return {
    month: MONTHS_HU[d.getMonth()],
    day: d.getDate(),
    full: d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' }),
  }
}

const RECOMMENDED_BOOKS = [
  { title: 'A gyertyák csonkig égnek', author: 'Márai Sándor', color: '#1a5276' },
  { title: 'Az ajtó', author: 'Szabó Magda', color: '#2c3e50' },
  { title: 'Sorstalanság', author: 'Kertész Imre', color: '#5D4E37' },
  { title: 'Harmonia Caelestis', author: 'Esterházy Péter', color: '#1B5E20' },
  { title: 'Légy jó mindhalálig', author: 'Móricz Zsigmond', color: '#4A148C' },
  { title: 'Abigél', author: 'Szabó Magda', color: '#154360' },
]

const DIGITAL_LIBRARY = [
  { name: 'Magyar Elektronikus Könyvtár (MEK)', desc: 'Az OSZK digitális gyűjteménye — több ezer szabadon elérhető magyar nyelvű mű', href: 'https://mek.oszk.hu/', icon: Library },
  { name: 'Digitális Irodalmi Akadémia (DIA)', desc: 'Kortárs magyar irodalom teljes szövegű online gyűjteménye', href: 'https://dia.pool.pim.hu/', icon: BookOpen },
  { name: 'Arcanum Digitális Tudománytár', desc: 'Magyar folyóiratok, napilapok és enciklopédiák kereshető archívuma', href: 'https://www.arcanum.com/', icon: Database },
  { name: 'EBSCO Adatbázisok', desc: 'Nemzetközi tudományos adatbázisok elérhetők könyvtári olvasójeggyel', href: 'https://search.ebscohost.com/', icon: Monitor },
]

const TESTIMONIALS = [
  { quote: 'A gyerekeim imádják a mesedélutánokat. Minden héten visszajárunk, és mindig találunk valami újat a polcokon.', author: 'K. Anna', role: 'Rendszeres olvasó, 2 gyermekes anyuka' },
  { quote: 'A helyismereti részleg felbecsülhetetlen kincs. A családfakutatásomhoz itt találtam meg az évtizedek óta keresett dokumentumokat.', author: 'M. Péter', role: 'Helytörténet-kutató' },
  { quote: 'A teremfoglalás rendszer nagyon kényelmes, és a személyzet mindig készséges. Kiváló hely a közösségi munkához.', author: 'Sz. Katalin', role: 'Civil szervezet vezetője' },
]

const COLLECTION_BOOKS = [
  { title: 'A Balaton-felvidék rejtett ösvényei', author: 'Kovács M.' },
  { title: 'Kerékpártúrák Magyarországon', author: 'Nagy Á.' },
  { title: 'Nyári receptek a kertből', author: 'Szabó É.' },
  { title: 'Kalandregények fiataloknak', author: 'Tóth B.' },
]

export default async function HomePage() {
  const cmsNews = await getLatestNews(6)
  const cmsEvents = await getUpcomingEvents(4)
  const cmsLibraries = await getAllLibraries()
  const cmsGalleries = await getAllGalleries(6)

  const sampleNews = [
    { id: 'f1', title: 'Nyári olvasójáték és könyvajánló fiataloknak', summary: 'Csatlakozz nyári olvasási kihívásunkhoz! Értékes könyvcsomagok várnak a legszorgalmasabb olvasókra.', publishedAt: '2026-07-20T10:00:00.000Z', slug: 'nyari-olvasojatek-2026' },
    { id: 'f2', title: 'Megújult a Központi Könyvtár Helyismereti Részlege', summary: 'Digitális archívumunk bővült és kényelmes kutatóboxok várják a helytörténet iránt érdeklődő látogatókat.', publishedAt: '2026-07-15T09:00:00.000Z', slug: 'helyismeret-megujulas' },
    { id: 'f3', title: 'Író-olvasó találkozó a Gyermekkönyvtárban', summary: 'Vendégünk lesz a népszerű ifjúsági regénysorozat szerzője. Dedikálás és beszélgetés.', publishedAt: '2026-07-10T14:00:00.000Z', slug: 'iro-olvaso-talalkozo' },
    { id: 'f4', title: 'Digitális írástudás tanfolyam időseknek', summary: 'Ingyenes számítógépes tanfolyam 60 év felettieknek.', publishedAt: '2026-07-05T10:00:00.000Z', slug: 'digitalis-irastudas' },
    { id: 'f5', title: 'Új könyvek a polcokon — Júliusi beszerzések', summary: 'Több mint 200 új kötet érkezett a könyvtár állományába.', publishedAt: '2026-07-01T10:00:00.000Z', slug: 'uj-konyvek-julius' },
  ]

  const sampleEvents = [
    { id: 'fe1', title: 'Kortárs Könyvklub: Nyári Könyvmustra', startDate: '2026-08-05T17:00:00.000Z', locationName: 'Központi Könyvtár – Olvasóterem', slug: 'kortars-konyvklub-augusztus' },
    { id: 'fe2', title: 'Mesedélután és Kézműves Foglalkozás', startDate: '2026-08-12T15:30:00.000Z', locationName: 'Gyermekkönyvtár', slug: 'mesedelutan-gyermekkonyvtar' },
    { id: 'fe3', title: 'Csendes Olvasás a Szabadban', startDate: '2026-08-04T16:00:00.000Z', locationName: 'Széna Téri Tagkönyvtár', slug: 'csendes-olvasas-szabadban' },
    { id: 'fe4', title: 'Családi Filmvetítés a Kertben', startDate: '2026-08-18T19:00:00.000Z', locationName: 'Központi Könyvtár – Kert', slug: 'csaladi-filmvetites' },
  ]

  const displayNews = cmsNews.length > 0 ? cmsNews : sampleNews
  const displayEvents = cmsEvents.length > 0 ? cmsEvents : sampleEvents

  const featuredItem = displayNews[0]
  const latestItems = displayNews.slice(1, 5)

  const featuredImg = featuredItem && 'featuredImage' in featuredItem && featuredItem.featuredImage && typeof featuredItem.featuredImage === 'object' && 'url' in featuredItem.featuredImage
    ? (featuredItem.featuredImage.url as string)
    : undefined

  const locations = cmsLibraries
    .filter((l) => l.type === 'central' || l.type === 'branch')
    .sort((a, b) => (a.type === 'central' ? -1 : b.type === 'central' ? 1 : 0))

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="py-3 md:py-5">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-cardo), system-ui, sans-serif' }}>
              Üdvözöljük a Vörösmarty Mihály Könyvtárban
            </h1>
            <p className="text-blue-100 text-base md:text-lg max-w-2xl mb-5">
              Székesfehérvár legnagyobb közkönyvtára — {locations.length} helyszín, több ezer könyv, rendszeres programok minden korosztálynak.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="http://tlwww.vmk.hu/tlwww" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-[#1a5276] px-5 py-2.5 rounded font-semibold text-sm hover:bg-blue-50 transition-colors">
                <Search className="w-4 h-4" />
                Katalógus keresés
              </a>
              <Link href="/esemenyek" className="inline-flex items-center gap-2 border-2 border-white/50 text-white px-5 py-2.5 rounded font-semibold text-sm hover:bg-white/10 transition-colors">
                <Calendar className="w-4 h-4" />
                Programok
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: 3-column grid */}
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] gap-6">

          {/* Column 1: Featured / Kiemelt */}
          <div>
            <h2 className="section-heading">Kiemelt</h2>
            {featuredItem && (
              <Link href={`/hirek/${featuredItem.slug}`} className="card-flat block group">
                <div className="relative aspect-[16/10] bg-gray-100">
                  {featuredImg ? (
                    <Image src={featuredImg} alt={featuredItem.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 400px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a5276] to-[#2980b9] text-white/30 text-4xl font-bold">VMK</div>
                  )}
                </div>
                <div className="p-4">
                  <span className="category-badge mb-2 inline-block">Hír</span>
                  <h3 className="text-lg font-bold text-[#1a5276] group-hover:text-[#2980b9] transition-colors mt-1 mb-2">{featuredItem.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{featuredItem.summary}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(typeof featuredItem.publishedAt === 'string' ? featuredItem.publishedAt : '').toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </Link>
            )}
          </div>

          {/* Column 2: Latest / Legfrissebb */}
          <div>
            <h2 className="section-heading">Legfrissebb</h2>
            <div className="space-y-0">
              {latestItems.map((item, i) => {
                const img = 'featuredImage' in item && item.featuredImage && typeof item.featuredImage === 'object' && 'url' in item.featuredImage
                  ? (item.featuredImage.url as string) : undefined
                return (
                  <Link key={item.id} href={`/hirek/${item.slug}`} className={`flex gap-3 py-3 group ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                    <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 shrink-0">
                      {img ? (
                        <Image src={img} alt={item.title} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#2980b9] text-white/40 text-xs font-bold">VMK</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="category-badge text-[10px] mb-1 inline-block">Hír</span>
                      <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#2980b9] transition-colors line-clamp-2 leading-snug">{item.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(typeof item.publishedAt === 'string' ? item.publishedAt : '').toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-4">
              <Link href="/hirek" className="btn-outline text-sm">Összes hír <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
          </div>

          {/* Column 3: Events / Programok */}
          <div>
            <h2 className="section-heading">Programok</h2>
            <div className="space-y-0">
              {displayEvents.map((event, i) => {
                const dateStr = typeof event.startDate === 'string' ? event.startDate : new Date().toISOString()
                const { month, day } = formatDateHu(dateStr)
                const locName = 'locationName' in event && typeof event.locationName === 'string' ? event.locationName : ''
                return (
                  <Link key={event.id} href={`/esemenyek/${event.slug}`} className={`flex gap-3 py-3 group ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                    <div className="date-badge">
                      <div className="date-badge-month">{month}</div>
                      <div className="date-badge-day">{day}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#2980b9] transition-colors line-clamp-2 leading-snug">{event.title}</h3>
                      {locName && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{locName}</span>
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-4">
              <Link href="/esemenyek" className="btn-primary text-sm w-full justify-center">
                <Calendar className="w-4 h-4" /> Összes esemény
              </Link>
            </div>
          </div>
        </div>

        {/* Services row */}
        <div className="mt-6 pt-5 border-t border-gray-200">
          <h2 className="section-heading">Szolgáltatások</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Search, label: 'Online Katalógus', desc: 'Könyvek és médiatartalmak keresése', href: 'http://tlwww.vmk.hu/tlwww', external: true },
              { icon: BookOpen, label: 'Beiratkozás', desc: 'Iratkozz be könyvtárunkba', href: '/kapcsolat', external: false },
              { icon: Users, label: 'Teremfoglalás', desc: 'Közösségi terem foglalása', href: '/teremfoglalas', external: false },
              { icon: Wifi, label: 'WiFi', desc: 'Ingyenes internet a könyvtárban', href: '/szolgaltatasok', external: false },
            ].map((svc) => {
              const Icon = svc.icon
              const inner = (
                <div className="card-flat p-5 text-center h-full flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#2980b9]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1a5276]">{svc.label}</h3>
                  <p className="text-xs text-gray-500">{svc.desc}</p>
                </div>
              )
              return svc.external ? (
                <a key={svc.label} href={svc.href} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                <Link key={svc.label} href={svc.href}>{inner}</Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ============ AJÁNLOTT KÖNYVEK ============ */}
      <div className="section-alt-v2 py-6">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="section-heading">Munkatársaink ajánlásával</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {RECOMMENDED_BOOKS.map((book) => (
              <div key={book.title} className="book-card-v2 group cursor-pointer">
                <div className="book-cover-v2" style={{ background: `linear-gradient(160deg, ${book.color} 0%, ${book.color}cc 100%)` }}>
                  <div className="w-full h-full flex flex-col items-center justify-center px-3 text-center">
                    <div className="text-white/25 text-[10px] font-bold mb-2 uppercase tracking-widest">VMK</div>
                    <div className="text-white text-[11px] font-semibold leading-tight">{book.title}</div>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-800 leading-tight mt-1 group-hover:text-[#2980b9] transition-colors line-clamp-2">{book.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ STATISZTIKÁK SÁV ============ */}
      <div className="stats-bar-v2">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '120 000+', label: 'Kötet' },
              { number: '6', label: 'Helyszín' },
              { number: '500+', label: 'Program évente' },
              { number: '85+', label: 'Év tapasztalat' },
            ].map((stat) => (
              <div key={stat.label} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ KIEMELT GYŰJTEMÉNY ============ */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="collection-v2 grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">Kiemelt gyűjtemény</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-cardo), system-ui, sans-serif' }}>
              Nyári olvasmányok 2026
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              Válogatás munkatársaink kedvenc nyári olvasmányaiból — könnyű regények, izgalmas krimik, útikönyvek és természetjáró kalauzok.
            </p>
            <div className="space-y-2">
              {COLLECTION_BOOKS.map((b) => (
                <div key={b.title} className="flex items-center gap-2 text-sm text-white/80">
                  <BookOpen className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                  <span className="font-medium text-white">{b.title}</span>
                  <span className="text-blue-200">— {b.author}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/hirek" className="inline-flex items-center gap-2 bg-white text-[#1a5276] px-5 py-2.5 rounded font-semibold text-sm hover:bg-blue-50 transition-colors">
                Felfedezés <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center p-10">
            <div className="grid grid-cols-2 gap-3 max-w-[260px]">
              {COLLECTION_BOOKS.map((b, i) => (
                <div key={i} className="aspect-[2/3] rounded bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-3">
                  <span className="text-white/60 text-[10px] font-bold text-center leading-tight">{b.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ DIGITÁLIS KÖNYVTÁR ============ */}
      <div className="section-alt-v2 py-6">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="section-heading">Digitális könyvtár</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DIGITAL_LIBRARY.map((item) => {
              const Icon = item.icon
              return (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="digi-card-v2 group block">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2980b9] mb-3 group-hover:bg-[#2980b9] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#2980b9] transition-colors mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* ============ OLVASÓI VÉLEMÉNYEK ============ */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <h2 className="section-heading">Olvasóink mondták</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-v2">
              <Quote className="w-5 h-5 text-[#2980b9]/30 mb-2" />
              <p className="text-sm italic text-gray-700 leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#2980b9] text-xs font-bold">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{t.author}</div>
                  <div className="text-[11px] text-gray-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pb-6">
        {/* Locations row */}
        {locations.length > 0 && (
          <div className="pt-8 border-t border-gray-200">
            <h2 className="section-heading">Helyszíneink</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={loc.type === 'central' ? `/reszlegek` : `/tagkonyvtarak/${loc.slug}`}
                  className="card-flat p-4 flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded bg-[#1a5276] flex items-center justify-center text-white shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#2980b9] transition-colors">{loc.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{loc.type === 'central' ? 'Központi könyvtár' : 'Tagkönyvtár'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {cmsGalleries.length > 0 && (
          <div className="mt-6 pt-5 border-t border-gray-200">
            <h2 className="section-heading">Galéria</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cmsGalleries.map((g) => {
                const cover = g.coverImage && typeof g.coverImage === 'object' && 'url' in g.coverImage ? (g.coverImage.url as string) : undefined
                return (
                  <Link key={g.id} href={`/galeria/${g.slug}`} className="card-flat group block">
                    <div className="relative aspect-[3/2] bg-gray-100">
                      {cover ? (
                        <Image src={cover} alt={g.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 33vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#2980b9] text-white/30 text-sm font-bold">VMK</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#2980b9] transition-colors truncate">{g.title}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="flex justify-end mt-4">
              <Link href="/galeria" className="btn-outline text-sm">Összes galéria <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
