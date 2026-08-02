import React from 'react'
import { AlertTriangle } from 'lucide-react'

// A valós vmk.hu főoldalán a hírrács fölött egy sárga "FIGYELEM!" sáv áll,
// alatta rövid, aktuális tájékoztató szöveggel. Ez statikus tartalom -
// nem kötöttük CMS-mezőhöz, mert nincs ilyen dedikált gyűjtemény; ha ez
// gyakran változó tartalom lenne, érdemes lenne egy Payload globals mezőt
// nyitni rá.
export function FigyelemBanner() {
  return (
    <div className="bg-[#fbbf24] text-[#1B1B1B] rounded-lg overflow-hidden mb-6">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1B1B1B] text-[#fbbf24] font-bold text-sm">
        <AlertTriangle className="w-4 h-4" />
        <span>FIGYELEM!</span>
      </div>
      <div className="px-4 py-3 text-sm">
        <p className="font-semibold">Kedves Olvasóink!</p>
        <p className="mt-1">
          A Központi Könyvtárban augusztus 10-én (hétfőn) áramszünet lesz. Az Olvasóterem ekkor 8
          és 13 óra között zárva tart. Megértésüket köszönjük!
        </p>
      </div>
    </div>
  )
}
