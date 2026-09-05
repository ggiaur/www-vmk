# VMK-WCAG-HARDENING-B1 — WCAG 2.2 AA evidence

**Date:** 2026-09-05

**Branch base:** `origin/agent/visual-clone-oracle` at `1964612`

**Browser:** Playwright Chromium, canonical checkout served at `http://127.0.0.1:3101`

## Baseline integrity

The required command was first run without a base-URL override. Port 3001 was
already owned by a separate `.claude/worktrees/j2-ci-fix` dev process and served
"Fejér Vármegyei Webarchívum", not this VMK branch. That result was rejected as
an environment collision; the process was not stopped or modified.

The canonical VMK checkout was then started on isolated port 3101. After the
development server's one-time route compilation, the unchanged branch baseline
was:

- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3101 npx playwright test tests/e2e/accessibility.spec.ts`
- 16/16 tests passed in 22.9 seconds.
- 15 audited public routes had zero axe WCAG 2.2 AA violations.
- Exact output: [`accessibility-before.txt`](./accessibility-before.txt).

This proves that R-03's 2026-08-03 measurement was stale at the supplied branch
tip. Earlier commits `700ad62` and `bba94f5` had already introduced scoped AA
tokens and brought the original 15-route gate to zero.

## Residual defects found beyond the required route list

To avoid treating a green but incomplete route list as the whole site, the eight
remaining explicit static public pages were audited with the same axe tags
(`wcag2a`, `wcag2aa`, `wcag22aa`). Two real failures remained:

1. `/allaspalyazatok`: the 13px explanatory line used `#999999` on white,
   measured at 2.84:1 instead of the required 4.5:1.
2. `/kozerdeku-adatok`: the `#137F85` inline Közadatkereső link was only 2.64:1
   against surrounding `#333333` text and had no non-color distinction until
   hover.

Before: 2 failing routes, 2 violation nodes. See
[`supplemental-static-routes-before.txt`](./supplemental-static-routes-before.txt).

## Application fixes

- Changed only the small explanatory neutral from `#999999` to `#666666`.
  This is 5.74:1 on white and does not alter any brand token.
- Kept the existing compliant teal link color and added a persistent underline
  (plus a slightly stronger hover decoration), satisfying the non-color link
  distinction requirement without changing the approved hue.
- No test was weakened or changed.

After: all eight supplemental pages pass with 0 failing routes and 0 violation
nodes. See
[`supplemental-static-routes-after.txt`](./supplemental-static-routes-after.txt).

## Required regression and independent check

The required suite was rerun after the fixes: 16/16 passed in 35.8 seconds, with
zero violations on all 15 public routes. Exact output:
[`accessibility-after.txt`](./accessibility-after.txt).

An independent browser pass checked `/`, `/nyitvatartas`, and
`/tagkonyvtarak`, which share the global shell and brand treatments. All three
had zero axe violations. Computed styles also confirmed that:

- the exact live-reference teal `#00909B` remains on the decorative navigation
  border;
- the exact live-reference gold `#e4b02c` remains on the branch-table swatch,
  paired with dark `#1B1B1B` text;
- text-bearing teal fills remain the already-approved `#007F88` AA token.

See [`independent-cross-route-check.txt`](./independent-cross-route-check.txt).
`npm run type-check` also completed successfully.

The independent pass surfaced two legacy-widget page errors (`Unexpected token
','` and `flash_support is not defined`) plus an existing duplicate React key
warning for `/szolgaltatasok`. They are unrelated to these two class-only edits
and are recorded here rather than silently concealed; they are outside this
contrast-remediation task.

## Brand-parity decision record

No core brand color was darkened or replaced in this change, so a new live-site
shade comparison was not necessary. There are no irreconcilable contrast cases
left in the 23 audited static public routes. Exact `#00909B` and `#e4b02c`
remain where they are decorative or paired with dark text; text-bearing teal
fills use the visually close scoped token established before this task.

## Screenshots

- [`allaspalyazatok-before.png`](./allaspalyazatok-before.png) and
  [`allaspalyazatok-after.png`](./allaspalyazatok-after.png)
- [`kozerdeku-adatok-before.png`](./kozerdeku-adatok-before.png) and
  [`kozerdeku-adatok-after.png`](./kozerdeku-adatok-after.png)

All four are real Chromium full-page captures at a 1440px viewport.
