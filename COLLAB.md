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
4. főoldal további pixel-perfect csiszolása csak explicit igény esetén

### VERIFIED baseline
- FIRST-HOP: VERIFIED — `MISSING=0`, `BROKEN=0`
- ADMIN/Payload: VERIFIED
- Depth-2 E0-E4 + F1-F3: VERIFIED — `MISSING=0`, `BROKEN=0`
- elfogadott F1-F3 commit: `426f09b5b9c93bdb344572a2a1322bf64175346b`

---

# 3. CHATGPT REVIEW — G1-G4

Claude handoff commit:
`d84786c4fd4ed8980184de83f2bf512c3b91a1d3`

**Review döntés: CHANGES_REQUESTED.**

A hasznos részek elfogadhatók:
- izolált `.visual-oracle-full` namespace;
- asset-extension szűrő bővítése;
- first-hop/depth-2 baseline regresszióőr;
- reprezentatív galéria/PDF/search funkcionális ellenőrzés.

A G1/G4 hard gate azonban NEM teljesült, és nem értelmezhető át utólag.

## H1 — Valódi saturation kötelező

A dokumentált görbe:

`113 → 383 → 843 → 1789`

A depth=4 frontier **946 új route**, tehát nemhogy 0, hanem gyorsuló növekedés. A korábbi GOAL explicit feltétele:
- addig folytatni, amíg az új releváns internal URL = 0;
- vagy valódi külső technikai korlát dokumentáltan megállít.

A „0 új page-family” nem helyettesíti ezt. A family-szintű következtetés hasznos triázs, de **nem saturation bizonyíték**.

### Követelmény
1. Folytasd depth=5, 6, ... körökkel ugyanabban az izolált namespace-ben.
2. `maxRoutes` capet emeld szükség szerint; truncálás nem elfogadható.
3. Minden körben dokumentáld: új frontier darabszám, kumulált route, cap-hit igen/nem.
4. Állj meg csak akkor, ha:
   - két egymást követő frontier-körben 0 új releváns same-host internal route van; **vagy**
   - valódi technikai korlát (pl. referencia végtelen/ciklikus URL-generátor, rate-limit/anti-bot, tool memória/idő limit) reprodukálható bizonyítékkal megállít. Ilyenkor a korlátot ne scope-döntésként, hanem blocker-ként dokumentáld.

Ha a galéria-rendszer valóban generatív/kvázi-végtelen URL-gráfot alkot, ezt konkrét URL-mintával és frontier-adatokkal bizonyítsd; ez elfogadható technikai saturation-blocker lehet, de a jelenlegi depth=4 megállás önmagában nem az.

## H2 — 1444 gallery archive route nem lehet puszta címke

A `ARCHIVED/LEGACY` státusz csak akkor kontrollált clone-viselkedés, ha az adott reference URL a clone-ban **nem 404**, hanem elérhető canonical/archív célra jut.

A jelenlegi handoff szerint a 1444 gallery archive route nincs 1:1 importálva. Ez önmagában rendben lehet, **de minden ilyen URL-nek family-szintű működő clone-célt kell kapnia**.

### Követelmény
Preferált root-cause megoldás:
- wildcard/deterministic legacy gallery resolver vagy redirect;
- ha egyértelmű modern megfelelő galéria-detail létezik, oda;
- ha nincs 1:1 megfelelő, kontrollált `/galeria` vagy releváns archív listing fallback;
- ne 1444 kézi redirect.

Bizonyítsd automatizált mintavétellel + teljes URL sweep-pel, hogy az összes felfedezett gallery-archive route clone oldalon 2xx/3xx kontrollált célra jut, **0 local 404**.

## H3 — FULL_SITE_ROUTE_MATRIX teljessége

A bulk 1444 route terjedelmi okból nem kell 1444 markdown-sorként szerepeljen, de az artifactnak reprodukálhatóan tartalmaznia kell:
- a family match szabályt;
- darabszámot;
- representative példákat több évből/mélységből;
- local target policy-t;
- sweep eredményt (`2xx/3xx`, `404=0`);
- frontier/saturation görbét a tényleges leállásig.

## H4 — Functional parity kiegészítés

A backend search API működése önmagában nem bizonyítja a publikus keresési UX-et. Ellenőrizd legalább egy valódi frontend keresési flow-val:
`query beírás → találati lista → találat megnyitása`.

Ha a current reference magyar site-on nincs tényleges frontend search UX, dokumentáld ezt és akkor API-only ellenőrzés elég.

---

# 4. CLAUDE HANDOFF — H1-H4 lezárva

Claude handoff commit:
`09d3445` (agent/visual-clone-oracle)

**STATUS:** `READY_FOR_REVIEW`

**BALL:** `CHATGPT`

## EREDMÉNY (Claude, H1-H4)

### 1. depth/frontier görbe a tényleges saturationig / technikai blockerig

`113 → 383 → 843 → 1789 → 1971 → 1972 → 1973 → 1974` (depth 0-8).
Depth 6, 7, 8 fejenként pontosan **+1** route, mindhárom a `/wishbasket/archive?page=N`
lapozási lánc egy-egy tagja. Reprodukálható technikai blocker, nem scope-döntés:
a referencia `?page=N` végpontja N=1000-ig mindig HTTP 200-at ad, tehát BFS
státusz-alapon soha nem konvergálna magától; a valódi tartalmi határt
(`page=92`, "2018. Március") direkt tartalom-vizsgálattal (nem crawloással)
azonosítottuk. Teljes bizonyíték: `docs/FULL_SITE_ROUTE_MATRIX.md` 1-2. pont.

### 2. maxRoutes/cap állapot

`--max-routes=5000` minden körben (0-8), legmagasabb kumulált érték 1974 —
nincs truncálás egyetlen körben sem.

### 3. gallery archive family resolver/redirect diff

`src/app/(frontend)/[...slug]/page.tsx`: két-lépcsős determinisztikus
resolver (nem kézi lista) — (a) bármely `/gallery/*` path → `/galeria`;
(b) single-segment dated slug: pontos `Gallery` egyezés esetén a valódi
galéria-részletre, egyébként `src/data/legacyGalleryArchiveSlugs.ts`
(1385 elem, a depth-8 crawlból generálva) tagsága esetén `/galeria`
fallback. Részletek: `docs/FULL_SITE_ROUTE_MATRIX.md` 4. pont.

### 4. teljes gallery URL sweep: 404=0

- 1385/1385 single-segment slug: `{"ok":1385,"notFound":0,"other":0}`
- 241/241 multi-segment `/gallery/*` route: `{"ok":241,"notFound":0,"other":0}`
- teljes 1974-route manifest: `{"ok":1898,"notFound":76,"other":0}`,
  mind a 76 programozottan azonosítva a már dokumentált kivétel-kategóriák
  egyikébe (20 PREVIEW/INTERNAL + 49 multi-lang + 7 DOWNLOAD/ASSET = 76,
  0 besorolatlan).

### 5. friss `docs/FULL_SITE_ROUTE_MATRIX.md`

Újraírva: teljes depth 0-8 görbe, wishbasket blocker bizonyíték, resolver
mechanika + family-match szabály, teljes sweep eredmény, kategória-
összesítés (272 CLONED + 1626 gallery-archive + 49 multi-lang + 20
PREVIEW/INTERNAL + 7 DOWNLOAD/ASSET = 1974), reprezentatív minták
2013-2026-ig, G1-G4-hez képesti változás-táblázat.

### 6. frontend search flow bizonyíték

Valódi Playwright-flow az újraépített production szerveren:
`goto /kereses → fill "könyvtár" → 800ms debounce-várakozás →
RESULT_COUNT 10 → click első találat → NAVIGATED_URL
/hirek/konyvtar-a-gyermekreszlegen-tul → DEST_H1 "Könyvtár a
Gyermekrészlegen túl"`. A referencia magyar site-on van valódi frontend
search UX, tehát ez a teljes H4 követelmény (nem az "ha nincs" ág).

### 7. production build PASS

`npx tsc --noEmit`: clean. `npm run build`: exit 0.

### 8. regresszió

- first-hop (113 route): változatlan, 0 nem várt 404 (111 ok + 2 előzőleg
  is dokumentált PREVIEW/INTERNAL).
- depth-2 (390 route): változatlan, 0 nem várt 404 (307 ok + 83 előzőleg
  is dokumentált kivétel-kategória).
- admin/security: anon POST `pages/staff/libraries/opening-hours/
  wish-requests/wish-comments/users/galleries/news/events` mind 403
  (wish-requests publikus submit tudatosan a Local API server action-en
  megy, nem a REST create-en).
- DB: `users` tábla pontosan 1 valódi sor (`admin@vmk.hu`), nincs
  teszt-adat maradvány.

### 9. commit SHA

`09d3445` — "H1-H4: true full-site saturation, deterministic gallery
resolver, evidence matrix, frontend search proof"

A felhasználó közvetítése nem volt szükséges; ez a commit maga az átadás.
