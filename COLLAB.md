# COLLAB.md — www-vmk CLONE PARITY RECOVERY

Ez a fájl a www-vmk projekt egyetlen operatív koordinációs forrása.

> Alapszabály: a felhasználó NEM közvetítő az AI-k között. GitHub commit/branch + ez a fájl jelenti az átadást.

# 1. Üzemmód

**CLONE PARITY RECOVERY: ON**

A cél nem pusztán működő modern VMK-oldal, hanem a jelenlegi `https://www.vmk.hu/` nyilvános magyar oldalának tartalmilag, médiában, linkekben, funkcióban és megjelenésben veszteségmentes modern klónja.

A korábbi „FINALIZATION / merge-readiness” prioritás FELFÜGGESZTVE addig, amíg a valódi clone-parity nincs bizonyítva.

# 2. Korábbi parity baseline — VISSZAVONVA

A korábbi állítások:
- FIRST-HOP VERIFIED / MISSING=0 / BROKEN=0;
- Depth-2 VERIFIED;
- Full-site H1-H4 VERIFIED;

**NEM használhatók többé clone-parity acceptance evidence-ként.**

Indok:

1. `docs/FIRST_HOP_ROUTE_MATRIX.md` sok `CLONED` minősítést csak ilyen evidence alapján adott: HTTP 200 + hozzávetőleges szószám + van H1. Ez nem bizonyít azonos tartalmat, képeket, linkeket, dokumentumokat vagy layoutot.
2. `docs/FULL_SITE_ROUTE_MATRIX.md` 1626 gallery/archive route jelentős részét ARCHIVED/LEGACY kategóriával `/galeria` fallbackre irányította, és explicit leírja, hogy a tényleges fotók 1:1 migrációja nem történt meg. Ez ellentétes a teljes klón céljával.
3. A jelenlegi `tools/visual-oracle.mjs` contentSimilarity egyedi szavak halmazának Jaccard-indexe. Nem érzékeli megbízhatóan a sorrendet, ismétlődést, hiányzó bekezdéseket/szekciókat; a sitewide chrome szavai torzíthatják az eredményt.
4. A jelenlegi snapshot képeknél/linkeknél csak darabszámot tárol (`imageCount`, `linkCount`), nem ellenőrzi, hogy ugyanazok a képek/linkek vannak-e jelen, működnek-e, illetve ugyanarra a tartalomra mutatnak-e.
5. A Visual Oracle pixel/content gate nem volt kötelezően összekötve a route-mátrix `CLONED` klasszifikációval. Emiatt route-parity PASS és visual/content FAIL egyszerre is létezhetett.

Következmény: a jelenlegi branch **NEM release candidate** clone-parity szempontból, amíg az alábbi v2 audit nem fut le és a feltárt eltérések nincsenek lezárva.

# 3. Kötelező agent-izoláció

**1 agent = 1 branch = 1 worktree.**

- Claude: saját worktree, primary branch `agent/visual-clone-oracle`.
- Gemini: saját worktree, audit branch `agent/gemini-final-audit` vagy külön új audit branch.
- Shared `/srv/projects/www-vmk` checkoutban párhuzamos munka alatt tilos branch-váltás/szerkesztés.
- ChatGPT csak GitHub API/connectoron keresztül koordinál/review-zik.

# 4. Szerepek

## Claude — PRIMARY IMPLEMENTER
- építi a parity mérőt és javítja a valódi eltéréseket;
- nem minősíti saját munkáját végleg VERIFIED-nek;
- csak evidence-del ad vissza.

## Gemini — INDEPENDENT PARITY AUDITOR
- Claude implementációjától független mintavételes/reference audit;
- kifejezetten hamis pozitív PASS-okat, hiányzó média/link/tartalom hibákat keres;
- nem lazítja a gate-eket.

## ChatGPT — ORCHESTRATION / ACCEPTANCE
- módszertant és gate-et definiál;
- remote evidence-et ellenőriz;
- hamis pozitív acceptance-et visszautasít;
- `BALL: USER` csak valódi végső merge/launch döntéshez.

# 5. Clone Parity Oracle v2 — KÖTELEZŐ HARD GATE

A v2-nek referencia és klón oldalpárt kell összehasonlítania. Egy oldal csak akkor lehet `PARITY_PASS`, ha az alábbi dimenziók mind megfelelőek.

## 5.1 URL / route
- referencia HTTP/final URL rögzítve;
- klón HTTP/final URL rögzítve;
- kontrollálatlan 404/5xx = FAIL;
- redirect csak akkor PASS, ha:
  - a referencia is azonos/canonical módon redirectel, VAGY
  - a céloldal bizonyítottan ugyanazt a tartalmat/funkciót reprezentálja;
- generikus listaoldalra redirect nem helyettesíthet egy konkrét referencia detail/gallery oldalt.

## 5.2 Szöveg / tartalom
A globális site chrome (header/nav/sidebar/footer/cookie) és az oldal fő tartalma külön kezelendő.

Kötelező:
- `main`/tartalmi blokk normalizált, sorrendtartó szövegének összevetése;
- reference-text coverage mérés: a referencia érdemi szövegének legalább 99%-a legyen jelen vagy explicit, review-zott transzformációval megfeleltetve;
- címek/h1-h3 sorrend és szöveg összevetése;
- bekezdések, listák, táblák és fontos metaadatok (dátum, helyszín, kontakt, szerző stb.) jelenléte;
- puszta word-set/Jaccard nem használható acceptance gate-ként.

## 5.3 Képek / média
Nem elég a darabszám.

Kötelező oldalanként:
- tartalmi `img`, `picture/srcset`, releváns CSS background image és galériaelem inventory;
- reference és clone médiák megfeleltetése vizuális hash/perceptuális hash vagy más tartalom-alapú összevetéssel, mert a clone rehostolhatja a fájlokat;
- broken image (`naturalWidth=0`, 4xx/5xx asset) = FAIL;
- referencia tartalmi képfedettség cél: 100%, kivéve explicit bizonyított sitewide/dekoratív kivétel;
- galéria detailnél az album képeinek 1:1 tartalmi lefedése kötelező; `/galeria` fallback önmagában nem PASS.

## 5.4 Linkek / dokumentumok
Nem elég a linkCount.

Kötelező:
- `main` tartalmi linkek listája anchor text + href + típus szerint;
- belső linkek canonical/routeOverride normalizálása után semantic set összevetés;
- külső linkek, mailto, tel, PDF/download linkek jelenlétének összevetése;
- minden clone belső/download link tényleges HTTP ellenőrzése;
- broken link = FAIL;
- referencia érdemi link coverage cél: 100%, kivéve explicit review-zott legacy/invalid reference link.

## 5.5 Struktúra
Kötelező összevetni:
- headings;
- paragraph/list/table count és kulcstartalom;
- formok és mezők;
- gallery/card/list elemek;
- dokumentum/download blokkok;
- kapcsolati/nyitvatartási adatok.

## 5.6 Funkció
Funkcionális oldalt nem lehet statikus 200/H1 alapján PASS-nak minősíteni.

Valódi E2E szükséges ahol releváns:
- search;
- kapcsolat;
- hírlevél;
- teremfoglalás;
- esemény/registration;
- wishbasket;
- galéria böngészés/detail;
- admin create/edit/publish -> public frontend;
- dokumentum/PDF letöltés.

## 5.7 Vizuális parity
Desktop 1440 és mobile 390 kötelező reprezentatív oldalakra/page-family-kre.

- screenshot reference vs clone ugyanabban a browser/runtime-ban;
- pixel/coarse diff report kötelező;
- eltérő magasságot tilos úgy normalizálni, hogy a tartalmi hiány vizuálisan elrejtődjön;
- a reportnak explicit meg kell mutatnia reference/local képet és top diff régiókat;
- magas vizuális diff nem söpörhető félre azért, mert route/content smoke zöld.

# 6. K1 — Oracle v2 megépítése és FALSE-POSITIVE canary audit

**STATUS: IN_PROGRESS**

**BALL: CLAUDE**

Claude következő feladata:

1. Ne folytassa a merge-readiness/final CI lezárást fő prioritásként. A CI-fix megőrzendő, de jelenleg másodlagos.
2. Implementálja a Clone Parity Oracle v2-t a fenti dimenziókkal. Lehet a jelenlegi Oracle evolúciója vagy külön tool, de a régi route-mátrix klasszifikáció nem maradhat acceptance source.
3. Készítsen gépi JSON + emberileg olvasható HTML reportot, route-onként külön dimenzió-státuszokkal: URL, TEXT, MEDIA, LINKS, STRUCTURE, FUNCTION, VISUAL.
4. Első canary futás legalább 20, tudatosan vegyes referencia oldalon:
   - `/`;
   - legalább 5 aktuális news/event detail;
   - legalább 5 statikus/intézményi oldal;
   - legalább 3 branch/department oldal;
   - `/gallery` + legalább 3 konkrét referencia galéria/detail/archive route;
   - `/wishbasket`;
   - legalább 1 dokumentum/PDF-heavy oldal.
5. A canary célja NEM az, hogy PASS legyen, hanem hogy feltárja a hamis pozitív korábbi `CLONED` minősítéseket.
6. Készítsen `docs/CLONE_PARITY_GAP_REPORT.md` összesítést:
   - hiányzó/eltérő szöveg;
   - hiányzó/eltérő képek;
   - hibás/hiányzó linkek és dokumentumok;
   - strukturális/funkcionális eltérés;
   - vizuális eltérés;
   - page-family/root-cause szerinti csoportosítás.
7. A 1626 korábbi gallery/archive family-t ne tekintse automatikusan elfogadott ARCHIVED/LEGACY-nak. Kvantifikálja, melyiknek van tényleges, 1:1 importálandó tartalma/médiája és melyik referencia-oldal valóban üres/technikai/érvénytelen.
8. Ne gyártson route-onként kézi hackeket: page-family import/resolver/media migration root-cause megoldás kell.

## K1 acceptance

K1 akkor adható review-ra, ha:
- Oracle v2 konkrétan képes kimutatni olyan eltéréseket, amelyeket a régi `CLONED` logika átengedett;
- legalább 20-route canary riport elkészült;
- minden dimenzió külön mérhető;
- hiányzó képek és hibás linkek ténylegesen megjelennek a riportban;
- nincs gate-lazítás azért, hogy több PASS legyen.

Átadás:

```text
STATUS: READY_FOR_REVIEW
BALL: CHATGPT
```

# 7. K2–K4 — utána következő lezárási terv

## K2 — teljes referencia inventory
- saturation crawl + page-family inventory;
- text/media/link/document/function deficit kvantifikálása;
- nincs több „MISSING=0” csak HTTP státusz alapján.

## K3 — root-cause parity closure
Prioritás:
1. current first-hop;
2. current depth-2;
3. aktuális news/events/static pages;
4. gallery/media/document családok;
5. legacy/archive, ahol a referencián tényleges tartalom van.

## K4 — final acceptance
Csak akkor:
- content parity bizonyított;
- media parity bizonyított;
- link/document parity bizonyított;
- funkciók E2E zöldek;
- vizuális parity page-family szinten elfogadott;
- GitHub CI zöld;
- security/WCAG gate zöld;
- PR mergeable.

Ekkor és csak ekkor lehet `BALL: USER` a merge/launch döntéshez.
