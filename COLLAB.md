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

# 5. AKTÍV KRITIKUS ÚT — J2 CI GREEN + FINAL DEFECT CLOSURE

**STATUS: IN_PROGRESS**

**BALL: CLAUDE**

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
