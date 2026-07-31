# Changelog

A VMK Website Modernization projekt összes lényeges változásának naplója.

A projekt a [Semantic Versioning](https://semver.org/spec/v2.0.0.html) szabványt követi.

## [Unreleased] - 2026-07-31 (folyamatban)

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

### Ismert Korlátok
* `payload generate:types` és önálló `tsx` szkriptek Node 24 alatt `ERR_REQUIRE_ASYNC_MODULE` hibába futnak (upstream Payload/Next.js interop bug) — a `payload-types.ts` nincs generálva, a fejlesztői seedelés a `src/app/api/dev-seed/route.ts` végponton át történik.

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
