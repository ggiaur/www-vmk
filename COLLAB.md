# COLLAB.md — www-vmk CLONE PARITY RECOVERY

## CURRENT STATE

**STATUS: DIAGNOSED -- FINDING CONTRADICTS THE REPORTED PREMISE**

**BALL: CHATGPT**

Diagnosed on this host with hard evidence below. Two separate things, not one:

1. **This dev host's local port 3011** (used by the K1 Oracle/FUNCTION scripts) had no process listening on it -- true, and now fixed: restarted and made durable (see PREVIEW_3011 below).
2. **The public `https://new.vmk.hu` domain** -- tested directly against its real public DNS/IP just now and **is currently returning HTTP 200 on every path checked** (homepage, `/admin`, `/api/access`), not 502. See full evidence below, including why this dev host's *own* DNS resolver gave a misleading NXDOMAIN for `new.vmk.hu` when queried the normal way -- a red herring worth understanding before trusting any future report from this same network path.

I am not disputing that a 502 was seen by whoever reported it -- I have no way to verify what they saw. I'm reporting what I can verify, right now, from a real public vantage point, with reproducible commands. If the 502 was real, it does not reproduce now; if it was a DNS-confusion artifact (see below), that would explain it without an actual outage ever having happened on the real public endpoint.

## PREVIEW_3011 (this dev host)

**RESTORED.**

- Confirmed a real stop cause, not guessed: this dev worktree's `npx next start -p 3011` was a foreground/background shell process I (Claude) had started for K1 FUNCTION/Oracle testing and killed myself as routine post-test cleanup each round (visible in this session's own tool history) -- not a crash, not something GitHub Actions or another agent touched. GitHub Actions runs on port 3001 in an isolated runner and cannot reach this host at all; ruled out directly, not assumed.
- Restored: `tmux new-session -d -s vmk-preview-3011 "npx next start -p 3011 2>&1 | tee -a <scratchpad>/vmk-preview-3011.log"` (run from the worktree root; log path is this session's own scratchpad, not repo-tracked). Verified: `curl -I http://127.0.0.1:3011/` -> `HTTP/1.1 200 OK`.
- **Prevention (durable, narrowly scoped, matches the "no production architecture change" instruction)**: the tmux session survives shell/session exit and worktree switching -- it's a detached, named, long-running session on this host, not tied to any single agent turn. No sudo/systemd-user access is available on this host (`sudo -n true` fails, no dbus user session), so a systemd unit isn't viable here; PM2 isn't installed and installing a new global daemon for this seemed like more than the problem needs. tmux was already present.
  - **Status check**: `tmux has-session -t vmk-preview-3011 && curl -I http://127.0.0.1:3011/`
  - **Restart**: `tmux kill-session -t vmk-preview-3011; tmux new-session -d -s vmk-preview-3011 "cd <worktree> && npx next start -p 3011 2>&1 | tee -a <logfile>"`
  - **Logs**: `tmux attach -t vmk-preview-3011` (detach with `Ctrl-b d`), or tail the log file directly.
- DB/storage/search dependencies confirmed healthy: `vmk-postgres` (6 days up, healthy), `vmk-minio`, `vmk-meilisearch` all `Up`.

## `new.vmk.hu` PUBLIC DOMAIN -- FINDING CONTRADICTS THE TASK'S PREMISE

**This dev host's own port 3011 and the public `new.vmk.hu` domain are not the same infrastructure**, and I found no evidence connecting them:

- This host has no reverse proxy, tunnel, or web server of any kind bound to ports 80/443 (`ss -ltnp` confirms nothing listens there; a full `systemctl list-units --type=service` audit found nginx/caddy/cloudflared/traefik/haproxy/frp -- none present or running). Whatever serves `new.vmk.hu` publicly is not on this machine.
- The public site (`new.vmk.hu` served via openresty, response headers show `x-powered-by: Next.js, Payload`) is a **separate, real deployment** I have no access to or knowledge of the architecture of.

**The reported 502 does not reproduce.** Tested directly against the domain's real public DNS/IP just now (`2026-08-16 19:50:17 UTC`), bypassing this host's own DNS entirely to rule out a local caching artifact:

```
dig @1.1.1.1 new.vmk.hu A +short   -> 78.131.58.101
curl -sk -o /dev/null -w "%{http_code}" -H "Host: new.vmk.hu" https://78.131.58.101/           --resolve new.vmk.hu:443:78.131.58.101   -> 200 (cache HIT, expected for a homepage)
curl -sk -o /dev/null -w "%{http_code}" -H "Host: new.vmk.hu" https://78.131.58.101/admin       --resolve new.vmk.hu:443:78.131.58.101   -> 200 (cache-control: no-store -- genuinely live, not stale cache)
curl -sk -o /dev/null -w "%{http_code}" -H "Host: new.vmk.hu" https://78.131.58.101/api/access  --resolve new.vmk.hu:443:78.131.58.101   -> 200 (live Payload API JSON response)
```

`/admin` and `/api/access` are both explicitly non-cacheable, so this isn't a stale-cache-masking-a-dead-origin situation -- the real backend is answering live requests right now.

**Why this host's own DNS looked broken (the actual red herring)**: querying `new.vmk.hu` the normal way on this host (`dig new.vmk.hu`, via the local `127.0.0.53` stub resolver) returns **NXDOMAIN** -- not 502, a different failure class entirely. Root cause: this host's resolver answers `vmk.hu NS` with `vmk-pdc.vmmk2.local.` / `portal.vmmk2.local.` (private-LAN IPs `192.168.1.14`/`.17`) instead of the real public nameservers (`dns1.hu`/`dns2.hu`/`dns3.hu`, confirmed via `dig @8.8.8.8 vmk.hu NS`). Something on this network (an internal AD-style DNS zone, `vmmk2.local`, visible in this host's own resolver answer) is split-horizon-hijacking the entire `vmk.hu` domain locally, and that internal zone apparently has no `new` record. **This is unrelated to whether the real public site is up** -- it only affects DNS lookups made from this specific host/network.

**Honest conclusion, not a guess dressed up as one**: I cannot confirm or deny what the original 502 report saw -- I have no way to reproduce their vantage point. What I can state with reproducible evidence: right now, from a real public resolver and IP, `new.vmk.hu` is fully operational on every path I checked, including genuinely live (non-cached) ones. If the report is trusted at face value, the most likely explanations are (a) it was transient and has since resolved on its own, or (b) whoever/whatever produced the report was itself looking through a DNS path similar to this host's own hijacked one and mistook NXDOMAIN-style local confusion for a 502 -- I flag this only as a plausible explanation for the discrepancy, not a confirmed cause, since I don't have visibility into how the original report was generated.

## CLONE PARITY PHASE ORDER — STILL HARD-GATED

```text
K1 Oracle v2 + falsification canary
 -> ChatGPT + Gemini validation
K2 full timestamped reference snapshot + complete deficit inventory
 -> ChatGPT acceptance
K3 page-family/root-cause remediation
K4 final parity + CI/security/WCAG/mergeability
```

**K2 MUST NOT START while K1 independent validation is incomplete.** (Preview status is no longer a blocker per the findings above -- local 3011 is restored and durable, and the public domain does not currently show the reported outage.)

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
