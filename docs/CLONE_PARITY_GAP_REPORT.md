# Clone Parity Gap Report (K1, COLLAB.md section 5)

Generated from `tools/clone-parity-oracle.mjs` against `tools/parity-canary-routes.json`
(22 routes) run against `https://www.vmk.hu` (reference) and `http://localhost:3011`
(clone, current branch build). Raw data: `docs/parity-oracle-v2/results.json`,
human-readable: `docs/parity-oracle-v2/report.html`.

**Purpose**: prove the old `tools/visual-oracle.mjs` acceptance model (HTTP 200 +
word-set Jaccard text similarity + raw image/link *counts*) let false positives
through, and quantify the real gap. This is **not** meant to be a passing run —
per COLLAB.md K1, the canary's job is to surface what the old model missed.

## Headline result

| Overall | Count |
|---|---|
| Scored routes | 22 / 22 (0 excluded as `CANARY_MAPPING_ERROR`) |
| PARITY_PASS | 0 / 22 |
| PARITY_PARTIAL | 0 / 22 |
| PARITY_FAIL | 22 / 22 |

Every canary route fails on at least one real, evidenced dimension, across
all 7 dimensions (URL, TEXT, MEDIA, LINKS, STRUCTURE, FUNCTION, VISUAL). All
22 canary routes' reference paths resolved correctly this round (the
`/kapcsolat` → `/elerhetosegeink` mapping fix from an earlier round holds);
`CANARY_MAPPING_ERROR` is implemented and would exclude a route from these
totals if its reference path were wrong, but none triggered it here.

## K1 round 3: fixed a real false-positive in the scoring itself

ChatGPT's round-2 review (commit `f284c89`) found a P0 bug in the tool, not
the site: `overall`/`PARITY_PASS` was computed from only 4 of the 7 gate
dimensions (URL/TEXT/MEDIA/LINKS) — `STRUCTURE`, `FUNCTION`, and `VISUAL`
were never folded into the final verdict, even after `clone-parity-visual.mjs`
and `clone-parity-function.mjs` merged real data for those dimensions into
the same `results.json`. The round-2 report's headline "`PARITY_PASS: 1/22`"
(`/konyvtarunkrol`) was itself a false positive by the tool's own stated
gate: that route's VISUAL diff is 22.25% desktop / 48.58% mobile (`FAIL`
threshold is >40%), which round 2's scoring never looked at.

Fixed by extracting the decision into one shared function,
`computeOverall()` in `tools/lib/parity-scoring.mjs`, used by both the
initial oracle pass and a new required last pipeline step,
`tools/clone-parity-finalize.mjs`, which recomputes `overall` for every
route from the fully-merged URL/TEXT/MEDIA/LINKS/STRUCTURE/FUNCTION/VISUAL
data and regenerates `summary.json`. A route is `PARITY_PASS` only if every
*applicable* dimension is `PASS` — `NOT_APPLICABLE` (with a reason) is the
only status excluded from the requirement; `NOT_EVALUATED`,
`METHODOLOGY_BLOCKED`, `ERROR`, `PARTIAL`, and `FAIL` all block it. Running
`clone-parity-finalize.mjs` on this round's data changed exactly one route's
verdict: `/konyvtarunkrol` went from the round-2-reported `PARITY_PASS` to
the correct `PARITY_FAIL` (VISUAL fails), which is direct proof the fix
does what it's supposed to.

A falsification self-test (`tests/clone-parity-scoring.test.ts`, 8 cases,
run via `npm run test:unit`) asserts this can't regress: a synthetic route
passing URL/TEXT/MEDIA/LINKS but failing STRUCTURE, VISUAL, or FUNCTION
individually must never resolve to `PARITY_PASS`.

## Methodology note: two real bugs found and fixed while building this tool

Building the tool itself surfaced two false-positive-shaped problems in the
**measurement approach**, not the site, which were root-caused and fixed before
trusting the canary numbers above (see `tools/clone-parity-oracle.mjs` history /
commit `5452a22` → current):

1. **Wrong content selector, both sides.** First pass generically stripped
   `header/nav/footer/aside` from the whole page and compared what remained. The
   reference site's real per-page template puts the actual article body in
   `.col-content` and a ~90-link sitewide promo/menu sidebar in a sibling
   `.col-box` that isn't a semantic `<nav>`/`<aside>` — so the sidebar was being
   compared as if it were page content, which produced a near-uniform ~1%
   "link coverage" on almost every route (an artifact, not a real gap). Fixed by
   selecting `.col-content` directly on the reference side.
2. **Nested `<main>` on the clone.** The clone's root layout wraps every page in
   `<main className="flex-1">`, and `PageWithSidebar` (used by most content pages)
   nests a second, more specific `<main>` inside that for the real content, with
   `<SiteSidebar>` as a sibling before it. Selecting the *first* `<main>` on the
   clone side picked up the outer wrapper, i.e. the sidebar too, producing 0% text
   coverage on pages that actually match well (confirmed manually: the clone's
   `/hirek/strandkonyvtar` correctly shows the real article body once you look
   past the sidebar noise). Fixed by selecting the *last* (innermost) `<main>`.

Both fixes are narrow, mechanical, and verified by direct before/after inspection
of the extracted text (see commit history) — not a threshold change or a way to
make failures look smaller.

## Dimension-by-dimension findings

### URL

- 20/22 routes: reference and clone both resolve (2xx), no redirect issue.
- 2/22 (`/gallery/folder/1023`, `/a-mi-vilagunk-kiallitas-megynito-2016-12-05`):
  `FAIL_GENERIC_REDIRECT`. These are exactly the gallery-archive family the H1-H4
  round closed with a bulk `/galeria` fallback redirect. Per COLLAB.md's explicit
  K1 rule ("generikus listaoldalra redirect nem helyettesíthet egy konkrét
  referencia detail/gallery oldalt"), this is correctly **not** a pass — see
  Gallery/Archive Family section below for the full quantification.
- `/kapcsolat`'s `refPath` was corrected to `/elerhetosegeink` in an earlier
  round (was 404ing under the wrong path) and resolves correctly (`PASS`) in
  every round since — no longer an open issue.

### TEXT (ordered main-content coverage, not word-set Jaccard)

Only `/konyvtarunkrol` reaches 100%. Everything else ranges 0%-50%. Two distinct
root causes found, not one blanket "text is missing":

1. **Genuinely reference-side image-only content.** `/strandkonyvtar` (and
   several other news items) checked directly against the raw reference HTML:
   the reference's `.news-details` body for this article contains **only two
   `<img>` tags with no alt text and no paragraph text at all** — a scanned
   flyer image, not a text article. 0% text coverage here is *correct*, not a
   bug: there is close to no reference text to cover. The clone independently
   has a written summary ("Strandkönyvtárral várjuk kikapcsolódásra vágyó
   olvasóinkat...") that isn't literally reference-text-derived — likely a
   manual editorial transcription from the flyer image in an earlier round.
   That's a legitimate content decision, but it means TEXT coverage alone
   under-reports these pages; MEDIA (does the clone show the actual flyer
   images?) is the more meaningful dimension for this sub-family, and is
   tracked separately below.
2. **Genuinely missing/short-form content on other pages** (`/munkatarsak` 0%,
   `/nyitvatartas` 0%, `/dokumentumok` 14.3%, several department/branch pages
   0-16%) — these need individual investigation in K2/K3 to determine whether
   the underlying Pages/Staff/Libraries content is actually incomplete versus
   another extraction-selector mismatch specific to that page template. Not
   resolved in this K1 pass; each is listed with its coverage % and a sample of
   missing reference lines in `docs/parity-oracle-v2/results.json`.

### MEDIA (content-identity matching + full delivery-mechanism extraction)

The round-1 pass only compared image *counts* and alt-text overlap. Round 2
replaced that with real content-identity matching
(`compareMediaByIdentity` in `tools/clone-parity-oracle.mjs`): downloads up
to 20 sampled images per side, computes a perceptual hash (8x8 grayscale
average-hash via `sharp`, already a project dependency) for each, and
matches reference images to clone images by Hamming distance (≤10 bits of
64 counts as a match) rather than URL or position. **Verified this actually
works, not just runs**: on the homepage, it correctly matched a reference
image at `/_upload/news_pic/600x600/4_5787.png` to the clone's
`/_next/image?url=%2Fapi%2Fmedia%2Ffile%2Fnyari-nyitvatartas-2026.png`
(distance 1/64) — a completely different URL, host, and encoding, exactly
the rehosting scenario the review named — while correctly rejecting the
reference's own generic fallback icon (`/assets/images/img_news.png`,
repeated many times in the "related news" sidebar) as unmatched (distance
25/64, well past the threshold).

**Round 3 fix (ChatGPT review, commit `f284c89`, item 2)**: round 2 disclosed
that the gallery-archive family's real thumbnails weren't showing up in
extraction at all. Root cause, confirmed directly against the live
reference (`curl https://www.vmk.hu/gallery/folder/1023`): the album grid
renders each photo as `<figure style="background-image:url('...')"
alt="...">`, not `<img src>` — 16 of these inside `.col-content` on that one
page alone. Extraction (`extractPageData` in `tools/clone-parity-oracle.mjs`)
now inventories three delivery mechanisms, not just `<img src>`:
`[style*="background-image"]` (parsed via regex), `img[srcset]`/
`source[srcset]`, and broader lazy-load attribute fallbacks
(`data-src`/`data-original`/`data-lazy-src`), deduped by resolved URL. This
is a measurable, verified fix, not a guess: reference image counts on the
gallery-archive canary routes went from the round-2-reported near-zero to
**12, 12, 8, 17, and 19** real extracted images across `/gallery`,
`/galeria`, `/galeria/vizcsepp-2026-03-09`, `/gallery/folder/1023`, and
`/a-mi-vilagunk-...` respectively. All five still correctly score MEDIA
`FAIL` — 0% identity coverage, i.e. the clone genuinely doesn't have these
specific reference photos, a real content gap the tool can now see and
quantify precisely (matched/missing per photo in `results.json`), not a
methodology blind spot.

New safety net for the remaining risk (route where extraction *still* finds
nothing on a media-heavy page): a media-heavy family (`gallery`,
`gallery-archive`, `gallery-detail`, `gallery-hub`) reporting `refCount: 0`
now scores `METHODOLOGY_BLOCKED`, not a vacuous `PASS` — never satisfies the
`PARITY_PASS` gate. Not triggered on this canary (extraction now succeeds
everywhere it's tried), but stops a future 0-vs-0 case from silently passing.

Result across the canary: **5/22 MEDIA PASS** — `/hirek/202608_spiro-80-...`
(1/1 sampled images matched, real identity coverage), plus `/konyvtarunkrol`,
`/munkatarsak`, `/nyitvatartas`, `/kapcsolat` (genuinely no images on either
side for these specific routes — non-media-heavy families, so 0/0 is treated
as a real pass, not methodology-blocked). The remaining 17/22 are FAIL with
0% identity coverage on their sampled images, a real, now fully-explained
content gap.

- **Broken images**: gallery-family routes (`/gallery`, `/galeria`,
  `/gallery/folder/1023`, `/a-mi-vilagunk-...`) still show **46 broken
  images each** — confirmed by direct `curl`,
  `http://localhost:3011/brand/logos/vmk-logo.png` returns **404**. Same
  root cause across all four, a genuine bug this tool found (not fixed in
  K1, per the "no product remediation" rule — recorded for K2/K3).

### LINKS

Fails on nearly every route except `/konyvtarunkrol`, `/nyitvatartas`, and
`/reszlegek/olvasoterem`. The dominant pattern (visible in `missingInternal` in
the raw JSON): every reference article page ends with a **"További híreink"
("More news") block linking to several other, unrelated news items** — the
clone's equivalent pages don't replicate this specific related-content block.
This is real, consistent, actionable signal (not leftover sidebar noise, since
the sidebar-selector bug above is already fixed) — worth a root-cause fix (a
"related news" component) rather than one-off patches, per COLLAB.md's explicit
instruction not to hand-patch route by route.

### STRUCTURE

Heading/paragraph/list/table/form counts recorded both sides, with a real
status (a deficit in any block type vs. the reference counts as FAIL/
PARTIAL, an excess is not penalized since the clone's own components can
legitimately add markup): **2 PASS, 11 PARTIAL, 9 FAIL** across the 22
routes. Per-route deficits (which specific block type is short) are in
`docs/parity-oracle-v2/results.json`.

### VISUAL (desktop 1440 / mobile 390, real pixelmatch diff)

Now implemented (`tools/clone-parity-visual.mjs`) and run across all 22
canary routes, both viewports (132 real PNG captures: ref/clone/diff per
route per viewport, in `docs/parity-oracle-v2/screenshots/`). Every route
diffs at 20-70%, mobile consistently worse than desktop (30-70% vs 22-55%).

This is **expected and not itself a defect** — the project is a modern
rebuild with a different visual design system from the reference's legacy
CMS template, not a pixel-identical clone (per COLLAB.md's own priority
list, pixel-perfect matching is explicitly the lowest priority, opt-in
only). The VISUAL dimension's purpose per COLLAB.md is narrower: catch a
*missing section* hiding behind a coarse pass/fail, which is why the diff
algorithm pads both images to the taller of the two heights before
diffing (rather than resizing/cropping one to match the other) — a large
height mismatch shows up as diffed area instead of silently disappearing.
`refHeight`/`cloneHeight`/`heightDeltaPct` are recorded per route in the
raw JSON for exactly this check. Full per-route diff images are in the
HTML report (`docs/parity-oracle-v2/report.html`) for visual inspection,
not just a percentage.

This dimension is why `/konyvtarunkrol`'s overall verdict changed in round
3 (see "K1 round 3" section above): its VISUAL diff (22.25% desktop /
48.58% mobile) exceeds the `FAIL` threshold, and now that VISUAL is
correctly folded into `overall`, that route is `PARITY_FAIL` like every
other canary route -- not the `PARITY_PASS` round 2 reported.

### FUNCTION (real E2E with verified DB persistence, not UI-success-text-only)

Implemented (`tools/clone-parity-function.mjs`) for the three canary routes
with real interactive workflows in scope this round -- **search, kapcsolat
(contact form), wishbasket** -- all **PASS** with real evidence.

**Round 3 fix (ChatGPT review, commit `f284c89`, item 4)**: round 2's
contactForm/wishbasket checks only asserted a UI success message rendered,
which the review correctly flagged as insufficient where the workflow's
whole point is a persisted side effect -- a 200 response and a success
toast don't prove the row was actually written. Fixed: after the UI
confirms success, the check now queries the real Postgres DB directly
(`docker exec vmk-postgres psql`, same database the app itself writes to)
for a row matching the test's unique marker, then deletes that exact row
and re-queries to confirm the delete took effect, before returning PASS.
`PASS` now requires both `persisted: true` and `cleanupVerified: true`, not
just a UI string match.

- **search**: typed a real query into `/kereses`, got 10 real results
  rendered, clicked through, landed on the actual article page
  (`/hirek/konyvtar-a-gyermekreszlegen-tul`).
- **kapcsolat**: submitted the real contact form with marker
  `K1-FUNC-TEST-1786908468343`; confirmed success message, confirmed the
  row landed in `contact_messages` (id `8`), deleted it, confirmed the
  delete (`cleanupVerified: true`).
- **wishbasket**: submitted the real wish-request form with marker
  `K1-FUNC-TEST-1786908473303`; confirmed success message, confirmed the
  row landed in `wish_requests` (id `9`), deleted it, confirmed the delete
  (`cleanupVerified: true`).

`users` table row count confirmed unchanged (1 real row) after both runs;
no test data left behind in either table.

**K1 review correction**: earlier drafts of this report cited prior rounds'
(C1/C2/D1/D2/H4/I1) E2E evidence for hírlevél/teremfoglalás/registration/
gallery-detail/admin-publish/PDF-download as if it satisfied K1's FUNCTION
requirement for those workflows. It does not -- that evidence is from a
different point in the branch's history, not this K1 canary, and citing it
here risked being read as a current PASS. Corrected: every canary route
without a workflow re-verified in *this* K1 pass is explicitly
`NOT_APPLICABLE` (no distinct interactive workflow on that specific route)
in `docs/parity-oracle-v2/results.json`, and the workflows listed above are
**not claimed as K1 FUNCTION evidence** — re-verifying them with fresh,
dated evidence is K2/K3 scope, same as everything else not directly
covered by this round's 3 checks.

## Gallery/Archive family quantification (COLLAB.md K1 item 7)

The H1-H4 round closed 1626 gallery-archive routes with a blanket
`/galeria` fallback redirect, classified `ARCHIVED/LEGACY`. This K1 canary
directly tested 2 representative members of that family
(`/gallery/folder/1023`, a folder-index page, and
`/a-mi-vilagunk-kiallitas-megynito-2016-12-05`, an individual dated album page)
and both:

- resolve to the generic `/galeria` listing on the clone (confirmed
  `cloneRedirectTarget: /galeria` in the raw JSON);
- have **0% measured text coverage** against their specific reference content
  (a specific exhibition-opening announcement with named photos, not the
  generic gallery listing);
- the individual album page's reference `.col-content` genuinely lists **18
  actual photo filenames** (`Mi-vilagunk-20161205--01.jpg` through `--13.jpg`,
  `AMivilágunk-20161205--14.JPG` through `--18.JPG`) that are **not** present
  anywhere on the clone (0 of them appear at `/galeria` or in the Galleries
  collection).

This is **direct, per-route confirmation** that the H1-H4 bulk classification
was a real false positive for at least this sample: the reference has specific,
nameable photo content per gallery-archive page that the clone does not import,
and the generic `/galeria` fallback does not represent it. Full quantification
of all 1626 routes (how many have real, distinct photo sets vs. how many are
themselves empty/technical on the reference) is K2 scope (full reference
inventory), not repeatable one-by-one in a 22-route canary — but this sample
is sufficient to invalidate treating the whole family as accepted without
further work.

## Known canary-list issues to fix before the next run

- TEXT coverage needs a documented low-confidence flag when the reference's
  extracted content is very short (e.g. image-only articles) rather than being
  read at face value as "0% = totally missing."

## Recommended next steps (K1 continuation / K2 handoff)

1. Fix the `vmk-logo.png` 404 (quick, isolated, real bug this tool found).
2. Build a "related news" component to close the LINKS gap's dominant pattern,
   rather than patching per-route.
3. K2: full reference saturation crawl + per-route TEXT/MEDIA/LINKS/STRUCTURE/
   VISUAL deficit quantification, focused first on current first-hop, then
   depth-2, then the gallery/media family at full scale (not just the
   2-route sample above).
4. Independent Gemini canary evidence (`agent/gemini-final-audit`) is still
   outstanding and out of Claude's control -- K1 acceptance is blocked on it
   per COLLAB.md's own rule, not on anything in this tool.
