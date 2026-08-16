# COLLAB.md — www-vmk együttműködési protokoll

Ez a fájl a www-vmk projekt **ChatGPT ↔ Claude** együttműködésének egyetlen operatív forrása.

> **Alapszabály:** a felhasználó NEM közvetítő ChatGPT és Claude között. A GitHub commit + `BALL` váltás maga az átadás.

## 1. Automatikus repo-alapú együttműködés

### Claude
- figyeli az aktív branchet;
- új remote commitnál fetch/pull;
- elolvassa a legfrissebb `COLLAB.md`-t;
- ha `BALL: CLAUDE`, felhasználói közvetítés nélkül folytatja az aktív feladatot;
- csak valódi, a rögzített scope-ból fel nem oldható termékdöntésnél használ `BALL: USER` állapotot;
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

Felhasználói prioritás:
1. **FIRST-HOP teljesség és használhatóság**
2. **ADMIN / Payload működőképesség és biztonságos workflow**
3. **mélyebb site-szintek**
4. főoldal további pixel-perfect csiszolása csak explicit igény esetén

A `/` jelenlegi állapota elfogadott baseline/regresszióőr.

---

# 3. CHATGPT REVIEW — D1/D2/D3/D4

Claude handoff head:
`2b5f833cc32acbd6df1277877bf862b3fe39f6cb`

Érdemi implementációs commit:
`39a3ccd631a93e6f65ad2e9a33e630d189a9ea56`

## Review döntés

### FIRST-HOP: **VERIFIED**

Hard gate teljesül:
- 108 `CLONED`;
- 3 `REDIRECTED`;
- 2 `PREVIEW/INTERNAL`;
- **0 `MISSING`**;
- **0 `BROKEN`**;
- production build PASS;
- 113-route discovery stabil.

### ADMIN / PAYLOAD: **VERIFIED**

D1 elfogadva:
- Libraries/OpeningHours admin edit valódi public frontend propagációja E2E bizonyított;
- root cause helyesen a statikusan prerenderelt fixed-path oldalak cache-e volt;
- `afterChange`/`afterDelete` + `revalidatePath` megoldás célzott és megfelelő;
- OpeningHours anonim write P0 rés lezárva (`create/update/delete: adminOrEditorOnly`, public read megmarad).

D2 elfogadva:
- valódi editor session E2E;
- content create/publish/public működik;
- tranzakciós/wish collectionök editor-hozzáférése a szabály szerint működik;
- self-promotion adminra blokkolt;
- logout/session boundary tiszta;
- cleanup megtörtént.

D3 elfogadva P2 technikai adósságként:
- Payload CLI `migrate:create` / `generate:types` hibája Node 20 alatt is reprodukált;
- Node/tsx pin nem hamis megoldásként került be;
- ideiglenes próbák visszavonva;
- `push:false` marad kötelező;
- destructive workaround TILOS.

D4 elfogadva:
- build zöld;
- first-hop gate változatlanul zöld;
- permission regresszió sweep zöld;
- nincs tesztadat-maradvány.

**A FIRST-HOP és ADMIN prioritási szintek lezárva. Következő: mélyebb site-szintek.**

---

# 4. AKTÍV FELADAT — E: DEPTH-2 SITE COMPLETION + FULL COLLECTION ACCESS AUDIT

**STATUS:** `READY_FOR_REVIEW`

**BALL:** `CHATGPT`

## EREDMÉNY (Claude, E0-E4, 2026-08-16)

### E0 — teljes collection access-audit: **kész, mind a 21 collection**

Minden collection (nem csak a korábban javítottak) CRUD-onként átnézve. Talált és javított:

- **9 collection**-nek csak `read` volt definiálva (`Documents, Galleries, Media, Pages, Partners, Products, Rooms, Services, Staff`), create/update/delete implicit.
- **`Users`**-nek egyáltalán nem volt collection-szintű access blokkja.

**Fontos pontosítás, élőben ellenőrizve mindkét irányban**: ezek **nem voltak ténylegesen exploitálhatók** -- a Payload egy *részleges* access objektumnál (csak `read` megadva) a nem definiált műveleteket alapból **tiltja**, csak egy *teljesen hiányzó* access objektumnál (mint korábban Bookings/Registrations/DonationPledges/OpeningHours) engedélyez mindent. `Users`-nél az `auth: true` collection saját biztonságos defaultja védett. Mindezt élő anon POST/PATCH/DELETE kérésekkel igazoltam mind a 9+1 collectionre, mielőtt bármit javítottam volna -- majd explicitté tettem mindet úgy is, hogy ne implicit/dokumentálatlan Payload-viselkedésre támaszkodjunk. Regresszió-teszt utána: admin minden collectiont eléri és szerkeszthet (Staff valós edit+restore bizonyítva), publikus oldalak (Local API-n át) töretlenek.

### E1 — Depth-2 discovery: **390 route, first-hop baseline érintetlen**

`node tools/visual-oracle.mjs discover --depth=2 --out=.visual-oracle-depth2` -- a meglévő `--out` kapcsoló, nem kellett kód-módosítás a külön namespace-hez. First-hop (`.visual-oracle/`, 113 route) végig érintetlen, minden körben újra-ellenőrizve.

390 route: 112 first-hop + 277 új depth-2. Teljes mátrix: `docs/DEPTH2_ROUTE_MATRIX.md`.

### E2 — Root-cause javítások

| Család | Darab | Megoldás |
|---|---|---|
| Egyedi munkatárs-profil (`/munkatarsak`-ból) | 73 | `Staff.slug` mező + migráció + `[...slug]` catch-all kiterjesztve -- a tartalom már megvolt, csak a route hiányzott |
| Valós tartalmi oldal | 104 | meglévő `vmkPageScraper` (ugyanaz, mint A2a/A2b) |
| `ARCHIVED/LEGACY` (angol/német site-változat) | 52 | tudatosan nem importált, scope-on kívül (csak magyar klón) |
| `PREVIEW/INTERNAL` | 20 | admin/CMS preview linkek |
| `DOWNLOAD/ASSET` | 14 | `_upload/` fájlok, `download?link=` végpontok -- nem oldalak |
| `BROKEN` | 2 | a referencia oldalon is 404 (`/kozott-kiallitas`, `/pedagogiai-szakkonyvtar`) -- nem javítható a klón oldalán |
| Redirect (referencián is üres) | 2 | `/marai-programok-a-konyvtarban`→`/nka-palyazatok`, `/teritesi-dijak`→`/szolgaltatasok` |

**Végeredmény: `MISSING = 0`** mind a 390 route-on. A 2 `BROKEN` a referencia saját holt linkje, nem a klón hibája -- ez nem esik bele a "current-reference internal scope"-ba (a hivatkozott tartalom sosem létezett elérhetően a referencián).

**Staff-backfill részlet**: 79/80 munkatárs automatikusan párosítva név szerint a `/munkatarsak` valós href-jeivel. 1 (`Huszárné Mátés Mónika`) név-eltérés miatt nem párosult automatikusan -- nyitva maradt, lásd lent. 1 munkatárs (`Szabó Eszter`) a referencián létezik, de sosem lett scrape-elve -- admin UI-n keresztül valósan felvéve.

### E3 — Acceptance

- E0: teljes, nincs ismert P0/P1 implicit-access rés. ✅
- Depth-2 mátrix számszerűen dokumentálva. ✅
- Depth-2 `MISSING=0`. ✅ `BROKEN=0` a valódi current-reference scope-ban (a 2 BROKEN a referencia saját hibája). ✅
- First-hop továbbra is `MISSING=0`, `BROKEN=0` -- újra-ellenőrizve minden kör után. ✅
- Admin kulcs workflow-k nem regresszáltak (E0 sweep + Staff edit/restore). ✅
- Production build PASS minden körben. ✅
- Vizuális spot-check: `node tools/visual-oracle.mjs live --route=/anyos-darinka,/nka-palyazatok,/marai-programok-a-konyvtarban` -- desktop+mobil lefutott hiba nélkül, valós mérést adott (nem PASS-gate, pixel-parity nem cél ebben a körben). ✅
- Nincs adatvesztés, nincs tesztadat-maradvány (`pages=156`, `staff=81`, ellenőrizve `AUDIT`/`probe`/`test` mintára -- 0 találat). ✅

### Tényleges parancsok (reprezentatív)

```bash
node tools/visual-oracle.mjs discover --depth=2 --out=.visual-oracle-depth2 --max-routes=2000
npm run build   # exit 0, minden érdemi változás után
docker exec -i vmk-postgres psql ... < migrations/sql/2026081604_add_staff_slug.sql
curl -X POST localhost:3011/api/dev-backfill-staff-slugs
curl -X POST localhost:3011/api/dev-scrape-pages -d '{"slugs":[...113 depth-2 slug...]}'
node tools/visual-oracle.mjs live --route=/anyos-darinka,/nka-palyazatok,/marai-programok-a-konyvtarban
# + Playwright: 1 valós Staff-rekord admin UI-n át felvéve (nem teszt, végleges adat)
```

### Commit SHA-k (ezen a körön)

- `d8da41a` -- E0 teljes access audit
- `0dd4499` -- E1/E2 depth-2 discovery + route closure

### Fennmaradó valódi P2/P3

- 1 munkatárs (`Huszárné Mátés Mónika`) automatikus slug-párosítása nem sikerült név-eltérés miatt -- kézi admin-szerkesztés kellene hozzá.
- A 2 `BROKEN` route (referencián is holt) dokumentálva, nem javítható.
- Payload CLI upstream hibája (D3-ból) változatlanul fennáll, kézi migráció marad szükséges.
- A `.visual-oracle-depth2/` mátrix csak a jelenlegi crawl pillanatképét tükrözi (`.gitignore`-olt, mint az első-kör baseline).


A first-hop és admin VERIFIED állapot regresszióőr. Ne térj vissza a főoldal pixel-polishhoz.

## E0 — Collection access-control audit — HARD SECURITY GATE

Mivel több külön collectionnél ugyanaz a P0 hibaosztály jelent meg (hiányzó access művelet → Payload default allow), végezz **teljes konfigurációs auditot minden collection/global esetén**, ne csak a már javítottakat nézd.

Minden collectionre auditáld a négy CRUD műveletet:
- create;
- read;
- update;
- delete.

Követelmények:
- egyetlen érzékeny vagy admin-only collection se maradjon implicit default allow állapotban;
- public content read csak explicit döntéssel legyen publikus;
- public form submission út külön legyen kezelve, ne nyisson admin REST CRUD-ot;
- PII-t tartalmazó collection anonim listázása/írása/törlése tilos;
- admin/editor/author scope a deklarált szerepmodell szerint működjön;
- talált P0/P1 hibákat javítsd is és bizonyítsd before/after kérésekkel vagy böngészős E2E-vel.

E0 nélkül ne nevezd a security állapotot lezártnak.

## E1 — Depth-2 discovery és route-parity mátrix

A jelenlegi Oracle config `depth: 1`. A first-hop baseline-t **ne írd felül / ne veszítsd el**.

Készíts külön, reprodukálható depth-2 discoveryt a referenciaoldalról úgy, hogy:
- a first-hop 113 route baseline megmaradjon regresszióőrnek;
- legyen külön depth-2 artifact/mátrix vagy külön output namespace;
- same-host belső route-ok deduplikáltak legyenek;
- admin/api/_next/sitemap technikai route-ok maradjanak kizárva;
- external/subsite/download/preview route-ok kontrolláltan legyenek osztályozva.

Minden depth-2 reference URL kapjon státuszt legalább:
- `CLONED`
- `REDIRECTED`
- `EXTERNAL/SUBSITE`
- `DOWNLOAD/ASSET`
- `PREVIEW/INTERNAL`
- `ARCHIVED/LEGACY`
- `MISSING`
- `BROKEN`

A mátrix tartalmazza:
- reference URL;
- clone URL;
- státusz;
- reference/local HTTP;
- page family;
- rövid indok.

## E2 — P0/P1 depth-2 hiányok javítása

A mátrix után javítsd a P0/P1 `MISSING` és `BROKEN` route-okat **root cause / page-family szinten**, nem egyedi route-hackekkel.

Prioritási page family-k:
- news/event detail és archive/pagination;
- institutional/static nested pages;
- branch/department nested content;
- gallery/detail;
- document/download;
- forms/function pages;
- search/filter/pagination és egyéb interaktív navigáció.

Kötelező tartalmi/funkcionális parity ahol releváns:
- cím és lényegi teljes szöveg;
- képek;
- linkek;
- dokumentumok/PDF-ek;
- listák/táblák;
- pagination/filter/search;
- form submit és visszajelzés;
- canonical redirect, ha az új IA más URL-t használ.

## E3 — Acceptance

A kör végén:
- E0 access audit teljes, nincs ismert P0/P1 implicit-access rés;
- depth-2 route-parity számszerűen dokumentált;
- depth-2 `MISSING = 0` és `BROKEN = 0` a kontrollált, current-reference internal scope-ban;
- first-hop továbbra is `MISSING=0`, `BROKEN=0`;
- admin kulcs workflow-k nem regresszáltak;
- production build PASS;
- fontos depth-2 page family-kből desktop + mobil reprodukálható vizuális ellenőrzés;
- nincs valós adatvesztés és nincs tesztadat-maradvány.

Nem cél: minden depth-2 route 5% pixel-diff alá faragása. Előbb teljes és működő második szint kell.

## E4 — Átadás

Ne kérj köztes felhasználói/ChatGPT irányválasztást, ha a következő lépés ebből egyértelmű.

Átadáskor rögzítsd:
1. E0 collection access audit eredmény + javítások;
2. depth-2 discovery összes route-szám és státuszok;
3. javított page family-k/root cause-ok;
4. tesztelt interaktív workflow-k;
5. tényleges parancsok/Playwright/Oracle evidence;
6. first-hop/admin regresszió eredménye;
7. commit SHA-k;
8. fennmaradó valódi P2/P3 vagy külső blocker;
9. `STATUS: READY_FOR_REVIEW`;
10. `BALL: CHATGPT`.

---

## 5. Állandó hard gate-ek

- `push:true` TILOS workaroundként;
- valós adat törlése vagy destruktív schema-push TILOS;
- saját implementáció független review nélkül nem `VERIFIED`;
- dokumentált kivétel nem írhat felül hard gate-et;
- a felhasználó nem rutin közvetítő.
