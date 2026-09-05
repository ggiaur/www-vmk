-- Adds a `slug` column to `staff` for individual profile pages
-- (src/collections/Staff.ts). Root cause of a large depth-2 first-hop
-- gap (E1 audit, 2026-08-16): 73 of ~264 depth-2 MISSING routes are
-- individual staff bio pages linked from /munkatarsak on the reference
-- site (e.g. /anyos-darinka, /bertalan-erika). The people themselves
-- already exist as real `staff` rows (name/position/phone/email/
-- department all already imported by an earlier scraping pass) -- only
-- the individual-page routing was missing, not the content.
--
-- Hand-written (payload migrate:create still crashes on Node 24 here,
-- see COLLAB.md Phase B/D3): additive-only, one nullable unique column,
-- nothing existing altered.

BEGIN;

ALTER TABLE "staff" ADD COLUMN "slug" varchar;
CREATE UNIQUE INDEX "staff_slug_idx" ON "staff" USING btree ("slug");

COMMIT;
