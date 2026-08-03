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
| `pixel-diff` | **61.4%** | 2026-08-03 |
| `visual-audit` | **33 PASS / 4 FAIL** | 2026-08-03 |
| Oldal magassága | klón: 4501px / valós: 5144px (−643px) | 2026-08-03 |

---

## Nyitott FAIL-ok (prioritási sorrendben)

### F1 — Hírkártya-kép magassága (FAIL: 170px vs 144px, −15.3%)

**Mi a baj:** a `HomeNewsTile` kép-konténere `h-36` (144px), a valóson 170px.  
**Fájl:** `src/components/home/HomeNewsTile.tsx`  
**Javítás:** `h-36` → `h-[170px]`  
**Ellenőrzés:** `visual-audit.mjs` → `newsCardImageHeight` PASS kell  
**Státusz:** `[ ]` nyitott

---

### F2 — Widget-torony magassága (FAIL: 3055px vs 2734px, −10.5%)

**Mi a baj:** a torony 321px-szel rövidebb a valósnál. Két részoka:

**F2a — FEWA widget képe túl alacsony (FAIL: 135px vs 126px, −6.7%)**  
- Natív `fewa.jpg` mérete: 598×177px  
- A klónban `w-full h-auto` → konténer 236px széles → renderelt: ~70px  
- A valóson a FEWA widget ~135px magas (fejléc-sáv nélkül)  
- **Javítás:** a `fewa.jpg` kép arányát meg kell vizsgálni, vagy `min-h-[100px]` megadni, esetleg jobb felbontású képpel cserélni.  
- **Fájl:** `src/components/layout/SiteSidebar.tsx` és/vagy `public/brand/widgets/fewa.jpg`

**F2b — FILMES-TÉKA widget: hibás kép (24×24px ikon)**  
- A valóson: YouTube embed ("Olvasni élvezet" szöveg + videó lejátszó + "forrás: Fehérvár Médiacentrum" link)  
- A klónban: `filmes-teka.png` egy 24×24px ikon, ami `w-full h-auto` esetén 236×236px-re nyúlik  
- **Javítás lehetőségek (prioritási sorrendben):**  
  1. Valódi YouTube embed (ha iframe engedélyezett a sandboxban)  
  2. Szöveges placeholder ("Olvasni élvezet" + link) a YouTube embed helyett  
  3. Megfelelő méretű (legalább 250×140px) borítókép  
- **Státusz:** `[ ]` nyitott

---

### F3 — Hírkártya-rács szélessége (FAIL: 848px vs 1170px)

**Mi a baj:** a valóson a Bootstrap konténer a sidebar (262px) és gutter után 848px-t hagy a fő tartalomnak. A klón `main .grid` viszont 1170px-t foglal — szélesebb mint kellene.

**Gyökér-ok:** a klón a `REAL_CONTAINER` teljes szélességét adja a `main`-nek, de a `main` belül lévő `.grid` nem veszi figyelembe a sidebar szélességét.  
A valóson: `kont.belső (1170px) - sidebar (262px) - gutter (60px) ≈ 848px`  
A klónon: `grid` = `REAL_CONTAINER szélessége - sidebar(260px) - gap(32px) ≈ 878px` — de a mért 1170px azt jelzi, a grid a TELJES konténer szélességét foglalja.

**Vizsgálandó:** `src/app/(frontend)/page.tsx` L112 — a `grid grid-cols-1 lg:grid-cols-[260px_1fr]` elrendezés hogyan határozza meg a `main` szélességét.  
**Fájl:** `src/app/(frontend)/page.tsx`  
**Státusz:** `[ ]` nyitott

---

## Elvégzett javítások (commitálva)

| Commit | Mi lett javítva | pixel-diff előtte → utána |
|---|---|---|
| `f672454` | Audit hamis PASS-ok javítva (H8): 5 önigazoló check → valódi mérés; 3 új pozíció-check | audit: 34/34 PASS (hamis) → 33/37 PASS, 4 valódi FAIL |
| `034b8bb` | Widget-torony fix magasság eltávolítva | − |
| `9355438` | pixel-diff.py küszöb 30 → 0 (anti-aliasing mentség eltávolítva) | 50.8% → 67.3% (valódi eltérés felszínre) |
| `91b80ab` | Esemény-kártyák szövege csonkolva jelent meg (3→2 oszlop) | − |
| `c818f65` | Teljes oldalas pixel-diff eszköz + kaszkádosodó fejléc hiba (H4) | nagymértékű javulás |

---

## Kötelező protokoll minden munkamenet-végén

```bash
# 1. Mérj
node tools/pixel-diff.mjs
node tools/visual-audit.mjs
npx tsc --noEmit && npx vitest run

# 2. Frissítsd a "Jelenlegi mért állapot" táblát fentebb
# 3. Jelöld [x]-szel a kész feladatokat
# 4. Commitolj: git commit -m "docs: checklista frissítve [X.X% → Y.Y%]"
```

---

## Kapcsolódó dokumentumok

- [`MINOSEGPOLITIKA.md`](./MINOSEGPOLITIKA.md) — elfogadási kritériumok és tiltott állítások
- [`MINOSEG_TORTENET.md`](./MINOSEG_TORTENET.md) — korábbi hibák és tanulságok (H1–H8)
- [`ATADAS_VIZUALIS_EGYEZES.md`](./ATADAS_VIZUALIS_EGYEZES.md) — részletes technikai háttér
