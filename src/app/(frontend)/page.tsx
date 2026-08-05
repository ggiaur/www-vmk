import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, ChevronRight, Smartphone, MessageCircle } from 'lucide-react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { getLatestNews, getUpcomingEvents } from '@/lib/payload'

const MONTHS_HU = ['JAN', 'FEB', 'MÁR', 'ÁPR', 'MÁJ', 'JÚN', 'JÚL', 'AUG', 'SZEP', 'OKT', 'NOV', 'DEC']

function formatDayMonth(dateStr: string) {
  const d = new Date(dateStr)
  return { day: d.getDate(), month: MONTHS_HU[d.getMonth()] }
}

const QUICK_ACTIONS_ROW1 = [
  { label: 'Beiratkozás', href: '/kapcsolat', alt: false, external: false },
  { label: 'A-Z Erőforrások', href: '/szolgaltatasok', alt: false, external: false },
  { label: 'Nyitvatartás', href: '/nyitvatartas', alt: false, external: false },
  { label: 'Könyvadomány', href: '/tamogatas', alt: true, external: false },
  { label: 'Támogasson Minket', href: '/tamogatas', alt: true, external: false },
]
const QUICK_ACTIONS_ROW2 = [
  { label: 'Élő Csevegés', href: '/kapcsolat', alt: false, external: false },
  { label: 'Hang+Kép Részleg', href: 'http://av.vmk.hu', alt: false, external: true },
  { label: 'Könyvklub', href: '/esemenyek', alt: false, external: false },
  { label: 'Könyvvásár', href: '/tamogatas', alt: true, external: false },
  { label: 'Önkénteskedjen', href: '/kapcsolat', alt: true, external: false },
]

const STAFF_LISTS = [
  {
    title: 'Nyárutó — Kalandok 8-12 éveseknek',
    desc: 'Ahogy közeledik az augusztus vége, ezek a könyvek (8-11 éveseknek) segítenek utoljára belemerülni a nyári hangulatba, mielőtt kezdődik a tanév.',
    author: 'VMK_KovacsE',
    colors: ['#c0392b', '#1a5276', '#e67e22', '#27ae60', '#8e44ad', '#2c3e50', '#d35400', '#16a085', '#7f8c8d'],
  },
  {
    title: 'Ha szeretted az Iliászt',
    desc: 'Kedvenc görög mítosz-újramesélésem — az Odüsszeia és Iliász gyakran elfeledett, ám lenyűgöző női szereplőinek szemszögéből.',
    author: 'VMK_NagyP',
    colors: ['#2980b9', '#c0392b', '#f39c12', '#8e44ad', '#27ae60', '#34495e', '#e74c3c', '#16a085', '#d35400'],
  },
  {
    title: 'Augusztusi Könyvelőzetes 2026',
    desc: 'Az Olvasószolgálati csapat hozza a legjobban várt augusztusi megjelenéseket — friss krimik, regények és ismeretterjesztők.',
    author: 'VMK_Olvasoszolgalat',
    colors: ['#1a5276', '#8e44ad', '#c0392b', '#16a085', '#e67e22', '#2c3e50', '#27ae60', '#7f8c8d', '#d35400'],
  },
  {
    title: 'Ijesztő Nyári Horrorok',
    desc: 'Tedd fel ezeket a friss horrorregényeket az olvasólistádra, és olvasd őket a nyári tábortűz fényénél!',
    author: 'VMK_SzaboK',
    colors: ['#2c3e50', '#c0392b', '#8e44ad', '#e67e22', '#16a085', '#34495e', '#f39c12', '#7f8c8d', '#1a5276'],
  },
]

const SHELF_CATEGORIES = [
  { label: 'Könyvek', colors: ['#1a5276', '#c0392b', '#27ae60', '#e67e22', '#8e44ad', '#16a085'] },
  { label: 'Képregények', colors: ['#c0392b', '#2980b9', '#f39c12', '#2c3e50', '#27ae60', '#8e44ad'] },
  { label: 'Filmek', colors: ['#2c3e50', '#8e44ad', '#c0392b', '#16a085', '#e67e22', '#34495e'] },
  { label: 'Zene', colors: ['#8e44ad', '#1a5276', '#e67e22', '#c0392b', '#27ae60', '#2c3e50'] },
  { label: 'Hangoskönyvek', colors: ['#16a085', '#c0392b', '#2980b9', '#f39c12', '#8e44ad', '#34495e'] },
]

const DIGITAL_RESOURCES = [
  { name: 'Magyar Elektronikus Könyvtár (MEK)', desc: 'Az OSZK digitális gyűjteménye — több ezer szabadon elérhető magyar nyelvű mű.' },
  { name: 'Digitális Irodalmi Akadémia (DIA)', desc: 'Kortárs magyar irodalom teljes szövegű online gyűjteménye.' },
  { name: 'Arcanum Digitális Tudománytár', desc: 'Magyar folyóiratok, napilapok és enciklopédiák kereshető archívuma.' },
  { name: 'EBSCO Adatbázisok', desc: 'Nemzetközi tudományos adatbázisok könyvtári olvasójeggyel.' },
  { name: 'eKönyvtár.hu', desc: 'E-book kölcsönzés otthonról, olvasójeggyel.' },
  { name: 'Filmio', desc: 'Magyar és nemzetközi filmek, dokumentumfilmek ingyenes streamelése.' },
  { name: 'Media Library Online (MLOL)', desc: 'Nemzetközi e-book és e-folyóirat gyűjtemény.' },
  { name: 'Nemzeti Audiovizuális Archívum', desc: 'Magyar film- és médiatörténeti archívum.' },
  { name: 'Nyelvtanulási Portál', desc: 'Ingyenes online nyelvtanfolyamok könyvtári tagoknak.' },
  { name: 'Napi Sajtóarchívum', desc: 'Országos és megyei napilapok kereshető digitális archívuma.' },
]

const EVENT_COLUMNS = [
  { key: 'adults', label: 'Felnőtteknek & Nyugdíjasoknak' },
  { key: 'teens', label: 'Tizenéveseknek' },
  { key: 'children', label: 'Gyerekeknek' },
  { key: 'online', label: 'Online' },
] as const

const SAMPLE_EVENTS_BY_COLUMN: Record<string, { title: string; date: string; location: string; slug: string }[]> = {
  adults: [
    { title: 'Kortárs Könyvklub: Nyári Könyvmustra', date: '2026-08-05T17:00:00.000Z', location: 'Központi Könyvtár – Olvasóterem', slug: 'kortars-konyvklub-augusztus' },
    { title: 'Csendes Olvasás a Szabadban', date: '2026-08-06T16:00:00.000Z', location: 'Széna Téri Tagkönyvtár', slug: 'csendes-olvasas-szabadban' },
    { title: 'Nyugdíjas Klub: Kártyadélután', date: '2026-08-11T14:00:00.000Z', location: 'Tolnai Úti Tagkönyvtár', slug: 'nyugdijas-klub-kartya' },
    { title: 'Helytörténeti Séta és Előadás', date: '2026-08-19T17:30:00.000Z', location: 'Központi Könyvtár', slug: 'helytorteneti-seta' },
  ],
  teens: [
    { title: 'Kreatívírás Műhely Tizenéveseknek', date: '2026-08-07T16:00:00.000Z', location: 'Központi Könyvtár – Ifjúsági rész', slug: 'kreativiras-muhely' },
    { title: 'Társasjáték Klub', date: '2026-08-08T15:00:00.000Z', location: 'Mészöly G. Tagkönyvtár', slug: 'tarsasjatek-klub' },
    { title: 'Manga & Anime Est', date: '2026-08-13T16:30:00.000Z', location: 'Zsolt Úti Tagkönyvtár', slug: 'manga-anime-est' },
  ],
  children: [
    { title: 'Mesedélután és Kézműves Foglalkozás', date: '2026-08-12T15:30:00.000Z', location: 'Gyermekkönyvtár', slug: 'mesedelutan-gyermekkonyvtar' },
    { title: 'Babamozi és Bábozás', date: '2026-08-14T10:00:00.000Z', location: 'Gyermekkönyvtár', slug: 'babamozi-babozas' },
    { title: 'Nyári Kézműves Klub', date: '2026-08-20T10:30:00.000Z', location: 'Budai Úti Tagkönyvtár', slug: 'nyari-kezmuves-klub' },
    { title: 'Meseíró Verseny Eredményhirdetés', date: '2026-08-25T11:00:00.000Z', location: 'Gyermekkönyvtár', slug: 'meseiro-verseny' },
  ],
  online: [
    { title: 'Digitális Írástudás Webinárium', date: '2026-08-13T17:00:00.000Z', location: 'Online', slug: 'digitalis-irastudas-webinar' },
    { title: 'Online Szerzői Beszélgetés', date: '2026-08-21T18:00:00.000Z', location: 'Online', slug: 'online-szerzoi-beszelgetes' },
    { title: 'E-könyv Kölcsönzés — Bemutató', date: '2026-09-02T17:00:00.000Z', location: 'Online', slug: 'ekonyv-bemutato' },
  ],
}

export default async function HomePage() {
  const cmsNews = await getLatestNews(6)
  const cmsEvents = await getUpcomingEvents(12)

  const sampleNews = [
    { id: 'f1', title: 'Kevesebb mint 2 hét a Nyári Olvasási Kihívás teljesítéséhez!', summary: 'Fejezd be a kihívást, és vedd át nyári olvasási jutalmadat augusztus 15-ig!', publishedAt: '2026-07-20T10:00:00.000Z', slug: 'nyari-olvasojatek-2026' },
    { id: 'f2', title: 'Megújult a Központi Könyvtár Helyismereti Részlege', summary: 'Digitális archívumunk bővült és kényelmes kutatóboxok várják a helytörténet iránt érdeklődő látogatókat.', publishedAt: '2026-07-15T09:00:00.000Z', slug: 'helyismeret-megujulas' },
    { id: 'f3', title: 'Új bútorok a Központi Könyvtárban', summary: 'Körbevezetjük az olvasóinkat a felújított közösségi tereken.', publishedAt: '2026-07-10T14:00:00.000Z', slug: 'uj-butorok-turne' },
    { id: 'f4', title: 'Mondja el, mit gondol az érdekes fákról', summary: 'Segítsen feltérképezni Székesfehérvár különleges fáit egy közösségi projektben.', publishedAt: '2026-07-05T10:00:00.000Z', slug: 'erdekes-fak-projekt' },
    { id: 'f5', title: 'Otthon kellett volna maradnod: horror a vadonban', summary: 'Blogbejegyzés a nyár legjobb vadonban játszódó horror-olvasmányairól.', publishedAt: '2026-07-01T10:00:00.000Z', slug: 'horror-a-vadonban' },
  ]

  const displayNews = cmsNews.length > 0 ? cmsNews : sampleNews
  const featuredItem = displayNews[0]
  const latestItems = displayNews.slice(1, 4)

  const featuredImg = featuredItem && 'featuredImage' in featuredItem && featuredItem.featuredImage && typeof featuredItem.featuredImage === 'object' && 'url' in featuredItem.featuredImage
    ? (featuredItem.featuredImage.url as string)
    : undefined

  const eventsByAudience: Record<string, { id: string; title: string; date: string; location: string; slug: string }[]> = {
    adults: [],
    teens: [],
    children: [],
    online: [],
  }
  for (const e of cmsEvents) {
    const audience = 'targetAudience' in e && typeof e.targetAudience === 'string' && e.targetAudience in eventsByAudience ? e.targetAudience : 'adults'
    eventsByAudience[audience].push({
      id: String(e.id),
      title: e.title,
      date: typeof e.startDate === 'string' ? e.startDate : new Date().toISOString(),
      location: 'locationName' in e && typeof e.locationName === 'string' ? e.locationName : '',
      slug: e.slug,
    })
  }
  for (const key of Object.keys(eventsByAudience)) {
    if (eventsByAudience[key].length === 0) {
      eventsByAudience[key] = SAMPLE_EVENTS_BY_COLUMN[key].map((e, i) => ({ id: `${key}-${i}`, ...e }))
    }
  }

  return (
    <div>
      {/* ============ FEATURED / LATEST / LOOKING BACK ============ */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-8">
          <div>
            <h2 className="section-heading">Kiemelt <ChevronRight className="chev w-5 h-5" /></h2>
            {featuredItem && (
              <Link href={`/hirek/${featuredItem.slug}`} className="block group">
                <div className="relative aspect-[16/10] bg-gray-100 rounded overflow-hidden mb-3">
                  {featuredImg ? (
                    <Image src={featuredImg} alt={featuredItem.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 400px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--accent-red)] text-white/30 text-4xl font-bold">VMK</div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--secondary)] transition-colors mb-2">{featuredItem.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{featuredItem.summary}</p>
              </Link>
            )}
          </div>

          <div>
            <h2 className="section-heading">Legfrissebb a VMK-tól <ChevronRight className="chev w-5 h-5" /></h2>
            <div className="space-y-0">
              {latestItems.map((item, i) => {
                const img = 'featuredImage' in item && item.featuredImage && typeof item.featuredImage === 'object' && 'url' in item.featuredImage
                  ? (item.featuredImage.url as string) : undefined
                return (
                  <Link key={item.id} href={`/hirek/${item.slug}`} className={`flex gap-3 py-4 group ${i > 0 ? 'border-t border-[var(--border-light)]' : ''}`}>
                    <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 shrink-0">
                      {img ? (
                        <Image src={img} alt={item.title} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[var(--secondary)] text-white/40 text-xs font-bold">VMK</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="category-badge">Hír</span>
                      <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2 leading-snug mt-0.5">{item.title}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-3">
              <Link href="/hirek" className="text-sm font-bold text-[var(--secondary)] hover:underline flex items-center gap-1">
                Tovább <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="section-heading">Visszatekintés <ChevronRight className="chev w-5 h-5" /></h2>
            <div className="grid grid-cols-3 gap-1 mb-3 rounded overflow-hidden">
              {['#78173a', '#0d74af', '#018289', '#d9231a', '#2c3e50', '#8e44ad'].map((c, i) => (
                <div key={i} className="aspect-square" style={{ background: c }} />
              ))}
            </div>
            <span className="category-badge">Cikk</span>
            <h3 className="text-base font-bold text-[var(--text-main)] mt-1 mb-2">Zárva a szekrények, digitalizált tétel, és rekordévad: Az Év Beszámolója</h3>
            <p className="text-sm text-[var(--text-muted)]">Rekordokat döntöttünk az olvasásban, digitalizáltunk 35 ezer tételt, és sok minden más történt — a VMK éves beszámolója a nagy sikerekről és a közösségi hatásról.</p>
          </div>
        </div>
      </div>

      {/* ============ BIG PROMO BANNER ============ */}
      <div className="max-w-[1200px] mx-auto px-4 pb-8">
        <div className="promo-banner grid grid-cols-1 md:grid-cols-[1fr_1.4fr] items-center min-h-[220px]">
          <div className="p-8 flex justify-center">
            <div className="bg-white text-[var(--accent-red)] px-6 py-6 rounded shadow-lg -rotate-2 max-w-[280px]">
              <div className="text-3xl font-black leading-tight uppercase">Vörösmarty Mihály</div>
              <div className="text-3xl font-black leading-tight uppercase mb-3">Könyvtár</div>
              <div className="text-[var(--text-main)] font-bold text-lg">Stratégiai Fejlesztési Terv</div>
              <div className="text-[var(--text-main)] font-semibold">2026–2036</div>
            </div>
          </div>
          <div className="relative h-[220px] hidden md:block bg-gradient-to-br from-[#8e2340] to-[#d9231a]">
            <div className="absolute bottom-6 right-6">
              <span className="bg-white text-[var(--text-main)] font-bold px-5 py-3 rounded shadow-lg text-sm">
                MEGNÉZEM, MIT ÉPÍTETTÜNK EGYÜTT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ APP DOWNLOAD BANNER ============ */}
      <div className="app-banner">
        <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-10 h-10 shrink-0" />
            <span className="text-xl font-bold">Töltse le az új VMK alkalmazást</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-black text-white text-xs font-semibold px-4 py-2.5 rounded border border-white/30">Google Play</span>
            <span className="bg-black text-white text-xs font-semibold px-4 py-2.5 rounded border border-white/30">App Store</span>
          </div>
        </div>
      </div>

      {/* ============ QUICK ACTION BAND (maroon) ============ */}
      <div className="quick-action-band">
        <div className="max-w-[1200px] mx-auto px-4 space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {QUICK_ACTIONS_ROW1.map((a) =>
              a.external ? (
                <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" className={`quick-action-btn ${a.alt ? 'alt' : ''}`}>{a.label}</a>
              ) : (
                <Link key={a.label} href={a.href} className={`quick-action-btn ${a.alt ? 'alt' : ''}`}>{a.label}</Link>
              ),
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {QUICK_ACTIONS_ROW2.map((a) =>
              a.external ? (
                <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" className={`quick-action-btn ${a.alt ? 'alt' : ''}`}>{a.label}</a>
              ) : (
                <Link key={a.label} href={a.href} className={`quick-action-btn ${a.alt ? 'alt' : ''}`}>{a.label}</Link>
              ),
            )}
          </div>
        </div>
      </div>

      {/* ============ NEWSLETTER BAND (blue) ============ */}
      <div className="newsletter-band">
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-start">
          <Mail className="w-10 h-10 shrink-0 mt-1" />
          <div>
            <h2 className="text-white text-xl font-bold mb-1">Iratkozzon fel a VMK hírlevélre</h2>
            <p className="text-blue-50 text-sm max-w-xl">Iratkozzon fel könyvtári e-mailekre, és kapjon híreket, ajánlókat, programértesítőket. Mondja el, mi érdekli, hogy személyre szabott tartalmat kapjon.</p>
          </div>
          <div className="w-full md:w-[320px]">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ============ STAFF LISTS (pale blue) ============ */}
      <div className="staff-list-section py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STAFF_LISTS.map((list) => (
              <div key={list.title} className="staff-list-card">
                <div className="staff-list-thumbs">
                  {list.colors.map((c, i) => (
                    <div key={i} className="staff-list-thumb" style={{ background: c }}>
                      VMK
                    </div>
                  ))}
                </div>
                <div className="staff-list-eyebrow">Munkatársi ajánlólista</div>
                <h3 className="text-base font-bold text-[var(--text-main)] mt-1 mb-2">{list.title}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-2">{list.desc}</p>
                <span className="text-xs text-[var(--secondary)] underline">{list.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ NEW ON THE SHELF ============ */}
      <div className="band-title">
        <h2>Új a Polcokon</h2>
      </div>
      <div className="max-w-[1200px] mx-auto px-4 py-10 space-y-10">
        {SHELF_CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <h3 className="shelf-category-label mb-4">
              {cat.label} <ChevronRight className="w-5 h-5 text-[var(--secondary)]" />
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-1">
              {cat.colors.map((c, i) => (
                <div key={i} className="shelf-book">
                  <div className="shelf-book-cover" style={{ background: c }}>
                    VMK
                  </div>
                </div>
              ))}
            </div>
            <div className="shelf-plank" />
          </div>
        ))}
      </div>

      {/* ============ POPULAR DIGITAL RESOURCES ============ */}
      <div className="band-title">
        <h2>Népszerű Digitális Erőforrások</h2>
      </div>
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {DIGITAL_RESOURCES.map((r) => (
            <div key={r.name} className="digi-resource-card">
              <div className="digi-resource-thumb">{r.name.split(' ')[0]}</div>
              <span className="category-badge">Online Erőforrás</span>
              <h3 className="text-sm font-bold text-[var(--text-main)] mt-1 mb-1">{r.name}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ FREE UPCOMING EVENTS ============ */}
      <div className="band-title">
        <h2>Ingyenes Közelgő Programok</h2>
      </div>
      <div className="events-section py-10">
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {EVENT_COLUMNS.map((col) => (
            <div key={col.key}>
              <Link href="/esemenyek" className="flex items-center gap-1 text-2xl font-black text-[var(--text-main)] mb-4" style={{ fontFamily: 'var(--font-slab), Georgia, serif' }}>
                {col.label} <ChevronRight className="w-5 h-5 text-[var(--secondary)]" />
              </Link>
              <div className="space-y-4">
                {eventsByAudience[col.key].slice(0, 5).map((e) => {
                  const { day, month } = formatDayMonth(e.date)
                  return (
                    <Link key={e.id} href={`/esemenyek/${e.slug}`} className="flex gap-3 group">
                      <div className="event-day-badge">
                        <div className="num">{day}</div>
                        <div className="mon">{month}</div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--secondary)] transition-colors leading-snug">{e.title}</h4>
                        {e.location && <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{e.location}</p>}
                      </div>
                    </Link>
                  )
                })}
              </div>
              <Link href="/esemenyek" className="inline-flex items-center gap-1 text-sm font-bold text-[var(--secondary)] hover:underline mt-4">
                További programok <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ============ FEEDBACK CTA (standalone red button) ============ */}
      <div className="max-w-[1200px] mx-auto px-4 py-8 flex justify-center">
        <Link href="/kapcsolat" className="btn-primary text-base">
          <MessageCircle className="w-4 h-4" />
          Hogyan tetszett a látogatása?
        </Link>
      </div>
    </div>
  )
}
