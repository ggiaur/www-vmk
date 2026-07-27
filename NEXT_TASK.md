# Autonomous Development Task Assignment

* **Date:** 2026-07-27 / Overnight Autonomous Run
* **Current Version:** `v0.2.0-core-cms`
* **Target Version:** `v0.3.0-autonomous-core`
* **Working Branch:** `feature/autonomous-night-run`
* **Goal:** Complete Milestone 2B (Extended CMS Collections & Next.js 15 Frontend Shell Foundation).

---

## 🌿 WORKING BRANCH MANDATE
Before modifying any files:
1. Check current git status: `git status`
2. Create/reset working branch: `git checkout -B feature/autonomous-night-run`
3. Work exclusively on `feature/autonomous-night-run`.

---

## 📋 TASK LIST & PRIORITIZED EXECUTION SEQUENCE

### P1: REQUIRED TASKS (Must complete overnight)

#### 1. Extended CMS Collections (Milestone 2B)
* **`Staff` Collection (`src/collections/Staff.ts`):**
  - Fields: `name`, `position`, `department` (relation -> `Libraries`), `phone`, `email`, `avatar` (relation -> `Media`), `order`.
* **`Documents` Collection (`src/collections/Documents.ts`):**
  - Fields: `title`, `file` (relation -> `Media`), `category` (SZMSZ, Beszámoló, Pályázat, Űrlap), `year`, `downloadCount`.
* **`Services` Collection (`src/collections/Services.ts`):**
  - Fields: `title`, `slug`, `shortDescription`, `pricingTable`, `rulesPdf` (relation -> `Media`), `icon`.
* Register `Staff`, `Documents`, `Services` in `src/payload.config.ts`.

#### 2. Next.js 15 Frontend Shell Foundation
* **Layout Components (`src/components/navigation/`):**
  - `Header.tsx` (Logo, TopBar, Catalog button, i18n/A11y controls).
  - `Footer.tsx` (3-column layout, contact, legal, social links).
  - `Breadcrumb.tsx` (SEO & ARIA accessible).
* **Core UI Components (`src/components/ui/`):**
  - `NewsCard.tsx`, `EventCard.tsx`, `LibraryCard.tsx`, `OpeningHoursWidget.tsx`.
* **App Router Pages (`src/app/(frontend)/`):**
  - `page.tsx` (Főoldal with Hero, Opening Hours Widget, News Grid, Event Grid).
  - `nyitvatartas/page.tsx` (Nyitvatartási mátrix).

#### 3. Validation & Quality Control
* Run `npm run type-check`.
* Run `npm run test:unit`.
* Auto-fix any compilation or test errors.
* Update `PROJECT_STATUS.md`, `CHANGELOG.md`, and `.ai/context/current_state.md`.
* Execute Git commit on `feature/autonomous-night-run` with conventional commit format.

---

### P2: OPTIONAL TASKS (If time permits)
* Meilisearch integration helper client (`src/lib/meilisearch.ts`) and Payload indexing hooks.
* Advanced animations and SEO structured data tuning.

---

## ⚡ COMMIT SAFETY & CODE INTEGRITY MANDATE

Before every commit:
1. **Run** `npm run type-check`.
2. **Run** `npm run test:unit`.
3. **Inspect** `git diff` to confirm cleanliness.
4. **Never** commit secrets or `.env` files.
5. **Never** commit a broken build state.

If a task fails:
1. **Diagnose** the exact error traceback.
2. **Fix** the underlying root cause in code or config.
3. **Re-run** validation (`npm run type-check && npm run test:unit`).
4. **Continue** to the next task in sequence.

**IMPORTANT:** Do NOT wait for human approval during normal development. Only stop if missing credentials, impossible external service access, or critical security decisions block execution. Otherwise continue autonomously until the target milestone is completed.
