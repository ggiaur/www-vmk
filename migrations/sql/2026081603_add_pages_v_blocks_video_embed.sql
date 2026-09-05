-- Follow-up to 2026081602: Pages has `versions: { drafts: true }`
-- (src/collections/Pages.ts), so every block type needs a matching
-- "_pages_v_blocks_*" versions-table in addition to the live
-- "pages_blocks_*" table -- missed in 2026081602, caught immediately by
-- an actual save attempt through the real admin UI (COLLAB.md 4: don't
-- trust a migration until something real writes through it), which
-- failed with "relation _pages_v_blocks_video_embed does not exist".
--
-- Reproduced from `\d _pages_v_blocks_contact_info`: same shape as the
-- live table but `id` is an integer sequence (not the live table's
-- varchar block id) and there's an extra `_uuid` varchar column that
-- correlates a version-table row back to its live block id; `_parent_id`
-- references `_pages_v(id)`, not `pages(id)`.

BEGIN;

CREATE TABLE "_pages_v_blocks_video_embed" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"embed_url" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE INDEX "_pages_v_blocks_video_embed_order_idx" ON "_pages_v_blocks_video_embed" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_video_embed_parent_id_idx" ON "_pages_v_blocks_video_embed" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_video_embed_path_idx" ON "_pages_v_blocks_video_embed" USING btree ("_path");

ALTER TABLE "_pages_v_blocks_video_embed"
	ADD CONSTRAINT "_pages_v_blocks_video_embed_parent_id_fk"
	FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE CASCADE;

COMMIT;
