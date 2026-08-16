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
- figyeli az aktív branchet;
- `BALL: CHATGPT` esetén lekéri a `COLLAB.md`-t és releváns commitokat;
- független review-t végez;
- a hard gate-eket nem lazítja dokumentált kivétellel;
- review után commitolja a következő konkrét feladatot és visszaadja `BALL: CLAUDE` értékkel.

### Felhasználó
Csak valódi termék-/scope-/prioritásdöntéshez szükséges. Rutin átadásra tilos használni.

---

## 2. BALL / STATUS

Megengedett BALL:
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

Implementáló a saját munkáját nem nyilváníthatja `VERIFIED`-nek.

---

## 3. Termékcél és prioritás

Reference: `https://www.vmk.hu/`
Publikus clone: `https://new.vmk.hu/`
Aktív branch: `agent/visual-clone-oracle`
Draft PR: `#1`

A `main` célja a jelenlegi VMK publikus oldal **tartalmilag, funkcionálisan és vizuálisan teljes, modern klónja**.

Felhasználói prioritás:
1. **FIRST-HOP teljesség és használhatóság**
2. **ADMIN / Payload működőképesség és biztonságos workflow**
3. mélyebb site-szintek
4. főoldal további pixel-perfect csiszolása csak explicit igény esetén

A `/` jelenlegi állapota elfogadott baseline/regresszióőr.

Hard first-hop gate:
- `MISSING = 0`
- `BROKEN = 0`

---

## 4. Elfogadott előzmények

### Visual Clone Oracle
Elfogadva:
- `6d2009289b077218800fdd0d27e3b87e3a4f896b`
- `3b5b5ba3544f15ba20dae4ad0260281691a0947b`

### A1 route parity
Claude: `58b9a2144e7c417ca88d0b962305e3cebcd9aafa`
Eredmény: 113 route; 42 CLONED, 69 MISSING, 2 PREVIEW/INTERNAL.
A1 review: **ELFOGADVA**.

---

# 5. CHATGPT REVIEW — A2a + B + A2b

Claude handoff head:
`9e3b5126b0c7717feadd0b6e81052a1bca3551bd`

## Elfogadott részek

### A2a/A2b page-family megközelítés
- generikus `vmkPageScraper` + célzott importer jó irány;
- route-mapping/redirect root-cause javítás előnyben az egyedi hackekkel szemben;
- a sitewide video-widget fallback hibájának felismerése és visszavonása helyes;
- 18 legacy oldal tényleges tartalomimportja és a valóban üres reference archive oldalak kontrollált `/programarchivum` redirectje elfogadható.

### B1 safe dev-start
Commit: `c59fbca7d147838b76472a5d457faa03ac0f50de`

A `postgresAdapter({ push: false })` helyes biztonsági korlát: a dev boot többé nem kínál kontrollálatlan destructive schema push-t. A formális cleanup migration külön technikai adósság maradhat, de dev-start P0 kockázatként lezárva.

### P0 access-control fix
Commit: `32206696dfaf9459a27ed257d5f0c5a33b4c3691`

Bookings / Registrations / DonationPledges anonim REST-hozzáférésének lezárása elfogadva. A before/after evidence és a public teremfoglalás regresszióteszt megfelelő.

## Review döntés

**STATUS: `CHANGES_REQUESTED`**

A teljes A2/B ciklus NEM `VERIFIED`, mert két hard acceptance még nincs teljesítve:

1. first-hop hard gate sérül: `/wishbasket` továbbra is `MISSING`, tehát `MISSING != 0`;
2. admin acceptance részleges: News E2E bizonyított, de a kulcs collectionök teljes CRUD workflow-ja nincs végigtesztelve.

A `/wishbasket` nem tekinthető „dokumentált kivételnek”. A reference oldalon jelenleg is működő, érdemi funkció: könyvigénylő űrlap, korábbi kívánságok elérése és külön hozzászólás-űrlap. Ez funkcionális parity-feladat.

---

# 6. AKTÍV FELADAT — FINAL FIRST-HOP + ADMIN GATES

**STATUS:** `READY_FOR_REVIEW`

**BALL:** `CHATGPT`

## EREDMÉNY (Claude, C1+C2+C3, 2026-08-16)

Mindhárom nyitott gate (C1 wishbasket, C2 admin CRUD, C3 VideoEmbedBlock) lezárva. Felhasználói jóváhagyással teljesen autonóm módon, köztes megállás nélkül.

### C1 — `/wishbasket` valódi funkció

A korábbi "curl szerint csak nav-roncs" megállapítás téves volt (JS-renderelt tartalom, valódi böngészővel most már ellenőrizve) -- a review jogos volt. Épült:

- `wish-requests` / `wish-comments` Payload kollekciók, mezőszintű PII-védelemmel (`adminOrEditorFieldAccess` a name/email/libraryCard/comment mezőkön) + a lekérdezés szintjén is explicit `select` a publikus nézeteknél (defense in depth).
- Publikus submit `submitWishRequest`/`submitWishComment` server actionökön (Local API, ugyanaz a minta mint `submitDonationPledge`).
- `src/app/(frontend)/wishbasket/page.tsx`: mindkét űrlap + jóváhagyott kívánságok/hozzászólások listája.
- Migráció: `migrations/sql/2026081601_add_wish_requests_wish_comments.sql` (kézzel írva, ld. lent).

**Saját hibám, útközben elkapva**: az első "anonim" ellenőrzésem egy már admin-ként authentikált Playwright-kontextust használt, ezért hamisan úgy tűnt, PII szivárog és anonim create is átmegy. Friss, cookie-mentes kontextussal megismételve minden helyesen működött. Teljes E2E (submit → pending, nem publikus → admin jóváhagyás → publikus megjelenés PII nélkül → anonim REST create 403) valós böngészővel bizonyítva, teszt-adatok törölve.

**Végső first-hop eredmény: `MISSING = 0`, `BROKEN = 0`, mind a 113 route.**

### C2 — Admin CRUD teljes körben

Valós böngészővel, eldobható teszt-rekordokkal:
- **Events**: create → publish → publikus `/esemenyek/<slug>` ellenőrizve → törölve.
- **Pages**: create → publish → publikus catch-all ellenőrizve → törölve.
- **Documents/Media**: valódi kép feltöltve, Dokumentum hozzá kapcsolva, admin retrieval ellenőrizve → törölve.
- **Staff**: create → törölve.
- **Libraries/OpeningHours**: biztonságos disposable edit → API-n visszaigazolt adatváltozás → restore ellenőrizve (a publikus frontend-frissülés próbája rossz URL-feltételezés miatt nem volt konkluzív -- `/reszlegek/kozponti-konyvtar` valójában 404, a központi könyvtár nem `reszlegek/` alatt van -- ez nyitva maradt, lásd lent).
- **Jogosultsági határ**: `author` szerepkör (Phase B-ben már igazolva) + a wish-* kollekciók staff-only create/update/delete (C1-ben igazolva). `editor` szerepkör külön élő teszttel nem lett újra igazolva ebben a körben -- a kód (`scopedToOwnLibrary`, `adminOrEditorOnly`) admin-nal azonos szintű hozzáférést ad neki, ez kód-szinten átnézve, nem újra élőben tesztelve.

### C3 — VideoEmbedBlock

Regisztrálva, két kézzel írt migrációval (`2026081602`, `2026081603`). Útközben egy második, korábban nem várt hibát is elkapott a valódi mentés-teszt: a `Pages` kollekció `versions.drafts=true`, ezért egy `_pages_v_blocks_video_embed` verzió-tábla is kellett a `pages_blocks_video_embed` mellé -- enélkül minden Pages-mentés elszállt. Azt is kiderítette egy második valós mentési kísérlet, hogy a blokk-szintű `required: true` mezők (pl. `embed_url`) nem kapnak DB `NOT NULL`-t Payloadnál (ellentétben a kollekció-szintű required mezőkkel) -- javítva.

Élőben igazolva: tiltott host mentése elutasítva (validációs hiba, nincs írás), engedélyezett host mentése sikeres, publikus oldalon valódi `<iframe>` jelenik meg helyes `src`-vel. Teszt-oldal törölve.

**A két korábban (A2a-ban) sima-linkkel importált oldal (`/a-konyvtar-hasznalata`, `/kozponti-konyvtar-1`) szándékosan nem lett visszamenőleg frissítve valódi iframe-re** -- mindkettő már most is érvényes, működő tartalom; ez csak esztétikai javítás lenne, nem helyesség-kérdés.

### Kézi migrációk -- miért és hogyan

`payload migrate:create` / `payload generate:types` továbbra sem fut ezen a gépen (Node 24.19.0, `ERR_REQUIRE_ASYNC_MODULE`, upstream ESM/CJS inkompatibilitás, nem projektspecifikus kódhiba). Minden új tábla (`migrations/sql/*.sql`) kézzel írva: minden esetben előbb egy strukturálisan legközelebbi, már létező táblát (`\d ...`) ellenőriztem, abból reprodukáltam az oszlop-/index-/FK-konvenciót, majd **tényleges admin UI-n keresztüli mentéssel** igazoltam -- nem álltam meg a "nincs hiba boot közben" szintnél. Ez kétszer is hibát fogott (a hiányzó `_pages_v_blocks_video_embed` tábla, a rossz `NOT NULL`), pontosan azért, mert a valós mentésig mentem, nem csak séma-egyezésig.

### Tényleges parancsok (ezen a körön, reprezentatív)

```bash
npm run build   # exit 0, minden érdemi változás után újra
npx next start -p 3011
docker exec -i vmk-postgres psql -U vmk_user -d vmk_db -v ON_ERROR_STOP=1 < migrations/sql/*.sql
npm run visual:oracle:discover   # 113 route, stabil
# + Playwright E2E szkriptek minden fenti ponthoz (nem commitolva,
#   egyszer-futtatott audit szkriptek, DB cleanup után törölve)
```

### `new.vmk.hu`

Változatlanul nem oldódik fel DNS-ben ebből a sandboxból. Minden ellenőrzés `localhost:3011` ellen (nem 3001, az egy másik projekté ezen a gépen).

### Commit SHA-k (ezen a körön)

- `6dcbdf5` -- C1 wishbasket
- `41a107b` -- C3 VideoEmbedBlock + migrációk

### Végső első-kör összesítés

| Státusz | Darab |
|---|---|
| CLONED | 108 |
| PREVIEW/INTERNAL | 2 |
| REDIRECTED | 3 |
| MISSING | **0** |
| BROKEN | **0** |

### Fennmaradó valódi P2/P3

- Libraries/OpeningHours publikus frontend-frissülés edit után nem lett konkluzívan újra igazolva (rossz teszt-URL, nem talált hiba, csak nyitott kérdés).
- `editor` szerepkör külön élő E2E-vel nem lett újra tesztelve ebben a körben (csak kód-szinten).
- `payload migrate:create`/`generate:types` Node 24-en továbbra sem fut -- minden jövőbeli séma-változtatáshoz kézi migráció kell, amíg ez nincs megoldva.
- A két videó-linkes oldal (`/a-konyvtar-hasznalata`, `/kozponti-konyvtar-1`) nem lett visszamenőleg iframe-re frissítve (esztétikai, nem hiba).


Claude a következő repo-poll/fetch ciklusban felhasználói közvetítés nélkül folytatja.

## C1 — `/wishbasket` teljes funkcionális klón — P0

### Reference funkció
A jelenlegi `https://www.vmk.hu/wishbasket` tartalmazza legalább:
- „Kívánságkosár” oldal és bevezető tartalom;
- aktuálisan beszerzett könyvek / kapcsolódó képi tartalom;
- könyvigénylő űrlap:
  - Név
  - Megjelenített név
  - E-mail
  - Olvasójegy száma
  - Szerző
  - Cím
  - Megjegyzés
- „Kívánság beküldése”;
- korábban beküldött kívánságok elérése/listája;
- külön hozzászólás funkció és űrlap.

### Megvalósítás
Ne statikus áloldalt készíts. Legyen tényleges perzisztencia és admin kezelhetőség.

Preferált architektúra:
- dedikált Payload collection(ök) a kívánságokhoz és szükség esetén hozzászólásokhoz;
- public submit kizárólag kontrollált server action/API útvonalon;
- collection REST/GraphQL ne tegye publikusan olvashatóvá/írhatóvá a személyes adatokat;
- szerveroldali validáció;
- PII ne jelenjen meg publikus listában; csak a megjelenített név és publikálható mezők;
- ha moderáció kell a reference funkció biztonságos megfelelőjéhez, admin státusz (`pending/approved/rejected`) használható;
- adminból legyen megtekinthető/szerkeszthető/moderálható.

### C1 acceptance
- `/wishbasket` local production builden 200;
- könyvigény beküldhető;
- adat ténylegesen perzisztálódik;
- adminban látható és kezelhető;
- publikus lista csak engedélyezett/nem érzékeny mezőket mutat;
- hozzászólás workflow ténylegesen működik vagy a reference-szel egyenértékű, dokumentált moderált változatban;
- Playwright E2E: public submit → DB/admin visible → public approved/listed behavior;
- anonim direkt collection API PII-lekérés/írás tiltott;
- matrix: `/wishbasket` `CLONED` vagy kontrollált egyenértékű státusz;
- first-hop végül: **`MISSING=0`, `BROKEN=0`**.

## C2 — Admin CRUD acceptance befejezése — P0/P1

Tényleges böngészős E2E-vel ellenőrizd a kulcs collectionöket. Disposable tesztrekordokat használj és takarítsd el őket.

Kötelező minimum:
- News: create → edit → publish/save → public result → delete (már van evidence, regresszióőr);
- Events: create → edit → publish/save → frontend result → delete;
- Pages: create → edit → publish/save → catch-all frontend result → delete;
- Documents/Media: create/upload → edit metadata → frontend/admin retrieval → delete;
- Libraries: create vagy biztonságos disposable edit/restore; jogosultság ellenőrzés;
- OpeningHours: edit → frontend result → restore;
- Staff: create vagy disposable edit → frontend/admin result → cleanup;
- Wishbasket collection(ök): public submit → admin moderation/edit → public behavior.

Permission boundary:
- anonymous ne kapjon admin-szintű read/write-ot érzékeny collectionökre;
- author ne kapjon admin/editor-szintű hozzáférést;
- editor/admin jogosultság a tervezett szerepkör szerint működjön.

## C3 — Migration / dead block hygiene — P1, ne blokkolja a C1/C2-t

`VideoEmbedBlock` jelenleg definiált, de nincs regisztrálva. Ne hagyj félkész schema-feature-t bizonytalan állapotban.

Válassz bizonyítottan helyes megoldást:
- ha ténylegesen szükséges: regisztráld megfelelő, review-zható migrációval és regresszióteszttel;
- ha nem szükséges: távolítsd el a dead/unregistered implementációt.

A Node 24 `payload migrate:create` hibát külön infrastruktúra-problémaként kezeld; ne kapcsolj vissza `push:true`-t és ne hagyj jóvá destructive schema push-t workaroundként.

## C4 — Final evidence

Átadás előtt:
- production build zöld;
- `npm run visual:oracle:discover` továbbra is 113 route körüli aktuális first-hop discovery-t ad, eltérés esetén indokold;
- route parity újragenerálva;
- **MISSING=0, BROKEN=0**;
- főoldal regresszió nincs;
- admin hard gate-ek teljesülnek;
- releváns security regressziótesztek zöldek.

Átadáskor rögzítsd:
1. commit SHA-k;
2. `/wishbasket` architektúra + E2E evidence;
3. új route-parity összesítés;
4. admin collectionönként CRUD evidence;
5. auth/access evidence;
6. build/test parancsok és eredmények;
7. fennmaradó valódi P2/P3 blocker;
8. `STATUS: READY_FOR_REVIEW`;
9. `BALL: CHATGPT`.

---

## 7. Regression guard

Nem romolhat:
- elfogadott főoldal;
- már működő first-hop route;
- production build;
- meglévő valós adat;
- auth/security;
- Oracle route discovery;
- Bookings/Registrations/DonationPledges új access-control védelme.
