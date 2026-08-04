# Projekt Elemzés és Vizuális Összehasonlítás

**Projekt:** `/srv/projects/www-vmk`  
**Élő referencia oldal:** `https://www.vmk.hu/`  
**Éles/Staging kihelyezés:** `https://koha.vmk.hu/`  
**Helyi fejlesztői környezet:** `http://localhost:3001`  
**Dátum:** 2026-08-04  

---

## 1. A Projekt Jelenlegi Állapota

* **Technológiai Stack:** Next.js (App Router), Payload CMS v3, Tailwind CSS, TypeScript, Vitest unit tesztek és Playwright audit eszközök.
* **Mérési állapot:**
  * `visual-audit.mjs`: **36 PASS / 1 FAIL** (egyedül a bal oldali widget-torony összegzett magassága maradt mint nyitott felülvizsgálati pont).
  * `pixel-diff.mjs`: **~61–62%** (a különbség döntő része a dinamikus hírképekből, kiemelt cikkekből és a felugró süti-sávokból adódik).
  * **Tesztlefedettség:** `npx tsc --noEmit` hibamentes, 33 Vitest unit teszt 100%-os PASS.
* **Telepítési sajátosság:** A módosítások a helyi kódbázisban történnek (`http://localhost:3001`). A `https://koha.vmk.hu/` egy távoli szerverre telepített példány, amelyre a frissítések a build/deploy vagy git push folyamat után kerülnek ki.

---

## 2. Pontos Eltérések az Eredeti (www.vmk.hu) és a Klón (koha.vmk.hu) Között

*(Szigorúan a színekre, méretekre, elrendezésekre és arányokra fókuszálva)*

### A. Fejléc és Navigáció (Header & Nav)
1. **Kereső ikon:** Az eredeti `vmk.hu` oldalon egy tömör, vastagabb nagyító ikon szerepel a menü jobb szélén, míg a klónon egy vékonyabb körvonalas ikon.
2. **Menü nyilak (Caret):** A gördülő menüpontoknál az eredetin kis lefelé mutató tömör háromszög (`▼`), a klónon vékony chevron nyíl (`v`) látható.
3. **Katalógus gomb & ikon-sor:** Az eredetin a felső ikonok alatti `"ONLINE KATALÓGUS / BEIRATKOZÁS ▾"` gomb és a felette lévő közösségi ikonok függőleges távolsága és igazítása kis mértékben eltér.

### B. Főoldali Banner (Hero Carousel)
1. **Karusszel léptető nyilak:** 
   * Az eredeti `vmk.hu` oldalon a banner két szélén jól látható, félátlátszó fehér léptető nyilak (`<` és `>`) találhatók.
   * A klónon a jobb oldali nyíl alig látható, a bal oldali nyíl pedig hibásan egy apró karakterként (`'`) jelenik meg a banner képe előtt.

### C. Bal Oldali Sidebar és Widget-torony
1. **Széchenyi 2020 Logó túllógása:** A klónon a bal oldali menü alatt található kerek Széchenyi 2020 kék logó-ív felemelkedett és rátakart a felette lévő menüpontok szövegére (*"Iskolai Közösségi Szolgálat"*, *"MKE Fejér Megyei Szervezete"*). Az eredeti oldalon a logó alatt és felett megfelelő margó van, takarás nélkül. *(Helyileg javítva: `pointer-events: none` és `z-index: 30`).*
2. **Filmes-téka Widget:** Az eredeti `vmk.hu` oldalon a Filmes-téka dobozban egy szürke hátterű beágyazott lejátszó-keret látható (*"Olvasni élvezet"* felirattal), míg a klónon jelenleg egy üres fehér téglalap jelenik meg.

### D. Hírkártyák (News Section)
1. **Címek kis/nagybetűzése (`text-transform`):** A klónon a hírkártyák címei csupa NAGYBETŰVEL megjelentek (pl. `MEGVÁLTOZOTT NYITVATARTÁS`), míg az eredeti oldalon normál kis- és nagybetűs címek szerepelnek (`Megváltozott nyitvatartás`).
2. **Címsáv betűmérete és paddingje:** Az eredetin a hírkártya címsávja **20px bold** (700-as súly) és **15px** paddingot használ. *(Helyileg igazítva).*

### E. Lábléc (Footer)
1. **Oszlopfejlécek tipográfiája:** Az eredeti oldalon a *"Hírlevél"* és *"Kapcsolat"* feliratok normál talpatlan (sans-serif Roboto) betűtípussal szerepelnek 24px méretben. Míg a klónon csupa nagybetűs, talpas (serif Cinzel) betűtípust használtak. *(Helyileg igazítva).*
2. **Kapcsolati ikonok:** A klónon térkép-jelölő (`📍`) és telefon (`📞`) ikonok szerepeltek a cím és telefonszám előtt, míg az eredetin nincsenek ikonok, csak sima szöveg. *(Helyileg igazítva).*
3. **Alsó Copyright sáv:**
   * Az eredetin: `©2015 Vörösmarty Mihály Könyvtár. Minden jog fenntartva! - NEOSOFT` és jobb szélén `Opening hours`.
   * A klónon: `© 2026 Vörösmarty Mihály Könyvtár. Minden jog fenntartva.` (hiányzott a NEOSOFT jelzés) és jobb szélén `Nyitvatartás` szerepelt. *(Helyileg igazítva).*
   * Az alsó sáv háttérszíne az eredeti oldalon egy világosabb árnyalatú ciánkék (`#33A6AF`).

---

## 3. Vizuális Hőtérkép (Heatmap) Elemzés

Előállítottuk a hőtérképet, amely piros színnel emeli ki a pixel-eltéréseket a valós oldal (`www.vmk.hu`) és a helyi klón (`http://localhost:3001`) között:

* **Sötétszürke zónák (Egyező elrendezés és szerkezet):** A fejléclogó, a navigációs menü, a bal oldali widget-torony (FEWA, Aranybulla, stb.), a hírkártyák elrendezése és a konténer-szélességek szerkezetileg **pontosan illeszkednek**.
* **Piros zónák (Eltérések okai):**
  1. **Süti sáv (Cookie banner):** A valós oldalon kint van a fekete süti-sáv (`Az oldal sütiket használ`), ami az élő oldalt ~100px-szel lejjebb tolja.
  2. **Tartalmi képek:** A dinamikus hírképek és a felugró süti-ablak okozzák a piros elszíneződést.
