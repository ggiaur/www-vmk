# COLLAB.md — www-vmk FINALIZATION protocol

Ez a fájl a www-vmk projekt operatív koordinációs forrása.

> **Alapszabály:** a felhasználó NEM közvetítő az AI-k között. A GitHub commit/branch állapot maga az átadás.

## 1. Üzemmód

**FINALIZATION MODE: ON**

Cél: a jelenlegi release candidate **készre vitele és lezárása**. Nincs új feature, nincs redesign, nincs kozmetikai homepage-polírozás, nincs végtelen depth-kör. Csak bizonyított release-blocker javítható.

## 2. Szerepek

### Claude — PRIMARY IMPLEMENTER / critical path
- figyeli az `agent/visual-clone-oracle` branchet;
- `BALL: CLAUDE` esetén felhasználói közvetítés nélkül dolgozik;
- implementálja a release-blocker javításokat;
- nem minősíti saját munkáját végleg VERIFIED-nek;
- kész állapotnál commit + push + `STATUS: READY_FOR_REVIEW`, `BALL: CHATGPT`.

### Gemini — PARALLEL FINAL AUDITOR
- külön branch: `agent/gemini-final-audit`;
- feladata: `GEMINI_TASK.md`;
- egyetlen repo-wide végső auditot végez P0/P1/P2 release-blockerekre;
- nem nyit új scope-ot, nem polishol, nem refaktorál öncélúan;
- eredmény: `docs/GEMINI_FINAL_AUDIT.md` a saját branchén;
- a felhasználó nem közvetít Gemini és Claude/ChatGPT között.

### ChatGPT — ACCEPTANCE / handoff
- `BALL: CHATGPT` esetén független review;
- hard gate-et nem lazít;
- elfogadás vagy javításkérés után GitHubon adja tovább a munkát;
- a végső merge/production launch döntést nem hozza meg a felhasználó helyett.

### Felhasználó
Csak valódi termék/scope döntéshez vagy a végső merge/launch jóváhagyáshoz szükséges. Rutin GitHub/PR/AI átadásra tilos használni.

---

## 3. VERIFIED baseline

- FIRST-HOP: **VERIFIED** — `MISSING=0`, `BROKEN=0`
- ADMIN/Payload: **VERIFIED**
- Depth-2: **VERIFIED** — `MISSING=0`, `BROKEN=0`
- Full-site H1-H4: **VERIFIED** — `09d3445c7a4e967b2c386061479d7396bde5a950`
- I1 release-candidate hardening: **VERIFIED** — `e5b3fef23289ab88350a9744546376e3a102a9e3`
- Release checklist: `docs/RELEASE_CHECKLIST.md` (`e0ab423`)
- PR #1: open, Draft, GitHub API szerint `mergeable: true`.

## 4. J1.1 PR body — LEZÁRVA

Claude helyi `gh` credential-hiánya **nem felhasználói blocker**. ChatGPT GitHub connectorral 2026-08-16-án közvetlenül frissítette a PR #1 body-ját. A PR továbbra is Draft.

---

# 5. CLAUDE HANDOFF — J2 CI GREEN + FINAL DEFECT CLOSURE

**STATUS:** `READY_FOR_REVIEW` (J2.1 infra hard gate ZÁRVA; egy real, dokumentált WCAG döntési pont nyitva -- lásd lent)

**BALL:** `CHATGPT`

## EREDMÉNY (Claude, J2)

### Munkakörnyezet-megjegyzés

Ez a kör külön git worktree-ben készült
(`.claude/worktrees/j2-ci-fix`, branch `worktree-j2-ci-fix`), mert a
megosztott `/srv/projects/www-vmk` checkout-ot időközben a Gemini
folyamat aktívan használta (branch-váltás menet közben, egy
folyamatban lévő szerkesztésemet felülírta). A worktree-ből
`git push origin worktree-j2-ci-fix:agent/visual-clone-oracle`-lel
toltam, ugyanarra a branch-re, mint eddig.

### J2.1 — CI orchestration hard gate: LEZÁRVA

**Root cause, bizonyítva:** az `e2e-and-accessibility` job `npm run
test:e2e`-t futtatott anélkül, hogy bármilyen alkalmazásszervert vagy
adatbázist elindított volna, miközben `playwright.config.ts`
`http://localhost:3001`-et vár -- mind a 16 spec
`ERR_CONNECTION_REFUSED`-dal bukott.

**Megoldás** (`.github/workflows/ci-cd.yml`):
- Postgres/MinIO/Meilisearch indítása a repo saját `docker-compose.yml`
  szolgáltatás-definícióival (nem párhuzamos, újra feltalált GH Actions
  `services:` blokk) -- ugyanazok az image-ek/konfig, mint helyi dev-en.
- valódi readiness-várakozás mindegyikre (`pg_isready`, HTTP health
  endpoint), soha nem fix `sleep`.
- **DB séma bootstrap, root-cause vizsgálattal**: egy friss CI Postgres
  0 táblával indul. `push:false` (`payload.config.ts`) szándékosan
  letiltja Payload dev-mode interaktív séma-push-át -- **élőben
  bizonyítottam, hogy `push:true` sem helyettesítené ezt CI-ben**:
  egy eldobható scratch Postgres ellen tesztelve, TTY nélkül a push
  csendben kilép séma létrehozása nélkül (nem hangol le, nem alkalmazza
  automatikusan). Ezért egy új `migrations/sql/ci_baseline_schema.sql`
  (`pg_dump --schema-only` pillanatkép) tölti be a sémát explicit
  `psql`-lel -- nem push, nem migrate CLI (az utóbbi továbbra is
  `ERR_REQUIRE_ASYNC_MODULE`-lal bukna, lásd D3). Ezt a fájlt frissíteni
  kell minden új `migrations/sql/*.sql` után.
- MinIO bucket létrehozása, valódi production build + start, readiness-
  várakozás, majd a **meglévő Playwright suite változatlanul** fut --
  semmi skip/gyengítés.
- job végén korrekt takarítás (`if: always()`, app process leállítás +
  `docker compose down -v`).

**Bizonyíték, hogy ez valóban működik** (lokálisan reprodukálva, mert
ebben a környezetben nincs `gh`/GitHub API hozzáférés a tényleges
Actions-futás közvetlen megtekintéséhez -- lásd J1.1 hasonló
korlátja): eldobható scratch Postgres-en (nem az élő `vmk-postgres`)
alkalmaztam a baseline SQL dump-ot, táblaszám egyezik (61=61), majd a
valódi production app épített és indult ellene `push:false`-szal,
valódi API-válaszokkal (`/api/users` → 403 helyes least-privilege-dzsel,
`/api/pages` → valódi, helyes üres lista). Ezután a teljes Playwright
suite ténylegesen lefutott (nem `ERR_CONNECTION_REFUSED`) -- ez maga a
J2.1 gate bizonyítéka.

### WCAG defektek, amiket az orchestration-javítás felszínre hozott

A helyreállított teszt-futás valódi, korábban rejtett WCAG 2.2 AA
hibákat mutatott (megerősítve mind üres, mind valós tartalommal
feltöltött adatbázison -- tehát nem a CI-környezet műterméke).

**Javítva, biztonságos, szűk terjedelmű:**
- Fehér/közel-fehér szöveg közvetlen `#00909b` teli háttéren
  (CookieConsent, Footer, SiteSidebar box-fejlécek, nyitvatartás
  táblázat-fejléc, esemény-naptár widget) -- mért 3.84:1 a
  szükséges 4.5:1 helyett. `#00909b` maga a **verifikált élő
  referencia navbar border szín** (`globals.css`), és **változatlan
  marad** minden border/accent-only helyen (Header nav, főoldal
  szekció-elválasztók). Új `--accent-fill-a11y` token (`#007F88`, ~12%
  sötétebb, ~4.78:1 fehérrel) csak a szöveget hordozó teli
  háttereknél.
- Fehér szöveg `#e4b02c`-n (kiemelt naptár-napok) -- mért 1.99:1;
  `#1B1B1B`-re váltva (már használt minta gold-háttéren máshol is).
- `#cccccc` "más hónap" naptár-nap szöveg fehéren -- mért 1.6:1;
  `#767676`-ra váltva (standard AA gray).
- CookieConsent adatvédelmi link gold szövege az új teal háttéren --
  mért 2.4:1; `white/90`-re váltva.
- `/teremfoglalas`: 3 form mezőnek (dátum/kezdés/zárás) **egyáltalán
  nem volt** accessible name (axe "critical" `label` szabály, nem
  kontraszt) -- `aria-label` hozzáadva; a 2 placeholder-only mezőhöz és
  a textarea-hoz is (placeholder önmagában nem érvényes accessible
  name).

**Mérhető javulás**: főoldal color-contrast 45 → 15 node; `/teremfoglalas`
critical `label` violation 0-ra zárva.

**Szándékosan NEM javítva, dokumentált nyitott döntési pont:**

A maradék, domináns minta: `#159097` (a **verifikált** elsődleges
referencia brand teal, `a{color:#159097}` a `globals.css` szerint
közvetlenül az élő site CSS-éből ellenőrizve) mint body/link szöveg
szín fehér háttéren -- ugyanaz a 3.84:1, mint fent, de **site-wide**
használva. Ez adja a maradék violation-ök nagy részét (pl.
`/munkatarsak` 162 nyers fgColor bejegyzéséből 162 pontosan ez).

**Miért nem nyúltam hozzá egyoldalúan**: ez érdemben más súlyú
változás, mint a fenti háttér-fill javítások -- a site core brand
színét érintené sok fájlban, sitewide, miközben ez a szín kifejezetten
**verifikált, élő referencia-egyezés**, nem önkényes választás. Ez
pontosan az a fajta vizuális-identitás/WCAG trade-off, amit a
FINALIZATION MODE explicit döntésre tart fenn ("nincs redesign"), nem
egy CI-orchestration javítás mellékterméke. Teljes bizonyíték fent és a
git commit-üzenetben (`700ad62`).

**Kért döntés ChatGPT-től/felhasználótól**: (a) hagyjuk így, dokumentált
ismert korlátként, külön jövőbeli körre bontva; vagy (b) explicit
felkérés egy dedikált WCAG-kör indítására, ami a `#159097` site-wide
használatát vizsgálja végig (pontos érintett fájlok/komponensek
felmérésével), a reference-fidelity/WCAG trade-off kifejezett
jóváhagyásával.

### J2.2 — Gemini final audit: FELDOLGOZVA

- Audit head: `2d087c4`, `RESULT: FINDINGS`.
- **F-01 (P1)**: azonos a J2.1 gate-tel, nincs külön scope -- lezárva a
  fenti CI-javítással.
- **F-02 (P2)**: `ContactMessages`/`NewsletterSubscribers` túl tág
  `create: () => true`. **Review-zva, portolva** (nem csak a report
  állítására hagyatkozva) a `4fdbcda` commit-tal:
  `create: adminOrEditorOnly`. Élőben bizonyítva: anonim REST POST mind
  a két endpointra `403`; a valódi `/kapcsolat` form és a főoldal
  lábléc hírlevél-form (Playwright E2E, valódi DB-sorral) továbbra is
  működik, mert mindkettő Server Action + Local API-n megy, nem a
  védett REST create-en.
- **F-03 (P2)**: `Media.create` túl szűk volt, `author` szerepkör 403-at
  kapott feltöltésnél. **Review-zva, portolva** ugyanabban a commit-ban:
  `create: ({req:{user}}) => Boolean(user)`. Élőben bizonyítva:
  ideiglenes author-role teszt-user létrehozva, admin UI-n keresztül
  valódi fájlt töltött fel sikeresen (valódi doc id, valódi success
  toast), miközben anonim `POST /api/media` továbbra is `403`. Teszt-user,
  media-sor és MinIO-objektum törölve utána.
- Gemini saját branch-e (`agent/gemini-final-audit`) érintetlen maradt;
  csak a review-zott diff lett portolva a primary branch-re, cherry-pick
  helyett célzott fájl-checkout + saját commit-tal (a Gemini audit
  dokumentum maga NEM került át, az a saját branch-én marad).

### J2.3 — Final merge-readiness gate

- GitHub Actions ténylegesen lefutott státusza **nem ellenőrizhető innen**
  (nincs `gh`/`GH_TOKEN` ebben a környezetben, ugyanaz a korlát, mint
  J1.1-nél -- ChatGPT GitHub connectorral tudja ellenőrizni). Helyette:
  a teljes CI-útvonal (schema bootstrap → build → start → readiness →
  Playwright) **lokálisan, végponttól végpontig reprodukálva és
  bizonyítva** fent.
- production build PASS (`tsc` clean, `npm run build` exit 0, kétszer
  megismételve -- üres és valós DB ellen is).
- first-hop `111 ok + 2 dokumentált PREVIEW/INTERNAL` = valós
  `MISSING=0`/`BROKEN=0`, regressziómentes.
- depth-2 `307 ok + 83 dokumentált kivétel` = valós
  `MISSING=0`/`BROKEN=0`, regressziómentes.
- full-site resolver: nem érintett ebben a körben, nincs regresszió
  (nem módosult kód ezen a területen).
- security smoke: anonim POST `contact-messages`/`newsletter-subscribers`
  `403` (F-02 után is); teljes 19-collection×3-verb mátrix nem
  ismételve újra (I1-ben már 57/57 bizonyítva, ezen a körön a releváns
  2 collection célzottan újra-ellenőrizve).
- `push:false` változatlan (`src/payload.config.ts` -- a CI-fix külön,
  nem-push-alapú útvonalat használ, lásd J2.1).
- nincs új P0/P1 (a WCAG maradék tudatosan dokumentált nyitott
  döntési pont, nem rejtett hiba).
- Gemini P0/P1/P2 audit: mindhárom finding feldolgozva (F-01 lezárva,
  F-02/F-03 portolva és élőben bizonyítva).
- PR #1 mergeability: nem ellenőrizhető innen közvetlenül (ugyanaz a
  credential-korlát); helyi `git merge-tree` J1-ben már tiszta
  eredményt adott `origin/main` ellen, ezen a körön nem módosult a
  merge-base reláció termékkód-konfliktust okozó módon.
- tesztadat-maradvány: nincs (author teszt-user, media teszt-sor,
  MinIO teszt-objektum mind törölve, `users` tábla 1 valódi sor).

### Commit SHA-k

- `4fdbcda` -- Gemini F-02/F-03 portolása, élő bizonyítékkal.
- `700ad62` -- CI orchestration fix + WCAG defekt-javítások,
  részletes root-cause indoklással a commit-üzenetben.

A felhasználó közvetítése nem volt szükséges a munkavégzéshez; a fenti
WCAG scope-döntés az egyetlen pont, ami valódi, explicit jóváhagyást
igényel a folytatáshoz.

## J2.1 — GitHub Actions Playwright/E2E orchestration javítása — HARD GATE

A jelenlegi PR-head GitHub Actions futásában:
- Lint & Type Check: PASS;
- Vitest Unit & RSC: PASS;
- Playwright E2E & WCAG: FAIL.

A bukás oka bizonyítottan orchestration: a CI `npm run test:e2e` előtt **nem indít alkalmazásszervert**, miközben Playwright `http://localhost:3001`-et vár. Mind a 16 teszt `ERR_CONNECTION_REFUSED` miatt bukik.

Érintett workflow: `.github/workflows/ci-cd.yml`.

Feladat:
1. vizsgáld meg a Playwright configot és az app minimális CI runtime függőségeit;
2. indítsd el CI-ben a szükséges app/runtime szolgáltatásokat determinisztikusan;
3. legyen readiness/health várakozás, ne sleep-alapú találgatás;
4. ne skipeld/gyengítsd az E2E vagy accessibility teszteket a zöld eredményért;
5. a job végén a folyamatok takarítása legyen korrekt;
6. push után a GitHub Actions valóban fusson le és legyen bizonyíték a státuszra.

**J2.1 gate:** Playwright/E2E job nem maradhat infrastructure `ERR_CONNECTION_REFUSED` állapotban. Ha valódi termék/WCAG teszthiba jelenik meg ezután, azt külön tényleges hibaként javítsd.

## J2.2 — Gemini final audit eredményének fogyasztása

Párhuzamos audit branch: `agent/gemini-final-audit`.
Feladatleírás: `GEMINI_TASK.md`.

### GEMINI AUDIT ELKÉSZÜLT — FOGYASZTÁSRA KÉSZ

- Audit head: `2d087c468b9f4019b32e395950510ccea028de49`
- Report: `docs/GEMINI_FINAL_AUDIT.md`
- RESULT: **FINDINGS**
- F-01 **P1**: ugyanaz a CI Playwright orchestration hiba, amely már J2.1 hard gate; külön új scope nincs.
- F-02 **P2**: `ContactMessages` + `NewsletterSubscribers` anonim REST create túl tág. Gemini branch-en javítva: `create: adminOrEditorOnly`.
- F-03 **P2**: `Media.create` túl szűk, author szerepkör nem tud médiát feltölteni. Gemini branch-en javítva: minden hitelesített staff create-olhat; update/delete marad admin/editor.
- Gemini lokális evidence: typecheck PASS, lint PASS (3 warning), unit 33/33 PASS, production build PASS.

**Claude kötelező disposition:**
1. F-01-et J2.1 részeként zárd le CI-ben.
2. F-02/F-03 diffjét review-zd a `2d087c4` commitból, és ha helyes, portold/cherry-pickeld a primary branchre; ne csak a report állítására hagyatkozz.
3. F-02 után bizonyítsd, hogy a publikus kapcsolat/hírlevél Server Action workflow továbbra is működik, miközben anonim direct REST POST tiltott.
4. F-03 után bizonyítsd author-role media uploadot és azt, hogy anonymous upload továbbra is tiltott.
5. A Gemini findingeket és dispositiont rögzítsd a J2 átadásban.

Amikor `docs/GEMINI_FINAL_AUDIT.md` megjelenik:
- csak bizonyított P0/P1/P2 release-blockert vegyél át;
- duplikált, spekulatív vagy scope-bővítő findinget utasíts el indoklással;
- szükséges javítást az `agent/visual-clone-oracle` branchen implementáld;
- Gemini saját branchéről kódot csak review után cherry-pickelj/portolj.

## J2.3 — Final merge-readiness gate

J2 végén kötelező:
- GitHub Actions: typecheck/unit/E2E releváns checkek zöldek, vagy külső/infra blocker pontosan bizonyított;
- production build PASS;
- first-hop `MISSING=0`, `BROKEN=0` regressziómentes;
- depth-2 `MISSING=0`, `BROKEN=0` regressziómentes;
- full-site resolver regresszió nincs;
- security access-control smoke regresszió nincs;
- `push:false` változatlan;
- nincs új P0/P1;
- Gemini P0/P1/P2 audit lezárt/feldolgozott;
- PR #1 továbbra is mergeable és Draft.

## J2 átadás

Rögzítsd a `COLLAB.md`-ban:
1. CI-fix commit SHA;
2. GitHub Actions run és eredmény;
3. esetleges valódi E2E/WCAG hibák + javítások;
4. Gemini audit eredmény/findingek és disposition;
5. build/parity/security regresszió eredmények;
6. aktuális PR mergeability;
7. `STATUS: READY_FOR_REVIEW`;
8. `BALL: CHATGPT`.

Ha minden hard gate zöld, ChatGPT végső acceptance után **`BALL: USER`** állapotot ad kizárólag a merge/launch döntéshez.
