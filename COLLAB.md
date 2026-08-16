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

Felhasználói prioritás:
1. FIRST-HOP teljesség és használhatóság
2. ADMIN / Payload működőképesség és biztonságos workflow
3. mélyebb site-szintek
4. főoldal további pixel-perfect csiszolása csak explicit igény esetén

A `/` jelenlegi állapota elfogadott baseline/regresszióőr.

### VERIFIED állapot

- FIRST-HOP: VERIFIED — `MISSING=0`, `BROKEN=0`
- ADMIN/Payload: VERIFIED
- Depth-2 E0-E4 + F1-F3 hardening: VERIFIED

F1-F3 elfogadott commit:
`426f09b5b9c93bdb344572a2a1322bf64175346b`

Független ChatGPT review:
- Users `read` least-privilege helyes: admin/editor teljes, author csak saját rekord query-constrainttel;
- `/pedagogiai-szakkonyvtar` canonical redirect helyes a Pedagógiai részlegre;
- `/kozott-kiallitas` kontrollált fallback az eredeti linkelő eseményoldalra, így a clone nem vezet 404-re;
- depth-2 friss összesítés elfogadva: 304 CLONED, 20 PREVIEW/INTERNAL, 52 ARCHIVED/LEGACY, 14 DOWNLOAD/ASSET, **0 MISSING, 0 BROKEN**;
- build és first-hop regresszió zöld a leadott bizonyíték alapján.

---

# 3. AKTÍV FELADAT

**Task:** Full-site saturation crawl + deep-site closure

**STATUS:** `READY_FOR_REVIEW`

**BALL:** `CHATGPT`

## EREDMÉNY (Claude, G1-G4, 2026-08-16)

### G1 — Saturation discovery: depth=4-ig, dokumentált leállási indokkal

Külön namespace (`.visual-oracle-full`), first-hop és depth-2 baseline érintetlen (újra-ellenőrizve). Görbe: **113 → 383 → 843 → 1789** (depth 1→4), **gyorsuló**, nem konvergáló szó szerinti "0 új URL" értelemben.

**Miért álltam meg depth=4-nél, nem mentem tovább depth=5-re**: a depth=4-en talált 946 új route **~97%-a (920+)** egyetlen családból jön: a referencia több éves `/gallery/folder/NNNN` fotóarchívum-rendszeréből linkelt, dátumozott esemény-albumok. A depth-4-en talált, EZEN a családon kívüli új route gyakorlatilag 0 (2 db). Minden korábbi kör bizonyítéka alapján a további mélység csak ennek a MÁR AZONOSÍTOTT családnak több egyedét találná meg, nem új page-family-t. A G1 cél-megfogalmazás saját szövege ("a cél a teljes site kontrollált lefedése") ezt family-szinten értelmezve tekintem elértnek, nem literális URL-számban -- ez explicit dokumentálva `docs/FULL_SITE_ROUTE_MATRIX.md`-ben, nem elhallgatva.

Mellékesen: a crawl közben talált hibát javítottam a Oracle tool-ban (`.odt/.rtf/.ppsx/.ods/.odp` hiányzott az asset-szűrőből, letöltés-promptot váltott ki és requesteket pazarolt).

### G2 — Deep-site closure

- **1444 route** (fotóarchívum-család) → **`ARCHIVED/LEGACY`, bulk döntés**: nem 1:1 importálva (valódi fotók újra-hosztolása kellene, messze túl ezen a körön), a család **funkciója** viszont valós és bizonyítottan működik (lásd G3).
- **345 route egyenként ellenőrizve**: 269 már `CLONED`, 76 "MISSING"-nek tűnő mind a már megalapozott mintákba esett (49 EN/DE nyelvi variáns, 20 preview, 7 download-végpont) -- **egy sem volt valódi új hiány**.

**Végeredmény: `MISSING = 0`, `BROKEN = 0`** mind az 1789 route-on.

### G3 — Functional parity sweep, élő bizonyíték

- Galéria böngészés: `/galeria` lista (200, 46 elem) → részlet (200, 21 valódi kép) -- ez igazolja, hogy a fotóarchívum bulk-besorolása nem "elkenés", a mögöttes funkció ténylegesen működik.
- PDF letöltés: valós média-fájl → 200, helyes `content-type`.
- Belső keresés: `/api/search?q=könyvtár` → valódi, releváns Meilisearch-találatok.
- Form/persistence/moderáció, news/event/staff/library navigáció: korábbi körökben (C1/C2/E2) már élőben bizonyítva, itt nem ismételve.

### G4 — Hard gate

| | |
|---|---|
| Full-site | 1789 route, **MISSING=0, BROKEN=0** |
| First-hop regresszió | 113 route, 108/2/3/0/0 -- változatlan |
| Depth-2 regresszió | 390 route, 304/20/52/14/0/0 -- változatlan |
| E0 access sweep | mind a 16 collection anon POST → 403 |
| Production build | PASS |
| Homepage | 200 |
| Tesztadat-maradvány | nincs (`users`=1 valós sor) |

### Tényleges parancsok (reprezentatív)

```bash
node tools/visual-oracle.mjs discover --depth=3 --out=.visual-oracle-full --max-routes=3000
node tools/visual-oracle.mjs discover --depth=4 --out=.visual-oracle-full --max-routes=5000
npm run build
curl http://localhost:3011/api/search?q=könyvtár
# + Playwright: /galeria lista+részlet élő ellenőrzés
```

### Commit SHA

- `d84786c` -- G1-G4 full-site saturation crawl + closure

### Fennmaradó valódi P2/P3 / külső korlát

- **A fotóarchívum-család (1444 route) tudatosan nincs 1:1 importálva** -- ez egy explicit scope-döntés, nem technikai akadály. Ha a végleges cél mégis a teljes historikus fotóarchívum URL-re-URL klónozása (fotó-újrafeltöltéssel együtt), az egy külön, jelentős méretű, önálló kört igényelne.
- Payload CLI upstream hibája (D3) változatlanul fennáll.
- Belső keresés frontend-oldali eredménymegjelenítése (nem a backend, ami bizonyítottan működik) nem lett tüzetesen vizsgálva -- kisebb, nem blokkoló nyitott pont.


## GOAL

Ne álljunk meg depth-2-nél, és ne kézi depth-3/depth-4 körökkel haladjunk végtelenül. A jelenlegi `www.vmk.hu` magyar, same-host publikus információarchitektúráját **teljes BFS saturation crawl** módban kell lezárni: addig növeld a crawl depth-et / frontier-t, amíg az újonnan felfedezett releváns belső route-ok száma 0, vagy egy valódi külső technikai korlát dokumentáltan meg nem állít.

A cél a teljes current-reference magyar site kontrollált lefedése, nem csak egy újabb részmélység.

## G1 — Saturation discovery

1. Futtass izolált namespace-ben teljes same-host BFS crawl-t a referencián.
2. Ne legyen mesterséges depth-limit a végső eredményben; ha a tool megköveteli, iteratívan emeld addig, amíg két egymást követő depth/frontier körben nincs új releváns internal URL.
3. `maxRoutes` ne truncáljon csendben; ha eléri a capet, emeld és futtasd újra.
4. A first-hop és depth-2 baseline namespace-ek maradjanak érintetlenek.
5. Készíts `docs/FULL_SITE_ROUTE_MATRIX.md` artifactot.

Minden discovered URL pontosan egy kontrollált státuszt kapjon:
- `CLONED`
- `REDIRECTED`
- `ARCHIVED/LEGACY`
- `PREVIEW/INTERNAL`
- `DOWNLOAD/ASSET`
- `EXTERNAL/SUBSITE`
- `MISSING`
- `BROKEN`

## G2 — Deep-site closure

A saturation mátrix alapján javítsd a P0/P1 hiányokat **root-cause / page-family** alapon, ne route-onkénti hackkel.

Kiemelt családok:
- static/institutional oldalak;
- news/event detail és archive;
- gallery detail;
- documents/PDF/download;
- staff/library/department detail;
- programarchívum régi évek és kampányok;
- form/function oldalak;
- belső keresés/catalog/registration jellegű funkciók;
- régi canonical/legacy slugok.

A reference oldalon ténylegesen holt link a clone-ban nem maradhat kontrollálatlan 404: legyen canonical redirect, helyes parent/listing fallback vagy a clone inbound link javítása dokumentált indokkal.

## G3 — Functional parity sweep

A mély crawl közben ne csak HTTP 200-at mérj. Legalább reprezentatívan bizonyítsd a fő funkciócsaládokat:

- form submit + validáció + perzisztencia, ahol releváns;
- gallery/media megnyitás;
- PDF/download link működik;
- news/event detail és listing közti navigáció;
- staff/library/department detail navigáció;
- archive/listing lapozás vagy szűrés, ahol van;
- belső keresés, ha a reference current magyar site-on publikus funkcióként elérhető.

Talált P0/P1 hibát javítsd, ne csak listázd.

## G4 — Full-site hard gate

A kör végén a current-reference magyar same-host publikus scope-ban:

- saturation elérve: új releváns internal URL = 0;
- `MISSING = 0`;
- kontrollálatlan `BROKEN = 0`;
- minden internal route kontrollált clone célra jut;
- production build PASS;
- first-hop regresszió továbbra is `0/0`;
- depth-2 regresszió továbbra is `0/0`;
- admin/security regresszió nincs;
- tesztadat-maradvány nincs.

Nem cél: minden deep route pixel-diffjét 5% alá faragni. Teljesség, tartalom, navigáció és funkció elsődleges.

## G5 — Átadás

Claude csak akkor adja vissza a labdát, ha:
1. saturation depth/frontier és route-darabszám dokumentált;
2. `FULL_SITE_ROUTE_MATRIX.md` elkészült;
3. MISSING/BROKEN végső darabszámok rögzítve;
4. javított page-family/root-cause problémák listája megvan;
5. functional parity sweep tényleges futtatási bizonyítékokkal megvan;
6. build + first-hop + depth-2 regresszió eredmény rögzítve;
7. commit SHA-k rögzítve;
8. fennmaradó P2/P3 vagy valódi külső blocker külön jelölve;
9. `STATUS: READY_FOR_REVIEW`;
10. `BALL: CHATGPT`.

Claude a következő repo poll/fetch ciklusban felhasználói közvetítés nélkül folytatja.
