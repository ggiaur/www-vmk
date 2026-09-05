# VMK-EDITORIAL-ADMIN slice — Events — live evidence

**Date:** 2026-09-05
**Slice:** Events (second content type, after News)
**Test:** `tests/e2e/editorial-events-roundtrip.spec.ts`

## Real round-trip proven

1. Authenticated as the existing seeded admin account (`admin@vmk.hu`) via `POST /api/users/login`.
2. Fetched an existing `libraries` record to satisfy the `events` collection's required `location` relationship (no invented data).
3. Created an `events` draft (`_status: draft`) — verified via real browser navigation that the draft title is **not** visible on its public route (`/esemenyek/<slug>`).
4. Edited the title and published (`_status: published`) via `PATCH /api/events/:id`.
5. Verified via real browser navigation that the published record **is** visible on the public route, with the edited title and description text present.
6. Screenshot captured: `docs/evidence/EDITORIAL-EVENTS-ROUNDTRIP-2026-09-05.png`.
7. Cleaned up (deleted the event record) in a `finally` block.

## Schema/behavior notes discovered (no defect found this time)

- `events` requires `location` (relationship to `libraries`), `startDate`, `targetAudience`, and `description` (richText) -- reused an existing library rather than inventing one.
- The public event-detail page (`src/app/(frontend)/esemenyek/[slug]/page.tsx`) does **not** 404 when a slug isn't found (draft or nonexistent) -- it silently renders hardcoded fallback/placeholder content instead. This does not invalidate the draft-hidden assertion (the real draft's exact title never appears either way), but it's worth flagging separately: a genuinely mistyped/missing public event URL currently shows fake sample content to a real visitor instead of a not-found state. Not fixed here (out of scope for this slice, not a regression from this work) -- noting it for a future slice.
- Unlike News, the event-detail page does not render `featuredImage` at all, so no image-visibility assertion was included for this content type.
- `getEventBySlug` in `src/lib/payload.ts` correctly filters `_status: 'published'` server-side -- the access-control/query layer is correct; only the page's client-facing fallback-on-null behavior is the noted quirk above.

## Environment

Same dev server (`vmk-dev` tmux, port 3011) and seeded admin account as the News slice; no new credentials or servers needed.

## Next approved content-type slice

Per the standing directive: OpeningHours, Pages, and Galleries remain as candidate next slices.
