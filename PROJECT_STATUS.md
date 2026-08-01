# Project Status Dashboard (Projekt Állapotjelző)

A VMK Website Modernization projekt pillanatnyi stádiumának, elvégzett mérföldköveinek és következő feladatainak gyors áttekintője.

---

## 🚦 Aktuális Fázis & Státusz

* **Aktuális Fázis:** Implementation — Milestone 3: Sitemap Completion, Scientia Vizuális Frissítés, Funkcióbővítés & Valódi Tartalom-migráció (nagyrészt lezárva, 2026-07-31-i többnapos autonóm munkamenetben)
* **Aktuális Verzió:** `v0.3.0-autonomous-core` → `v0.4.0-migration` gyakorlatilag kész (ld. lent)
* **Célverzió:** `v0.4.0-migration` → `v1.0.0-production`
* **Blokkoló tényezők (Blockers):** Fizetési kapu (Stripe/Barion/SimplePay) hitelesítő adatok hiányoznak — a Shop/Adomány funkciók csak struktúra/UI szinten készülnek el éles fizetés nélkül, amíg nincs valós kulcs.
* **Ismert technikai korlát:** `payload generate:types` Node 24 alatt hibázik (upstream interop bug), ld. `.ai/context/current_state.md`.
* **WCAG 2.2 AA audit még nem futott le ténylegesen** — az infrastruktúra (`playwright.config.ts`, `tests/e2e/accessibility.spec.ts`) kész, de a Chromium indítása ebben a sandbox-környezetben hiányzó rendszerkönyvtár (`libatk-1.0.so.0`) és root-jogosultság hiánya miatt nem lehetséges. CI-ban (`.github/workflows/ci-cd.yml`, root alatt fut) vagy nem-sandboxolt gépen kell lefuttatni.
* **`npm audit` valós, magas súlyosságú Next.js CVE-ket jelez a jelenlegi `next@15.4.11`-en** (DoS, request smuggling, middleware bypass, cache poisoning, SSRF — ld. `npm audit --omit=dev` teljes lista). **Nincs biztonságos javítási út egyelőre**: az egyetlen javított verzió, amit az `npm audit fix --force` felajánl, a `next@15.5.22`, de a telepített `@payloadcms/next@3.87.0` (a jelenlegi legfrissebb stabil Payload-kiadás, ellenőrizve `npm view @payloadcms/next@latest`) `peerDependencies` tartománya kifejezetten kizárja az egész `15.5.x`–`16.2.5` sávot (`>=15.4.11 <15.5.0 || >=16.2.6 <17.0.0`) — vagyis a `next@15.4.11` jelenleg a Payload által hivatalosan támogatott legfrissebb, nem pedig egy elmaradt pin. A javítás előfeltétele egy jövőbeli Payload-kiadás, ami támogatja a `next@15.5.x`+-t, vagy egy nagyobb, `next@16.2.6+`-ra való migráció — ez utóbbi külön, emberi jóváhagyást igénylő döntés (jelentős, nem triviális major-verzió ugrás), nem autonóm munka.

---

## 📋 Hivatalos Verzió / Release Ütemterv (Roadmap)

* **`v0.1.0-foundation`** — Dokumentáció, architektúra, Docker Compose, Next.js 15 init, CI/CD.
* **`v0.2.0-core-cms`** — Payload CMS v3 collections (`Users`, `Media`, `Libraries`, `News`, `Events`, `OpeningHours`, `Pages`), RBAC, i18n, Live Preview, `scripts/seed.ts` & `PRE_RELEASE_CHECK.md`.
* **`v0.3.0-autonomous-core`** — Extended CMS (`Staff`, `Documents`, `Services`), Meilisearch integráció (`src/lib/meilisearch.ts`) & Next.js 15 Frontend Shell (Header, Footer, Breadcrumb, NewsCard, EventCard, LibraryCard, OpeningHoursWidget, Főoldal és Nyitvatartás mátrix).
* **`v0.4.0-migration`** — Meglévő vmk.hu tartalom átmigrálása, 301-es átirányítások & SEO tesztelés.
* **`v1.0.0-production`** — Élesítés és átadás.

---

## ✅ Elvégzett Mérföldkövek (Completed)

- [x] **Discovery & Audit:** Meglévő vmk.hu elemzése, tartalomleltár, audit (`DISCOVERY_AUDIT.md`).
- [x] **Architecture & DB Contract:** Next.js 15, Payload CMS v3, PostgreSQL 16, MinIO, Meilisearch & `DATABASE_DESIGN.md`.
- [x] **Design System & UX:** Vizuális és komponens szabványrendszer, `UX_PROTOTYPE.md`, `PAGE_SPECIFICATIONS.md`.
- [x] **Foundation Setup (Milestone 1):** TypeScript init, Docker Compose stack, CI/CD GitHub Actions, `.env` biztonsági beállítások, `.ai/context` rövid memória.
- [x] **Core CMS Prototype Schema & Runtime Validation (Milestone 2A):**
  - `src/payload.config.ts` (Hungarian i18n & Live Preview breakpoints)
  - `Users`, `Media`, `Libraries`, `News`, `Events`, `OpeningHours`, `Pages` collections
  - Seed tesztelési eszköz (`scripts/seed.ts`)
  - Szerkesztői szabályzat és jóváhagyási mátrix (`docs/EDITORIAL_WORKFLOW.md`)
  - CMS Audit jelentés (`CMS_VALIDATION_REPORT.md`: `TECHNICALLY VALIDATED - HUMAN ACCEPTANCE PENDING`)
- [x] **Extended CMS & Next.js 15 Frontend Shell (Milestone 2B - v0.3.0-autonomous-core):**
  - `Staff`, `Documents`, `Services` CMS kollekciók elkészítve és regisztrálva a Payload-ban.
  - Header, Footer, Breadcrumb navigációs komponensek (SEO & ARIA akadálymentesítés).
  - NewsCard, EventCard, LibraryCard, OpeningHoursWidget UI komponensek.
  - Főoldal (`/`) és Nyitvatartási Mátrix (`/nyitvatartas`) elrendezés megvalósítva.
  - Meilisearch kliens integráció (`src/lib/meilisearch.ts`).
- [x] **Sitemap Completion & Scientia Vizuális Frissítés (Milestone 3, 2026-07-31):**
  - Blokk-alapú `Pages` oldalépítő + generikus `[...slug]` catch-all route.
  - `/reszlegek`, `/tagkonyvtarak`, `/galeria`, `/programarchivum` oldalak + `Partners`, `Galleries` kollekciók.
  - Teremfoglalás (`Rooms`/`Bookings`), Támogatás (`DonationPledges`, élő fizetés nélkül), Bolt (`Products`, csak böngészés), Esemény RSVP (`Registrations`) — a `uj.vmk.hu` (Scientia WP téma) plugin-készletének megfelelője.
  - Vizuális rendszer a valódi `uj.vmk.hu` tokenjeire igazítva (narancs `#F3701D`, `Cardo`+`Inter` betűtípus), site-wide propagálva ~30 komponensben.
  - `next.config.ts` 301 redirect-térkép + `src/middleware.ts` dinamikus régi-hír-URL átirányítás + `src/app/sitemap.ts`.
  - `Media` kollekció bekötve MinIO-ba (`@payloadcms/storage-s3`), `sharp` telepítve.
- [x] **Valódi Tartalom-migráció (v0.4.0-migration lényegi tartalma, 2026-07-31):**
  - **334 valós hírcikk** a `vmk.hu` mind a ~43 lista-oldaláról, valós szöveggel, dátummal és képpel.
  - **80 valós munkatárs** (név, beosztás, telefon, e-mail) a `/munkatarsak`-ról.
  - **53 valós dokumentum (PDF)** az `/alapdokumentumok`-ról, MinIO-ban tárolva.
  - 33 unit teszt a scraper-logikára (`tests/scraper.test.ts`) — két valódi, súlyos hibát talált és javított menet közben (munkatárs telefonszámok, hírek dátum-becslése).
  - **Nem migrált, dokumentáltan blokkolt:** Események és Galéria-fotók — a forrás JS-alapú (statikus HTML-ből nem kinyerhető), böngésző-alapú scrapinget igényelne, ami ebben a sandbox-környezetben (root nélkül) nem lehetséges.
