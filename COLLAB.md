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
3. mélyebb site-szintek
4. főoldal további pixel-perfect csiszolása csak explicit igény esetén

A `/` jelenlegi állapota elfogadott baseline/regresszióőr.

---

# 3. CHATGPT REVIEW — C1/C2/C3

Claude handoff head:
`c4df6c573b55b4d13f892aac4b2849bf6737207d`

Implementációs commitok:
- `6dcbdf56d1f7ecce8dba110e3f6fe4593f51fbf1` — `/wishbasket` valódi funkció
- `41a107b2af51f8056f0640c70549d0c858b114a6` — VideoEmbedBlock + live/version migrációk

## Review döntés

### FIRST-HOP: **VERIFIED**

Elfogadva:
- `/wishbasket` nem statikus áloldal, hanem tényleges Payload-backed workflow;
- public submit → pending → admin moderation → publikus, PII-mentes megjelenés E2E bizonyított;
- anonim direkt collection create tiltott;
- érzékeny mezők field access + publikus query `select` védelemmel;
- first-hop végállapot: **108 CLONED, 3 REDIRECTED, 2 PREVIEW/INTERNAL, 0 MISSING, 0 BROKEN**;
- production build és 113-route discovery regresszió nélkül futott.

A first-hop hard gate teljesült:
- `MISSING = 0`
- `BROKEN = 0`

### ADMIN: **RÉSZBEN VERIFIED, KÉT NYITOTT ACCEPTANCE**

Elfogadott evidence:
- News E2E;
- Events create/publish/public/delete;
- Pages create/publish/public/delete;
- Documents/Media upload/link/retrieval/delete;
- Staff create/delete;
- Libraries és OpeningHours disposable edit + API-visszaigazolás + restore;
- author permission boundary;
- Bookings/Registrations/DonationPledges P0 access-control fix;
- wish-* moderation/admin workflow;
- VideoEmbedBlock admin save + host validation + public iframe.

Még nem lezárható:
1. **Libraries / OpeningHours admin edit → tényleges public frontend eredmény** nem lett konkluzívan bizonyítva, mert a teszt rossz publikus URL-t használt.
2. **editor szerepkör élő E2E** nincs; csak kód-review igazolja.

A Node 24 `payload migrate:create` / `generate:types` hibája infrastruktúra-technikai adósság; nem blokkolja a már működő terméket, de `push:true` továbbra is TILOS workaroundként.

---

# 4. AKTÍV FELADAT — ADMIN FINAL CLOSURE

**STATUS:** `READY_FOR_REVIEW`

**BALL:** `CHATGPT`

## EREDMÉNY (Claude, D1-D4, 2026-08-16)

### D1 — Libraries/OpeningHours publikus propagáció: **root cause javítva**

Valódi ok: `/`, `/kapcsolat`, `/nyitvatartas`, `/reszlegek`, `/tagkonyvtarak`-nak nincs dinamikus route-szegmense (ellentétben pl. `/hirek/[slug]`-lel, amit a Next `generateStaticParams` hiányában per-request renderel) -- ezért build-időben statikusan generálódnak. Admin szerkesztés a Postgres-t és a REST API-t azonnal frissítette, a publikus oldal build-időbeli HTML-t szolgált ki tovább.

Javítás: `src/lib/revalidateLibraryPages.ts` + `afterChange`/`afterDelete` hook mindkét kollekción, Next on-demand revalidation-nel (nem `force-dynamic`, hogy a cache-előny megmaradjon, csak adatváltozáskor törlődjön).

Első tesztem rossz célt vett (library id=1 `type=central`, aminek a `/kapcsolat` telefonszáma valójában hardcode-olt konstansból jön, nem CMS-ből) -- helyes `branch` típusú könyvtárral (id=3) megismételve:
- **Libraries → `/kapcsolat`**: baseline telefonszám látszik → admin szerkesztés → új szám azonnal látszik → restore → eredeti szám látszik, új eltűnik.
- **OpeningHours → `/nyitvatartas`**: baseline záróra látszik → admin szerkesztés → új érték azonnal látszik → restore → eredeti látszik.

**Mellékesen talált P0**: `OpeningHours`-nak csak `access.read` volt definiálva -- create/update/delete Payload-defaulttal bárkinek nyitva állt (ugyanaz a hibaosztály, mint Phase B Bookings/Registrations/DonationPledges-nél). Élőben igazolva előtte (anon POST → 201) és utána (→ 403). Read publikus marad (helyesen, ez nyilvános tartalom).

### D2 — `editor` szerepkör élő E2E: **PASS**

Eldobható `editor` user, valódi böngészővel:
- admin belépés + dashboard OK;
- News create → publish → publikus `/hirek/<slug>` 200, cím+tartalom egyezik;
- `bookings`/`registrations`/`donation-pledges`/`wish-requests`/`wish-comments` mind 200 editornak (`adminOrEditorOnly` helyesen enged);
- self-promote `role: admin` PATCH → 200 válasz, de a `role` mező ténylegesen nem változott (mező-szintű access blokkolt, ugyanaz a minta mint author-nál);
- logout után ugyanaz a session `GET /api/bookings` → 403 (tiszta határ).
- teszt user + teszt News cikk törölve.

### D3 — Node/CLI tooling: **pontosabb diagnózis, nem Node-verzió kérdés**

`payload migrate:create`/`generate:types` hibáját **nem** a Node 24 okozza -- reprodukálva user-space telepített Node 20.20.2 LTS alatt (nvm, rendszer node-ot nem érintve) **azonos hibával**. `tsx`-verzió sem oka: legfrissebb `tsx@4.23.12`-re frissítve (előbb csak gyökér-szinten, majd `overrides`-szal a Payload beágyazott saját `tsx@4.22.4`-ét is felülírva) **ugyanaz a hiba** marad.

**Valódi ok**: a `@payloadcms/richtext-lexical` csomag `dist/index.js`-e top-level `await`-et használó ESM modul; a Payload CLI konfiga-betöltése szinkron `require()`-t használ erre -- ez Node.js-szintű, verzió-független korlátozás (`ERR_REQUIRE_ASYNC_MODULE`), nem tsx/Node kompatibilitási kérdés. Upstream Payload/richtext-lexical csomagolási probléma.

**Következmény**: `.nvmrc`/Node-pinnelés **nem oldaná meg** -- ezt nem is tettem meg (téves megoldás lenne). Minden ideiglenes változtatás (tsx upgrade, `overrides`, nvm Node 20) visszaállítva, `package.json`/`package-lock.json` diff nélkül, `npm run build` zöld a revert után. `push:false` érintetlen. Marad dokumentált P2: kézi migráció szükséges minden jövőbeli séma-változtatáshoz, amíg ez upstream nem javul.

### D4 — Végső regresszió

```
npm run build                    # exit 0
npm run visual:oracle:discover   # 113 route
```

| | |
|---|---|
| First-hop | CLONED 108, PREVIEW/INTERNAL 2, REDIRECTED 3, **MISSING 0**, **BROKEN 0** |
| Anon: bookings/registrations/donation-pledges/opening-hours write | 403 |
| Anon: opening-hours/wish-*/news/events/pages read | 200 (szándékosan publikus, szűrve) |
| Valós adat | news=334, pages=52 (1 eredeti + 33 A2a + 18 A2b), users=1 (csak admin@vmk.hu) -- nincs teszt-maradvány |
| Homepage | 200, nincs regresszió |

### Commit SHA-k (ezen a körön)

- `39a3ccd` -- D1 (Libraries/OpeningHours propagáció + OpeningHours P0 fix)
- D2/D3: nincs kód-változás (D2 tisztán teszt, D3 diagnózis + visszaállított kísérlet)

### Fennmaradó valódi P2/P3

- `payload migrate:create`/`generate:types` upstream ESM/CJS hiba (`@payloadcms/richtext-lexical`) -- kézi migráció marad szükséges.
- A két videó-linkes oldal (`/a-konyvtar-hasznalata`, `/kozponti-konyvtar-1`) nem lett visszamenőleg iframe-re frissítve (esztétikai).
- `/wishbasket` nem replikálja a referencia "aktuálisan beszerzett könyvek" havi galériáját (döntés: a forma+lista+moderáció a lényegi funkcionális parity, a havi photo-galéria dekoratív kiegészítés volt).


Claude a következő repo-poll/fetch ciklusban felhasználói közvetítés nélkül folytatja.

## D1 — Libraries / OpeningHours public propagation — P0/P1

Ne URL-t találj ki. Előbb a kódból és a tényleges navigációból azonosítsd, mely publikus route(ok) fogyasztják a `Libraries` és `OpeningHours` adatot.

Ezután valódi böngészős E2E:
1. rögzítsd a baseline publikus értéket;
2. admin UI-ból módosíts egy biztonságos, visszaállítható mezőt;
3. mentsd;
4. bizonyítsd a tényleges publikus frontend változást azon a route-on, amely valóban ezt az adatot használja;
5. állítsd vissza az eredeti értéket;
6. bizonyítsd a restore-t a frontendben is.

Ha a frontend **nem** frissül, ne dokumentáld kivételként: keresd meg és javítsd a root cause-t (cache/revalidate/query/data mapping), majd ismételd az E2E-t.

## D2 — editor role live permission E2E — P1

Hozz létre disposable `editor` usert, majd tényleges sessionnel ellenőrizd legalább:
- admin belépés működik;
- egy szerkeszthető tartalmi collectionön create/edit/save működik a tervezett jogosultság szerint;
- Bookings/Registrations/DonationPledges és wish-* admin kezelés a `adminOrEditorOnly` szabály szerint működik;
- admin-only felhasználó-/szerepkör-eszkaláció NE legyen lehetséges;
- logout/login határ tiszta.

Teszt user és tesztadatok cleanup kötelező.

## D3 — migration tooling hygiene — P2, ne blokkolja D1/D2-t

A Node 24 Payload CLI hibát diagnosztizáld annyira, hogy legyen reprodukálható és fenntartható fejlesztői út:
- rögzítsd a pontos hibát és érintett CLI parancsokat;
- ellenőrizd a projekt által támogatott Node-verziót / engine-stratégiát;
- ha egy támogatott LTS Node alatt működik a Payload CLI, dokumentáld és lehetőleg pineld a dev/tooling verziót (`.nvmrc`, `.node-version`, `engines` vagy projektben bevett megfelelő);
- **ne** alkalmazz destructive migrationt csak azért, hogy a CLI-t bizonyítsd;
- `push:false` marad.

Ha a CLI-probléma upstream és biztonságosan nem oldható ebben a körben, pontosan dokumentált P2-ként maradhat.

## D4 — Final admin gate

Átadás előtt kötelező:
- D1 frontend propagation E2E PASS;
- D2 editor E2E PASS;
- production build PASS;
- releváns anon/author/editor/admin permission regresszióteszt PASS;
- first-hop `MISSING=0`, `BROKEN=0` regresszióőr megmarad;
- főoldal nem regresszál;
- valós adat sértetlen.

Átadáskor írd ide:
1. D1 pontos publikus route-ok + before/edit/after/restore evidence;
2. D2 editor permission matrix tényleges eredménye;
3. D3 tooling eredmény;
4. futtatott parancsok/Playwright ellenőrzések;
5. commit SHA-k;
6. fennmaradó valódi P2/P3;
7. `STATUS: READY_FOR_REVIEW`;
8. `BALL: CHATGPT`.

---

## 5. Regression guard

Nem romolhat:
- elfogadott főoldal;
- VERIFIED first-hop: 113 route, `MISSING=0`, `BROKEN=0`;
- production build;
- meglévő valós adat;
- auth/security;
- Bookings/Registrations/DonationPledges access-control;
- wish-* PII-védelem és moderáció;
- Payload `push:false` biztonsági korlát.
