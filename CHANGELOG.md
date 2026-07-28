# Changelog

A VMK Website Modernization projekt összes lényeges változásának naplója.

A projekt a [Semantic Versioning](https://semver.org/spec/v2.0.0.html) szabványt követi.

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
