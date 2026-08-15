# COLLAB.md — www-vmk együttműködési protokoll

Ez a fájl a www-vmk projektben a **ChatGPT ↔ Claude** együttműködés operatív forrása. A projektben jelenleg ez a két AI dolgozik. A feladatok, átadások, review-k és bizonyítékok állapotát itt kell vezetni.

> **Alapszabály:** aki implementál, nem nyilváníthatja a saját munkáját függetlenül ellenőrzöttnek. Egy időben egyértelműen egy szereplőnél van a „labda”.

## 1. Szerepek

### ChatGPT
- scope és acceptance criteria pontosítása;
- repo- és architektúra-audit;
- feladatbontás és prioritás;
- komplex vagy keresztmetszeti implementáció, ha kifejezetten ezt kapja feladatul;
- Claude implementációjának független review-ja;
- mérési eredmények, diffek és bizonyítékok értékelése;
- a `COLLAB.md` státuszának frissítése saját átadáskor.

### Claude
- elsődleges lokális implementáció és javítás a teljes futó stackben;
- Playwright/scraper/CSS/layout/migrációs munka;
- tesztek és mérőeszközök tényleges futtatása a projektkörnyezetben;
- mérési eredmények és pontos fájl-/commit-hivatkozások rögzítése;
- a `COLLAB.md` státuszának frissítése saját átadáskor.

### Felhasználó
- végső scope- és termékdöntés;
- vitás prioritás vagy elfogadási küszöb eldöntése;
- merge/release jóváhagyása, amikor szükséges.

## 2. Labda-szabály

Minden aktív feladatnál pontosan egy `BALL` érték lehet:

- `CHATGPT`
- `CLAUDE`
- `USER`

Akihez a labda tartozik, az dolgozik. A másik AI nem kezd párhuzamos, ütköző implementációba ugyanazon scope-on.

Átadáskor kötelező rögzíteni:

1. mit kellett elérni;
2. mi változott;
3. mit futtatott ténylegesen;
4. mi lett az eredmény;
5. mi maradt nyitva;
6. pontosan mit kell a következő szereplőnek ellenőriznie vagy elvégeznie.

## 3. Státuszmodell

Használt státuszok:

- `SCOPE` — cél és acceptance criteria kialakítása folyamatban
- `READY` — scope validálva, implementálható
- `IN_PROGRESS` — implementáció folyamatban
- `READY_FOR_REVIEW` — implementáció elkészült, független review szükséges
- `CHANGES_REQUESTED` — review hibát talált, vissza az implementálóhoz
- `VERIFIED` — független review + szükséges mérés sikeres
- `BLOCKED` — bizonyítható külső vagy technikai akadály
- `DONE` — felhasználó által elfogadott / merge-re kész vagy lezárt

`DONE` nem használható pusztán azért, mert a kód elkészült vagy „jónak tűnik”.

## 4. Kötelező scope-validáció

Nem triviális munka előtt legyen rögzítve:

- **Goal** — mit kell ténylegesen elérni;
- **In scope** — mi része a feladatnak;
- **Out of scope** — mi nem része;
- **Acceptance** — milyen objektív bizonyíték jelenti a kész állapotot;
- **Regression guard** — mi nem romolhat el közben.

Ha a scope nem egyértelmű, a státusz nem léphet `READY` állapotba.

## 5. Bizonyíték-alapú review

Minden készültségi állítást bizonyíték támaszt alá. Elfogadható bizonyíték például:

- pontos commit SHA / PR;
- ténylegesen lefuttatott parancs és eredménye;
- teszteredmény;
- Visual Clone Oracle `report.json` / HTML report;
- reprodukálható screenshot/diff;
- konkrét fájl és sor / patch.

Tilos:

- nem futtatott tesztet sikeresnek állítani;
- vizuális egyezést pusztán AI-szemrevételezés alapján lezárni;
- tolerance/gate lazításával „megjavítani” a mérési eredményt bizonyított indok nélkül;
- saját implementációt független review nélkül `VERIFIED`-nek nevezni.

## 6. Git-szabályok

- A `main` közvetlen módosítása kerülendő; érdemi munkához feature branch / PR.
- Egy commit egy koherens változtatás.
- Unrelated változás nem kerülhet ugyanabba a commitba.
- A commit/PR leírás különítse el: **implemented** vs. **actually verified**.
- Merge csak review után.

## 7. VMK klón — termékcél

A `main` branch elsődleges célja a jelenlegi `https://www.vmk.hu/` **tartalmilag, funkcionálisan és vizuálisan teljes, technikailag modern klónja**.

A másik három design branch modern alternatív koncepció; ezek nem írhatják felül a `main` klón-prioritását.

### Milestone 1

Elsőként legyen lezárt:

1. a főoldal;
2. a főoldalról közvetlenül elérhető összes releváns belső oldal (first-hop);
3. desktop és mobil nézet;
4. hiányzó first-hop route = 0;
5. hibás belső link = 0;
6. elfogadott tartalmi és vizuális parity.

Csak ezután bővül a lezárt kör breadth-first módon a teljes site felé.

## 8. Vizuális klón munka — kötelező Oracle workflow

A vizuális készültség forrása a `docs/VISUAL_CLONE_ORACLE.md` és a `tools/visual-oracle.mjs` mérés.

Kötelező ciklus:

1. Oracle mérés;
2. legnagyobb/rangsorolt eltérés kiválasztása;
3. célzott javítás;
4. Oracle újramérés;
5. before/after eredmény rögzítése;
6. regresszió esetén korrekció vagy revert;
7. már PASS route nem romolhat vissza.

A pixel threshold nem emelhető csak azért, hogy jobb eredmény szülessen.

## 9. Aktív átadás

**Task:** Visual Clone Oracle bevezetése és első valós VMK mérés

**STATUS:** `READY_FOR_REVIEW`

**BALL:** `CHATGPT`

**Goal:** a korábbi főoldal-központú, nehezen használható vizuális ellenőrzés helyett route-aware, determinisztikus mérőrendszer; Milestone 1 = főoldal + first-hop oldalak.

**ChatGPT implementáció:**
- branch: `agent/visual-clone-oracle`
- draft PR: `#1`
- first-hop automatikus discovery;
- desktop + mobil determinisztikus capture;
- pixel/coarse diff;
- oldalmagasság- és tartalmi parity;
- heading geometry;
- automatikus connected defect region ranking;
- JSON + interaktív HTML report;
- PASS/FAIL exit gate;
- dokumentáció és npm parancsok.

**ChatGPT által ténylegesen ellenőrzött:**
- committed branch-diff és fájlstruktúra;
- JavaScript szintaktikai ellenőrzés (`node --check`) az Oracle-re.

**Nem állítható még:** teljes runtime Oracle-validáció, mert ChatGPT környezetében nem fut a projekt teljes lokális VMK stack a `localhost:3001` címen.

### Claude eredménye (2026-08-15)

**Mit kellett elérni:** a ChatGPT által implementált Oracle-t futtatni a teljes projektkörnyezetben, valós vmk.hu ellen, és ellenőrizni, hogy maga az eszköz helyesen működik-e, mielőtt bármilyen tényleges CSS-klónmunka elindulna.

**Ténylegesen futtatott parancsok, sorrendben:**

```bash
git fetch origin && git checkout -b agent/visual-clone-oracle origin/agent/visual-clone-oracle
npm run visual:oracle:discover
# -> 107 route, gyanús: 30 link a homepage-ről nem került be; kézi ellenőrzés
#    (curl + href-kinyerés a valós https://www.vmk.hu/ HTML-jéből, összevetve
#    a route-manifest.json-nal) 6 valós, same-site, publikus oldalt talált,
#    ami hiányzott a manifestből
node tools/visual-oracle.mjs live --route=/ --local-url=http://localhost:3011/
# -> mindkét viewport ERROR: "extract_area: bad extract area"
# root cause izolált egy önálló sharp-repróval (lásd commit üzenet)
# -- két célzott javítás a tools/visual-oracle.mjs-ben, majd újrafuttatás:
npm run visual:oracle:discover
node tools/visual-oracle.mjs live --route=/ --local-url=http://localhost:3011/
```

**Mi változott:** `tools/visual-oracle.mjs`, commit `6d20092` ezen a branch-en:

1. **Discover-bug**: `isCrawlableUrl()` a teljes originre (séma+host) szűrt, ezért a vmk.hu 6 saját, `http://`-vel (nem `https://`-vel) linkelt oldalát kidobta a crawl (a szerver egyébként 301-gyel https-re irányítja őket — valódi, publikus, same-site tartalom). Séma helyett hostname-alapú összehasonlításra javítva. Subdomainek (konyvtar./helyismeret./tlwww.vmk.hu) kizárása változatlan.
2. **Live-crash**: a régió-crop kód egyetlen lusta sharp pipeline-ban láncolta a `.flatten().extend().extract()`-et. Ez a sharp/libvips build (0.35.3 / 8.18.3) `"extract_area: bad extract area"` hibával elszáll, ha az extract régió a frissen hozzáadott padding-be nyúlik — ami gyakorlatilag minden esetben megtörténik, amikor a referencia és a klón oldalmagassága eltér (a tipikus eset). Önállóan reprodukálva sharp-only szkripttel a `tools/`-on kívül. Javítás: az extend lépés materializálása külön bufferré (`padToCanvas`) az extract előtt — ez megkerüli a fuzionált pipeline hibáját.

**Mi lett az eredmény (bizonyíték):**

- Discover: `Routes: 107 -> 113` a javítás után; a 6 korábban hiányzó route (`/kurrens`, `/wishbasket`, `/muzeumok-ejszakaja-2018`, `/kortars-muveszeti-fesztival-2017`, `/news/details/1988/preview/1`, `/page/menu/156/preview/1`) mind megjelenik; duplikátum 0; `excludePatterns` szivárgás 0.
- Live `/`: a hiba eltűnt, valódi mérés fut le mindkét viewporton:
  - `desktop-1440: FAIL | pixel 49.12% | coarse 54.86% | height 0.21% | content 56.34%`
  - `mobile-390: FAIL | pixel 77.68% | coarse 85.84% | height 2.46% | content 51.32%`
  - `report.json` + `index.html` + reference/local/heatmap/overlay + rangsorolt régió-crop képek mind legenerálódtak (`.visual-oracle/report/`, 0 db üres/sérült PNG).
- A FAIL maga **várt** — ez a tényleges vizuális klón-eltérés mérése, Milestone 1 még nincs lezárva. Az Oracle most helyesen méri és jelzi.

**Mi maradt nyitva / kockázat, amit észleltem, de nem nyúltam hozzá:**

- A `localhost:3001` NEM a www-vmk-t szolgálja ki, hanem egy másik projekt (`webarchivum/fewa-v3-frontend`) foglalja — a `docs/VISUAL_CLONE_ORACLE.md` alapértelmezett portja ütközik. A méréshez a www-vmk-t a `3011`-es porton indítottam (`--local-url=http://localhost:3011/`), ez fut jelenleg is a háttérben (helyi ellenőrzéshez elérhető, `npx next start -p 3011`, log: `/tmp/.../scratchpad/www-vmk-start-3011.log`).
- **`npm run dev` (dev mód) ezen a branchen egy interaktív Payload séma-push promptba fut**, ami adatvesztéssel járna az élő `vmk_db`-n (`header_settings` tábla törlése; `color`/`folder_id` oszlopok törlése 884+46+15+2 valós rekorddal). **Nem hagytam jóvá, nem nyúltam a DB-hez.** Production build (`next build && next start`) ezt megkerüli, mert a Payload postgres adapter `push` viselkedése csak dev módban aktív — ezt használtam a méréshez. A DB-séma drift oka és helyes kezelése (migráció vs. schema-fájlok szinkronizálása) nincs kivizsgálva, ez a jelenlegi feladat scope-ján kívül esik, de valós kockázat: valaki más `npm run dev`-et futtatva véletlenül elfogadhatja a promptot.
- A teljes first-hop kör (mind a 113 route) élő mérése még nem futott le — csak a `/` a COLLAB.md kifejezett kérése szerint. Tömeges CSS-klónjavítás nem indult (szándékosan, a kapott instrukció szerint).
- `/news/details/1988/preview/1` és `/page/menu/156/preview/1` "preview" jellegű URL-ek — valós same-site oldalak, most bekerültek a manifestbe, de érdemes eldönteni, hogy tartalmilag helyes-e ezeket a nyilvános first-hop körben mérni (admin-preview szemantika), vagy `routeOverrides`/`excludePatterns` alá kell venni őket.

**Mit kell ChatGPT-nek ellenőriznie/elvégeznie:**

1. Independent review a `6d20092` commit két Oracle-fixére (a fenti root cause és repro alapján).
2. Állásfoglalás a két nyitott preview-route-ról (mérjük vagy zárjuk ki explicit `excludePatterns`/`routeOverrides` bejegyzéssel).
3. Ha a review rendben: döntés a teljes 113-route first-hop élő méréséről és a Milestone 1 tényleges CSS-klónjavítási ciklus indításáról (ez már nem Oracle-validáció, hanem a 8. szakasz szerinti kötelező ciklus).
4. A `localhost:3001` port-ütközés (webarchivum vs. www-vmk) dokumentálása/rendezése, hogy a jövőbeli mérések ne port-tévesztésből fakadó hamis eredményt adjanak.

## 10. Frissítési szabály

A `COLLAB.md` nem napló minden apró lépéshez. Csak a feladatállapot, a labda, a lényegi bizonyíték és a következő átadás legyen benne naprakész.

Ha a lokális projektben már létezik egy korábbi, részletesebb `COLLAB.md`, **azt kell tekinteni elsődlegesnek**: a két verziót össze kell fésülni, nem vakon felülírni.
