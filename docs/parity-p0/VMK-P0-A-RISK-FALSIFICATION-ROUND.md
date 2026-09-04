# VMK-P0-A — independent risk/falsification round before parity checker is trusted

**Priority:** P0
**Status:** ACTIVE REVIEW GATE
**Scope:** challenge the proposed VMK parity/acceptance system itself before relying on it to declare pages correct.

## Why this round exists

The Product Owner explicitly requested a second independent review of the checking system's failure modes. The checker must not merely find site defects; it must also be designed so that its own measurement bugs, stale evidence, sampling shortcuts, redirect assumptions, visual noise, and reviewer convergence cannot create a false PASS.

This is an **independent first-pass** round. Claude/Cloud, Codex, Gemini/Jeremy and ChatGPT/Product Architect must each produce their own risk analysis before reading or reconciling the others' conclusions.

No one may weaken a threshold, add a broad exception, or declare VMK-P0-A accepted while this risk gate is open.

## Required reviewer outputs

Write one file each:

- `docs/parity-p0/reviews/CLAUDE-RISK-REVIEW.md`
- `docs/parity-p0/reviews/CODEX-RISK-REVIEW.md`
- `docs/parity-p0/reviews/GEMINI-RISK-REVIEW.md`
- `docs/parity-p0/reviews/CHATGPT-RISK-REVIEW.md`

After all four first-pass reviews exist, Claude/Cloud must write:

- `docs/parity-p0/reviews/RISK-RECONCILIATION.md`

The reconciliation must list disagreements explicitly and must not silently choose the implementer's own view.

## Mandatory questions for every reviewer

For every finding provide: **severity (P0/P1/P2), concrete failure mode, how it could create a false PASS or false FAIL, exact evidence or code path, mitigation, and a falsification test that would prove the mitigation works.**

Review at minimum these areas:

1. **Evidence freshness / stale-result mixing** — Can data from different commits, different baselines, or different runs be merged into one `results.json` and accidentally produce PASS?
2. **Route completeness** — Can the crawler miss JavaScript-only navigation, subdomains, query-driven pages, pagination, POST-created flows, hidden mobile menus, legacy aliases, or infinite/cyclic URL families?
3. **Hub-link completeness** — Can sampling, deduplication, normalization, visibility filtering, anchors, query strings, or redirect handling hide missing destinations?
4. **Redirect semantics** — How do we prove a redirect is semantically equivalent rather than merely successful HTTP navigation?
5. **Content-root selection** — Could `.col-content`, `main`, or "innermost main" select the wrong DOM region on a different page template and therefore compare the wrong content?
6. **Text comparison** — Can token overlap/substring matching pass missing or wrong paragraphs, reordered content, repeated boilerplate, or semantically different text with similar vocabulary?
7. **Structure comparison** — Can heading/paragraph/list/table/form counts pass a page whose actual hierarchy/order/layout is wrong?
8. **Media identity** — Can perceptual hashes false-match different images, miss crops/overlays, or sampling limits miss missing images deep in large galleries?
9. **Visual diff stability** — Browser version, OS/font rasterization, webfonts, animations, lazy-loading, third-party widgets, dates, rotating content, scrollbars, device scale factor, network timing, and responsive breakpoints.
10. **Visual scoring** — Can whole-page average pixel percentages hide one missing high-value section? Are 1440 and 390 sufficient to catch breakpoint defects?
11. **Baseline governance** — How can a stale or accidentally recaptured baseline normalize a regression? Who may re-baseline, when, and with what evidence?
12. **Function E2E coverage** — Are search/contact/wishbasket enough? Can direct DB checks be too implementation-coupled or miss application-level behavior?
13. **CI/runtime equivalence** — How do we prove the tested build/commit/browser/database is the same artifact being reviewed or released?
14. **Scale/cost/time** — How do we preserve full-site confidence without making every PR so expensive that checks get skipped or disabled?
15. **Exceptions/masks** — How do we stop volatile-region masks and accepted exceptions from becoming a permanent loophole?
16. **Checker self-verification** — What synthetic fixtures and known-bad pages must the checker itself fail before its results are trusted?
17. **Shared-template blast radius** — How do we detect that a global fix improves one page but breaks another family?
18. **Human review failure modes** — What still requires a person to inspect reference/clone/diff side by side, and how is that review recorded?
19. **Independent-agent convergence risk** — How do we prevent Claude/Codex/Gemini from inheriting the same incorrect premise or merely agreeing with the current implementation?
20. **Security/safety of the checker** — crawler load, form side effects, accidental production writes, secrets in screenshots/logs, SSRF-like URL following, and unsafe external fetches.

## Required adversarial fixtures

The reconciled plan must require automated fixtures that intentionally contain at least:

- HTTP 200 with wrong page content;
- specific detail URL redirected to a generic hub;
- missing section but low whole-page average pixel diff;
- desktop-correct/mobile-broken page;
- same image count but wrong images;
- missing image beyond the current media sample limit;
- correct text word set but one missing paragraph;
- same element counts but wrong heading hierarchy/order;
- broken link beyond any sampling boundary;
- stale VISUAL result from commit A merged with DOM/FUNCTION evidence from commit B;
- changed baseline silently making a known regression pass;
- shared-template fix that breaks an unrelated page family.

The acceptance system itself is **FAIL** until these known-bad fixtures are reliably rejected.

## Gate

VMK-P0-A checker implementation/acceptance can proceed only after all four reviews exist and the reconciliation converts the accepted findings into explicit code/test/evidence requirements. Evidence gathering may continue, but no broad PASS claim is allowed while this gate is open.
