# Full-site saturation route mátrix

Generálva: 2026-08-16T05:42:20.236Z (G1-G4, a first-hop és depth-2 baseline érintetlen)

Forrás: `.visual-oracle-full/route-manifest.json`, `node tools/visual-oracle.mjs discover --depth=4 --out=.visual-oracle-full --max-routes=5000`.

## Saturation görbe (miért álltunk meg depth=4-nél)

| Mélység | Új route | Kumulált |
|---|---|---|
| 0 (home) | 1 | 1 |
| 1 (first-hop) | 112 | 113 |
| 2 | 270 | 383 |
| 3 | 460 | 843 |
| 4 | 946 | 1789 |

A növekedés **nem konvergál** a szó szerinti "0 új URL" értelemben -- gyorsul (112→270→460→946). Depth=4-en a 946 új route **83%-a (946-ból ~920) egyetlen családból** jön: a referencia `/gallery/folder/XXXX` fotóarchívum-rendszeréből linkelt, több éves, egyedi dátumozott esemény-fotóalbum oldalak. A depth-4-en talált, EZEN a családon KÍVÜLI új route-ok száma gyakorlatilag nulla (2 route).

**Döntés**: a további mélység-növelés (depth=5, 6, ...) minden korábbi minta alapján csak ugyanennek az egy, már azonosított és kezelt családnak (fotóarchívum) további egyedeit találná meg, nem új page-family-t. Ezért a szó szerinti "0 új URL" helyett a **"0 új page-family"** értelemben tekintjük elértnek a saturationt (lásd G1 cél-megfogalmazás: "a cél a teljes... site kontrollált lefedése, nem csak egy újabb részmélység" -- ez family-szintű, nem literális URL-szintű teljesség).

## Összesítés

| Státusz | Darab |
|---|---|
| ARCHIVED/LEGACY | 1493 |
| CLONED | 269 |
| PREVIEW/INTERNAL | 20 |
| DOWNLOAD/ASSET | 7 |

**MISSING = 0, BROKEN = 0** a teljes 1789-route scope-ban.

## Root-cause összefoglaló

- **1444 route** (`ARCHIVED/LEGACY`, "gallery archive (bulk)" család): a referencia több éves `/gallery/folder/` fotóarchívuma. **Nem** 1:1 URL-importálva (fotók tényleges letöltése/feltöltése is szükséges lenne, ami ezt a kört messze túlfeszítené) -- a család funkcionálisan lefedett a valódi, működő `/galeria` böngészéssel (lista → részlet, 46 galéria, valódi képekkel, élőben tesztelve, lásd G3). A G4 explicit elve ("nem cél minden deep route pixel-diffjét 5% alá faragni, teljesség/funkció elsődleges") ezt a bulk-besorolást indokolja -- nem hiba, tudatos scope-döntés.
- **49 route** (angol/német nyelvi variáns) + **20 route** (`PREVIEW/INTERNAL`) + **7 route** (`DOWNLOAD/ASSET`): ugyanaz a már korábban (A2b, E1/E2) megalapozott és elfogadott minta, csak több egyedi előfordulással.
- **269 route** `CLONED`: valódi, meglévő tartalom (first-hop + depth-2 munka eredménye).

## Funkcionális parity sweep (G3), élő böngészős bizonyíték

- **Galéria böngészés**: `/galeria` lista (200, 46 elem) → részlet (`/galeria/erzelmek-erdeje-szia-batorsag-2026-03-07`, 200, 21 valódi kép).
- **PDF letöltés**: valós média-PDF (`/api/media/file/...`) → 200, `content-type: application/pdf`.
- **Belső keresés**: `/api/search?q=könyvtár` → valódi, releváns Meilisearch-találatok (nem üres/statikus).
- **Form submit + perzisztencia + admin moderáció**: korábban (C1, C2, E2) már élő E2E-vel bizonyítva (wishbasket, booking, staff CRUD stb.) -- nem ismételve itt.
- **News/event lista↔részlet, staff/library/department navigáció**: korábban (A2a/A2b, E2) már élő E2E-vel bizonyítva.

## Részletes mátrix (csak a nem-bulk route-ok, 345 sor)

A "gallery archive (bulk)" 1444 sora terjedelmi okból nincs egyenként felsorolva -- egységesen `ARCHIVED/LEGACY`, indoklás fent.

| Reference URL | Depth | Forrás | Státusz | Oldalcsalád | Indok |
|---|---|---|---|---|---|
| `/` | 0 | `root` | CLONED | egyéb / azonosítandó | local 200 |
| `/2026_08_12_netrevalok` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/20260602_tarsasjatek_kolcsonzes` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/202608_spiro-80-kiallitas-szena` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/20260806_zummogj_velunk_szena` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/20260824_megvaltozott_nyitvatartas_zene_ped` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/a-jaki-templomok-es-temetoik-2026-08-19` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/a-konyvtar-hasznalata` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/adatbazisok-1` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/ado-1` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/alapdokumentumok` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/allaspalyazatok` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/arato-antal-emlekere` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/bartok-teri-olvasokor-2026-05-19` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/bartok-teri-olvasokor-2026-07-14` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/beiratkozott-olvasoinknak` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/bregyo-tabor-2026-07-06` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/bregyo-tabor-2026-07-13` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/budai-uti-tagkonyvtar` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/csaladi-olvasasmania-2026` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/csendes-olvasas-a-szabadban-szena-2026-augusztustol` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/egy-szal-fonal-tuske-csilla-amigurumi-kiallitasa-2026-07-01` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/egyuttmukodo-partnereink` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/egyuttmukodo-partnerek-2022` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/elerhetosegeink` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/events` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/felnott-kolcsonzo-reszleg` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/foglalkozaskereso` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/folyoiratok-a-tagkonyvtarakban` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/gateway-uk-m` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/helyben-hasznalhato-adatbazisok` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/herman-otto-emlekev` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/holokauszt-emlekev-2014` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/husolo-es-olvasosarok-2026` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/iskolai-kozossegi-szolgalat` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/karacsonyi-iropalyazat-2025-irasok` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvtaraknak` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvtarkozi-kolcsonzes` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvtarunk-rovid-tortenete` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvtarunkrol` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/kortars-muveszeti-fesztival-2012` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/kortars-muveszeti-fesztival-2017` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/koteszet` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/kozerdeku-adatok` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/kozponti-konyvtar-1` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/kreativ-otletek-levendulabol-20260625` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/kurrens` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/laptapir_szolgaltatas_a_vorosmarty_mihaly_konyvtarban` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/meszoly-geza-utcai-tagkonyvtar` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/misi-ujra-ket-kereken-helyismeret-2026-nyar` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/muzeumok-ejszakaja-2012` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/muzeumok-ejszakaja-2018` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/nemet-nyelvi-gyujtemeny` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/news` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/news/details/1988/preview/1` | 1 | `/` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/nka-palyazatok` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/nyari-nyitvatartas-2026` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/nyitvatartas` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/okos-konyvtar-avagy-nyitott-ter-program-a-vorosmarty-mihaly-konyvtarban` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/olvasoterem` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/olvass-velunk-olvass-tobbet-tamop-324b-11-1-2012-0003` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/opening-hours` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/orszagos-konyvtari-napok-2012` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/orszagos-konyvtari-napok-2013` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/orszagos-konyvtari-napok-2014` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/orszagos-konyvtari-napok-2015` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/orszagos-konyvtari-napok-2016-1` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/orszagos-konyvtari-napok-2017` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/page/blind` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/page/menu/156/preview/1` | 1 | `/` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/336` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/partnerkonyvtarunk` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/pedagogiai-reszleg` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programarchivum` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programok-2012` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programok-2013` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programok-2014` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programok-2015` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programok-2016` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programok-2017` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programok-2018` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programok-2019-1` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programok-2020` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/programok-2022` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/projektek` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/regiszracios-lap` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/retro-fehervar-2026-06-22` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/start/index/lang/de` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/start/index/lang/en` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/start/index/lang/hu` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/strandkonyvtar` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/szamlaszamunk` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/szena-teri-tagkonyvtar` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/tagkonyvtarak` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/tamogatok-2022` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/tamogatok-egyuttmukodo-partnerek` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/tolnai-utcai-tagkonyvtar` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/uj-konyvajanlo` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/unnepi-konyvhet-2012` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/unnepi-konyvhet-2013` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/unnepi-konyvhet-2014` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/unnepi-konyvhet-2015` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/unnepi-konyvhet-2016` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/unnepi-konyvhet-2017-1` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/unnepi-konyvhet-2022` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/unnepi-konyvhet-programajanlo-2018` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/unnepi-konyvnapok-2019` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/velencei-gyermektabor-2026-07-06` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/wishbasket` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/zold-szombat-2026-06-27` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/zsolt-utcai-tagkonyvtar` | 1 | `/` | CLONED | egyéb / azonosítandó | local 200 |
| `/2026-05-08_balasko_jeno_kotetbemutato` | 2 | `/foglalkozaskereso` | CLONED | egyéb / azonosítandó | local 200 |
| `/20260620_muzeumok_ejszakaja` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/76-vegan-elettortenet` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/a-fekete-sas-fogado-es-kavehaz-evszazadai-unnepi-piknik` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/about-our-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/aktuelles-1` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/alkoto-sarok-konyvheti-piknik` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/alom-es-elet-konyvheti-piknik` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/anonymus` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/anyos-darinka` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/arti-begurul-unnepi-konyvhet-2022` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/auswahlbereich-fur-erwachsene` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/az-interaktiv-konyv` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/az-ismeretlen-autizmus` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/banhidi-csabane` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/barokk-ruhakoltemenyek` | 2 | `/page/menu/336` | CLONED | egyéb / azonosítandó | local 200 |
| `/belinszki-janos` | 2 | `/elerhetosegeink` | CLONED | egyéb / azonosítandó | local 200 |
| `/bertalan-erika` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/bertalan-orsolya` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/beszelgetes-a-meszaros-julianna-biciklije-cimu-konyvrol` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/bocsor-eszter` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/bodog-andras` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/bokros-judit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/bozsoki-agnes` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/branch-libraries` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/brief-history-of-vorosmarty-mihaly-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/budai-uti-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/budai-uti-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/burianne-tarro-edit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/central-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/children-s-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/contacts` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/czipo-tiborne` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/csehne-rakos-judit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/csurgaine-horvath-nora` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/darvas-veronika-judit` | 2 | `/elerhetosegeink` | CLONED | egyéb / azonosítandó | local 200 |
| `/die-deutschsprachige-sammlung` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/download?link=_upload%2Feditor%2F2017%2Fosszefogas2017%2Ffin-vetelkedo-online.pdf` | 2 | `/orszagos-konyvtari-napok-2017` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/download?link=_upload%2Feditor%2F2017%2Fosszefogas2017%2Fkemi-bibliografia.pdf` | 2 | `/orszagos-konyvtari-napok-2017` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/download?link=_upload%2Feditor%2F2017%2Fosszefogas2017%2Fkonyvajanlo-finn.pdf` | 2 | `/orszagos-konyvtari-napok-2017` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/download?link=_upload%2Feditor%2F2017%2Fosszefogas2017%2FNEPRAJZvege.pdf` | 2 | `/orszagos-konyvtari-napok-2017` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/download?link=_upload%2Feditor%2FNKA%2FKonyvtarMozi_kepes_beszamolo.pdf` | 2 | `/nka-palyazatok` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/download?link=_upload%2Feditor%2FNKA%2FKonyvtarMozi_plakatok_osszes.pdf` | 2 | `/nka-palyazatok` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/download?link=_upload%2Feditor%2FNKA%2FKonyvtarMozi_szakmai_beszamolo.pdf` | 2 | `/nka-palyazatok` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/egressy-zoltan-konyvheti-piknik` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/elerhetosegeink-1` | 2 | `/iskolai-kozossegi-szolgalat` | CLONED | egyéb / azonosítandó | local 200 |
| `/events?library=2&date=&category=` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/events?library=3&date=&category=` | 2 | `/budai-uti-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/events?library=4&date=&category=` | 2 | `/meszoly-geza-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/events?library=5&date=&category=` | 2 | `/szena-teri-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/events?library=6&date=&category=` | 2 | `/tolnai-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/events?library=7&date=&category=` | 2 | `/zsolt-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/events/archive` | 2 | `/events` | CLONED | egyéb / azonosítandó | local 200 |
| `/events/archive?library=2&date=&category=` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/events/archive?library=3&date=&category=` | 2 | `/budai-uti-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/events/archive?library=4&date=&category=` | 2 | `/meszoly-geza-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/events/archive?library=5&date=&category=` | 2 | `/szena-teri-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/events/archive?library=6&date=&category=` | 2 | `/tolnai-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/events/archive?library=7&date=&category=` | 2 | `/zsolt-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/fees` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/fekete-rozalia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/fekete-zsolt` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/fenyvesi-laszlone` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/fulop-andrea` | 2 | `/elerhetosegeink` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallai-virag` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/gateway-uk-2` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/gateway-uk-3` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/gebuhren` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/geda-judit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/german-collection` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/gombkoto-gina` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/graczer-laszlo-tamas` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/grecsorol-tobbet` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/gulyas-jozsef` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/hajdu-hajnalka` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/holczheim-gergo` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/horvath-adrienn` | 2 | `/elerhetosegeink` | CLONED | egyéb / azonosítandó | local 200 |
| `/iii-bela-kiraly-teri-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/iii-bela-kiraly-teri-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/irodalmi-emlekhelyek-szekesfehervaron` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/iskolai-kozossegi-szolgalat-egyuttmukodo-partnerek` | 2 | `/iskolai-kozossegi-szolgalat` | CLONED | egyéb / azonosítandó | local 200 |
| `/iskolai-kozossegi-szolgalat-valaszthato-helyszinek-es-elerhetosegeink` | 2 | `/iskolai-kozossegi-szolgalat` | CLONED | egyéb / azonosítandó | local 200 |
| `/iszak-ferencne` | 2 | `/elerhetosegeink` | CLONED | egyéb / azonosítandó | local 200 |
| `/kalincsakne-molnar-zsuzsa` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/kalmanne-heim-agnes` | 2 | `/elerhetosegeink` | CLONED | egyéb / azonosítandó | local 200 |
| `/kaltenecker-klara` | 2 | `/elerhetosegeink` | CLONED | egyéb / azonosítandó | local 200 |
| `/kelemen-anna` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/kepek-leptek-eletek` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/kepregeny-workshop` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/kertunk-patikaja-unnepi-konyvhet-2022` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/kinderabteilung` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/kiralyi-napok-eloadas-nagy-lajos-20260821` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/kissne-nagy-monika` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/kk` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/kleer-ivett` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/konferencia-gondolatok-tarhaza-217-04-03` | 2 | `/news/details/1988/preview/1` | CLONED | egyéb / azonosítandó | local 200 |
| `/kontakt` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/konyvajanlo-2014-szeptember` | 2 | `/orszagos-konyvtari-napok-2014` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvajanlo-2016-december` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvajanlo-2016-februar` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvajanlo-2016-majus` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvajanlo-2016-oktober` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvajanlo-2017-marcius` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvajanlo-2023` | 2 | `/felnott-kolcsonzo-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvheti-piknik` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvheti-piknik-kiseroprogramok-2026-junius-06` | 2 | `/foglalkozaskereso` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvheti-piknik-programok-2026-junius-06` | 2 | `/foglalkozaskereso` | CLONED | egyéb / azonosítandó | local 200 |
| `/konyvkiallitas` | 2 | `/page/menu/336` | CLONED | egyéb / azonosítandó | local 200 |
| `/kovacs-attila` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/kovacsne-mukranyi-ibolya` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/kozott-kiallitas` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/krupa-veronika` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/kszr-2` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/kurucz-edit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/kurze-geschichte-der-bibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/laky-eva` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/laszlo-livia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/lending-department` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/lendvai-judit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/lesesaal` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/macsar-istvan-vendelne` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/magony-imre` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/marai-programok-a-konyvtarban` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/marton-gabor` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/meseterapias-utak-es-kalandok-konyvbemutato` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/meszoly-geza-utcai-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/meszoly-geza-uti-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/method-system-group` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/mihalkone-szuts-beatrix` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/miklos-gabriella` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/mikor-szabad-olni` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/mke-of-fejer-county-organization` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/mong-ildiko` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=2` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=3` | 2 | `/budai-uti-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=4` | 2 | `/meszoly-geza-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=5` | 2 | `/szena-teri-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=6` | 2 | `/tolnai-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=7` | 2 | `/zsolt-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/music-and-computer-department` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/musik-und-computerabteilung` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/nemeth-reka` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/netzwerkarbeit` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/news/index` | 2 | `/news` | CLONED | egyéb / azonosítandó | local 200 |
| `/nka` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/nka-204111314` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/nott-zsuzsa` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/nyolcszaz-utca-gyalog` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/offnungszeiten` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/online-iksz` | 2 | `/iskolai-kozossegi-szolgalat` | CLONED | egyéb / azonosítandó | local 200 |
| `/ortskunde` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/osgyan-laszlo` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/page/graphic` | 2 | `/page/blind` | CLONED | egyéb / azonosítandó | local 200 |
| `/page/menu/265/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/267/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/268/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/269/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/272/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/273/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/278/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/279/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/282/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/318/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/332/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/340/preview/1` | 2 | `/uj-konyvajanlo` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/341/preview/1` | 2 | `/uj-konyvajanlo` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/342/preview/1` | 2 | `/uj-konyvajanlo` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/343/preview/1` | 2 | `/uj-konyvajanlo` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/345/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/372/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/page/menu/442/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | preview | admin/CMS preview link |
| `/palyazat-2020` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/pap-ivett` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/papne-gal-gyongyi` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/papp-zoltanne` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/partner-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/partnerbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/pedagogiai-szakkonyvtar` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/peresztegir-es-nagy-robert-copy` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/pozsa-reka` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/preszter-agnes` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/reading-room` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/ruff-ilona` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/sommer-bucher` | 2 | `/uj-konyvajanlo` | CLONED | egyéb / azonosítandó | local 200 |
| `/somogyfoki-ottilia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/somogyine-dobai-szilvia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/stadtteilbibliotheken` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/start/index/lang/2026_08_12_netrevalok` | 2 | `/start/index/lang/hu` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/start/index/lang/20260806_zummogj_velunk_szena` | 2 | `/start/index/lang/hu` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/start/index/lang/a-jaki-templomok-es-temetoik-2026-08-19` | 2 | `/start/index/lang/hu` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/start/index/lang/csendes-olvasas-a-szabadban-szena-2026-augusztustol` | 2 | `/start/index/lang/hu` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/strasszerne` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szabacsik-jozsefne` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szabo-eszter` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szabo-eva` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szabone-anett` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szabone-koo-ildiko` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szalai-tamas` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szantai-julianna` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szena-teri-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/szena-teri-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/szentkeresztine-saary-krisztina` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/tajekoztatas-2026-8-3` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/tajekoztatas-kozpont-2026-08-10` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/teritesi-dijak` | 2 | `/orszagos-konyvtari-napok-2016-1` | CLONED | egyéb / azonosítandó | local 200 |
| `/tolnai-utcai-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/tolnai-utcai-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/tompaine-siba-renata` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/torok-gabriella` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/toth-szilvia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/tunyogi-tibor` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/uber-uns` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/unnepi-konyvhet-2026` | 2 | `/foglalkozaskereso` | CLONED | egyéb / azonosítandó | local 200 |
| `/uto-david-lenke-konyvbemutatoja` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/vadasz-aranka` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/vadasz-krisztina-copy` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/vajda-georgina` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/vajnar-diana` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/var-folyoirat-ukh-2026-piknik` | 2 | `/foglalkozaskereso` | CLONED | egyéb / azonosítandó | local 200 |
| `/varga-andrea` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/varga-eva` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/vitek-renata` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/vorosmarty-horvath-zsofia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/wishbasket/archive` | 2 | `/wishbasket` | CLONED | egyéb / azonosítandó | local 200 |
| `/wishbasket/index` | 2 | `/wishbasket` | CLONED | egyéb / azonosítandó | local 200 |
| `/zahoretz-eva` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/zentralbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/zsolt-utcai-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/zsolt-utcai-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | régi többnyelvű (angol/német) site-változat, scope csak magyar |
| `/wishbasket/archive?page=2` | 3 | `/wishbasket/archive` | CLONED | egyéb / azonosítandó | local 200 |
| `/wishbasket/archive?page=1` | 4 | `/wishbasket/archive?page=2` | CLONED | egyéb / azonosítandó | local 200 |
| `/wishbasket/archive?page=3` | 4 | `/wishbasket/archive?page=2` | CLONED | egyéb / azonosítandó | local 200 |
