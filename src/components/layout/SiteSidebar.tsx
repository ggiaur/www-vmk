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
  img?: string
  imgAlt?: string
  type?: 'img' | 'text' | 'multi-img' | 'img-buttons'
  imgs?: Array<{ src: string; alt: string }>
  buttons?: Array<{ label: string; href: string }>
  textContent?: string
  textLink?: string
  textLinkLabel?: string
}> = [
  { label: 'FEWA', href: 'https://fewa.vmk.hu/', img: '/brand/widgets/fewa.jpg', imgAlt: 'FEWA' },
  {
    label: 'Aranybulla-Webarchívum',
    href: 'https://webarchivum.vmk.hu/',
    img: '/brand/widgets/aranybulla.png',
    imgAlt: 'Aranybulla Webarchívum',
  },
  {
    // A valós oldalon YouTube embed + 'Olvasni élvezet' szöveg + forrás link.
    // A filmes-teka.png ikon 24x24px — ez szándékos ikon a valós oldalon,
    // nem a widget fő képe. A YouTube iframe sandbox-ban nem töltődik be,
    // ezért szöveges helyettesítőt használunk (H8: a 24x24px kép w-full
    // h-auto esetén 236x236px-re nyúlik — ez hibas volt).
    label: 'Filmes-téka',
    href: 'https://www.fehervartv.hu/video/index/44695',
    type: 'text',
    textContent: 'Olvasni élvezet',
    textLink: 'https://www.fehervartv.hu/video/index/44695',
    textLinkLabel: 'További videók →',
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
    // Valós oldal: 2 kép egymás alatt (lexikon.jpg + naptar-evfordulo.jpg)
    label: 'Helyismeret',
    href: 'https://konyvtar.vmk.hu/fejerlex/uj2019/index.php',
    type: 'multi-img',
    imgs: [
      { src: '/brand/widgets/lexikon.jpg', alt: 'Fejér vármegyei lexikon' },
      { src: '/brand/widgets/naptar-evfordulo.jpg', alt: 'Naptár és évforduló' },
    ],
  },
  {
    label: 'Online könyvtár',
    href: 'https://www.vmk.hu/adatbazisok-1',
    type: 'img-buttons',
    img: '/brand/widgets/online-konyvtar.jpg',
    imgAlt: 'Online könyvtár',
    // Valós oldalon 2 Bootstrap btn-info gomb van a kép alatt – vmk.hu/adatbazisok-1 oldal linkek
    buttons: [
      { label: 'Adatbázisok', href: 'https://www.vmk.hu/adatbazisok-1' },
      { label: 'Adatbázisok', href: 'https://www.vmk.hu/adatbazisok' },
    ],
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
    <aside>
      {/* Valós oldal CSS: .box { margin-bottom: 30px }, de .box.menu { margin-bottom: 0 }
          → a MENÜ header-nek nincs bottom marginaja, a submenu (nav) viszont kapja a 30px-et.
          A fejléc font-size: 18px (valós), padding: 8px 15px (valós). */}
      <div className="bg-[#00909B] w-full" style={{ padding: '8px 15px', marginBottom: 0 }}>
        {/* div, nem h2: a h2 Cinzel fontot örököl (globals.css), ami eltérő line-height-et ad */}
        <div
          style={{
            margin: 0,
            color: '#FFF',
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: '1.1',
            textTransform: 'uppercase',
          }}
        >
          Menü
        </div>
      </div>
      {/* valós vmk.hu: .box.submenu { background-color: #fff } — fehér háttér, nem CCE9EB */}
      <nav className="text-[16px] px-[15px] pt-[10px] pb-[15px] bg-white mb-[30px]">
        {MENU_ITEMS.map((item) => (
          <div key={item.href}>
            {item.children ? (
              <div>
                <button
                  type="button"
                  onClick={() => setOpenItem(openItem === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between gap-2 py-[8px] text-left text-[#161616] hover:text-[#159097] transition-colors"
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
                className="block py-[8px] text-[#161616] hover:text-[#159097] transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link href={item.href} className="block py-[8px] text-[#161616] hover:text-[#159097] transition-colors">
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
        /* Valós CSS: .box { margin-bottom: 30px; background-color: #cce9eb; width: 100%; }
           .box h1 { padding: 8px 15px; font-size: 18px; font-weight: 700; color: #FFF; background: #00909b; margin: 0; }
           .box .content { padding: 15px; }
           MEGJEGYZÉS: a külső keret div (nem a), mert egyes widgetek (Filmes-téka, Online könyvtár)
           beágyazott <a> elemeket tartalmaznak → <a> nem lehet <a> gyereke (HTML szabály + hydration error). */
        <div
          key={w.label}
          className="overflow-hidden"
          style={{ marginBottom: '30px', backgroundColor: '#cce9eb', width: '100%' }}
        >
          {/* A fejléc sáv maga a kattintható link a widget fő URL-jére */}
          <a
            href={w.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', backgroundColor: '#00909b', padding: '8px 15px' }}
          >
            <div
              style={{ margin: 0, color: '#FFF', fontSize: '18px', fontWeight: 700, textTransform: 'uppercase' }}
            >
              {w.label}
            </div>
          </a>
          {w.type === 'text' ? (
            <div style={{ padding: '15px' }}>
              <p style={{ fontSize: '13px', fontStyle: 'italic', marginBottom: '8px' }}>{w.textContent}</p>
              <iframe
                src="https://fehervartv.hu/embed.php?vid=44695;autoplay=false"
                width="100%"
                height="150"
                style={{ display: 'block', border: '1px solid #b9b9b9', backgroundColor: '#fff' }}
                title="Filmes-téka"
              />
              <p style={{ fontSize: '11px', color: '#555', marginTop: '4px', marginBottom: '4px' }}>
                forrás:{' '}
                <a
                  href="https://www.fehervartv.hu/video/index/44695"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#555' }}
                >
                  Fehérvár Médiacentrum
                </a>
              </p>
              <a
                href={w.textLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '11px', color: '#159097' }}
              >
                {w.textLinkLabel}
              </a>
            </div>
          ) : w.type === 'multi-img' ? (
            <a href={w.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '15px' }}>
              {w.imgs?.map((img) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={img.src} src={img.src} alt={img.alt} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
              ))}
            </a>
          ) : w.type === 'img-buttons' ? (
            <div style={{ padding: '15px' }}>
              <a href={w.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.img} alt={w.imgAlt} style={{ display: 'block', maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
              </a>
              {/* Bootstrap btn btn-info gombok – valós oldal: 2 db gomb kép alatt, #5bc0de háttér */}
              {w.buttons?.map((btn) => (
                <a
                  key={btn.href}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    marginBottom: '10px',
                    padding: '6px 12px',
                    backgroundColor: '#5bc0de',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: '14px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                  }}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          ) : (
            <a href={w.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '15px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.img} alt={w.imgAlt} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
            </a>
          )}
        </div>
      ))}
    </aside>
  )
}
