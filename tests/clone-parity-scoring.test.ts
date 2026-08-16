import { describe, expect, it } from 'vitest'
import { computeOverall } from '../tools/lib/parity-scoring.mjs'

// K1 round 3 falsification self-test (ChatGPT review, commit f284c89, item 8):
// round 2's overall/PARITY_PASS computation silently ignored STRUCTURE,
// FUNCTION and VISUAL even after those dimensions were merged into a route's
// result -- a route could show PARITY_PASS while VISUAL or FUNCTION was
// actually failing. These tests assert the opposite: a route with every
// dimension passing except one (STRUCTURE, VISUAL, or FUNCTION) must never
// resolve to PARITY_PASS.

type DimensionResult = { status: string; reason?: string }

function fullyPassingRoute(): Record<string, DimensionResult> {
  return {
    urlDimension: { status: 'PASS' },
    text: { status: 'PASS' },
    media: { status: 'PASS' },
    links: { status: 'PASS' },
    structure: { status: 'PASS' },
    function: { status: 'PASS' },
    visual: { status: 'PASS' },
  }
}

describe('clone-parity computeOverall (K1 round 3 falsification self-test)', () => {
  it('is PARITY_PASS when all 7 applicable dimensions pass', () => {
    expect(computeOverall(fullyPassingRoute())).toBe('PARITY_PASS')
  })

  it('is NOT PARITY_PASS when STRUCTURE fails even though URL/TEXT/MEDIA/LINKS pass', () => {
    const r = fullyPassingRoute()
    r.structure = { status: 'FAIL' }
    expect(computeOverall(r)).not.toBe('PARITY_PASS')
    expect(computeOverall(r)).toBe('PARITY_FAIL')
  })

  it('is NOT PARITY_PASS when VISUAL fails even though URL/TEXT/MEDIA/LINKS pass', () => {
    const r = fullyPassingRoute()
    r.visual = { status: 'FAIL' }
    expect(computeOverall(r)).not.toBe('PARITY_PASS')
    expect(computeOverall(r)).toBe('PARITY_FAIL')
  })

  it('is NOT PARITY_PASS when FUNCTION fails even though URL/TEXT/MEDIA/LINKS pass', () => {
    const r = fullyPassingRoute()
    r.function = { status: 'FAIL' }
    expect(computeOverall(r)).not.toBe('PARITY_PASS')
    expect(computeOverall(r)).toBe('PARITY_FAIL')
  })

  it('is NOT PARITY_PASS when VISUAL is still NOT_EVALUATED (not yet merged)', () => {
    const r = fullyPassingRoute()
    r.visual = { status: 'NOT_EVALUATED' }
    expect(computeOverall(r)).not.toBe('PARITY_PASS')
    expect(computeOverall(r)).toBe('PARITY_PARTIAL')
  })

  it('is NOT PARITY_PASS when MEDIA is METHODOLOGY_BLOCKED', () => {
    const r = fullyPassingRoute()
    r.media = { status: 'METHODOLOGY_BLOCKED' }
    expect(computeOverall(r)).not.toBe('PARITY_PASS')
  })

  it('excludes NOT_APPLICABLE dimensions from the requirement (e.g. FUNCTION on a non-interactive route)', () => {
    const r = fullyPassingRoute()
    r.function = { status: 'NOT_APPLICABLE', reason: 'no interactive workflow on this route' }
    expect(computeOverall(r)).toBe('PARITY_PASS')
  })

  it('routes a broken reference path to CANARY_MAPPING_ERROR regardless of other dimensions', () => {
    const r = fullyPassingRoute()
    r.urlDimension = { status: 'CANARY_MAPPING_ERROR' }
    expect(computeOverall(r)).toBe('CANARY_MAPPING_ERROR')
  })
})
