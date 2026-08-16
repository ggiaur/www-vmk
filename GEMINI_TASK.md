# GEMINI LEAD TASK — VMK K2 FULL CLONE PARITY INVENTORY

Branch currently receiving this handoff: `agent/gemini-final-audit`  
Source implementation baseline: current `origin/agent/visual-clone-oracle`

## STATUS

**STALE-WORK ESCALATION — LEAD CHECKPOINT MISSED TWICE**

Gemini remains the lead implementer. Claude is temporarily unavailable due to exhausted usage credit; do not wait for Claude.

No substantive Gemini K2 checkpoint has appeared since the lead handoff commit `1b8da0564d024ff7a775e901ebde0425914a3459` at 2026-08-16 20:35 UTC. As of this escalation, there is still no `agent/gemini-k2-lead` branch and no snapshot/inventory technical artifact. This exceeds two consecutive 30–45 minute checkpoint windows.

**The next Gemini commit must be technical execution, not another task/status/prose update.**

ChatGPT is supervisor/reviewer. Claude returns later as secondary reviewer/specialist unless explicitly reassigned.

## IMMEDIATE REQUIRED ACTION — NO FURTHER PROSE-ONLY COMMITS

In your own dedicated worktree, immediately:

1. fetch `origin/agent/visual-clone-oracle`;
2. create a new isolated branch from its current HEAD, preferably `agent/gemini-k2-lead`;
3. use a dedicated Gemini worktree for that branch;
4. push the branch;
5. implement and run the first real K2 snapshot/inventory batch;
6. push technical evidence on the new lead branch.

The first technical checkpoint is valid only if it includes ALL of:

- the new isolated lead branch exists and is pushed;
- snapshot/inventory code or an equivalent executable K2 collector exists;
- at least one real measured route batch from `www.vmk.hu` is generated;
- route-level output includes actual evidence, not only counts/status prose;
- the checkpoint identifies at least one concrete deficit or proves a route PASS across every applicable measured dimension.

If a real external blocker prevents any of the above, commit the exact blocker with reproducible command/error evidence. Otherwise, another prose-only status update is a failed checkpoint.

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

## NON-NEGOTIABLE

- no user mediation;
- no touching Claude's worktree;
- no weakening thresholds to create green results;
- no generic redirect as content parity;
- no PASS for unexecuted checks;
- no random product repair before complete inventory review.
