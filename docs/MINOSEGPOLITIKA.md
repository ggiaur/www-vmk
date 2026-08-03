# Minőségpolitika — www-vmk

Ez a dokumentum **szabályokat és elfogadási kritériumokat** rögzít.
Nem hibatörténet és nem módszertani napló — az a
[MINOSEG_TORTENET.md](./MINOSEG_TORTENET.md)-ben van.

Cél: kimondani, **mikor mondható valamire, hogy kész**, és **milyen
bizonyíték nélkül nem mondható**.

---

## 1. Alapelvek

**A1. Mérés, nem benyomás.**
Vizuális egyezésre vonatkozó állítás csak mért számmal együtt
hangozhat el. "Jónak tűnik", "megegyezik", "rendben van" önmagában
nem elfogadható állítás.

**A2. Nincs önigazoló tolerancia.**
Tolerancia csak akkor állítható 0 fölé, ha az adott értékhez **mért
bizonyíték** tartozik arról, hogy az eltérés az adott mértékig
elkerülhetetlen. Tilos a toleranciát úgy megválasztani, hogy a
jelenlegi állapot átmenjen.

**A3. Azonos mérési feltételek.**
Az eredeti és a klón összehasonlítása **ugyanazzal a böngésző-
példánnyal, ugyanazon az operációs rendszeren, ugyanazon a
viewporton** történik. Ebből következik: **azonos feltételek mellett
minden vizuális eltérés hiba**, beleértve a betű-renderelést is.
Nincs "anti-aliasing" mentség.

**A4. A negatív eredmény is eredmény.**
Ha egy mérés nem végezhető el megbízhatóan, azt ki kell mondani.
Tilos becsült vagy valószínűnek tűnő számot valós mérésként közölni.

**A5. A lefedettség hiánya nem egyenlő a hibátlansággal.**
Az, hogy egy ellenőrzés PASS, csak annyit jelent: *az adott,
megnevezett tulajdonság rendben van*. Nem jelenti, hogy az oldal
egyezik. Ezt minden jelentésben explicit ki kell mondani.

---

## 2. Elfogadási kritériumok

| Szint | Kritérium | Mérőeszköz |
|---|---|---|
| **K1 — Szerkezet** | Minden szekció x-pozíciója és szélessége ±2px-en belül | `visual-audit.mjs` |
| **K2 — Tipográfia** | Betűméret, -vastagság, -szín, sormagasság **pontosan** egyezik | `visual-audit.mjs` |
| **K3 — Szín** | Háttér- és szövegszín RGB-értéke **pontosan** egyezik | `visual-audit.mjs` |
| **K4 — Tartalom** | Nincs kitalált/tartalék adat éles nézetben | kód-átvizsgálás |
| **K5 — Teljes egyezés** | `pixel-diff` ≤ 5% (küszöb = 0) | `pixel-diff.mjs` |
| **K6 — Reszponzív** | K1–K3 teljesül 1024/1200/1440/1920px-en | `visual-audit.mjs` |

**Kész állapot**: K1–K4 + K6 teljesül. K5 a végcél.

**Ismert korlát K5-höz**: eltérő fotótartalom (saját CMS más
cikkekkel) matematikailag megakadályozza a 0%-ot. Ezért a K5
mérésekor külön jelenteni kell a *szerkezeti* és a *tartalmi*
eltérés arányát — nem összemosva.

---

## 3. Kötelező eljárás minden vizuális változtatás után

1. `node tools/pixel-diff.mjs` — teljes oldalas mérés
2. `node tools/visual-audit.mjs` — célzott ellenőrzések
3. `npx tsc --noEmit && npx next lint && npx vitest run`
4. **A teljes hőtérkép szisztematikus átnézése** — nem kiválasztott
   részleteké. Az oldalt 600px-es szeletekre kell bontani, és
   **minden szeletet** meg kell nézni.
5. Jelentés: mért számok + mi nincs lefedve

Az 5. pont elhagyása a jelentést érvénytelenné teszi.

---

## 4. Hibabejelentés kezelése

Amikor eltérést jeleznek:

1. **Reprodukálás mérése** — nem szemrevételezés
2. Ha nem reprodukálható: ezt **ki kell mondani**, nem szabad
   "javítottnak" nyilvánítani, amit nem láttunk
3. Ha reprodukálható: javítás → **újramérés** → a két szám közlése
4. **Permanens ellenőrzés felvétele** az adott hibaosztályra a
   `visual-audit.mjs`-be, hogy ne térhessen vissza észrevétlenül

---

## 5. Tiltott állítások

- „Pixelre pontos" — pixel-diff mérés nélkül
- „Minden rendben" — a lefedettség korlátjának említése nélkül
- „Javítottam" — újramérés nélkül
- „Nem hiba, csak renderelési különbség" — azonos böngészőnél ilyen
  nincs (A3)
- Bármely szám, ami nem tényleges futtatásból származik

---

## 6. Eszközök

| Eszköz | Szerep |
|---|---|
| `tools/pixel-diff.mjs` | **Mérvadó.** Teljes oldal, minden képpont, küszöb 0 |
| `tools/pixel-diff.py` | A diff motorja (PIL) |
| `tools/visual-audit.mjs` | Kiegészítő. Célzott, névvel nevezett ellenőrzések |

`visual-audit.mjs` önmagában **nem elegendő** kész-nyilvánításhoz
(A5 miatt) — csak regresszió-figyelésre.

---

## 7. Jelenlegi állapot (mérve, 2026-08-03)

```
pixel-diff (küszöb 0): 67.3% eltérés
oldalmagasság: valós 5144px / klón 3412px (33.7% eltérés)
```

**Ez az állapot NEM felel meg K5-nek.** A dokumentum nem állítja,
hogy az oldal kész — ez a nyitott, mért különbség.
