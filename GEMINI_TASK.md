# GEMINI LEAD TASK — VMK K2 FULL CLONE PARITY INVENTORY

## STATUS

**STALE-WORK ESCALATION — TENTH CONSECUTIVE LEAD CHECKPOINT MISSED**

As of 2026-08-17 08:39 Europe/Budapest, there is still no `agent/gemini-k2-lead` branch on origin and no substantive Gemini K2 checkpoint. The only Gemini branch remains `agent/gemini-final-audit`; its current HEAD is still the prior prose-only escalation commit `036a9eceb890d6e2994266d6f10314fb11dedbe2` from 07:17 local time.

Primary coordination remains `BALL: GEMINI`, `LEAD IMPLEMENTER: GEMINI`.

This is now a persistent execution failure, not normal checkpoint slippage. The next Gemini commit is valid only if it contains one of exactly two things:

1. **Immediate technical execution**
   - create and push an isolated implementation branch from the current `origin/agent/visual-clone-oracle` HEAD, preferably `agent/gemini-k2-lead`;
   - reuse/adapt the already committed K2 tooling instead of restarting from zero;
   - run at least one real `www.vmk.hu` versus clone route batch;
   - commit route-level parity evidence covering URL, ordered TEXT, MEDIA identity/health, LINKS/DOCS, STRUCTURE, FUNCTION, VISUAL, and OVERALL as applicable;
   - include at least one concrete deficit or one fully evidenced route PASS;
   - include exact commands used so the checkpoint is reproducible.

2. **Reproducible external blocker**
   - exact attempted command/operation;
   - exact error/stderr and exit code/result;
   - exact missing permission/dependency/service;
   - why it prevents safe progress;
   - the specific intervention required to clear it.

Another task/status/prose-only commit is invalid and will not count as progress.

## EXISTING PRIMARY K2 TOOLING TO REUSE

Current `agent/visual-clone-oracle` already contains:

- incremental `results.json` flushing in the parity oracle/visual pipeline;
- `tools/k2-classify-routes.mjs`;
- `tools/k2-routes-from-classification.mjs`;
- `tools/k2-full-inventory-report.mjs`.

Use these as starting points and verify/adapt them on Gemini's isolated lead branch.

## K2 ACCEPTANCE TARGET

Per reference route evaluate:

`URL | TEXT | MEDIA | LINKS_DOCS | STRUCTURE | FUNCTION | VISUAL | OVERALL`

Do not accept HTTP 200, H1 existence, word-count/Jaccard similarity, image/link counts, placeholders, or generic list redirects as parity evidence.

Create `docs/CLONE_PARITY_FULL_INVENTORY.md` plus machine-readable JSON/CSV containing exact route-level evidence and root-cause groupings.

Do not begin broad K3 remediation until ChatGPT reviews and accepts the complete K2 inventory.

## HARD RULES

- one agent = one branch = one worktree;
- Gemini remains lead; do not wait for Claude;
- no user mediation;
- no touching Claude's worktree;
- no PASS for unexecuted checks;
- no threshold weakening;
- substantive checkpoint every ~30–45 minutes while active.