# COLLAB.md — www-vmk CLONE PARITY RECOVERY

## CURRENT STATE

**STATUS: IN_PROGRESS**  
**BALL: CLAUDE**

## PRIMARY PRODUCT GOAL

Build a faithful modern clone of the current `https://www.vmk.hu/`.

A route is NOT complete because it returns 200, has an H1, has similar word count, or redirects somewhere non-broken.

For every reference page the clone must preserve, as applicable:

- correct URL/canonical mapping;
- same meaningful page content and ordering;
- same content images/gallery media;
- same internal/external links and destinations;
- same PDFs/downloads;
- same tables/lists/contact data/dates;
- same forms and user-visible functionality;
- close desktop/mobile visual structure.

Generic redirects to list pages do NOT satisfy detail/gallery parity unless the reference itself behaves that way.

## CURRENT VERIFIED REALITY

K1 Oracle v2 is now sufficiently falsifying to proceed with inventory work.

Fresh 22-route canary result from implementation commit `426b16e`:

- overall: `PARITY_PASS 0/22`, `PARITY_FAIL 22/22`
- URL: 20 PASS / 2 generic-redirect FAIL
- TEXT: 1 PASS / 21 FAIL
- MEDIA: 5 PASS / 17 FAIL
- LINKS: 3 PASS / 19 FAIL
- STRUCTURE: 2 PASS / 11 PARTIAL / 9 FAIL
- FUNCTION: 2 PASS / 20 NOT_APPLICABLE
- VISUAL: 1 PARTIAL / 21 FAIL

This confirms the clone is far from parity. Historical FIRST-HOP/DEPTH-2/FULL-SITE `MISSING=0`, `BROKEN=0`, `VERIFIED`, or RC-GO labels are NOT clone-parity acceptance evidence.

Local preview `127.0.0.1:3011` has been restored in a detached tmux session. Public `new.vmk.hu` was independently observed returning HTTP 200 from public DNS/IP at the last check. Preview uptime is operationally useful but does not change parity acceptance.

## ORCHESTRATION CHANGE — EFFECTIVE NOW

Gemini independent audit remains required before FINAL acceptance, but it is NO LONGER a blocker for the full deficit inventory.

Do not wait for Gemini before K2.

Phase order:

```text
K1 Oracle v2 falsification canary      DONE ENOUGH TO INVENTORY
          |
          +---- Gemini independent audit continues in parallel (non-blocking for K2)
          |
          v
K2 FULL reference snapshot + COMPLETE deficit inventory   <-- DO THIS NOW
          |
          v
ChatGPT inventory review
          |
          v
K3 page-family/root-cause remediation
          |
          v
FULL parity rerun + Gemini independent verification
          |
          v
K4 final CI/security/WCAG/mergeability
```

## K2 — CLAUDE REQUIRED DELIVERABLE NOW

Do NOT start broad product remediation yet. First establish the complete measurable gap.

### 1. Freeze the current reference

Create a timestamped machine-readable reference snapshot for the full relevant Hungarian `www.vmk.hu` scope.

For every discovered reference URL store, as applicable:

- reference URL;
- final URL/status/redirect chain;
- page family;
- title/H1/headings;
- ordered meaningful main-content blocks;
- actual content media URLs and identity fingerprints;
- gallery media including CSS `background-image`, `srcset`, lazy-load/lightbox sources;
- internal links;
- external links;
- PDFs/downloads and target health;
- tables/lists/contact/date structures;
- form/function presence;
- desktop/mobile reference screenshots or deterministic screenshot references.

Do not use only counts as evidence.

### 2. Compare the complete clone scope

Produce one row/result per reference URL with these dimensions:

`URL | TEXT | MEDIA | LINKS_DOCS | STRUCTURE | FUNCTION | VISUAL | OVERALL`

Only these terminal states are allowed:

- `PASS`
- `FAIL`
- `NOT_APPLICABLE` with route-specific reason
- `METHODOLOGY_BLOCKED` with exact reason
- `ERROR` with exact reason

No `PARITY_PASS` if any applicable dimension is not PASS.

### 3. Produce COMPLETE deficit inventory

Create/update `docs/CLONE_PARITY_FULL_INVENTORY.md` plus machine-readable JSON/CSV source.

Must include at minimum:

- total reference URLs discovered;
- total scored clone URLs;
- PASS/FAIL totals;
- routes with wrong/missing content;
- routes with missing/wrong media;
- total missing/broken image assets;
- routes with missing/wrong internal links;
- routes with missing/wrong external links;
- missing/broken PDFs/downloads;
- generic redirects incorrectly used as substitutes;
- structural mismatches;
- functional mismatches;
- major desktop/mobile visual mismatches;
- methodology-blocked routes;
- root-cause grouping by page family.

For every deficit include the exact route and enough concrete evidence to reproduce it.

### 4. Group by root cause, not by random page

The inventory must identify reusable defect families, e.g.:

- gallery/detail routes collapsed to `/galeria`;
- imported pages missing media;
- wrong content extractor/importer behavior;
- internal-link rewriting errors;
- document/download migration gaps;
- page-family template/layout mismatch;
- legacy route mapping error;
- missing Payload data vs frontend rendering defect.

This grouping will define K3 remediation batches.

## CHECKPOINT DISCIPLINE

Push substantive technical checkpoints at least every ~30–45 minutes while actively working.

A valid checkpoint contains at least one of:

- new snapshot/inventory code;
- a measurable route batch completed;
- generated real deficit data;
- a root cause proven with exact examples.

Prose-only `working on it` commits do not count.

## GEMINI TRACK — PARALLEL, NON-BLOCKING FOR K2

Gemini remains on `agent/gemini-final-audit` and must independently audit overlapping routes and try to falsify Claude's Oracle/inventory.

Gemini does not authorize or block K2 execution. Gemini evidence becomes a hard gate again before K3 inventory acceptance is converted into final parity acceptance and certainly before K4/release.

## HARD RULES

- 1 agent = 1 branch = 1 worktree.
- Claude owns `agent/visual-clone-oracle` dedicated worktree.
- Gemini owns `agent/gemini-final-audit` dedicated worktree.
- No agent may switch/reset another agent's worktree.
- ChatGPT coordinates through GitHub/COLLAB.
- User is not a courier.
- Do not optimize for green counts; optimize for exact reference parity.
- Do not weaken thresholds or mark redirects/placeholders as PASS to make reports look better.
