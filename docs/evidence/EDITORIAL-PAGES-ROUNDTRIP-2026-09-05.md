# VMK-EDITORIAL-ADMIN-FIRST-EXECUTABLE-SLICE-001 — live evidence

**Date:** 2026-09-05
**Slice:** Pages (fourth content-type slice, after News, Events, OpeningHours)
**Test:** `tests/e2e/editorial-pages-roundtrip.spec.ts`

## Data model

`Pages` (`src/collections/Pages.ts`) has the same draft/publish lifecycle as
News/Events (`versions.drafts: true`, read access gated on `_status:
'published'` — see `getPageBySlug` in `src/lib/payload.ts`). Unlike News/
Events, its content is a Payload block-builder field (`layout`, type
`blocks`) rather than a single body field — the collection already holds 52
real migrated content records (per an existing code comment from the A2a/A2b
route-parity work). Public rendering goes through the generic catch-all route
`src/app/(frontend)/[...slug]/page.tsx`, which resolves `getPageBySlug(slug)`
before falling through to staff-bio and gallery-archive resolution for the
same namespace, and renders matched pages via `PageBlockRenderer`.

## Real round-trip proven

1. Authenticated as the existing seeded admin account (`admin@vmk.hu`) via `POST /api/users/login`.
2. Created a `pages` draft (`_status: draft`) with a single `richText` block in its `layout` array via `POST /api/pages`.
3. Verified via real browser navigation that the draft's public route (`/<slug>`) returns HTTP 404 (Pages has no dedicated draft-preview path, unlike News/Events' visible-but-unpublished-looking behavior — a 404 is the correct signed of "not resolved by `getPageBySlug`").
4. Edited the title and the richText block's content, then published (`_status: published`) via `PATCH /api/pages/:id`.
5. Verified via real browser navigation that the published page **is** visible at `/<slug>`, with the edited title (as an `h1`) and the edited richText block content both present — proving both the draft/publish gate and the block-builder round trip.
6. Screenshot captured: `docs/evidence/EDITORIAL-PAGES-ROUNDTRIP-2026-09-05.png`.
7. Cleaned up (deleted the page record) in a `finally` block. Independently re-verified afterward via a direct `GET /api/pages?limit=200` that no `e2e-szerkesztoi-oldal-*` slug remains — confirmed, zero leftover.

**Result:** passed on first run — no defect found or needed fixing in this slice.

## Environment

- Dev server: `next dev` on port 3011 (tmux session `vmk-dev`), against the existing `vmk-postgres` Docker container.
- No new credentials created; reused the existing seeded admin account.
- `PLAYWRIGHT_BASE_URL=http://localhost:3011`, `E2E_EDITORIAL_ADMIN_EMAIL`/`E2E_EDITORIAL_ADMIN_PASSWORD` supplied as process env vars only, never committed.

## Next approved content-type slice

Galleries — to follow next, adapted per its actual data model the same way each prior slice was.
