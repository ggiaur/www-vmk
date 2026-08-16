# GEMINI FINAL AUDIT — www-vmk

Branch: `agent/gemini-final-audit`
Base: `agent/visual-clone-oracle`
Mode: **FINALIZATION ONLY — no new scope**

## Goal

Run one independent, repo-wide final audit while Claude fixes the critical-path CI problem on `agent/visual-clone-oracle`.

The objective is not to redesign or extend the product. Find only defects that could prevent us from calling the branch finished.

## Audit scope

Prioritize only P0/P1/P2 findings in these areas:

1. **Functional completeness**
   - current VMK route/content/function regressions;
   - first-hop/depth-2/full-site resolver regressions;
   - forms/workflows that are visibly dead or non-persistent;
   - admin edit → public frontend propagation failures.

2. **Security / access control**
   - Payload collections or fields with missing/over-broad access;
   - anonymous write/read of PII or transactional data;
   - role escalation / cross-user access;
   - dev-only endpoints exposed in production.

3. **Data / migrations**
   - schema mismatch risks with `push: false`;
   - migration omissions or non-idempotent/destructive migration behavior;
   - references to missing tables/columns introduced by this branch.

4. **Build / CI / tests**
   - deterministic failures that would block merge;
   - invalid or misleading tests;
   - CI gaps that make a green build meaningless.

5. **Release-critical configuration**
   - committed secrets/default production credentials;
   - obvious production-only blockers visible from the repo.

## Explicit non-goals

Do NOT spend time on:
- cosmetic homepage pixel polishing;
- new features;
- broad refactors;
- stylistic cleanup;
- speculative P3 issues;
- dependency upgrades unless a concrete release blocker is proven.

## Output

Create/update `docs/GEMINI_FINAL_AUDIT.md` on this branch with:

- `RESULT: PASS` or `RESULT: FINDINGS`;
- each finding: severity (`P0/P1/P2`), exact file/line or route, reproducible evidence, smallest safe fix;
- commands/tests actually run and results;
- no claims for tests not executed.

If a finding is trivial and isolated, you may implement it on this branch, but document the exact commit and keep changes narrowly scoped. Do not edit `COLLAB.md` on this branch.

When done, push the branch. Claude/ChatGPT will consume the audit from GitHub; the user must not act as courier.
