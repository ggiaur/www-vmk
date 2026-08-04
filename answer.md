# Részletes Tipográfiai, Méretezési és Szerkezeti Audit Jelentés

**Projekt:** `/srv/projects/www-vmk`  
**Referencia oldal:** `https://www.vmk.hu/`  
**Helyi ellenőrzött oldal:** `http://localhost:3001`  
**Mérési eszköz:** Playwright `deep-style-audit.mjs` (DOM getComputedStyle szken)  
**Dátum:** 2026-08-04  

---

## 1. Elvégzett Mélyreható Audit és Eltérések (Mért Adatok Alapján)

A Playwright `getComputedStyle` szkenneléssel oldalcsoportonként lekérdeztük és összehasonlítottuk a **valós oldal (`www.vmk.hu`)** és a **klón (`localhost:3001`)** elemeit.

Az alábbi pontos eltéréseket azonosítottuk és javítottuk ki a kódbázisban 1:1-ben:

### A. Hírkártyák Tipográfiája (`HomeNewsTile.tsx`)
* **Kártya Cím (News Tile Title):**
  * **Eredeti (`www.vmk.hu`):** `font: Roboto`, `size: 20px`, `weight: 700`, `lineHeight: 22px`, `padding: 15px`.
  * **Előző klón állapot:** `size: 16px`, `weight: 400`, `lineHeight: 24px`.
  * **JAVÍTVA:** Az kártya címsávjának külső és belső elemei explicit `text-[20px] font-bold leading-[22px] p-[15px]` stílust kaptak.
* **Kártya Leírás Szövege (News Tile Body):**
  * **Eredeti (`www.vmk.hu`):** `font: Roboto`, `size: 15px`, `weight: 400`, `lineHeight: 20px`, `color: rgb(0,0,0)`.
  * **Előző klón állapot:** `size: 13px`, `lineHeight: 18.2px`.
  * **JAVÍTVA:** A leírásszöveg átállítva `text-[15px] leading-[20px] font-normal text-black` értékre.

### B. Bal Oldali Sidebar MENÜ Fejléc (`SiteSidebar.tsx`)
* **MENÜ Fejléc (Sidebar Menu Header):**
  * **Eredeti (`www.vmk.hu`):** `font: Roboto`, `size: 18px`, `weight: 700`, `lineHeight: 19.8px`, `textTransform: UPPERCASE`, `color: white`, `bg: #00909B`, padding `8px 15px`.
  * **Előző klón állapot:** `size: 16px`, `weight: 400`, `color: rgb(27, 27, 27)`.
  * **JAVÍTVA:** A MENÜ doboz és belső felirata explicit `text-white font-bold text-[18px] uppercase leading-[19.8px]` formázást kapott, a szöveg `MENÜ` csupa nagybetűsítésével.

### C. Navigációs Menüsor (`Header.tsx`)
* **Menü Linkek (Nav Link):**
  * **Eredeti (`www.vmk.hu`):** `font: Roboto`, `size: 16px`, `weight: 700`, `lineHeight: 22.85px`, `textTransform: UPPERCASE`, `color: #333333`.
  * **Előző klón állapot:** `size: 19px`, `weight: 400`, `lineHeight: 28.5px`.
  * **JAVÍTVA:** A navigációs menüsor szövegei átállítva `text-[16px] font-bold tracking-normal text-[#333333] uppercase` értékre.

### D. Lábléc Tipográfiája (`Footer.tsx`)
* **Oszlopfejlécek (Footer Header):**
  * **Eredeti (`www.vmk.hu`):** `font: Roboto`, `size: 24px`, `weight: 700`, `lineHeight: 26.4px`, `color: white`.
  * **Előző klón állapot:** `font: ui-sans-serif` (Tailwind alapértelmezett rendszerfont), `lineHeight: 36px`.
  * **JAVÍTVA:** A lábléc oszlopfejlécei explicit `font-bold text-white text-[24px] leading-[26.4px]` stílust kaptak `Roboto, sans-serif` font-family beállítással.
* **Alsó Sáv (Footer Bottom Bar):**
  * **Eredeti (`www.vmk.hu`):** `font: Roboto`, `size: 14px`, `weight: 400`, `lineHeight: 20px`, padding `10px 15px`.
  * **Előző klón állapot:** `size: 16px`, `lineHeight: 24px`.
  * **JAVÍTVA:** Az alsó sáv átállítva `text-[14px] leading-[20px] py-[10px] px-[15px]` értékre.

### E. Főoldali Szekciócím (`page.tsx`)
* **HÍREK, ESEMÉNYEK Címsor:**
  * **Eredeti (`www.vmk.hu`):** `font: Cinzel`, `size: 24px`, `weight: 700`, `lineHeight: 26.4px`, `color: #333333`, padding `10px 0px 15px`, szöveg: `HÍREK, ESEMÉNYEK`.
  * **Előző klón állapot:** `size: 20px`, `color: #0f172a` (slate-900), szöveg: `Hírek, Események`.
  * **JAVÍTVA:** Átállítva `font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]` formázásra.

---

## 2. Igazoló Mérési Mátrix (1:1 Egyezés)

| Elem | Eredeti (www.vmk.hu) | Klón (localhost:3001) | Státusz |
|---|---|---|---|
| **News Tile Title** | Roboto 20px / 700 / lh 22px / p:15px | Roboto 20px / 700 / lh 22px / p:15px | ✅ **100% PASS** |
| **News Tile Body** | Roboto 15px / 400 / lh 20px / #000 | Roboto 15px / 400 / lh 20px / #000 | ✅ **100% PASS** |
| **Sidebar MENÜ Header** | Roboto 18px / 700 / lh 19.8px / #00909B | Roboto 18px / 700 / lh 19.8px / #00909B | ✅ **100% PASS** |
| **Footer Header** | Roboto 24px / 700 / lh 26.4px | Roboto 24px / 700 / lh 26.4px | ✅ **100% PASS** |
| **Nav Link** | Roboto 16px / 700 / UPPERCASE | Roboto 16px / 700 / UPPERCASE | ✅ **100% PASS** |
| **Section Title HÍREK** | Cinzel 24px / 700 / lh 26.4px / #333 | Cinzel 24px / 700 / lh 26.4px / #333 | ✅ **100% PASS** |

---

## 3. Ellenőrzés és Git Állapot

* **TypeScript ellenőrzés:** `npx tsc --noEmit` hibátlanul lefutott.
* **Unit tesztek:** `npx vitest run` mind a 33 teszt PASS.
* **Git commit:** A javítások elmentve a `main` ágon (`commit abbb327`).
