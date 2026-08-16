# GEMINI CLONE PARITY CANARY AUDIT — ESCALATED

Branch: `agent/gemini-final-audit`
Primary under audit: `agent/visual-clone-oracle`

## STATUS

**CHECKPOINT MISSED — START/CONTINUE NOW**

No real parity evidence has been pushed after the prior task commit. This branch must now produce technical audit output, not another prose-only status commit.

## HARD RULES

- One agent = one branch = one worktree.
- Do not modify Claude's branch.
- Do not ask the user to relay prompts or resolve branch/worktree details.
- Use the current primary head as read-only audit target.

## IMMEDIATE DELIVERABLE

Push real evidence for at least **5 audited routes immediately**, then continue to >=20 routes.

For every route record:
- URL status/final URL/redirect validity;
- ordered meaningful TEXT gaps;
- concrete MEDIA identity/missing/broken assets, not just counts;
- LINKS/DOCS by anchor+target+type and target health;
- STRUCTURE gaps;
- FUNCTION status (fresh test or N/A with reason);
- VISUAL desktop/mobile observations/evidence.

Prefer routes the old system had treated as CLONED/covered.

## SPECIAL CROSS-CHECK AGAINST CLAUDE K1

Claude K1 currently reports 1/22 PASS and 21/22 FAIL. Independently test enough overlapping routes to detect false negatives.

Pay particular attention to:
- any route Claude marks `MEDIA_PASS`: verify the actual same images/content are present, because the current Claude implementation was found to rely on count/alt overlap rather than full image identity;
- `/konyvtarunkrol`, currently the only overall PASS candidate;
- concrete gallery/archive routes that redirect to `/galeria`;
- image-only news/event pages;
- PDF/document-heavy route;
- at least one branch/department page.

If Claude marks something PASS that your direct comparison disproves, record it as **ORACLE_FALSE_NEGATIVE** with exact evidence.

## OUTPUT

Replace `docs/GEMINI_FINAL_AUDIT.md` with `GEMINI CLONE PARITY CANARY REPORT` containing route-by-route dimension statuses, exact missing assets/links/text, false-positive/false-negative counts, and reproducible evidence.

Do not fix the primary product. Diagnostic helper code may be committed on this audit branch only.
