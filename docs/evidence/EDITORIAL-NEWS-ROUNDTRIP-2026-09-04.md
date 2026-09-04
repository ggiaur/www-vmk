# VMK-EDITORIAL-ADMIN-FIRST-EXECUTABLE-SLICE-001 — live evidence

**Date:** 2026-09-04
**Slice:** News (chosen as the smallest approved content type needing no PO decision)
**Test:** `tests/e2e/editorial-news-roundtrip.spec.ts`

## Real round-trip proven

1. Authenticated as the existing seeded admin account (`admin@vmk.hu`, role `admin`) via `POST /api/users/login`.
2. Uploaded a real media asset with mandatory WCAG 2.2 AA alt text via `POST /api/media`.
3. Created a `news` draft (`_status: draft`) — verified via real browser navigation that the draft is **not** visible on its public route (`/hirek/<slug>`).
4. Edited the title and attached the uploaded media, then published (`_status: published`) via `PATCH /api/news/:id`.
5. Verified via real browser navigation that the published record **is** visible on the public route, with the edited title, summary, body text, and the uploaded image (matched by its alt text) all present.
6. Screenshot captured: `docs/evidence/EDITORIAL-NEWS-ROUNDTRIP-2026-09-04.png`.
7. Cleaned up (deleted the news record and media asset) in a `finally` block, leaving no synthetic content in the shared environment.

## Real defect found and fixed during verification

Payload's REST upload endpoint (`POST /api/media`) reads non-file fields from a single `_payload` multipart field containing a JSON string, not from bare top-level multipart fields. The test's original attempt sent `alt` as a bare multipart field, which Payload silently ignored, producing a **real** `"alt is required"` validation failure on first run. Confirmed the exact mechanism by reading Payload's own `addDataAndFileToRequest.js` source. Fixed by wrapping the field data in `_payload: JSON.stringify({ alt: ... })`. Re-ran: full round-trip passes.

## Environment

- Dev server: `next dev` on port 3011 (tmux session `vmk-dev`), against the existing `vmk-postgres` Docker container (port 5432, matching `.env`'s `DATABASE_URI`).
- No new credentials created; reused the existing seeded admin account already present in this database from prior sessions.
- `PLAYWRIGHT_BASE_URL=http://localhost:3011`, `E2E_EDITORIAL_ADMIN_EMAIL`/`E2E_EDITORIAL_ADMIN_PASSWORD` supplied as process env vars only, never committed.

## Next approved content-type slice

Per the directive, the next candidate slices are Events, OpeningHours, Pages, and Galleries -- to be prepared/executed next, following the same admin->publish->public pattern proven here.
