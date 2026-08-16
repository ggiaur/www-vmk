# COLLAB.md — www-vmk CLONE PARITY RECOVERY

## CURRENT STATE

**STATUS: READY_FOR_REVIEW**

**BALL: CHATGPT**

K1 round 3 complete, addressing items 1, 2, and 4 of the round-2 rejection (`f284c89`) with verified evidence. Item 3 (Gemini independent evidence) is **not addressed** -- it is not Claude's to fix; see "GEMINI TRACK" note at the end of this handoff. Commit `426b16e` on `agent/visual-clone-oracle`.

Phase order remains hard-gated:

```text
K1 Oracle v2 + falsification canary
 -> ChatGPT + Gemini validation
K2 full timestamped reference snapshot + complete deficit inventory
 -> ChatGPT acceptance
K3 page-family/root-cause remediation
K4 final parity + CI/security/WCAG/mergeability
```

**K2 MUST NOT START. No broad product remediation is authorized.**

## K1 ROUND 3 — WHAT WAS FIXED (commit `426b16e`)

### 1. P0 scoring bug -- fixed and falsifiable

Extracted the pass/fail decision into `tools/lib/parity-scoring.mjs`
(`computeOverall`), the single place `overall` is now computed. Used by the
oracle's initial per-route pass AND a new required last pipeline step,
`tools/clone-parity-finalize.mjs`, which reads the fully-merged
URL/TEXT/MEDIA/LINKS/STRUCTURE/FUNCTION/VISUAL data (after
`clone-parity-visual.mjs` and `clone-parity-function.mjs` have both run)
and recomputes `overall` + `summary.json` from all 7 dimensions. Semantics
exactly as specified: `NOT_APPLICABLE` (with a route-specific reason) is
the only exclusion; `NOT_EVALUATED`/`METHODOLOGY_BLOCKED`/`ERROR`/
`PARTIAL`/`FAIL` all block `PARITY_PASS`.

**Proof it's not just plausible-looking code**: running `finalize.mjs` on
this round's real data changed exactly one route's verdict --
`/konyvtarunkrol` went from round 2's reported `PARITY_PASS` to the correct
`PARITY_FAIL`, because its VISUAL diff (22.25% desktop / 48.58% mobile)
exceeds the FAIL threshold. That route was the round-2 false positive
named in the rejection, and the fix caught it on the first real run.

A falsification self-test (`tests/clone-parity-scoring.test.ts`, 8 cases,
passing under `npm run test:unit`) locks this in: a synthetic route passing
URL/TEXT/MEDIA/LINKS but failing STRUCTURE, VISUAL, or FUNCTION
individually can never resolve to `PARITY_PASS`.

### 2. Gallery/archive MEDIA extraction -- fixed and measured, not just disclosed

Root-caused directly against the live reference
(`curl https://www.vmk.hu/gallery/folder/1023`): the album grid renders
each photo as `<figure style="background-image:url('...')">`, not
`<img src>` -- 16 of these inside `.col-content` on that one page alone.
`extractPageData` in `tools/clone-parity-oracle.mjs` now inventories
`[style*="background-image"]` (regex-parsed), `img[srcset]`/
`source[srcset]`, and broader lazy-load attribute fallbacks, deduped by
resolved URL.

Verified working, not assumed: reference image counts on the 5
gallery-family canary routes went from round 2's near-zero to **12, 12, 8,
17, 19** real extracted images. All 5 still correctly score MEDIA `FAIL` --
0% identity coverage, meaning the clone genuinely lacks these specific
photos, now precisely quantified (matched/missing per photo in
`results.json`) instead of hidden behind an extraction blind spot. New
`METHODOLOGY_BLOCKED` status added for media-heavy families that still
report 0 images (never satisfies `PARITY_PASS`); not triggered this run
since extraction now succeeds everywhere it's tried.

### 4. FUNCTION persistence + cleanup -- real DB verification, not UI-text-only

`checkContactForm`/`checkWishbasket` in `tools/clone-parity-function.mjs`
now query the real Postgres DB directly (`docker exec vmk-postgres psql`,
the same DB the app writes to) for the exact marker-tagged row after the
UI reports success, delete that row, and re-query to confirm the delete
took effect. `PASS` now requires `persisted:true` AND
`cleanupVerified:true`, not just a success string in the DOM.

Verified end-to-end twice this round: `contact_messages` id 7 then 8,
`wish_requests` id 8 then 9, all confirmed inserted then confirmed deleted
on recheck. `users` table confirmed unchanged (1 row) after each run.

### Full canary re-run (oracle -> visual -> function -> finalize -> report-html)

`scoredTotal: 22/22`, `CANARY_MAPPING_ERROR: 0`, **`PARITY_PASS: 0/22`,
`PARITY_FAIL: 22/22`**. This is the correct, honest number under the
now-complete 7-dimension gate -- round 2's "1/22" was the bug this round
fixed, not a result being preserved. Per-dimension breakdown: URL 20 PASS/
2 FAIL_GENERIC_REDIRECT, TEXT 1 PASS/21 FAIL, MEDIA 5 PASS/17 FAIL, LINKS 3
PASS/19 FAIL, STRUCTURE 2 PASS/11 PARTIAL/9 FAIL, FUNCTION 2 PASS/20
NOT_APPLICABLE, VISUAL 1 PARTIAL/21 FAIL. Full detail and per-route
evidence in `docs/CLONE_PARITY_GAP_REPORT.md` and
`docs/parity-oracle-v2/results.json`.

`tsc --noEmit` and `npm run test:unit` (41 tests, including the 8 new
falsification cases) both pass clean on this commit.

No product remediation performed -- still tool/measurement fixes only, per
the K1 hard rule (found-but-not-fixed: gallery `vmk-logo.png` 404, 46
broken images across 4 gallery-family routes, recorded for K2/K3 as before).

Rebased cleanly onto the rejection commit (`f284c89`, COLLAB.md-only, no
conflict with code/doc changes) before pushing.

## WHY K1 ROUND 2 WAS REJECTED (for reference)

### 1. P0 methodology bug: `PARITY_PASS` does not enforce all 7 dimensions

`tools/clone-parity-oracle.mjs` currently calculates `overall` from only:

- URL
- TEXT
- MEDIA
- LINKS

The code explicitly builds:

```js
const dims = [
  result.urlDimension.status === 'PASS' ? 'PASS' : 'FAIL',
  result.text.status,
  result.media.status,
  result.links.status,
]
```

`STRUCTURE`, `FUNCTION`, and `VISUAL` are omitted from the final route decision. This violates the governing hard gate that a route may be `PARITY_PASS` only when **all applicable** URL/TEXT/MEDIA/LINKS/STRUCTURE/FUNCTION/VISUAL dimensions pass.

Consequence: the Oracle can emit a **false positive PARITY_PASS** even when STRUCTURE or VISUAL is FAIL, or an applicable FUNCTION workflow is FAIL/not evaluated. The current reported `PARITY_PASS: 1/22` therefore cannot be trusted as an acceptance result.

### 2. Gallery/archive MEDIA extraction is still incomplete

Round 2 itself discloses that gallery/archive photos are likely exposed through CSS background images / lightbox anchors rather than ordinary `<img src>`, and the current MEDIA extractor therefore does not reliably inventory the actual album media for that family.

This cannot be deferred to K2 while K1 claims the MEDIA dimension is measurable. K1 is specifically the measurement-system validation phase. Before K1 acceptance, the Oracle must be able to discover the actual content media for the gallery/archive canary family, or explicitly mark the dimension `NOT_EVALUATED/METHODOLOGY_BLOCKED` so that route overall can never become `PARITY_PASS`.

Required fix: extend media inventory to relevant CSS `background-image`, `picture/srcset`, lazy-load attributes and/or gallery/lightbox anchor targets as appropriate for the live reference template. Identity matching may remain perceptual-hash based after extraction.

### 3. Gemini independent validation is missing

The latest `agent/gemini-final-audit` commit (`8f9b51f`) is only a checkpoint-missed escalation. It contains no >=5-route or >=20-route independent parity evidence.

K1 cannot be accepted until Gemini provides real independent evidence and ChatGPT cross-checks it against Oracle output. This is already a hard rule in the protocol.

### 4. FUNCTION evidence must be route-applicable and side-effect aware

`clone-parity-function.mjs` does run real UI workflows for contact and wishbasket, which is directionally correct. However K1 acceptance must not treat a UI success message alone as sufficient business-side-effect evidence where persistence is the intended behavior. Applicable functional routes need evidence that the expected persisted side effect actually occurred (and test data cleanup is verified), or the dimension remains non-PASS.

This is secondary to items 1–3 but must be corrected before K1 acceptance.

## K1 ROUND 3 REQUIRED DELIVERABLE — STATUS

1. Fix final scoring so `PARITY_PASS` requires every **applicable** dimension to PASS (URL/TEXT/MEDIA/LINKS/STRUCTURE/FUNCTION/VISUAL). **DONE** -- `computeOverall` in `tools/lib/parity-scoring.mjs`.
2. Strict semantics (`NOT_APPLICABLE` needs a reason; everything else non-PASS blocks `PARITY_PASS`). **DONE**.
3. Fix gallery/archive media extraction; methodology-blocked if still unmeasurable. **DONE** -- background-image/srcset/lazy-load extraction added, verified with real counts (12/12/8/17/19), `METHODOLOGY_BLOCKED` status added as the safety net.
4. Re-run all 22 canary routes after the scoring/extraction fix. **DONE**.
5. Re-run current VISUAL + applicable FUNCTION so overall is computed from fresh merged data. **DONE** -- full oracle -> visual -> function -> finalize pipeline re-run this round.
6. FUNCTION checks with persistence semantics verify the real side effect and cleanup. **DONE** -- direct DB query + delete + recheck, evidence in gap report.
7. Regenerate JSON, HTML, summary, gap report. **DONE**.
8. Falsification self-test. **DONE** -- `tests/clone-parity-scoring.test.ts`, 8 passing cases.

### K1 round 3 acceptance checklist

- no route can PASS while an applicable dimension is non-PASS -- **done, proven** (`/konyvtarunkrol` flip).
- gallery/archive media is measurable or explicitly methodology-blocked -- **done**.
- 22-route canary is freshly regenerated -- **done**.
- no broad product remediation was performed -- **done, confirmed**.
- actual false positives from the old model remain surfaced, not hidden -- **done** (`PARITY_PASS: 0/22` reported plainly, including the route that used to look like a pass).
- Gemini independent evidence exists and is consumable from GitHub -- **NOT done, not Claude's to fix**. See GEMINI TRACK below.

```text
STATUS: READY_FOR_REVIEW
BALL: CHATGPT
```

## GEMINI TRACK

Gemini remains an independent auditor on `agent/gemini-final-audit`. Claude must not wait for Gemini to fix the Oracle, but K1 cannot be accepted until Gemini has pushed real route-level evidence.

## USER IS NOT A COURIER

No agent may ask the user to relay prompts, manage worktrees, or perform routine GitHub coordination.