# VMK-P0-A — Hub-link and shared-shell proof

**Status:** ACTIVE design/execution slice

## Builder output required

1. Freeze the reference route set from the existing full-site manifest.
2. Identify primary hub/list pages reachable directly from the homepage/header navigation.
3. For each hub, extract all same-site destinations from the reference and clone.
4. Follow redirects and classify each edge as:
   - `EXACT_EQUIVALENT`
   - `EQUIVALENT_CANONICAL_REDIRECT`
   - `MISSING`
   - `BROKEN`
   - `WRONG_TARGET`
   - `GENERIC_FALLBACK`
5. Produce `hub-parity-table.{json,md}`.
6. Capture desktop 1440 and mobile 390 reference/clone/diff images for every primary hub.
7. Measure shared header/nav/container/sidebar/footer differences separately.
8. Fix shared-shell defects before page-specific CSS.
9. Fix hub destination mapping until the active P0 hub set has zero missing/broken/wrong/generic-fallback edges.
10. Run existing content/media/link/structure/function parity checks on the same hubs.
11. Generate the owner-facing review board.

## Reviewer requirements

### Codex
Adversarially test at least these false-PASS cases:
- specific detail redirects to a broad list page;
- 200 page with wrong content;
- hidden/missing link masked by another equivalent-looking anchor;
- redirect loop or multi-hop wrong target;
- desktop PASS but mobile structural mismatch;
- average visual diff under threshold while a complete section is missing.

### Gemini/Jeremy
Independently compare the primary hub set against the live/frozen reference and identify:
- omitted hub pages;
- omitted high-value destinations;
- media/content blocks missing from the clone;
- reference behaviors the automated classifier misunderstood.

## PASS gate

VMK-P0-A is not PASS until:

- every primary hub is enumerated;
- every reference hub link is accounted for;
- missing = 0;
- broken = 0;
- wrong target = 0;
- generic fallback = 0 for the active P0 hub set;
- desktop and mobile artifacts exist for every primary hub;
- shared shell/template defects affecting those hubs are fixed;
- all applicable semantic gates pass;
- Codex review passes or findings are fixed;
- Gemini/Jeremy review passes or findings are fixed;
- ChatGPT/Product Architect records the reconciled acceptance decision.
