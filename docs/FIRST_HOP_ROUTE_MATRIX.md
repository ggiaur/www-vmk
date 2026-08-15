# First-hop route-parity mátrix

Generálva: 2026-08-15T20:43:13.615Z

Forrás: `.visual-oracle/route-manifest.json` (113 same-host first-hop route, `npm run visual:oracle:discover`), összevetve a referenciával (`https://www.vmk.hu`) és a lokális klónnal (`http://localhost:3011`, `tools/visual-oracle.config.json` `routeOverrides` alkalmazva).

> A `localhost:3001` ezen a gépen egy másik projekt (`webarchivum`) szervere -- ezért 3011-en mértem (`--local-url=http://localhost:3011/`). Lásd COLLAB.md nyitott pontjai.

**Módszertan:** a `CLONED` besoroláshoz a local válasz 200, és a látható szöveg/heading jelenlétét is ellenőriztem (0 gyanúsan üres/generic 200-as oldalt találtam a jelenlegi listában). A `MISSING` tisztán ténybeli (local 404) -- **nem** döntöttem egyetlen route ARCHIVED/LEGACY besorolásáról sem, mert ez tartalmi/termékdöntés, nem infrastrukturális tény. Lásd lent egy durva, automatikus dátum-heurisztikát segítségnek A2-höz.

## Összesítés

| Státusz | Darab |
|---|---|
| MISSING | 69 |
| CLONED | 42 |
| PREVIEW/INTERNAL | 2 |

## MISSING triázs-segédlet A2-höz (heurisztika, nem végleges döntés)

A 69 MISSING route-ból a slugban szereplő évszám alapján durván szétválasztva:

- **29 db, 2010-2024 közötti évszámmal a slugban** -- valószínű ARCHIVED/LEGACY jelölt (régi, lezárt események/programok archívuma), de a végső döntés termékkérdés.
- **40 db, friss (2025/2026) dátummal vagy dátum nélküli, funkcionálisnak tűnő** -- ezek magasabb prioritásúak lehetnek valódi tartalmi/funkcionális hiányként:

  - `/2026_08_12_netrevalok`
  - `/20260806_zummogj_velunk_szena`
  - `/a-jaki-templomok-es-temetoik-2026-08-19`
  - `/a-konyvtar-hasznalata`
  - `/adatbazisok-1`
  - `/arato-antal-emlekere`
  - `/bartok-teri-olvasokor-2026-05-19`
  - `/bartok-teri-olvasokor-2026-07-14`
  - `/beiratkozott-olvasoinknak`
  - `/bregyo-tabor-2026-07-06`
  - `/bregyo-tabor-2026-07-13`
  - `/csendes-olvasas-a-szabadban-szena-2026-augusztustol`
  - `/egy-szal-fonal-tuske-csilla-amigurumi-kiallitasa-2026-07-01`
  - `/events`
  - `/folyoiratok-a-tagkonyvtarakban`
  - `/gateway-uk-m`
  - `/helyben-hasznalhato-adatbazisok`
  - `/herman-otto-emlekev`
  - `/husolo-es-olvasosarok-2026`
  - `/iskolai-kozossegi-szolgalat`
  - `/karacsonyi-iropalyazat-2025-irasok`
  - `/konyvtaraknak`
  - `/konyvtarkozi-kolcsonzes`
  - `/kozponti-konyvtar-1`
  - `/kreativ-otletek-levendulabol-20260625`
  - `/kurrens`
  - `/misi-ujra-ket-kereken-helyismeret-2026-nyar`
  - `/nemet-nyelvi-gyujtemeny`
  - `/news`
  - `/page/blind`
  - `/regiszracios-lap`
  - `/retro-fehervar-2026-06-22`
  - `/start/index/lang/de`
  - `/start/index/lang/en`
  - `/start/index/lang/hu`
  - `/szamlaszamunk`
  - `/uj-konyvajanlo`
  - `/velencei-gyermektabor-2026-07-06`
  - `/wishbasket`
  - `/zold-szombat-2026-06-27`

## Részletes mátrix

| Reference URL | Clone URL | Státusz | Ref HTTP | Local HTTP | Oldalcsalád | Megjegyzés |
|---|---|---|---|---|---|---|
| `/` | `/` | CLONED | 200 | 200 | home | 200, ~481 szó, van <h1> |
| `/2026_08_12_netrevalok` | `/2026_08_12_netrevalok` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/2026_08_12_netrevalok) |
| `/20260602_tarsasjatek_kolcsonzes` | `/20260602_tarsasjatek_kolcsonzes` | CLONED | 200 | 200 | news/event detail | 200, ~162 szó, van <h1> |
| `/202608_spiro-80-kiallitas-szena` | `/202608_spiro-80-kiallitas-szena` | CLONED | 200 | 200 | news/event detail | 200, ~166 szó, van <h1> |
| `/20260806_zummogj_velunk_szena` | `/20260806_zummogj_velunk_szena` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/20260806_zummogj_velunk_szena) |
| `/20260824_megvaltozott_nyitvatartas_zene_ped` | `/20260824_megvaltozott_nyitvatartas_zene_ped` | CLONED | 200 | 200 | news/event detail | 200, ~168 szó, van <h1> |
| `/a-jaki-templomok-es-temetoik-2026-08-19` | `/a-jaki-templomok-es-temetoik-2026-08-19` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/a-jaki-templomok-es-temetoik-2026-08-19) |
| `/a-konyvtar-hasznalata` | `/a-konyvtar-hasznalata` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/a-konyvtar-hasznalata) |
| `/adatbazisok-1` | `/adatbazisok-1` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/adatbazisok-1) |
| `/ado-1` | `/ado-1` | CLONED | 200 | 200 | institutional/static content | 200, ~156 szó, van <h1> |
| `/alapdokumentumok` | `/dokumentumok` | CLONED | 200 | 200 | institutional/static content | 200, ~392 szó, van <h1> |
| `/allaspalyazatok` | `/allaspalyazatok` | CLONED | 200 | 200 | institutional/static content | 200, ~132 szó, van <h1> |
| `/arato-antal-emlekere` | `/arato-antal-emlekere` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/arato-antal-emlekere) |
| `/bartok-teri-olvasokor-2026-05-19` | `/bartok-teri-olvasokor-2026-05-19` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/bartok-teri-olvasokor-2026-05-19) |
| `/bartok-teri-olvasokor-2026-07-14` | `/bartok-teri-olvasokor-2026-07-14` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/bartok-teri-olvasokor-2026-07-14) |
| `/beiratkozott-olvasoinknak` | `/beiratkozott-olvasoinknak` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/beiratkozott-olvasoinknak) |
| `/bregyo-tabor-2026-07-06` | `/bregyo-tabor-2026-07-06` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/bregyo-tabor-2026-07-06) |
| `/bregyo-tabor-2026-07-13` | `/bregyo-tabor-2026-07-13` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/bregyo-tabor-2026-07-13) |
| `/budai-uti-tagkonyvtar` | `/tagkonyvtarak/budai-ut` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~135 szó, van <h1> |
| `/csaladi-olvasasmania-2026` | `/csaladi-olvasasmania-2026` | CLONED | 200 | 200 | news/event detail | 200, ~252 szó, van <h1> |
| `/csendes-olvasas-a-szabadban-szena-2026-augusztustol` | `/csendes-olvasas-a-szabadban-szena-2026-augusztustol` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/csendes-olvasas-a-szabadban-szena-2026-augusztustol) |
| `/egy-szal-fonal-tuske-csilla-amigurumi-kiallitasa-2026-07-01` | `/egy-szal-fonal-tuske-csilla-amigurumi-kiallitasa-2026-07-01` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/egy-szal-fonal-tuske-csilla-amigurumi-kiallitasa-2026-07-01) |
| `/egyuttmukodo-partnereink` | `/egyuttmukodo-partnereink` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~172 szó, van <h1> |
| `/egyuttmukodo-partnerek-2022` | `/egyuttmukodo-partnerek-2022` | CLONED | 200 | 200 | news/event detail | 200, ~172 szó, van <h1> |
| `/elerhetosegeink` | `/kapcsolat` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~380 szó, van <h1> |
| `/events` | `/events` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/events) |
| `/felnott-kolcsonzo-reszleg` | `/reszlegek/felnott-kolcsonzo` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~130 szó, van <h1> |
| `/foglalkozaskereso` | `/foglalkozaskereso` | CLONED | 200 | 200 | institutional/static content | 200, ~138 szó, van <h1> |
| `/folyoiratok-a-tagkonyvtarakban` | `/folyoiratok-a-tagkonyvtarakban` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/folyoiratok-a-tagkonyvtarakban) |
| `/gallery` | `/galeria` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~393 szó, van <h1> |
| `/gateway-uk-m` | `/gateway-uk-m` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/gateway-uk-m) |
| `/helyben-hasznalhato-adatbazisok` | `/helyben-hasznalhato-adatbazisok` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/helyben-hasznalhato-adatbazisok) |
| `/herman-otto-emlekev` | `/herman-otto-emlekev` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/herman-otto-emlekev) |
| `/holokauszt-emlekev-2014` | `/holokauszt-emlekev-2014` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/holokauszt-emlekev-2014) |
| `/husolo-es-olvasosarok-2026` | `/husolo-es-olvasosarok-2026` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/husolo-es-olvasosarok-2026) |
| `/iskolai-kozossegi-szolgalat` | `/iskolai-kozossegi-szolgalat` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/iskolai-kozossegi-szolgalat) |
| `/karacsonyi-iropalyazat-2025-irasok` | `/karacsonyi-iropalyazat-2025-irasok` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/karacsonyi-iropalyazat-2025-irasok) |
| `/konyvtaraknak` | `/konyvtaraknak` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/konyvtaraknak) |
| `/konyvtarkozi-kolcsonzes` | `/konyvtarkozi-kolcsonzes` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/konyvtarkozi-kolcsonzes) |
| `/konyvtarunk-rovid-tortenete` | `/konyvtarunk-rovid-tortenete` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~199 szó, van <h1> |
| `/konyvtarunkrol` | `/konyvtarunkrol` | CLONED | 200 | 200 | institutional/static content | 200, ~199 szó, van <h1> |
| `/kortars-muveszeti-fesztival-2012` | `/kortars-muveszeti-fesztival-2012` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/kortars-muveszeti-fesztival-2012) |
| `/kortars-muveszeti-fesztival-2017` | `/kortars-muveszeti-fesztival-2017` | CLONED | 200 | 200 | news/event detail | 200, ~199 szó, van <h1> |
| `/koteszet` | `/koteszet` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~127 szó, van <h1> |
| `/kozerdeku-adatok` | `/kozerdeku-adatok` | CLONED | 200 | 200 | institutional/static content | 200, ~175 szó, van <h1> |
| `/kozponti-konyvtar-1` | `/reszlegek/kozponti-konyvtar` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/reszlegek/kozponti-konyvtar) **[A referencián önálló "Központi könyvtár" részleg-oldal (nem azonos a /konyvtarunkrol "Rólunk" oldallal). A klónban a /reszlegek/ listában nincs neki megfelelő bejegyzés egyetlen slug alatt sem -- ténylegesen hiányzó tartalom, nem route-mapping hiba.]** |
| `/kreativ-otletek-levendulabol-20260625` | `/kreativ-otletek-levendulabol-20260625` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/kreativ-otletek-levendulabol-20260625) |
| `/kurrens` | `/kurrens` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/kurrens) |
| `/laptapir_szolgaltatas_a_vorosmarty_mihaly_konyvtarban` | `/laptapir_szolgaltatas_a_vorosmarty_mihaly_konyvtarban` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~371 szó, van <h1> |
| `/meszoly-geza-utcai-tagkonyvtar` | `/tagkonyvtarak/meszoly-geza` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~135 szó, van <h1> |
| `/misi-ujra-ket-kereken-helyismeret-2026-nyar` | `/misi-ujra-ket-kereken-helyismeret-2026-nyar` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/misi-ujra-ket-kereken-helyismeret-2026-nyar) |
| `/munkatarsak` | `/munkatarsak` | CLONED | 200 | 200 | institutional/static content | 200, ~814 szó, van <h1> |
| `/muzeumok-ejszakaja-2012` | `/muzeumok-ejszakaja-2012` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/muzeumok-ejszakaja-2012) |
| `/muzeumok-ejszakaja-2018` | `/muzeumok-ejszakaja-2018` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/muzeumok-ejszakaja-2018) |
| `/nemet-nyelvi-gyujtemeny` | `/nemet-nyelvi-gyujtemeny` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/nemet-nyelvi-gyujtemeny) |
| `/news` | `/news` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/news) |
| `/news/details/1988/preview/1` | `/news/details/1988/preview/1` | PREVIEW/INTERNAL | 200 | 404 | egyéb / azonosítandó | admin/CMS preview link a főoldalról, nyilvános tartalmi elvárás tisztázandó |
| `/nka-palyazatok` | `/nka-palyazatok` | CLONED | 200 | 200 | institutional/static content | 200, ~153 szó, van <h1> |
| `/nyari-nyitvatartas-2026` | `/nyari-nyitvatartas-2026` | CLONED | 200 | 200 | news/event detail | 200, ~155 szó, van <h1> |
| `/nyitvatartas` | `/nyitvatartas` | CLONED | 200 | 200 | institutional/static content | 200, ~214 szó, van <h1> |
| `/okos-konyvtar-avagy-nyitott-ter-program-a-vorosmarty-mihaly-konyvtarban` | `/okos-konyvtar-avagy-nyitott-ter-program-a-vorosmarty-mihaly-konyvtarban` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~1060 szó, van <h1> |
| `/olvasoterem` | `/reszlegek/olvasoterem` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~127 szó, van <h1> |
| `/olvass-velunk-olvass-tobbet-tamop-324b-11-1-2012-0003` | `/olvass-velunk-olvass-tobbet-tamop-324b-11-1-2012-0003` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/olvass-velunk-olvass-tobbet-tamop-324b-11-1-2012-0003) |
| `/opening-hours` | `/opening-hours` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~214 szó, van <h1> |
| `/orszagos-konyvtari-napok-2012` | `/orszagos-konyvtari-napok-2012` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/orszagos-konyvtari-napok-2012) |
| `/orszagos-konyvtari-napok-2013` | `/orszagos-konyvtari-napok-2013` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/orszagos-konyvtari-napok-2013) |
| `/orszagos-konyvtari-napok-2014` | `/orszagos-konyvtari-napok-2014` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/orszagos-konyvtari-napok-2014) |
| `/orszagos-konyvtari-napok-2015` | `/orszagos-konyvtari-napok-2015` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/orszagos-konyvtari-napok-2015) |
| `/orszagos-konyvtari-napok-2016-1` | `/orszagos-konyvtari-napok-2016-1` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/orszagos-konyvtari-napok-2016-1) |
| `/orszagos-konyvtari-napok-2017` | `/orszagos-konyvtari-napok-2017` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/orszagos-konyvtari-napok-2017) |
| `/page/blind` | `/page/blind` | MISSING | 302 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/page/blind) |
| `/page/menu/156/preview/1` | `/page/menu/156/preview/1` | PREVIEW/INTERNAL | 200 | 404 | egyéb / azonosítandó | admin/CMS preview link a főoldalról, nyilvános tartalmi elvárás tisztázandó |
| `/page/menu/336` | `/page/menu/336` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~146 szó, van <h1> |
| `/partnerkonyvtarunk` | `/partnerkonyvtarunk` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~172 szó, van <h1> |
| `/pedagogiai-reszleg` | `/reszlegek/pedagogiai-reszleg` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~129 szó, van <h1> **[A local /pedagogiai-reszleg 308-cal /reszlegek/pedagogia-ra irányít, ami 404 -- ez egy valódi, hibás redirect-cél a klónban (nem csak Oracle-config hiba, javításra vár A2-ben). A tényleges oldal /reszlegek/pedagogiai-reszleg alatt létezik és jó.]** |
| `/programarchivum` | `/programarchivum` | CLONED | 200 | 200 | institutional/static content | 200, ~146 szó, van <h1> |
| `/programok-2012` | `/programok-2012` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/programok-2012) |
| `/programok-2013` | `/programok-2013` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/programok-2013) |
| `/programok-2014` | `/programok-2014` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/programok-2014) |
| `/programok-2015` | `/programok-2015` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/programok-2015) |
| `/programok-2016` | `/programok-2016` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/programok-2016) |
| `/programok-2017` | `/programok-2017` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/programok-2017) |
| `/programok-2018` | `/programok-2018` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/programok-2018) |
| `/programok-2019-1` | `/programok-2019-1` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/programok-2019-1) |
| `/programok-2020` | `/programok-2020` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/programok-2020) |
| `/programok-2022` | `/programok-2022` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/programok-2022) |
| `/projektek` | `/projektek` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~153 szó, van <h1> |
| `/regiszracios-lap` | `/regiszracios-lap` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/regiszracios-lap) |
| `/retro-fehervar-2026-06-22` | `/retro-fehervar-2026-06-22` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/retro-fehervar-2026-06-22) |
| `/start/index/lang/de` | `/start/index/lang/de` | MISSING | 302 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/start/index/lang/de) |
| `/start/index/lang/en` | `/start/index/lang/en` | MISSING | 302 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/start/index/lang/en) |
| `/start/index/lang/hu` | `/start/index/lang/hu` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/start/index/lang/hu) |
| `/strandkonyvtar` | `/strandkonyvtar` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~170 szó, van <h1> |
| `/szamlaszamunk` | `/szamlaszamunk` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/szamlaszamunk) |
| `/szena-teri-tagkonyvtar` | `/tagkonyvtarak/szena-ter` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~132 szó, van <h1> |
| `/tagkonyvtarak` | `/tagkonyvtarak` | CLONED | 200 | 200 | branch library/tagkönyvtár | 200, ~178 szó, van <h1> |
| `/tamogatok-2022` | `/tamogatok-2022` | CLONED | 200 | 200 | news/event detail | 200, ~172 szó, van <h1> |
| `/tamogatok-egyuttmukodo-partnerek` | `/tamogatok-egyuttmukodo-partnerek` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~172 szó, van <h1> |
| `/tolnai-utcai-tagkonyvtar` | `/tagkonyvtarak/tolnai-ut` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~132 szó, van <h1> |
| `/uj-konyvajanlo` | `/uj-konyvajanlo` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/uj-konyvajanlo) |
| `/unnepi-konyvhet-2012` | `/unnepi-konyvhet-2012` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/unnepi-konyvhet-2012) |
| `/unnepi-konyvhet-2013` | `/unnepi-konyvhet-2013` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/unnepi-konyvhet-2013) |
| `/unnepi-konyvhet-2014` | `/unnepi-konyvhet-2014` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/unnepi-konyvhet-2014) |
| `/unnepi-konyvhet-2015` | `/unnepi-konyvhet-2015` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/unnepi-konyvhet-2015) |
| `/unnepi-konyvhet-2016` | `/unnepi-konyvhet-2016` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/unnepi-konyvhet-2016) |
| `/unnepi-konyvhet-2017-1` | `/unnepi-konyvhet-2017-1` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/unnepi-konyvhet-2017-1) |
| `/unnepi-konyvhet-2022` | `/unnepi-konyvhet-2022` | CLONED | 200 | 200 | news/event detail | 200, ~323 szó, van <h1> |
| `/unnepi-konyvhet-programajanlo-2018` | `/unnepi-konyvhet-programajanlo-2018` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/unnepi-konyvhet-programajanlo-2018) |
| `/unnepi-konyvnapok-2019` | `/unnepi-konyvnapok-2019` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/unnepi-konyvnapok-2019) |
| `/velencei-gyermektabor-2026-07-06` | `/velencei-gyermektabor-2026-07-06` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/velencei-gyermektabor-2026-07-06) |
| `/wishbasket` | `/wishbasket` | MISSING | 200 | 404 | egyéb / azonosítandó | local 404 (http://localhost:3011/wishbasket) |
| `/zold-szombat-2026-06-27` | `/zold-szombat-2026-06-27` | MISSING | 200 | 404 | news/event detail | local 404 (http://localhost:3011/zold-szombat-2026-06-27) |
| `/zsolt-utcai-tagkonyvtar` | `/tagkonyvtarak/zsolt-ut` | CLONED | 200 | 200 | egyéb / azonosítandó | 200, ~132 szó, van <h1> |
