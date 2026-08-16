# COLLAB.md — www-vmk FINALIZATION protocol

Ez a fájl a www-vmk projekt **egyetlen operatív koordinációs forrása**.

> **Alapszabály:** a felhasználó NEM közvetítő az AI-k között. GitHub commit/branch + ez a fájl jelenti az átadást.

# 1. Üzemmód

**FINALIZATION MODE: ON**

Cél: a jelenlegi release candidate készre vitele és lezárása. Nincs új feature, redesign, kozmetikai homepage-polírozás vagy végtelen új auditkör. Csak bizonyított release-blocker, regresszió vagy félrevezető teszt javítható.

# 2. Kötelező agent-izoláció — HARD RULE

## 2.1 Egy agent = egy branch = egy worktree

**TILOS** két aktív agentnek ugyanazt a Git working tree-t használni.

Kötelező szabály:
- Claude saját worktree-ben dolgozik a `agent/visual-clone-oracle` branchhez kötve.
- Gemini saját worktree-ben dolgozik a `agent/gemini-final-audit` branchhez kötve.
- A közös `/srv/projects/www-vmk` checkoutban aktív párhuzamos munka alatt **TILOS** `git checkout`, `git switch`, szerkesztés vagy olyan művelet, amely más agent working tree-jét megváltoztatja.
- Egy agent soha nem szerkesztheti, resetelheti, stash-elheti vagy branch-válthatja a másik agent worktree-jét.
- Ha egy agent azt érzékeli, hogy shared checkoutban van vagy más agent branchváltása érinti a fájljait, **nem kér felhasználói döntést**: saját worktree-t hoz létre/használ és ott folytatja.
- ChatGPT kizárólag GitHub API/connectoron keresztül dolgozik; nem vált branchet egyik lokális agent-worktree-ben sem.

### Ajánlott elrendezés

```text
/srv/projects/www-vmk                 # bootstrap/shared repo; no parallel editing
/srv/projects/www-vmk-claude          # Claude worktree -> agent/visual-clone-oracle
/srv/projects/www-vmk-gemini          # Gemini worktree -> agent/gemini-final-audit
```

Más path megengedett, ha a worktree fizikailag és Git-szinten izolált. Claude jelenlegi `.claude/worktrees/j2-ci-fix` worktree-je elfogadható.

# 3. Szerepek

## Claude — PRIMARY IMPLEMENTER / critical path
- figyeli az `agent/visual-clone-oracle` branchet;
- `BALL: CLAUDE` esetén felhasználói közvetítés nélkül dolgozik;
- release-blockert implementál és bizonyít;
- saját munkáját nem minősíti végleg VERIFIED-nek;
- kész állapotnál commit + push + `STATUS: READY_FOR_REVIEW`, `BALL: CHATGPT`.

## Gemini — INDEPENDENT AUDITOR
- branch: `agent/gemini-final-audit`;
- eredménye: `docs/GEMINI_FINAL_AUDIT.md`;
- nem szerkeszti a primary branchet és nem váltja Claude worktree-jének branchét;
- P0/P1/P2 release-blockert keres, új scope nélkül.

Gemini audit `2d087c4`: **FINDINGS**, feldolgozva Claude J2 körében:
- F-01 P1 CI orchestration;
- F-02 P2 ContactMessages/NewsletterSubscribers direct REST create;
- F-03 P2 author Media.create.

F-02/F-03 primary branchre portolva `4fdbcda` commitban, célzott élő ellenőrzéssel.

## ChatGPT — ACCEPTANCE / orchestration
- `BALL: CHATGPT` esetén azonnal függetlenül ellenőrzi a GitHub diffet **és a tényleges GitHub Actions eredményt**;
- lokális PASS állítás nem helyettesíti a remote CI evidence-et;
- hard gate-et nem lazít;
- review után GitHubon adja tovább a labdát;
- `BALL: USER` csak valódi végső merge/launch döntéshez.

# 4. VERIFIED baseline

- FIRST-HOP: **VERIFIED** — `MISSING=0`, `BROKEN=0`
- ADMIN/Payload: **VERIFIED**
- Depth-2: **VERIFIED** — `MISSING=0`, `BROKEN=0`
- Full-site H1-H4: **VERIFIED** — `09d3445c7a4e967b2c386061479d7396bde5a950`
- I1 RC hardening: **VERIFIED** — `e5b3fef23289ab88350a9744546376e3a102a9e3`
- `push:false`: kötelező és változatlan
- PR #1: Draft; végső merge külön döntés.

# 5. J2 REVIEW — CHATGPT DECISION

Claude J2 handoff head: `0f30affb64648397a6aa1d29fdc8ee6a70bf543c`.

**REVIEW RESULT: CHANGES_REQUESTED**

**STATUS: IN_PROGRESS**

**BALL: CLAUDE**

## 5.1 J2 CI orchestration: részben jó, de remote gate NEM zárt

ChatGPT a GitHub API-n ellenőrizte a tényleges PR workflow-t:

- Workflow: `VMK CI/CD Pipeline`
- Run: **#103**, id `31953105492`
- Head: `0f30affb...`
- Lint & Type Check: **PASS**
- Vitest Unit & RSC: **PASS**
- Playwright E2E & WCAG job: **FAIL**

A korábbi `ERR_CONNECTION_REFUSED` orchestration hiba valóban megszűnt addig a pontig, hogy Postgres/MinIO/Meilisearch feláll és a séma bootstrap lefut. Viszont a job a **Build application** lépésben bukik, Playwrightig el sem jut.

### Bizonyított remote root cause

GitHub Actions log:

```text
npm run build
Error: Cannot find module 'tailwindcss'
Build failed because of webpack errors
```

A `package.json` szerint `tailwindcss` **devDependency**. A workflow ugyanakkor globálisan `NODE_ENV=production` mellett telepít/buildel, ezért a CI telepítésből hiányzik a build-time dependency.

### J3.1 feladat — CI dependency/build javítás

1. A buildhez szükséges dev dependency-k kerüljenek fel determinisztikusan CI-ben.
2. Preferált irány: lockfile esetén `npm ci --include=dev`, és `NODE_ENV=production` csak ott legyen alkalmazva, ahol runtime/build szemantikailag indokolt; ne okozza a build toolchain kihagyását.
3. Ne mozgasd önkényesen a build toolchaint production dependencies közé csak azért, hogy a workflow zöld legyen, ha tisztább CI-install megoldás van.
4. Push után **várd meg a tényleges GitHub Actions run-t**.
5. Lokális PASS nem elég. A remote `Playwright E2E & WCAG` jobnak ténylegesen el kell jutnia a tesztekig.

# 6. WCAG döntés — nem user blocker

Claude helyesen bizonyította, hogy a referencia `#159097` teal fehér háttéren body/link szövegként kb. **3.84:1**, ezért WCAG AA normál szövegre nem megfelelő.

ChatGPT döntés a finalization scope-on belül:

- **NEM hagyjuk dokumentált kivételként.**
- A referencia teal megmarad brand/accent/border/non-text használatban.
- Body/link szöveghez külön, vizuálisan közeli, **AA-kontrasztos text-link token** használható.
- Ez hozzáférhetőségi javítás, nem redesign.

### J3.2 gate

A meglévő Playwright + axe WCAG 2.2 AA suite a lefedett publikus route-okon **0 nem-waivelt axe violationnel** fusson. Nem szabad skip/disable/threshold-lazítással zöldíteni.

# 7. Tesztminőség — HARD ACCEPTANCE RULE

A projekt korábbi történetében sok zöld ellenőrzés nem bizonyított felhasználói értéket. Ezért a tesztek száma és a `PASS` önmagában **nem acceptance evidence**.

## 7.1 Evidence osztályok

### A — USER-VALUE E2E / acceptance evidence
Csak akkor számít hard gate bizonyítéknak, ha valódi felhasználói vagy admin workflow-t hajt végre és a tényleges üzleti mellékhatást is ellenőrzi.

Példák:
- kapcsolat űrlap → siker → rekord ténylegesen létrejön / adminból kezelhető;
- hírlevél → tényleges perzisztencia;
- teremfoglalás / RSVP / wishbasket → valódi validáció + perzisztencia;
- admin create/edit/publish → publikus frontend ténylegesen változik;
- author médiafeltöltés → valódi upload/doc létrejön;
- anonim/tiltott szerepkör → valóban 403/deny és nincs adatváltozás;
- route parity → nem csak HTTP 200, hanem megfelelő cél/tartalom/funkció.

### B — SUPPORTING TEST
Typecheck, lint, unit, render smoke, HTTP 200 stb. hasznos, de önmagában **nem bizonyítja, hogy a termék működik**.

### C — MISLEADING / INVALID
Olyan teszt, amely zöld lehet úgy, hogy a felhasználói funkció halott, vagy csak implementációs részletet/saját mockot ellenőriz. Ilyen tesztet nem szabad acceptance evidence-ként idézni; javítani, átminősíteni vagy eltávolítani kell.

## 7.2 J3.3 — Final test-effectiveness audit

Claude a végső átadás előtt:
1. listázza a jelenlegi e2e/acceptance teszteket;
2. A/B/C osztályba sorolja őket rövid indoklással;
3. minden C tesztet javít/eltávolít, vagy egyértelműen supporting kategóriára minősít;
4. legalább a release-kritikus workflow-khoz legyen A-osztályú evidence;
5. ne növelje mesterségesen a tesztszámot; **kevesebb, valódi E2E jobb, mint sok látszatteszt**.

# 8. FINAL MERGE-READINESS GATE

Csak akkor adható `BALL: USER`, ha mind igaz:

1. GitHub Actions remote:
   - Lint/Type Check GREEN
   - Unit/RSC GREEN
   - Playwright E2E/WCAG GREEN
2. Playwright ténylegesen elindítja az appot és futtatja a teszteket; nincs infra-skip.
3. WCAG 2.2 AA covered routes: 0 nem-waivelt axe violation.
4. Production build PASS ugyanabban a CI útvonalban.
5. first-hop: `MISSING=0`, `BROKEN=0`.
6. depth-2: `MISSING=0`, `BROKEN=0`.
7. full-site resolver regresszió nincs.
8. security regresszió nincs; Gemini F-01/F-02/F-03 disposition bizonyított.
9. `push:false` változatlan.
10. nincs új P0/P1.
11. A-osztályú user-value E2E evidence lefedi a release-kritikus workflow-kat.
12. PR #1 mergeable és Draft.

# 9. CLAUDE KÖVETKEZŐ ÁTADÁSA

Claude csak akkor adja vissza:

```text
STATUS: READY_FOR_REVIEW
BALL: CHATGPT
```

és rögzítse:
- fix commit SHA-k;
- tényleges GitHub Actions run id + minden releváns job eredménye;
- WCAG végső eredmény;
- A/B/C test-effectiveness audit;
- release-kritikus A-osztályú E2E bizonyítékok;
- build/parity/security regresszió eredmények;
- PR mergeability.

Ha a remote CI piros, a labda marad Claude-nál; nem kell felhasználói közvetítés.
