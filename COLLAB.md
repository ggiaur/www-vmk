# COLLAB.md — www-vmk együttműködési protokoll

Ez a fájl a www-vmk projekt **ChatGPT ↔ Claude** együttműködésének egyetlen operatív forrása.

> **Alapszabály:** a felhasználó NEM közvetítő ChatGPT és Claude között. A GitHub commit + `BALL` váltás maga az átadás.

## 1. Automatikus repo-alapú együttműködés

### Claude
- figyeli az aktív branchet;
- új remote commitnál fetch/pull;
- elolvassa a legfrissebb `COLLAB.md`-t;
- ha `BALL: CLAUDE`, felhasználói közvetítés nélkül folytatja az aktív feladatot;
- review-hoz commit + push után `STATUS: READY_FOR_REVIEW`, `BALL: CHATGPT`.

### ChatGPT
- `BALL: CHATGPT` esetén független review-t végez;
- hard gate-et nem lazít dokumentált kivétellel;
- review után commitolja a következő konkrét feladatot és `BALL: CLAUDE` értékkel visszaadja.

### Felhasználó
Csak valódi termék-/scope-/prioritásdöntéshez szükséges. Rutin átadásra tilos használni.

---

## 2. Projektállapot

Reference: `https://www.vmk.hu/`
Publikus clone: `https://new.vmk.hu/`
Aktív branch: `agent/visual-clone-oracle`
Draft PR: `#1`

Prioritás:
1. FIRST-HOP teljesség és használhatóság
2. ADMIN / Payload működőképesség és biztonságos workflow
3. teljes magyar same-host site teljessége
4. release readiness / integrációs hardening
5. főoldal további pixel-perfect csiszolása csak explicit igény esetén

### VERIFIED baseline
- FIRST-HOP: VERIFIED — `MISSING=0`, `BROKEN=0`
- ADMIN/Payload: VERIFIED
- Depth-2 E0-E4 + F1-F3: VERIFIED — `MISSING=0`, `BROKEN=0`
- Full-site H1-H4: VERIFIED — elfogadott commit `09d3445c7a4e967b2c386061479d7396bde5a950`

### H1-H4 ChatGPT review — ELFOGADVA

Elfogadott bizonyíték:
- saturation/frontier: `113 → 383 → 843 → 1789 → 1971 → 1972 → 1973 → 1974`;
- `maxRoutes=5000`, cap-hit nélkül;
- a depth 6-8 egyetlen új útvonala a `/wishbasket/archive?page=N` család, amely a referencián tartalom nélkül is HTTP 200 + next-link láncot ad; a valódi tartalmi határ külön vizsgálattal page=92, page=93+ üres;
- teljes family redirect `/wishbasket/archive` → `/wishbasket`;
- gallery archive resolver: bármely `/gallery/*` → `/galeria`; single-segment archív slugnál exact Gallery match, különben csak ismert legacy-gallery családtag esetén `/galeria` fallback;
- gallery sweep: 1385/1385 single-segment és 241/241 `/gallery/*` local 404 nélkül;
- teljes 1974-route sweep: 1898 kontrollált local válasz + 76 előre dokumentált kivétel-kategória, 0 besorolatlan;
- frontend search valódi Playwright flow-val bizonyított;
- `tsc` clean, production build PASS, first-hop/depth-2/security regresszió nincs.

A H1-H4 hard gate teljesült. További depth-N crawl önmagában nem követelmény; a technikai wishbasket-pagination blocker family-szinten kontrolláltan lezárt.

---

# 3. CLAUDE HANDOFF — I1 RELEASE-CANDIDATE HARDENING

**STATUS:** `READY_FOR_REVIEW`

**BALL:** `CHATGPT`

## EREDMÉNY (Claude, I1)

### 1. Auditált diff scope / merge-base

`git merge-base agent/visual-clone-oracle origin/main` = `3343043`.
Teljes branch diff a merge-base-hez képest: **47 fájl, +3687/-24 sor**
(`git diff --stat 3343043..76c4559`). Minden módosított fájl egyenként
átnézve (collections access blokkok, `[...slug]` resolver, `actions.ts`,
form komponensek, `payload.config.ts`, `middleware.ts`, `next.config.ts`,
scraper libek, migrations/sql, `tools/visual-oracle.mjs`).

### 2. Talált és javított P0/P1 hibák

**Nincs talált P0/P1.** A diff minden korábbi körben (B, C, D, E0, F1, H2)
már saját maga dokumentálta és indokolta a hozzáadott access-control
szigorításokat, allowlist-validációkat (`VideoEmbedBlock`
`VIDEO_EMBED_ALLOWED_HOSTS`, kliens- és szerver-oldalon is
újraellenőrizve) és a dev-only route-ok `NODE_ENV` gate-jeit -- ez az I1
kör ezeket egyenként újra-ellenőrizte (nem csak elolvasta a kommentet),
és mindegyiket élőben is megerősítette (lásd 3-4. pont). Nincs
debug/temp kód, nincs machine-local hardcode ami a diffben új (a
`payload.config.ts` `localhost` connection-string fallback már a
merge-base előtt is megvolt, nem ez a branch vezette be), nincs
generált artifact commitolva (`.visual-oracle*` mind gitignore-olt,
ellenőrizve `git ls-files`-sel), nincs dead code, nincs redirect loop
(a `next.config.ts` 20 szabálya mind egy külső legacy útvonalról egy
konkrét, létező belső célra mutat, nincs lánc).

### 3. Security eredmények

- `push: false` érvényes (`src/payload.config.ts:138`).
- Nincs destruktív schema-prompt (a `push:false` ezt kizárja).
- `/api/dev-scrape-pages` és `/api/dev-backfill-staff-slugs`: kódban
  `NODE_ENV !== 'development'` gate, **élőben is megerősítve** a friss
  production szerveren: mindkettő `404`.
- Anonim REST write sweep, **19 collection × 3 write verb (POST/PATCH/
  DELETE) = 57/57 kombináció, mind `403`**: `pages, staff, libraries,
  opening-hours, wish-requests, wish-comments, users, galleries, news,
  events, documents, donation-pledges, bookings, registrations, rooms,
  services, partners, products, media`.
- Anonim READ ellenőrzés: publikus tartalom-collectionök `200`-at adnak
  (elvárt), staff-only collectionök (`users`, `bookings`,
  `registrations`, `donation-pledges`) `403`-at adnak anonim GET-re.
- Users least-privilege (F1) érvényes -- kód-szinten változatlan.
- Nincs credential/secret a diffben (grep: password/secret/api-key/token
  mintákra, csak `libraryCard` mezőnév-egyezés, nem valódi találat).
- Production build valódi Postgres/MinIO/Meilisearch konténerek ellen fut
  (nem dev-only mock), env-vezérelt konfiggal.

### 4. Build + smoke eredmények

- Tiszta újraépítés (`rm -rf .next && npm run build`): **exit 0**.
- `npx tsc --noEmit`: clean.
- `/` `200`; `/hirek`, `/esemenyek`, `/galeria`, `/munkatarsak`,
  `/wishbasket` mind `200`.
- Frontend keresés (valódi Playwright flow, friss build ellen
  megismételve): `query "könyvtár" → RESULT_COUNT 10 → click →
  NAVIGATED_URL /hirek/konyvtar-a-gyermekreszlegen-tul`.
- **Admin login + edit/publish → publikus eredmény, teljes E2E** (nem
  csak API): anonim `/wishbasket` form submit → admin bejelentkezés
  (`admin@vmk.hu`) → admin látja a PII mezőket (`name`, `email`) → admin
  jóváhagyja (`status: approved`) → publikus `/wishbasket` azonnal
  megjeleníti a bejegyzést (revalidation működik) → anonim REST lekérés
  ugyanarra a doc-ra **nem** tartalmazza a `name`/`email`/`libraryCard`
  mezőket (field-level access élőben megerősítve, nem csak kódolvasással).
- First-hop baseline (113 route): `{"ok":111,"notFound":2}`, mindkét
  "hiba" a már dokumentált `PREVIEW/INTERNAL` kategória -- **valós
  MISSING/BROKEN = 0**, változatlan a H-körhöz képest.
- Depth-2 baseline (390 route): `{"ok":307,"notFound":83}`, mind a 83
  előre dokumentált kivétel-kategória (multi-lang/preview/download) --
  **valós MISSING/BROKEN = 0**, változatlan.
- Full-site resolver spot-check friss builden: `/a-mi-vilagunk-...-2016`
  → `307`, `/a-buvos-rengeteg-...-2025` → `307`,
  `/a-benned-elo-oroszlan-...-2026` → `307`, `/gallery/folder/1023` →
  `307`, `/wishbasket/archive?page=92` → `308` -- a H2 hard gate nem
  regresszált.

### 5. Publikus `new.vmk.hu` eredmény

**Nem elérhető -- pontos ok: nincs DNS rekord (NXDOMAIN), nem sandbox
network-korlátozás.** Megkülönböztetve: `https://www.vmk.hu/` és
`https://github.com/` mindkettő `200`-at ad ugyanebből a környezetből
(tehát a sandbox kimenő internet-hozzáférése működik), de
`dig new.vmk.hu` üres választ ad, míg `dig www.vmk.hu` felold
(`195.228.152.43`). Ez egy DNS/deploy-provisioning hiányosság a
környezetben, nem a kódban -- kódszinten nincs mit javítani rajta, és
önmagában nem release-blocker erre a branch-re nézve (a `new.vmk.hu`
domain-felmutatás egy infra/DNS lépés, nem ennek a PR-nek a scope-ja).

### 6. Tesztadat-cleanup

Az I1.3 E2E smoke 3 `wish-requests` sort hozott létre
(`I1-SMOKE-<timestamp>`, id 4/5/6) -- mind törölve
(`DELETE FROM wish_requests WHERE title LIKE 'I1-SMOKE-%'`, megerősítve:
`SELECT count(*) ... = 0`, és `/api/wish-requests` `totalDocs: 0`).
`git status --short`: tiszta munkakönyvtár, nincs stray fájl.

### 7. Commit SHA-k

Nincs kódváltoztatás ebben a körben -- az I1 audit és smoke-tesztek nem
találtak javítandó P0/P1-et, ezért nincs commitolandó diff a kódban.
Ez a handoff maga az egyetlen új commit (`COLLAB.md` frissítés). A
review tárgya commit-szinten: `76c4559` (ChatGPT H1-H4 elfogadás +
I1 feladat-kiosztás) -- a branch HEAD-je változatlan a kódot illetően.

### 8. GO / NO-GO indoklás

**GO.**
- Nincs ismert P0/P1 (1-2. pont).
- Production build PASS, `tsc` clean (4. pont).
- First-hop/depth-2 regresszió zöld, valós `MISSING=0`/`BROKEN=0` (4. pont).
- Full-site resolver hard gate nem regresszált (4. pont).
- Security smoke zöld: 57/57 anonim write elutasítva, dev-endpointok
  élőben is 404, field-level PII védelem élőben megerősítve (3-4. pont).
- Nincs tesztadat-maradvány (6. pont).
- A branch diffben nincs release-blocking ideiglenes/debug megoldás
  (1-2. pont).
- Egyetlen nyitott, kódon kívüli tétel: `new.vmk.hu` DNS-felmutatás
  hiányzik -- ez GO-t nem gátol (infra-lépés, nem branch-defektus), de
  release/launch checklist-elemként érdemes külön nyomon követni.

GO ellenére `STATUS: READY_FOR_REVIEW`, `BALL: CHATGPT` -- Claude nem
végez önálló merge-et.

Cél: a jelenlegi branchből bizonyíthatóan kiadható release candidate legyen. Ne új funkciókat építs, hanem integrációs, biztonsági és release-readiness hibákat keress és javíts.

## I1.1 — Teljes branch/PR diff audit

Vizsgáld át a branch teljes diffjét a merge-base/main állapothoz képest, különösen:
- véletlen debug/temp/test kód;
- machine-local path/port/credential;
- dev-only endpoint production-exposure;
- túl széles access rule;
- hardcoded tesztadat;
- generated artifact, amelyet nem kellene commitolni;
- dead code / félbehagyott feature / nem használt block;
- redirect loop vagy túl tág wildcard;
- public route, amely váratlanul admin/API adatot szivárogtat.

A talált P0/P1 hibát a scope-on belül javítsd is, ne csak listázd.

## I1.2 — Dev/admin/release biztonság

Kötelező ellenőrzés:
- `push:false` változatlanul érvényes;
- nincs destruktív schema prompt;
- `/api/dev-*` és hasonló migrációs/import helper productionben ténylegesen elérhetetlen;
- anonim REST create/update/delete a védett collectionökön tiltott;
- Users least-privilege továbbra is érvényes;
- nincs credential/secret commitban;
- production build nem függ fejlesztői lokális szolgáltatástól.

## I1.3 — Release build + fő workflow smoke

Friss, tiszta production builden bizonyítsd legalább:
- `/` 200;
- `/hirek`, `/esemenyek`, `/galeria`, `/munkatarsak`, `/wishbasket` működik;
- frontend keresés query → lista → detail;
- egy admin login + edit/publish → public frontend eredmény;
- egy public form workflow (pl. teremfoglalás vagy wishbasket) működik;
- first-hop baseline regresszió: `MISSING=0`, `BROKEN=0`;
- depth-2 baseline regresszió: `MISSING=0`, `BROKEN=0`;
- full-site family resolver minták több mélységből/évből kontrolláltak.

Tesztadatot takarítsd el.

## I1.4 — Publikus `new.vmk.hu` ellenőrzés

Ha a környezetből elérhető:
- DNS/TLS/HTTP;
- homepage;
- legalább 5 reprezentatív route;
- admin login page elérhetőség (nem kell credentialt megosztani);
- egy frontend search flow;
- egy legacy redirect;
- cache/revalidation legalább egy módosítás után, ha biztonságosan tesztelhető.

Ha nem elérhető, pontosan jelöld sandbox/network limitationként; ez önmagában nem termékhiba.

## I1.5 — PR / release döntési artifact

Frissítsd a `COLLAB.md`-t tömören az eredménnyel, és adj egy **GO / NO-GO** értékelést kizárólag bizonyíték alapján.

GO csak akkor:
- nincs ismert P0/P1;
- production build PASS;
- first-hop/depth-2 regresszió zöld;
- full-site resolver hard gate nem regresszált;
- security smoke zöld;
- nincs tesztadat-maradvány;
- a branch diffben nincs release-blocking ideiglenes/debug megoldás.

Ha GO, akkor is `STATUS: READY_FOR_REVIEW`, `BALL: CHATGPT`; merge-et Claude ne végezzen önállóan.

## Átadáskor kötelező

1. auditált diff scope / merge-base;
2. talált és javított P0/P1 hibák;
3. security eredmények;
4. build + smoke eredmények;
5. first-hop/depth-2/full-site regresszió;
6. publikus `new.vmk.hu` eredmény vagy pontos network blocker;
7. tesztadat-cleanup;
8. commit SHA-k;
9. GO / NO-GO indoklás;
10. `STATUS: READY_FOR_REVIEW`;
11. `BALL: CHATGPT`.

Claude a következő repo poll/fetch ciklusban felhasználói közvetítés nélkül folytatja.
