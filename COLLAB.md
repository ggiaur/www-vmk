# COLLAB.md — www-vmk CLONE PARITY RECOVERY

Ez a repository egyetlen operatív koordinációs forrása.

> A felhasználó NEM közvetítő az AI-k között. GitHub commit/branch + ez a fájl jelenti az átadást.

## 1. AKTUÁLIS CÉL

**CLONE PARITY RECOVERY: ON**

A cél a jelenlegi `https://www.vmk.hu/` nyilvános magyar oldalának tartalmilag, médiában, linkekben, funkcióban és megjelenésben veszteségmentes modern klónja.

A korábbi FIRST-HOP / Depth-2 / Full-site `VERIFIED`, `MISSING=0`, `BROKEN=0` állítások **NEM clone-parity bizonyítékok**. Azok route-coverage történeti adatok בלבד.

A jelenlegi branch **NEM release candidate**, amíg a valódi clone parity nincs mérve és lezárva.

## 2. KÖTELEZŐ MUNKASZERVEZÉS

**1 agent = 1 branch = 1 worktree.**

- Claude: primary implementer, saját worktree, branch `agent/visual-clone-oracle`.
- Gemini: independent auditor, saját worktree, branch `agent/gemini-final-audit`.
- Shared `/srv/projects/www-vmk` checkoutban párhuzamos munka alatt tilos branch-váltás/szerkesztés.
- ChatGPT csak GitHub connectoron keresztül koordinál és review-zik.
- Sem Claude, sem Gemini nem kérheti a felhasználótól, hogy promptot vigyen át, branch/worktree konfliktust oldjon meg vagy rutinszerű GitHub műveletet végezzen.

## 3. MIÉRT VONTUK VISSZA A KORÁBBI PARITY-T

A régi ellenőrzés hamis pozitívokat engedett át:

- `HTTP 200 + H1 + szószám` alapján is lehetett `CLONED`;
- a text similarity word-set/Jaccard alapú volt, nem sorrendtartó main-content összevetés;
- képeknél/linkeknél csak darabszámot mért, nem identitást/célt/hibát;
- 1626 gallery/archive route jelentős része generikus `/galeria` fallbacket kapott valódi 1:1 fotó/tartalom migráció nélkül;
- route-mátrix PASS nem volt kötelezően összekötve visual/content/media/link PASS-szal.

Ezért a clone-parity acceptance modell újraépítendő.

## 4. CLONE PARITY ORACLE v2 — HARD GATE

Egy route csak akkor lehet `PARITY_PASS`, ha minden alkalmazható dimenzió PASS:

1. **URL** — referencia és klón státusz/final URL; generikus detail→lista redirect nem parity.
2. **TEXT** — `main` tartalom sorrendtartó összevetése; reference meaningful text coverage >= 99%; headings/listák/táblák/metaadatok is.
3. **MEDIA** — konkrét tartalmi képek/galériaelemek inventory + tartalom-alapú megfeleltetés; broken image FAIL; reference media coverage 100% kivéve review-zott dekoratív kivétel.
4. **LINKS/DOCS** — anchor+href+típus semantic parity; belső/külső/mailto/tel/PDF/download; clone target health; broken link FAIL.
5. **STRUCTURE** — headings, paragraph/list/table/form/gallery/card/document blokkok.
6. **FUNCTION** — ahol releváns valódi E2E: search, kapcsolat, hírlevél, teremfoglalás, registration, wishbasket, galéria detail, admin publish→public, PDF download.
7. **VISUAL** — desktop 1440 + mobile 390 reference/local screenshot diff; magas eltérés nem söpörhető félre route/content smoke miatt.

A régi word-count, word-set/Jaccard, imageCount/linkCount, HTTP-200-only logika **nem acceptance evidence**.

## 5. K1 — CLAUDE AKTUÁLIS FELADATA

**STATUS: IN_PROGRESS**  
**BALL: CLAUDE**

### PRIORITÁS MOST

**Kizárólag Clone Parity Oracle v2 + false-positive canary.**

A CI/WCAG korábbi javításait meg kell őrizni, de a clone-parity mérés elkészültéig **nem téríthetik el a fő munkát**. A jelenlegi remote CI külön ismert mellékszál: `npm ci` azért bukik, mert `package-lock.json` nincs szinkronban (`yaml@2.9.0` hiányzik). Ezt később gyorsan zárni kell, de NEM helyettesítheti K1-et.

### Claude kötelező deliverable

1. Implementáld az Oracle v2-t JSON + HTML riporttal.
2. Minden route-nál külön státusz: `URL / TEXT / MEDIA / LINKS / STRUCTURE / FUNCTION / VISUAL`.
3. Futtass legalább 20 tudatosan vegyes canary route-ot:
   - `/`;
   - >=5 aktuális news/event detail;
   - >=5 static/institutional;
   - >=3 branch/department;
   - `/gallery` + >=3 konkrét gallery/detail/archive;
   - `/wishbasket`;
   - >=1 PDF/document-heavy oldal.
4. Készíts `docs/CLONE_PARITY_GAP_REPORT.md`-t konkrét hiányzó szövegekkel, képekkel, linkekkel/PDF-ekkel, strukturális és vizuális eltérésekkel.
5. Kvantifikáld a korábbi 1626 gallery/archive család valódi tartalmi/média deficitjét; generikus `/galeria` redirect nem PASS.
6. Root-cause/page-family megoldást tervezz; ne route-onként kézi hackeket.

### EXECUTION CADENCE — KÖTELEZŐ

Ez nem státuszszínház, hanem annak bizonyítása, hogy a munka ténylegesen halad.

- **AZONNAL kezdd K1-et.**
- Legfeljebb **30 percen belül** legyen az első technikai checkpoint push: Oracle v2 skeleton/részfunkció vagy legalább 5-route valódi canary output. Puszta prose/status commit nem elég.
- Ezután minden kb. **30–45 perc aktív munka** után legyen új, tényleges evidence checkpoint, amíg K1 kész nincs.
- Ha blocker van, ne állj meg: pushold a reprodukálható blockert, jelöld `BLOCKED`-ként, és folytasd azt a K1-részt, amely függetlenül végezhető.
- Ne kérj felhasználói döntést technikai részlethez.
- Ne add vissza a labdát félkész riporttal.

### K1 acceptance

Csak akkor:

- Oracle v2 valóban kimutat korábbi hamis `CLONED` eredményeket;
- >=20 route canary elkészült;
- mind a 7 dimenzió külön mérhető;
- hiányzó képek és hibás/hiányzó linkek/PDF-ek konkrétan szerepelnek;
- `docs/CLONE_PARITY_GAP_REPORT.md` elkészült;
- nincs gate-lazítás azért, hogy több PASS legyen.

Átadás csak ekkor:

```text
STATUS: READY_FOR_REVIEW
BALL: CHATGPT
```

## 6. GEMINI PÁRHUZAMOS SZÁL

Gemini külön worktree-ben független canary parity auditot végez a `GEMINI_TASK.md` alapján. Claude nem vár Geminire az Oracle v2 megépítésével. Gemini sem vár Claude kész Oracle-jére: kézi/reference evidence-del már most képes false-positive hibákat feltárni.

## 7. CHATGPT FELADATA

`BALL: CHATGPT` esetén azonnal:

- ellenőrzi a diffet és a riportokat;
- összeveti Claude Oracle eredményét Gemini független mintájával;
- hamis PASS esetén `CHANGES_REQUESTED` + `BALL: CLAUDE`;
- csak valódi parity bizonyítás után enged K2/K3/K4 felé.

## 8. UTÁNA

- **K2:** teljes reference inventory és deficit-kvantifikálás.
- **K3:** page-family/root-cause parity closure, prioritás: current first-hop → depth-2 → aktuális content → gallery/media/docs → valódi legacy content.
- **K4:** final acceptance: content/media/link/function/visual parity + CI/security/WCAG + mergeability.

`BALL: USER` csak a valódi végső merge/launch döntésnél lehet.