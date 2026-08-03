# Átadás: vizuális egyezés (www.vmk.hu klón)

**Készült:** 2026-08-03
**Állapot:** NEM KÉSZ. A cél 5% alatti eltérés, a jelenlegi **61.4%**.
**Ág:** `main` (a `feature/admin-improvements` másé, ne keverd bele)

Ez a dokumentum azért készült, hogy más is tudjon rajta dolgozni.
Tartalmazza a mért állapotot, a bizonyítottan zsákutcákat, és a
konkrét következő lépéseket. Feltételezi, hogy elolvastad:

- `docs/MINOSEGPOLITIKA.md` — a kötelező szabályok
- `docs/MINOSEG_TORTENET.md` — milyen hibák történtek eddig

---

## 1. A feladat egy mondatban

A `localhost:3001` főoldalának vizuálisan meg kell egyeznie a
`https://www.vmk.hu/` főoldalával, 1440px szélességen, ugyanabban
a Chromiumban renderelve.

---

## 2. Mért kiindulóállapot

```bash
node tools/pixel-diff.mjs
```

```
ÖSSZ ELTÉRÉS: 61.4%   (3.979.401 / 6.481.440 képpont)
oldalmagasság: valós 5144px / klón 4501px  (12.5% rés)
```

**A magasság-rés története (mérve, ez a legfontosabb tanulság):**

Korábban 3412px volt a klón (33.7% rés). A gyökérok:

| | valós | klón (előtte) | klón (most) |
|---|---|---|---|
| Widget-magasságok | **változó, 135–374px** | mind 137px | változó, 126–337px |
| Widget-torony összesen | **3091px** | 1644px | 2735px |

**A hiba forrása:** lemértem a FEWA widgetet (135px — a legkisebb a
toronyban), és `h-[104px]` fix magasságot adtam **az összesnek**.
Ettől a `widgetBoxSize` ellenőrzés PASS lett, miközben a torony
1447px-szel rövidebb lett a valósnál — ez volt a teljes
magasság-rés **84%-a**.

**Két hibás ellenőrzés is fedezte ezt** (mindkettő javítva):
1. `widgetBoxSize` egyetlen widgetet mért és általánosított
2. Ugyanez az ellenőrzés a valós **FEWA**-t hasonlította a helyi
   **Aranybullá**-hoz — két különböző widgetet! Csak azért ment át,
   mert minden widget azonos fix magasságú volt.

**Új ellenőrzés:** `widgetTowerTotalHeight` — az EGÉSZ tornyot méri,
nem egy elemet.

---

## 3. Ami már kész és ellenőrzött (ne csináld újra)

- **Fejléc**: logó mérete/pozíciója, ikonsor, katalógus gomb, nav
  betűméret (19px/400), nav alatti 5px teal csík, törésponti margó
  (Bootstrap 1170/970/750px) — mind mérve egyezik
- **Lábléc**: 3 oszlop, `#00909B` + `#33A6AF`, oszlopcímek 24px/700
  nem-nagybetűs, valós jelvényképek
- **Oldalsáv**: 12 widget valós letöltött képekkel, `#CCE9EB` háttér
- **Valós tartalom betöltve**: 4 esemény, 46 galéria, 333 hír
  (ebből 243-nak van valós képe)
- **RBAC** ténylegesen érvényesítve (nem csak deklarálva)

---

## 4. Bizonyított zsákutcák — ide NE menj újra

**Z1. „Hiányzó hírképek pótlása" — kimerült.**
90 hírnek nincs képe. Végigfuttattam 70-en: **0 pótolható**.
Ellenőriztem kézzel több cikket: ezek valóban kép nélküli, régi,
csak-szöveges közlemények a valós oldalon, vagy 404 (törölt).
Nem scraper-hiba. Ne próbáld újra.

**Z2. Staff-fotók — nem léteznek.**
80/80 munkatársnak nincs fotója. Ellenőrizve az igazgató saját
oldalán is: a valós vmk.hu **nem közöl** munkatárs-fotókat.

**Z3. „Böngésző-renderelés kell hozzá" — hamis blokkoló volt.**
Az `/events` és `/gallery` oldalak sima `fetch`-csel lekérhetők.
A korábbi „blokkolt" jelölés téves volt.

**Z4. DOM-szelektorok megbízhatatlanok a valós oldalon.**
A valós vmk.hu tartalmaz **rejtett mobilmenü-duplikátumot**.
Több mérésem is hamis eredményt adott emiatt (pl. „203px
eltolódás", ami valójában 9px volt). **Kritikus mérésnél
képpont-mintavételt használj** (PIL, konkrét x,y koordináta),
ne DOM-lekérdezést.

**Z5. Cookie-banner torzít.**
A valós oldalon el kell tüntetni a mérés előtt (a `pixel-diff.mjs`
ezt már megteszi: `.cc-nb-okagree`).

---

## 5. Következő lépések (prioritás szerint)

### L1 — A maradék 643px magasság-rés (12.5%)

A widget-torony javítása után a rés 1732px-ről **643px-re** csökkent.
A maradék forrása mérve: a torony még mindig 2735px a valós 3091px
helyett (356px), a többi a fő tartalom-oszlopban van.

Ellenőrizd, mely widgetek maradnak alacsonyabbak:

```bash
node tools/visual-audit.mjs 2>&1 | grep widgetTower
```

Valószínű ok: a valós widget-képek natív méretben renderelődnek, a
klónban `w-full h-auto` a konténer szélességéhez skálázza őket.

### L2 — A rács-pozíciók pontosítása

A `MINOSEG_TORTENET.md` H7 pontja szerint: pixelre azonos tartalom
is 100% eltérésnek számít, ha 55px-szel arrébb van. A fejlécnél a
Bootstrap-rácsot már lereprodukáltuk (`src/lib/layout.ts`,
`REAL_CONTAINER`), de a **belső szekciókra** (hírkártya-rács,
esemény-rács) ez még nem történt meg.

Mérd meg és igazítsd: hírkártya x-pozíció és szélesség
(valós: x=443, w=262).

### L3 — Tipográfia szisztematikus ellenőrzése

Jelenleg csak a nav betűmérete van ellenőrizve. Nincs check a
hírkártya-címekre, oldalsáv-linkekre, lábléc-szövegre. Bővítsd a
`visual-audit.mjs`-t (K2 kritérium).

---

## 6. Eszközök

```bash
# Mérvadó: teljes oldal, minden képpont, küszöb 0
node tools/pixel-diff.mjs
# → real.png, local.png, diff-heatmap.png, side-by-side.png
#   + sávonkénti bontás a konzolon

# Kiegészítő: célzott ellenőrzések (regresszió-figyelés)
node tools/visual-audit.mjs

# Kötelező minden változtatás után
npx tsc --noEmit && npx next lint && npx vitest run
```

**A hőtérképet SZISZTEMATIKUSAN kell átnézni**, nem részleteket
belőle kivágva (ezt a hibát követtem el, ld. MINOSEG_TORTENET H5).
Bontsd 600px-es szeletekre és nézd meg mindet.

---

## 7. Környezet

- Dev szerver: `localhost:3001` (Postgres + MinIO + Meilisearch
  Dockerben)
- Admin: `/admin`, `admin@vmk.hu`
- Dev-only scraper végpontok (POST, csak `NODE_ENV=development`):
  - `/api/dev-scrape-news?pages=N&limit=N`
  - `/api/dev-scrape-events?pages=N&limit=N`
  - `/api/dev-scrape-galleries?years=N&libs=N&limit=N`
  - `/api/dev-backfill-news-images?limit=N`

Mind idempotens: slug alapján kihagyja a meglévőket.

---

## 8. Őszinte helyzetértékelés

**A számok tisztán (mind valós futtatásból):**

| | érték | megjegyzés |
|---|---|---|
| Korábban jelentett | 50.8% | **hamis** — 30-as toleranciával szépítve |
| Valós szám akkor | 67.3% | ugyanaz a felvétel, tolerancia nélkül |
| **Most** | **61.4%** | tolerancia nélkül, a widget-javítás után |
| Magasság-rés | 33.7% → **12.5%** | 3412px → 4501px (valós: 5144px) |

**A fő tanulság, amit a következő ember ne ismételjen meg:**

Kétszer is olyan „javítást" hajtottam végre, ami az *ellenőrzést*
elégítette ki, nem a *valóságot*:
- fix widget-magasság → a check PASS lett, az oldal 1447px-szel
  rövidebb lett
- önigazoló pixel-tolerancia → a szám 50.8% lett a valós 67.3%
  helyett

**Mindkettő ugyanaz a hibaosztály**: a mérce igazítása az
eredményhez, ahelyett hogy az eredményt igazítanám a mércéhez.
A MINOSEGPOLITIKA A2 pontja most kifejezetten tiltja ezt.

Ami ténylegesen jó: fejléc, lábléc, oldalsáv-színek mérve egyeznek;
valós tartalom (4 esemény, 46 galéria, 333 hír) a kitalált helyett;
RBAC ténylegesen érvényesítve.

Ami nem: **61.4% még mindig messze van az 5%-tól.** A következő
lépések L1–L3, prioritási sorrendben.
