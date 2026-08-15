# Working discipline for this project

This file exists so that Claude, working directly and interactively in this
repo, follows the same discipline as the AI-SD-OS engine's formal pipeline —
without needing the engine's Python machinery (event bus, state machine,
YAML contracts) actually running. The discipline is what matters; the
pipeline is just one way to enforce it mechanically. This is the other way:
put the rules where Claude reads them every session.

Copy this file to `CLAUDE.md` in any project's root. Claude Code loads it
automatically as context. Adjust freely — this is a starting point, not a law.

## Before implementing anything non-trivial

1. **State the plan first.** What requirement(s) are being addressed, why,
   and what "done" looks like (acceptance criteria). Get explicit
   confirmation before writing code for anything more than a small, obvious
   fix. This is the human gate — don't skip it because it feels slow.
2. **Write the test BEFORE the implementation**, from the stated acceptance
   criteria — not derived from whatever code ends up getting written. A test
   that's shaped to match its own implementation proves nothing (this is the
   #1 bug this engine was built to fix — see AI-SD-OS's own git history).

## While implementing

3. **Never silently overwrite or delete existing files.** Check what's
   already there before writing. If adopting/extending existing code,
   namespace new files so they can never collide with what's already there.
4. **Don't assume facts that change over time** (model IDs, library
   versions, API contracts, pricing) **from memory** — verify (read the
   actual file/config, or search) before hardcoding them. Getting this wrong
   quietly is worse than not having the answer.

## After implementing, before declaring done

5. **Actually run the tests.** Don't claim something passes without running
   it in this turn. If a real measurement attempt turns out unreliable or
   inconclusive, SAY SO explicitly — never report a guessed/plausible
   number as if it were the real result. An honest "I couldn't measure
   this reliably, here's why" beats a fabricated figure every time.
6. **Do a genuinely independent second check** — not just "does it pass the
   test I just wrote," but a separate pass for a different class of problem
   (security: hardcoded secrets, dangerous patterns like eval/exec/shell=True;
   does it actually serve the stated goal, not just satisfy the letter of
   the test). Two different checks catch things one doesn't.
7. **Write commit messages that describe what was verified**, not just what
   changed — which requirement this closes, and that it was actually tested
   and reviewed. Only commit when there's a real diff; don't batch unrelated
   changes into one commit.

## VMK clone visual work — mandatory Oracle workflow

The `main` branch is first and foremost a technically modern clone of the
current `www.vmk.hu`. For clone work, visual completeness is a measured
acceptance criterion, not a subjective judgement.

- Read `docs/VISUAL_CLONE_ORACLE.md` before changing clone layout or styling.
- Use the Visual Clone Oracle (`npm run visual:oracle` or a targeted
  `node tools/visual-oracle.mjs live --route=...`) as the source of truth.
- Never declare a page visually complete because it "looks close", because a
  screenshot review seems plausible, or because one hand-written audit passes.
- Work from the Oracle's ranked defect regions. Prefer fixing the highest
  ranked defect first and keep the change scoped to the relevant component.
- Re-run the Oracle after each meaningful visual change. Record before/after
  metrics. A change that makes the measured result worse is a regression and
  must be reverted or corrected unless there is an explicitly documented
  reason to accept it.
- Do not regress an already-PASS route while fixing another route.
- Milestone 1 scope is the home page plus every relevant internal page linked
  directly from the home page (first-hop crawl), on desktop and mobile. Do not
  treat first-hop coverage as complete if route discovery reports truncation.
- Pixel threshold must not be raised merely to improve the score. Any tolerance
  change requires measured evidence and explicit justification.

## The second human gate

8. **Confirm before pushing/committing anything with real, hard-to-reverse
   consequences** (shared repos, production config, anything another person
   might see or depend on). Local, reversible work doesn't need this — use
   judgment, but default to asking when unsure.

## If something goes wrong repeatedly

9. **Say so explicitly** rather than silently retrying the same approach.
   If a design decision (a heuristic, a default, an assumption) keeps
   causing the same class of failure, name the pattern instead of just
   fixing the symptom again.
