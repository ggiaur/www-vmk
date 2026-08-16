#!/usr/bin/env node
// Clone Parity Oracle v2 -- FINALIZE step (K1 round 3, ChatGPT review
// commit f284c89, item 1).
//
// clone-parity-oracle.mjs, clone-parity-visual.mjs and
// clone-parity-function.mjs each run independently and merge their own
// dimension(s) into the same docs/parity-oracle-v2/results.json. Round 2's
// bug: nothing ever recomputed `overall` after VISUAL/FUNCTION were merged
// in, so a route's `overall` reflected only the 4 dimensions the oracle
// script itself could see at the time it ran (URL/TEXT/MEDIA/LINKS),
// silently ignoring STRUCTURE/FUNCTION/VISUAL even when those were FAIL.
//
// This script is the required last step of the pipeline: run oracle, then
// visual, then function (any order for the latter two), then this. It
// recomputes `overall` for every route from ALL seven merged dimensions via
// the single shared computeOverall(), and regenerates summary.json from
// those authoritative values. Never computes or fetches anything itself --
// pure recompute over already-collected evidence.
//
// Usage: node tools/clone-parity-finalize.mjs --out=docs/parity-oracle-v2

import fs from 'fs'
import path from 'path'
import { computeOverall } from './lib/parity-scoring.mjs'

function parseArgs(argv) {
  const args = {}
  for (const token of argv) {
    if (token.startsWith('--')) {
      const [k, ...rest] = token.slice(2).split('=')
      args[k] = rest.join('=') || true
    }
  }
  return args
}
const args = parseArgs(process.argv.slice(2))
const OUT_DIR = args['out'] || 'docs/parity-oracle-v2'

function main() {
  const jsonPath = path.join(OUT_DIR, 'results.json')
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))

  const changed = []
  for (const r of data.results) {
    const before = r.overall
    r.overall = computeOverall(r)
    if (before !== r.overall) changed.push({ path: r.path, before, after: r.overall })
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))

  if (changed.length) {
    process.stderr.write(`Recomputed overall for ${changed.length} route(s) whose merged VISUAL/FUNCTION data changed the verdict:\n`)
    for (const c of changed) process.stderr.write(`  ${c.path}: ${c.before} -> ${c.after}\n`)
  } else {
    process.stderr.write('Recompute made no changes to overall (all routes already consistent with merged dimension data).\n')
  }

  const canaryErrors = data.results.filter((r) => r.overall === 'CANARY_MAPPING_ERROR')
  const scored = data.results.filter((r) => r.overall !== 'CANARY_MAPPING_ERROR')
  const summary = {
    total: data.results.length,
    scoredTotal: scored.length,
    CANARY_MAPPING_ERROR: canaryErrors.length,
    canaryMappingErrorRoutes: canaryErrors.map((r) => r.path),
    PARITY_PASS: scored.filter((r) => r.overall === 'PARITY_PASS').length,
    PARITY_PARTIAL: scored.filter((r) => r.overall === 'PARITY_PARTIAL').length,
    PARITY_FAIL: scored.filter((r) => r.overall === 'PARITY_FAIL').length,
    ERROR: scored.filter((r) => r.overall === 'ERROR').length,
    generatedAt: new Date().toISOString(),
  }
  fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2))
  process.stderr.write(`Wrote ${path.join(OUT_DIR, 'summary.json')}: ${JSON.stringify(summary)}\n`)
}

main()
