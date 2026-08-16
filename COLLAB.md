# COLLAB.md — www-vmk CLONE PARITY RECOVERY

## CURRENT STATE

**STATUS: READY_FOR_REVIEW**

**BALL: CHATGPT**

K1 round 2 complete, addressing every item from the CHANGES_REQUESTED review (`a7b25db`), commit `433b7bb` on `agent/visual-clone-oracle`.

## HARD GATE

A route may be `PARITY_PASS` only when applicable URL, TEXT, MEDIA, LINKS/DOCS, STRUCTURE, FUNCTION and VISUAL dimensions pass.

Historical route coverage, HTTP 200/H1, word-count, word-set/Jaccard and bare image/link counts are not clone-parity evidence.

## K1 ROUND 2 — WHAT WAS FIXED (commit `433b7bb`)

1. **MEDIA identity.** Replaced count/alt comparison with real content-identity
   matching (`compareMediaByIdentity` in `tools/clone-parity-oracle.mjs`):
   downloads up to 20 sampled images per side, computes an 8x8 grayscale
   perceptual hash via `sharp` (already a project dependency), matches by
   Hamming distance (<=10/64), not URL/host/position. Verified on a real
   rehosting case: reference `/_upload/news_pic/600x600/4_5787.png` matched
   clone `/_next/image?url=%2Fapi%2Fmedia%2Ffile%2Fnyari-nyitvatartas-2026.png`
   at distance 1/64 (different URL, host, encoding); correctly rejected the
   reference's unrelated fallback icon at distance 25/64. Fixed a BigInt
   JSON-serialization bug found while building this. Per-route matched/missing
   image lists (not just counts) are in `results.json`.

2. **CANARY_MAPPING_ERROR.** `auditRoute()` now validates the reference
   route's own HTTP status before scoring; a 4xx/5xx reference path is
   `CANARY_MAPPING_ERROR`, excluded from parity totals. `summary.json` now
   reports `scoredTotal`, `CANARY_MAPPING_ERROR` count, and
   `canaryMappingErrorRoutes`. 0/22 routes triggered this in the current run
   (the `/kapcsolat` -> `/elerhetosegeink` fix from round 1 holds).

3. **FUNCTION currency.** Per-route default changed to `NOT_APPLICABLE` with
   an explicit reason. Gap report's FUNCTION section rewritten to explicitly
   disclaim older C/H/I-round E2E evidence rather than cite it as current K1
   proof — that was flagged in review as risking misreading as a current
   FUNCTION_PASS; it's corrected now.

4. **No product remediation.** Confirmed compliant — only tool/measurement
   bugs were fixed this round. Found-but-not-fixed: gallery `vmk-logo.png`
   404 (46 broken images across 4 gallery-family routes), recorded for K2/K3.

5. **Full canary re-run.** All 22 routes, regenerated `results.json` /
   `report.html` / `summary.json` / `docs/CLONE_PARITY_GAP_REPORT.md`.
   `scoredTotal: 22/22`, `CANARY_MAPPING_ERROR: 0`, `PARITY_PASS: 1/22`
   (same route as round 1, `/konyvtarunkrol` — pass count unchanged, but
   MEDIA underneath it is now real identity coverage, not vacuous count
   matching). MEDIA is now 5/22 PASS (1 genuine identity match on
   `/hirek/202608_spiro-80-...`, 4 vacuous zero-images-both-sides).

**New methodology limitation found and disclosed this round** (not silently
misscored): the gallery-archive family's album pages list real photo
filenames in their `.col-content` text/links, but the actual `<img>`
elements sampled there are dominated by an unrelated "related news" sidebar
icon — meaning that family's real thumbnails likely render via CSS
background-image or a JS lightbox, which this MEDIA dimension can't
currently see. Flagged as a reasonable K1 follow-up or K2 item (matching
thumbnails via the anchor hrefs LINKS already captures, not just `<img
src>`).

`tsc --noEmit` and `npm run test:unit` both pass clean on this commit.

Rebased cleanly onto the review commit (`a7b25db`, COLLAB.md-only, no
conflict with code/doc changes) before pushing.

## GEMINI CROSS-CHECK

K1 cannot be accepted before the independent Gemini canary has real evidence and does not expose an Oracle false negative.

## PHASE ORDER — HARD RULE

```text
K1 Oracle v2 + falsification canary
 -> ChatGPT + Gemini validation
K2 full timestamped reference snapshot + complete deficit inventory
 -> ChatGPT acceptance
K3 page-family/root-cause remediation
K4 final parity + CI/security/WCAG/mergeability
```

K2 and K3 must not start before K1 acceptance.
