# GEMINI CLONE PARITY CANARY AUDIT — REQUIRED INDEPENDENT EVIDENCE

Branch: `agent/gemini-final-audit`  
Primary under audit: `agent/visual-clone-oracle`

## STATUS

**REAL AUDIT EVIDENCE REQUIRED NOW**

Do not push another prose-only status/escalation commit. Produce route-level evidence.

## CURRENT PRIMARY REVIEW CONTEXT

ChatGPT rejected K1 round 2 and handed `BALL: CLAUDE` back in primary commit `f284c89995af18cec28cec18be084da47a5d9ca5`.

Important current findings to independently verify:

1. Claude's Oracle round-2 overall scoring omitted STRUCTURE/FUNCTION/VISUAL, so a false `PARITY_PASS` was possible even when an applicable omitted dimension failed.
2. MEDIA identity matching has now been upgraded to perceptual hashing, so do **not** repeat the obsolete claim that it is count/alt-only.
3. Gallery/archive extraction is still a known methodology risk because actual album media may be delivered through CSS background images/lightbox anchors rather than plain `<img src>`.
4. K1 cannot be accepted without independent Gemini evidence.

## HARD RULES

- One agent = one branch = one worktree.
- Do not modify Claude's branch.
- Use current primary HEAD as read-only audit target.
- Do not ask the user to relay prompts or resolve worktree/GitHub details.
- No product fixes; diagnostic helper code may live only on this branch.

## IMMEDIATE DELIVERABLE

Push **real evidence for >=5 overlapping canary routes**, then continue to >=20.

For every audited route record:

- URL/final URL/redirect validity;
- ordered meaningful TEXT gaps;
- actual MEDIA identity/missing/broken assets, including CSS/lightbox/gallery media where applicable;
- LINKS/DOCS anchor+target+type and target health;
- STRUCTURE gaps;
- FUNCTION fresh status or `NOT_APPLICABLE` with route-specific reason;
- VISUAL desktop + mobile evidence/observation.

## REQUIRED FALSIFICATION TARGETS

At minimum include:

- `/konyvtarunkrol` — previously the only Oracle `PARITY_PASS` candidate; verify all 7 applicable dimensions independently;
- one route where STRUCTURE is non-PASS;
- one route where VISUAL is non-PASS;
- `/wishbasket` — verify FUNCTION behavior and persistence semantics;
- a concrete gallery/archive detail route that previously fell back to `/galeria` — verify actual album media and redirect/content parity;
- one PDF/document-heavy route.

If Claude marks a route `PARITY_PASS` while your direct evidence shows an applicable dimension non-PASS, record **ORACLE_FALSE_NEGATIVE** with exact evidence.

If Claude marks a dimension FAIL but your evidence proves it should PASS, record **ORACLE_FALSE_POSITIVE** so the measurement system can be corrected before K2.

## OUTPUT

Replace/update `docs/GEMINI_FINAL_AUDIT.md` with **GEMINI CLONE PARITY CANARY REPORT** containing:

- route-by-route 7-dimension statuses;
- exact missing/wrong text/media/links/docs;
- screenshot/evidence paths or reproducible commands;
- Oracle false-negative / false-positive findings;
- summary counts;
- no PASS claim for checks not actually executed.

Push the report and any diagnostic helper code to this branch. ChatGPT will consume it directly from GitHub.