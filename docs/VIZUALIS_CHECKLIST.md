# Vizuális eltérések — Checklista (www.vmk.hu vs localhost:3001)

Fentről lefelé haladva. Minden javítás előtt: `node tools/pixel-diff.mjs` futtatás.
Mérvadó küszöb: ≤ 5% pixel-diff, 1440px viewport, azonos Chromium-példány.

---

## FEJLÉC (y=0–160)

| # | Elem | Valós | Klón | Állapot |
|---|------|-------|------|---------|
| H1 | Logo sor magassága | 110px | 110px | ✅ kész |
| H2 | Nav csík helye | y=155 | y=155 | ✅ kész (border-b eltávolítva) |
| H3 | Teal border alul | 5px | 5px | ✅ kész |
| H4 | shadow-md fejlécen | nincs | volt `shadow-md` | ✅ kész (eltávolítva) |

---

## BANNER (y=160–550)

| # | Elem | Valós | Klón | Állapot |
|---|------|-------|------|---------|
| B1 | Banner szélesség | 1140px (x=150..1289) | 1140px | ✅ kész (px-[15px] hozzáadva) |
| B2 | Banner magasság | ~390px | ~390px | ✅ kész |

---

## SIDEBAR — MENÜ szekció (y≈590–1188 REAL)

| # | Elem | Valós | Klón | Állapot |
|---|------|-------|------|---------|
| M1 | MENÜ fejléc y-pozíció | y=590 | y=590 | ✅ kész |
| M2 | MENÜ nav: Széchenyi logo | NEM a navban van — lásd láblécnél | nincs | N/A (téves korábbi feltételezés) |
| M3 | Nav szélesség / betűméret | 262px tartalom | 236px tartalom | ⚠️ sidebar 260px vs valós 292px |

---

## SIDEBAR — WIDGET TORONY (y≈1188–)

A valós oldal Bootstrap sidebar col-sm-3 = 292px széles, 262px tartalom.
A klón sidebar = 260px széles, 236px tartalom (p-3 = 12px padding).
Emiatt MINDEN képes widget alacsonyabb a klónban.

| # | Widget | Valós kép | Valós méretek | Klón kép | Állapot |
|---|--------|-----------|---------------|----------|---------|
| W1 | FEWA | FEWA.jpg | 598×177 | fewa.jpg | ✅ kép OK, méret eltér (80px→70px) |
| W2 | Aranybulla-Webarchívum | awa.png | 460×550 | aranybulla.png | ✅ kép OK, méret eltér |
| W3 | Filmes-téka | IFRAME (150px magas) | iframe embed | filmes-teka.png (24×24 ikon!) | ❌ teljesen hibás |
| W4 | TOP-7.1.1-ERFA | erfa.png | 858×638 (display: 270×188) | top-erfa.png (858×638) | ⚠️ kép OK, de más padding |
| W5 | Hallgasson ránk! | Radios_konyvajanlo.png | 1280×720 | hallgasson-rank.png | ✅ kép OK |
| W6 | Smartlibrary | Dobozkep__6_.png | 586×370 | smartlibrary.png | ✅ kép OK |
| W7 | EFOP-3.7.3 | Szechenyi2020-logo-Efop.png | 403×281 (display: 270×188) | efop.png (403×281) | ⚠️ kép OK, de más padding |
| W8 | Kívánságkosár | kivansagkosar-felirat-nelkul.jpg | 260×228 | kivansagkosar.jpg | ✅ kép OK |
| W9 | Helyismeret | lexikon.jpg + naptar-evfordulo.jpg | 260×226 + 259×32 | helyismeret.jpg (260×235) | ❌ 2 kép kell, nem 1 |
| W10 | Online könyvtár | online-konyvtar.jpg + 2 gomb | 952×449 | online-konyvtar.jpg | ⚠️ hiányzik a 2 "Adatbázisok" gomb |
| W11 | Az én könyvtáram | Az_en_konyvtaram.png | 640×480 | az-en-konyvtaram.png | ✅ kép OK |
| W12 | Közadat | kozadat_logo_fooldal.png | 761×480 | kozadat.png | ✅ kép OK |

**Főok**: sidebar 260px vs 292px → minden widget rövidebb. Javítás: sidebar width → 293px, widget padding → 15px (Bootstrap-stílusú).

---

## FŐ TARTALOM — Hírek rács

| # | Elem | Valós | Klón | Állapot |
|---|------|-------|------|---------|
| N1 | Hírkártya x-pozíció | x=443 | eltér | ❌ nem mért pontosan |
| N2 | Hírkártya szélesség | 262px | ? | ❌ nem mért |
| N3 | Képek: legtöbb hír kép nélküli | ✅ (T1 tény) | ✅ | ✅ szándékos |

---

## LÁBLÉC

| # | Elem | Valós | Klón | Állapot |
|---|------|-------|------|---------|
| F1 | Széchenyi logók | fix pozíció, jobb+bal oldalt | nincs | ❌ hiányzik |
| F2 | szechenyi2020_erfa_jobb.png | 250×175, jobb oldalt fix | nincs | ❌ letöltve, de nem implementálva |
| F3 | szechenyi2020_esza_bal.png | 250×175, bal oldalt fix | nincs | ❌ letöltve, de nem implementálva |

---

## TARTALMI ELTÉRÉSEK (nem strukturális)

Ezek a pixel-diffet növelik, de NEM hiba — a valós oldal dinamikus tartalom.

| # | Elem | Megjegyzés |
|---|------|------------|
| T1 | 90 hír kép nélkül | T1 tény: a valós vmk.hu-n is így van |
| T2 | Galériák képei | Tartalom-különbség, nem layout-hiba |
| T3 | Esemény képei | Tartalom-különbség |
| T4 | Hírek sorrendje | Az aktuális nap hírei változhatnak |

---

## JAVÍTÁSI SORREND (prioritás)

1. ❌ **W3 Filmes-téka** — iframe widget implementálása (nagy magasság-eltérés)
2. ⚠️ **Sidebar szélesség** — 260px → 293px (minden widget magasságát érinti)
3. ❌ **W9 Helyismeret** — 2 kép egymás alatt
4. ⚠️ **W10 Online könyvtár** — 2 gomb hozzáadása
5. ❌ **F1-F3 Széchenyi fix logók** — implementálás a layout-ban

---

## Mért állapot

```
pixel-diff:  60.3%  (után: 61.4% → 60.3% után 2 fix)
célérték:    ≤ 5%
oldal-mag:   valós 5144px / klón 4501px  (12.5% rés)
```

Eszköz: `node tools/pixel-diff.mjs`
