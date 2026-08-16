# GEMINI CLONE PARITY CANARY AUDIT — www-vmk

Branch: `agent/gemini-final-audit`
Primary implementation branch: `agent/visual-clone-oracle`
Mode: **CLONE PARITY RECOVERY — independent audit**

## MANDATORY WORKTREE ISOLATION

**One agent = one branch = one worktree.**

Gemini must NOT run `git checkout`, `git switch`, edit, reset or stash inside the shared `/srv/projects/www-vmk` working tree while Claude is active. Use a dedicated Gemini worktree, preferably:

```text
/srv/projects/www-vmk-gemini -> agent/gemini-final-audit
```

Do not ask the user to arbitrate branch/worktree handling.

## Current governing goal

The previous route-parity claims (`MISSING=0`, `BROKEN=0`, FIRST-HOP/Depth-2/Full-site VERIFIED) are **not valid clone-parity evidence**. The prior checks could pass pages with missing text, media, links, documents or major visual differences.

Your task is to perform an **independent reference-vs-clone false-positive audit** while Claude builds Clone Parity Oracle v2 on the primary branch.

Use the current `agent/visual-clone-oracle` branch as the clone implementation under audit, but do not modify it.

## Required canary sample

Audit at least 20 deliberately mixed reference routes from `https://www.vmk.hu/`, including:
- `/`;
- at least 5 current news/event detail pages;
- at least 5 static/institutional pages;
- at least 3 branch/department pages;
- `/gallery` plus at least 3 concrete gallery/detail/archive routes;
- `/wishbasket`;
- at least 1 PDF/document-heavy page.

Prefer routes previously labelled `CLONED`/covered by the old route matrices so the audit can expose false positives.

## Compare every route on these dimensions

1. **URL** — reference/local status, final URL, redirects. Generic list redirect is NOT parity for a concrete detail/gallery page.
2. **TEXT** — compare the meaningful main-content text in order. Identify missing/changed headings, paragraphs, lists, dates, contacts, locations and metadata. Do not use word-count or word-set/Jaccard alone.
3. **MEDIA** — inventory actual content images/gallery items/background images. Verify identity/content, not only image count. Record missing and broken images explicitly.
4. **LINKS/DOCUMENTS** — inventory meaningful main-content links by anchor + target + type (internal/external/mailto/tel/PDF/download). Verify clone targets actually work. Record missing/wrong/broken links and PDFs.
5. **STRUCTURE** — headings, lists, tables, forms, gallery/card/list elements and document blocks.
6. **FUNCTION** — where relevant, identify whether the reference function exists and whether the clone has equivalent real behavior. Do not mark a functional page PASS from HTTP 200 alone.
7. **VISUAL** — desktop 1440 and mobile 390 screenshots where feasible; report obvious layout/component/media differences. High visual divergence must be reported even if route/text partially match.

## Output

Replace/update `docs/GEMINI_FINAL_AUDIT.md` with a new report titled **GEMINI CLONE PARITY CANARY REPORT** containing:
- `RESULT: FINDINGS` unless every sampled route genuinely matches on all applicable dimensions;
- a route-by-route table with URL/TEXT/MEDIA/LINKS/STRUCTURE/FUNCTION/VISUAL status;
- exact missing images, wrong links/PDFs, missing text blocks and obvious visual differences;
- summary counts of false positives among routes previously treated as cloned/covered;
- page-family/root-cause grouping where patterns repeat;
- screenshots or reproducible evidence paths/commands where available;
- no claims for checks not actually executed.

Do NOT fix the primary branch. Narrow isolated diagnostic helper code may be committed only on the Gemini audit branch if needed for evidence.

When complete, commit and push this branch. Claude/ChatGPT will consume the result directly from GitHub. The user is not a courier.
