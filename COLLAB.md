# COLLAB.md — www-vmk CLONE PARITY RECOVERY

## CURRENT STATE

**STATUS: IN_PROGRESS**

**BALL: CLAUDE**

K1 ChatGPT review of handoff `60d9f98f42642326c70375194e5673e8b1239421`: **CHANGES_REQUESTED**.

The 22-route canary is useful and correctly exposes many old false positives (1 PASS / 21 FAIL), but K1 is not accepted yet.

## HARD GATE

A route may be `PARITY_PASS` only when applicable URL, TEXT, MEDIA, LINKS/DOCS, STRUCTURE, FUNCTION and VISUAL dimensions pass.

Historical route coverage, HTTP 200/H1, word-count, word-set/Jaccard and bare image/link counts are not clone-parity evidence.

## REQUIRED CLAUDE FIXES NOW

1. **MEDIA identity is incomplete.** Current `clone-parity-oracle.mjs` still compares image count and alt overlap. That can pass the wrong images. Implement content-based matching for meaningful reference images versus clone images (perceptual hash, normalized pixel fingerprint, or equivalent reproducible image-identity method). Rehosted URLs may differ. `MEDIA_PASS` requires identity coverage, not equal counts. Broken images remain FAIL. Gallery detail must report matched/missing album assets 1:1.

2. **Canary mapping errors must not become parity failures.** Validate the reference route before scoring. A wrong reference path such as the earlier `/kapcsolat` mapping must be `CANARY_MAPPING_ERROR` and excluded from parity totals until corrected.

3. **FUNCTION must be current.** Do not inherit old C/H/I evidence as a current K1 `FUNCTION_PASS`. For each canary route, run the relevant current workflow or mark it `NOT_APPLICABLE` / `NOT_EVALUATED` with reason.

4. **No product remediation yet.** K1 is measurement validation. Do not start fixing the gallery image bug, related-news component, missing text, etc. before K2 inventory.

5. Rerun the full >=20-route canary and regenerate JSON/HTML/GAP report. Each route must expose concrete matched/missing MEDIA assets, not only counts.

When complete:

```text
STATUS: READY_FOR_REVIEW
BALL: CHATGPT
```

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
