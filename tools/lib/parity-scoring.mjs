// Shared PARITY_PASS/PARTIAL/FAIL scoring, used by clone-parity-oracle.mjs
// (initial per-route pass), clone-parity-finalize.mjs (final recompute
// after VISUAL/FUNCTION are merged in), and tests/clone-parity-scoring.test.ts
// (falsification self-test, K1 round 3 item 8).
//
// K1 round 3 (ChatGPT review, commit f284c89, item 1): round 2's `overall`
// was computed from only 4 of 7 dimensions (URL/TEXT/MEDIA/LINKS), silently
// ignoring STRUCTURE/FUNCTION/VISUAL even after those were merged into the
// same route record by the other two scripts. A route could show
// PARITY_PASS while its VISUAL screenshot diff or a FUNCTION workflow was
// failing. This is the single source of truth for the final decision now:
// every applicable dimension must be PASS, or the route cannot be
// PARITY_PASS.

export const ALL_DIMENSIONS = ['urlDimension', 'text', 'media', 'links', 'structure', 'function', 'visual']

// Statuses that must never be treated as satisfying a dimension, even
// though the dimension is "applicable" (not NOT_APPLICABLE). Per the
// review: NOT_EVALUATED, METHODOLOGY_BLOCKED, ERROR, PARTIAL and FAIL must
// all prevent PARITY_PASS -- only PASS satisfies a dimension.
const HARD_FAIL_STATUSES = new Set(['FAIL', 'FAIL_GENERIC_REDIRECT', 'ERROR'])

/**
 * @param {object} result a route result object with url/text/media/links/
 *   structure/function/visual sub-objects, each with a `.status` string.
 * @returns {'CANARY_MAPPING_ERROR'|'PARITY_PASS'|'PARITY_PARTIAL'|'PARITY_FAIL'}
 */
export function computeOverall(result) {
  if (result.urlDimension?.status === 'CANARY_MAPPING_ERROR') return 'CANARY_MAPPING_ERROR'

  const statuses = ALL_DIMENSIONS.map((key) => {
    if (key === 'urlDimension') {
      // urlDimension.status historically also carries the raw HTTP status
      // code before scoring runs; only PASS/FAIL/FAIL_GENERIC_REDIRECT are
      // meaningful scoring values for it.
      const s = result.urlDimension?.status
      return s === 'PASS' || s === 'FAIL_GENERIC_REDIRECT' || s === 'FAIL' ? s : 'FAIL'
    }
    return result[key]?.status
  }).filter((s) => s !== undefined && s !== 'NOT_APPLICABLE')

  if (statuses.length === 0) return 'PARITY_PARTIAL'

  if (statuses.every((s) => s === 'PASS')) return 'PARITY_PASS'
  if (statuses.some((s) => HARD_FAIL_STATUSES.has(s))) return 'PARITY_FAIL'
  // Remaining non-PASS, non-hard-fail statuses: NOT_EVALUATED,
  // METHODOLOGY_BLOCKED, PARTIAL -- none of these may become PARITY_PASS,
  // but they're not a confirmed content FAIL either.
  return 'PARITY_PARTIAL'
}
