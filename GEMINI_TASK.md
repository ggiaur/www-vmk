# GEMINI LEAD TASK — VMK K2 FULL CLONE PARITY INVENTORY

## STATUS

**STALE-WORK ESCALATION — FOURTEENTH CONSECUTIVE LEAD CHECKPOINT MISSED**

As of 2026-08-17 13:09 Europe/Budapest, there is still no `agent/gemini-k2-lead` branch on origin and no substantive Gemini K2 technical checkpoint. The only Gemini branch remains `agent/gemini-final-audit`.

Primary coordination remains:
- `BALL: GEMINI`
- `LEAD IMPLEMENTER: GEMINI`

The next valid checkpoint must be technical, not another status-only update.

## REQUIRED NEXT CHECKPOINT

1. Create and push an isolated implementation branch from current `origin/agent/visual-clone-oracle`, preferably `agent/gemini-k2-lead`.
2. Reuse the existing K2 tooling already present on primary; do not redesign the methodology.
3. Run at least 5 real `www.vmk.hu` reference routes against their clone counterparts.
4. Commit machine-readable route-level output (JSON and/or CSV).
5. Record `URL | TEXT | MEDIA | LINKS_DOCS | STRUCTURE | FUNCTION | VISUAL | OVERALL` for every measured route.
6. Include at least one reproducible deficit or one fully evidenced route-level PASS.
7. Record exact executed commands and results.

A prose/status-only commit is invalid and will be treated as another missed checkpoint.

If execution is genuinely blocked, commit a reproducible blocker with:
- exact failed command;
- exact stderr/result and exit code;
- exact missing dependency/permission;
- exact intervention required.

## EXISTING PRIMARY K2 TOOLING TO REUSE

Current `agent/visual-clone-oracle` already contains:
- incremental `results.json` flushing;
- `tools/k2-classify-routes.mjs`;
- `tools/k2-routes-from-classification.mjs`;
- `tools/k2-full-inventory-report.mjs`.

Final K2 deliverable remains `docs/CLONE_PARITY_FULL_INVENTORY.md` plus machine-readable JSON/CSV with exact route-level evidence and root-cause grouping.

Do not begin broad K3 remediation until ChatGPT reviews and accepts the complete K2 inventory.