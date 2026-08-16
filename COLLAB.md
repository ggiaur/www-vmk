# COLLAB.md — www-vmk CLONE PARITY RECOVERY

## CURRENT STATE

**STATUS: BLOCKED_BY_PREVIEW_OUTAGE**

**BALL: CLAUDE**

The user reports that `https://new.vmk.hu` now returns **502**. The preview was known to be served through the VMK host on **port 3011** and was working during K1 round 3 immediately before this report: the Oracle/function run used `http://localhost:3011` successfully and verified real DB side effects. This makes the preview outage the immediate operational blocker.

## P0 — RESTORE `new.vmk.hu` / PORT 3011 FIRST

Before any K2 work or further parity remediation:

1. On Claude's dedicated VMK worktree/host, determine whether anything is listening on 3011:
   - `ss -ltnp | grep ':3011' || true`
   - `curl -sv http://127.0.0.1:3011/`
   - inspect the actual Node/Next process and its parent/session.
2. Find the concrete stop/crash cause from process/app logs and shell/process-manager history. Do **not** guess.
3. Restore the clone on **3011** without changing DNS/reverse-proxy/tunnel configuration unless host evidence proves that layer is wrong.
4. Make the 3011 preview durable across normal development, agent session exit, worktree switching and parity test execution. It must not depend on an ephemeral foreground shell. Use the host's existing process-management approach if present; otherwise establish a narrowly scoped durable process (e.g. systemd/PM2/tmux) and document the exact start/restart/status commands. Do not introduce a production architecture change just to solve a dev-preview lifecycle problem.
5. Verify from the host:
   - `curl -I http://127.0.0.1:3011/` returns a valid app response;
   - `https://new.vmk.hu` no longer returns 502 from a network location that can resolve it;
   - DB/storage/search dependencies needed by the preview are healthy.
6. Record exact root cause and prevention. Required evidence includes the process that had died/stopped, relevant log/error or lifecycle explanation, restore command/process-manager state, and post-restore HTTP checks.

### Important diagnosis constraints

- The repo's K1 parity scripts **use** `http://localhost:3011`; they do not start or supervise the preview process.
- GitHub Actions uses **port 3001**, not 3011. Its `pkill -f "next-server"` runs inside the isolated GitHub runner, so do not blame remote CI for killing the real VMK host without direct host evidence.
- A browser-visible **502** is consistent with a live reverse proxy whose upstream on 3011 is unavailable; prove the exact failing hop on-host.
- Do not ask the user to SSH in, relay commands, or manage the process. Claude owns host-side diagnosis/restoration if its environment has the same host access used for the K1 run.

When restored, commit only the operational documentation/config actually needed and update this file with:

```text
PREVIEW_3011: RESTORED
ROOT_CAUSE: <exact cause>
PREVENTION: <durable lifecycle mechanism>
STATUS: READY_FOR_REVIEW
BALL: CHATGPT
```

## CLONE PARITY PHASE ORDER — STILL HARD-GATED

```text
K1 Oracle v2 + falsification canary
 -> ChatGPT + Gemini validation
K2 full timestamped reference snapshot + complete deficit inventory
 -> ChatGPT acceptance
K3 page-family/root-cause remediation
K4 final parity + CI/security/WCAG/mergeability
```

**K2 MUST NOT START while the preview is down or while K1 independent validation is incomplete.**

## K1 ROUND 3 — CURRENT EVIDENCE

Claude implementation commit: `426b16e`.

- 7-dimension final scoring implemented: URL/TEXT/MEDIA/LINKS/STRUCTURE/FUNCTION/VISUAL.
- `NOT_APPLICABLE` is the only excludable status and requires a route-specific reason; all other non-PASS/unevaluated statuses block overall PASS.
- Gallery/archive media extraction now includes CSS `background-image`, `srcset` and lazy-load sources.
- Real reference gallery image counts observed on canaries: 12, 12, 8, 17, 19; all five correctly failed media identity coverage.
- FUNCTION checks for contact + wishbasket verified actual Postgres persistence and cleanup.
- Full fresh canary result: 22/22 scored, `PARITY_PASS: 0`, `PARITY_FAIL: 22`.
- Per-dimension result: URL 20 PASS / 2 generic-redirect fail; TEXT 1 PASS / 21 FAIL; MEDIA 5 PASS / 17 FAIL; LINKS 3 PASS / 19 FAIL; STRUCTURE 2 PASS / 11 PARTIAL / 9 FAIL; FUNCTION 2 PASS / 20 NOT_APPLICABLE; VISUAL 1 PARTIAL / 21 FAIL.
- Falsification unit tests added for scoring; no broad product remediation done.

K1 is **not accepted yet** because Gemini independent route-level parity evidence is still missing. After preview restoration, ChatGPT will complete the K1 cross-review when Gemini evidence is consumable.

## WORKTREE / OWNERSHIP HARD RULE

- 1 agent = 1 branch = 1 worktree.
- Claude: `agent/visual-clone-oracle` dedicated worktree.
- Gemini: `agent/gemini-final-audit` dedicated worktree.
- No branch switching/reset in another agent's worktree.
- ChatGPT coordinates through GitHub/COLLAB only.
- User is not a courier and must not be asked to solve routine branch/worktree/process collisions.
