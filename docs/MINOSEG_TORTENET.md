# Minőség — hiba- és módszertörténet

Ez a dokumentum azt rögzíti, **milyen hibák fordultak elő és mit
tanultunk belőlük**. A kötelező szabályok és elfogadási kritériumok
NEM itt, hanem a [MINOSEGPOLITIKA.md](./MINOSEGPOLITIKA.md)-ben
vannak.

A célja: ne kelljen ugyanazt a hibát kétszer felfedezni.

---

## H1. Szemrevételezés mint ellenőrzés (elvetve)

**Hiba:** a vizuális egyezés ellenőrzése screenshot-ok
szemrevételezésével történt.

**Következmény:** a katalógus gomb színét bordónak ítéltem, holott
teal volt; a fejléc navigációs sorát teal hátterűnek, holott fehér.

**Tanulság → szabály:** MINOSEGPOLITIKA A1 (mérés, nem benyomás).

---

## H2. A whitelist-csapda

**Hiba:** a `visual-audit.mjs` ~16 kézzel írt ellenőrzést tartalmazott,
és a "33 passed, 0 failed" eredményt egyezésként kommunikáltam.

**Következmény:** a valóságban a képpontok 54,6%-a eltért. Az
ellenőrzés szerkezetileg képtelen volt bármit megtalálni, amire
előre nem gondoltam.

**Négy részok:**
1. Whitelist volt, nem összehasonlítás — 16 tulajdonság több ezerből
2. Mindig utólag bővült; sosem talált meg semmit elsőként
3. Önigazoló toleranciák (±40%, ±20%) — nem elvi alapon, hanem hogy
   az akkori állapot átmenjen
4. A gyenge jelzést erős bizonyítékként adtam elő

**Tanulság → szabály:** A2 (nincs önigazoló tolerancia), A5 (a
lefedettség hiánya nem hibátlanság).

---

## H3. A hamis anti-aliasing mentség (2026-08-03)

**Hiba:** a `pixel-diff.py`-ban `PIXEL_THRESHOLD = 30` állt, azzal az
indoklással, hogy "a böngészők közti anti-aliasing eltérés nem hiba".

**Miért volt hamis:** a `pixel-diff.mjs` UGYANAZT az egyetlen
Chromium-példányt, OS-t és viewportot használja mindkét oldalhoz.
Azonos renderelő motornál nincs böngészők-közti eltérés.

**Mennyit rejtett el (mérve, ugyanazon felvételpáron):**

| küszöb | eltérő képpont |
|---|---|
| 0 | **67.3%** |
| 5 | 60.9% |
| 10 | 59.3% |
| 20 | 57.1% |
| 30 | 50.8% ← ezt jelentettem |
| 50 | 46.4% |

**16,5 százalékpontnyi valódi eltérés** eltüntetve egy önigazoló
számmal.

**Javítva:** küszöb 0-ra állítva.

**Tanulság → szabály:** A3 (azonos mérési feltételek → minden
eltérés hiba).

---

## H4. Kaszkádosodó fejléc-eltolódás

**Hiba:** a fejléc 14px-szel magasabb volt a valósnál.

**Következmény:** az eltolódás lefelé kaszkádosodott, minden szöveg
elcsúszva renderelődött az egész oldalon. 16 kézi ellenőrzés együtt
sem vette észre — a teljes oldalas hőtérkép azonnal megmutatta
(kettős szöveg a diffen).

**Tanulság:** a teljes oldalas képpont-diff olyat is megtalál, amire
senki nem gondolt előre. Ezért mérvadó.

---

## H5. Az eszköz megvolt, a fegyelem hiányzott

**Hiba:** a `pixel-diff.mjs` teljes oldalas hőtérképet generál, de
ebből csak **kiválasztott, sejtett részeket** vágtam ki és néztem meg
(fejléc, hírkártyák). Sosem néztem végig szisztematikusan az egészet.

**Következmény:** a felhasználó a saját screenshotján vette észre a
hibákat, amiket az én eszközöm adata már tartalmazott.

**Amikor végre szisztematikusan végignéztem** (6 db 600px-es szelet):
azonnal találtam egy addig nem jelzett valódi hibát — az
esemény-kártyák szövege csonkolva jelent meg ("Csend Olva...",
"Vör...").

**Tanulság → szabály:** MINOSEGPOLITIKA 3. szakasz 4. pont (a teljes
hőtérkép szisztematikus átnézése kötelező, nem opcionális).

---

## H6. Kitalált tartalék adat éles nézetben

**Hiba:** az Events gyűjteményben 1 valós rekord volt, a Galleries
üres. A `page.tsx` `sampleEvents` tartalék tömbre esett vissza, és a
főoldal **kitalált eseményeket** mutatott valósként.

**Következmény:** hetekig kitalált tartalom jelent meg éles nézetben
anélkül, hogy ez feltűnt volna.

**Ráadás:** ezt korábban "böngésző-renderelést igénylő, blokkolt"
feladatnak jelöltem — tévesen: mind az `/events`, mind a `/gallery`
sima HTTP fetch-csel lekérhető. A blokkoló nem létezett.

**Javítva:** valós scraperek → 4 valós esemény, 46 valós galéria.

**Tanulság → szabály:** K4 (nincs kitalált adat éles nézetben).

---

## H8. Hamis PASS ellenőrzések a visual-audit.mjs-ben (2026-08-03)

**Hiba:** a `visual-audit.mjs`-ben 5 ellenőrzés strukturálisan képtelen volt
FAIL-t adni, mégis beleszámított a „34 passed, 0 failed" eredménybe:

| Ellenőrzés | Probléma |
|---|---|
| `newsCardTitleBg` | `compare: (r, l) => r != null && l != null` — csak jelenlétet ellenőriz, a tényleges RGBSZÍNT nem |
| `figyelemBannerSize` | `compare: () => true` — feltétel nélkül mindig PASS |
| `widgetBoxSize` | `±40% magasság` tolerancia — ha a widget 135px valós és 189px klón, ez PASS |
| `widgetTowerTotalHeight` | `±15%` tolerancia = ~460px elfogadható eltérés. A torony 2734px vs 3055px = 321px különbség, ez PASS-t kapott |
| `newsCardImageHeight` | `±20%` tolerancia = ~34px elfogadható eltérés |

**Ráadás:** az eszköznek egyetlen ellenőrzése sem volt a fő tartalom-rács
pozíciójára (hírkártya x-koordináta, szélesség, gap, sorok száma) —
márpedig a pixel-diff legsötétebb tartományai ott vannak.

**Következmény:** az audit „34 passed" eredménye közben a pixel-diff 61.4%
volt. Ez pontosan a H2-t ismétli (whitelist-csapda), más ellenőrzésekkel.

**Javítva:**
- `newsCardTitleBg.compare`: a tényleges RGB-értéket hasonlítja
- `figyelemBannerSize`: SKIP ha nincs banner (nem PASS)
- `widgetBoxSize.compare`: `±5%` mindkét dimenzióra
- `widgetTowerTotalHeight.compare`: `±8%` (~245px), mért elvi alapon
- `newsCardImageHeight.compare`: `±10%` (~17px)
- Új ellenőrzések: `newsCardGridX` (hírkártya-rács x-pozíció), `newsCardWidth` (kártya szélesség), `mainColumnX` (fő tartalom-oszlop bal széle)

**Tanulság → szabály:** Minden `compare` függvény megírásakor explicit
ki kell mondani: „milyen konkrét értéknél adna ez FAIL-t?" Ha a válasz
„soha" vagy „nem tudom", a check hibás.

---

## H7. Pozíció vs. tartalom a pixel-diffben

**Megfigyelés:** a valós hírképek lecloneozása után a pixel-diff szám
alig mozdult (50.0% → 50.1%), pedig a tartalom pixelre azonos lett.

**Ok:** a diff koordinátánként hasonlít. Egy helyes tartalom, ami
55px-szel arrébb van, 100%-ban eltérőnek számít.

**Következmény a mérésre:** a nyers % csak akkor közelít 0-hoz, ha
MINDKÉT feltétel teljesül — helyes tartalom ÉS pontos pozíció.
Ezért kell a szerkezeti és tartalmi eltérést külön jelenteni
(MINOSEGPOLITIKA 2. szakasz, K5).
