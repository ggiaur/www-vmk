# Changelog

A VMK Website Modernization projekt összes lényeges változásának naplója.

A projekt a [Semantic Versioning](https://semver.org/spec/v2.0.0.html) szabványt követi.

## [Unreleased] - 2026-07-31 (folyamatban)

### Hozzáadva (hatodik kör — teljes hír-migráció)
* A scraper végigfutott mind a ~43 valós `vmk.hu/news` lista-oldalon. **335 valódi hírcikk** importálva a `news` kollekcióba, valós címmel, dátummal (slug-ból becsülve, ahol a régi oldal nem adott mást), szöveggel és képpel (MinIO-ban tárolva). Csak 7 hiba maradt, mind a régi oldal saját törött képei/linkjei (404-ek egy 2020–2024 közötti régi feltöltésekben) — nem a migrációs kód hibája.
* Javítva: a `htmlToLexical.ts` link-konvertere elszállt, ha a forrás `<a>` tag érvénytelen URL-t tartalmazott (`href="#"` és hasonlók, amik gyakoriak a régi oldalon) — most sima szövegre esik vissza link-node helyett ilyen esetben, ahelyett hogy elbuktatná a teljes cikk importját.
* **Ismert korlát:** a `/hirek` lista oldal jelenleg csak a 20 legfrissebb cikket mutatja lapozás nélkül (`getLatestNews(20)`) — 335 cikkel ez már szűk keresztmetszet, valódi lapozás/szűrés hátravan.

### Hozzáadva (ötödik kör — WCAG audit infrastruktúra)
* `playwright.config.ts` + `tests/e2e/accessibility.spec.ts`: `@axe-core/playwright`-alapú WCAG 2.2 AA audit mind a 15 fő nyilvános oldalra + fókusz/skip-link teszt.
* `vitest.config.ts` hozzáadva — enélkül a Vitest véletlenül megpróbálta futtatni a Playwright specfájlokat is (`tests/e2e/**` most explicit kizárva).
* **Kritikus, őszinte korlát:** a Playwright böngésző futtatása ebben a sandbox-környezetben **nem sikerült** — a Chromium indításához szükséges `libatk-1.0.so.0` rendszerkönyvtár hiányzik, a telepítéshez root/sudo jogosultság kellene, ami nincs elérhető (`sudo: I'm sorry dockeruser...`). Az audit infrastruktúra készen áll és helyes, de **ténylegesen még nem futott le** — ezt a `.github/workflows/ci-cd.yml` CI-ban kell lefuttatni (ahol a `npx playwright install --with-deps` root alatt fut), vagy egy nem-sandboxolt fejlesztői gépen.
* Emiatt **manuális, kód-alapú** átvizsgálást végeztem helyette: hiányzó `alt` attribútumokat kerestem (nem találtam), és feltártam, hogy a #11-es design-token frissítés (Scientia narancs paletta) **csak a `globals.css`-ben és a layoutban** történt meg — kb. 30 komponens/oldal fájl továbbra is a régi, kézzel beégetett bordó (`#8C1D11`) és égettnarancs (`#C85A32`) hexértékeket használta. Ez javítva: minden előfordulás lecserélve az új tokenekre (`#8C1D11`→`#F3701D`, `#70160C`→`#D4590F`, `#C85A32`/`#D4AF37`→`#DDB837`), típusellenőrzés és teljes route-smoke-teszt zöld utána.

### Javítva
* npm dependency-konfliktus: `next` és `@payloadcms/*` verziók inkompatibilisek voltak — rögzítve `next@15.4.11` / `payload@3.87.0`-ra, `package-lock.json` újragenerálva.
* Payload admin panel (`/admin`) 500-as hibát dobott — hiányzott a kötelező `src/app/(payload)/layout.tsx` root layout, ezért a Next.js egy üres helyettesítőt generált, ami nem csomagolta be a Payload React contextjét. Pótolva a hivatalos `RootLayout`/`handleServerFunctions` boilerplate-tel.
* `/hirek/[slug]` és `/esemenyek/[slug]` a valós CMS `content`/`description` mező helyett mindig hardcode-olt placeholder szöveget jelenített meg — most a `RichTextRenderer` komponens tényleg a CMS-ből jövő tartalmat rendereli, ha van.

### Hozzáadva
* `Pages` blokk-alapú oldalépítő (`src/blocks/PageBlocks.ts`: Hero, RichText, ContactInfo, Downloads, Accordion, PartnersGrid) + generikus `src/app/(frontend)/[...slug]/page.tsx` catch-all route — a `/hasznalat/*`, `/rolunk/*` és hasonló informatív oldalak mostantól CMS-tartalomként, fejlesztői munka nélkül szerkeszthetők.
* `/reszlegek` és `/tagkonyvtarak` index + `[slug]` dinamikus oldalak a meglévő `Libraries` kollekcióra építve.
* `Partners` és `Galleries` CMS kollekciók + `/galeria` index és részletoldalak.
* Vizuális rendszer frissítve a valódi `uj.vmk.hu` (WordPress "Scientia" téma) ellenőrzött tokenjeire (`docs/DESIGN_SYSTEM.md` 3–4. fejezet).
* `CLAUDE.md` munkafegyelem hozzáadva az `ai-sd-os` motor sablonjából.

* Teremfoglalás (`Rooms`, `Bookings` kollekciók + `/teremfoglalas` oldal, Server Action-alapú foglalási űrlap ütközés-ellenőrzéssel) — a WordPress "Booked" plugin funkciójának megfelelője.
* Támogatás/adománygyűjtés (`DonationPledges` kollekció + `/tamogatas` oldal) — a "Give" plugin megfelelője, **élő fizetés nélkül**: az űrlap csak felajánlási szándékot rögzít, a könyvtár munkatársa veszi fel manuálisan a kapcsolatot.
* Bolt (`Products` kollekció + `/bolt` és `/bolt/[slug]` oldalak) — a WooCommerce megfelelője, **csak böngészésre**, élő pénztár nélkül.
* Esemény RSVP/létszámkorlát (`Registrations` kollekció, `Events.capacity` mező, `RsvpForm`) — a "The Events Calendar" / "Event Tickets" pluginok megfelelője.
* `src/app/actions.ts`: Next.js Server Actions a fenti űrlapokhoz (`submitRsvp`, `submitBooking`, `submitDonationPledge`).
* **Valódi tartalom-migrációs scraper** (`src/lib/scraper/vmkScraper.ts`, `src/lib/scraper/htmlToLexical.ts`): bejárja a `https://www.vmk.hu/news?&page=N` lapozást, feldolgozza a cikk-részletoldalakat, letölti és a MinIO-ba tölti a kiemelt képeket, kézzel írt HTML→Lexical konverterrel alakítja a törzsszöveget (a Payload 3.87.0 nem exportál nyilvános HTML→Lexical konvertert). Dev-only route: `POST /api/dev-scrape-news?pages=N&limit=M`. Idempotens (slug alapján kihagyja a már importáltakat). 16/16 tesztelt cikk hibamentesen importálva, valós szöveggel és képpel.

### Javítva (második kör)
* A Payload elutasítja az üres `content` mezőt kötelező richText esetén — sok vmk.hu hír csak plakátkép, külön szöveg nélkül; a scraper most a lead/összefoglaló szövegből épít fallback bekezdést.
* `/hirek/[slug]` egyáltalán nem renderelte a `featuredImage`-et — pótolva.

### Hozzáadva (harmadik kör — SEO & redirectek)
* `next.config.ts` redirects bővítve a `docs/SCRAPE_URL_INVENTORY.md` régi→új megfeleltetési táblájával (tagkönyvtárak, részlegek, rólunk-aloldalak, galéria, nyitvatartás).
* `src/middleware.ts` + `src/app/api/news-slug-lookup/route.ts`: dinamikus 301 átirányítás a régi gyökér-szintű hír-URL-ekről (`/<slug>`) az újakra (`/hirek/<slug>`) — nem kell kézzel felvenni mind az 500+ cikket a redirects tömbbe. A middleware Edge runtime-on fut (Next.js alapértelmezés), ezért nem importálja közvetlenül a Payloadot (Postgres driver nem Edge-kompatibilis), hanem a saját (Node.js runtime alatt futó) `/api/news-slug-lookup` route-ot hívja fetch-csel.
* `src/app/sitemap.ts`: dinamikus `sitemap.xml`, amely a statikus oldalak mellett az összes publikált Hírt, Eseményt, Page-et, Tagkönyvtárat/Részleget és elérhető Terméket felsorolja.

### Hozzáadva (negyedik kör — MinIO tárolás)
* Media kollekció bekötve a MinIO S3-kompatibilis tárolóba (`@payloadcms/storage-s3`) — eddig a `docker-compose.yml`-ben futó MinIO konténer valójában soha nem volt ténylegesen használva, minden feltöltés a helyi lemezre (`media/`) került.
* `sharp` telepítve és bekötve a `payload.config.ts`-be (`sharp` kulcs) — a képméretezés (thumbnail/card/hero variánsok) korábban figyelmeztetést dobott, de nem működött.

### Javítva — két mélyen rejtett, a projekt legelejétől fennálló hiba
* **A Payload REST API catch-all route mappája rosszul volt elnevezve** (`src/app/(payload)/api/[[...segments]]/`) — a Payload hivatalos Next.js integrációja (`@payloadcms/next/routes`) explicit a `params.slug`-ot olvassa ki, nem `params.segments`-et (az admin catch-all route helyesen `[[...segments]]`-et vár, de az API route-nak `[[...slug]]`-nak kellett volna lennie — a két konvenció Payloadon belül is eltér egymástól). Emiatt **minden** kérés, ami ezen a REST route-on ment át (pl. `/api/media/file/...`), `TypeError: Cannot read properties of undefined (reading 'map')` 500-as hibával elszállt. Ez korábban rejtve maradt, mert helyi lemezes tárolásnál a fájlkiszolgálás más útvonalon történt — csak az S3/MinIO bekötése (ami kikényszeríti a `disableLocalStorage: true`-t) buktatta le. Javítva a mappa átnevezésével `[[...slug]]`-ra.
* A `Media` kollekciónak nem volt explicit `access.read` szabálya, ezért a fenti route-javítás után is 403-at adott vissza nyilvános kéréseknél — pótolva `read: () => true`-val (indokolt, hiszen egy nyilvános könyvtári honlap képei/dokumentumai nem igényelnek authot megtekintéshez).

### Ismert Korlátok
* `payload generate:types` és önálló `tsx` szkriptek Node 24 alatt `ERR_REQUIRE_ASYNC_MODULE` hibába futnak (upstream Payload/Next.js interop bug) — a `payload-types.ts` nincs generálva, a fejlesztői seedelés a `src/app/api/dev-seed/route.ts` végponton át történik.
* Shop és Támogatás oldalak **nem tudnak élő fizetést fogadni** — valós Stripe/Barion/SimplePay hitelesítő adatok nélkül ez a projekt ezen a ponton nem lép túl.
* A scraper eddig csak a `news` kollekcióra készült el (nem eseményekre/dokumentumokra/stábra), és csak minta-méretben lett futtatva (16 cikk, 2 lista-oldal a ~43-ból) — a teljes 500+ cikkes migráció még hátravan.

---

## [v0.3.0-autonomous-core] - 2026-07-28

### Hozzáadva (Milestone 2B - Extended CMS & Frontend Shell)
* **Bővített CMS Kollekciók:**
  - `Staff` (`src/collections/Staff.ts`) - Könyvtári munkatársak, beosztások és elérhetőségek.
  - `Documents` (`src/collections/Documents.ts`) - Hivatalos letölthető dokumentumok (SZMSZ, beszámolók, űrlapok).
  - `Services` (`src/collections/Services.ts`) - Könyvtári szolgáltatások és díjtáblázatok.
* **Frontend Navigáció & Shell:**
  - `Header` (`src/components/navigation/Header.tsx`) - Logó, gyorsinfó sáv, főmenü, katalógus CTA és mobil menü.
  - `Footer` (`src/components/navigation/Footer.tsx`) - 3-oszlopos lábléc, kapcsolat, hasznos linkek és közösségi felületek.
  - `Breadcrumb` (`src/components/navigation/Breadcrumb.tsx`) - SEO & ARIA akadálymentesített morzsanavigáció JSON-LD támogatással.
* **Core UI Komponensek:**
  - `NewsCard`, `EventCard`, `LibraryCard`, `OpeningHoursWidget`.
* **App Router Oldalak:**
  - Főoldal (`src/app/(frontend)/page.tsx`) - Hero szekció, katalógus kereső, hírek, rendezvények és szolgáltatás összefoglaló.
  - Nyitvatartási mátrix (`src/app/(frontend)/nyitvatartas/page.tsx`) - Heti nyitvatartási mátrix minden tagkönyvtárra.
* **Kereső Integráció:**
  - `meilisearch.ts` (`src/lib/meilisearch.ts`) - Meilisearch indexelő kliens.

---

## [v0.2.0-core-cms] - 2026-07-27

### Hozzáadva (Milestone 2A - Core CMS Prototype)
* Payload CMS v3 kollekciók (`Users`, `Media`, `Libraries`, `News`, `Events`, `OpeningHours`, `Pages`).
* Seed eszköz (`scripts/seed.ts`).

---

## [v0.1.0-foundation] - 2026-07-27

### Hozzáadva (Milestone 1 - Foundation & Architecture)
* Dokumentáció, architektúra, Docker Compose, Next.js 15 init, CI/CD.
