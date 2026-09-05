# VMK-EDITORIAL-ADMIN-FIRST-EXECUTABLE-SLICE-001 — live evidence

**Date:** 2026-09-05
**Slice:** OpeningHours (third content-type slice, after News and Events)
**Test:** `tests/e2e/editorial-openinghours-roundtrip.spec.ts`

## Data model differs from News/Events

`OpeningHours` has no draft/publish lifecycle (`_status`) — it's a flat,
always-public collection: one record per `library` + `dayOfWeek`. There is
exactly one real record in the database (central library, Monday,
`openTime: 08:00`, `closeTime: 18:00`). Visibility is entirely mediated by
Next.js on-demand ISR: Payload's `afterChange`/`afterDelete` hooks in
`src/lib/revalidateLibraryPages.ts` call `revalidatePath` on a fixed list of
consuming routes (`/`, `/kapcsolat`, `/nyitvatartas`, `/reszlegek`,
`/tagkonyvtarak`) — a fix built after an earlier session found that an admin
edit updated Postgres/REST immediately but the public page kept serving
stale build-time HTML.

The per-branch/-department detail routes (`/tagkonyvtarak/[slug]`,
`/reszlegek/[slug]`) are type-gated (`branch`/`department`) and don't render
the `central`-type library that owns the only real record, so `/nyitvatartas`
(the dedicated overview page, which queries `getAllLibraries()` /
`getAllOpeningHours()` directly) is the correct public target for this slice.

Because there's no draft state and no safe way to create a duplicate
day/library record, the test pattern here is **edit existing record → verify
public page → revert**, not News/Events' create → verify → delete.

## Real round-trip proven

1. Authenticated as the existing seeded admin account (`admin@vmk.hu`) via `POST /api/users/login`.
2. Fetched the one real opening-hours record via `GET /api/opening-hours?limit=1`.
3. Patched its `closeTime` to a unique test value via `PATCH /api/opening-hours/:id`.
4. Verified via real browser navigation to `/nyitvatartas` that the new closing time is visible.
5. Screenshot captured: `docs/evidence/EDITORIAL-OPENINGHOURS-ROUNDTRIP-2026-09-05.png`.
6. Reverted `closeTime` to its original value in a `finally` block.
7. Independently double-checked via a direct `GET /api/opening-hours/:id` (outside the test) that the revert took effect — confirmed.

**Result:** passed on first run — no defect found or needed fixing in this slice.

## Environment

- Dev server: `next dev` on port 3011 (tmux session `vmk-dev`), against the existing `vmk-postgres` Docker container.
- No new credentials created; reused the existing seeded admin account.
- `PLAYWRIGHT_BASE_URL=http://localhost:3011`, `E2E_EDITORIAL_ADMIN_EMAIL`/`E2E_EDITORIAL_ADMIN_PASSWORD` supplied as process env vars only, never committed.

## Next approved content-type slices

Pages, then Galleries — to follow the same pattern, adapted per each
collection's actual data model as this slice was.
