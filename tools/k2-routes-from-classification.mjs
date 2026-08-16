#!/usr/bin/env node
// K2: converts docs/parity-oracle-v2/full-inventory-classification.json
// (written by tools/k2-classify-routes.mjs) into oracle-compatible route
// list files, matching the {path, refPath, family} shape
// tools/parity-canary-routes.json already uses -- so the existing K1
// pipeline (clone-parity-oracle.mjs / -visual.mjs / -function.mjs /
// -finalize.mjs) runs against the full inventory completely unmodified.
//
// Writes:
//   tools/parity-full-cloned-routes.json       -- every CLONED route
//   tools/parity-gallery-archive-sample.json   -- a stratified sample of
//     the gallery-archive family (both MULTI and SINGLE), sampled evenly
//     across discovery depth as a proxy for "spread across the archive",
//     since testing all ~1626 individually is disproportionate once the
//     systemic pattern is characterized (K1 round 3 already did this for
//     2 routes; this widens the evidence base, it doesn't replace it).
//
// Usage: node tools/k2-routes-from-classification.mjs [--sample-size=30]

import fs from 'fs'
import path from 'path'

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
const CLASSIFICATION_FILE = args['classification'] || 'docs/parity-oracle-v2/full-inventory-classification.json'
const SAMPLE_SIZE = Number(args['sample-size'] || 30)

function toOracleRoute(r, family) {
  const entry = { path: r.clonePath, family }
  if (r.clonePath !== r.path) entry.refPath = r.path
  return entry
}

function stratifiedSample(routes, n) {
  if (routes.length <= n) return routes
  const step = routes.length / n
  const sample = []
  for (let i = 0; i < n; i++) {
    sample.push(routes[Math.floor(i * step)])
  }
  return sample
}

function main() {
  const data = JSON.parse(fs.readFileSync(CLASSIFICATION_FILE, 'utf8'))
  const routes = data.routes

  const cloned = routes.filter((r) => r.category === 'CLONED').map((r) => toOracleRoute(r, 'full-inventory'))
  fs.writeFileSync('tools/parity-full-cloned-routes.json', JSON.stringify(cloned, null, 2))
  console.log(`Wrote tools/parity-full-cloned-routes.json: ${cloned.length} routes`)

  const galleryArchive = routes
    .filter((r) => r.category === 'GALLERY_ARCHIVE_MULTI' || r.category === 'GALLERY_ARCHIVE_SINGLE')
    .sort((a, b) => a.path.localeCompare(b.path))
  const sampled = stratifiedSample(galleryArchive, SAMPLE_SIZE).map((r) => toOracleRoute(r, 'gallery-archive'))
  fs.writeFileSync('tools/parity-gallery-archive-sample.json', JSON.stringify(sampled, null, 2))
  console.log(`Wrote tools/parity-gallery-archive-sample.json: ${sampled.length} of ${galleryArchive.length} gallery-archive routes (stratified sample)`)
}

main()
