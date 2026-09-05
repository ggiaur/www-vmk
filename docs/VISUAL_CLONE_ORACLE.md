# VMK Visual Clone Oracle

## Cél

A `main` branch elsődleges feladata a jelenlegi `www.vmk.hu` teljes, technikailag modern klónja. A vizuális egyezést **nem AI-vélemény**, hanem determinisztikus mérés dönti el.

A Visual Clone Oracle a meglévő `pixel-diff` eszközt egészíti ki:

- automatikusan feltérképezi a főoldalt és a róla közvetlenül elérhető belső oldalakat;
- ugyanazzal a Chromium-motorral rendereli a referenciát és a klónt;
- desktop és mobil viewporton mér;
- teljes oldalas pixel-diffet készít;
- méri az oldalmagasságot és a közös címsorok geometriáját;
- alap tartalmi paritást mér a látható szöveg alapján;
- a diffből automatikusan felismeri és rangsorolja a legnagyobb hibaterületeket;
- route-onként `PASS` / `FAIL` státuszt ad;
- interaktív HTML reportot készít reference/clone scrubberrel;
- opcionálisan fagyasztott baseline ellen tud regressziót mérni.

Az Oracle **nem helyettesíti** a funkcionális teszteket és nem igazolja önmagában a teljes site-migrációt. A Milestone 1 vizuális és tartalmi kapuja: főoldal + first-hop oldalak.

## Alapelv

Claude, Codex vagy más implementáló AI nem nyilváníthat vizuális munkát késznek saját megítélése alapján.

A javítási ciklus:

1. Oracle mér.
2. A legnagyobb hibaterület kerül javításra.
3. Oracle újramér.
4. Javulás esetén marad a változtatás.
5. Regresszió esetén a változtatást vissza kell vonni vagy korrigálni.
6. Már PASS állapotú oldal nem romolhat vissza.

## Parancsok

### 1. First-hop URL-leltár

```bash
npm run visual:oracle:discover
```

A `www.vmk.hu` főoldalából indulva breadth-first módon kigyűjti az összes belső HTML-oldalt `depth=1` mélységig. A kimenet:

```text
.visual-oracle/route-manifest.json
```

A depth és route-limit felülírható:

```bash
node tools/visual-oracle.mjs discover --depth=1 --max-routes=250
```

### 2. Élő összehasonlítás

A helyi rendszer fusson a `http://localhost:3001` címen, majd:

```bash
npm run visual:oracle
```

Ez ugyanabban a Chromium-futásban méri az élő `www.vmk.hu` oldalt és a helyi klónt.

Célzott oldal:

```bash
node tools/visual-oracle.mjs live --route=/nyitvatartas
```

Több célzott oldal:

```bash
node tools/visual-oracle.mjs live --route=/,/nyitvatartas,/munkatarsak
```

### 3. Referencia befagyasztása

Ha egy referenciaállapotot jóváhagytunk:

```bash
npm run visual:oracle:capture
```

A baseline a `.visual-oracle/baseline/` könyvtárba kerül. Ez szándékosan nincs Gitbe téve, mert a teljes first-hop screenshot-készlet nagy lehet. A baseline-t ugyanabban a Docker/OS/Chromium környezetben kell megőrizni és használni.

### 4. Regressziómérés a fagyasztott baseline ellen

```bash
npm run visual:oracle:compare
```

## Alapértelmezett viewportok

- `desktop-1440`: 1440 × 1000
- `mobile-390`: 390 × 844

Felülírás:

```bash
node tools/visual-oracle.mjs live --viewports=1440x1000,1024x768,390x844
```

## Alapértelmezett gate-ek

A `tools/visual-oracle.config.json` szerint:

- pixel mismatch: legfeljebb **5%**;
- oldalmagasság-eltérés: legfeljebb **5%**;
- látható szöveg word-set hasonlóság: legalább **95%**;
- pixel threshold: **0**.

A pixel threshold és a PASS gate két külön fogalom:

- `pixelThreshold=0`: minden tényleges képponteltérés számít;
- `maxPixelDiffPercent=5`: oldalanként legfeljebb 5% eltérő pixel engedélyezett a jelenlegi acceptance cél szerint.

A threshold globális megemelése nem megengedett pusztán azért, hogy jobb számot kapjunk.

## Determinisztikus renderelés

Az Oracle minden screenshotnál rögzíti:

- `deviceScaleFactor = 1`;
- `locale = hu-HU`;
- `timezone = Europe/Budapest`;
- `colorScheme = light`;
- `reducedMotion = reduce`;
- animációk és transitionök tiltása;
- caret elrejtése;
- fontok betöltésének megvárása;
- lazy-load miatt az oldal végiggörgetése;
- képek betöltésének megvárása;
- cookie banner eltüntetése;
- két egymást követő screenshot stabilitásának ellenőrzése.

A baseline-t és a klónt lehetőleg ugyanabban a konténerben / OS-en / Playwright Chromium-verzióval kell mérni.

## Kimenet

```text
.visual-oracle/
  route-manifest.json
  baseline/
    manifest.json
    desktop-1440/
    mobile-390/
  report/
    report.json
    index.html
    desktop-1440/
      home/
        reference.png
        local.png
        diff-heatmap.png
        overlay.png
        regions/
          01-reference.png
          01-local.png
          01-diff.png
          ...
```

A `report.json` gépi feldolgozásra való. Az `index.html` emberi review-ra.

## Defect region ranking

A teljes pixelmask 16 × 16 px-es cellákra van bontva. Az Oracle a ténylegesen eltérő cellákat összefüggő komponensekké egyesíti, majd a legnagyobb/sűrűbb régiókat rangsorolja.

Példa konzolkimenet:

```text
[oracle] /nyitvatartas
  desktop-1440: FAIL | pixel 18.72% | coarse 11.08% | height 4.10% | content 97.21%
    - pixel 18.72% > 5%
    #1 region x=420-1004 y=1248-1732 density=67.3%
    #2 region x=1032-1296 y=808-1184 density=51.8%
```

Ebből az implementálónak nem azt kell kitalálnia, hogy „mi néz ki rosszul”, hanem az első rangsorolt régióval kell kezdenie.

## Route mapping

Az eredeti VMK és az új klón URL-je nem mindig azonos. A konfiguráció `routeOverrides` része kezeli az ismert eltéréseket, például:

```json
{
  "/elerhetosegeink": "/kapcsolat",
  "/gallery": "/galeria"
}
```

Ha új eltérés derül ki, azt itt kell explicit módon rögzíteni; nem szabad az Oracle-ben ad hoc kivételt kódolni.

## Milestone 1 Definition of Done

A főoldal + first-hop kör akkor tekinthető lezártnak, ha:

1. a first-hop crawl minden releváns belső céloldalt tartalmaz;
2. nincs `ERROR` vagy 4xx/5xx helyi oldal;
3. nincs ismert hiányzó route;
4. minden route desktop és mobil viewporton megfelel az elfogadott visual gate-nek;
5. a tartalmi paritás gate teljesül vagy dokumentált, kézzel jóváhagyott kivétel van;
6. az Oracle report regresszió nélkül megismételhető.

Ezután ugyanaz az eszköz `depth=2`, majd további mélységek felé használható a teljes site fokozatos lezárásához.
