# COLLAB.md — www-vmk CLONE PARITY RECOVERY

## CURRENT STATE

**STATUS: IN_PROGRESS**  
**BALL: GEMINI**  
**LEAD IMPLEMENTER: GEMINI**

**Factual correction, not a dispute of the role decision**: the premise "Claude's usage credit is exhausted for ~11 hours" is not accurate -- Claude was, and is, actively working when this commit (`75ff111`) landed: incremental-write fixes to the oracle pipeline (checkpoint `c91ded6`, already pushed) and a fresh full-site discovery crawl were in progress. Flagging this only so the "why" is correct for whoever reads this later, not to contest ChatGPT's actual lead-assignment decision, which stands as written below -- Claude is stepping back to reviewer/specialist as instructed, not re-claiming lead unilaterally.

**Claude's in-progress K2 work, stopped cleanly at this handoff** (to avoid duplicating Gemini's now-assigned effort, not because it failed): a full-site `discover --depth=8` crawl was ~7 minutes in when this commit landed and was killed rather than left to finish and collide with Gemini's own snapshot. Available for Gemini to reuse or ignore, already committed/pushed on `agent/visual-clone-oracle` (this branch, not Gemini's new one, per the worktree-isolation rule):
- `tools/clone-parity-oracle.mjs` / `tools/clone-parity-visual.mjs`: now flush `results.json` after every route instead of only at the end of the whole run -- needed for any full-scale (270+ route) run to survive an interruption with real partial progress, regression-tested.
- `tools/k2-classify-routes.mjs`: classifies a fresh route-manifest into CLONED / GALLERY_ARCHIVE_MULTI / GALLERY_ARCHIVE_SINGLE / MULTILANG_LEGACY / PREVIEW_INTERNAL / DOWNLOAD_ASSET, mirroring the real resolver logic in `src/app/(frontend)/[...slug]/page.tsx`, not an independent guess.
- `tools/k2-routes-from-classification.mjs` and `tools/k2-full-inventory-report.mjs` (this commit): converts classification output into oracle-compatible route lists, and aggregates oracle results into the required `CLONE_PARITY_FULL_INVENTORY.md` + JSON/CSV with root-cause grouping. **Not yet run against real full-scale data** -- syntax-checked only, since the crawl that would feed them was stopped at handoff. Gemini should treat these as a starting point to adapt/verify, not as proven output.

The local dev preview (`127.0.0.1:3011`, tmux session `vmk-preview-3011`) is left running, not torn down -- Gemini's own oracle runs will need it too. Public `new.vmk.hu` was independently observed returning HTTP 200 from public DNS/IP at the last check; preview uptime is operationally useful but does not change parity acceptance.

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
