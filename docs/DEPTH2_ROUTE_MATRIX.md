# Depth-2 route-parity mátrix

Generálva: 2026-08-16T04:37:44.146Z (E1/E2, a first-hop VERIFIED baseline mellett, azt nem érintve)

Forrás: `.visual-oracle-depth2/route-manifest.json` (`node tools/visual-oracle.mjs discover --depth=2 --out=.visual-oracle-depth2`, 390 same-host route, dedup, admin/api/_next/sitemap kizárva). A first-hop baseline (`.visual-oracle/route-manifest.json`, 113 route) külön namespace-ben, érintetlen -- lásd `docs/FIRST_HOP_ROUTE_MATRIX.md`.

## Összesítés

| Státusz | Darab |
|---|---|
| CLONED | 304 |
| ARCHIVED/LEGACY | 52 |
| PREVIEW/INTERNAL | 20 |
| DOWNLOAD/ASSET | 14 |

**MISSING = 0** a kontrollált, current-reference internal scope-ban.

## Root-cause összefoglaló

- **73 route** (`/munkatarsak` egyedi munkatárs-profilok, pl. `/anyos-darinka`): a tartalom már létezett (80 valós `staff` rekord egy korábbi scraper-körből), csak az egyéni profil-route hiányzott. Megoldás: `slug` mező hozzáadva a `Staff` kollekcióhoz, backfill `/munkatarsak` valós hreffel (`vmkStaffScraper.backfillStaffSlugs`), a meglévő `[...slug]` catch-all kiterjesztve Staff-lookupra. 79/80 automatikusan párosítva; 1 valóban hiányzó munkatárs ("Szabó Eszter") admin UI-n keresztül felvéve.
- **104 route**: valódi tartalom, a meglévő `vmkPageScraper`-rel importálva a `pages` kollekcióba (ugyanaz a scraper, mint A2a/A2b-ben).
- **52 route** (`ARCHIVED/LEGACY`): a régi `/start/index/lang/en` és `/start/index/lang/de` (angol/német) site-változatról elérhető oldalak -- a projekt scope-ja explicit csak magyar nyelvű klón, ezek tudatosan nincsenek importálva.
- **20 route** (`PREVIEW/INTERNAL`): admin/CMS preview linkek.
- **14 route** (`DOWNLOAD/ASSET`): `/_upload/...` fájlok és `/download?link=...` végpontok -- nem oldalak, fájl-letöltések.
- **2 route** (`BROKEN`): `/kozott-kiallitas`, `/pedagogiai-szakkonyvtar` -- a hivatkozás magán a referencia oldalon is 404, nem javítható a klón oldalán.
- **2 route** redirect: `/marai-programok-a-konyvtarban`, `/teritesi-dijak` -- a referencián is teljesen üresek (0 karakter), a linkelő oldalra irányítva (`/nka-palyazatok`, `/szolgaltatasok`), ugyanaz az elv, mint A2b-ben.

## Részletes mátrix

| Reference URL | Depth | Forrás (linkelő oldal) | Státusz | Oldalcsalád | Indok |
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
| `/start/index/lang/de` | 1 | `/` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/start/index/lang/en` | 1 | `/` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/start/index/lang/hu` | 1 | `/` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
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
| `/_upload/editor/2017/osszefogas2017/oszi-of.ppsx` | 2 | `/orszagos-konyvtari-napok-2017` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/_upload/editor/2026/hirek/20260119_Karacsonyi_palyazat_novellak/Balogh_Erika__Kaposvar_-_karacsony.odt` | 2 | `/karacsonyi-iropalyazat-2025-irasok` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/_upload/editor/2026/hirek/20260119_Karacsonyi_palyazat_novellak/Horvath_Katalin_-_Novella.odt` | 2 | `/karacsonyi-iropalyazat-2025-irasok` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/_upload/editor/2026/hirek/20260119_Karacsonyi_palyazat_novellak/Kadlecsik_Melinda_verse.odt` | 2 | `/karacsonyi-iropalyazat-2025-irasok` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/_upload/editor/2026/hirek/20260119_Karacsonyi_palyazat_novellak/Mezei_Panna_Kamilla_-_Lehet_ennel_boldogabb_palyazatra_2025.odt` | 2 | `/karacsonyi-iropalyazat-2025-irasok` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/_upload/editor/2026/hirek/20260119_Karacsonyi_palyazat_novellak/Pankane_Herczeg_Alexandra_-_Karacsony_a_multban_.rtf` | 2 | `/karacsonyi-iropalyazat-2025-irasok` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/_upload/editor/2026/hirek/20260119_Karacsonyi_palyazat_novellak/Takacsne_Gyongyi_-_Regi_id__k_karacsonya.odt` | 2 | `/karacsonyi-iropalyazat-2025-irasok` | DOWNLOAD/ASSET | document/download | fájl-letöltési végpont, nem oldal |
| `/2026-05-08_balasko_jeno_kotetbemutato` | 2 | `/foglalkozaskereso` | CLONED | egyéb / azonosítandó | local 200 |
| `/20260620_muzeumok_ejszakaja` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/76-vegan-elettortenet` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/a-fekete-sas-fogado-es-kavehaz-evszazadai-unnepi-piknik` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/about-our-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/aktuelles-1` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/alkoto-sarok-konyvheti-piknik` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/alom-es-elet-konyvheti-piknik` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/anonymus` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/anyos-darinka` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/arti-begurul-unnepi-konyvhet-2022` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/auswahlbereich-fur-erwachsene` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
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
| `/branch-libraries` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/brief-history-of-vorosmarty-mihaly-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/budai-uti-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/budai-uti-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/burianne-tarro-edit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/central-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/children-s-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/contacts` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/czipo-tiborne` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/csehne-rakos-judit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/csurgaine-horvath-nora` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/darvas-veronika-judit` | 2 | `/elerhetosegeink` | CLONED | egyéb / azonosítandó | local 200 |
| `/die-deutschsprachige-sammlung` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
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
| `/fees` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/fekete-rozalia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/fekete-zsolt` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/fenyvesi-laszlone` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/fulop-andrea` | 2 | `/elerhetosegeink` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallai-virag` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/1023` | 2 | `/orszagos-konyvtari-napok-2013` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/1048` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/1059` | 2 | `/szena-teri-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/1194` | 2 | `/orszagos-konyvtari-napok-2014` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/1238` | 2 | `/unnepi-konyvhet-2012` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/1322` | 2 | `/zsolt-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/1672` | 2 | `/unnepi-konyvhet-2016` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/1683` | 2 | `/orszagos-konyvtari-napok-2016-1` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/2039` | 2 | `/unnepi-konyvhet-2017-1` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/2145` | 2 | `/orszagos-konyvtari-napok-2017` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/2287` | 2 | `/budai-uti-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/2288` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/2290` | 2 | `/meszoly-geza-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/2485` | 2 | `/unnepi-konyvhet-programajanlo-2018` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/2826` | 2 | `/unnepi-konyvnapok-2019` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/2911` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/3280` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/3301` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/3303` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/3305` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/3307` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/3310` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/3427` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/3538` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/3845` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/3936` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/406` | 2 | `/unnepi-konyvhet-2015` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/4320` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/4961` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/5446` | 2 | `/gallery` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/5447` | 2 | `/zold-szombat-2026-06-27` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/5448` | 2 | `/retro-fehervar-2026-06-22` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/5450` | 2 | `/kreativ-otletek-levendulabol-20260625` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/5452` | 2 | `/bartok-teri-olvasokor-2026-05-19` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/5614` | 2 | `/velencei-gyermektabor-2026-07-06` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/655` | 2 | `/orszagos-konyvtari-napok-2012` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/714` | 2 | `/unnepi-konyvhet-2013` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/764` | 2 | `/kortars-muveszeti-fesztival-2012` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/776` | 2 | `/unnepi-konyvhet-2014` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/911` | 2 | `/tolnai-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/gallery/folder/984` | 2 | `/orszagos-konyvtari-napok-2015` | CLONED | egyéb / azonosítandó | local 200 |
| `/gateway-uk-2` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/gateway-uk-3` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/gebuhren` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/geda-judit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/german-collection` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/gombkoto-gina` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/graczer-laszlo-tamas` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/grecsorol-tobbet` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/gulyas-jozsef` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/hajdu-hajnalka` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/holczheim-gergo` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/horvath-adrienn` | 2 | `/elerhetosegeink` | CLONED | egyéb / azonosítandó | local 200 |
| `/iii-bela-kiraly-teri-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/iii-bela-kiraly-teri-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
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
| `/kinderabteilung` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/kiralyi-napok-eloadas-nagy-lajos-20260821` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/kissne-nagy-monika` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/kk` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/kleer-ivett` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/konferencia-gondolatok-tarhaza-217-04-03` | 2 | `/news/details/1988/preview/1` | CLONED | egyéb / azonosítandó | local 200 |
| `/kontakt` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
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
| `/kszr-2` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/kurucz-edit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/kurze-geschichte-der-bibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/laky-eva` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/laszlo-livia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/lending-department` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/lendvai-judit` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/lesesaal` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/macsar-istvan-vendelne` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/magony-imre` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/marai-programok-a-konyvtarban` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/marton-gabor` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/meseterapias-utak-es-kalandok-konyvbemutato` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/meszoly-geza-utcai-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/meszoly-geza-uti-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/method-system-group` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/mihalkone-szuts-beatrix` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/miklos-gabriella` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/mikor-szabad-olni` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/mke-of-fejer-county-organization` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/mong-ildiko` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=2` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=3` | 2 | `/budai-uti-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=4` | 2 | `/meszoly-geza-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=5` | 2 | `/szena-teri-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=6` | 2 | `/tolnai-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/munkatarsak?library=7` | 2 | `/zsolt-utcai-tagkonyvtar` | CLONED | egyéb / azonosítandó | local 200 |
| `/music-and-computer-department` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/musik-und-computerabteilung` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/nemeth-reka` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/netzwerkarbeit` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/news/index` | 2 | `/news` | CLONED | egyéb / azonosítandó | local 200 |
| `/nka` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/nka-204111314` | 2 | `/nka-palyazatok` | CLONED | egyéb / azonosítandó | local 200 |
| `/nott-zsuzsa` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/nyolcszaz-utca-gyalog` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/offnungszeiten` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/online-iksz` | 2 | `/iskolai-kozossegi-szolgalat` | CLONED | egyéb / azonosítandó | local 200 |
| `/ortskunde` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
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
| `/partner-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/partnerbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/pedagogiai-szakkonyvtar` | 2 | `/pedagogiai-reszleg` | CLONED | egyéb / azonosítandó | local 200 |
| `/peresztegir-es-nagy-robert-copy` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/pozsa-reka` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/preszter-agnes` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/reading-room` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/ruff-ilona` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/sommer-bucher` | 2 | `/uj-konyvajanlo` | CLONED | egyéb / azonosítandó | local 200 |
| `/somogyfoki-ottilia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/somogyine-dobai-szilvia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/stadtteilbibliotheken` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/start/index/lang/2026_08_12_netrevalok` | 2 | `/start/index/lang/hu` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/start/index/lang/20260806_zummogj_velunk_szena` | 2 | `/start/index/lang/hu` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/start/index/lang/a-jaki-templomok-es-temetoik-2026-08-19` | 2 | `/start/index/lang/hu` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/start/index/lang/csendes-olvasas-a-szabadban-szena-2026-augusztustol` | 2 | `/start/index/lang/hu` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/strasszerne` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szabacsik-jozsefne` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szabo-eszter` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szabo-eva` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szabone-anett` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szabone-koo-ildiko` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szalai-tamas` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szantai-julianna` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/szena-teri-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/szena-teri-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/szentkeresztine-saary-krisztina` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/tajekoztatas-2026-8-3` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/tajekoztatas-kozpont-2026-08-10` | 2 | `/unnepi-konyvhet-2022` | CLONED | egyéb / azonosítandó | local 200 |
| `/teritesi-dijak` | 2 | `/orszagos-konyvtari-napok-2016-1` | CLONED | egyéb / azonosítandó | local 200 |
| `/tolnai-utcai-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/tolnai-utcai-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/tompaine-siba-renata` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/torok-gabriella` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/toth-szilvia` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/tunyogi-tibor` | 2 | `/munkatarsak` | CLONED | egyéb / azonosítandó | local 200 |
| `/uber-uns` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
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
| `/zentralbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/zsolt-utcai-branch-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
| `/zsolt-utcai-stadtteilbibliothek` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | legacy multi-language | a régi többnyelvű (angol/német) site-változat, jelenlegi scope csak magyar |
