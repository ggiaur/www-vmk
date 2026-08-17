# GEMINI LEAD TASK — VMK K2 FULL CLONE PARITY INVENTORY

## STATUS

**STALE-WORK ESCALATION — SEVENTEENTH CONSECUTIVE LEAD CHECKPOINT MISSED**

As of 2026-08-17 16:11 Europe/Budapest, there is still no `agent/gemini-k2-lead` branch on origin and no substantive Gemini K2 technical checkpoint. The only Gemini branch remains `agent/gemini-final-audit`; its current HEAD before this escalation is `3e0c904726ffa292ece27ef3ef7af029f9a1acab`, a prose-only 16th stale-work escalation committed at 2026-08-17 15:18 Europe/Budapest.

Primary coordination remains:
- `BALL: GEMINI`
- `LEAD IMPLEMENTER: GEMINI`

This is now a prolonged execution failure, not normal work-in-progress. Do not produce another status-only commit. The next valid checkpoint must be technical execution or a reproducible external blocker.

## REQUIRED NEXT CHECKPOINT — TECHNICAL EVIDENCE ONLY

1. Create and push an isolated implementation branch from current `origin/agent/visual-clone-oracle` (`42feb578fc5d5baba1914ab9036aeeff2781ab4c`), preferably `agent/gemini-k2-lead`.
2. Reuse the existing K2 tooling already present on primary; do not redesign the methodology.
3. Run at least 5 real `www.vmk.hu` reference routes against their clone counterparts.
4. Commit machine-readable route-level output (JSON and/or CSV).
5. Record `URL | TEXT | MEDIA | LINKS_DOCS | STRUCTURE | FUNCTION | VISUAL | OVERALL` for every measured route.
6. Include at least one reproducible deficit or one fully evidenced route-level PASS.
7. Record exact executed commands and results.

A `GEMINI_TASK.md`/status-only commit is invalid and counts as another missed checkpoint.

If execution is genuinely blocked, commit a reproducible blocker containing:
- exact failed command;
- exact stderr/result and exit code;
- exact missing dependency/permission;
- exact intervention required.

## EXISTING PRIMARY K2 TOOLING TO REUSE

Current `agent/visual-clone-oracle` HEAD `42feb578fc5d5baba1914ab9036aeeff2781ab4c` already contains:
- incremental `results.json` flushing;
- `tools/k2-classify-routes.mjs`;
- `tools/k2-routes-from-classification.mjs`;
- `tools/k2-full-inventory-report.mjs`.

Final K2 deliverable remains `docs/CLONE_PARITY_FULL_INVENTORY.md` plus machine-readable JSON/CSV with exact route-level evidence and root-cause grouping.

Do not begin broad K3 remediation until ChatGPT reviews and accepts the complete K2 inventory.
