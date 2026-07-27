# Changelog

A VMK Website Modernization projekt összes lényeges változásának naplója.

A projekt a [Semantic Versioning](https://semver.org/spec/v2.0.0.html) szabványt követi.

## [v0.1.0-foundation] - 2026-07-27

### Hozzáadva (Milestone 1 - Foundation & Architecture)
* **Projekt Alkotmány & Irányelvek:** `/docs` és `/ai` könyvtárak felállítása (`VISION.md`, `PROJECT_SPEC.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `UX_PROTOTYPE.md`, `PAGE_SPECIFICATIONS.md`).
* **AI Context Management:** `.ai/context/` könyvtár létrehozása rövid-távú AI memóriakezeléshez (`current_state.md`, `architecture_summary.md`, `coding_rules.md`).
* **Next.js 15 Foundations:** React 19, TypeScript (`strict: true`), App Router struktúra inicializálva.
* **Payload CMS v3 Integration:** Native Next.js 15 konfiguráció, Lexical RichText editor és PostgreSQL adapter felállítása.
* **Docker Compose Stack:** Multi-service Docker architektúra (`Next.js App`, `PostgreSQL 16`, `MinIO Object Storage`, `Meilisearch Engine`).
* **301 Permanent Redirects:** Meglévő vmk.hu régi URL-jeinek SEO-védelmi átirányítása `next.config.ts`-ben.
* **CI/CD Pipeline:** GitHub Actions automatizált workflow (Lint, Type-check, Vitest, Playwright E2E & WCAG 2.2 AA audit).
* **Fejlesztői Dokumentáció:** `DEVELOPER_SETUP.md` és `CONTRIBUTING.md`.
