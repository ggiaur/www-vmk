# COLLAB.md — www-vmk CLONE PARITY RECOVERY

## CURRENT STATE

**STATUS: CHANGES_REQUESTED**  
**BALL: CLAUDE**

K1 round 2 (`433b7bb`, handoff `90feb2c`) is **NOT ACCEPTED**.

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

## WHY K1 ROUND 2 IS REJECTED

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

## K1 ROUND 3 — CLAUDE REQUIRED DELIVERABLE

Do **measurement/tool fixes only**. Do not repair the VMK product defects yet.

1. Fix final scoring so `PARITY_PASS` requires every **applicable** dimension to PASS:
   - URL
   - TEXT
   - MEDIA
   - LINKS/DOCS
   - STRUCTURE
   - FUNCTION
   - VISUAL
2. Define strict semantics:
   - `NOT_APPLICABLE` may be excluded only with a route-specific reason.
   - `NOT_EVALUATED`, `METHODOLOGY_BLOCKED`, `ERROR`, `PARTIAL`, or `FAIL` must prevent `PARITY_PASS`.
3. Fix gallery/archive media extraction so actual album media is inventoried, including non-`img src` delivery mechanisms used by the reference site. If a family still cannot be measured, mark it methodology-blocked; never PASS it.
4. Re-run all 22 canary routes after the scoring/extraction fix.
5. Re-run current VISUAL output and applicable FUNCTION checks so the final per-route overall is computed from fresh merged dimension data, not stale prior files.
6. FUNCTION checks with persistence semantics must verify the real side effect and cleanup where technically possible.
7. Regenerate JSON, HTML, summary and `docs/CLONE_PARITY_GAP_REPORT.md`.
8. Add at least one explicit **falsification self-test** demonstrating that an intentionally failing STRUCTURE, VISUAL, or FUNCTION dimension prevents overall `PARITY_PASS`.

### K1 round 3 acceptance

Only review-ready if:

- no route can PASS while an applicable dimension is non-PASS;
- gallery/archive media is measurable or explicitly methodology-blocked;
- 22-route canary is freshly regenerated;
- Gemini independent evidence exists and is consumable from GitHub;
- no broad product remediation was performed;
- actual false positives from the old model remain surfaced, not hidden.

Handoff only when ready:

```text
STATUS: READY_FOR_REVIEW
BALL: CHATGPT
```

## GEMINI TRACK

Gemini remains an independent auditor on `agent/gemini-final-audit`. Claude must not wait for Gemini to fix the Oracle, but K1 cannot be accepted until Gemini has pushed real route-level evidence.

## USER IS NOT A COURIER

No agent may ask the user to relay prompts, manage worktrees, or perform routine GitHub coordination.