import React from 'react'
import { Zap } from 'lucide-react'

// A valós vmk.hu főoldalán ez egy KÉTOSZLOPOS elem (Playwright screenshottal
// ellenőrizve): bal oldalt egy teal gradiens grafika villám-ikonnal és
// "FIGYELEM!" felirattal, jobb oldalt egy tömör teal "Tájékoztatás" doboz a
// tényleges üzenettel. A valós oldalon ez egy egyedi, kézzel készített
// grafika (nem CSS) - ezt nem tudjuk pixelre reprodukálni kép nélkül, de a
// szerkezetet és a teal színcsaládot követjük a korábbi, a márkától teljesen
// eltérő sárga/fekete verzió helyett.
//
// Statikus tartalom - nem kötöttük CMS-mezőhöz, mert nincs ilyen dedikált
// gyűjtemény; ha ez gyakran változó tartalom lenne, érdemes lenne egy
// Payload globals mezőt nyitni rá.
export function FigyelemBanner() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-0 rounded-lg overflow-hidden mb-6 shadow-sm">
      <div className="bg-gradient-to-br from-[#159097] to-[#0f656a] flex items-center justify-center gap-3 px-6 py-8 sm:py-0">
        <Zap className="w-8 h-8 text-[#e4b02c] shrink-0" />
        <span className="text-white font-black text-2xl tracking-wide">FIGYELEM!</span>
      </div>
      <div className="bg-[#0f656a] text-white px-5 py-4">
        <p className="font-bold text-sm mb-1">Tájékoztatás</p>
        <p className="font-semibold text-sm">Kedves Olvasóink!</p>
        <p className="text-sm text-teal-50 mt-1">
          A Központi Könyvtárban augusztus 10-én (hétfőn) áramszünet lesz. Az Olvasóterem ekkor 8
          és 13 óra között zárva tart. Megértésüket köszönjük!
        </p>
      </div>
    </div>
  )
}
