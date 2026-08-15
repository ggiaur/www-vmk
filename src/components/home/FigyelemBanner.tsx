import React from 'react'
import Image from 'next/image'

// A valós vmk.hu főoldalán ez egy KÉTOSZLOPOS elem, a bal oldali panel
// a valós, letöltött illusztráció (villám + VMK könyv-vízjel grafika,
// "FIGYELEM!" felirattal already beleégetve a képbe - ez egy stabil,
// újrafelhasználható márka-grafika, nem az aktuális, időszakos
// tájékoztató szövege). A képpont-diff eszközzel mérve a valós arány
// kb. 587:260 (a bal panel kb. 2.26x szélesebb, mint a jobb), a teljes
// magasság kb. 371px egy ~847px széles tartalom-oszlopban - ezt az
// arányt követi az aspect-[587/371] a bal panelen, a jobb panel pedig
// a grid sor-magasságát örökli (items-stretch).
export function FigyelemBanner() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[69%_31%] gap-0 rounded-lg overflow-hidden mb-6 shadow-sm items-stretch">
      <div className="relative aspect-[587/371] w-full">
        <Image
          src="/brand/banners/figyelem-illustration.png"
          alt="Figyelem!"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 69vw"
        />
      </div>
      <div className="bg-[#1d4ed8] text-white px-5 py-4 flex flex-col justify-center">
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
