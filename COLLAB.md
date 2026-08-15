# COLLAB.md — www-vmk együttműködési protokoll

Ez a fájl a www-vmk projekt **ChatGPT ↔ Claude** együttműködésének operatív forrása.

> **Alapszabály:** aki implementál, nem nyilváníthatja saját munkáját függetlenül ellenőrzöttnek. Egy időben pontosan egy szereplőnél van a `BALL`.

## 1. Szerepek

### ChatGPT
- scope és acceptance criteria;
- repo-, diff- és architektúra-review;
- Claude implementációjának független ellenőrzése;
- publikus clone ellenőrzése, amikor a környezetből elérhető;
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
- reprodukálható publikus vagy lokális URL;
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

- **Reference:** `https://www.vmk.hu/`
- **Publikus clone:** `https://new.vmk.hu/`

A `new.vmk.hu` DNS/fetch hiba egy AI sandboxban önmagában **nem bizonyít termékhibát**. Claude lokális ellenőrzésre használhatja a saját futó buildjét (`localhost:3011` vagy az aktuális biztonságos portot); a publikus URL-t külön review-körben kell ellenőrizni, amikor elérhető.

## 7. Felhasználói prioritás — 2026-08-15

A főoldal a felhasználó megítélése szerint **elérte a jelenleg megfelelő szintet**.

Ezért:

- a főoldal további pixel-perfect csiszolása **NEM prioritás**;
- a `/` jelenlegi állapota elfogadott baseline/regresszióőr;
- magas Oracle mismatch önmagában nem blokkol;
- a főoldalhoz csak regresszió vagy konkrét funkcionális hiba esetén nyúlunk.

Prioritás:

1. **FIRST-HOP teljesség és használhatóság**
2. **ADMIN / Payload működőképesség és biztonságos dev workflow**
3. mélyebb site-szintek
4. főoldal további vizuális finomítása csak explicit igény esetén

## 8. Oracle állapot

### Elfogadott Oracle fixek

- `6d2009289b077218800fdd0d27e3b87e3a4f896b`
  - same-host `http://` linkek discovery-javítása;
  - Sharp padded crop crash javítása.
- `3b5b5ba3544f15ba20dae4ad0260281691a0947b`
  - targeted `--route=...` futás többé nem írja felül a teljes `route-manifest.json`-t.

ChatGPT függetlenül ellenőrizte a `3b5b5ba` patchet: a manifest írása csak `!selectedRoutes.length` esetén fut, ezért a `discover -> live --route=/` sorrend nem clobbereli a teljes discovery eredményt.

Az Oracle infrastruktúra-validáció lezárva; innen termékmunka következik.

## 9. A1 FIRST-HOP ROUTE-PARITY — REVIEW

Claude commit:

`58b9a2144e7c417ca88d0b962305e3cebcd9aafa`

Artifact:

`docs/FIRST_HOP_ROUTE_MATRIX.md`

Eredmény:

- total: **113**
- `CLONED`: **42**
- `MISSING`: **69**
- `PREVIEW/INTERNAL`: **2**
- jelenlegi CLONED 200-as halmazban automatikus tartalmi ellenőrzés szerint thin/generic jelölt: **0**

Továbbá javítva az Oracle `/pedagogiai-reszleg` override; a termékkódban lévő hibás redirect A2 feladat.

### ChatGPT review döntés

**A1 ELFOGADVA.**

Fontos termékdöntés: a 69 MISSING-ből a régi route-ok sem tűnhetnek el automatikusan. Mivel ezek a jelenlegi referenciaoldal first-hop körében ténylegesen elérhető URL-ek, mindegyiknek kontrollált clone viselkedést kell kapnia:

- `CLONED`, vagy
- `REDIRECTED`, vagy
- indokolt `ARCHIVED/LEGACY` cél, amely nem 404.

**First-hop acceptance végül: `MISSING = 0`, `BROKEN = 0`.**

---

# 10. AKTÍV FELADAT

**Task:** A2a current first-hop gaps → B admin hardening → A2b legacy/archive closure

**STATUS:** `IN_PROGRESS`

**BALL:** `CLAUDE`

Claude **ne kérjen köztes irányválasztást**, ha a következő lépés a lent rögzített scope-ból egyértelmű. Haladjon a sorrend szerint, és csak valódi külső/blocking döntésnél adja vissza a labdát.

## PHASE A2a — aktuális/funkcionális first-hop hiányok

Elsőként a mátrix kb. **40 friss/dátum nélküli** MISSING route-ját rendezd, különösen:

- intézményi/static oldalak;
- könyvtárhasználat és könyvtárközi kölcsönzés;
- adatbázisok;
- részleg/központi könyvtár;
- beiratkozás/regisztráció;
- `/news`, `/events` listázás;
- aktuális 2025/2026 news/event detail;
- `/wishbasket` és más valódi funkcionális/form oldalak;
- hibás redirect/mapping, köztük `/pedagogiai-reszleg`.

### Kötelező megvalósítási elv

**Ne 40 egyedi hardcoded oldalt gyárts, ha közös page-family/data-import megoldással lefedhetők.**

Preferált sorrend:

1. azonosítsd, hogy a hiány oka adat-import, route mapping, catch-all resolver vagy hiányzó page-family template;
2. javítsd a közös okot;
3. importáld/migráld a referencia tartalmát, ahol szükséges;
4. csak valóban egyedi funkcionális oldalhoz legyen egyedi implementáció.

A tartalmi parity-be tartozik legalább:

- cím;
- teljes lényegi szöveg;
- képek;
- PDF/download;
- linkek;
- listák/táblák;
- elérhetőségek;
- dátumok;
- form/function működés.

### A2a gate

Mielőtt Adminra mész:

- a friss/dátum nélküli P0/P1 `MISSING` route-ok legyenek rendezve;
- nincs P0/P1 `BROKEN`;
- `/pedagogiai-reszleg` kontrollált helyes célra megy;
- page-family megoldások legyenek újrahasznosíthatók az A2b archív körhöz;
- production build működik;
- főoldal nem regresszál.

Nem követelmény még, hogy a 29 régi archive route egyenként kész legyen — az A2b-ben zárjuk őket.

---

## PHASE B — ADMIN / PAYLOAD HARDENING

A2a gate után **azonnal** térj át az adminra; ne várj új felhasználói/ChatGPT jóváhagyásra.

### B1. Biztonságos dev-start — HARD GATE

Korábbi megfigyelés: `npm run dev` destruktív Payload schema-push promptot kínált a valós `vmk_db` ellen.

**Semmilyen destruktív promptot nem szabad jóváhagyni. Valós adat nem törölhető.**

Feladat:

- derítsd ki a schema drift okát;
- alakíts ki biztonságos dev-startot;
- implicit/destruktív schema push helyett explicit, review-zható migrációs út legyen;
- dokumentáld a helyes dev/admin indítást;
- ha migráció szükséges, adatmegőrző és visszagörgethető tervvel dolgozz.

### B2. Admin workflow audit + P0/P1 javítás

Tényleges böngészős használattal ellenőrizd és a javítható P0/P1 hibákat **javítsd is**:

- `/admin` betölt;
- login/auth;
- dashboard;
- News CRUD;
- Events CRUD;
- Pages CRUD;
- Documents / Media;
- Libraries;
- OpeningHours;
- Staff;
- draft/publish, ahol támogatott;
- jogosultság: nem-admin user ne kapjon admin-szintű írást;
- public frontend frissül a releváns admin változás után.

### B acceptance

Legalább:

- nincs kontrollálatlan/destruktív dev-start;
- `/admin` elérhető és autentikálható;
- kulcs collectionök szerkeszthetők;
- legalább egy bizonyított E2E workflow: `create/edit → save/publish → public frontend result`;
- jogosultsági P0/P1 hibák javítva;
- tényleges tesztevidencia rögzítve.

---

## PHASE A2b — legacy/archive first-hop closure

Admin hardening után ugyanebben a munkafolyamban térj vissza a kb. **29 régi, dátumos first-hop route-ra**.

Cél: egyetlen jelenlegi reference first-hop URL se maradjon 404 a klónban.

Preferált megoldás:

- adatvezérelt archive/news/event resolver/import;
- canonical redirect, ha a klón új információarchitektúrája más URL-t használ;
- `ARCHIVED/LEGACY` csak akkor, ha ténylegesen kontrollált, elérhető archív cél van.

Ne készíts 29 egymástól független kézi CSS/route hack-et.

### A2 végső gate

- `MISSING = 0`
- `BROKEN = 0`
- minden 113 first-hop route kontrollált státuszban;
- a két preview/internal route szemantikája dokumentált és helyesen kezelve;
- fontos page-family-kből desktop + mobil reprodukálható ellenőrzés;
- működő internal linkek;
- production build zöld;
- főoldal regresszió nincs.

---

## 11. REGRESSION GUARD

Nem romolhat:

- elfogadott főoldal;
- már működő first-hop route;
- production build;
- meglévő valós adat;
- auth/security;
- Oracle 113-route discovery stabilitása.

## 12. CLAUDE ÁTADÁSI KÖVETELMÉNY

Ne add vissza a labdát pusztán auditlistával, ha a talált P0/P1 hibák javíthatók a scope-on belül.

Átadáskor rögzítsd:

1. route-parity új összesítés;
2. A2a-ban javított route-ok/page-family-k és root cause-ok;
3. admin audit + javítások;
4. biztonságos dev/migráció eredmény;
5. A2b archive/legacy megoldás;
6. tényleges parancsok/tesztek;
7. publikus `new.vmk.hu` ellenőrzés, ha a környezetből elérhető; ha nem, pontosan jelöld sandbox/network limitationként;
8. commit SHA-k;
9. fennmaradó P2/P3 vagy valódi blocker;
10. `STATUS: READY_FOR_REVIEW`;
11. `BALL: CHATGPT`.

## 13. Frissítési szabály

A `COLLAB.md` nem részletes napló. Csak az aktuális scope, állapot, bizonyíték, döntés és átadás legyen naprakész.
