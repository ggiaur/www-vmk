# A Projekt Vizuális és Szerkezeti Audit Jelentése

**Projekt:** `/srv/projects/www-vmk`  
**Élő referencia oldal:** `https://www.vmk.hu/`  
**Távoli kihelyezett teszt szerver (Staging):** `https://koha.vmk.hu/`  
**Helyi fejlesztői környezet (Dev):** `http://localhost:3001`  
**Dátum:** 2026-08-04  

---

## 1. Miért nem látszódnak a változások a https://koha.vmk.hu/ oldalon?

A **`https://koha.vmk.hu/` egy távoli szerveren futó éles/staging weboldal**. 

A kódbázisban végzett módosítások a **helyi fejlesztői környezetben (`http://localhost:3001`)** lépnek életbe. A távoli `https://koha.vmk.hu/` szerver a korábbi, régi buildet futtatja mindaddig, amíg a helyi git commitok (`git push origin main`) nincsenek feltöltve és újraépítve a távoli szerveren!

---

## 2. Vizuális Hőtérkép (Heatmap) Elemzés

Előállítottuk a vizuális hőtérképet a valós élő oldal (`www.vmk.hu`) és a helyi fejlesztés (`http://localhost:3001`) között:

![Vizuális Hőtérkép Elemzés](file:///home/dockeruser/.gemini/antigravity-cli/brain/db454c03-8205-4811-806d-e48a45714898/visual_heatmap_comparison.png)

### A hőtérkép megállapításai:
* **Sötétszürke zónák (Egyező elrendezés és szerkezet):** A fejléclogó, a navigációs menü, a bal oldali widget-torony (FEWA, Aranybulla, stb.), a hírkártyák elrendezése és a konténer-szélességek szerkezetileg **pontosan illeszkednek**.
* **Piros zónák (Eltérések okai):**
  1. **Süti sáv (Cookie banner):** A valós oldalon kint van a fekete süti-sáv (`Az oldal sütiket használ`), ami az élő oldalt ~100px-szel lejjebb tolja.
  2. **Dinamikus képek:** A hírkártyák fotói és a felugró süti-ablak okozzák a piros elszíneződést.

---

## 3. Mélyreható Tipográfiai és Méretezési Audit Mátrix (1:1 Egyezés)

Playwright `deep-style-audit.mjs` eszközzel, `getComputedStyle` segítségével összehasonlítottuk és 1:1-ben beállítottuk az elemeket:

| Elem | Eredeti (www.vmk.hu) | Klón (localhost:3001) | Státusz |
|---|---|---|---|
| **News Tile Title** | Roboto 20px / 700 / lh 22px / p:15px | Roboto 20px / 700 / lh 22px / p:15px | ✅ **100% PASS** |
| **News Tile Body** | Roboto 15px / 400 / lh 20px / #000 | Roboto 15px / 400 / lh 20px / #000 | ✅ **100% PASS** |
| **Sidebar MENÜ Header** | Roboto 18px / 700 / lh 19.8px / #00909B | Roboto 18px / 700 / lh 19.8px / #00909B | ✅ **100% PASS** |
| **Footer Header** | Roboto 24px / 700 / lh 26.4px | Roboto 24px / 700 / lh 26.4px | ✅ **100% PASS** |
| **Nav Link** | Roboto 16px / 700 / UPPERCASE | Roboto 16px / 700 / UPPERCASE | ✅ **100% PASS** |
| **Section Title HÍREK** | Cinzel 24px / 700 / lh 26.4px / #333 | Cinzel 24px / 700 / lh 26.4px / #333 | ✅ **100% PASS** |

---

## 4. Ellenőrzés és Git Állapot

* **TypeScript ellenőrzés:** `npx tsc --noEmit` hibátlanul lefutott.
* **Unit tesztek:** `npx vitest run` mind a 33 teszt PASS.
* **Git commit:** A változtatások elmentve a `main` ágon.
