'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'

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
    href: '/hirek',
    img: '/brand/widgets/hallgasson-rank.png',
    imgAlt: 'Hallgasson ránk',
  },
  {
    label: 'Smartlibrary - Okoskönyvtár',
    href: '/szolgaltatasok',
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
    href: '/kapcsolat',
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
    href: '/szolgaltatasok',
    type: 'img-buttons',
    img: '/brand/widgets/online-konyvtar.jpg',
    imgAlt: 'Online könyvtár',
    buttons: [
      { label: 'Adatbázisok', href: '/szolgaltatasok' },
      { label: 'Adatbázisok', href: '/szolgaltatasok' },
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

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Könyvtárunkról',
    href: '/konyvtarunkrol',
    children: [
      { label: 'Munkatársaink', href: '/munkatarsak' },
      { label: 'Alapdokumentumok', href: '/dokumentumok' },
      { label: 'Elérhetőségeink', href: '/kapcsolat' },
    ],
  },
  {
    label: 'A könyvtár használata',
    href: '/reszlegek',
    children: [
      { label: 'Nyitvatartás', href: '/nyitvatartas' },
      { label: 'Tagkönyvtárak', href: '/tagkonyvtarak' },
      { label: 'Szolgáltatások', href: '/szolgaltatasok' },
    ],
  },
  { label: 'Közérdekű adatok', href: '/kozerdeku-adatok' },
  { label: 'Álláspályázatok', href: '/allaspalyazatok' },
  { label: 'Iskolai Közösségi Szolgálat', href: '/szolgaltatasok' },
  { label: 'Adó 1%', href: '/ado-1' },
  { label: 'MKE Fejér Megyei Szervezete', href: 'https://konyvtar.vmk.hu/mke/', external: true },
  { label: 'Támogatók, együttműködő partnerek', href: '/tamogatas' },
  { label: 'NKA pályázatok', href: '/nka-palyazatok' },
  { label: 'Programarchívum', href: '/programarchivum' },
  { label: 'Virtuális postaláda', href: '/kapcsolat' },
  { label: 'Foglalkozáskereső', href: '/foglalkozaskereso' },
]

export function SiteSidebar() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <aside>
      {/* Valós oldal CSS: .box { margin-bottom: 30px }, de .box.menu { margin-bottom: 0 }
          → a MENÜ header-nek nincs bottom marginaja, a submenu (nav) viszont kapja a 30px-et.
          A fejléc font-size: 18px (valós), padding: 8px 15px (valós). */}
      <button
        type="button"
        onClick={() => setSidebarOpen((v) => !v)}
        className="lg:hidden w-full text-white font-bold text-[18px] uppercase leading-[19.8px] flex items-center justify-between"
        style={{ backgroundColor: 'var(--accent-fill-a11y)', padding: '8px 15px', marginBottom: sidebarOpen ? 0 : '15px' }}
        aria-expanded={sidebarOpen}
        aria-label="Menü megnyitása"
      >
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>MENÜ</span>
        {sidebarOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>
      <div className="hidden lg:block w-full text-white font-bold text-[18px] uppercase leading-[19.8px]" style={{ backgroundColor: 'var(--accent-fill-a11y)', padding: '8px 15px', marginBottom: 0 }}>
        <div
          style={{
            margin: 0,
            color: '#FFF',
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: '19.8px',
            fontFamily: 'Roboto, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          MENÜ
        </div>
      </div>
      <nav className={`text-[16px] px-[15px] pt-[10px] pb-[15px] bg-white mb-[30px] ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
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
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-1.5 text-sm text-slate-600 hover:text-[#159097]"
                      >
                        {child.label}
                      </Link>
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

      <div>
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
            style={{ display: 'block', backgroundColor: 'var(--accent-fill-a11y)', padding: '8px 15px' }}
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
      </div>
    </aside>
  )
}
