# VMK editorial regression pack — 2026-09-05

## Baseline

The six editorial specs were first run together, unchanged, against the
existing `vmk-postgres` database and the development server at
`http://localhost:3101`. The real baseline was **1 passed, 5 failed** in
52.1 seconds.

Four tests logged in successfully but their subsequent authenticated writes
returned HTTP 403. The gallery test exceeded the 30-second test timeout while
the parallel run was compiling routes, and its test-scoped request context was
already closed when cleanup ran. That failed run stranded one gallery and one
page fixture; both were identified by their `e2e-` slugs and removed before
the verification runs.

## Regression and fix

All six files were running in parallel against one seeded admin account.
Payload's session-backed authentication persists a new session on that same
user document at every login. The simultaneous login updates raced, leaving
most workers with session IDs that were no longer present and therefore 403
responses on their next protected request.

The regression pack now runs with one Playwright worker. This keeps the six
write-enabled specs in one invocation, avoids races on the shared admin
record, and leaves every functional assertion and cleanup path intact. A
controlled single-worker run passed **6/6** in 49.7 seconds.

## Repeatable command and verification

With `E2E_EDITORIAL_ADMIN_EMAIL` and `E2E_EDITORIAL_ADMIN_PASSWORD` already
set in the shell, run:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3101 npm run test:editorial-regression
```

The npm script was independently invoked after it was added and passed
**6/6** in 34.3 seconds. A post-run database check found zero synthetic
`e2e-` News, Events, Pages, or Galleries records and zero editorial test media
files.
