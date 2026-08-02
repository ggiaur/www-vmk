import React from 'react'
import Link from 'next/link'
import { Archive, Film, Headphones, Heart, MapPin, BookOpen, User, Database } from 'lucide-react'

// A valós vmk.hu főoldalán a bal oldali sáv egy függőleges, színes
// "widget-torony" - számos külső integrációra/rendszerre mutató doboz
// (webarchívum, filmtéka, hangos widget, kívánságkosár stb.). Ezek közül
// csak azokhoz kötünk valós linket, amikhez van tényleges belső oldalunk -
// a többi statikus, vizuálisan hasonló doboz marad, hogy ne ígérjünk
// működő funkciót olyanhoz, ami még nincs kiépítve.
const WIDGETS: Array<{
  label: string
  sublabel?: string
  href?: string
  icon: React.ReactNode
  bg: string
}> = [
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

export function HomeSidebar() {
  return (
    <aside className="space-y-3">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-2">
        Könyvtárunkról
      </h2>
      <nav className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-4 text-sm">
        <Link href="/reszlegek" className="block px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 text-slate-700">
          A könyvtár használata
        </Link>
        <Link href="/kapcsolat" className="block px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 text-slate-700">
          Elérhetőségeink
        </Link>
        <Link href="/szolgaltatasok" className="block px-4 py-2.5 hover:bg-slate-50 border-b border-slate-100 text-slate-700">
          Szolgáltatásaink
        </Link>
        {/* A valós www.vmk.hu-n élő, tényleges célcím - lekérdezve a
            saját, éles oldaluk HTML-jéből, nem kitalálva. */}
        <a
          href="https://www.vmk.hu/foglalkozaskereso"
          target="_blank"
          rel="noopener noreferrer"
          className="block px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-semibold"
        >
          Foglalkozáskereső
        </a>
      </nav>

      {WIDGETS.map((w) => {
        const content = (
          <div className={`${w.bg} rounded-lg p-4 text-white flex items-center gap-3 shadow-sm hover:brightness-110 transition-all`}>
            <div className="shrink-0 opacity-90">{w.icon}</div>
            <div className="min-w-0">
              <div className="font-bold text-sm leading-tight">{w.label}</div>
              {w.sublabel && <div className="text-[11px] opacity-80 leading-tight mt-0.5">{w.sublabel}</div>}
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
