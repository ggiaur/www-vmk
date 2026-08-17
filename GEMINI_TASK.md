# GEMINI LEAD TASK — VMK K2 FULL CLONE PARITY INVENTORY

Branch currently receiving this handoff: `agent/gemini-final-audit`  
Source implementation baseline: current `origin/agent/visual-clone-oracle`

## STATUS

**STALE-WORK ESCALATION — FIFTH CONSECUTIVE LEAD CHECKPOINT MISSED**

As of 2026-08-17 01:08 UTC / 2026-08-17 03:08 Europe/Budapest, there is still no `agent/gemini-k2-lead` branch and no substantive Gemini K2 snapshot/inventory commit after the prior escalation at 00:16 UTC.

The only Gemini branch visible on origin remains `agent/gemini-final-audit`. No executable K2 collector run, no measured `www.vmk.hu` → clone route batch, no generated deficit inventory, and no reproducible external blocker has been pushed. This is now the fifth consecutive missed substantive lead checkpoint.

Gemini remains lead implementer. Do not wait for Claude and do not push another task/status/prose-only commit. The next Gemini commit must be technical execution.

### Immediate hard checkpoint

From your own dedicated worktree:

1. `git fetch origin agent/visual-clone-oracle`
2. create/switch to `agent/gemini-k2-lead` from the newest `origin/agent/visual-clone-oracle` HEAD
3. push the new branch
4. review/reuse the existing K2 prep on primary:
   - `tools/clone-parity-oracle.mjs`
   - `tools/clone-parity-visual.mjs`
   - `tools/k2-classify-routes.mjs`
   - `tools/k2-routes-from-classification.mjs`
   - `tools/k2-full-inventory-report.mjs`
5. run a first real K2 reference-snapshot / clone-comparison batch
6. push code + generated route-level evidence on `agent/gemini-k2-lead`

A valid next checkpoint must include ALL of:

- isolated Gemini lead branch exists on origin;
- executable snapshot/inventory collector or verified adaptation of the existing K2 prep;
- at least one real measured route batch from current `www.vmk.hu` versus clone;
- route-level evidence across applicable parity dimensions, not counts only;
- at least one concrete deficit or a fully evidenced route-level PASS;
- exact command/error evidence for any real blocker.

If branch creation or execution fails, push the exact command and exact error output. An unexecuted check must never become PASS.

## PRODUCT GOAL

Faithful modern clone of current `https://www.vmk.hu/`.

Do not accept HTTP 200, H1 existence, similar word count, image/link counts, placeholders, or generic list-page redirects as clone parity.

For every reference page preserve, as applicable:

- URL/canonical mapping;
- ordered meaningful content;
- actual images/gallery media;
- internal/external link destinations;
- PDFs/downloads;
- lists/tables/contacts/dates;
- forms/functions;
- desktop/mobile visual structure.

## VERIFIED STARTING POINT

K1 Oracle v2 canary on primary implementation commit `426b16e`:

- 22/22 overall FAIL
- TEXT 21/22 FAIL
- MEDIA 17/22 FAIL
- LINKS 19/22 FAIL
- VISUAL 21/22 FAIL

This is the real starting condition. Historical `MISSING=0`, `BROKEN=0`, `VERIFIED`, and RC-GO route labels are not parity evidence.

The current primary HEAD contains reusable K2 preparation from Claude's stopped in-flight work, but no K2 acceptance claim:

- incremental result flushing in `tools/clone-parity-oracle.mjs` / `tools/clone-parity-visual.mjs`;
- `tools/k2-classify-routes.mjs`;
- `tools/k2-routes-from-classification.mjs`;
- `tools/k2-full-inventory-report.mjs`.

Gemini may reuse, modify, or replace these after review; do not duplicate solved plumbing without reason.

## K2 DELIVERABLE

### 1. Freeze the complete reference

Create a timestamped machine-readable snapshot of the full relevant Hungarian `www.vmk.hu` scope. Per route capture:

- reference URL + final URL/status/redirect chain;
- family;
- title/H1/headings;
- ordered meaningful main-content blocks;
- actual content media + identity fingerprints;
- gallery CSS/background/srcset/lazy/lightbox media;
- internal/external links;
- PDFs/downloads + health;
- lists/tables/contacts/dates;
- forms/function presence;
- deterministic desktop/mobile screenshot references.

Do not rely on counts alone.

### 2. Compare every reference route to clone

Per route output:

`URL | TEXT | MEDIA | LINKS_DOCS | STRUCTURE | FUNCTION | VISUAL | OVERALL`

Allowed terminal statuses only:

- `PASS`
- `FAIL`
- `NOT_APPLICABLE` with route-specific reason
- `METHODOLOGY_BLOCKED` with exact reason
- `ERROR` with exact reason

Overall PASS requires every applicable dimension PASS.

### 3. Produce full inventory artifacts

Create:

- `docs/CLONE_PARITY_FULL_INVENTORY.md`
- machine-readable JSON and/or CSV

Include exact totals and route-level evidence for:

- total reference URLs;
- scored clone URLs;
- PASS/FAIL;
- wrong/missing text;
- missing/wrong/broken media;
- wrong/missing internal links;
- wrong/missing external links;
- missing/broken PDFs/downloads;
- invalid generic redirects;
- structural mismatches;
- functional mismatches;
- major desktop/mobile visual mismatches;
- methodology-blocked routes.

### 4. Root-cause groups

Group deficits into reusable repair batches. Examples:

- gallery/detail collapse to `/galeria`;
- missing media after import;
- importer/extractor defects;
- internal-link rewriting defects;
- document migration gaps;
- template/layout mismatch;
- legacy mapping error;
- missing Payload data vs renderer defect.

Do not begin broad K3 remediation until ChatGPT reviews the K2 inventory.

## CHECKPOINTS

While working, push a substantive checkpoint every ~30–45 minutes.

A valid checkpoint contains technical evidence: code, completed measured route batch, generated deficit data, or proven root cause. A prose-only status commit is invalid.

## NON-NEGOTIABLE

- one agent = one branch = one worktree;
- no user mediation;
- no touching Claude's worktree;
- no weakening thresholds to create green results;
- no generic redirect as content parity;
- no PASS for unexecuted checks;
- no random product repair before complete inventory review.
