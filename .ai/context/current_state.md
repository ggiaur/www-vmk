# AI Short Memory - Current State

* **Aktuális Mérföldkő:** `Milestone 3 — Sitemap Completion, Scientia Visual Refresh & Feature Expansion` folyamatban (2026-07-31-i többnapos autonóm munkamenet).
* **Következő Cél:** valódi vmk.hu tartalom migrálása (scraper), teremfoglalás/adomány/shop/RSVP kollekciók, WCAG audit, 301 redirect térkép.
* **Verzió Tag:** `v0.3.0-autonomous-core` → készül `v0.4.0`.
* **Aktív Belépési Pont:** `README_AI.md`, `PROJECT_STATUS.md`, `CLAUDE.md` (munkafegyelem, az `ai-sd-os` motorból átvéve).
* **Legutóbbi Változások (2026-07-31):**
  - Javítva: npm dependency-konfliktus (Next.js 15.4.11 + Payload 3.87.0-ra rögzítve), hiányzó Payload admin root layout (500-as hiba javítva), hirek/esemenyek részletoldalak nem renderelték a valós CMS `content`/`description` mezőt.
  - Új: `Pages` blokk-alapú oldalépítő (Hero, RichText, ContactInfo, Downloads, Accordion, PartnersGrid) + generikus `[...slug]` catch-all route — ez szolgálja ki a `/hasznalat/*`, `/rolunk/*` stb. oldalakat fejlesztői munka nélkül.
  - Új: `/reszlegek/[slug]`, `/tagkonyvtarak/[slug]` dinamikus oldalak (a meglévő `Libraries` kollekcióra épülnek).
  - Új kollekciók: `Partners`, `Galleries` + `/galeria` oldalak.
  - Vizuális rendszer frissítve a valódi `uj.vmk.hu` (WordPress "Scientia" téma) tokenjeire: narancs `#F3701D` elsődleges szín, sötét `#212121` fejléc, `Cardo`+`Inter` betűtípus-párosítás. Ld. `docs/DESIGN_SYSTEM.md`.
  - Ismert korlát: a `payload generate:types` CLI és az önálló `tsx` szkriptek (pl. `scripts/seed.ts` közvetlen futtatása) Node 24-en `ERR_REQUIRE_ASYNC_MODULE` / `loadEnvConfig` hibába futnak (upstream Payload/Next.js ESM-CJS interop hiba) — emiatt a `payload-types.ts` nem generálódik, és a seedelés a `src/app/api/dev-seed/route.ts` fejlesztői végponton keresztül történik a futó Next.js dev szerveren belül.
  - Új (2026-07-31, második iteráció): `Rooms`+`Bookings` (teremfoglalás), `DonationPledges` (támogatás, élő fizetés nélkül), `Products` (bolt, csak böngészés), `Registrations`+`Events.capacity` (esemény RSVP) kollekciók és oldalak, `src/app/actions.ts` Server Actionök. Programarchívum oldal (`News.category === 'archive'`).
  - Elkészült a `docs/SCRAPE_URL_INVENTORY.md` — valós vmk.hu URL-minta és régi→új útvonal-megfeleltetési tábla a következő lépéshez (valódi tartalom-migrációs scraper).
