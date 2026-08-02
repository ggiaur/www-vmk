// A valós vmk.hu Bootstrap 3 .container-t használ: a konténer szélessége
// NEM folyamatosan skálázódik a viewport-tal, hanem törésponton UGRIK
// (1170px / 970px / 750px, 1200/992px határoknál). FONTOS: a belső margó
// NEM egységes az egész oldalon - a fejléc LOGÓ-sora egyedien 30px-es
// belső eltérést használ (saját, extra col-padding réteg miatt), de a
// nav-sor, az oldalsáv widget-jei, a lábléc és a fő tartalom-terület mind
// 15px-es belső eltérést használnak. Ezt 2026-08-02-én tévesen egységes
// 30px-re állítottuk mindenhol, ami a fejléc alatt mindenhol szélesebb
// margót adott a valósnál - most valós méréssel javítva (fewaBox x=150,
// navStripe x=150, mindkettő 15px, NEM 165/30px mint a logó).
// Lásd docs/MINOSEGPOLITIKA.md.
export const REAL_CONTAINER =
  'max-w-[750px] min-[992px]:max-w-[970px] min-[1200px]:max-w-[1170px] mx-auto px-[15px]'
