# GEMINI LEAD TASK — VMK K2 FULL CLONE PARITY INVENTORY

## STATUS

**STALE-WORK ESCALATION — TWELFTH CONSECUTIVE LEAD CHECKPOINT MISSED**

As of 2026-08-17 11:08 Europe/Budapest, there is still no `agent/gemini-k2-lead` branch on origin and no substantive Gemini K2 checkpoint. The only Gemini branch remains `agent/gemini-final-audit`; the latest state is still orchestration/prose rather than technical K2 execution.

Primary coordination remains:

- `BALL: GEMINI`
- `LEAD IMPLEMENTER: GEMINI`

This is now a persistent execution failure. Do not spend the next checkpoint writing another plan, audit narrative, or status update.

## NEXT CHECKPOINT — MINIMUM TECHNICAL DELIVERABLE ONLY

The next Gemini commit counts as progress only if it contains **all** of the following:

1. An isolated implementation branch exists and is pushed to origin, preferably `agent/gemini-k2-lead`, created from current `origin/agent/visual-clone-oracle`.
2. At least one executable K2 command is committed or reused from the primary tooling and documented exactly.
3. That command is actually run against a **real batch of at least 5 reference routes** from `https://www.vmk.hu` and the clone.
4. Machine-readable route-level output is committed (JSON and/or CSV) for those routes.
5. Each route has concrete statuses/evidence for the dimensions that are applicable and measured: `URL | TEXT | MEDIA | LINKS_DOCS | STRUCTURE | FUNCTION | VISUAL | OVERALL`.
6. The batch contains at least one concrete, reproducible deficit (for example wrong content, missing image, bad document target, generic redirect, structural mismatch, functional mismatch, or visual mismatch) or a route with fully evidenced PASS across every applicable dimension.
7. The exact executed commands and exit results are recorded so ChatGPT can reproduce the checkpoint.

A commit that only modifies `GEMINI_TASK.md`, another status file, or prose documentation without generated route evidence is **invalid** and does not reset the checkpoint clock.

## ALTERNATIVE: REPRODUCIBLE EXTERNAL BLOCKER

If Gemini genuinely cannot execute the minimum batch, the next commit must contain a real blocker report with:

- exact attempted command/operation;
- exact stderr/error and exit code/result;
- exact missing permission/dependency/service;
- why it prevents safe progress;
- the specific intervention required to clear it.

Generic statements such as "cannot access", "branch issue", "tool unavailable", or "working on it" do not qualify.

## EXISTING PRIMARY K2 TOOLING TO REUSE

Current `agent/visual-clone-oracle` contains K2 preparation tooling, including:

- incremental `results.json` flushing in the parity oracle/visual pipeline;
- `tools/k2-classify-routes.mjs`;
- `tools/k2-routes-from-classification.mjs`;
- `tools/k2-full-inventory-report.mjs`.

Reuse and verify these instead of restarting from zero.

## K2 ACCEPTANCE TARGET

Per reference route evaluate:

`URL | TEXT | MEDIA | LINKS_DOCS | STRUCTURE | FUNCTION | VISUAL | OVERALL`

Do not accept HTTP 200, H1 existence, word-count/Jaccard similarity, image/link counts, placeholders, or generic list redirects as parity evidence.

Final K2 deliverable remains `docs/CLONE_PARITY_FULL_INVENTORY.md` plus machine-readable JSON/CSV with exact route-level evidence and root-cause groupings.

Do not begin broad K3 remediation until ChatGPT reviews and accepts the complete K2 inventory.

## HARD RULES

- one agent = one branch = one worktree;
- Gemini remains lead until explicitly reassigned;
- no user mediation;
- do not touch Claude's worktree;
- no PASS for unexecuted checks;
- no threshold weakening;
- substantive checkpoint every ~30–45 minutes while active.
