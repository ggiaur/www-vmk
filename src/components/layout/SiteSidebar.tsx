'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Archive, Film, Headphones, Heart, MapPin, BookOpen, User, Database, ChevronDown } from 'lucide-react'

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
    sublabel: 'Aranybulla – Fejér vármegyei honlapok archívuma',
    href: 'https://webarchivum.vmk.hu/',
    icon: <Archive className="w-5 h-5" />,
    bg: 'bg-[#0f656a]',
  },
  {
    label: 'Filmtéka',
    sublabel: 'Ajánló videók',
    href: 'https://www.fehervartv.hu/video/index/44695',
    icon: <Film className="w-5 h-5" />,
    bg: 'bg-[#e4b02c] text-[#1B1B1B]',
  },
  {
    label: 'Hallgasson ránk',
    sublabel: 'Könyvajánlók hangban',
    href: 'https://www.vmk.hu/uj-konyvajanlo',
    icon: <Headphones className="w-5 h-5" />,
    bg: 'bg-[#f16f30]',
  },
  {
    label: 'Kívánságkosár',
    sublabel: 'Javasoljon beszerzést',
    href: 'http://www.vmk.hu/wishbasket',
    icon: <Heart className="w-5 h-5" />,
    bg: 'bg-[#159097]',
  },
  {
    label: 'Helyismeret',
    sublabel: 'Fejér vármegyei lexikon',
    href: 'https://konyvtar.vmk.hu/fejerlex/uj2019/index.php',
    icon: <MapPin className="w-5 h-5" />,
    bg: 'bg-[#159097]',
  },
  {
    label: 'Online Könyvtár',
    sublabel: 'Digitális adatbázisok',
    href: 'https://www.vmk.hu/adatbazisok-1',
    icon: <BookOpen className="w-5 h-5" />,
    bg: 'bg-[#1E293B]',
  },
  {
    label: 'Az én könyvtáram',
    sublabel: 'Olvasói fiók',
    href: 'http://www.azenkonyvtaram.hu/',
    icon: <User className="w-5 h-5" />,
    bg: 'bg-[#1E293B]',
  },
  {
    label: 'Közadat',
    sublabel: 'Közérdekű adatok keresése',
    href: 'https://kozadat.hu/kereso/kozfeladatot-ellato-szervek/adatlap/8159',
    icon: <Database className="w-5 h-5" />,
    bg: 'bg-[#0f656a]',
  },
]

interface MenuChild {
  label: string
  href: string
}

interface MenuItem {
  label: string
  href: string
  external?: boolean
  children?: MenuChild[]
}

// A valós oldalon ezek a menüpontok saját, tartalmi oldalakra mutatnak,
// amiket ITT (a klónban) nem építettünk ki - ezekhez a valós, élő vmk.hu
// megfelelő aloldalára mutatunk (ugyanaz a minta, mint a fejléc
// "Megyei Ellátás" / "Gyermekrészleg" külső linkjeinél), nem fabrikálunk
// üres/hamis belső oldalt. A hreflistát a valós oldal HTML-jéből kérdeztük
// le, nem találtuk ki. A "Könyvtárunkról" és "A könyvtár használata"
// valós legördülő almenük - a valós al-linkek is a nyers HTML-ből.
const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Könyvtárunkról',
    href: 'https://www.vmk.hu/konyvtarunkrol',
    external: true,
    children: [
      { label: 'Munkatársaink', href: '/munkatarsak' },
      { label: 'Alapdokumentumok', href: 'https://www.vmk.hu/alapdokumentumok' },
      { label: 'Számlaszámunk', href: 'https://www.vmk.hu/szamlaszamunk' },
      { label: 'Könyvtárunk rövid története', href: 'https://www.vmk.hu/konyvtarunk-rovid-tortenete' },
      { label: 'Projektek', href: 'https://www.vmk.hu/projektek' },
    ],
  },
  {
    label: 'A könyvtár használata',
    href: '/reszlegek',
    children: [
      {
        label: 'Kölcsönzési politika',
        href: 'https://www.vmk.hu/_upload/editor/Alapdokumentumok/Kolcsonzesi_politika_260601.pdf',
      },
      {
        label: 'Számítógép-használati szabályzat',
        href: 'https://www.vmk.hu/_upload/editor/Alapdokumentumok/Informatikai_es_biztonsagi_szabalyzat_VMK_20180801.pdf',
      },
      { label: 'Könyvtárközi kölcsönzés', href: 'https://www.vmk.hu/konyvtarkozi-kolcsonzes' },
    ],
  },
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
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <aside className="space-y-3">
      {/* A valós "MENÜ" fejléc fehér szövegű, teal hátterű doboz - Playwright
          screenshot pixelmintavétellel ellenőrizve (0,144,155 háttér),
          NEM egyszerű szürke felirat, ahogy korábban itt volt. Az
          alatta lévő linklista a valós oldalon lapos, keret és
          háttérdoboz nélküli, sötét (kb. #161616) szövegű lista. */}
      <div className="bg-[#00909B] px-4 py-2.5 rounded-t-lg">
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">Menü</h2>
      </div>
      <nav className="text-[15px] -mt-3 pb-2 mb-4">
        {MENU_ITEMS.map((item) => (
          <div key={item.href}>
            {item.children ? (
              <div>
                <button
                  type="button"
                  onClick={() => setOpenItem(openItem === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between gap-2 py-2.5 text-left text-[#161616] hover:text-[#159097] transition-colors"
                  aria-expanded={openItem === item.label}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${openItem === item.label ? 'rotate-180' : ''}`}
                  />
                </button>
                {openItem === item.label && (
                  <div className="pl-3 border-l-2 border-slate-100 ml-0.5 mb-1 space-y-0.5">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block py-1.5 text-sm text-slate-600 hover:text-[#159097]"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2.5 text-[#161616] hover:text-[#159097] transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link href={item.href} className="block py-2.5 text-[#161616] hover:text-[#159097] transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        ))}
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
