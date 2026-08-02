// A valós vmk.hu Bootstrap 3 .container-t használ: a konténer szélessége
// NEM folyamatosan skálázódik a viewport-tal, hanem törésponton UGRIK
// (1170px / 970px / 750px, 1200/992px határoknál), plusz egy fix 30px
// belső margó. 7 valós mért pontból levezetve (mind pixelre egyezett),
// lásd docs/MINOSEGPOLITIKA.md. Ez a konstans a fejlécben már alkalmazott
// képletet teszi újrafelhasználhatóvá a teljes oldalon - korábban minden
// más szekció Tailwind alap max-w-7xl (1280px, folyamatosan skálázó)
// konténert használt, ami keskenyebb ablakban jelentősen kisebb margót
// adott, mint a valós oldal.
export const REAL_CONTAINER =
  'max-w-[750px] min-[992px]:max-w-[970px] min-[1200px]:max-w-[1170px] mx-auto px-[30px]'
