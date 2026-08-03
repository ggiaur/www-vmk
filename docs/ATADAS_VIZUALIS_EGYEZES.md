# Feladat: a www.vmk.hu vizuális klónozásának befejezése

**Projekt:** `/srv/projects/www-vmk` — Next.js 15 + Payload CMS v3
**Ág:** `main`
**Állapot:** folyamatban

---

## 1. A feladat

A `localhost:3001` főoldalának vizuálisan meg kell egyeznie a
`https://www.vmk.hu/` főoldalával.

**Kész, ha:** a képpontonkénti eltérés ≤ 5%, 1440px szélességen,
ugyanabban a Chromiumban renderelve.

---

## 2. Jelenlegi állapot (mérve)

```
képpont-eltérés:  61.4%
oldalmagasság:    valós 5144px / klón 4501px  (12.5% rés)
```

Reprodukálás:

```bash
cd /srv/projects/www-vmk
node tools/pixel-diff.mjs
```

---

## 3. Mérőeszközök

### `tools/pixel-diff.mjs` — a mérvadó eszköz

Screenshotot készít mindkét oldalról **ugyanazzal a Chromium-
példánnyal**, ugyanazon a viewporton, majd minden képpontot
összehasonlít.

Kimenet:
- összesített eltérés %
- 100px-es sávonkénti bontás (hol a legrosszabb)
- `diff-heatmap.png` — piros = eltérés
- `side-by-side.png` — valós | klón | hőtérkép
- `real.png`, `local.png` — a nyers felvételek

**Tolerancia: 0.** Mivel ugyanaz a renderelő motor dolgozik mindkét
oldalon, nincs legitim „böngészők közti eltérés" — minden
különbség valódi. A `PIXEL_THRESHOLD` csak mért bizonyíték alapján
emelhető 0 fölé.

### `tools/visual-audit.mjs` — célzott ellenőrzések

34 db névvel nevezett ellenőrzés (logó mérete, nav betűméret,
widget-torony magassága stb.), PASS/FAIL konkrét számokkal.

**Fontos korlát:** ez egy kézzel írt lista — csak azt találja meg,
ami bele van írva. Önmagában nem elegendő „kész" nyilvánításhoz.
A `pixel-diff` a mérvadó.

### Kötelező minden változtatás után

```bash
npx tsc --noEmit && npx next lint && npx vitest run
node tools/pixel-diff.mjs
node tools/visual-audit.mjs
```

---

## 4. Ismert tények (ellenőrzött, nem feltételezés)

**T1. 90 hírcikknek nincs képe — ez a valós oldal állapota.**
A `/api/dev-backfill-news-images` végponttal 70 cikk lett
ellenőrizve: ezek a valós vmk.hu-n is kép nélküli, csak-szöveges
régi közlemények, vagy 404 (törölt tartalom). Nem migrációs hiba.

**T2. Munkatárs-fotók nem léteznek.**
A valós vmk.hu egyetlen munkatársnál sem közöl fényképet
(ellenőrizve az igazgató saját aloldalán is). A 80 Staff rekord
fotó nélküli állapota helyes.

**T3. Az `/events` és `/gallery` sima HTTP `fetch`-csel lekérhető.**
Nem igényel böngésző-renderelést.

**T4. A valós oldal DOM-ja rejtett mobilmenü-duplikátumot tartalmaz.**
Emiatt a `document.querySelector` alapú mérés hamis eredményt adhat
(pl. egy elem pozíciója 200px-szel eltérőnek tűnhet). **Kritikus
méréseknél képpont-mintavételt kell használni** (PIL, konkrét x,y
koordináta a `real.png`-n), nem DOM-lekérdezést.

**T5. A valós oldalon cookie-banner van.**
Mérés előtt el kell tüntetni (`.cc-nb-okagree`). A `pixel-diff.mjs`
ezt már kezeli.

**T6. A valós oldal Bootstrap 3 `.container`-t használ.**
A konténer szélessége törésponton ugrik, nem folyamatosan skálázódik:
1170px (≥1200px viewport) / 970px (≥992px) / 750px (alatta),
plusz fix belső margó. A képlet a `src/lib/layout.ts`-ben
(`REAL_CONTAINER`) van implementálva.

**T7. A widget-magasságok a valós oldalon változóak.**
135px (FEWA) és 374px (Aranybulla) között, összesen 3091px. Nem
szabad fix magasságot adni nekik.

---

## 5. Mit tartalmaz a klón jelenleg

| Elem | Állapot |
|---|---|
| Fejléc | logó, ikonsor, katalógus gomb, nav — mérve egyezik |
| Lábléc | 3 oszlop, `#00909B`/`#33A6AF`, valós jelvényképek |
| Oldalsáv | 12 widget valós letöltött képekkel |
| Hírek | 333 rekord, ebből 243 valós képpel |
| Események | 4 valós rekord (dátum, helyszín, kép) |
| Galériák | 46 valós album valós borítóképpel |
| Admin | Payload CMS, magyar feliratok, RBAC érvényesítve |

---

## 6. Elvégzendő munka (prioritási sorrendben)

### F1 — A maradék 643px magasság-rés

A widget-torony jelenleg 2735px a valós 3091px helyett (356px
hiány), a többi a fő tartalom-oszlopban van.

```bash
node tools/visual-audit.mjs 2>&1 | grep widgetTower
```

Feltételezett ok: a valós widget-képek natív méretben renderelődnek,
a klónban a `w-full h-auto` a konténer szélességéhez skálázza őket
(`src/components/layout/SiteSidebar.tsx`).

### F2 — Rács-pozíciók a belső szekciókban

A képpont-diff koordinátánként hasonlít: egy tartalmilag helyes
elem, ami 55px-szel arrébb van, 100%-ban eltérőnek számít.

A fejlécre a Bootstrap-rács már le van reprodukálva
(`src/lib/layout.ts`), a belső szekciókra (hírkártya-rács,
esemény-rács) még nem.

Célértékek (mérve a valós oldalon): hírkártya x=443, szélesség=262px.

### F3 — Tipográfia szisztematikus ellenőrzése

Jelenleg csak a navigáció betűmérete van ellenőrizve. Nincs check a
hírkártya-címekre, oldalsáv-linkekre, lábléc-szövegre. Bővítendő a
`visual-audit.mjs`.

### F4 — A hőtérkép szisztematikus átnézése

A `diff-heatmap.png`-t **teljes egészében** át kell nézni, nem
részleteket kivágva belőle. Ajánlott: 600px-es szeletekre bontva.

```bash
python3 -c "
from PIL import Image
img = Image.open('<kimeneti_mappa>/diff-heatmap.png')
for i, y in enumerate(range(0, img.height, 600)):
    img.crop((0, y, 1440, min(y+600, img.height))).save(f'/tmp/heat_{i}.png')
"
```

---

## 7. Környezet

- **Dev szerver:** `localhost:3001`
  (Postgres + MinIO + Meilisearch Dockerben)
- **Admin:** `/admin` — `admin@vmk.hu`
- **Dev-only scraper végpontok** (POST, csak `NODE_ENV=development`,
  mind idempotens — slug alapján kihagyja a meglévőket):

  ```
  /api/dev-scrape-news?pages=N&limit=N
  /api/dev-scrape-events?pages=N&limit=N
  /api/dev-scrape-galleries?years=N&libs=N&limit=N
  /api/dev-backfill-news-images?limit=N
  ```

---

## 8. Kapcsolódó dokumentumok

- `docs/MINOSEGPOLITIKA.md` — a projekt minőségi szabályai és
  elfogadási kritériumai (kötelező elolvasni munkakezdés előtt)
- `docs/MINOSEG_TORTENET.md` — korábbi hibák és tanulságok
  (opcionális, de segít elkerülni ismételt zsákutcákat)
