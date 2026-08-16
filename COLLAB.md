# COLLAB.md — www-vmk együttműködési protokoll

Ez a fájl a www-vmk projekt **ChatGPT ↔ Claude** együttműködésének operatív forrása.

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
Csak valódi termék-/scope-/prioritás- vagy végső release/merge döntéshez szükséges. Rutin átadásra tilos használni.

---

## 2. Projektállapot

Reference: `https://www.vmk.hu/`
Publikus clone cél: `https://new.vmk.hu/`
Aktív branch: `agent/visual-clone-oracle`
Draft PR: `#1`

### VERIFIED baseline
- FIRST-HOP: **VERIFIED** — `MISSING=0`, `BROKEN=0`
- ADMIN/Payload: **VERIFIED**
- Depth-2 E0-E4 + F1-F3: **VERIFIED** — `MISSING=0`, `BROKEN=0`
- Full-site H1-H4: **VERIFIED** — elfogadott commit `09d3445c7a4e967b2c386061479d7396bde5a950`
- I1 release-candidate hardening: **VERIFIED** — Claude handoff `e5b3fef23289ab88350a9744546376e3a102a9e3`

---

# 3. CHATGPT REVIEW — I1 RELEASE-CANDIDATE HARDENING

**Döntés: ELFOGADVA / RC GO.**

ChatGPT függetlenül ellenőrizte a PR és branch aktuális állapotát:

- PR `#1` open, draft, `mergeable: true`;
- base: `main` (`33430439ba131df5c62dc29f2ce9ac066bd63374`);
- head: `agent/visual-clone-oracle`;
- I1 handoff head: `e5b3fef23289ab88350a9744546376e3a102a9e3`;
- az I1 körben nincs új termékkód-diff, csak a bizonyíték/handoff dokumentáció;
- a korábbi security/access-control hard gate-ek, first-hop/depth-2/full-site parity eredmények és production build bizonyítékok konzisztensen rögzítettek;
- 19 collection × POST/PATCH/DELETE anonim write smoke: 57/57 tiltva;
- dev-only endpointok productionben 404;
- field-level PII redaction E2E bizonyított;
- clean production build + `tsc` PASS;
- first-hop és depth-2 valós `MISSING=0`, `BROKEN=0`;
- full-site resolver regresszió nem jelzett;
- tesztadat-cleanup dokumentált.

## `new.vmk.hu` infra-megjegyzés

A publikus clone jelenleg nem használható release-verifikációra. A Claude-oldali mérés szerint nincs működő DNS-feloldás; ChatGPT nyilvános keresésből sem talált bizonyítékot működő `new.vmk.hu` végpontra. Ez jelen állapotban **launch/infrastruktúra checklist tétel**, nem a branch kódjának P0/P1 hibája.

**Fontos:** RC GO ≠ production launch GO. Éles indulás előtt a DNS/deploy/HTTPS és publikus smoke külön hard gate.

---

# 4. AKTÍV FELADAT — J1 PR / RELEASE PACKAGE FINALIZATION

**STATUS:** `IN_PROGRESS`

**BALL:** `CLAUDE`

Cél: a VERIFIED release candidate-ből review-kész, áttekinthető release/merge csomag készítése. **Ne merge-elj önállóan.** Ne építs új feature-t.

## J1.1 — PR leírás aktualizálása

A PR `#1` leírása jelenleg az eredeti Visual Clone Oracle milestone-ról szól, miközben a branch azóta teljes first-hop, admin, depth-2, full-site és security/release hardeningen ment át.

Frissítsd a PR body-t úgy, hogy ténylegesen tükrözze a mostani branch tartalmát:
- fő termékfunkciók és parity eredmények;
- first-hop / depth-2 / full-site végállapot;
- Payload/admin hardening és access-control változások;
- fontos migrációk / schema-safety (`push:false`);
- security bizonyíték;
- build / E2E bizonyíték;
- ismert P2/P3 / upstream korlátok;
- `new.vmk.hu` DNS/deploy hiány mint launch checklist tétel;
- releváns fő commitok.

A PR maradjon **draft**, amíg a végső merge/release döntést a felhasználó nem adja meg.

## J1.2 — Release checklist

Rögzíts tömör, végrehajtható launch checklistet a PR-ban vagy külön `docs/RELEASE_CHECKLIST.md` fájlban. Kötelező tételek:

1. production env/secret konfiguráció ellenőrzése;
2. DB backup/snapshot merge/deploy előtt;
3. migrációs stratégia és `push:false` változatlan;
4. `new.vmk.hu` DNS rekord létrehozása/felmutatása;
5. TLS/HTTPS bizonyítása;
6. deploy;
7. publikus smoke: `/`, `/hirek`, `/esemenyek`, `/galeria`, `/munkatarsak`, `/wishbasket`, `/admin`;
8. publikus auth/admin smoke;
9. publikus first-hop kritikus route sample;
10. rollback eljárás és rollback trigger;
11. post-deploy log/error ellenőrzés.

Ne találj ki credentialeket, hostot vagy DNS targetet. Ismeretlen infra-paraméter maradjon explicit kitöltendő.

## J1.3 — Merge-readiness sanity

- ellenőrizd újra, hogy a PR mergeable;
- ellenőrizd, hogy nincs új konfliktus `main`-nel;
- ne rebase/merge-elj automatikusan, ha ez termékkódot vagy konfliktusfeloldást igényel;
- ha a PR body/checklist frissítésen kívül nincs kódváltozás, ne gyárts felesleges kódcommitot.

## J1 átadás

Rögzítsd:
1. PR body frissítés eredményét;
2. release checklist helyét;
3. mergeability állapotot;
4. maradék launch-only infra tételeket;
5. commit SHA, ha volt repo-fájl változás;
6. `STATUS: READY_FOR_REVIEW`;
7. `BALL: CHATGPT`.

A végső merge/production launch nem Claude vagy ChatGPT önálló döntése.
