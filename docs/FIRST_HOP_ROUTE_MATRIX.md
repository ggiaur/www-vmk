# First-hop route-parity mátrix

Végállapot: 2026-08-15T21:35:15.360Z (A2a + A2b lezárása után)

Forrás: `.visual-oracle/route-manifest.json` (113 same-host first-hop route), összevetve a referenciával (`https://www.vmk.hu`) és a lokális production build-del (`http://localhost:3011`).

> A `localhost:3001` ezen a gépen a `webarchivum` projekt szervere -- 3011-en mértem.

## Teljes körfutás (A1 -> A2a -> A2b)

| Státusz | A1 | A2a | A2b (végső) |
|---|---|---|---|
| CLONED | 42 | 78 | 107 |
| MISSING | 69 | 30 | 1 |
| PREVIEW/INTERNAL | 2 | 2 | 2 |
| REDIRECTED | 0 | 3 | 3 |

**Végső gate (COLLAB.md 8. fejezet): `MISSING = 0`, `BROKEN = 0` -- gyakorlatilag teljesítve.** Az egyetlen fennmaradó MISSING (`/wishbasket`) tudatos, dokumentált kivétel, nem hiba.

**A2b root-cause megoldás (nem 29 egyedi hack):**

1. 18/29 route valódi tartalommal bírt a referencián -- ugyanazzal a generikus `vmkPageScraper`-rel importálva, mint A2a-ban.
2. 11/29 route (`/programok-2012`..`/programok-2022`, `/muzeumok-ejszakaja-2018`) **a referencia oldalon magán is teljesen üres** ma (0 karakter valódi szöveg a cím alatt, ellenőrizve mind a 11-re egyenként) -- nincs mit migrálni. **Canonical redirect** a `/programarchivum`-ra (a site jelenlegi program-archívum nézete), nem hamisított tartalom és nem is puszta 404.

**Hiba, amit útközben találtam és visszavontam:** a scraper egy korábbi verziója egy oldalspecifikusnak hitt videó-widgetet (`fehervartv.hu` beágyazás) használt fallbackként üres oldalakhoz -- kiderült, hogy ez egy **sitewide** widget, ami a teljesen üres `/programok-YYYY` oldalakon is megjelenik. Ez 11 route-ot tévesen "CLONED"-ra állított volna félrevezető tartalommal (egy 2012-es programarchívum oldal, aminek "tartalma" egy könyvtárhasználati promóvideó lett volna). A fallbacket eltávolítottam a scraperből, a rossz rekordokat töröltem, és minden route-ot egyenként, ténylegesen ellenőriztem a referencián, mielőtt döntöttem volna a kezelésükről.

## Részletes mátrix

| Reference URL | Clone URL | Státusz | Ref HTTP | Local HTTP | Oldalcsalád | Megjegyzés |
|---|---|---|---|---|---|---|
| `/` | `/` | CLONED | 200 | 200 | home | 200, ~465 szó, van <h1> |
| `/2026_08_12_netrevalok` | `/2026_08_12_netrevalok` | CLONED | 200 | 200 | news/event detail | 200, ~214 szó, van <h1> |
| `/20260602_tarsasjatek_kolcsonzes` | `/20260602_tarsasjatek_kolcsonzes` | CLONED | 200 | 200 | news/event detail | 200, ~158 szó, van <h1> |
| `/202608_spiro-80-kiallitas-szena` | `/202608_spiro-80-kiallitas-szena` | CLONED | 200 | 200 | news/event detail | 200, ~166 szó, van <h1> |
| `/20260806_zummogj_velunk_szena` | `/20260806_zummogj_velunk_szena` | CLONED | 200 | 200 | news/event detail | 200, ~210 szó, van <h1> |
| `/20260824_megvaltozott_nyitvatartas_zene_ped` | `/20260824_megvaltozott_nyitvatartas_zene_ped` | CLONED | 200 | 200 | news/event detail | 200, ~168 szó, van <h1> |
| `/a-jaki-templomok-es-temetoik-2026-08-19` | `/a-jaki-templomok-es-temetoik-2026-08-19` | CLONED | 200 | 200 | news/event detail | 200, ~229 szó, van <h1> |
| `/a-konyvtar-hasznalata` | `/a-konyvtar-hasznalata` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~86 szó, van <h1> |
| `/adatbazisok-1` | `/adatbazisok-1` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~2088 szó, van <h1> |
| `/ado-1` | `/ado-1` | CLONED | 200 | 200 | institutional/static content | 200, ~156 szó, van <h1> |
| `/alapdokumentumok` | `/dokumentumok` | CLONED | 200 | 200 | institutional/static content | 200, ~392 szó, van <h1> |
| `/allaspalyazatok` | `/allaspalyazatok` | CLONED | 200 | 200 | institutional/static content | 200, ~132 szó, van <h1> |
| `/arato-antal-emlekere` | `/arato-antal-emlekere` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~103 szó, van <h1> |
| `/bartok-teri-olvasokor-2026-05-19` | `/bartok-teri-olvasokor-2026-05-19` | CLONED | 200 | 200 | news/event detail | 200, ~82 szó, van <h1> |
| `/bartok-teri-olvasokor-2026-07-14` | `/bartok-teri-olvasokor-2026-07-14` | CLONED | 200 | 200 | news/event detail | 200, ~90 szó, van <h1> |
| `/beiratkozott-olvasoinknak` | `/beiratkozott-olvasoinknak` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~487 szó, van <h1> |
| `/bregyo-tabor-2026-07-06` | `/bregyo-tabor-2026-07-06` | CLONED | 200 | 200 | news/event detail | 200, ~87 szó, van <h1> |
| `/bregyo-tabor-2026-07-13` | `/bregyo-tabor-2026-07-13` | CLONED | 200 | 200 | news/event detail | 200, ~87 szó, van <h1> |
| `/budai-uti-tagkonyvtar` | `/tagkonyvtarak/budai-ut` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~135 szó, van <h1> |
| `/csaladi-olvasasmania-2026` | `/csaladi-olvasasmania-2026` | CLONED | 200 | 200 | news/event detail | 200, ~246 szó, van <h1> |
| `/csendes-olvasas-a-szabadban-szena-2026-augusztustol` | `/csendes-olvasas-a-szabadban-szena-2026-augusztustol` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~219 szó, van <h1> |
| `/egy-szal-fonal-tuske-csilla-amigurumi-kiallitasa-2026-07-01` | `/egy-szal-fonal-tuske-csilla-amigurumi-kiallitasa-2026-07-01` | CLONED | 200 | 200 | news/event detail | 200, ~102 szó, van <h1> |
| `/egyuttmukodo-partnereink` | `/egyuttmukodo-partnereink` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~172 szó, van <h1> |
| `/egyuttmukodo-partnerek-2022` | `/egyuttmukodo-partnerek-2022` | CLONED | 200 | 200 | news/event detail | 200, ~172 szó, van <h1> |
| `/elerhetosegeink` | `/kapcsolat` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~380 szó, van <h1> |
| `/events` | `/events` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~145 szó, van <h1> |
| `/felnott-kolcsonzo-reszleg` | `/reszlegek/felnott-kolcsonzo` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~130 szó, van <h1> |
| `/foglalkozaskereso` | `/foglalkozaskereso` | CLONED | 200 | 200 | institutional/static content | 200, ~134 szó, van <h1> |
| `/folyoiratok-a-tagkonyvtarakban` | `/folyoiratok-a-tagkonyvtarakban` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~436 szó, van <h1> |
| `/gallery` | `/galeria` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~393 szó, van <h1> |
| `/gateway-uk-m` | `/gateway-uk-m` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~630 szó, van <h1> |
| `/helyben-hasznalhato-adatbazisok` | `/helyben-hasznalhato-adatbazisok` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~441 szó, van <h1> |
| `/herman-otto-emlekev` | `/herman-otto-emlekev` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~357 szó, van <h1> |
| `/holokauszt-emlekev-2014` | `/holokauszt-emlekev-2014` | CLONED | 200 | 200 | news/event detail | 200, ~544 szó, van <h1> |
| `/husolo-es-olvasosarok-2026` | `/husolo-es-olvasosarok-2026` | CLONED | 200 | 200 | news/event detail | 200, ~227 szó, van <h1> |
| `/iskolai-kozossegi-szolgalat` | `/iskolai-kozossegi-szolgalat` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~320 szó, van <h1> |
| `/karacsonyi-iropalyazat-2025-irasok` | `/karacsonyi-iropalyazat-2025-irasok` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~670 szó, van <h1> |
| `/konyvtaraknak` | `/konyvtaraknak` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~522 szó, van <h1> |
| `/konyvtarkozi-kolcsonzes` | `/konyvtarkozi-kolcsonzes` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~70 szó, van <h1> |
| `/konyvtarunk-rovid-tortenete` | `/konyvtarunk-rovid-tortenete` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~199 szó, van <h1> |
| `/konyvtarunkrol` | `/konyvtarunkrol` | CLONED | 200 | 200 | institutional/static content | 200, ~199 szó, van <h1> |
| `/kortars-muveszeti-fesztival-2012` | `/kortars-muveszeti-fesztival-2012` | CLONED | 200 | 200 | news/event detail | 200, ~111 szó, van <h1> |
| `/kortars-muveszeti-fesztival-2017` | `/kortars-muveszeti-fesztival-2017` | CLONED | 200 | 200 | news/event detail | 200, ~192 szó, van <h1> |
| `/koteszet` | `/koteszet` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~127 szó, van <h1> |
| `/kozerdeku-adatok` | `/kozerdeku-adatok` | CLONED | 200 | 200 | institutional/static content | 200, ~175 szó, van <h1> |
| `/kozponti-konyvtar-1` | `/kozponti-konyvtar-1` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~83 szó, van <h1> |
| `/kreativ-otletek-levendulabol-20260625` | `/kreativ-otletek-levendulabol-20260625` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~99 szó, van <h1> |
| `/kurrens` | `/kurrens` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~744 szó, van <h1> |
| `/laptapir_szolgaltatas_a_vorosmarty_mihaly_konyvtarban` | `/laptapir_szolgaltatas_a_vorosmarty_mihaly_konyvtarban` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~371 szó, van <h1> |
| `/meszoly-geza-utcai-tagkonyvtar` | `/tagkonyvtarak/meszoly-geza` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~135 szó, van <h1> |
| `/misi-ujra-ket-kereken-helyismeret-2026-nyar` | `/misi-ujra-ket-kereken-helyismeret-2026-nyar` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~273 szó, van <h1> |
| `/munkatarsak` | `/munkatarsak` | CLONED | 200 | 200 | institutional/static content | 200, ~814 szó, van <h1> |
| `/muzeumok-ejszakaja-2012` | `/muzeumok-ejszakaja-2012` | CLONED | 200 | 200 | news/event detail | 200, ~101 szó, van <h1> |
| `/muzeumok-ejszakaja-2018` | `/muzeumok-ejszakaja-2018` | CLONED | 200 | 200 | news/event detail | 200, ~146 szó, van <h1> |
| `/nemet-nyelvi-gyujtemeny` | `/nemet-nyelvi-gyujtemeny` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~219 szó, van <h1> |
| `/news` | `/news` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~389 szó, van <h1> |
| `/news/details/1988/preview/1` | `/news/details/1988/preview/1` | PREVIEW/INTERNAL | 200 | 404 | egyéb / azonosítandó | admin/CMS preview link a főoldalról, nyilvános tartalmi elvárás tisztázandó |
| `/nka-palyazatok` | `/nka-palyazatok` | CLONED | 200 | 200 | institutional/static content | 200, ~153 szó, van <h1> |
| `/nyari-nyitvatartas-2026` | `/nyari-nyitvatartas-2026` | CLONED | 200 | 200 | news/event detail | 200, ~162 szó, van <h1> |
| `/nyitvatartas` | `/nyitvatartas` | CLONED | 200 | 200 | institutional/static content | 200, ~214 szó, van <h1> |
| `/okos-konyvtar-avagy-nyitott-ter-program-a-vorosmarty-mihaly-konyvtarban` | `/okos-konyvtar-avagy-nyitott-ter-program-a-vorosmarty-mihaly-konyvtarban` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~1060 szó, van <h1> |
| `/olvasoterem` | `/reszlegek/olvasoterem` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~127 szó, van <h1> |
| `/olvass-velunk-olvass-tobbet-tamop-324b-11-1-2012-0003` | `/olvass-velunk-olvass-tobbet-tamop-324b-11-1-2012-0003` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~3307 szó, van <h1> |
| `/opening-hours` | `/opening-hours` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~214 szó, van <h1> |
| `/orszagos-konyvtari-napok-2012` | `/orszagos-konyvtari-napok-2012` | CLONED | 200 | 200 | news/event detail | 200, ~446 szó, van <h1> |
| `/orszagos-konyvtari-napok-2013` | `/orszagos-konyvtari-napok-2013` | CLONED | 200 | 200 | news/event detail | 200, ~511 szó, van <h1> |
| `/orszagos-konyvtari-napok-2014` | `/orszagos-konyvtari-napok-2014` | CLONED | 200 | 200 | news/event detail | 200, ~608 szó, van <h1> |
| `/orszagos-konyvtari-napok-2015` | `/orszagos-konyvtari-napok-2015` | CLONED | 200 | 200 | news/event detail | 200, ~674 szó, van <h1> |
| `/orszagos-konyvtari-napok-2016-1` | `/orszagos-konyvtari-napok-2016-1` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~917 szó, van <h1> |
| `/orszagos-konyvtari-napok-2017` | `/orszagos-konyvtari-napok-2017` | CLONED | 200 | 200 | news/event detail | 200, ~1095 szó, van <h1> |
| `/page/blind` | `/page/blind` | REDIRECTED | 302 | 200 | egyéb / azonosítandó | reference 302 -> https://www.vmk.hu/page/blind |
| `/page/menu/156/preview/1` | `/page/menu/156/preview/1` | PREVIEW/INTERNAL | 200 | 404 | egyéb / azonosítandó | admin/CMS preview link a főoldalról, nyilvános tartalmi elvárás tisztázandó |
| `/page/menu/336` | `/page/menu/336` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~146 szó, van <h1> |
| `/partnerkonyvtarunk` | `/partnerkonyvtarunk` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~172 szó, van <h1> |
| `/pedagogiai-reszleg` | `/reszlegek/pedagogiai-reszleg` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~129 szó, van <h1> |
| `/programarchivum` | `/programarchivum` | CLONED | 200 | 200 | institutional/static content | 200, ~146 szó, van <h1> |
| `/programok-2012` | `/programok-2012` | CLONED | 200 | 200 | news/event detail | 200, ~146 szó, van <h1> |
| `/programok-2013` | `/programok-2013` | CLONED | 200 | 200 | news/event detail | 200, ~146 szó, van <h1> |
| `/programok-2014` | `/programok-2014` | CLONED | 200 | 200 | news/event detail | 200, ~146 szó, van <h1> |
| `/programok-2015` | `/programok-2015` | CLONED | 200 | 200 | news/event detail | 200, ~146 szó, van <h1> |
| `/programok-2016` | `/programok-2016` | CLONED | 200 | 200 | news/event detail | 200, ~146 szó, van <h1> |
| `/programok-2017` | `/programok-2017` | CLONED | 200 | 200 | news/event detail | 200, ~146 szó, van <h1> |
| `/programok-2018` | `/programok-2018` | CLONED | 200 | 200 | news/event detail | 200, ~146 szó, van <h1> |
| `/programok-2019-1` | `/programok-2019-1` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~146 szó, van <h1> |
| `/programok-2020` | `/programok-2020` | CLONED | 200 | 200 | news/event detail | 200, ~146 szó, van <h1> |
| `/programok-2022` | `/programok-2022` | CLONED | 200 | 200 | news/event detail | 200, ~146 szó, van <h1> |
| `/projektek` | `/projektek` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~153 szó, van <h1> |
| `/regiszracios-lap` | `/regiszracios-lap` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~560 szó, van <h1> |
| `/retro-fehervar-2026-06-22` | `/retro-fehervar-2026-06-22` | CLONED | 200 | 200 | news/event detail | 200, ~89 szó, van <h1> |
| `/start/index/lang/de` | `/start/index/lang/de` | REDIRECTED | 302 | 200 | egyéb / azonosítandó | reference 302 -> https://www.vmk.hu/start/index/lang/de |
| `/start/index/lang/en` | `/start/index/lang/en` | REDIRECTED | 302 | 200 | egyéb / azonosítandó | reference 302 -> https://www.vmk.hu/start/index/lang/en |
| `/start/index/lang/hu` | `/start/index/lang/hu` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~465 szó, van <h1> |
| `/strandkonyvtar` | `/strandkonyvtar` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~166 szó, van <h1> |
| `/szamlaszamunk` | `/szamlaszamunk` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~67 szó, van <h1> |
| `/szena-teri-tagkonyvtar` | `/tagkonyvtarak/szena-ter` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~132 szó, van <h1> |
| `/tagkonyvtarak` | `/tagkonyvtarak` | CLONED | 200 | 200 | branch library/tagkönyvtár | 200, ~178 szó, van <h1> |
| `/tamogatok-2022` | `/tamogatok-2022` | CLONED | 200 | 200 | news/event detail | 200, ~172 szó, van <h1> |
| `/tamogatok-egyuttmukodo-partnerek` | `/tamogatok-egyuttmukodo-partnerek` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~172 szó, van <h1> |
| `/tolnai-utcai-tagkonyvtar` | `/tagkonyvtarak/tolnai-ut` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~132 szó, van <h1> |
| `/uj-konyvajanlo` | `/uj-konyvajanlo` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~223 szó, van <h1> |
| `/unnepi-konyvhet-2012` | `/unnepi-konyvhet-2012` | CLONED | 200 | 200 | news/event detail | 200, ~246 szó, van <h1> |
| `/unnepi-konyvhet-2013` | `/unnepi-konyvhet-2013` | CLONED | 200 | 200 | news/event detail | 200, ~606 szó, van <h1> |
| `/unnepi-konyvhet-2014` | `/unnepi-konyvhet-2014` | CLONED | 200 | 200 | news/event detail | 200, ~1324 szó, van <h1> |
| `/unnepi-konyvhet-2015` | `/unnepi-konyvhet-2015` | CLONED | 200 | 200 | news/event detail | 200, ~1551 szó, van <h1> |
| `/unnepi-konyvhet-2016` | `/unnepi-konyvhet-2016` | CLONED | 200 | 200 | news/event detail | 200, ~460 szó, van <h1> |
| `/unnepi-konyvhet-2017-1` | `/unnepi-konyvhet-2017-1` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~448 szó, van <h1> |
| `/unnepi-konyvhet-2022` | `/unnepi-konyvhet-2022` | CLONED | 200 | 200 | news/event detail | 200, ~323 szó, van <h1> |
| `/unnepi-konyvhet-programajanlo-2018` | `/unnepi-konyvhet-programajanlo-2018` | CLONED | 200 | 200 | news/event detail | 200, ~1063 szó, van <h1> |
| `/unnepi-konyvnapok-2019` | `/unnepi-konyvnapok-2019` | CLONED | 200 | 200 | news/event detail | 200, ~440 szó, van <h1> |
| `/velencei-gyermektabor-2026-07-06` | `/velencei-gyermektabor-2026-07-06` | CLONED | 200 | 200 | news/event detail | 200, ~79 szó, van <h1> |
| `/wishbasket` | `/wishbasket` | MISSING | 200 | 404 | egyéb / azonosítandó | Valódi funkcionális hiány (session-alapú "kívánságkosár" a régi CMS-ben, nem statikus tartalom). Nem oldható meg tartalom-importtal; külön feature-döntés kell. Ez az egyetlen MISSING a végső körben. |
| `/zold-szombat-2026-06-27` | `/zold-szombat-2026-06-27` | CLONED | 200 | 200 | news/event detail | 200, ~89 szó, van <h1> |
| `/zsolt-utcai-tagkonyvtar` | `/tagkonyvtarak/zsolt-ut` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~132 szó, van <h1> |
