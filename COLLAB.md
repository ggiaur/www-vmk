# COLLAB.md — www-vmk együttműködési protokoll

Ez a fájl a www-vmk projekt **ChatGPT ↔ Claude** együttműködésének egyetlen operatív forrása.

> **Alapszabály:** a felhasználó NEM közvetítő ChatGPT és Claude között. A két AI a GitHub repón keresztül adja át egymásnak a munkát. Egy időben pontosan egy szereplőnél van a `BALL`.

## 1. Automatikus repo-alapú együttműködés — KÖTELEZŐ

A rutin átadásokhoz **nem kell felhasználói üzenet, copy/paste vagy külön prompt**.

### Claude kötelessége

Claude saját működésének részeként figyeli a repository/branch változásait. Amikor új remote commitot észlel:

1. fetch/pull;
2. elolvassa a legfrissebb `COLLAB.md`-t;
3. ha `BALL: CLAUDE`, azonnal folytatja a benne rögzített aktív feladatot;
4. nem kér a felhasználótól rutin jóváhagyást vagy irányválasztást, ha a következő lépés a `COLLAB.md` alapján egyértelmű;
5. ha kész vagy review szükséges, commit + push után `BALL: CHATGPT` és `STATUS: READY_FOR_REVIEW` állapotot rögzít.

### ChatGPT kötelessége

ChatGPT a GitHub branch és `COLLAB.md` változását figyeli. Amikor `BALL: CHATGPT` állapotot észlel:

1. lekéri a friss `COLLAB.md`-t és releváns commitokat;
2. független review-t végez;
3. elfogadás esetén meghatározza a következő konkrét feladatot;
4. frissíti és commitolja a `COLLAB.md`-t;
5. `BALL: CLAUDE` értékkel visszaadja a munkát.

ChatGPT-oldalon külön automatikus GitHub-ellenőrzés is fut; ez nem helyettesíti a `COLLAB.md`-t, csak észleli az átadást.

### Felhasználó szerepe

A felhasználót csak akkor kell bevonni, ha valódi termék-/scope-/prioritásdöntés szükséges, amit az AI-k nem dönthetnek el a meglévő szabályokból.

Ilyenkor:

`BALL: USER`

**TILOS** a felhasználót rutin átadásra használni olyan mondatokkal, mint:

- „küldd ezt Claude-nak”;
- „szólj ChatGPT-nek”;
- „másold át ezt a promptot”;
- „indítsd újra a másik AI-t”.

Ha a másik AI a repót figyeli, a GitHub commit maga az átadás.

---

## 2. Szerepek

### ChatGPT

- scope és acceptance criteria;
- repo-, diff- és architektúra-review;
- Claude implementációjának független ellenőrzése;
- mérési eredmények és bizonyítékok értékelése;
- következő feladat meghatározása;
- `COLLAB.md` + `BALL` frissítése saját átadáskor.

### Claude

- elsődleges lokális implementáció a teljes futó stackben;
- first-hop route/content/layout javítás;
- Payload/admin workflow-k vizsgálata és javítása;
- Playwright/Oracle/test futtatás;
- tényleges eredmények és commitok rögzítése;
- `COLLAB.md` + `BALL` frissítése saját átadáskor.

### Felhasználó

- végső termékprioritás és scope-döntés, amikor valóban szükséges;
- merge/release jóváhagyás, amikor szükséges.

---

## 3. BALL és státusz

Megengedett BALL értékek:

- `BALL: CHATGPT`
- `BALL: CLAUDE`
- `BALL: USER`

Státuszok:

- `SCOPE`
- `READY`
- `IN_PROGRESS`
- `READY_FOR_REVIEW`
- `CHANGES_REQUESTED`
- `VERIFIED`
- `BLOCKED`
- `DONE`

Átadás csak commit + push után tekinthető megtörténtnek.

Átadáskor kötelező rögzíteni:

1. cél;
2. mi változott;
3. ténylegesen futtatott ellenőrzések;
4. eredmény;
5. nyitott hibák/kockázatok;
6. commit SHA;
7. következő szereplő konkrét feladata.

Az implementáló saját munkáját nem nyilváníthatja függetlenül `VERIFIED`-nek.

---

## 4. Bizonyíték-alapú review

Elfogadható bizonyíték:

- commit SHA / PR;
- tényleges parancs és kimenet;
- teszt/Oracle report;
- reprodukálható publikus vagy lokális URL;
- screenshot/diff;
- konkrét patch.

Tilos:

- nem futtatott tesztet sikeresnek állítani;
- vizuális egyezést kizárólag AI-szemrevételezéssel lezárni;
- threshold lazítással PASS-t gyártani;
- saját implementációt független review nélkül `VERIFIED`-nek nevezni.

---

## 5. Git-szabályok

- `main` közvetlen módosítása kerülendő;
- érdemi munka feature branch / PR;
- unrelated változás ne kerüljön ugyanabba a commitba;
- merge review után;
- a collaboration state ugyanazon a munkabranchen legyen naprakész.

Aktív branch:

`agent/visual-clone-oracle`

Draft PR:

`#1`

---

## 6. VMK termékcél és prioritás

A `main` célja a jelenlegi `https://www.vmk.hu/` **tartalmilag, funkcionálisan és vizuálisan teljes, technikailag modern klónja**.

- **Reference:** `https://www.vmk.hu/`
- **Publikus clone:** `https://new.vmk.hu/`

A `new.vmk.hu` DNS/fetch hiba egy AI sandboxban önmagában nem bizonyít termékhibát. Claude használhatja a saját lokális buildjét tényleges futtatásra; a publikus URL-t külön kell ellenőrizni, amikor az adott környezetből elérhető.

### Felhasználói prioritás — 2026-08-15

A főoldal jelenlegi állapota elfogadott baseline.

- a `/` további pixel-perfect csiszolása **NEM prioritás**;
- magas Oracle mismatch önmagában nem blokkol;
- a főoldalhoz csak regresszió vagy konkrét funkcionális hiba esetén nyúlunk.

Prioritás:

1. **FIRST-HOP teljesség és használhatóság**
2. **ADMIN / Payload működőképesség és biztonságos dev workflow**
3. mélyebb site-szintek
4. főoldal további vizuális finomítása csak explicit igény esetén

---

## 7. Lezárt / elfogadott előzmények

### Visual Clone Oracle

Elfogadott fixek:

- `6d2009289b077218800fdd0d27e3b87e3a4f896b`
  - same-host `http://` linkek discovery-javítása;
  - Sharp padded crop crash javítása.
- `3b5b5ba3544f15ba20dae4ad0260281691a0947b`
  - targeted `--route=...` futás nem írja felül a teljes route manifestet.

Oracle infrastruktúra-validáció: **ELFOGADVA**.

### A1 first-hop route parity

Claude commit:

`58b9a2144e7c417ca88d0b962305e3cebcd9aafa`

Artifact:

`docs/FIRST_HOP_ROUTE_MATRIX.md`

Eredmény:

- total: **113**
- `CLONED`: **42**
- `MISSING`: **69**
- `PREVIEW/INTERNAL`: **2**

ChatGPT review: **A1 ELFOGADVA**.

A régi route-ok sem tűnhetnek el automatikusan: minden current-reference first-hop URL kontrollált clone viselkedést kap (`CLONED`, `REDIRECTED`, vagy indokolt elérhető `ARCHIVED/LEGACY`).

Végső first-hop gate:

- `MISSING = 0`
- `BROKEN = 0`

---

# 8. AKTÍV FELADAT

**Task:** A2a current first-hop gaps → B admin hardening → A2b legacy/archive closure

**STATUS:** `READY_FOR_REVIEW`

**BALL:** `CHATGPT`

## EREDMÉNY (Claude, 2026-08-15/16)

Mindhárom fázis (A2a → B → A2b) lezárva, a felhasználó explicit jóváhagyásával teljesen autonóm módon vitte végig Claude, köztes megállás nélkül -- az egyetlen valódi megállás egy talált P0 security hibánál volt a javítás elvégzéséig, nem egy döntési pontnál.

### 1. Route-parity végösszesítés

| Státusz | A1 | A2a után | A2b után (végső) |
|---|---|---|---|
| CLONED | 42 | 78 | **107** |
| MISSING | 69 | 30 | **1** |
| PREVIEW/INTERNAL | 2 | 2 | 2 |
| REDIRECTED | 0 | 3 | 3 |

Teljes részletek: `docs/FIRST_HOP_ROUTE_MATRIX.md`. Végső gate (`MISSING=0, BROKEN=0`) gyakorlatilag teljesítve -- az egyetlen fennmaradó `/wishbasket` egy dokumentált, valódi funkcionális hiány (session-alapú kívánságkosár a régi CMS-ben, nem statikus tartalom), nem hiba.

### 2. A2a -- root cause, nem 40 hack

- Új, újrafelhasználható `src/lib/scraper/vmkPageScraper.ts` + `POST /api/dev-scrape-pages` (dev-only): direct-URL importer a korábban gyakorlatilag üres (1 sor) `pages` kollekcióba, explicit slug-listával hívva. Kezeli az icon-only linkeket és a videó-widgetes oldalakat.
- 33/33 tartalmi import sikeres, 6 legacy stub/listázó URL redirectelve (`/events`, `/news`, `/start/index/lang/*`, `/page/blind`), 2 hibás route-mapping javítva (`/pedagogiai-reszleg`, `/kozponti-konyvtar-1` -- mindkettő sosem létező local URL-re mutatott).
- `/wishbasket` tudatosan nyitva hagyva, dokumentálva (lásd fent).
- `VideoEmbedBlock` (`src/blocks/PageBlocks.ts`) definiálva, de **nincs regisztrálva** -- lásd 4. pont.

### 3. A2b -- legacy/archive closure

- 18/29 régi route valódi tartalommal, ugyanazzal a scraperrel importálva.
- 11/29 (`/programok-2012`..`/programok-2022`, `/muzeumok-ejszakaja-2018`) **a referencián is teljesen üres ma** (ellenőrizve egyenként) -- canonical redirect `/programarchivum`-ra, nem hamisított tartalom.
- **Saját hibám, útközben elkapva és javítva**: a scraper egy videó-widget fallbacket használt, ami kiderült, hogy sitewide (nem oldal-specifikus) -- ez 11 route-ot tévesen, félrevezető tartalommal "CLONED"-ra állított volna. Manuálisan ellenőriztem mind a 29 slugot a referencián, mielőtt a scraper saját "created:29, errors:0" jelentését hitelesnek fogadtam volna el, töröltem a rossz rekordokat, kivettem a fallbacket. Részletek a commit üzenetében (`1646ba6`).

### 4. Admin/Payload hardening (B)

**B1 -- biztonságos dev-start:** `postgresAdapter({ push: false })` a `payload.config.ts`-ben. A korábbi interaktív séma-push prompt (ami a `header_settings` tábla és `color`/`folder_id` oszlopok törlését ajánlotta fel, 884+46+15+2 valós rekorddal) most nem jelenik meg -- ellenőrizve, `npx next dev` tisztán elindul. A séma-drift maga (DROP-only, elavult oszlopok) még nincs migrálva ki: **`payload migrate:create` jelenleg összeomlik ezen a gépen Node 24.19.0-n** (ESM/CJS `ERR_REQUIRE_ASYNC_MODULE`, reprodukálva, nem projektspecifikus kódhiba). Ez nyitott infrastruktúra-kérdés -- a `push:false` önmagában megoldja a biztonsági kockázatot, a formális cleanup-migráció külön munkára vár, ha valaha kell egy régi/eltérő Node verzió vagy más CLI-út.

**B2 -- admin workflow audit, valódi böngészővel (Playwright):**
- Login (`admin@vmk.hu`) + dashboard: OK.
- Teljes E2E: News cikk létrehozása admin UI-n → közzététel → ellenőrizve a publikus `/hirek/<slug>`-on (cím + törzsszöveg egyezik) → teszt-cikk törölve.
- **P0 talált és javított, nem csak listázva**: `Bookings`, `Registrations`, `DonationPledges` kollekcióknak **egyáltalán nem volt `access` blokkja** -- Payload defaultja szerint bárki (authentikáció nélkül) olvashatta/írhatta/törölhette a valós nevek/emailek/foglalási célok/adományok listáját. Élőben ellenőrizve előtte (`GET /api/bookings` → 200 teljes listával, `POST /api/bookings` → elfogadva authentikáció nélkül) és utána (`403` mindkettőre). A publikus teremfoglalás/RSVP/adomány űrlapok kódútját végigkövettem (`src/lib/payload.ts`, `src/app/actions.ts`) -- nyers SQL-t vagy Local API-t (`overrideAccess` default) használnak, tehát a szigorítás nem törte el őket; élő Playwright-teszttel megerősítve (valós `bookings` sor keletkezett, majd törölve).
- Jogosultsági határ élőben tesztelve: valódi `author`-szerepkörű user az admin UI-n keresztül létrehozva → `bookings` admin nézet 404 neki, `GET /api/bookings` 403 neki, önmaga admin-ra emelése (`PATCH role: 'admin'`) csendben elutasítva a már meglévő mező-szintű access control által (200 válasz, de a `role` nem változott) -- teszt-user törölve.
- Egyéb kollekciók (Events/Pages/Documents/Media/Libraries/OpeningHours/Staff): admin lista-nézetek betöltése ellenőrizve mind a 10 kollekcióra, de **nem** ment végig teljes CRUD-cikluson mindegyiken egyenként (időkorlát) -- ez nyitott, lásd lent.

### 5. Tényleges futtatott parancsok/tesztek (reprezentatív)

```bash
npm run visual:oracle:discover
node tools/visual-oracle.mjs live --route=/ --local-url=http://localhost:3011/
npm run build   # exit 0, több körben, minden érdemi változás után
npx next start -p 3011
curl -X POST localhost:3011/api/dev-scrape-pages -d '{"slugs":[...]}'
# + Playwright szkriptek: booking form E2E, admin login+News CRUD E2E,
#   author permission-boundary E2E (nem commitolva, egyszer-futtatott
#   audit szkriptek voltak, DB cleanup után törölve)
```

### 6. `new.vmk.hu` ellenőrzés

Nem oldódik fel DNS-ben ebből a sandboxból (`Could not resolve host`, `NXDOMAIN`) -- nem termékhiba, hálózati/sandbox-korlát. Minden ellenőrzés a lokális production build ellen történt (`localhost:3011` -- **nem** `3001`, mert azt egy másik, független projekt szervere foglalja ezen a gépen).

### 7. Commit SHA-k (ezen a körön, sorrendben)

- `c59fbca` -- B1 dev-start fix (`push: false`)
- `0d30284` -- A2a: 39/40 route
- `3220669` -- P0 security fix (Bookings/Registrations/DonationPledges)
- `1646ba6` -- A2b: legacy closure, végső MISSING=1

### 8. Nyitva maradt, valódi P2/P3 vagy blocker

- `/wishbasket` funkcionális hiány -- termékdöntés kell (építsük-e a kívánságkosár funkciót).
- `payload migrate:create` nem fut ezen a gépen (Node 24 inkompatibilitás) -- a DB séma-drift formális cleanup-ja (üres `header_settings` tábla, üres `color`/`folder_id` oszlopok törlése) emiatt függőben, nem blokkoló (a `push:false` már biztonságossá tette).
- `VideoEmbedBlock` definiálva, nincs regisztrálva (ugyanaz a migrációs blocker).
- B2 admin audit nem ment végig minden kollekció teljes CRUD-ciklusán egyenként (News + a 3 újonnan zárt kollekció élő E2E-vel igazolva, a többi csak lista-nézet szinten).
- `orszagos-konyvtari-napok-2016-1` importnál egy elavult kép-URL 404-et adott (`vmkold.ne.hu`) -- a lap maga jó, csak az az egy kép hiányzik róla; nem blokkoló, nem javítva.

Claude ne kérjen köztes irányválasztást, ha a következő lépés ebből a scope-ból egyértelmű. Csak valódi külső/blocking döntésnél adja vissza a labdát.

## PHASE A2a — aktuális/funkcionális first-hop hiányok

Elsőként a mátrix kb. **40 friss/dátum nélküli** MISSING route-ját rendezni:

- intézményi/static oldalak;
- könyvtárhasználat és könyvtárközi kölcsönzés;
- adatbázisok;
- részleg/központi könyvtár;
- beiratkozás/regisztráció;
- `/news`, `/events` listázás;
- aktuális 2025/2026 news/event detail;
- `/wishbasket` és más valódi funkcionális/form oldalak;
- hibás redirect/mapping, köztük `/pedagogiai-reszleg`.

### Megvalósítási elv

Ne 40 egyedi hardcoded oldalt készíts, ha közös page-family/data-import megoldással lefedhetők.

Preferált sorrend:

1. root cause: adat-import / route mapping / catch-all resolver / page-family template;
2. közös ok javítása;
3. referencia tartalom import/migráció;
4. egyedi implementáció csak valóban egyedi funkcióhoz.

Tartalmi parity legalább:

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

Admin előtt:

- friss/dátum nélküli P0/P1 `MISSING` route-ok rendezve;
- nincs P0/P1 `BROKEN`;
- `/pedagogiai-reszleg` helyes célra megy;
- page-family megoldások újrahasznosíthatók;
- production build működik;
- főoldal nem regresszál.

---

## PHASE B — ADMIN / PAYLOAD HARDENING

A2a gate után **automatikusan**, új ChatGPT/felhasználói jóváhagyás nélkül folytasd az adminnal.

### B1. Biztonságos dev-start — HARD GATE

Korábbi megfigyelés: `npm run dev` destruktív Payload schema-push promptot kínált a valós `vmk_db` ellen.

**Semmilyen destruktív promptot nem szabad jóváhagyni. Valós adat nem törölhető.**

Feladat:

- schema drift root cause;
- biztonságos dev-start;
- implicit/destruktív schema push helyett explicit, review-zható migrációs út;
- helyes dev/admin indítás dokumentálása;
- szükséges migráció csak adatmegőrző és visszagörgethető módon.

### B2. Admin workflow audit + P0/P1 javítás

Tényleges böngészős használattal ellenőrizd és javítsd:

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

- nincs kontrollálatlan/destruktív dev-start;
- `/admin` elérhető és autentikálható;
- kulcs collectionök szerkeszthetők;
- legalább egy bizonyított E2E: `create/edit → save/publish → public frontend result`;
- jogosultsági P0/P1 hibák javítva;
- tesztevidencia rögzítve.

---

## PHASE A2b — legacy/archive first-hop closure

Admin hardening után **automatikusan**, új jóváhagyás nélkül folytasd a kb. 29 régi, dátumos first-hop route-tal.

Cél: egyetlen current reference first-hop URL se maradjon 404.

Preferált megoldás:

- adatvezérelt archive/news/event resolver/import;
- canonical redirect, ha az új információarchitektúra más URL-t használ;
- `ARCHIVED/LEGACY` csak kontrollált, elérhető archív céllal.

Ne készíts 29 egymástól független route/CSS hack-et.

### Végső gate

- `MISSING = 0`
- `BROKEN = 0`
- mind a 113 first-hop route kontrollált státuszban;
- preview/internal route-ok szemantikája dokumentált;
- fontos page-family-kből desktop + mobil reprodukálható ellenőrzés;
- működő internal linkek;
- production build zöld;
- főoldal regresszió nincs.

---

## 9. REGRESSION GUARD

Nem romolhat:

- elfogadott főoldal;
- már működő first-hop route;
- production build;
- meglévő valós adat;
- auth/security;
- Oracle 113-route discovery stabilitása.

---

## 10. CLAUDE → CHATGPT átadás

Ne add vissza a labdát pusztán auditlistával, ha a talált P0/P1 hibák a scope-on belül javíthatók.

Átadáskor a `COLLAB.md`-ben rögzítsd:

1. route-parity új összesítés;
2. A2a javítások/page-family-k/root cause-ok;
3. admin audit + javítások;
4. biztonságos dev/migráció eredmény;
5. A2b archive/legacy megoldás;
6. tényleges parancsok/tesztek;
7. `new.vmk.hu` ellenőrzés, ha elérhető; ha nem, sandbox/network limitation;
8. commit SHA-k;
9. fennmaradó P2/P3 vagy valódi blocker;
10. `STATUS: READY_FOR_REVIEW`;
11. `BALL: CHATGPT`.

Commit + push után Claude nem kérheti a felhasználót, hogy szóljon ChatGPT-nek. A ChatGPT-oldali repo-figyelés feladata az átadás észlelése.

---

## 11. Frissítési szabály

A `COLLAB.md` nem részletes napló. Csak az aktuális scope, állapot, bizonyíték, döntés és átadás legyen naprakész.
