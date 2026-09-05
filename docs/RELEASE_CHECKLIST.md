# Release checklist — `agent/visual-clone-oracle` → `main`

Ez a lista a J1 (PR/release package finalization) kör terméke. A branch
kódszinten **RC GO** (lásd `COLLAB.md` I1 szakasz és `docs/FULL_SITE_ROUTE_MATRIX.md`),
de a végső merge és a production launch **külön, ember által jóváhagyott
döntés** -- ez a checklist a launch felé vezető, még hátralévő, jellemzően
infra-jellegű lépéseket sorolja fel, nem a branch kódját auditálja újra.

Ismeretlen paramétereket (host, credential, DNS target) szándékosan nem
találtunk ki -- azok a `[KITÖLTENDŐ]` jelölésű helyeken maradnak.

## 1. Production env / secret konfiguráció

- [ ] `DATABASE_URI` production Postgres-re mutat (nem a dev `vmk_user:vmk_password@localhost` fallback-ra — lásd `src/payload.config.ts`).
- [ ] `PAYLOAD_SECRET` production-egyedi, nem a dev/repo default.
- [ ] MinIO/S3 (`S3_*` / storage plugin env) production bucket + kulcsok, nem a dev MinIO konténer.
- [ ] Meilisearch (`MEILI_*`) production instance + master key.
- [ ] Minden secret titkos tárolóból jön (nem `.env` commitolva) -- `git log -p -- .env` ellenőrzése, hogy sosem került verziókezelésbe.
- [ ] `NODE_ENV=production` a deploy célkörnyezetben (ez zárja le a `/api/dev-scrape-pages` és `/api/dev-backfill-staff-slugs` végpontokat -- lásd I1.2).

## 2. Adatbázis biztonság

- [ ] Friss DB backup/snapshot közvetlenül a deploy előtt.
- [ ] Backup visszaállítási eljárás ismert és (staging-en) tesztelt.
- [ ] `push: false` változatlanul érvényes (`src/payload.config.ts`) -- **ne kapcsold vissza `true`-ra productionben**, ez volt az eredeti P0 (lásd COLLAB.md Phase B).

## 3. Migrációk

- [ ] `migrations/sql/*.sql` (4 fájl: `wish_requests`/`wish_comments`, `pages_blocks_video_embed`, `pages_v_blocks_video_embed`, `staff_slug`) lefuttatva a production DB-n merge/deploy előtt.
- [ ] Migráció-futtatás sorrendje és eredménye naplózva.
- [ ] Migráció utáni `payload generate:types` / schema-konzisztencia ellenőrzés (ismert korlát: `payload migrate:create`/`generate:types` `ERR_REQUIRE_ASYNC_MODULE` a `@payloadcms/richtext-lexical` ESM/top-level-await miatt -- lásd COLLAB.md D3; a hand-written SQL migráció ezt megkerüli, de az ellenőrzést ez nem helyettesíti).

## 4. `new.vmk.hu` DNS / deploy

- [ ] DNS A/AAAA (vagy CNAME) rekord létrehozása a `new.vmk.hu`-hoz. Jelenleg **nincs feloldható rekord** (`dig new.vmk.hu` üres, `NXDOMAIN` -- megerősítve I1.4-ben, nem sandbox-korlátozás: `www.vmk.hu` és `github.com` ugyanabból a környezetből feloldódik).
- [ ] TLS/HTTPS tanúsítvány kiadva és érvényes a `new.vmk.hu`-ra.
- [ ] `[KITÖLTENDŐ]`: tényleges hosting/deploy célkörnyezet (platform, régió, build pipeline) -- ez a repóból nem derül ki, launch-felelős tölti ki.

## 5. Deploy

- [ ] Build pipeline lefuttatva a célkörnyezetben (`npm run build`, ugyanaz, amit ez a kör lokálisan PASS-szal igazolt).
- [ ] Deploy végrehajtva.
- [ ] `NODE_ENV=production` megerősítve a futó instance-on (nem csak a build-time env-ben).

## 6. Publikus smoke teszt (deploy után, `new.vmk.hu`-n)

- [ ] `/` → `200`
- [ ] `/hirek` → `200`
- [ ] `/esemenyek` → `200`
- [ ] `/galeria` → `200`
- [ ] `/munkatarsak` → `200`
- [ ] `/wishbasket` → `200`
- [ ] `/admin` → elérhető (login oldal betöltődik, credential megosztása nélkül)

## 7. Publikus auth/admin smoke

- [ ] Admin bejelentkezés működik productionben.
- [ ] Egy admin edit (pl. egy Library mező) valós idejű propagáció a publikus oldalra (a `revalidateLibraryConsumingPages` hook élesben is fusson le -- lásd `src/lib/revalidateLibraryPages.ts`).
- [ ] Anonim REST write sweep megismétlése productionben legalább mintavételesen (pl. `wish-requests`, `users`, `pages` POST/PATCH/DELETE → `403` várt) -- ugyanaz a 19×3 mátrix, amit I1.2 lokálisan igazolt, most a valós domainen.

## 8. Publikus first-hop kritikus route minta

- [ ] `docs/FIRST_HOP_ROUTE_MATRIX.md`-ből legalább 5-10 reprezentatív route (vegyesen CLONED/redirect) manuális vagy szkriptelt ellenőrzése productionben.
- [ ] Legalább egy legacy redirect élesben (pl. `/gallery` → `/galeria`, vagy `/wishbasket/archive` → `/wishbasket`).
- [ ] Frontend keresés (`/kereses`) élesben: query → találati lista → navigáció.

## 9. Rollback

- [ ] Rollback eljárás dokumentált (előző deploy/image visszaállítása, vagy DNS visszaállítás, a platform szerint -- `[KITÖLTENDŐ]`, platformfüggő).
- [ ] Rollback trigger-feltételek rögzítve, pl.:
  - `/` vagy bármely 6. pontbeli route nem `200` a deploy utáni X percben;
  - admin login nem működik;
  - hibaarány/500-as válaszok a post-deploy logban egy küszöb fölött;
  - DB migráció hibával állt le.
- [ ] Ki jogosult rollbacket elrendelni -- `[KITÖLTENDŐ]`.

## 10. Post-deploy ellenőrzés

- [ ] Alkalmazás-log átnézése hibákért/warningokért közvetlenül a deploy után.
- [ ] DB-kapcsolat, storage (MinIO/S3), Meilisearch health-check zöld.
- [ ] Legalább egy valós felhasználói workflow (pl. wishbasket beküldés) végigfuttatva productionben, majd a teszt-rekord eltávolítva.

---

## Fontos: RC GO ≠ launch GO

A branch kódszinten review-kész (`COLLAB.md` I1 szakasz), de e checklist
1-10. pontjai közül jelenleg **egy sincs végrehajtva** ebből a
fejlesztői környezetből (nincs production credential, nincs
gh/deploy-hozzáférés ehhez a sandboxhoz). A launch-lépéseket a
megfelelő infra-hozzáféréssel rendelkező fél végzi; ez a dokumentum a
sorrend és a nem kihagyható tételek rögzítésére szolgál, nem azok
elvégzésére.
