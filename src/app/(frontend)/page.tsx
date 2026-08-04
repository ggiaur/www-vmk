import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SiteSidebar } from '@/components/layout/SiteSidebar'
import { LocationBanner } from '@/components/home/LocationBanner'
import { HomeNewsTile } from '@/components/home/HomeNewsTile'
import { FigyelemBanner } from '@/components/home/FigyelemBanner'
import { EventCalendarWidget } from '@/components/home/EventCalendarWidget'
import { REAL_CONTAINER } from '@/lib/layout'
import {
  getLatestNews,
  getUpcomingEvents,
  getAllLibraries,
  getAllGalleries,
} from '@/lib/payload'

// A valós www.vmk.hu főoldala egy klasszikus, kétoszlopos, widget-sávos
// portál-elrendezést követ (bal oldali "widget-torony" + jobb oldali
// hír/esemény-rács + jobb szélen naptár), NEM a korábbi, egyoszlopos,
// nagy hero-bannerős "modern SaaS" elrendezést. Ez az átírás a valós
// oldal képernyőképei alapján, szerkezetileg közelíti azt - a tényleges
// tartalom (hírek, események, könyvtárak) továbbra is a Payload CMS-ből
// jön, csak a megjelenítés stílusa és az oldal információs architektúrája
// változott.
export default async function HomePage() {
  const cmsNews = await getLatestNews(6)
  const cmsEvents = await getUpcomingEvents(3)
  const cmsLibraries = await getAllLibraries()
  const cmsGalleries = await getAllGalleries(9)

  const sampleNews = [
    {
      id: 'f1',
      title: 'Nyári olvasójáték és könyvajánló fiataloknak',
      summary: 'Csatlakozz nyári olvasási kihívásunkhoz! Értékes könyvcsomagok várnak a legszorgalmasabb olvasókra.',
      publishedAt: '2026-07-20T10:00:00.000Z',
      slug: 'nyari-olvasojatek-2026',
    },
    {
      id: 'f2',
      title: 'Megújult a Központi Könyvtár Helyismereti Részlege',
      summary: 'Digitális archívumunk bővült és kényelmes kutatóboxok várják a helytörténet iránt érdeklődő látogatókat.',
      publishedAt: '2026-07-15T09:00:00.000Z',
      slug: 'helyismeret-megujulas',
    },
    {
      id: 'f3',
      title: 'Író-olvasó találkozó a Gyermekkönyvtárban',
      summary: 'Vendégünk lesz a népszerű ifjúsági regénysorozat szerzője. Dedikálás és beszélgetés.',
      publishedAt: '2026-07-10T14:00:00.000Z',
      slug: 'iro-olvaso-talalkozo',
    },
  ]

  const sampleEvents = [
    {
      id: 'fe1',
      title: 'Kortárs Könyvklub: Nyári Könyvmustra',
      startDate: '2026-08-05T17:00:00.000Z',
      locationName: 'Központi Könyvtár – Olvasóterem',
      targetAudience: 'adults',
      slug: 'kortars-konyvklub-augusztus',
    },
    {
      id: 'fe2',
      title: 'Mesedélután és Kézműves Foglalkozás',
      startDate: '2026-08-12T15:30:00.000Z',
      locationName: 'Gyermekkönyvtár (Bartók B. tér 1.)',
      targetAudience: 'children',
      slug: 'mesedelutan-gyermekkonyvtar',
    },
    {
      id: 'fe3',
      title: 'Csendes Olvasás a Szabadban',
      startDate: '2026-08-04T16:00:00.000Z',
      locationName: 'Széna Téri Tagkönyvtár',
      targetAudience: 'adults',
      slug: 'csendes-olvasas-szabadban',
    },
  ]

  const displayNews = cmsNews.length > 0 ? cmsNews : sampleNews
  const displayEvents = cmsEvents.length > 0 ? cmsEvents : sampleEvents

  // A "hely" szalak csak a fizikai könyvtár-helyszíneket mutatja (központi +
  // tagkönyvtárak) - a "department" típusú belső részlegek (pl. Felnőtt
  // Kölcsönző, ami a Központi épületén belül van) nem önálló helyszínek,
  // ezért kimaradnak, hogy a szám ("A városban N helyen") a valós oldalhoz
  // hasonlóan a ténylegesen különálló épületeket számolja.
  // A valós oldal a Központi Könyvtárat listázza ELŐSZÖR, utána a
  // tagkönyvtárakat - a getAllLibraries() név szerinti (ábécésorrendes)
  // rendezése ezt felborítaná ("Budai..." előbb jönne, mint "Vörösmarty..."),
  // ezért itt explicit elöre soroljuk a központit. Playwright screenshottal
  // ellenőrizve a valós sorrendhez képest.
  const locations = cmsLibraries
    .filter((l) => l.type === 'central' || l.type === 'branch')
    .sort((a, b) => (a.type === 'central' ? -1 : b.type === 'central' ? 1 : 0))
    .map((l) => ({ name: l.name, slug: l.slug, type: l.type as 'central' | 'branch' }))

  const now = new Date()
  const highlightedDays = displayEvents
    .map((e) => new Date(typeof e.startDate === 'string' ? e.startDate : now))
    .filter((d) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth())
    .map((d) => d.getDate())

  return (
    <div>
      <LocationBanner locations={locations} />

      <div className={`${REAL_CONTAINER} py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start`}>
        <SiteSidebar />

        <main className="min-w-0">
          <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
            Hírek, Események
          </h1>

          <p className="text-xs text-slate-500 leading-relaxed mb-5 text-justify">
            Rendezvényeinken kép- és hangfelvételek készülhetnek. Tiltakozása esetén törölhetjük az
            Önről készült felvételeket. Bővebben:{' '}
            <a
              href="https://www.vmk.hu/_upload/editor/Alapdokumentumok/Adatkezelesi_tajekoztato_honlapra_VMK.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#159097] hover:underline"
            >
              Adatkezelési tájékoztató 3.9 pontja
            </a>
            . Nyilvános eseményeinken a Vörösmarty Mihály Könyvtár megbízott munkatársain kívül mások
            is készíthetnek felvételt. Utóbbi esetben felhívjuk látogatóink, partnereink figyelmét,
            hogy saját céljukból történő felvételkészítésért való jogi felelősség nem a Vörösmarty
            Mihály Könyvtárat terheli.
          </p>

          <FigyelemBanner />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] items-stretch mb-4">
            {displayNews.map((item, i) => {
              const img = 'featuredImage' in item ? item.featuredImage : undefined
              const imgUrl =
                img && typeof img === 'object' && 'url' in img ? (img.url as string) : undefined
              return (
                <HomeNewsTile
                  key={item.id}
                  title={item.title}
                  summary={item.summary}
                  publishedAt={
                    typeof item.publishedAt === 'string' ? item.publishedAt : new Date().toISOString()
                  }
                  slug={item.slug}
                  imageUrl={imgUrl}
                  index={i}
                />
              )
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] items-stretch mb-4">
            {displayEvents.map((event, i) => (
              <HomeNewsTile
                key={event.id}
                title={event.title}
                summary={'summary' in event && typeof event.summary === 'string' ? event.summary : event.title}
                publishedAt={typeof event.startDate === 'string' ? event.startDate : new Date().toISOString()}
                slug={`esemenyek/${event.slug}`}
                index={displayNews.length + i}
              />
            ))}
          </div>

          <div className="flex justify-end mb-10">
            <Link
              href="/esemenyek"
              className="text-sm font-semibold text-[#159097] hover:underline flex items-center gap-1"
            >
              <span>További eseményeink</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <section>
              {/* real.png pixel-mérés (2026-08-04, y~3150-3172, x~460-650):
                  24px, #333333, DE nem Cinzel - a fagyasztott bázisképen ez a
                  cím sima fallback szerifre esik vissza (valószínűleg a Cinzel
                  webfont még nem töltött be, amikor a böngésző ezt a
                  lap-alsó szakaszt kirajzolta a screenshothoz), míg a lejjebbi
                  "Galéria" cím ugyanazon a képen már Cinzel-ben jelenik meg.
                  A globális h1-h4 Cinzel-szabályt itt explicit felülírjuk
                  font-serif-fel, hogy pixelre kövessük a valós, befagyasztott
                  renderelést, nem a CSS "szándékát". */}
              <h2 className="text-2xl font-serif font-bold text-[#333333] mb-4">Eseménynaptár</h2>
              <EventCalendarWidget
                highlightedDays={highlightedDays}
                year={now.getFullYear()}
                month={now.getMonth()}
              />
            </section>

            <aside className="space-y-[30px]" style={{ marginTop: 30 }}>
              <div className="border border-[#d6e9c6] rounded">
                <div className="px-[15px] py-[10px] rounded-t" style={{ backgroundColor: '#dff0d8', borderBottom: '1px solid #d6e9c6' }}>
                  <h3 className="text-[14px] font-normal" style={{ fontFamily: 'Roboto, sans-serif', color: '#3c763d' }}>Folyóiratok könyvtárunkban</h3>
                </div>
                <div className="px-[15px] py-[15px] space-y-2">
                  <a href="http://www.vmk.hu/kurrens" target="_blank" rel="noopener noreferrer" className="block text-[15px] text-black hover:text-black hover:no-underline" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Kurrens folyóiratok a Központi Könyvtár Olvasótermében &gt;
                  </a>
                  <a href="https://www.vmk.hu/folyoiratok-a-tagkonyvtarakban" target="_blank" rel="noopener noreferrer" className="block text-[15px] text-black hover:text-black hover:no-underline" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Kurrens folyóiratok a Tagkönyvtárakban &gt;
                  </a>
                </div>
              </div>

              <div className="border border-[#d6e9c6] rounded">
                <div className="px-[15px] py-[10px] rounded-t" style={{ backgroundColor: '#dff0d8', borderBottom: '1px solid #d6e9c6' }}>
                  <h3 className="text-[14px] font-normal" style={{ fontFamily: 'Roboto, sans-serif', color: '#3c763d' }}>Idegennyelvi gyűjteményeink</h3>
                </div>
                <div className="px-[15px] py-[15px] space-y-2">
                  <a href="https://www.vmk.hu/gateway-uk-m" target="_blank" rel="noopener noreferrer" className="block text-[15px] text-black hover:text-black hover:no-underline" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Gateway UK gyűjtemény &gt;
                  </a>
                  <a href="https://www.goethe.de/ins/hu/hu/index.html" target="_blank" rel="noopener noreferrer" className="block text-[15px] text-black hover:text-black hover:no-underline" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Német nyelvi gyűjtemény (Goethe) &gt;
                  </a>
                </div>
              </div>
            </aside>
          </div>

          {cmsGalleries.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#333333]">Galéria</h2>
                <Link
                  href="/galeria"
                  className="text-sm font-semibold text-[#159097] hover:underline flex items-center gap-1"
                >
                  <span>További Galériák</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[30px]">
                {cmsGalleries.map((g) => {
                  const cover =
                    g.coverImage && typeof g.coverImage === 'object' && 'url' in g.coverImage
                      ? (g.coverImage.url as string)
                      : undefined
                  return (
                    <Link
                      key={g.id}
                      href={`/galeria/${g.slug}`}
                      className="relative aspect-[4/3] overflow-hidden bg-slate-100 group block"
                    >
                      {cover ? (
                        <Image
                          src={cover}
                          alt={g.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#159097] text-white/50 text-xs font-bold">
                          VMK
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-[15px] py-[10px] text-white text-[18px]" style={{ backgroundColor: 'rgba(0,144,155,0.85)', fontFamily: 'Roboto, sans-serif' }}>
                        <span className="truncate pr-2">{g.title}</span>
                        <span className="shrink-0 text-white text-xl font-bold">&gt;</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
