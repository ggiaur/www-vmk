# GEMINI CLONE PARITY CANARY AUDIT — ESCALATED FOR REAL EVIDENCE

Branch: `agent/gemini-final-audit`  
Primary under audit: `agent/visual-clone-oracle`

## STATUS

**CHECKPOINT FAILED — `ce4b591` WAS TASK PROSE, NOT AUDIT EVIDENCE**

The branch has still not produced route-level independent parity evidence. The latest commit `ce4b5911072ffc98bbbeca455c68cd9009bc6deb` only rewrote this task file. That does not satisfy K1 independent validation.

**Do not push another task/status/escalation-only commit. The next Gemini commit must contain actual audit output.**

## CURRENT PRIMARY CONTEXT

Primary K1 round 3 implementation is commit `426b16ee3e5d776e444512e8648b5dc6fd1b90f1` with handoff `b72c1735975fab3f484de5904eb9e8be17593fa0`.

Claude now reports, with concrete tool evidence:

- 7-dimension final scoring: URL/TEXT/MEDIA/LINKS/STRUCTURE/FUNCTION/VISUAL;
- gallery/archive media extraction includes CSS `background-image`, `srcset`, and lazy-load sources;
- fresh 22-route canary: 0 `PARITY_PASS`, 22 `PARITY_FAIL`;
- FUNCTION persistence/cleanup verified against Postgres for contact + wishbasket;
- falsification unit tests prevent STRUCTURE/VISUAL/FUNCTION failures from resolving to overall PASS.

The primary branch is temporarily `BALL: CLAUDE` for a separate P0 preview outage (`new.vmk.hu` / port 3011). **That does not excuse Gemini from producing independent evidence from the current primary code/results.** If live clone access is temporarily unavailable, audit all dimensions that can be verified from saved K1 artifacts/code and mark only genuinely live-dependent checks `BLOCKED_BY_PREVIEW_OUTAGE` with exact reason; do not fabricate PASS.

## IMMEDIATE CHECKPOINT — NEXT COMMIT

Produce `docs/GEMINI_FINAL_AUDIT.md` with **at least 5 real overlapping canary routes**. The next commit is invalid unless it includes route-level evidence.

Required routes/checks in the first checkpoint:

1. `/konyvtarunkrol` — independently verify the previous false-PASS candidate and the corrected VISUAL failure.
2. `/wishbasket` — verify FUNCTION semantics/persistence evidence as far as independently executable; otherwise exact live blocker.
3. `/gallery/folder/1023` or another concrete gallery/archive detail — verify generic redirect/content mismatch and actual album media extraction.
4. One route where STRUCTURE is non-PASS.
5. One PDF/document-heavy route — verify anchor target/type/health, not link count.

For each route record all seven dimensions:

- URL/final URL/redirect validity;
- ordered meaningful TEXT gaps;
- MEDIA identity/missing/broken assets, including CSS/lightbox/gallery media;
- LINKS/DOCS anchor + target + type + target health;
- STRUCTURE gaps;
- FUNCTION fresh status or `NOT_APPLICABLE`/`BLOCKED` with route-specific reason;
- VISUAL desktop + mobile evidence/observation.

Then continue to **>=20 routes**.

## FALSIFICATION DUTY

The independent audit is not a second copy of Claude's report. It must try to disprove the Oracle:

- Oracle says PASS but direct evidence shows applicable non-PASS → `ORACLE_FALSE_NEGATIVE`.
- Oracle says FAIL but direct evidence proves PASS → `ORACLE_FALSE_POSITIVE`.
- Oracle cannot measure a dimension reliably → `METHODOLOGY_BLOCKED`.

No PASS claim is allowed for a check not actually executed or independently evidenced.

## HARD RULES

- One agent = one branch = one worktree.
- Do not modify Claude's branch.
- Use current primary HEAD/read-only artifacts as audit target.
- No product fixes on this branch; diagnostic helper code is allowed here.
- Do not ask the user to relay prompts, run commands, manage worktrees, or resolve routine coordination.
- **Next commit must be technical evidence, not prose-only task management.**
