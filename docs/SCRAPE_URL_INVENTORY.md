# Valós vmk.hu URL-leltár (scraper bemenet)

Ez a lista a `https://www.vmk.hu/news` oldal linkjeiből lett kinyerve
(`curl` + `grep`, 2026-07-31). Munkadokumentum a valós tartalom-migrációs
scraperhez (`docs/MIGRATION_STRATEGY.md` 4. pontja) — nem teljes leltár,
csak egy első minta a felderítéshez.

## Megfigyelések

* A hír-URL-ek dátum-előtaggal kevertek: `/202605_szena_ter_...`,
  `/20260602_nyaraljon_...`, `/2026-06-15-a-muveszet-mindenkie-...` — három
  különböző dátum-formátum, ahogy a `DISCOVERY_AUDIT.md` is jelezte.
* A statikus oldalak (részlegek, tagkönyvtárak, rólunk-aloldalak) gyökér
  szinten, ékezetmentes, kötőjeles slugokkal élnek — ezek szinte 1:1
  megfeleltethetők az új `/reszlegek/*`, `/tagkonyvtarak/*`, `/rolunk/*`
  útvonalaknak (ld. lent a megfeleltetési táblát).
* A régi oldalnak **már van saját `/programarchivum` és évenkénti
  `/programok-YYYY` archívuma** (2012–2022) — ez közvetlenül átvehető
  tartalom-forrás az új `/programarchivum` oldalhoz.

## Régi → Új URL Megfeleltetés (minta, első kör)

| Régi URL | Új útvonal | Megjegyzés |
| :--- | :--- | :--- |
| `/budai-uti-tagkonyvtar` | `/tagkonyvtarak/budai-ut` | |
| `/meszoly-geza-utcai-tagkonyvtar` | `/tagkonyvtarak/meszoly-geza` | |
| `/szena-teri-tagkonyvtar` | `/tagkonyvtarak/szena-ter` | |
| `/tolnai-utcai-tagkonyvtar` | `/tagkonyvtarak/tolnai-ut` | |
| `/zsolt-utcai-tagkonyvtar` | `/tagkonyvtarak/zsolt-ut` | |
| `/felnott-kolcsonzo-reszleg` | `/reszlegek/felnott-kolcsonzo` | |
| `/olvasoterem` | `/reszlegek/olvasoterem` | |
| `/koteszet` | `/reszlegek/koteszet` | |
| `/pedagogiai-reszleg` | `/reszlegek/pedagogia` | |
| `/elerhetosegeink` | `/elerhetosegeink` | slug egyezik, csak tartalom kell |
| `/alapdokumentumok` | `/rolunk/alapdokumentumok` | Pages blokk (Downloads) |
| `/allaspalyazatok` | `/rolunk/allaspalyazatok` | Pages blokk |
| `/kozerdeku-adatok` | `/rolunk/kozerdeku-adatok` | Pages blokk |
| `/projektek` / `/nka-palyazatok` | `/rolunk/projektek` | össze kell vonni |
| `/tamogatok-2022` / `/partnerkonyvtarunk` / `/tamogatok-egyuttmukodo-partnerek` | `/rolunk/tamogatok` | `Partners` kollekció, `partnersGrid` blokk |
| `/konyvtarkozi-kolcsonzes` | `/hasznalat/konyvtarkozi-kolcsonzes` | Pages blokk |
| `/a-konyvtar-hasznalata` | `/hasznalat/beiratkozas` (?) | tartalmat ellenőrizni kell |
| `/gallery` | `/galeria` | `Galleries` kollekció |
| `/programarchivum`, `/programok-2012`…`/programok-2022` | `/programarchivum` | `News` `archive` kategória |
| `/nyitvatartas`, `/opening-hours` | `/nyitvatartas` | |
| `/konyvtarunkrol`, `/konyvtarunk-rovid-tortenete` | `/rolunk/tortenet` | |

## Következő Lépés

Írj egy `scripts/scrape-vmk.ts` (vagy `.mjs`, a Node 24 + tsx CLI-interop
bug miatt lásd `.ai/context/current_state.md`) szkriptet, ami:
1. Bejárja a `/news` lapozását (vagy sitemap.xml-t, ha van) a teljes
   cikklistáért, nem csak ezt a mintát.
2. Minden cikkoldalt letölt, kinyeri a címet, dátumot, törzsszöveget
   (HTML → Lexical JSON transzformáció), kiemelt képet.
3. A képeket/PDF-eket letölti és a Payload Local API `media` kollekcióján
   át tölti fel (MinIO-ba kerülnek).
4. A `payload.create({ collection: 'news', ... })` helyi API-val tölti be
   az adatokat — ugyanúgy, mint a `scripts/seed.ts`, tehát a Next.js dev
   szerveren belüli route handleren (`/api/dev-seed` mintájára) érdemes
   futtatni, NEM önálló `tsx` szkriptként.
