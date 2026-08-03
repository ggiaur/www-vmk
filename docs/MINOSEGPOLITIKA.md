# Minőségpolitika — www-vmk

Ez a dokumentum Claude-nak szól. Minden vizuális feladatnál ezt a
protokollt kell követni — nem opcionális, nem kihagyható.

---

## GATE 1 — Módosítás után (minden alkalommal)

Minden vizuális változtatás után le kell futtatni, ebben a sorrendben:

```bash
node tools/pixel-diff.mjs
node tools/visual-audit.mjs
npx tsc --noEmit && npx next lint && npx vitest run
```

Kötelező jelentési formátum:

```
pixel-diff:    X.X%  (előző: Y.Y%)
visual-audit:  N FAIL — [felsorolva mind]
tsc/lint:      0 hiba / N hiba
hőtérkép:      átnézve [N db 600px-es szelet]
```

Ha bármelyik parancs nem futott le ebben a munkamenetben, az érték
**ismeretlen** — nem közölhető.

---

## GATE 2 — „Kész" nyilvánítás előtt

Kész csak akkor mondható, ha mindegyik teljesül és mérve van:

| # | Feltétel | Küszöb |
|---|---|---|
| K1 | `pixel-diff.mjs` | ≤ 5 % |
| K2 | `visual-audit.mjs` | 0 FAIL |
| K3 | `tsc --noEmit` + `next lint` | 0 hiba |
| K4 | Nincs kitalált/tartalék adat a nézetekben | — |

Ha K1–K4 bármelyike nem teljesül: **a feladat nincs kész**, és
pontosan meg kell mondani melyik nem teljesül és miért.

---

## GATE 3 — „Javítottam" állítás előtt

„Javítottam" csak két mért szám összehasonlításával mondható:

```
pixel-diff: 61.4% → 54.2%
```

Mindkét szám ebből a munkamenetből, tényleges futtatásból kell
származzon. Becsült vagy korábbi munkamenetből hozott szám nem
fogadható el.

---

## Hőtérkép-protokoll

A `diff-heatmap.png` **teljes egészét** át kell nézni, nem csak
sejtett hibaterületeket. Módszer:

```python
from PIL import Image
img = Image.open('tools/output/diff-heatmap.png')
for i, y in enumerate(range(0, img.height, 600)):
    img.crop((0, y, 1440, min(y+600, img.height))).save(f'/tmp/heat_{i}.png')
```

Majd minden `/tmp/heat_N.png` szelet megtekintése. A legrosszabb
sávokat a `pixel-diff.mjs` kimenete is listázza — ezeket először
kell megnézni.

---

## Tiltott mondatok

Ezeket a mondatokat nem szabad leírni vagy kimondani:

| Tiltott | Miért |
|---|---|
| „Jónak tűnik" | Nem mérés |
| „Pixelre pontos" | Pixel-diff nélkül értelmetlen |
| „Minden rendben" / „PASS" | A visual-audit csak a felsorolt tulajdonságokat nézi, nem az egész oldalt |
| „Javítottam" [mérés nélkül] | Az állítás bizonyítatlan |
| „Nem hiba, csak renderelési különbség" | Azonos Chromium-példánynál nincs ilyen |
| Bármely szám ebből a munkamenetből futtatás nélkül | Becslés, nem mérés |

---

## A mérvadó eszköz

`tools/pixel-diff.mjs` — küszöb: **0**

Mindkét screenshotot ugyanaz az egyetlen Chromium-példány készíti.
Azonos renderelő motor → minden vizuális eltérés valódi eltérés.
A küszöböt csak mért bizonyíték alapján szabad 0 fölé emelni.

---

## Kapcsolódó dokumentumok

- [`ATADAS_VIZUALIS_EGYEZES.md`](./ATADAS_VIZUALIS_EGYEZES.md) — jelenlegi mért állapot és elvégzendő munka
- [`MINOSEG_TORTENET.md`](./MINOSEG_TORTENET.md) — korábbi hibák és tanulságok
