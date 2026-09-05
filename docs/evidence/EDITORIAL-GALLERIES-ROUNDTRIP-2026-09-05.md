# VMK-EDITORIAL-ADMIN-FIRST-EXECUTABLE-SLICE-001 — live evidence

**Date:** 2026-09-05
**Slice:** Galleries (fifth and last content-type slice, after News, Events, OpeningHours, Pages)
**Test:** `tests/e2e/editorial-galleries-roundtrip.spec.ts`

## Data model

`Galleries` (`src/collections/Galleries.ts`) has no draft/publish lifecycle —
`read: () => true` unconditionally, so a created record is immediately
public (unlike News/Events/Pages). Its identifying content is `title` +
`slug`, plus an `images` media relationship (`hasMany`) rendered as a grid.
Public route: `src/app/(frontend)/galeria/[slug]/page.tsx`, via
`getGalleryBySlug` (no `_status` filter in its query, confirming the
always-public model). The page has a documented empty-state string when
`images` is empty.

## Real round-trip proven

1. Authenticated as the existing seeded admin account (`admin@vmk.hu`) via `POST /api/users/login`.
2. Created a `galleries` record (title + slug only, no images yet) via `POST /api/galleries`.
3. Verified via real browser navigation that it's immediately visible at `/galeria/<slug>` — with the documented empty-state text ("Ehhez a galériához még nincsenek feltöltött képek.") since it has no draft gate to round-trip.
4. Uploaded a real media asset with mandatory WCAG 2.2 AA alt text via `POST /api/media` (reusing the `_payload` multipart-wrapping fix proven in the News slice).
5. Attached the uploaded media to the gallery's `images` field via `PATCH /api/galleries/:id`.
6. Verified via real browser navigation that the public page now shows the image, matched by its alt text.
7. Screenshot captured: `docs/evidence/EDITORIAL-GALLERIES-ROUNDTRIP-2026-09-05.png`.
8. Cleaned up (deleted the gallery record and media asset) in a `finally` block. Independently re-verified afterward via a direct `GET /api/galleries?limit=200` that no `e2e-szerkesztoi-galeria-*` slug remains — confirmed, zero leftover.

**Result:** passed on first run — no defect found or needed fixing in this slice.

## Environment

- Dev server: `next dev` on port 3011 (tmux session `vmk-dev`), against the existing `vmk-postgres` Docker container.
- No new credentials created; reused the existing seeded admin account.
- `PLAYWRIGHT_BASE_URL=http://localhost:3011`, `E2E_EDITORIAL_ADMIN_EMAIL`/`E2E_EDITORIAL_ADMIN_PASSWORD` supplied as process env vars only, never committed.

## Slice series complete

This closes the VMK-EDITORIAL-ADMIN-FIRST-EXECUTABLE-SLICE-001 content-type
series: News (`2cc2a5b`), Events (`74de1b9`), OpeningHours (`2890497`),
Pages (`09a3192`), Galleries (this slice) — five content types, each
adapted to its actual data model (draft/publish vs. always-public,
single-field vs. block-builder content, create/delete vs. edit/revert),
each proven with a genuine round trip against the live dev server and real
browser evidence, one real defect found and fixed along the way (the News
slice's Payload `_payload` multipart bug).
