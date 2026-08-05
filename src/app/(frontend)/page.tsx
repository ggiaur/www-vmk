import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, MapPin, BookOpen, Search, CreditCard, Headphones, Users, ChevronRight, ExternalLink } from 'lucide-react'
import {
  getLatestNews,
  getUpcomingEvents,
  getAllGalleries,
} from '@/lib/payload'

const MONTHS_HU = ['JAN', 'FEB', 'MÁR', 'ÁPR', 'MÁJ', 'JÚN', 'JÚL', 'AUG', 'SZEP', 'OKT', 'NOV', 'DEC']

const STAFF_PICKS = [
  {
    title: 'A gyertyák csonkig égnek',
    author: 'Márai Sándor',
    pickedBy: 'Kovács Éva, könyvtáros',
    desc: 'Márai remekműve az emberi kapcsolatok, a barátság és az árulás örök kérdéseit járja körül. Egy éjszakai beszélgetés két idős férfi között — lenyűgöző lélektani dráma.',
    color: '#8B0000',
  },
  {
    title: 'Az ajtó',
    author: 'Szabó Magda',
    pickedBy: 'Nagy Péter, olvasószolgálat',
    desc: 'Emerenc és az írónő különös barátsága az irodalom egyik legmegrendítőbb emberi kapcsolata. Szabó Magda legérettebb, legmélyebb műve.',
    color: '#2E4057',
  },
]

const COLLECTION_BOOKS = [
  { title: 'Sorstalanság', author: 'Kertész Imre', genre: 'Regény', color: '#5D4E37' },
  { title: 'Harmonia Caelestis', author: 'Esterházy Péter', genre: 'Regény', color: '#1B5E20' },
  { title: 'Légy jó mindhalálig', author: 'Móricz Zsigmond', genre: 'Ifjúsági', color: '#4A148C' },
  { title: 'Abigél', author: 'Szabó Magda', genre: 'Regény', color: '#BF360C' },
  { title: 'Egri csillagok', author: 'Gárdonyi Géza', genre: 'Történelmi', color: '#1565C0' },
  { title: 'A Pál utcai fiúk', author: 'Molnár Ferenc', genre: 'Ifjúsági', color: '#6A1B9A' },
  { title: 'Édes Anna', author: 'Kosztolányi Dezső', genre: 'Regény', color: '#00695C' },
  { title: 'Iskola a határon', author: 'Ottlik Géza', genre: 'Regény', color: '#37474F' },
  { title: 'A kőszívű ember fiai', author: 'Jókai Mór', genre: 'Történelmi', color: '#AD1457' },
  { title: 'Tóték', author: 'Örkény István', genre: 'Kisregény', color: '#E65100' },
]

const DISCOVER_ITEMS = [
  { label: 'Online Katalógus', desc: 'Keresés a könyvtári állományban', href: 'http://tlwww.vmk.hu/tlwww', icon: Search, external: true },
  { label: 'Beiratkozás', desc: 'Olvasójegy igénylése', href: '/kapcsolat', icon: CreditCard },
  { label: 'E-források', desc: 'MEK, DIA, Arcanum elérése', href: '/szolgaltatasok', icon: BookOpen },
  { label: 'Programnaptár', desc: 'Események és foglalkozások', href: '/esemenyek', icon: Calendar },
  { label: 'Közösségi terek', desc: 'Teremfoglalás', href: '/teremfoglalas', icon: Users },
  { label: 'Segítség', desc: 'Kérdése van? Írjon nekünk', href: '/kapcsolat', icon: Headphones },
]

export default async function HomePage() {
  const cmsNews = await getLatestNews(6)
  const cmsEvents = await getUpcomingEvents(6)
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
    { id: 'fe5', title: 'Helytörténeti Előadássorozat', startDate: '2026-08-22T17:00:00.000Z', locationName: 'Központi Könyvtár', slug: 'helytorteneti-eloadas' },
    { id: 'fe6', title: 'Digitális Alkotóműhely', startDate: '2026-08-25T14:00:00.000Z', locationName: 'Zenei részleg', slug: 'digitalis-alkotomuhely' },
  ]

  const displayNews = cmsNews.length > 0 ? cmsNews : sampleNews
  const displayEvents = cmsEvents.length > 0 ? cmsEvents : sampleEvents

  return (
    <div>
      {/* ============ HERO — NYPL colorful seasonal banner ============ */}
      <div className="nypl-hero">
        <div className="max-w-[1280px] mx-auto px-5 py-10 md:py-14 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
            Nyár a Könyvtárban
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto mb-6">
            Programok, olvasóklubok és nyári kihívások minden korosztálynak
          </p>
          <Link href="/esemenyek" className="inline-flex items-center gap-2 bg-white text-[var(--primary)] px-6 py-2.5 rounded font-bold text-sm hover:bg-gray-100 transition-colors">
            Fedezze fel programjainkat <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ============ SPOTLIGHT — 4 featured news cards ============ */}
      <div className="max-w-[1280px] mx-auto px-5 py-10">
        <div className="mb-5">
          <span className="spotlight-label">Spotlight</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayNews.slice(0, 4).map((item) => {
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
                  <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug mb-1">
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
      </div>

      {/* ============ WHAT'S ON — events with image cards (NYPL pattern) ============ */}
      <div className="section-alt py-10">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="section-subtitle">Programok</div>
              <h2 className="section-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
                Közelgő események
              </h2>
            </div>
            <Link href="/esemenyek" className="text-sm font-semibold text-[var(--primary)] hover:underline hidden md:flex items-center gap-1">
              Összes esemény <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayEvents.slice(0, 6).map((event) => {
              const dateStr = typeof event.startDate === 'string' ? event.startDate : new Date().toISOString()
              const d = new Date(dateStr)
              const locName = 'locationName' in event && typeof event.locationName === 'string' ? event.locationName : ''
              const img = 'featuredImage' in event && event.featuredImage && typeof event.featuredImage === 'object' && 'url' in event.featuredImage
                ? (event.featuredImage.url as string) : undefined
              return (
                <Link key={event.id} href={`/esemenyek/${event.slug}`} className="nypl-card group block">
                  <div className="relative aspect-[16/9] bg-gray-100">
                    {img ? (
                      <Image src={img} alt={event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                        <Calendar className="w-8 h-8 text-[var(--primary)]/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white rounded px-2 py-1 shadow-sm">
                      <div className="text-[10px] font-bold uppercase text-[var(--primary)] tracking-wider leading-none">{MONTHS_HU[d.getMonth()]}</div>
                      <div className="text-lg font-extrabold text-gray-900 leading-none">{d.getDate()}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors leading-snug line-clamp-2 mb-1.5">
                      {event.title}
                    </h3>
                    {locName && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{locName}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {d.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="flex justify-center mt-6 md:hidden">
            <Link href="/esemenyek" className="btn-nypl btn-nypl-outline">
              <Calendar className="w-4 h-4" /> Összes esemény
            </Link>
          </div>
        </div>
      </div>

      {/* ============ DISCOVER — service/resource cards (NYPL pattern) ============ */}
      <div className="max-w-[1280px] mx-auto px-5 py-10">
        <div className="section-subtitle">Szolgáltatások</div>
        <h2 className="section-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
          Fedezze fel
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DISCOVER_ITEMS.map((item) => {
            const Icon = item.icon
            const inner = (
              <>
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[var(--primary)] mb-3 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors mb-0.5">{item.label}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
                {item.external && <ExternalLink className="w-3 h-3 text-gray-300 absolute top-3 right-3" />}
              </>
            )
            return item.external ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="discover-card group relative text-center p-4">
                {inner}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className="discover-card group relative text-center p-4">
                {inner}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ============ STAFF PICKS — NYPL book recommendation pattern ============ */}
      <div className="section-alt py-10">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="section-subtitle">Könyvajánló</div>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
            Munkatársaink ajánlják
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STAFF_PICKS.map((pick) => (
              <div key={pick.title} className="staff-pick flex gap-5">
                <div className="shrink-0">
                  <div className="w-[100px] h-[150px] rounded" style={{ background: `linear-gradient(160deg, ${pick.color} 0%, ${pick.color}cc 100%)` }}>
                    <div className="w-full h-full flex flex-col items-center justify-center px-2 text-center">
                      <div className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-1">VMK</div>
                      <div className="text-white text-[10px] font-semibold leading-tight">{pick.title}</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 mb-0.5">{pick.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pick.author}</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{pick.desc}</p>
                  <p className="text-xs text-gray-400 italic">Ajánlja: {pick.pickedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ IN THE COLLECTION — book cover grid (NYPL pattern) ============ */}
      <div className="max-w-[1280px] mx-auto px-5 py-10">
        <div className="section-subtitle">Gyűjteményünkből</div>
        <h2 className="section-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
          A polcokról
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {COLLECTION_BOOKS.map((book) => (
            <div key={book.title} className="collection-item group cursor-pointer text-center">
              <div className="w-full aspect-[2/3] rounded mx-auto mb-2 overflow-hidden shadow-md group-hover:shadow-lg transition-shadow" style={{ background: `linear-gradient(160deg, ${book.color} 0%, ${book.color}cc 100%)` }}>
                <div className="w-full h-full flex flex-col items-center justify-center px-3 text-center">
                  <div className="text-white/25 text-[9px] font-bold uppercase tracking-widest mb-2">VMK</div>
                  <div className="text-white text-xs font-semibold leading-tight">{book.title}</div>
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-[var(--primary)] transition-colors line-clamp-2">{book.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)] mt-1">{book.genre}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============ FROM OUR BLOG — NYPL blog section ============ */}
      {displayNews.length > 2 && (
        <div className="section-alt py-10">
          <div className="max-w-[1280px] mx-auto px-5">
            <div className="section-subtitle">Blog</div>
            <h2 className="section-title" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
              Híreinkből
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayNews.slice(0, 2).map((item) => {
                const img = 'featuredImage' in item && item.featuredImage && typeof item.featuredImage === 'object' && 'url' in item.featuredImage
                  ? (item.featuredImage.url as string) : undefined
                const summary = 'summary' in item && typeof item.summary === 'string' ? item.summary : ''
                return (
                  <Link key={item.id} href={`/hirek/${item.slug}`} className="blog-card group flex gap-5">
                    <div className="relative w-[180px] h-[120px] shrink-0 rounded overflow-hidden bg-gray-100">
                      {img ? (
                        <Image src={img} alt={item.title} fill className="object-cover" sizes="180px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400 text-xl font-bold">VMK</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors leading-snug mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{summary}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(typeof item.publishedAt === 'string' ? item.publishedAt : '').toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="flex justify-center mt-6">
              <Link href="/hirek" className="btn-nypl btn-nypl-ghost">
                Összes bejegyzés <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ============ GALÉRIA ============ */}
      {cmsGalleries.length > 0 && (
        <div className="max-w-[1280px] mx-auto px-5 py-10">
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
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[var(--primary)] transition-colors truncate">{g.title}</h3>
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
      )}

      {/* ============ EXPLORE MORE — NYPL bottom navigation ============ */}
      <div className="border-t border-gray-200 py-10">
        <div className="max-w-[1280px] mx-auto px-5">
          <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-cardo), Georgia, serif' }}>
            Tudjon meg többet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/nyitvatartas" className="explore-card group flex items-start gap-4 p-5">
              <MapPin className="w-6 h-6 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors mb-1">Nyitvatartás és helyszínek</h3>
                <p className="text-xs text-gray-500">Központi könyvtár és tagkönyvtárak</p>
              </div>
            </Link>
            <Link href="/kapcsolat" className="explore-card group flex items-start gap-4 p-5">
              <Calendar className="w-6 h-6 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors mb-1">Iratkozzon fel hírlevelünkre</h3>
                <p className="text-xs text-gray-500">Heti programajánló és könyvújdonságok</p>
              </div>
            </Link>
            <Link href="/tamogatas" className="explore-card group flex items-start gap-4 p-5">
              <BookOpen className="w-6 h-6 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors mb-1">Támogassa a könyvtárat</h3>
                <p className="text-xs text-gray-500">1% felajánlás és adományozás</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
