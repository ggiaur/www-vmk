# VMK-EDITORIAL-MEDIA-REPLACEMENT-006 — live evidence

**Date:** 2026-09-05
**Slice:** Media replacement (sixth slice; picks up after News, Events, OpeningHours, Pages, Galleries)
**Test:** `tests/e2e/editorial-media-replacement-roundtrip.spec.ts`

## Content path chosen, and why

News (`src/collections/News.ts`) `featuredImage` — a single `relationship`
field to `media` — rendered as exactly one `<img>` on the public route
`src/app/(frontend)/hirek/[slug]/page.tsx` (the `featuredImage`/`featuredImageUrl`/
`featuredImageAlt` derivation around lines 43–47, rendered around lines 84–89).

This was chosen over Galleries' `images` field (an array) because a single
relationship field gives the cleanest possible proof of "the old asset is
gone": after the replacement PATCH there is structurally only one `<img>` in
the DOM. If the new asset's alt text is visible and the old asset's alt text
is not, the reference has genuinely been replaced, not just supplemented.
The "könyvkosár" (book-basket/wishlist) feature was not touched — it is
explicitly out of scope and unrelated to this content path.

A fresh synthetic News record was created and deleted for this test (same
pattern as the prior News round-trip slice), rather than repointing a real
seeded article, to avoid any risk to real editorial content.

## Real round-trip proven

1. Authenticated as the existing seeded admin account (`admin@vmk.hu`, role
   `admin`) via `POST /api/users/login`.
2. Uploaded an OLD media asset with mandatory WCAG 2.2 AA alt text via
   `POST /api/media`.
3. Published a News article via `POST /api/news` (`_status: published`) with
   `featuredImage` set to the OLD asset.
4. Verified via real browser navigation (`/hirek/<slug>`) that the OLD image
   renders, matched by its unique alt text (`getByRole('img', { name: oldAlt })`).
5. Uploaded a NEW, distinct media asset (different image bytes, different
   alt text) via `POST /api/media`.
6. Replaced the article's media reference from the OLD asset to the NEW one
   via `PATCH /api/news/:id` — the same update path a real editor uses.
7. Verified via real browser navigation that:
   - the NEW image renders, matched by its unique alt text; and
   - the OLD image/alt text is no longer present anywhere on the page
     (`not.toBeVisible()` **and** `getByAltText(oldAlt)).toHaveCount(0)` —
     a double, non-weakened check, not just "not currently in viewport").
8. Server logs confirm the mechanism directly: before the PATCH the page
   requests `GET /api/media/file/editorial-media-replacement-old.png`; after
   the PATCH the same route only requests
   `GET /api/media/file/editorial-media-replacement-new.png` — the old file
   is never fetched again once the reference is replaced.
9. Screenshot captured: `docs/evidence/EDITORIAL-MEDIA-REPLACEMENT-2026-09-05.png`
   (shows the NEW asset — a solid red 1×1 PNG — rendered as the article's
   cover image).
10. Cleaned up in a `finally` block: deleted the News record and both the
    OLD and NEW media assets, leaving no synthetic content or orphaned media
    in the shared environment. Confirmed via dev-server logs
    (`DELETE /api/news/1009 200`, `DELETE /api/media/997 200`,
    `DELETE /api/media/998 200`).

## Defect found and fixed during verification

No defect in the application code was found this slice. The first test run
did fail (`"Hiba történt a fájl feltöltése közben."` / file upload error on
the second, "NEW" media upload) — but root-causing it showed the bug was in
the test's own fixture data, not the app: the hand-written "distinct PNG"
byte string for the NEW asset was not valid PNG data (decoded to a
corrupted/truncated image; `PIL.UnidentifiedImageError` confirmed this
independently outside the app). Payload's upload pipeline correctly rejected
it. Fixed by generating a genuinely valid, genuinely distinct 1×1 PNG (solid
red, produced with Pillow) for the NEW asset. Re-ran: full round trip passes
for a real reason — this run's failure was a test-fixture bug, not an
application defect, and is reported as such rather than glossed over.

## Environment

- Dev server: `next dev` on port 3011 (tmux session `vmk-dev`), against the
  existing `vmk-postgres` Docker container (port 5432, matching `.env`'s
  `DATABASE_URI`). Reused as-is; not restarted or reseeded.
- No new credentials created; reused the existing seeded admin account
  already present in this database from prior sessions.
- `PLAYWRIGHT_BASE_URL=http://localhost:3011`,
  `E2E_EDITORIAL_ADMIN_EMAIL` / `E2E_EDITORIAL_ADMIN_PASSWORD` supplied as
  process env vars only, never committed.
- Worktree note: the task's canonical instructions called for a fresh
  `git worktree add` off `agent/visual-clone-oracle` inside
  `/srv/projects/www-vmk`. The session executing this slice was itself
  already pinned (by its own launch isolation) to a pre-existing worktree at
  `.claude/worktrees/j2-ci-fix` on local branch `worktree-j2-ci-fix`, and its
  Bash tool structurally refuses any git operation (`cd`, `-C`, or working
  directory switch) targeting a path outside that pinned worktree — so a
  second worktree could not be entered or operated on. Inspection showed
  `worktree-j2-ci-fix` had forked from `agent/visual-clone-oracle` at
  `42feb57` and independently reproduced identical News/OpeningHours/Pages/
  Galleries content under different commit SHAs (verified byte-identical via
  `git diff` tree comparisons) while missing the 13 newer commits already
  merged upstream (including the real Events slice). It was reconciled with
  `git reset --hard origin/agent/visual-clone-oracle` before starting this
  slice's work, making it an exact, fast-forwardable mirror of the shared
  integration branch tip (`1f285e8`).

## Next approved content-type slice

Per the directive, remaining candidate slices continue the same
admin → publish → public pattern proven across News, Events, OpeningHours,
Pages, Galleries, and now media replacement.
