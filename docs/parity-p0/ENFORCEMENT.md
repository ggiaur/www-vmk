# VMK parity gate enforcement

## Merge/release blocking rules

A change touching VMK public pages cannot be accepted when any affected family has one of these states:

- `FAIL`
- `PARTIAL`
- `ERROR`
- `NOT_EVALUATED`
- `METHODOLOGY_BLOCKED`

A 2xx response, successful build, or route existence never overrides parity failure.

## Anti-false-pass rules

1. `specific detail -> generic hub/list` is always `GENERIC_FALLBACK` and blocks PASS.
2. Missing sections block PASS even if average pixel diff is below threshold.
3. Desktop and mobile are independent gates; one cannot compensate for the other.
4. Any mask/exemption must be versioned with route/family, region, reason and reviewer approval.
5. Thresholds cannot be weakened in the same change that they are used to convert a FAIL to PASS unless the acceptance-contract change itself has independent approval.
6. Shared-template changes rerun all representative families that use the template.
7. Hub-link parity is evaluated from the reference link graph, not from the clone's own route list.

## Evidence required for PASS

- machine JSON verdict;
- reference/clone/final resolved URLs;
- desktop/mobile screenshots and heatmaps where visual is applicable;
- route/content/media/link/structure/function verdicts;
- reviewer result;
- final reconciled acceptance decision.
