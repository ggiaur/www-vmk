# GEMINI FINAL AUDIT REPORT — www-vmk

- **Date**: 2026-08-16
- **Branch**: `agent/gemini-final-audit`
- **Base Branch**: `agent/visual-clone-oracle`
- **Repository**: `ggiaur/www-vmk`
- **Audit Mode**: FINALIZATION ONLY — Independent repo-wide audit

---

## RESULT: FINDINGS

An independent, repo-wide audit was conducted across all 5 scope areas. 3 findings were identified (1 CI orchestration P1 finding, 2 Security/Access Control P2 findings). The two isolated access-control P2 findings have been fixed directly on this branch.

---

## 1. Scope Area Evaluation & Findings

### Area 1: Functional Completeness — VERIFIED (PASS)
- **Routes & Resolution**: Production build generated 42 static pages and all dynamic routes (`/hirek/[slug]`, `/esemenyek/[slug]`, `/reszlegek/[slug]`, `/tagkonyvtarak/[slug]`, `/galeria/[slug]`, `/bolt/[slug]`, `[...slug]`).
- **Resolver Integrity**: Multi-segment gallery paths (`/gallery/...`), legacy root-level news URLs (`/202605_...`), and individual staff bio slugs (`/[...slug]`) resolve deterministically without 404 regressions.
- **Form Persistence**: All 7 public interactive forms (`submitRsvp`, `submitBooking`, `submitContactMessage`, `submitDonationPledge`, `submitWishRequest`, `submitWishComment`, `submitNewsletterSignup`) in `src/app/actions.ts` correctly validate inputs and persist to PostgreSQL via Payload Local API with explicit transaction locking where required (`createRegistrationAtomically`, `createBookingAtomically`).

### Area 2: Security & Access Control — FINDINGS IDENTIFIED & FIXED
- **PII & Transactional Data**: `Users`, `Bookings`, `Registrations`, `DonationPledges`, `WishRequests`, and `WishComments` properly enforce field-level and document-level access restrictions to protect PII.
- **RBAC**: Role escalation is prevented (`Users.role` update is admin-only). `author` ("Könyvtáros Szerkesztő") content access is restricted via `scopedToOwnLibrary`.
- **Dev Endpoints**: All 13 `dev-*` API route handlers in `src/app/api/` enforce `if (process.env.NODE_ENV !== 'development')` guards.
- **Identified Findings**:
  - **Finding F-02 (P2)**: Direct anonymous REST API creation exposed on `ContactMessages` & `NewsletterSubscribers`. *(Fixed on branch)*
  - **Finding F-03 (P2)**: Media upload blocked for `author` role staff (`403 Forbidden`). *(Fixed on branch)*

### Area 3: Data & Migrations — VERIFIED (PASS)
- **Schema Safety**: `src/payload.config.ts` enforces `push: false` to prevent destructive dev-server DDL prompts on boot.
- **Migration Idempotency**: Hand-written SQL migrations in `migrations/sql/` (`2026081601`, `2026081602`, `2026081603`, `2026081604`) are additive-only and add necessary tables/columns (`wish_requests`, `wish_comments`, `pages_blocks_video_embed`, `_pages_v_blocks_video_embed`, `staff.slug`).

### Area 4: Build / CI / Tests — FINDING IDENTIFIED
- **Lint & Type Check**: Clean pass.
- **Unit Tests**: 33/33 Vitest unit tests pass.
- **Production Build**: Clean Next.js 15 build pass.
- **Identified Finding**:
  - **Finding F-01 (P1)**: CI Playwright E2E orchestration failure (`ERR_CONNECTION_REFUSED`).

### Area 5: Release-Critical Configuration — VERIFIED (PASS)
- Secrets and credentials default safely to dev fallbacks behind environment variable checks (`PAYLOAD_SECRET`, `DATABASE_URI`, `MINIO_*`).

---

## 2. Detailed Findings Matrix

### [F-01] P1 — GitHub Actions CI Playwright Orchestration Missing Web Server
- **Severity**: P0/P1/P2 -> **P1**
- **Location**: `.github/workflows/ci-cd.yml` (lines 39–54) & `playwright.config.ts`
- **Reproducible Evidence**:
  In `.github/workflows/ci-cd.yml`, job `e2e-and-accessibility` executes `npm run test:e2e` directly without initializing the Next.js web application server first. `playwright.config.ts` targets `http://localhost:3001` but does not include a `webServer` block. Consequently, all 16 Playwright E2E & WCAG 2.2 AA specs fail in CI with `ERR_CONNECTION_REFUSED`.
- **Smallest Safe Fix**:
  Add a `webServer` section to `playwright.config.ts` or add a step in `.github/workflows/ci-cd.yml` to build and launch the application (`npm run build && npm run start`) with a health check before running `npm run test:e2e`.

---

### [F-02] P2 — Direct Anonymous REST API Creation Exposed on ContactMessages & NewsletterSubscribers
- **Severity**: P0/P1/P2 -> **P2**
- **Location**:
  - `src/collections/ContactMessages.ts` (line 29)
  - `src/collections/NewsletterSubscribers.ts` (line 19)
- **Reproducible Evidence**:
  Both collections had `create: () => true` in their `access` configuration. Public form submissions occur via Server Actions (`submitContactMessage` and `submitNewsletterSignup`), which call Payload's Local API (`payload.create()`) and bypass collection-level `access.create`. Setting `create: () => true` at the collection level exposed direct unauthenticated HTTP `POST` access to `/api/contact-messages` and `/api/newsletter-subscribers`, allowing anonymous callers to bypass Server Action input validation (such as subject enum verification).
- **Smallest Safe Fix**:
  Update `create` access on both collections to `adminOrEditorOnly` (matching `DonationPledges`, `Bookings`, `Registrations`, `WishRequests`, `WishComments`).
- **Status**: **FIXED ON THIS BRANCH** (Commit: `85c7b39` / local change).

---

### [F-03] P2 — Media Upload Restricted for Author Role ("Könyvtáros Szerkesztő")
- **Severity**: P0/P1/P2 -> **P2**
- **Location**: `src/collections/Media.ts` (line 21)
- **Reproducible Evidence**:
  `Media.ts` set `create: adminOrEditorOnly`. Users with the `author` role ("Könyvtáros Szerkesztő") are authorized to create and edit news (`News.ts`) and events (`Events.ts`) for their assigned branch library. When an `author` user uploads an image or document attachment via the Payload Admin UI, Payload executes a `POST /api/media` request, which failed with HTTP `403 Forbidden`.
- **Smallest Safe Fix**:
  Update `Media.ts` `create` access to `({ req: { user } }) => Boolean(user)`, enabling all authenticated staff members to upload media files, while leaving `update` and `delete` restricted to `adminOrEditorOnly`.
- **Status**: **FIXED ON THIS BRANCH** (Commit: `85c7b39` / local change).

---

## 3. Empirical Verification Logs

All verification commands were executed locally in the project repository environment:

### Type Check
```bash
$ npm run type-check
> vmk-website@1.0.0 type-check
> tsc --noEmit
Exit Code: 0 (PASSED)
```

### ESLint
```bash
$ npm run lint
> vmk-website@1.0.0 lint
> next lint
✔ No errors found (3 non-blocking unused-variable warnings in frontend components)
Exit Code: 0 (PASSED)
```

### Unit Tests
```bash
$ npm run test:unit
> vmk-website@1.0.0 test:unit
> vitest run
 RUN  v1.6.1 /srv/projects/www-vmk

 ✓ tests/runtime-validation.test.ts (3)
 ✓ tests/scraper.test.ts (30)

 Test Files  2 passed (2)
      Tests  33 passed (33)
   Duration  810ms
Exit Code: 0 (PASSED)
```

### Production Build
```bash
$ npm run build
> vmk-website@1.0.0 build
> next build
   ▲ Next.js 15.4.11
   Creating an optimized production build ...
 ✓ Compiled successfully in 16.0s
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (42/42)
 ✓ Collecting build traces
 ✓ Finalizing page optimization
Exit Code: 0 (PASSED)
```
