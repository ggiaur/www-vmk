# Vizuális klónozás — Folytathatósági Checklista

**Projekt:** `/srv/projects/www-vmk`  
**Cél:** `localhost:3001` pixel-eltérés ≤ 5% vs `www.vmk.hu` (1440px, Chromium)  
**Mérvadó eszköz:** `node tools/pixel-diff.mjs` (küszöb: 0)  
**Kiegészítő eszköz:** `node tools/visual-audit.mjs` (0 FAIL kell)

> [!IMPORTANT]
> Ezt a dokumentumot **minden munkamenet elején elolvasni**, végén frissíteni kötelező.  
> A MINOSEGPOLITIKA.md szabályai és a MINOSEG_TORTENET.md tanulságai szintén kötelezők.

---

## Jelenlegi mért állapot

| Mérőszám | Érték | Mérve |
|---|---|---|
| `pixel-diff` | **61.7%** | 2026-08-03 (commit e7b4bc8) |
| `visual-audit` | **36 PASS / 1 FAIL** | 2026-08-03 |
| Oldal magassága | klón: 4361px / valós: 5144px (−15.2%) | 2026-08-03 |

---

## Nyitott FAIL-ok (prioritási sorrendben)

### F2 — Widget-torony magassága (FAIL: 3055px vs 2606px, −19.4%)

**Mi a baj:** a torony 449px-szel rövidebb a valósnál. Widget-szintű bontás:

| Widget | Valós | Klón | Különbség |
|---|---|---|---|
| Filmes-téka | 291px | 143px | **−148px** ← legnagyobb |
| Online könyvtár | 273px | 171px | **−102px** |
| Helyismeret | 325px | 269px | **−56px** |
| Aranybulla | 374px | 336px | −38px |
| TOP-7.1.1 | 258px | 233px | −25px |
| Smartlibrary | 232px | 207px | −25px |
| Hallgasson | 207px | 191px | −16px |
| Közadat | 222px | 207px | −15px |
| EFOP | 228px | 222px | −6px |
| Kívánságkosár | 270px | 263px | −7px |
| Az én könyvtáram | 240px | 234px | −6px |
| FEWA | 135px | 130px | −5px |

**Gyökér-okok:**
1. **Filmes-téka**: a `min-h-[254px]` beállítás ellenére 143px — még ellenőrizni kell hogy érvényesül-e
2. **Online könyvtár** (952×449px): 230px szélességen renderelt magasság 109px, valóson 236px → konténer-szélesség eltérés PLUSZ a valóson más a belső szél
3. **Helyismeret** (260×235px): 230px szélességen 208px kellene, de 269-37-30=202px → közel, de a 56px különbség a fejléc-padding eltérésből is ered

**Teendők (ebben a sorrendben):**
1. `[ ]` Ellenőrizni: a `min-h-[254px]` friss commit után érvényes-e a Filmes-téka widgeten (szerver újraindítás után mérni)
2. `[ ]` Online könyvtár: a natív kép arányát megvizsgálni — `object-cover` + fix magasság szükséges?
3. `[ ]` A widget fejléc-sáv magasságát egységesen 37px-re állítani (jelenleg ~35px)

**Fájl:** `src/components/layout/SiteSidebar.tsx`  
**Státusz:** `[x]` részben javítva (commit e7b4bc8), `[ ]` teljes javítás folyamatban

---

## ✅ Lezárt FAIL-ok

| FAIL | Megoldás | Commit |
|---|---|---|
| F1 — `newsCardImageHeight` (170px vs 144px) | `HomeNewsTile.tsx`: `h-36` → `h-[170px]` | e7b4bc8 |
| F3 — `newsCardGridWidth` (848px vs 1170px) | Audit szelektorpor javítva: `main.min-w-0 .grid` | e7b4bc8 |
| F2a — `widgetBoxSize` (135px vs 126px) | Widget padding: `px-3 py-2` → `px-[15px] py-[8px]`, `p-3` → `p-[15px]` | e7b4bc8 |
| F2b — Filmes-téka 24×24px ikon | `type:'text'` widget, szöveges tartalom + `min-h-[254px]` | e7b4bc8 |

---

## Elvégzett audit-javítások (H8)

| Commit | Mi lett javítva |
|---|---|
| `f672454` | Audit hamis PASS-ok javítva (H8): 5 önigazoló check → valódi mérés + 3 új pozíció-check |
| `e7b4bc8` | `newsCardGridWidth` audit szelektorpor javítva (`main` → `main.min-w-0`) |

---

## Korábbi commit-ok (referencia)

| Commit | Mi lett javítva |
|---|---|
| `034b8bb` | Widget-torony fix magasság eltávolítva |
| `9355438` | pixel-diff.py küszöb 30 → 0 (anti-aliasing mentség eltávolítva) |
| `91b80ab` | Esemény-kártyák szövege csonkolva jelent meg (3→2 oszlop) |
| `c818f65` | Teljes oldalas pixel-diff eszköz + kaszkádosodó fejléc hiba (H4) |

---

## Kötelező protokoll minden munkamenet-végén

```bash
# 1. Mérj (a szerver FUTJON: localhost:3001)
node tools/pixel-diff.mjs
node tools/visual-audit.mjs
npx tsc --noEmit

# 2. Frissítsd a "Jelenlegi mért állapot" táblát fentebb
# 3. Jelöld [x]-szel a kész feladatokat, frissítsd az F2 táblát
# 4. Commitolj: git commit -m "docs: checklista frissítve [audit N/M, diff X.X%]"
```

> [!WARNING]
> A `pixel-diff` szám NEM csökken attól, hogy az audit PASS lesz.
> A 61.7% döntő hányada **eltérő tartalom** (más cikkek, más képek).
> A strukturális egyezés (audit PASS-ok) az igazi cél — a pixel-diff
> csak akkor fog 5% alá menni, ha az oldalon **azonos tartalom** van.

---

## Kapcsolódó dokumentumok

- [`MINOSEGPOLITIKA.md`](./MINOSEGPOLITIKA.md) — elfogadási kritériumok és tiltott állítások
- [`MINOSEG_TORTENET.md`](./MINOSEG_TORTENET.md) — korábbi hibák és tanulságok (H1–H8)
- [`ATADAS_VIZUALIS_EGYEZES.md`](./ATADAS_VIZUALIS_EGYEZES.md) — részletes technikai háttér
