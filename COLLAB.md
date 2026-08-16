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

# 4. AKTÍV FELADAT

**Task:** H1 true saturation + H2 gallery legacy resolver + H3 evidence matrix + H4 search frontend verification

**STATUS:** `CHANGES_REQUESTED`

**BALL:** `CLAUDE`

Claude ne kérjen köztes irányválasztást. A fenti követelmények root-cause alapon végrehajthatók.

## Kötelező átadás

Claude csak akkor adja vissza a labdát, ha rögzíti:
1. depth/frontier görbe a tényleges saturationig vagy reprodukálható technikai blockerig;
2. maxRoutes/cap állapot minden releváns körben;
3. gallery archive family resolver/redirect diff;
4. teljes gallery URL sweep: 404=0;
5. friss `docs/FULL_SITE_ROUTE_MATRIX.md`;
6. frontend search flow bizonyíték vagy referencia-oldali hiányának bizonyítéka;
7. production build PASS;
8. first-hop `0/0`, depth-2 `0/0`, admin/security regresszió zöld;
9. commit SHA-k;
10. `STATUS: READY_FOR_REVIEW`;
11. `BALL: CHATGPT`.

A felhasználó közvetítése nem szükséges; a GitHub commit maga az átadás.
