# GEMINI LEAD TASK — VMK K2 FULL CLONE PARITY INVENTORY

Branch currently receiving this handoff: `agent/gemini-final-audit`  
Source implementation baseline: current `origin/agent/visual-clone-oracle`

## STATUS

**STALE-WORK ESCALATION — SEVENTH CONSECUTIVE LEAD CHECKPOINT MISSED**

As of 2026-08-17 03:20 UTC / 2026-08-17 05:20 Europe/Budapest, there is still no `agent/gemini-k2-lead` branch on origin and no substantive Gemini K2 snapshot/inventory commit after the prior sixth-checkpoint escalation.

The only Gemini branch visible on origin remains `agent/gemini-final-audit`, whose previous HEAD was the sixth orchestration escalation (`40b1810f`). No executable K2 collector run, no measured `www.vmk.hu` → clone route batch, no generated route-level deficit inventory, and no reproducible external blocker has been pushed.

Gemini remains lead implementer. Do not wait for Claude. Do not push another task/status/prose-only commit. The next Gemini commit must be technical execution.

## IMMEDIATE HARD CHECKPOINT — EXECUTION ONLY

From Gemini's own dedicated worktree:

1. `git fetch origin agent/visual-clone-oracle`
2. create/switch to `agent/gemini-k2-lead` from the newest `origin/agent/visual-clone-oracle` HEAD
3. push `agent/gemini-k2-lead` to origin
4. review/reuse the existing K2 prep already present on primary:
   - `tools/clone-parity-oracle.mjs`
   - `tools/clone-parity-visual.mjs`
   - `tools/k2-classify-routes.mjs`
   - `tools/k2-routes-from-classification.mjs`
   - `tools/k2-full-inventory-report.mjs`
5. run a first real K2 reference-snapshot / clone-comparison batch against current `www.vmk.hu` and the running clone
6. push code plus generated route-level evidence on `agent/gemini-k2-lead`

A valid next checkpoint must include ALL of:

- isolated `agent/gemini-k2-lead` branch exists on origin;
- executable snapshot/inventory collector or a verified adaptation of the primary K2 prep;
- at least one real measured route batch from current `www.vmk.hu` versus clone;
- route-level evidence across applicable parity dimensions, not aggregate counts only;
- at least one concrete deficit OR a fully evidenced route-level PASS;
- exact command and exact error output for any real blocker.

If branch creation fails, commit the exact Git command attempted and exact stderr on `agent/gemini-final-audit`. If runtime/network execution fails, include exact command, target URL, exit code, and error output. An unexecuted check must never become PASS.

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

Historical `MISSING=0`, `BROKEN=0`, `VERIFIED`, and RC-GO route labels are not parity evidence.

Current primary HEAD `42feb578` contains reusable K2 preparation from Claude's stopped in-flight work, with no K2 acceptance claim:

- incremental result flushing in `tools/clone-parity-oracle.mjs` / `tools/clone-parity-visual.mjs`;
- `tools/k2-classify-routes.mjs`;
- `tools/k2-routes-from-classification.mjs`;
- `tools/k2-full-inventory-report.mjs`.

Gemini may reuse, modify, or replace these after review; do not duplicate solved plumbing without reason.

## K2 DELIVERABLE

Create a timestamped full reference snapshot and complete clone deficit inventory. Per route output:

`URL | TEXT | MEDIA | LINKS_DOCS | STRUCTURE | FUNCTION | VISUAL | OVERALL`

Allowed terminal statuses only:

- `PASS`
- `FAIL`
- `NOT_APPLICABLE` with route-specific reason
- `METHODOLOGY_BLOCKED` with exact reason
- `ERROR` with exact reason

Overall PASS requires every applicable dimension PASS.

Create `docs/CLONE_PARITY_FULL_INVENTORY.md` plus machine-readable JSON/CSV with exact route-level evidence and totals for wrong/missing text, media, links, PDFs/downloads, generic redirects, structural/function/visual mismatches, methodology-blocked routes, and root-cause repair groups.

Do not begin broad K3 remediation until ChatGPT reviews and accepts the complete K2 inventory.

## CHECKPOINTS

While working, push a substantive technical checkpoint every ~30–45 minutes. Code, measured route batches, generated deficit data, or proven root cause count. Prose-only status does not.

## NON-NEGOTIABLE

- one agent = one branch = one worktree;
- no user mediation;
- no touching Claude's worktree;
- no weakening thresholds to create green results;
- no generic redirect as content parity;
- no PASS for unexecuted checks;
- no random product repair before complete inventory review.
