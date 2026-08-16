# COLLAB.md — www-vmk CLONE PARITY RECOVERY

## CURRENT STATE

**STATUS: IN_PROGRESS**  
**BALL: GEMINI**  
**LEAD IMPLEMENTER: GEMINI**

Claude is temporarily unavailable because its usage credit is exhausted for approximately 11 hours. Do not idle the project waiting for Claude.

Claude returns later as **secondary reviewer / specialist**, not as an automatic lead switch. ChatGPT remains **supervisor/reviewer only**.

## PRIMARY PRODUCT GOAL

Build a faithful modern clone of the current `https://www.vmk.hu/`.

A route is NOT complete because it returns 200, has an H1, has similar word count, or redirects somewhere non-broken.

For every reference page, as applicable, preserve:

- correct URL/canonical mapping;
- same meaningful page content and ordering;
- same content images/gallery media;
- same internal/external links and destinations;
- same PDFs/downloads;
- same tables/lists/contact data/dates;
- same forms and user-visible functionality;
- close desktop/mobile visual structure.

Generic redirects to list pages do NOT satisfy detail/gallery parity unless the reference itself behaves that way.

## VERIFIED BASELINE

K1 Oracle v2 is sufficient to expose the real problem.

Fresh 22-route canary from `426b16e`:

- overall: `PARITY_PASS 0/22`, `PARITY_FAIL 22/22`
- URL: 20 PASS / 2 generic-redirect FAIL
- TEXT: 1 PASS / 21 FAIL
- MEDIA: 5 PASS / 17 FAIL
- LINKS: 3 PASS / 19 FAIL
- STRUCTURE: 2 PASS / 11 PARTIAL / 9 FAIL
- FUNCTION: 2 PASS / 20 NOT_APPLICABLE
- VISUAL: 1 PARTIAL / 21 FAIL

Historical FIRST-HOP/DEPTH-2/FULL-SITE `MISSING=0`, `BROKEN=0`, `VERIFIED`, or RC-GO labels are NOT clone-parity acceptance evidence.

## GEMINI LEAD — IMMEDIATE EXECUTION

Gemini must NOT implement inside Claude's worktree or branch.

First action:

1. In Gemini's own dedicated worktree, fetch `origin/agent/visual-clone-oracle`.
2. Create a new implementation branch from the current primary head, preferably `agent/gemini-k2-lead`.
3. Push that branch before substantive work if possible.
4. Continue K2 there. The old `agent/gemini-final-audit` branch remains audit/history and may carry the handoff instructions, but must not become a shared worktree with Claude.

Hard rule: **1 agent = 1 branch = 1 worktree**.

## K2 — GEMINI REQUIRED DELIVERABLE NOW

Do NOT start broad random remediation yet. First establish the complete measurable gap.

### A. Full timestamped reference snapshot

For the full relevant Hungarian `www.vmk.hu` scope, store per URL:

- reference URL, final URL/status/redirect chain;
- page family;
- title/H1/headings;
- ordered meaningful main-content blocks;
- actual content media URLs + identity fingerprints;
- gallery media including CSS `background-image`, `srcset`, lazy-load/lightbox sources;
- internal links;
- external links;
- PDFs/downloads + target health;
- tables/lists/contact/date structures;
- form/function presence;
- deterministic desktop/mobile screenshot references.

Counts alone are not evidence.

### B. Complete clone comparison

Produce one result per reference URL:

`URL | TEXT | MEDIA | LINKS_DOCS | STRUCTURE | FUNCTION | VISUAL | OVERALL`

Allowed terminal states:

- `PASS`
- `FAIL`
- `NOT_APPLICABLE` with route-specific reason
- `METHODOLOGY_BLOCKED` with exact reason
- `ERROR` with exact reason

No `PARITY_PASS` if any applicable dimension is not PASS.

### C. Full deficit inventory

Create:

- `docs/CLONE_PARITY_FULL_INVENTORY.md`
- machine-readable JSON and/or CSV source

Must include:

- total reference URLs discovered;
- total scored clone URLs;
- PASS/FAIL totals;
- wrong/missing content routes;
- missing/wrong media routes and exact assets;
- missing/broken image totals;
- wrong/missing internal links;
- wrong/missing external links;
- missing/broken PDFs/downloads;
- generic redirects used incorrectly as substitutes;
- structural mismatches;
- functional mismatches;
- major desktop/mobile visual mismatches;
- methodology-blocked routes;
- root-cause grouping by page family.

Every deficit must include exact route + reproducible evidence.

### D. Root-cause grouping

Group defects into reusable repair batches, e.g.:

- gallery/detail routes collapsed to `/galeria`;
- imported pages missing media;
- wrong content importer/extractor;
- internal-link rewrite errors;
- document/download migration gaps;
- page-family template/layout mismatch;
- legacy route mapping error;
- missing Payload data vs frontend rendering defect.

This grouping defines K3.

## CHECKPOINT DISCIPLINE

Push substantive technical checkpoints every ~30–45 minutes while actively working.

Valid checkpoint:

- snapshot/inventory code;
- measurable route batch;
- generated real deficit data;
- proven root cause with exact examples.

Prose-only status does not count.

## ROLE MODEL UNTIL CLAUDE RETURNS

- **Gemini:** lead implementer, K2 execution and later K3 after review.
- **ChatGPT:** supervisor/reviewer; accepts/rejects evidence and controls gates.
- **Claude:** paused for credit; when available again, reviewer/specialist unless explicitly reassigned.

Do not wait for Claude. Do not ask the user to relay prompts or manage branches/worktrees.
