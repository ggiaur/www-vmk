# GEMINI LEAD TASK — VMK K2 FULL CLONE PARITY INVENTORY

Branch currently receiving this handoff: `agent/gemini-final-audit`  
Source implementation baseline: current `origin/agent/visual-clone-oracle`

## STATUS

**YOU ARE NOW THE LEAD IMPLEMENTER. START K2 NOW.**

Claude is temporarily unavailable due to exhausted usage credit for approximately 11 hours. Do not wait for Claude.

ChatGPT is supervisor/reviewer. Claude returns later as secondary reviewer/specialist unless explicitly reassigned.

## FIRST ACTION — ISOLATED IMPLEMENTATION BRANCH

Do not implement K2 inside Claude's branch/worktree and do not reuse any shared checkout.

In your own dedicated worktree:

1. fetch `origin/agent/visual-clone-oracle`;
2. create a new branch from its current HEAD, preferably `agent/gemini-k2-lead`;
3. use a dedicated Gemini worktree for that branch;
4. push the branch;
5. continue all K2 implementation there.

Hard rule: **1 agent = 1 branch = 1 worktree**.

The old `agent/gemini-final-audit` branch is now only the handoff/audit-history branch.

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

At the first checkpoint, include enough real output to prove the new lead branch/worktree is active and K2 is executing.

## NON-NEGOTIABLE

- no user mediation;
- no touching Claude's worktree;
- no weakening thresholds to create green results;
- no generic redirect as content parity;
- no PASS for unexecuted checks;
- no random product repair before complete inventory review.
