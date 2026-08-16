-- Adds the pages_blocks_video_embed table backing VideoEmbedBlock
-- (src/blocks/PageBlocks.ts), which was defined but deliberately left
-- unregistered in PageBlocks[] during A2a/A2b (see commit 0d30284)
-- because registering it without this table made every `pages` query
-- LEFT JOIN a table that didn't exist yet, 404-ing every pages-collection
-- route -- reproduced live and reverted at the time.
--
-- Same hand-written approach as 2026081601 (payload migrate:create still
-- crashes on Node 24.19.0 here): column/index/FK convention reproduced
-- from `\d pages_blocks_contact_info` (closest existing block: a few
-- optional varchar fields, same _order/_parent_id/_path/id/block_name
-- scaffold every Payload block table uses) before writing this, so it
-- matches exactly what Payload's Drizzle layer expects.
--
-- Safe / additive only: one new table, nothing existing altered.

BEGIN;

CREATE TABLE "pages_blocks_video_embed" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	-- Nullable even though the field is `required: true` in PageBlocks.ts:
	-- reproduced from pages_blocks_hero.heading (also required: true) --
	-- Payload/Drizzle doesn't enforce block-field `required` as a DB NOT
	-- NULL constraint (top-level collection fields do get NOT NULL, e.g.
	-- wish_requests.writer; block fields don't, likely so an in-progress
	-- draft block can be saved incomplete). Required-ness is enforced at
	-- the application/validation layer instead.
	"embed_url" varchar,
	"block_name" varchar
);

CREATE INDEX "pages_blocks_video_embed_order_idx" ON "pages_blocks_video_embed" USING btree ("_order");
CREATE INDEX "pages_blocks_video_embed_parent_id_idx" ON "pages_blocks_video_embed" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_video_embed_path_idx" ON "pages_blocks_video_embed" USING btree ("_path");

ALTER TABLE "pages_blocks_video_embed"
	ADD CONSTRAINT "pages_blocks_video_embed_parent_id_fk"
	FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE CASCADE;

COMMIT;
