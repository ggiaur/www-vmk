# Minőségpolitika — www-vmk vizuális klón-egyezés

Ez a dokumentum azt írja le, hogy ténylegesen milyen módszerrel ellenőrzöm,
hogy a www-vmk klón megegyezik-e a valós www.vmk.hu oldallal — nem
ígéretként, hanem a `tools/visual-audit.mjs` szkript tényleges működésének
leírásaként.

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

## Jelenlegi lefedettség (18 ellenőrzés)

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
