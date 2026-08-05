import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, MapPin, BookOpen, Globe, Quote, Star, Library, Monitor, Database, Newspaper } from 'lucide-react'
import {
  getLatestNews,
  getUpcomingEvents,
  getAllGalleries,
} from '@/lib/payload'

const MONTHS_HU = ['JAN', 'FEB', 'MÁR', 'ÁPR', 'MÁJ', 'JÚN', 'JÚL', 'AUG', 'SZEP', 'OKT', 'NOV', 'DEC']

const RECOMMENDED_BOOKS = [
  { title: 'A gyertyák csonkig égnek', author: 'Márai Sándor', color: '#8B0000' },
  { title: 'Az ajtó', author: 'Szabó Magda', color: '#2E4057' },
  { title: 'Sorstalanság', author: 'Kertész Imre', color: '#5D4E37' },
  { title: 'Harmonia Caelestis', author: 'Esterházy Péter', color: '#1B5E20' },
  { title: 'Légy jó mindhalálig', author: 'Móricz Zsigmond', color: '#4A148C' },
  { title: 'Abigél', author: 'Szabó Magda', color: '#BF360C' },
]

const DIGITAL_LIBRARY = [
  { name: 'Magyar Elektronikus Könyvtár (MEK)', desc: 'Az OSZK digitális gyűjteménye — több ezer szabadon elérhető magyar nyelvű mű', href: 'https://mek.oszk.hu/', icon: Library },
  { name: 'Digitális Irodalmi Akadémia (DIA)', desc: 'Kortárs magyar irodalom teljes szövegű online gyűjteménye', href: 'https://dia.pool.pिम.hu/', icon: BookOpen },
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
  const cmsNews = await getLatestNews(4)
  const cmsEvents = await getUpcomingEvents(4)
  const cmsGalleries = await getAllGalleries(6)

  const sampleNews = [
    { id: 'f1', title: 'Nyári olvasójáték és könyvajánló fiataloknak', summary: 'Csatlakozz nyári olvasási kihívásunkhoz! Értékes könyvcsomagok várnak a legszorgalmasabb olvasókra.', publishedAt: '2026-07-20T10:00:00.000Z', slug: 'nyari-olvasojatek-2026' },
    { id: 'f2', title: 'Megújult a Központi Könyvtár Helyismereti Részlege', summary: 'Digitális archívumunk bővült és kényelmes kutatóboxok várják a látogatókat.', publishedAt: '2026-07-15T09:00:00.000Z', slug: 'helyismeret-megujulas' },
    { id: 'f3', title: 'Író-olvasó találkozó a Gyermekkönyvtárban', summary: 'Vendégünk lesz a népszerű ifjúsági regénysorozat szerzője.', publishedAt: '2026-07-10T14:00:00.000Z', slug: 'iro-olvaso-talalkozo' },
    { id: 'f4', title: 'Digitális írástudás tanfolyam időseknek', summary: 'Ingyenes számítógépes tanfolyam 60 év felettieknek.', publishedAt: '2026-07-05T10:00:00.000Z', slug: 'digitalis-irastudas' },
  ]

  const sampleEvents = [
    { id: 'fe1', title: 'Kortárs Könyvklub: Nyári Könyvmustra', startDate: '2026-08-05T17:00:00.000Z', locationName: 'Központi Könyvtár – Olvasóterem', slug: 'kortars-konyvklub-augusztus' },
    { id: 'fe2', title: 'Mesedélután és Kézműves Foglalkozás', startDate: '2026-08-12T15:30:00.000Z', locationName: 'Gyermekkönyvtár', slug: 'mesedelutan-gyermekkonyvtar' },
    { id: 'fe3', title: 'Csendes Olvasás a Szabadban', startDate: '2026-08-04T16:00:00.000Z', locationName: 'Széna Téri Tagkönyvtár', slug: 'csendes-olvasas-szabadban' },
    { id: 'fe4', title: 'Családi Filmvetítés a Kertben', startDate: '2026-08-18T19:00:00.000Z', locationName: 'Központi Könyvtár – Kert', slug: 'csaladi-filmvetites' },
  ]

  const displayNews = cmsNews.length > 0 ? cmsNews : sampleNews
  const displayEvents = cmsEvents.length > 0 ? cmsEvents : sampleEvents

  return (
    <div>
      {/* ============ HERO ============ */}
      <div className="nypl-hero">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a237e]/90 via-[#283593]/70 to-transparent" />
        <div className="relative max-w-[1280px] mx-auto px-5 w-full pb-5 pt-10 md:pt-14">
          <div className="nypl-hero-overlay">
            <div className="nypl-hero-eyebrow">Üdvözöljük</div>
            <h1 className="nypl-hero-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
              Nyár a Könyvtárban
            </h1>
            <p className="nypl-hero-desc">
              Programok, olvasóklubok és nyári kihívások minden korosztálynak a Vörösmarty Mihály Könyvtárban.
            </p>
            <Link href="/esemenyek" className="nypl-hero-arrow">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ============ SPOTLIGHT / HÍREK ============ */}
      <div className="max-w-[1280px] mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <span className="spotlight-label">Spotlight</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayNews.map((item) => {
            const img = 'featuredImage' in item && item.featuredImage && typeof item.featuredImage === 'object' && 'url' in item.featuredImage
              ? (item.featuredImage.url as string) : undefined
            return (
              <Link key={item.id} href={`/hirek/${item.slug}`} className="nypl-card group block">
                <div className="relative aspect-[4/3] bg-gray-100">
                  {img ? (
                    <Image src={img} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400 text-3xl font-bold">VMK</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-[#c62828] transition-colors line-clamp-2 leading-snug mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(typeof item.publishedAt === 'string' ? item.publishedAt : '').toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="flex justify-center mt-6">
          <Link href="/hirek" className="btn-nypl btn-nypl-ghost">
            Összes hír <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ============ AJÁNLOTT KÖNYVEK ============ */}
      <div className="section-alt py-6">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="section-subtitle">Könyvajánló</div>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
            Munkatársaink ajánlásával
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {RECOMMENDED_BOOKS.map((book) => (
              <div key={book.title} className="book-card group cursor-pointer">
                <div className="book-cover" style={{ background: `linear-gradient(160deg, ${book.color} 0%, ${book.color}cc 100%)` }}>
                  <div className="w-full h-full flex flex-col items-center justify-center px-3 text-center">
                    <div className="text-white/30 text-xs font-bold mb-2 uppercase tracking-widest">VMK</div>
                    <div className="text-white text-[11px] font-semibold leading-tight">{book.title}</div>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight mt-1 group-hover:text-[#c62828] transition-colors line-clamp-2">{book.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ STATISZTIKÁK SÁV ============ */}
      <div className="stats-bar">
        <div className="max-w-[1280px] mx-auto px-5">
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

      {/* ============ ESEMÉNYEK ============ */}
      <div className="max-w-[1280px] mx-auto px-5 py-6">
        <div className="section-subtitle">Programok</div>
        <h2 className="section-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
          Közelgő események
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayEvents.map((event) => {
            const dateStr = typeof event.startDate === 'string' ? event.startDate : new Date().toISOString()
            const d = new Date(dateStr)
            const locName = 'locationName' in event && typeof event.locationName === 'string' ? event.locationName : ''
            return (
              <Link key={event.id} href={`/esemenyek/${event.slug}`} className="nypl-card group block p-5">
                <div className="flex items-start gap-4">
                  <div className="text-center shrink-0">
                    <div className="text-xs font-bold uppercase text-[#c62828] tracking-wider">{MONTHS_HU[d.getMonth()]}</div>
                    <div className="text-3xl font-extrabold text-gray-900 leading-none">{d.getDate()}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#c62828] transition-colors leading-snug line-clamp-2">
                      {event.title}
                    </h3>
                    {locName && (
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{locName}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {d.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="flex justify-center mt-6">
          <Link href="/esemenyek" className="btn-nypl btn-nypl-outline">
            <Calendar className="w-4 h-4" /> Összes esemény
          </Link>
        </div>
      </div>

      {/* ============ KIEMELT GYŰJTEMÉNY ============ */}
      <div className="max-w-[1280px] mx-auto px-5 pb-6">
        <div className="collection-hero grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">Kiemelt gyűjtemény</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
              Nyári olvasmányok 2026
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              Válogatás munkatársaink kedvenc nyári olvasmányaiból — könnyű regények, izgalmas krimik, útikönyvek és természetjáró kalauzok a tökéletes nyári kikapcsolódáshoz.
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
              <Link href="/hirek" className="inline-flex items-center gap-2 bg-white text-[#1a237e] px-5 py-2.5 rounded font-semibold text-sm hover:bg-blue-50 transition-colors">
                Felfedezés <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center p-10">
            <div className="grid grid-cols-2 gap-3 max-w-[280px]">
              {COLLECTION_BOOKS.slice(0, 4).map((b, i) => (
                <div key={i} className="aspect-[2/3] rounded bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-3">
                  <span className="text-white/60 text-[10px] font-bold text-center leading-tight">{b.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ DIGITÁLIS KÖNYVTÁR ============ */}
      <div className="section-alt py-6">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="section-subtitle">Online források</div>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
            Digitális könyvtár
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DIGITAL_LIBRARY.map((item) => {
              const Icon = item.icon
              return (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="digi-card group block">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#c62828] mb-3 group-hover:bg-[#c62828] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#c62828] transition-colors mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  <div className="mt-3 text-xs font-semibold text-[#c62828] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Megnyitás <ArrowRight className="w-3 h-3" />
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* ============ OLVASÓI VÉLEMÉNYEK ============ */}
      <div className="max-w-[1280px] mx-auto px-5 py-6">
        <div className="section-subtitle">Visszajelzések</div>
        <h2 className="section-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
          Olvasóink mondták
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <Quote className="w-6 h-6 text-[#c62828]/20 mb-2" />
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="testimonial-author">{t.author}</div>
                  <div className="text-[11px] text-gray-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ GALÉRIA ============ */}
      {cmsGalleries.length > 0 && (
        <div className="section-alt py-6">
          <div className="max-w-[1280px] mx-auto px-5">
            <div className="section-subtitle">Képgaléria</div>
            <h2 className="section-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
              Galéria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cmsGalleries.map((g) => {
                const cover = g.coverImage && typeof g.coverImage === 'object' && 'url' in g.coverImage ? (g.coverImage.url as string) : undefined
                return (
                  <Link key={g.id} href={`/galeria/${g.slug}`} className="nypl-card group block">
                    <div className="relative aspect-[3/2] bg-gray-100">
                      {cover ? (
                        <Image src={cover} alt={g.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 33vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-sm font-bold">VMK</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#c62828] transition-colors truncate">{g.title}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="flex justify-center mt-6">
              <Link href="/galeria" className="btn-nypl btn-nypl-ghost">
                Összes galéria <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
