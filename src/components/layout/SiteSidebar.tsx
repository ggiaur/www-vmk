import React from 'react'
import Link from 'next/link'
import { Archive, Film, Headphones, Heart, MapPin, BookOpen, User, Database } from 'lucide-react'

// A valós vmk.hu főoldalán a bal oldali sáv egy függőleges, színes
// "widget-torony" - számos külső integrációra/rendszerre mutató doboz
// (webarchívum, filmtéka, hangos widget, kívánságkosár stb.). A sorrend és
// a nav-lista Playwright screenshottal ellenőrizve a valós oldalhoz képest.
const WIDGETS: Array<{
  label: string
  sublabel?: string
  href?: string
  icon: React.ReactNode
  bg: string
}> = [
  {
    label: 'Webarchívum',
    sublabel: 'Fejér vármegyei honlapok archívuma',
    icon: <Archive className="w-5 h-5" />,
    bg: 'bg-[#0f656a]',
  },
  {
    label: 'Filmtéka',
    sublabel: 'Ajánló videók',
    icon: <Film className="w-5 h-5" />,
    bg: 'bg-[#e4b02c] text-[#1B1B1B]',
  },
  {
    label: 'Hallgasson ránk',
    sublabel: 'Könyvtári hangos anyagok',
    icon: <Headphones className="w-5 h-5" />,
    bg: 'bg-[#f16f30]',
  },
  {
    label: 'Kívánságkosár',
    sublabel: 'Javasoljon beszerzést',
    href: '/kapcsolat',
    icon: <Heart className="w-5 h-5" />,
    bg: 'bg-[#159097]',
  },
  {
    label: 'Helyismeret',
    sublabel: 'Székesfehérvár és Fejér vármegye',
    href: '/reszlegek',
    icon: <MapPin className="w-5 h-5" />,
    bg: 'bg-[#159097]',
  },
  {
    label: 'Online Könyvtár',
    sublabel: 'Digitális gyűjtemény',
    href: '/kereses',
    icon: <BookOpen className="w-5 h-5" />,
    bg: 'bg-[#1E293B]',
  },
  {
    label: 'Az én könyvtáram',
    sublabel: 'Olvasói fiók',
    href: 'https://katalogus.vmk.hu',
    icon: <User className="w-5 h-5" />,
    bg: 'bg-[#1E293B]',
  },
  {
    label: 'Közadat',
    sublabel: 'Közérdekű adatok keresése',
    icon: <Database className="w-5 h-5" />,
    bg: 'bg-[#0f656a]',
  },
]

// A valós oldalon ezek a menüpontok saját, tartalmi oldalakra mutatnak,
// amiket ITT (a klónban) nem építettünk ki - ezekhez a valós, élő vmk.hu
// megfelelő aloldalára mutatunk (ugyanaz a minta, mint a fejléc
// "Megyei Ellátás" / "Gyermekrészleg" külső linkjeinél), nem fabrikálunk
// üres/hamis belső oldalt. A hreflistát a valós oldal HTML-jéből kérdeztük
// le, nem találtuk ki.
const MENU_ITEMS: Array<{ label: string; href: string; external?: boolean }> = [
  { label: 'Könyvtárunkról', href: 'https://www.vmk.hu/konyvtarunkrol', external: true },
  { label: 'A könyvtár használata', href: '/reszlegek' },
  { label: 'Elérhetőségeink', href: '/kapcsolat' },
  { label: 'Szolgáltatásaink', href: '/szolgaltatasok' },
  { label: 'Közérdekű adatok', href: 'https://www.vmk.hu/kozerdeku-adatok', external: true },
  { label: 'Álláspályázatok', href: 'https://www.vmk.hu/allaspalyazatok', external: true },
  { label: 'Iskolai Közösségi Szolgálat', href: 'https://www.vmk.hu/iskolai-kozossegi-szolgalat', external: true },
  { label: 'Adó 1%', href: 'https://www.vmk.hu/ado-1', external: true },
  { label: 'MKE Fejér Megyei Szervezete', href: 'https://konyvtar.vmk.hu/mke/', external: true },
  { label: 'Támogatók, együttműködő partnerek', href: 'https://www.vmk.hu/tamogatok-egyuttmukodo-partnerek', external: true },
  { label: 'NKA pályázatok', href: 'https://www.vmk.hu/nka-palyazatok', external: true },
  { label: 'Programarchívum', href: '/programarchivum' },
  {
    label: 'Virtuális postaláda',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSdm7QtWAWoX1SdD1DGP6M6iOx9Out1gEYkARVqldtWcP3p4Sg/viewform',
    external: true,
  },
  { label: 'Foglalkozáskereső', href: 'https://www.vmk.hu/foglalkozaskereso', external: true },
]

export function SiteSidebar() {
  return (
    <aside className="space-y-3">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-2">Menü</h2>
      <nav className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-4 text-sm">
        {MENU_ITEMS.map((item, i) =>
          item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-4 py-2.5 hover:bg-slate-50 text-slate-700 ${i < MENU_ITEMS.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 hover:bg-slate-50 text-slate-700 ${i < MENU_ITEMS.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>

      {/* A valós widgetek kétrészesek: színes fejléc-sáv a névvel, alatta
          világos tartalom-terület a jellemző ikonnal/logóval - nem
          egységesen színezett dobozok, ahogy korábban itt volt. */}
      {WIDGETS.map((w) => {
        const content = (
          <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100">
            <div className={`${w.bg} px-3 py-2`}>
              <div className="font-bold text-xs uppercase tracking-wide leading-tight">{w.label}</div>
            </div>
            <div className="bg-white px-3 py-4 flex flex-col items-center text-center gap-1.5">
              <div className="text-slate-400">{w.icon}</div>
              {w.sublabel && <div className="text-[11px] text-slate-500 leading-tight">{w.sublabel}</div>}
            </div>
          </div>
        )
        return w.href ? (
          <Link key={w.label} href={w.href} target={w.href.startsWith('http') ? '_blank' : undefined}>
            {content}
          </Link>
        ) : (
          <div key={w.label}>{content}</div>
        )
      })}
    </aside>
  )
}
