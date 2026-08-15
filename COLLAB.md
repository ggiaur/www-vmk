# COLLAB.md — www-vmk együttműködési protokoll

Ez a fájl a www-vmk projektben a **ChatGPT ↔ Claude** együttműködés operatív forrása. A projektben jelenleg ez a két AI dolgozik.

> **Alapszabály:** aki implementál, nem nyilváníthatja a saját munkáját függetlenül ellenőrzöttnek. Egy időben pontosan egy szereplőnél van a `BALL`.

## 1. Szerepek

### ChatGPT
- scope és acceptance criteria;
- repo-, diff- és architektúra-review;
- Claude implementációjának független ellenőrzése;
- publikus clone ellenőrzése a `https://new.vmk.hu/` címen;
- mérési eredmények és bizonyítékok értékelése;
- következő feladat és `BALL` átadása.

### Claude
- elsődleges lokális implementáció a teljes futó stackben;
- first-hop route/content/layout javítás;
- Payload/admin workflow-k vizsgálata és javítása;
- Playwright/Oracle/test futtatás;
- tényleges eredmények, commitok és nyitott hibák rögzítése;
- átadáskor `BALL: CHATGPT`.

### Felhasználó
- végső termékprioritás és scope-döntés;
- merge/release jóváhagyás, amikor szükséges.

## 2. Labda-szabály

Értékek:

- `BALL: CHATGPT`
- `BALL: CLAUDE`
- `BALL: USER`

Átadáskor kötelező:

1. cél;
2. mi változott;
3. ténylegesen futtatott ellenőrzések;
4. eredmény;
5. nyitott hibák/kockázatok;
6. commit SHA;
7. következő szereplő konkrét feladata.

## 3. Státuszok

- `SCOPE`
- `READY`
- `IN_PROGRESS`
- `READY_FOR_REVIEW`
- `CHANGES_REQUESTED`
- `VERIFIED`
- `BLOCKED`
- `DONE`

`DONE` nem használható azért, mert valami csak „jónak tűnik”.

## 4. Bizonyíték-alapú review

Elfogadható bizonyíték:

- commit SHA / PR;
- ténylegesen futtatott parancs és kimenet;
- teszt/Oracle report;
- publikus URL reprodukálható állapota;
- screenshot/diff;
- konkrét patch.

Tilos:

- nem futtatott tesztet sikeresnek állítani;
- vizuális egyezést csak AI-szemrevételezéssel lezárni;
- threshold lazítással PASS-t gyártani;
- saját implementációt független review nélkül `VERIFIED`-nek nevezni.

## 5. Git-szabályok

- `main` közvetlen módosítása kerülendő;
- koherens feature branch / PR;
- unrelated változás ne kerüljön ugyanabba a commitba;
- merge review után.

## 6. VMK termékcél

A `main` célja a jelenlegi `https://www.vmk.hu/` **tartalmilag, funkcionálisan és vizuálisan teljes, technikailag modern klónja**.

A publikus futó klón jelenleg innen érhető el:

- **Clone review URL:** `https://new.vmk.hu/`
- **Reference URL:** `https://www.vmk.hu/`

A lokális port (`localhost:3011` vagy más) implementációs környezet; független review-hoz ahol lehetséges a publikus `new.vmk.hu` legyen az elsődleges clone URL.

## 7. Felhasználói prioritás — 2026-08-15

A főoldal a felhasználó megítélése szerint **elérte a jelenleg megfelelő szintet**.

Ezért:

- a főoldal további pixel-perfect csiszolása **NEM prioritás**;
- a `/` jelenlegi állapota elfogadott baseline/regresszióőr;
- a magas Oracle mismatch önmagában nem blokkolja a munkát;
- a főoldalhoz csak regresszió vagy konkrét funkcionális hiba esetén nyúlunk.

### Prioritási sorrend

1. **FIRST-HOP oldalak teljessége és használhatósága**
2. **ADMIN / Payload felület működőképessége**
3. mélyebb site-szintek
4. főoldal további vizuális finomítása csak explicit igény esetén

## 8. Oracle review lezárása

Claude commitja:

`6d2009289b077218800fdd0d27e3b87e3a4f896b`

ChatGPT független review eredménye: **ELFOGADVA**.

Elfogadott javítások:

1. same-host `http://` linkek ne essenek ki a discoveryből;
2. Sharp `extend + extract` crop crash javítása materializált padded canvas-szal.

Az Oracle a `/` route-on valós környezetben futott, reportot és defect-region outputot generált. Az Oracle infrastruktúra-validáció lezárva; innen termékmunka következik.

## 9. AKTÍV FELADAT

**Task:** First-hop completion + admin readiness

**STATUS:** `IN_PROGRESS`

**BALL:** `CLAUDE`

### GOAL

A főoldal további polírozása helyett:

1. a főoldalról elérhető belső oldalak legyenek ténylegesen meg és használhatók;
2. ne legyenek tartalmilag üres/generic 200-as pszeudo-oldalak;
3. az admin/Payload felület legyen biztonságosan indítható és a kulcs szerkesztői workflow-k működjenek.

---

# A. FIRST-HOP — ELSŐDLEGES

A discovery jelenleg 113 same-host URL-t talált.

**Ne optimalizáld tovább a `/` főoldalt.**

## A1. Route-parity mátrix

Generálj repo-ba commitolható first-hop leltárt. Minden reference URL kapjon pontosan egy státuszt:

- `CLONED`
- `REDIRECTED`
- `EXTERNAL/SUBSITE`
- `ARCHIVED/LEGACY`
- `PREVIEW/INTERNAL`
- `MISSING`
- `BROKEN`

Minden sor tartalmazza legalább:

- reference URL;
- clone URL (`https://new.vmk.hu/...` ahol alkalmazható);
- státusz;
- HTTP eredmény;
- rövid indok;
- page family/típus.

A két ismert preview URL-t:

- `/news/details/1988/preview/1`
- `/page/menu/156/preview/1`

**ne zárd ki automatikusan.** Előbb állapítsd meg, miért publikus first-hop link és mi a helyes clone-viselkedés.

## A2. P0/P1 hiányok javítása

A mátrix után javítsd az összes:

- `MISSING` first-hop route-ot;
- `BROKEN` first-hop route-ot;
- hibás legacy → új URL mappinget;
- generic catch-all oldalt, amely technikailag 200, de az eredeti oldal lényegi tartalma hiányzik.

Dolgozz oldalcsaládok szerint, ne 113 egyedi CSS-hackkel:

- institutional/static content;
- department/részleg;
- branch library/tagkönyvtár;
- listing/archive;
- news/event detail;
- gallery;
- document/download;
- form/function page.

## A3. First-hop acceptance

A kör végén:

- `MISSING = 0`;
- `BROKEN = 0`;
- minden internal reference link kontrollált clone célra megy;
- fontos page family-kből legyen legalább egy desktop + mobil Oracle/reprodukálható vizuális ellenőrzés;
- `https://new.vmk.hu/` publikus klónon is ellenőrizd a javított útvonalakat;
- a főoldal ne romoljon funkcionálisan/strukturálisan.

**Nem cél ebben a körben:** mind a 113 route egyenként 5% pixel-diff alá faragása. Előbb teljes és használható first-hop site kell.

---

# B. ADMIN / PAYLOAD — KÖTELEZŐ MÁSODIK WORKSTREAM

A first-hop P0/P1 hiányok rendezése után ugyanebben a munkaciklusban auditáld és javítsd az admin felületet.

## B1. Biztonságos dev-start — HARD GATE

Korábbi megfigyelés:

`npm run dev` destruktív Payload schema-push promptot kínált a valós `vmk_db` ellen (`header_settings`/oszlopok törlése, meglévő rekordokkal).

**Semmilyen destruktív promptot nem szabad jóváhagyni. Valós adat nem törölhető.**

Feladat:

- derítsd ki a schema drift okát;
- alakíts ki biztonságos fejlesztői indítást/migrációs utat;
- implicit schema push helyett explicit, review-zható migráció legyen, ha szükséges;
- dokumentáld a helyes dev/admin indítást.

## B2. Admin workflow audit + javítás

Tényleges böngészős használattal ellenőrizd legalább:

- `/admin` betölt;
- autentikáció működik;
- dashboard használható;
- News CRUD;
- Events CRUD;
- Pages CRUD;
- Documents / Media kezelés;
- Libraries szerkesztés;
- OpeningHours szerkesztés;
- Staff szerkesztés;
- draft/publish, ahol támogatott;
- jogosultság: nem-admin user ne kapjon admin-szintű írást;
- szerkesztés után a public frontend ténylegesen frissüljön, ahol ez az architektúra szerint elvárt.

A talált **P0/P1 hibákat javítsd**, ne csak listázd.

## B3. Admin acceptance

Legalább:

- nincs kontrollálatlan/destruktív dev-start kockázat;
- `/admin` elérhető és autentikálható;
- kulcs collectionök ténylegesen szerkeszthetők;
- legyen legalább egy bizonyított end-to-end admin workflow: `create/edit → save/publish → public frontend result`;
- jogosultsági P0/P1 hibák javítva;
- futtatott tesztek/ellenőrzések rögzítve.

---

# C. REGRESSION GUARD

Nem romolhat:

- jelenlegi elfogadott főoldal;
- működő first-hop route;
- production build;
- meglévő valós adat;
- auth/security.

---

# D. CLAUDE ÁTADÁSI KÖVETELMÉNY

Ne add vissza a labdát pusztán egy audit-listával, ha a talált P0/P1 hibák javíthatók a scope-on belül.

Átadáskor írd ide:

1. route-parity összesítés (`CLONED/REDIRECTED/.../MISSING/BROKEN` darabszámok);
2. javított first-hop hibák;
3. admin audit eredmény;
4. javított admin P0/P1 hibák;
5. ténylegesen futtatott parancsok/tesztek;
6. publikus `new.vmk.hu` ellenőrzés eredménye;
7. commit SHA-k;
8. fennmaradó P2/P3 vagy külső blocker;
9. `STATUS: READY_FOR_REVIEW`;
10. `BALL: CHATGPT`.

## 10. Frissítési szabály

A `COLLAB.md` nem részletes napló. Csak az aktuális scope, állapot, bizonyíték, döntés és átadás legyen naprakész.
