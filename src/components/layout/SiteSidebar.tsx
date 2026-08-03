'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

// A valós vmk.hu főoldalán a bal oldali sáv egy függőleges widget-torony,
// VALÓS PROMÓCIÓS KÉPEKKEL (nem ikon+alcím szöveggel, ahogy korábban itt
// volt) - a képek és linkek a valós oldal DOM-jából lekérdezve (nem
// kitalálva), letöltve a public/brand/widgets/ mappába. A sorrend is a
// valós oldalt követi: Menü, FEWA, Aranybulla-Webarchívum, Filmes-téka,
// TOP-7.1.1 EU-pályázat, Hallgasson ránk!, Smartlibrary, EFOP-3.7.3
// EU-pályázat, Kívánságkosár, Helyismeret, Online könyvtár, Az én
// könyvtáram, Közadat - 12 widget, nem 8, ahogy korábban.
const WIDGETS: Array<{
  label: string
  href: string
  img: string
  imgAlt: string
}> = [
  { label: 'FEWA', href: 'https://fewa.vmk.hu/', img: '/brand/widgets/fewa.jpg', imgAlt: 'FEWA' },
  {
    label: 'Aranybulla-Webarchívum',
    href: 'https://webarchivum.vmk.hu/',
    img: '/brand/widgets/aranybulla.png',
    imgAlt: 'Aranybulla Webarchívum',
  },
  {
    label: 'Filmes-téka',
    href: 'https://www.fehervartv.hu/video/index/44695',
    img: '/brand/widgets/filmes-teka.png',
    imgAlt: 'Filmes-téka',
  },
  {
    label: 'TOP-7.1.1-16-H-ERFA-2019-00463',
    href: 'https://www.vmk.hu/_upload/editor/2021/TOP-BudaiUtiKvtPalyazat.pdf',
    img: '/brand/widgets/top-erfa.png',
    imgAlt: 'TOP-7.1.1 pályázat',
  },
  {
    label: 'Hallgasson ránk!',
    href: 'https://www.vmk.hu/uj-konyvajanlo',
    img: '/brand/widgets/hallgasson-rank.png',
    imgAlt: 'Hallgasson ránk',
  },
  {
    label: 'Smartlibrary - Okoskönyvtár',
    href: 'https://www.vmk.hu/okos-konyvtar-avagy-nyitott-ter-program-a-vorosmarty-mihaly-konyvtarban',
    img: '/brand/widgets/smartlibrary.png',
    imgAlt: 'Smartlibrary Okoskönyvtár',
  },
  {
    label: 'EFOP-3.7.3-16-2017-00106',
    href: 'http://konyvtar.vmk.hu/efop/',
    img: '/brand/widgets/efop.png',
    imgAlt: 'EFOP-3.7.3 pályázat',
  },
  {
    label: 'Kívánságkosár',
    href: 'http://www.vmk.hu/wishbasket',
    img: '/brand/widgets/kivansagkosar.jpg',
    imgAlt: 'Kívánságkosár',
  },
  {
    label: 'Helyismeret',
    href: 'https://konyvtar.vmk.hu/fejerlex/uj2019/index.php',
    img: '/brand/widgets/helyismeret.jpg',
    imgAlt: 'Fejér vármegyei lexikon',
  },
  {
    label: 'Online könyvtár',
    href: 'https://www.vmk.hu/adatbazisok-1',
    img: '/brand/widgets/online-konyvtar.jpg',
    imgAlt: 'Online könyvtár',
  },
  {
    label: 'Az én könyvtáram',
    href: 'http://www.azenkonyvtaram.hu/',
    img: '/brand/widgets/az-en-konyvtaram.png',
    imgAlt: 'Az én könyvtáram',
  },
  {
    label: 'Közadat',
    href: 'https://kozadat.hu/kereso/kozfeladatot-ellato-szervek/adatlap/8159',
    img: '/brand/widgets/kozadat.png',
    imgAlt: 'Közadatkereső',
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
      {/* A valós oldalon a MENÜ doboz tartalom-területe (és minden más
          widget tartalom-területe is) egységesen világos ciánkék -
          Playwright-tal 6 különböző widgeten mérve konzisztensen
          rgb(204,233,235) = #CCE9EB, NEM fehér. */}
      <nav className="text-[15px] px-4 pt-1 pb-3 mb-4 bg-[#CCE9EB] rounded-b-lg">
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
      {WIDGETS.map((w) => (
        <a
          key={w.label}
          href={w.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100"
        >
          <div className="bg-[#00909B] px-3 py-2">
            <div className="font-bold text-xs uppercase tracking-wide leading-tight text-white">{w.label}</div>
          </div>
          {/* NINCS fix magasság. A valós oldalon a widgetek magassága
              VÁLTOZÓ (mérve: 135px FEWA ... 374px Aranybulla, összesen
              3091px). Korábban itt h-[104px] állt, mert a legkisebb
              widgetet (FEWA) mértem le és azt általánosítottam mindre -
              ettől a widgetBoxSize ellenőrzés PASS lett, miközben a
              widget-torony 1644px-re zsugorodott a valós 3091px helyett,
              ami egymaga a teljes oldalmagasság-rés 84%-a volt. */}
          <div className="bg-[#CCE9EB] p-3 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.img} alt={w.imgAlt} className="w-full h-auto object-contain" />
          </div>
        </a>
      ))}
    </aside>
  )
}
