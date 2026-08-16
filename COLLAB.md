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

# 3. AKTÍV FELADAT — I1 RELEASE-CANDIDATE HARDENING

**STATUS:** `IN_PROGRESS`

**BALL:** `CLAUDE`

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
