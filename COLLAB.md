# COLLAB.md — www-vmk CLONE PARITY RECOVERY

Ez a repository egyetlen operatív koordinációs forrása.

> A felhasználó NEM közvetítő az AI-k között. GitHub commit/branch + ez a fájl jelenti az átadást.

## 1. CÉL

**CLONE PARITY RECOVERY: ON**

A cél a jelenlegi `https://www.vmk.hu/` nyilvános magyar oldalának tartalmilag, médiában, linkekben, funkcióban és megjelenésben veszteségmentes modern klónja.

A korábbi FIRST-HOP / Depth-2 / Full-site `VERIFIED`, `MISSING=0`, `BROKEN=0` állítások **nem clone-parity bizonyítékok**. Azok csak történeti route-coverage adatok.

A branch **NEM release candidate**, amíg a teljes clone parity nincs mérve, kvantifikálva, javítva és függetlenül ellenőrizve.

## 2. MUNKASZERVEZÉS — HARD RULE

**1 agent = 1 branch = 1 worktree.**

- Claude: primary implementer, saját worktree, `agent/visual-clone-oracle`.
- Gemini: independent auditor, saját worktree, `agent/gemini-final-audit`.
- Shared `/srv/projects/www-vmk` checkoutban párhuzamos munka alatt tilos branch-váltás/szerkesztés.
- ChatGPT csak GitHub connectoron keresztül koordinál/review-zik.
- A felhasználót rutin Git/GitHub/agent-handoff ügyben bevonni tilos.

## 3. MIÉRT ÉRVÉNYTELEN A RÉGI PARITY MODELL

A régi ellenőrzés hamis pozitívokat engedett át:

- `HTTP 200 + H1 + szószám` alapján is lehetett `CLONED`;
- text similarity word-set/Jaccard alapú volt, nem sorrendtartó main-content összevetés;
- képeknél/linkeknél csak darabszámot mért, nem identitást/célt/hibát;
- 1626 gallery/archive route jelentős része generikus `/galeria` fallbacket kapott valódi 1:1 tartalom/fotó migráció nélkül;
- route PASS nem volt kötelezően összekötve text/media/link/function/visual PASS-szal.

Ezért a clone-parity acceptance modellt újra kell építeni és **magát a mérőt is falszifikációs canary-val validálni kell**.

## 4. CLONE PARITY ORACLE v2 — HARD GATE

Egy route csak akkor lehet `PARITY_PASS`, ha minden alkalmazható dimenzió PASS:

1. **URL** — reference/clone status + final URL; detail→generic lista redirect nem parity.
2. **TEXT** — `main` sorrendtartó meaningful-content összevetés; reference coverage >=99%; headings/listák/táblák/metaadatok is.
3. **MEDIA** — konkrét tartalmi képek/galériaelemek inventory + tartalom-alapú megfeleltetés; broken image FAIL; meaningful reference media coverage 100%.
4. **LINKS/DOCS** — anchor+href+típus semantic parity; internal/external/mailto/tel/PDF/download; target-health; broken link FAIL.
5. **STRUCTURE** — heading/paragraph/list/table/form/gallery/card/document blokkok.
6. **FUNCTION** — valódi user-value E2E ahol releváns: search, kapcsolat, hírlevél, teremfoglalás, registration, wishbasket, galéria detail, admin publish→public, PDF download.
7. **VISUAL** — desktop 1440 + mobile 390 reference/local screenshot diff; magas diff nem söpörhető félre más smoke PASS miatt.

A régi word-count, word-set/Jaccard, imageCount/linkCount, HTTP-200-only logika **nem acceptance evidence**.

## 5. KÖTELEZŐ FÁZISSORREND — INVENTORY BEFORE REMEDIATION

**TILOS** a canary után azonnal site-wide javítgatásba kezdeni.

A szakmai sorrend kötelező:

```text
K1  Oracle v2 + falsification canary
    ↓ ChatGPT + Gemini módszertani validáció
K2  teljes referencia-snapshot + teljes deficit-inventory
    ↓ ChatGPT acceptance
K3  page-family/root-cause remediation
    ↓ teljes parity rerun
K4  final acceptance + CI/security/WCAG + mergeability
```

K1-ben csak:
- Oracle/tool hibák javíthatók;
- méréshez szükséges diagnosztikai kód készülhet;
- a canary által talált termékhibákat rögzíteni kell, de **nem szabad sorban kijavítani őket**, mert előbb a teljes deficit méretét kell látni.

K2-ben szintén **inventory az elsődleges**. Termékjavítás csak akkor engedett, ha az közvetlenül szükséges ahhoz, hogy maga a mérés lefusson, és ezt explicit dokumentálni kell.

K3 csak K2 független elfogadása után indulhat.

## 6. K1 — AKTUÁLIS CLAUDE FELADAT

**STATUS: IN_PROGRESS**  
**BALL: CLAUDE**

Első technikai checkpoint megérkezett:

- `99ef05ebfada64c7b3226fcce5ff3cf93723fdf2`
- Oracle v2 skeleton: URL/TEXT/MEDIA/LINKS/STRUCTURE dimenziók elkezdve;
- FUNCTION és VISUAL még `NOT_EVALUATED` — ez helyesebb, mint hamis PASS;
- 22 canary route előkészítve;
- már talált valós false-positive generic gallery redirectet;
- már talált valós broken image-et (`/brand/logos/vmk-logo.png` a galéria fallbacken).

### K1 kötelező deliverable

1. Oracle v2 gépi JSON + emberi HTML report.
2. Route-onként külön `URL / TEXT / MEDIA / LINKS / STRUCTURE / FUNCTION / VISUAL` státusz.
3. >=20 vegyes canary route teljes vizsgálata.
4. `docs/CLONE_PARITY_GAP_REPORT.md` konkrét hiányzó szövegekkel, képekkel, linkekkel/PDF-ekkel, strukturális/funkcionális/vizuális eltérésekkel.
5. Canary-n bizonyítani kell, hogy a v2 felismeri a korábban hamisan `CLONED` route-okat.
6. Gemini független canary eredményével keresztellenőrizhető legyen.
7. K1 alatt a feltárt termékhibákat **ne kezdd el tömegesen javítani**; inventory-inputként rögzítsd őket.

### K1 execution cadence

- kb. 30–45 perc aktív munka után technikai checkpoint push;
- prose/status-only commit nem elég;
- blocker esetén reprodukálható evidence push, majd folytatás más mérhető résszel;
- felhasználói közvetítés tilos.

### K1 acceptance

K1 csak akkor adható vissza, ha:

- >=20 route canary kész;
- mind a 7 dimenzió külön mérhető vagy explicit `NOT_APPLICABLE`/`NOT_EVALUATED` okkal szerepel;
- hiányzó képek és hibás/hiányzó linkek/PDF-ek konkrétan kimutathatók;
- vizuális desktop+mobile comparison működik;
- funkcionális route-ok nem statikus smoke alapján kapnak PASS-t;
- `CLONE_PARITY_GAP_REPORT.md` elkészült;
- Gemini canary nem mutat olyan nyilvánvaló false negative-ot, amit az Oracle PASS-ra engedett.

Átadás:

```text
STATUS: READY_FOR_REVIEW
BALL: CHATGPT
```

## 7. K2 — TELJES REFERENCE SNAPSHOT + DEFICIT INVENTORY

**K2 csak K1 ChatGPT acceptance után indulhat.**

K2 célja: **mielőtt bármit tömegesen javítunk, pontosan tudjuk a teljes munka méretét.**

### 7.1 Reference freeze

A K2 elején készüljön időbélyegzett baseline/snapshot a referenciaoldalról, hogy a mozgó `www.vmk.hu` ne változtassa menet közben a mércét.

Route-onként rögzítendő:
- reference URL + final URL + HTTP;
- title/meta;
- meaningful `main` text és strukturális blokkok;
- headings;
- media inventory;
- link/download/PDF inventory;
- form/function jelenlét;
- desktop+mobile screenshot.

### 7.2 Teljes scope

A korábban felfedezett same-host magyar graphból indulunk, de a v2 inventory újra osztályozza az összes releváns route-ot. A gallery/archive család sem kaphat automatikus kivételt.

### 7.3 Kötelező K2 output

- `docs/CLONE_PARITY_FULL_INVENTORY.md`
- gépi JSON/CSV inventory
- összes route száma page-family szerint
- `PARITY_PASS / FAIL / N/A / BLOCKED` dimenziónként
- hiányzó text blockok száma/route-jai
- hiányzó vagy rossz media assetek száma/route-jai
- hiányzó/rossz internal/external/PDF/download linkek száma/route-jai
- funkcionális deficit lista
- visual deficit page-family reprezentánsokkal
- root-cause klaszterek és becsült javítási egységek

A K2 végén először kell tudnunk hitelesen például ezt:

```text
összes releváns route: N
full parity pass: X
text deficit: Y route
media deficit: Z route / M asset
link/doc deficit: ...
functional deficit: ...
visual major deficit: ...
```

K2 alatt **nem a PASS arány növelése a cél**, hanem a valós deficit teljes feltárása.

## 8. K3 — ROOT-CAUSE PARITY CLOSURE

Csak elfogadott K2 után.

Prioritás:
1. current first-hop;
2. current depth-2;
3. aktuális news/events/static oldalak;
4. gallery/media/document page-family-k;
5. legacy/archive, ahol a referencián tényleges tartalom/média van.

Javítás page-family/root-cause alapon:
- generikus importer;
- media migration pipeline;
- canonical link mapping;
- gallery family importer/resolver;
- strukturális komponensjavítás;
- funkcionális workflow;
- vizuális family-template korrekció.

**Tilos** 1000 route-on kézi egyedi patch-sorozattal „zöldíteni” a reportot.

## 9. GEMINI — FÜGGETLEN AUDITOR

Gemini külön worktree-ben, `agent/gemini-final-audit` branchen dolgozik.

Jelenlegi feladata: legalább 20 route független canary parity audit. Nem vár Claude Oracle-jére és nem javítja a primary branchet.

Gemini eredménye az Oracle mérési megbízhatóságának független kontrollja.

## 10. CHATGPT — ACCEPTANCE / ORCHESTRATION

`BALL: CHATGPT` esetén azonnal:

- diff + actual evidence review;
- Claude Oracle eredmény összevetése Gemini független mintával;
- hamis PASS/false negative esetén `CHANGES_REQUESTED`, `BALL: CLAUDE`;
- K1 acceptance után K2 inventoryt indít;
- K2 acceptance előtt K3 remediation nem indulhat;
- final release gate-et nem lazítja.

## 11. K4 — FINAL ACCEPTANCE

Csak akkor:
- content parity bizonyított;
- media parity bizonyított;
- link/document parity bizonyított;
- funkciók valódi E2E zöldek;
- visual parity page-family szinten elfogadott;
- GitHub CI zöld;
- security/WCAG gate zöld;
- PR mergeable.

`BALL: USER` csak a valódi végső merge/launch döntésnél lehet.