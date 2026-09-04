# ChatGPT / Product Architect — independent risk review of the VMK parity checker

**Review mode:** independent first pass
**Scope:** the checking system itself, not the current website defects

## Executive finding

The proposed direction is sound, but the current implementation is not yet safe enough to act as a release authority. The largest risk is **false PASS from evidence that looks comprehensive but is actually stale, sampled, or measured against the wrong region/baseline**. I would not trust the current `PARITY_PASS` as a release gate until the P0 items below are fixed and falsified.

## P0 findings

### P0-1 — stale evidence from different runs can be merged into one result

**Verified code path:** `clone-parity-oracle.mjs::flushResults()` preserves prior `visual` data and prior `function` data when rewriting a route after a fresh DOM/content pass. The separate visual and function scripts also merge into the same long-lived `results.json`.

**Failure mode:** code changes on commit B; DOM/text is rerun, but VISUAL from commit A is carried over. `clone-parity-finalize.mjs` then recomputes `overall` from a mixture of evidence produced by different commits/runs. A stale PASS can therefore contribute to a current PASS.

**Mitigation:** every evidence fragment must carry a mandatory tuple:
`run_id + tested_commit_sha + baseline_id + browser_build + viewport + generated_at`.
The finalizer must refuse to combine dimensions whose tuple does not match the active run. No carry-over is accepted as current evidence.

**Falsification test:** create commit A with passing visual evidence; modify the page in commit B without rerunning visual; rerun DOM + finalizer. Expected result: hard `STALE_EVIDENCE`/FAIL, never PASS.

### P0-2 — hub/broken-link checking is sampled

**Verified code path:** `checkBrokenLinks(..., limit = 15)` checks only the first 15 links.

**Failure mode:** the 16th or later link is broken/wrong; hub can still appear clean.

**Mitigation:** P0 hub-link verification must exhaustively follow every deduplicated reference content link in the active hub scope. Sampling is permitted only for non-gating diagnostics, never for release acceptance.

**Falsification test:** synthetic hub with 30 valid links and link 29 broken. Expected result: FAIL and exact edge reported.

### P0-3 — media identity is sampled at 20 images

**Verified code path:** `MEDIA_HASH_LIMIT = 20`.

**Failure mode:** gallery's first 20 images match while image 21+ is missing/wrong; identity coverage can look perfect.

**Mitigation:** for media-heavy families, exhaustive identity inventory is required for release gate, or a separately justified deterministic sampling contract that can never label the family PASS without a complete inventory. Prefer metadata/content hashing for all images after bounded download/concurrency controls.

**Falsification test:** 25-image gallery with first 20 correct and 21-25 wrong. Expected release verdict: FAIL.

### P0-4 — visual evidence currently uses conflicting acceptance thresholds

**Verified code paths:** `clone-parity-visual.mjs` currently marks <=15% as PASS; `visual-oracle.mjs` defaults to max 5% pixel diff.

**Failure mode:** pages that are materially different may be accepted by one checker and rejected by another.

**Mitigation:** one versioned acceptance contract, one shared threshold source, no threshold duplicated in scripts. Threshold change requires independent review and cannot be made in the same change solely to turn a failure green.

**Falsification test:** feed the same 8% fixture through every visual entry point. They must return the same verdict.

### P0-5 — whole-page visual averages can hide localized catastrophic defects

**Failure mode:** a full section disappears from a long page but occupies only a small percentage of total pixels, leaving average diff below threshold.

**Mitigation:** visual gate must combine global pixel diff with region/block assertions: major landmark presence, height delta, content-block bounding boxes, and missing-section detection. A missing required block is hard FAIL regardless of global percentage.

**Falsification test:** remove one complete middle section from a very long page while keeping the rest pixel-identical. Expected: FAIL.

### P0-6 — baseline recapture can normalize a regression

**Failure mode:** a developer unintentionally or deliberately captures the already-broken clone/reference state as the new accepted baseline, making the regression disappear.

**Mitigation:** baseline is immutable by default; each baseline has ID, source URL set, timestamp, reference content checksum, browser image/version and approving reviewer/owner. Re-baseline is a separate reviewed change with a diff against the prior baseline and explicit reason.

**Falsification test:** alter known reference fixture, recapture without approval metadata. Finalizer/CI must reject the baseline.

### P0-7 — test evidence is not yet cryptographically/logically bound to the reviewed commit

**Failure mode:** screenshots/results generated from a local working tree or older build are shown alongside a newer PR head.

**Mitigation:** evidence manifest records git commit SHA and dirty-tree status; dirty trees are non-release evidence. CI builds the exact SHA, starts that artifact, runs the checker, and uploads evidence tied to workflow/run SHA.

**Falsification test:** generate results on SHA A, then point CI/review to SHA B. Expected: `EVIDENCE_COMMIT_MISMATCH` and FAIL.

## P1 findings

### P1-1 — content root selectors can select the wrong DOM subtree

`.col-content` and innermost `main` are known fixes for current templates, but alternate reference/clone templates can legitimately structure content differently. Wrong selection can create both false positive and false negative results.

**Mitigation:** selector choice must be page-family-specific and validated by invariants (expected H1/title, visible area, minimum content), with `METHODOLOGY_BLOCKED` when the expected root is absent rather than falling back silently to body.

### P1-2 — text matching can false-pass semantically wrong content

Substring and >=85% token overlap are lexical heuristics. Repeated boilerplate or near-identical sentences with one critical changed phrase can match. Sentence splitting also loses block semantics.

**Mitigation:** compare normalized block sequences (headings + paragraph blocks) and require coverage per required block; use exact/near-exact normalized text for frozen reference where possible. Any fuzzy matcher must expose which source block matched which clone block.

### P1-3 — structural counts are too weak

Having at least the same number of headings/paragraphs/lists/tables/forms does not prove the hierarchy, order, nesting, columns or section grouping is correct; excess elements are currently not penalized.

**Mitigation:** compare an ordered structural signature/DOM outline and landmark geometry, not just counts. Family-specific required structure should be explicit.

### P1-4 — perceptual hash can false-match or false-miss

aHash is intentionally coarse. Similar low-frequency images can collide; crops, overlays or large color/layout changes may exceed threshold even when semantically the same.

**Mitigation:** combine dimensions: SHA/content hash where exact copied asset exists, pHash/dHash/aHash ensemble or stronger perceptual metric for re-encoded copies, dimensions/aspect ratio, and manual review for ambiguous distance bands. Never let a single weak perceptual hash decide a high-value image.

### P1-5 — only 1440 and 390 miss breakpoint failures

A site can work at 390 and 1440 but fail at Bootstrap/Tailwind breakpoints such as ~768, 992, 1024, 1200.

**Mitigation:** add breakpoint canaries at minimum around each layout breakpoint: e.g. 390, 767/768, 991/992, 1199/1200, 1440; full screenshots need not run at every width on every PR, but structural responsive assertions should.

### P1-6 — visual nondeterminism can cause noisy false FAIL/PASS

Sources include fonts, third-party widgets, time/date content, rotating news, lazy loads, network timing, scrollbar differences, Chromium updates, OS rendering and device scale factor.

**Mitigation:** containerized browser/OS/fonts; fixed locale/timezone/deviceScaleFactor; block or freeze third-party volatile content with route-specific reviewed masks; deterministic data fixture where clone content itself is dynamic; retry only to diagnose flake, never to majority-vote a PASS.

### P1-7 — masks/exceptions can become a loophole

**Mitigation:** each mask/exception requires route/family, exact rectangle/selector, reason, expiry/review date, approver and before/after artifact. CI reports total masked area and fails on unreviewed growth.

### P1-8 — crawler completeness is not equivalent to product completeness

A BFS on `<a href>` can miss JS-only navigation, forms, subdomains, query state, deep pagination, authenticated routes, or content only reachable through UI actions. Infinite pagination can also explode.

**Mitigation:** combine crawl sources: HTML anchors, known sitemap(s), CMS route inventory, legacy route map, configured subdomains, and explicit functional-flow inventory. Persist provenance for every discovered route and known excluded family.

### P1-9 — URL normalization can collapse meaningful distinctions

Trailing slash removal and query normalization are useful, but query parameters may select real content, pagination or filters. Anchor fragments may point to required on-page sections.

**Mitigation:** route-family normalization rules, not one global simplifier. Preserve meaningful query keys and test fragment targets separately where they are product-relevant.

### P1-10 — redirect semantic equivalence is hard

A 301 to a different path can be correct canonicalization or a lossy generic fallback. Path equality alone is insufficient.

**Mitigation:** expected mapping must include entity/content identity. A canonical redirect passes only if target retains the same entity/title/content identity. Generic list targets fail.

### P1-11 — global shell fixes can regress unrelated families

**Mitigation:** maintain a dependency map from shared components to representative families; any change to Header/Footer/SiteSidebar/PageWithSidebar/global CSS/layout tokens automatically expands the PR test matrix.

### P1-12 — function E2E coverage is narrow and implementation-coupled

Current automated function checks cover search/contact/wishbasket, with persistence checked directly through Postgres. DB verification is strong for side effects but couples tests to current storage schema and does not prove downstream behavior such as notifications or moderation.

**Mitigation:** define a function inventory by route/family and test each user-visible effect at the application boundary, adding DB/storage verification only where it proves persistence. Storage adapters should expose test helpers rather than hard-coded table assumptions where feasible.

### P1-13 — search function evidence is global rather than route-bound

The function script stores `search` in `functionChecks`, while routeMap currently binds only `/kapcsolat` and `/wishbasket` to per-route records. If `/kereses` becomes a gated route, its per-route FUNCTION verdict can remain absent/not-applicable despite a separate search check.

**Mitigation:** every interactive check must attach to its canonical route/family record and be included in finalizer applicability rules.

## P2 / operational findings

### P2-1 — full-site exhaustive visuals can become too expensive

1974 routes x multiple viewports x screenshots/media hashing can make PR checks slow enough that developers seek ways around them.

**Mitigation:** two-speed gating:
- every PR: affected family + all shared-shell dependents + all P0 hubs + all-route link/redirect integrity;
- scheduled/release: full-site visual/media saturation run.
A release cannot rely only on the fast tier.

### P2-2 — reference availability/network failures need separate classification

A temporary reference timeout must not be interpreted as clone failure or silently passed.

**Mitigation:** `REFERENCE_UNAVAILABLE`/`CAPTURE_BLOCKED`, with cached frozen baseline fallback only when baseline identity is valid.

### P2-3 — checker itself can create side effects/load

Exhaustive crawling, form submissions and image downloads can overload the reference or accidentally write to production-like systems.

**Mitigation:** rate limits/concurrency caps, robots/owner-approved scope, safe test environment for writes, synthetic marker cleanup, explicit allowlist for hosts, and no arbitrary URL following outside approved origins.

### P2-4 — secrets/PII can leak into screenshots or logs

**Mitigation:** never run acceptance screenshotting on authenticated admin/PII pages unless specifically sandboxed; redact secrets in logs; artifact access controls; test data only.

## Required checker-self-tests before trust

Before the VMK checker can become release authority, it must reject known-bad synthetic fixtures for: generic redirect, wrong 200 content, link beyond index 15, wrong image beyond index 20, stale cross-commit VISUAL, missing block with low average diff, desktop-only PASS/mobile FAIL, same counts/wrong structure, stale baseline recapture, and shared-shell regression.

## Acceptance recommendation

Keep the existing checker code as a useful foundation, but treat it as **measurement infrastructure under test**, not yet as the final arbiter. Fix P0-1 through P0-7 first, then run the independent Claude/Codex/Gemini reviews and reconcile disagreements. Only after the checker itself passes adversarial fixtures should it be allowed to gate VMK page acceptance.
