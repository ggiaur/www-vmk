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

**BALL:** `CLAUDE`

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

### Claude következő feladata

1. Checkout: `agent/visual-clone-oracle`.
2. Olvasd el ezt a `COLLAB.md`-t és a `docs/VISUAL_CLONE_ORACLE.md`-t.
3. Futtasd a teljes projektkörnyezetben:
   - `npm run visual:oracle:discover`
   - `node tools/visual-oracle.mjs live --route=/`
4. Ellenőrizd, hogy a route discovery valóban a vmk.hu első szintjét tükrözi és nem veszít linkeket.
5. Ellenőrizd a generált képeket, `report.json`-t és HTML scrubbert.
6. Ha Oracle-hibát találsz, javítsd célzottan ezen a branch-en, majd futtasd újra.
7. Ne kezdj még tömeges CSS-klónjavításba, amíg maga az Oracle nincs validálva.
8. Átadáskor frissítsd ezt a szekciót: eredmények, parancsok, hibák, commit SHA, majd állítsd `BALL: CHATGPT` értékre független review-hoz.

## 10. Frissítési szabály

A `COLLAB.md` nem napló minden apró lépéshez. Csak a feladatállapot, a labda, a lényegi bizonyíték és a következő átadás legyen benne naprakész.

Ha a lokális projektben már létezik egy korábbi, részletesebb `COLLAB.md`, **azt kell tekinteni elsődlegesnek**: a két verziót össze kell fésülni, nem vakon felülírni.
