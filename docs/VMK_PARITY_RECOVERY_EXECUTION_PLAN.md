# VMK P0 parity recovery — executable plan

## Product decision

The current rebuild is kept as the implementation base. It is **not accepted** as visually/structurally faithful yet. The target is now explicit: the new site must preserve the original VMK site's navigation/content behavior and look closely enough that material subpage differences are release blockers, not optional polish.

This plan turns that into machine-checkable work. It is not a new rewrite.

## 0. Ground truth already available

The existing full-site crawler discovered 1,974 reference routes. The existing route sweep proves many routes resolve locally, but that is insufficient: a specific legacy detail URL resolving to a generic hub/list page is not equivalent behavior. The existing 22-route parity canary also currently reports parity failures, proving that HTTP/route closure does not establish page parity.

The existing tools on this branch are reused:

- `tools/visual-oracle.mjs`
- `tools/clone-parity-oracle.mjs`
- `tools/clone-parity-visual.mjs`
- `tools/clone-parity-function.mjs`
- `tools/clone-parity-finalize.mjs`
- `tools/k2-classify-routes.mjs`
- `tools/k2-routes-from-classification.mjs`
- `tools/k2-full-inventory-report.mjs`

No new generic framework is allowed until these are proven insufficient for a named requirement below.

## 1. Build the reference graph, not just a URL list

### Deliverable

Generate `docs/parity-p0/reference-link-graph.json` from the frozen reference crawl. Each record must contain:

- source/reference URL;
- resolved reference URL/status;
- page family;
- every normalized same-site link visible in main content/navigation for that page;
- relationship type where detectable: `hub->list`, `hub->detail`, `list->detail`, `pagination`, `download`, `form/action`, `global-nav`;
- anchor text;
- whether the destination is itself in the 1,974-route inventory.

Generate the same graph for the clone as `clone-link-graph.json`.

### Hard comparison

For every reference edge `A -> B`, the clone must produce an equivalent edge from clone(A) to clone(B), after an explicit canonical mapping. A redirect is accepted only when the final target is the equivalent page/content.

A specific reference detail URL ending at a generic hub/list page is **FAIL_GENERIC_FALLBACK**, not PASS.

### First P0 scope — hub links

Before broader remediation, test every primary hub/list page reachable from the homepage/navigation and **every internal destination linked from those hubs**. The P0 report must show:

`hub | reference destinations | clone destinations | missing | wrong target | broken | generic fallback | PASS/FAIL`

P0 hub acceptance = **zero missing, zero broken, zero wrong-target, zero generic-fallback edges** in the selected active hub families.

## 2. Freeze visual reference evidence

Create `docs/parity-p0/reference-manifest.json` with the exact reference capture time and route set. Capture and retain reference screenshots so the target does not move during remediation.

Required viewports:

- desktop: 1440 px width;
- mobile: 390 px width.

For each checked route retain:

- reference screenshot;
- clone screenshot;
- diff heatmap;
- measured page height on both sides;
- diff percentage;
- explicit masks/exemptions, if any, with a reason.

No silent cropping/resizing to hide missing sections. No changing thresholds to make a failing route pass.

## 3. Split parity into two layers

### Layer A — shared chrome/template parity

Measure header, navigation, container/grid, sidebar, footer, base typography and responsive breakpoints separately from page body. Fix these first because one shared defect affects hundreds of pages.

A template/chrome change is not accepted until the representative routes for **all families using that template** are rerun on desktop and mobile.

### Layer B — page-family/content parity

Classify all discovered routes into families. At minimum:

1. homepage;
2. institutional/static pages;
3. news list;
4. news detail;
5. event list;
6. event detail;
7. gallery hub/list;
8. gallery/album detail;
9. departments/branches;
10. staff;
11. documents/downloads;
12. search;
13. contact;
14. wishbasket/forms;
15. legacy/redirect routes.

Each family gets a versioned representative corpus plus full route/link coverage. Do not infer that one good page means the whole family is good.

## 4. Exact page acceptance vector

Every route under review gets these fields:

`ROUTE | CONTENT | MEDIA | LINKS | STRUCTURE | FUNCTION | VISUAL_DESKTOP | VISUAL_MOBILE | FINAL`

`FINAL=PASS` only when every applicable field is PASS.

The following always block release: `FAIL`, `PARTIAL`, `ERROR`, `NOT_EVALUATED`, `METHODOLOGY_BLOCKED`.

### Visual provisional threshold

Until the multi-review replaces it with a stricter evidence-backed value, use the project's existing <=5% pixel-difference target for stable frozen-reference pages as the provisional acceptance target. A route cannot pass merely because its average diff is below threshold if a whole section is missing, reordered, or materially different; the height/structure gates independently block that false positive.

## 5. Remediation order — no page-by-page random patching

Work in this exact order:

### R1 — shared shell

Header/nav -> global container widths -> sidebar -> footer -> base typography -> mobile breakpoints.

Exit: representative pages from every family rerun; no shared-shell regression.

### R2 — hub/list templates and link graph

Homepage hubs, news/events/gallery/institutional/department hubs. Fix target mapping and list/card layout before details.

Exit: P0 hub-link table has zero missing/broken/wrong/generic-fallback edges in the active hub set.

### R3 — detail templates

News detail -> event detail -> gallery detail -> institutional/detail pages -> branch/staff/document pages.

Exit: each family representative passes all applicable dimensions on desktop/mobile.

### R4 — content/media migration gaps

Only after templates are correct, repair missing text/images/documents/related-content blocks. Content identity is compared against the frozen reference, not guessed from screenshots.

### R5 — exceptions

A route-specific exception is allowed only when the reference itself has anomalous/legacy behavior and the exception is documented with evidence. No route-specific CSS/redirect patch is allowed merely to silence the oracle.

## 6. Automated gate on every change

The branch CI must run a bounded fast gate on every PR/change:

1. build/type/unit tests;
2. route/hub link graph diff for the affected families;
3. clone parity oracle for the affected family corpus;
4. desktop + mobile visual capture/diff;
5. function checks where applicable;
6. finalizer computes the verdict.

The full 1,974-route link/redirect sweep and the full representative visual board run before release acceptance, not necessarily on every tiny commit.

Artifacts retained from CI: JSON verdicts, screenshots, heatmaps, and a generated HTML review board.

## 7. Human-visible review board

Generate one owner-facing report with one row/card per route:

- reference screenshot;
- clone screenshot;
- heatmap;
- eight-dimensional verdict;
- exact failing reasons;
- linked hub/list parent;
- final target URL after redirects;
- accepted exception, if any.

This is the release evidence. A textual statement such as `RC GO` is not sufficient.

## 8. Roles and control

- **Claude/Cloud — Builder:** implements only the currently active remediation family.
- **Codex — adversarial reviewer:** tries to find false PASSes, wrong redirects, missing links, threshold/mask abuse and family regressions. It does not open an alternate redesign.
- **Gemini/Jeremy — independent reference reviewer:** independently checks live/frozen-reference page-family coverage and whether high-value routes/links/media were missed by the oracle.
- **ChatGPT/Product Architect — supervisor:** owns acceptance contract, compares the three findings, rejects scope drift, and does not declare PASS without machine evidence plus the review board.

Only one remediation family is ACTIVE at a time. Reviewers do not write competing implementations.

## 9. Immediate first implementation slice

**VMK-P0-A: Hub-link and shared-shell proof**

1. Freeze the current reference route/link graph.
2. Identify all primary hub/list pages reachable from home/nav.
3. Enumerate every internal destination from those hubs on reference and clone.
4. Produce the first hub parity table.
5. Fix shared header/container/sidebar/footer differences that affect those hubs.
6. Fix missing/wrong/generic-fallback hub destinations.
7. Capture desktop/mobile reference/clone/diff for every primary hub.
8. Rerun route/content/media/link/structure/function/visual gates.
9. Codex falsifies the result.
10. Gemini independently checks that the hub corpus and destinations are complete.
11. ChatGPT reconciles findings; only then is VMK-P0-A PASS.

### VMK-P0-A Definition of Done

- all primary hubs are enumerated;
- every reference hub destination is accounted for;
- zero broken/missing/wrong/generic-fallback hub edges in the active P0 set;
- every primary hub has desktop + mobile comparison artifacts;
- shared chrome/template differences are below the agreed gate and have no missing/reordered section;
- independent Codex review PASS or findings fixed;
- independent Gemini review PASS or findings fixed;
- owner-facing review board exists.

Only after that does the next family enter ACTIVE remediation.
