# Project Status Dashboard (Projekt Állapotjelző)

A VMK Website Modernization projekt pillanatnyi stádiumának, elvégzett mérföldköveinek és következő feladatainak gyors áttekintője.

---

## 🚦 Aktuális Fázis & Státusz

* **Aktuális Fázis:** Implementation — Milestone 3: Sitemap Completion, Scientia Vizuális Frissítés & Funkcióbővítés (folyamatban, 2026-07-31-től többnapos autonóm munkamenet)
* **Aktuális Verzió:** `v0.3.0-autonomous-core` → készül `v0.4.0`
* **Célverzió:** `v0.4.0-migration`
* **Blokkoló tényezők (Blockers):** Fizetési kapu (Stripe/Barion/SimplePay) hitelesítő adatok hiányoznak — a Shop/Adomány funkciók csak struktúra/UI szinten készülnek el éles fizetés nélkül, amíg nincs valós kulcs.
* **Ismert technikai korlát:** `payload generate:types` Node 24 alatt hibázik (upstream interop bug), ld. `.ai/context/current_state.md`.
* **WCAG 2.2 AA audit még nem futott le ténylegesen** — az infrastruktúra (`playwright.config.ts`, `tests/e2e/accessibility.spec.ts`) kész, de a Chromium indítása ebben a sandbox-környezetben hiányzó rendszerkönyvtár (`libatk-1.0.so.0`) és root-jogosultság hiánya miatt nem lehetséges. CI-ban (`.github/workflows/ci-cd.yml`, root alatt fut) vagy nem-sandboxolt gépen kell lefuttatni.

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
