# Minőségpolitika — www-vmk vizuális klón-egyezés

Ez a dokumentum azt írja le, hogy ténylegesen milyen módszerrel ellenőrzöm,
hogy a www-vmk klón megegyezik-e a valós www.vmk.hu oldallal — nem
ígéretként, hanem a `tools/visual-audit.mjs` szkript tényleges működésének
leírásaként.

## A KÉT ESZKÖZ, ÉS MIÉRT KELL MINDKETTŐ

**1. `tools/pixel-diff.mjs` — TELJES OLDALAS KÉPPONT-DIFF (ez a fő eszköz)**

```bash
node tools/pixel-diff.mjs
```

Screenshotot készít a valós vmk.hu-ról és a klónról ugyanazon a
szélességen, majd **minden képpontot** összehasonlít. Kimenet:
összesített eltérés %-ban, 100px-es sávonkénti bontás (hol a
legrosszabb), és egy **hőtérkép** (piros = eltérés).

Ez azért fontos, mert **megtalálja azt is, amire senki nem gondolt
előre**. Az első futtatás azonnal kimutatott egy olyan hibát, amit
16 kézi ellenőrzés együtt sem vett észre: a fejlécem 14px-szel
magasabb volt, és ez az eltolódás **lefelé kaszkádosodott** az egész
oldalon — emiatt minden szöveg elcsúszva renderelődött.

**2. `tools/visual-audit.mjs` — célzott ellenőrzések (kiegészítő)**

Konkrét, névvel nevezett tulajdonságokat mér (logó mérete, gomb
színe stb.). Hasznos regresszió-figyelésre, DE önmagában
**megtévesztő**: csak azt találja meg, amit előre beleírtam.

### A korábbi rendszer hibája (őszintén)

A `visual-audit.mjs` "33 passed, 0 failed" eredményt adott, miközben
a valóságban a képpontok **54,6%-a eltért**. Ennek négy oka volt:

1. **Whitelist, nem összehasonlítás.** ~16 tulajdonságot néztem több
   ezerből. A "passed" csak annyit jelentett: *"az általam kiválasztott
   16 dolog rendben van"* — a többiről semmit.
2. **Mindig utólag futott.** Csak azután került be egy ellenőrzés,
   hogy a hibát valaki más megtalálta. Sosem talált meg semmit elsőként.
3. **A toleranciák önigazolóak voltak.** ±40% magasság-tolerancia,
   ±20% képmagasság — ezek nem elvi alapon választott számok voltak,
   hanem olyanok, amikkel az akkori állapot átment. Egy 170px vs 144px
   eltérés (amit szemmel azonnal látni) "PASS"-t kapott.
4. **A PASS-t erősebb bizonyítékként adtam elő, mint amilyen.** Ez volt
   a tényleges hiba: a gyenge jelzést biztos egyezésként kommunikáltam.

**Ezért mostantól a `pixel-diff.mjs` a mérvadó**, a `visual-audit.mjs`
csak kiegészítő regresszió-figyelő. Egy állítás csak akkor hangozhat el,
hogy "egyezik", ha a pixel-diff száma is alátámasztja.

## Mi változott, és miért

Korábban a vizuális ellenőrzés screenshot-ok szemrevételezéséből állt. Ez
többször hibázott (pl. a katalógus gomb színét bordónak láttam telinek,
holott teal volt; a fejléc navigációs sorát teal hátterűnek gondoltam,
holott fehér). A szemrevételezés nem megbízható módszer méret- és
színegyezés ellenőrzésére.

## A jelenlegi módszer

1. **Playwright** ugyanazon a viewport-méreten megnyitja a valós
   `www.vmk.hu`-t ÉS a helyi klónt.
2. Konkrét DOM-elemeken `getBoundingClientRect()` (pozíció, méret) és
   `getComputedStyle()` (szín) hívásokkal MÉRÜNK — nem becslünk.
3. Ahol a DOM-lekérdezés megbízhatatlan lehet (pl. cookie-consent overlay
   eltorzíthatja a koordinátákat, vagy egy CSS-szelektor véletlenül rossz
   elemet talál el), ott **közvetlen pixel-mintavétellel** (PIL, a
   renderelt PNG konkrét (x,y) koordinátáin) ellenőrizzük a tényleges
   RGB-értéket. Ez történt a fejléc navigációs sávjának színénél is.
4. Minden ellenőrzés PASS/FAIL-t ír ki **konkrét számokkal**, nem
   "úgy néz ki, hogy jó".
5. A szkript a repóban van (`tools/visual-audit.mjs`), verzionálva —
   minden jövőbeli vizuális változtatás után újra lefuttatható, és
   bővíthető új ellenőrzésekkel.

## Jelenlegi lefedettség (33 ellenőrzés)

Négy új hibaosztály került be 2026-08-02-én, miután a felhasználó
konkrét, pixelre mutatott eltéréseket talált, amiket a korábbi
ellenőrzések nem fogtak meg: a fejléc-margó törésponti (nem
folyamatos) skálázása, egy ikon aránytalanul kicsi mérete (a
korábbi ellenőrzés csak a középre-igazítást nézte, a méretet nem),
a navigáció betűmérete/súlya, és a lábléc oszlopcímeinek stílusa.
Lásd `navFontMetrics`, `navBottomStripeWidth`, `wifiToFlagGap`,
`footerColumnHeaderStyle`, `iconSizeOutlier`, `logoMargin@*px`.

| # | Ellenőrzés | Mit mér |
|---|---|---|
| 1 | `logoBox` | Logó méret (szélesség/magasság) |
| 2 | `logoLeftMargin` | Logó bal margója a képernyő szélétől |
| 3 | `catalogBtnBelowIcons` | Katalógus gomb az ikonsor ALATT van-e |
| 4 | `widgetContentBg` | Oldalsáv widget-dobozok háttérszíne |
| 5 | `newsCardTitleBg` | Hírkártya címsávjának háttérszíne |
| 6 | `bannerToHeaderGap` | Banner-kép közvetlenül a navigáció alatt kezdődik-e |
| 7 | `widgetBoxSize` | Oldalsáv widget-doboz mérete (±15%/±40% tolerancia - eltérő tartalom-típus miatt) |
| 8 | `newsCardImageHeight` | Hírkártya kép-részének magassága (±20% tolerancia) |
| 9 | `bannerAspectRatio` | "A városban N helyen" banner-kép aránya (±5% - ugyanaz a letöltött kép) |
| 10 | `figyelemBannerSize` | FIGYELEM! banner mérete - jelenleg SKIP, mert a valós oldalon időszakos/dinamikus tartalom, épp nincs kint, nincs stabil mérési alap |
| 11 | `iconRowAlignment` | Fejléc-ikonok függőleges igazítása |
| 12-18 | `navNoWrap@{szélesség}px` | A navigáció NEM törik két sorba 1024px és 1920px között egyetlen tesztelt szélességen sem |

## Mit NEM garantál ez a módszer

- **Betűtípus-renderelés**: a szubpixel-szintű anti-aliasing böngészőnként/
  operációs rendszerenként eltérhet, ez nem hiba.
- **Csak azt látjuk, amit mérünk**: ha egy elemre nincs ellenőrzés, arról
  nem tudunk automatikusan — ezért minden alkalommal, amikor a felhasználó
  konkrét eltérést jelez, az az adott elemre új, permanens ellenőrzésként
  kerül be a szkriptbe, nem eldobjuk a mérést a hiba javítása után.
- **Csak a jelenleg felfedezett elemekre terjed ki**: a főoldal alján lévő
  gazdag, képes widget-tartalom (SmartLibrary, EU-pályázati jelvények)
  még nincs lemérve — ismert, nyitott tétel (ld. feladatlista #53).

## Hogyan futtatható

```bash
cd /srv/projects/www-vmk
node tools/visual-audit.mjs
```

A kimenet minden sora PASS vagy FAIL, konkrét mért számokkal — nem
szubjektív értékelés.
