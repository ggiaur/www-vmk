import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { HomeSidebar } from '@/components/home/HomeSidebar'
import { LocationBanner } from '@/components/home/LocationBanner'
import { HomeNewsTile } from '@/components/home/HomeNewsTile'
import { FigyelemBanner } from '@/components/home/FigyelemBanner'
import { EventCalendarWidget } from '@/components/home/EventCalendarWidget'
import { EventCard } from '@/components/ui/EventCard'
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
  const cmsEvents = await getUpcomingEvents(2)
  const cmsLibraries = await getAllLibraries()
  const cmsGalleries = await getAllGalleries(6)

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
  ]

  const displayNews = cmsNews.length > 0 ? cmsNews : sampleNews
  const displayEvents = cmsEvents.length > 0 ? cmsEvents : sampleEvents

  const locations = cmsLibraries.map((l) => ({ name: l.name, slug: l.slug }))

  const now = new Date()
  const highlightedDays = displayEvents
    .map((e) => new Date(typeof e.startDate === 'string' ? e.startDate : now))
    .filter((d) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth())
    .map((d) => d.getDate())

  return (
    <div>
      <LocationBanner locations={locations} />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <HomeSidebar />

        <main className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 mb-4">Hírek, Események</h1>

          <FigyelemBanner />

          <div className="flex items-center justify-between mb-4">
            <span className="sr-only">Legfrissebb híreink</span>
            <Link
              href="/hirek"
              className="ml-auto text-sm font-semibold text-[#159097] hover:underline flex items-center gap-1"
            >
              <span>Összes hírünk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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

          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#e4b02c]" />
                  Eseménynaptár
                </h2>
                <Link
                  href="/esemenyek"
                  className="text-sm font-semibold text-[#159097] hover:underline flex items-center gap-1"
                >
                  <span>További eseményeink</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayEvents.map((event) => {
                  const loc = 'location' in event ? event.location : undefined
                  const locationName =
                    loc && typeof loc === 'object' && 'name' in loc
                      ? (loc.name as string)
                      : 'locationName' in event
                        ? (event.locationName as string)
                        : 'VMK Székesfehérvár'
                  return (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      startDate={
                        typeof event.startDate === 'string' ? event.startDate : new Date().toISOString()
                      }
                      locationName={locationName}
                      targetAudience={event.targetAudience}
                      slug={event.slug}
                      registrationUrl={'registrationUrl' in event ? event.registrationUrl ?? undefined : undefined}
                    />
                  )
                })}
              </div>
            </section>

            <aside className="space-y-4">
              <EventCalendarWidget
                highlightedDays={highlightedDays}
                year={now.getFullYear()}
                month={now.getMonth()}
              />
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h3 className="font-bold text-sm text-slate-800 mb-2">Folyóiratok könyvtárunkban</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Kurrens folyóiratok a Központi Könyvtár Olvasótermében, valamint a Tagkönyvtárakban.
                </p>
                <Link href="/reszlegek" className="text-xs font-semibold text-[#159097] hover:underline">
                  Kurrens folyóiratok listája →
                </Link>
              </div>
            </aside>
          </div>

          {cmsGalleries.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Galéria</h2>
                <Link
                  href="/galeria"
                  className="text-sm font-semibold text-[#159097] hover:underline flex items-center gap-1"
                >
                  <span>További Galériák</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cmsGalleries.map((g) => {
                  const cover =
                    g.coverImage && typeof g.coverImage === 'object' && 'url' in g.coverImage
                      ? (g.coverImage.url as string)
                      : undefined
                  return (
                    <Link
                      key={g.id}
                      href={`/galeria/${g.slug}`}
                      className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 group"
                    >
                      {cover ? (
                        <Image
                          src={cover}
                          alt={g.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#159097] text-white/50 text-xs font-bold">
                          VMK
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[11px] px-2 py-1 truncate">
                        {g.title}
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
