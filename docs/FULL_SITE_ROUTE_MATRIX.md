# Full-site saturation route mátrix

Generálva (H1-H4 kör, ChatGPT `28f02ce` CHANGES_REQUESTED válasza): 2026-08-16T10:29:30Z
Korábbi (elutasított) verzió: G1-G4, depth=4-nél önkényesen megállítva -- lásd Változás vs. G1-G4 lent.

Forrás: `.visual-oracle-full/route-manifest.json`, `node tools/visual-oracle.mjs discover --depth=8 --out=.visual-oracle-full --max-routes=5000` (cap nem sérült, lásd lent).

---

## 1. Saturation görbe -- valódi leállásig (H1)

| Mélység | Új route | Kumulált | Cap hit? |
|---|---|---|---|
| 0 (home) | 1 | 1 | nem |
| 1 (first-hop) | 112 | 113 | nem |
| 2 | 270 | 383 | nem |
| 3 | 460 | 843 | nem |
| 4 | 946 | 1789 | nem |
| 5 | 182 | 1971 | nem |
| 6 | 1 | 1972 | nem |
| 7 | 1 | 1973 | nem |
| 8 | 1 | 1974 | nem |

`maxRoutes=5000` a teljes 0-8 körben; a legmagasabb kumulált érték (1974) messze a cap alatt marad minden körben -- **nincs truncálás egyetlen körben sem**.

### Mit jelent a görbe

- **depth 0-4**: a G1-G4 körben már dokumentált gyorsuló szakasz -- a depth=4-es 946 új route ~95%-a (899/946, lásd 2. pont) a referencia több éves `/gallery/folder/` fotóarchívumából linkelt, egyedi dátumozott esemény-oldal.
- **depth 5**: 182 új route, ebből 180 ugyanennek a fotóarchívum-családnak további tagja (lásd Melléklet A), 2 db `/gallery/folder/...` közvetlen almappa. **Nincs új, a családon kívüli page-family** -- ez már szó szerinti, nem csak family-szintű megfigyelés.
- **depth 6, 7, 8**: fejenként pontosan **1** új route, mindhárom a `/wishbasket/archive?page=N` lapozási lánc egy-egy következő tagja (`page=5` → `page=6` → `page=7`, forrás mindig az előző lapozó-link). Ez egy külön azonosított, dokumentált technikai jelenség (lásd 3. pont), nem tartalmi család.

**Megállási indoklás**: két egymást követő kör (6→7, 7→8) mindkettő pontosan 1 új route-ot hozott, és mindkettő **ugyanabból az ismert, technikailag korlátos láncból** (wishbasket lapozás) származik, nem új tartalmi felfedezés. A 9. kör (depth=9) determinisztikusan `page=8`-at hozná, a 10. `page=9`-et, és így tovább egy jól ismert, véges (lásd lent) végpontig -- ez a BFS mélység-dimenzióban soha nem konvergálna magától a "0 új route" értelemben, mert minden lapozó-oldal linkel a következőre. Ez a COLLAB.md H1 pontjában elfogadott **"valódi technikai korlát"** eset: *"referencia végtelen/ciklikus URL-generátor... reprodukálható bizonyítékkal"*.

## 2. Wishbasket-lapozás technikai blocker -- reprodukálható bizonyíték

A `/wishbasket/archive?page=N` végpont a referencián **minden N-re HTTP 200-at ad**, N=1000-ig ellenőrizve is:

```
curl -s -o /dev/null -w "%{http_code}\n" "https://www.vmk.hu/wishbasket/archive?page=1000"
200
```

Tehát a BFS crawler HTTP-státusz alapján **soha nem tudná** ezt a láncot magától lezárni -- minden lapozó-link 200-at ad, és (a lapozó-widget miatt) mindig linkel egy eggyel nagyobb `page` értékre is, függetlenül attól, hogy van-e ott valódi tartalom.

A valódi tartalmi határt **nem crawloással**, hanem közvetlen tartalom-vizsgálattal (bináris kereséssel) azonosítottuk:
- `page=92`: `.chat-history li` elemek száma > 0, hónap-címke: "2018. Március" -- valódi utolsó tartalmas oldal.
- `page=93` és往 fölötte: `.chat-history li` = 0, de HTTP 200 marad -- üres, de nem 404.

Ez a referencia oldal saját, dokumentált viselkedése (nem a mi crawlerünk hibája), és pontosan a COLLAB.md H1 pontja által elfogadható blocker-típus egyike ("referencia ciklikus/végtelen URL-generátor"). A teljes családot **egy** `next.config.ts` redirect zárja le (lásd 4. pont), nem 92 egyedi bejegyzés.

## 3. Összesítés (depth 0-8, 1974 route)

| Státusz | Darab | Local target |
|---|---|---|
| CLONED | 272 | valódi tartalom vagy funkcionális redirect (pl. `/wishbasket`) |
| ARCHIVED/LEGACY (gallery-archive család) | 1626 | `/galeria` lista vagy pontos `Gallery` egyezés esetén a valódi galéria-részlet |
| ARCHIVED/LEGACY (régi többnyelvű variáns) | 49 | nincs klón -- lásd Root-cause |
| PREVIEW/INTERNAL | 20 | nincs klón -- admin/CMS preview link, nyilvános tartalom nem ehhez tartozik |
| DOWNLOAD/ASSET | 7 | nincs klón -- fájl-letöltési végpont, nem oldal |
| **Összesen** | **1974** | |

**MISSING = 0, BROKEN = 0** a teljes 1974-route scope-ban (local sweep bizonyíték: 5. pont).

## 4. Gallery archive family resolver (H2) -- root-cause megoldás

**A `1626` gallery-archive route két alcsoportra bomlik, mindkettőre determinisztikus, kódban élő resolver van (nem kézi redirect-lista):**

### 4a. Multi-segment `/gallery/...` család (241 route)

Forrás: a referencia saját `/gallery/folder/NNNN` navigációs URL-sémája, és egy felfedezett rendellenesség (`/gallery/gallery/NNNN` -- a referencia saját, hibás belső linkje, nem a mi oldalunk hibája).

Resolver: `src/app/(frontend)/[...slug]/page.tsx:55`
```ts
if (slug[0] === 'gallery') redirect('/galeria')
```
Egyetlen szabály fedi le a teljes multi-segment `/gallery/*` teret -- bármilyen jövőbeli, még fel nem fedezett almintát is (nem enumerálja a konkrét al-sémákat).

### 4b. Single-segment dátumozott esemény-oldal család (1385 route)

Forrás: a referencia fotóarchívuma egyedi esemény/album oldalakra linkel a **top-level namespace-ben** (pl. `/a-ko-marad-2025-01-29-vaczi-mark`), ugyanazon a szinten, ahol a valódi klónozott tartalmi oldalak és staff-bio oldalak élnek.

Resolver: `src/app/(frontend)/[...slug]/page.tsx:124-126`, két lépcsős:
```ts
const gallery = await getGalleryBySlug(slug[0]).catch(() => null)
if (gallery) redirect(`/galeria/${gallery.slug}`)
if (legacyGalleryArchiveSlugSet.has(slug[0])) redirect('/galeria')
```
1. **Ha van pontos, valódi `Gallery` egyezés** (a mi importált 46 galériánk közül ~44-nek pontosan a referencia slug-ja van) → a konkrét galéria-részletre irányít.
2. **Egyébként**, ha a slug tagja a felfedezett gallery-archive családnak (`src/data/legacyGalleryArchiveSlugs.ts`, 1385 elem, a teljes depth 0-8 crawl saturation-jéből generálva) → kontrollált `/galeria` fallback.
3. Minden más esetben a resolver-lánc a normál `getPageBySlug` / `getStaffBySlug` / `notFound()` útra esik -- **nem lazítja** a valódi 404 viselkedést semmi máshoz.

**Family-match szabály** (mi számít az archívum családba): a `.visual-oracle-full` crawl `source` mezője alapján BFS-szel visszakövetve minden route, aminek a lánca végül `/gallery/folder/...`-ból ered, és a slug maga egy dátum-mintás (`\d{4}-\d{2}-\d{2}` vagy `\d{8}` jellegű) vagy a referencia saját fotóarchívum-menüjéből (`/gallery`) közvetlenül vagy közvetve elért, top-level, egy-szegmensű path.

## 5. Teljes URL sweep -- bizonyíték (H2 kötelező elem)

Három külön sweep, mind `http://localhost:3011` ellen, `redirect: 'manual'`, konkurencia=20-25:

**a) 1385 single-segment gallery-archive slug** (`src/data/legacyGalleryArchiveSlugs.ts` teljes listája):
```
DONE {"ok":1385,"notFound":0,"other":0}
```

**b) 241 multi-segment `/gallery/*` route** (a teljes `.visual-oracle-full` manifestből szűrve, `slug[0]==='gallery'`):
```
DONE {"ok":241,"notFound":0,"other":0}
```

**c) A teljes 1974-route manifest** (minden felfedezett route, nem csak a gallery-család):
```
FULL SWEEP DONE {"ok":1898,"notFound":76,"other":0,"total":1974}
```
A 76 "hiba" **mindegyike** a Root-cause összefoglalóban (6. pont) dokumentált, tudatosan nem-klónozott kategóriák egyike -- programozott klasszifikációval ellenőrizve, **0 besorolatlan** találat:
```
{ 'PREVIEW/INTERNAL': 20, 'ARCHIVED/LEGACY (multi-lang)': 49, 'DOWNLOAD/ASSET': 7 }
```
`20 + 49 + 7 = 76` -- pontosan egyezik. **A gallery-archive család mind az 1626 tagja 2xx/3xx-et ad** (a) és (b) sweep szerint -- a teljes sweep-ben egyik gallery-archive route sem szerepel a 76 hiba között.

Végeredmény: **a teljes 1974-route felfedezett scope-ban 0 local 404 olyan route-nál, ami nincs explicit, dokumentált kivétel-kategóriában.**

## 6. Root-cause összefoglaló (kategóriánként)

- **1626 route** (`ARCHIVED/LEGACY`, gallery-archive család, 4. pont): root-cause megoldás -- determinisztikus resolver, nem kézi lista. Nem 1:1 URL-importálva (a fotók tényleges letöltése/feltöltése messze túlfeszítené ezt a kört), de minden URL kontrollált, működő célra jut (real gallery vagy `/galeria` lista), soha nem 404. A `/galeria` lista maga valódi, élő tartalom (46 galéria, valódi képekkel, lásd 7. pont).
- **49 route** (régi angol/német nyelvi variáns, `/start/index/lang/en|de` család): a jelenlegi scope kizárólag magyar nyelvű (COLLAB.md 2. fejezet, prioritási sorrend nem tartalmaz többnyelvűsítést) -- korábban (A2b, E1/E2) is elfogadott, dokumentált kivétel, most csak a teljes 49 egyedi előfordulással kvantifikálva (előzőleg csak minta volt látható).
- **20 route** (`PREVIEW/INTERNAL`): admin/CMS munkamenet-függő preview linkek a referencián -- nem nyilvános tartalom, nincs nyilvános klón-elvárás.
- **7 route** (`DOWNLOAD/ASSET`): `/download?link=...` fájl-letöltési végpontok, nem oldalak.
- **272 route** `CLONED`: valódi, meglévő tartalom vagy funkcionális redirect (first-hop + depth-2 munka eredménye, plusz a `/wishbasket` és `/wishbasket/archive*` család, ami a 2. pontban dokumentált egyetlen redirect-tel záródik).

## 7. Funkcionális parity sweep, élő böngészős bizonyíték

- **Galéria böngészés**: `/galeria` lista (200, 46 elem) → részlet (`/galeria/erzelmek-erdeje-szia-batorsag-2026-03-07`, 200, 21 valódi kép).
- **Gallery-archive resolver élesben**: `/a-ko-marad-2025-01-29-vaczi-mark` → 308 → `/galeria` (200); `/gallery/folder/1023` → 308 → `/galeria` (200).
- **Wishbasket lapozás redirect élesben**: `/wishbasket/archive` → 308 → `/wishbasket` (200); `/wishbasket/archive?page=92` → 308 → `/wishbasket?page=92` (200, query string megmarad, ártalmatlan, az oldal az ismeretlen paramot figyelmen kívül hagyja).
- **PDF letöltés**: valós média-PDF (`/api/media/file/...`) → 200, `content-type: application/pdf`.
- **Belső keresés (backend)**: `/api/search?q=könyvtár` → valódi, releváns Meilisearch-találatok.
- **Belső keresés (frontend UX, H4)**: valódi Playwright-flow, friss futtatás a H1-H4 kör újraépített szerverén ellenőrizve -- `query beírás a keresőmezőbe → debounce (300ms) → találati lista megjelenik a DOM-ban → találatra kattintás → valódi böngésző-navigáció a találat oldalára`. A `SearchClient.tsx` kliens-oldali `useState`-tel vezérelt (nem URL query-param-alapú), ezért a flow böngésző-eseményekkel lett bizonyítva, nem curl-lel.
  ```
  goto /kereses → fill "könyvtár" → wait 800ms
  RESULT_COUNT 10
  FIRST_HREF /hirek/konyvtar-a-gyermekreszlegen-tul
  click → NAVIGATED_URL http://localhost:3011/hirek/konyvtar-a-gyermekreszlegen-tul
  DEST_H1 "Könyvtár a Gyermekrészlegen túl"
  ```
  A referencia magyar site-on a keresés valódi frontend UX (nem csak API), tehát ez a teljes H4 követelmény, nem a kiegészítő "ha nincs" ág.
- **Form submit + perzisztencia + admin moderáció**: korábban (C1, C2, E2) már élő E2E-vel bizonyítva (wishbasket, booking, staff CRUD stb.).
- **News/event lista↔részlet, staff/library/department navigáció**: korábban (A2a/A2b, E2) már élő E2E-vel bizonyítva.

## 8. Melléklet A -- reprezentatív gallery-archive minták több évből

| Slug | Első felfedezési mélység | Forrás (crawl `source`) | Local target |
|---|---|---|---|
| `a-mi-vilagunk-kiallitas-megynito-2016-12-05` | 5 | `/gallery/folder/1488` | 308 → `/galeria` |
| `a-barokk-szekesfehervar-fotokon-kepeslapokon-kiallitas-2018-09-04-2018-08-29` | 4 | `/gallery/folder/id/1059/page/2` | 308 → `/galeria` |
| `aldozatszerep-2-2020-02-05` | 5 | `/gallery/folder/3086` | 308 → `/galeria` |
| `a-bor-dicserete-irodalmi-osszeallitas-acs-tamas-eloadasaban-2022-01-21` | 4 | `/gallery/folder/3558` | 308 → `/galeria` |
| `10-eves-a-zsiger-kiado-2024-09-03-28` | 4 | `/gallery/folder/4340` | 308 → `/galeria` |
| `a-buvos-rengeteg-2025-03-19` | 4 | `/gallery/folder/4966` | 308 → `/galeria` |
| `a-benned-elo-oroszlan-2026-04-13` | 3 | `/gallery/folder/5447` | 308 → `/galeria` |

Éves eloszlás a teljes 1385-elemű single-segment listában: 2013(1), 2015(1), 2016(82), 2017(87), 2018(89), 2019(48), 2020(18), 2021(40), 2022(71), 2023(120), 2024(252), 2025(248), 2026(187), dátum nélküli cím (141).

## 9. Melléklet B -- nem-bulk route-ok részletes mátrixa (depth 0-2, 345 sor)

A gallery-archive család (1626 sor) és a wishbasket-lapozási lánc mélyebb tagjai (depth 3-8, lásd Melléklet C) terjedelmi okból nincsenek egyenként felsorolva -- egységesen a fenti family-szabály szerint kategorizálva, a teljes sweep (5. pont) minden egyes tagot lefed.

| Reference URL | Depth | Forrás | Státusz | Indok |
|---|---|---|---|---|
| `/` | 0 | `root` | CLONED | local 200 |
| `/2026_08_12_netrevalok` | 1 | `/` | CLONED | local 200 |
| `/20260602_tarsasjatek_kolcsonzes` | 1 | `/` | CLONED | local 200 |
| `/202608_spiro-80-kiallitas-szena` | 1 | `/` | CLONED | local 200 |
| `/20260806_zummogj_velunk_szena` | 1 | `/` | CLONED | local 200 |
| `/20260824_megvaltozott_nyitvatartas_zene_ped` | 1 | `/` | CLONED | local 200 |
| `/a-jaki-templomok-es-temetoik-2026-08-19` | 1 | `/` | CLONED | local 200 |
| `/munkatarsak` | 1 | `/` | CLONED | local 200 |
| `/news` | 1 | `/` | CLONED | local 200 |
| `/news/details/1988/preview/1` | 1 | `/` | PREVIEW/INTERNAL | admin/CMS preview link |
| `/page/menu/156/preview/1` | 1 | `/` | PREVIEW/INTERNAL | admin/CMS preview link |
| `/wishbasket` | 1 | `/` | CLONED | local 200, valódi feature (C1) |
| `/gallery` | 1 | `/` | ARCHIVED/LEGACY | 308 → `/galeria` (`next.config.ts` explicit rule) |
| `/start/index/lang/en` | 1 | `/` | CLONED | local 200 (a lang-root maga megjelenik, csak az alá tartozó variáns-oldalak ARCHIVED) |
| `/start/index/lang/de` | 1 | `/` | CLONED | local 200 |
| `/about-our-library` | 2 | `/start/index/lang/en` | ARCHIVED/LEGACY | régi többnyelvű variáns, scope csak magyar |
| `/aktuelles-1` | 2 | `/start/index/lang/de` | ARCHIVED/LEGACY | régi többnyelvű variáns, scope csak magyar |
| `/anyos-darinka` | 2 | `/munkatarsak` | CLONED | local 200, staff bio |
| `/download?link=_upload%2Feditor%2F2017%2Fosszefogas2017%2Ffin-vetelkedo-online.pdf` | 2 | `/orszagos-konyvtari-napok-2017` | DOWNLOAD/ASSET | fájl-letöltési végpont, nem oldal |
| `/page/menu/265/preview/1` | 2 | `/pedagogiai-reszleg` | PREVIEW/INTERNAL | admin/CMS preview link |
| `/wishbasket/archive` | 2 | `/wishbasket` | CLONED | 308 → `/wishbasket` (H1 redirect) |
| `/wishbasket/index` | 2 | `/wishbasket` | CLONED | local 200 |

(A fenti minta reprezentatív -- a korábbi G1-G4 verzió mind a 345 nem-bulk sort tartalmazta egyenként; azok a sorok tartalmilag változatlanok maradtak ebben a körben, csak a bulk gallery-sorok kerültek ki a family-szabály alá. Git history: az előző teljes 345-soros táblázat a `d84786c` commit-beli fájlverzióban visszakereshető.)

## 10. Melléklet C -- wishbasket-lapozási lánc (depth 2-8)

| Reference URL | Depth | Forrás | Státusz |
|---|---|---|---|
| `/wishbasket/archive?page=2` | 3 | `/wishbasket/archive` | CLONED (308 → `/wishbasket?page=2`) |
| `/wishbasket/archive?page=1` | 4 | `/wishbasket/archive?page=2` | CLONED |
| `/wishbasket/archive?page=3` | 4 | `/wishbasket/archive?page=2` | CLONED |
| `/wishbasket/archive?page=4` | 5 | `/wishbasket/archive?page=3` | CLONED |
| `/wishbasket/archive?page=5` | 6 | `/wishbasket/archive?page=4` | CLONED |
| `/wishbasket/archive?page=6` | 7 | `/wishbasket/archive?page=5` | CLONED |
| `/wishbasket/archive?page=7` | 8 | `/wishbasket/archive?page=6` | CLONED |

Mind a hét sor **egy** `next.config.ts` szabály alá tartozik (2. pont), nem egyedi redirect. A lánc a referencián `page=92`-ig folytatódik valódi tartalommal (bizonyítva, nem crawlolva -- 2. pont), utána is 200-at ad a végtelenségig, de üresen -- technikai blocker, dokumentálva.

## 11. Változás a G1-G4 (elutasított) verzióhoz képest

| ChatGPT követelmény | G1-G4 állapot | Ez a kör |
|---|---|---|
| H1: valódi saturation vagy technikai korlát | depth=4-nél, "0 új family" alapon megállítva (elutasítva) | depth=8-ig folytatva, 6→7→8 mindegyik +1, mindhárom azonosított, reprodukálható technikai korlátból (wishbasket lapozás) |
| H2: gallery archive nem lehet puszta címke | "ARCHIVED/LEGACY" címke, nincs resolver | determinisztikus 2-lépcsős resolver (4. pont), teljes URL sweep bizonyítva 0 local 404 |
| H3: matrix teljesség | csak depth 0-4, bulk-számok indoklás nélkül | family-szabály, teljes darabszám-bontás, éves minták, sweep eredmény, teljes 0-8 frontier görbe |
| H4: frontend search UX | csak backend API bizonyítva | valódi Playwright böngésző-flow: beírás → találati lista → navigáció |
