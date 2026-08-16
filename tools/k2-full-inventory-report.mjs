#!/usr/bin/env node
// K2 (COLLAB.md commit 8fec18e, items 3-4): builds the complete deficit
// inventory from a full-scale results.json (all CLONED routes, produced by
// the same clone-parity-oracle.mjs / -visual.mjs / -function.mjs /
// -finalize.mjs pipeline K1 already validated) plus the gallery-archive
// stratified sample. Writes docs/CLONE_PARITY_FULL_INVENTORY.md and a
// machine-readable JSON/CSV source, with root-cause grouping (item 4) --
// not just totals.
//
// Usage: node tools/k2-full-inventory-report.mjs \
//   --results=docs/parity-full-inventory/results.json \
//   --gallery-results=docs/parity-full-inventory-gallery/results.json \
//   --classification=docs/parity-oracle-v2/full-inventory-classification.json \
//   --out=docs/parity-full-inventory

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
const RESULTS_FILE = args['results'] || 'docs/parity-full-inventory/results.json'
const GALLERY_RESULTS_FILE = args['gallery-results']
const CLASSIFICATION_FILE = args['classification'] || 'docs/parity-oracle-v2/full-inventory-classification.json'
const OUT_DIR = args['out'] || 'docs/parity-full-inventory'

const DOC_EXT_RE = /\.(pdf|docx?|xlsx?|pptx?|odt|ods|odp|rtf)(\?|$)/i

function isDocLink(href) {
  return DOC_EXT_RE.test(href) || href.includes('/download')
}

// Root-cause classification per route: a small set of mutually-legible
// buckets, derived from which dimensions actually failed and how -- not a
// random per-route label. A route can land in more than one bucket.
function classifyRootCauses(r) {
  const causes = []
  if (r.urlDimension?.status === 'FAIL_GENERIC_REDIRECT') {
    causes.push('gallery-detail-collapsed-to-list')
  }
  if (r.media?.status === 'FAIL' && (r.media.refCount ?? 0) > 0) {
    causes.push('imported-pages-missing-media')
  }
  if (r.media?.status === 'METHODOLOGY_BLOCKED') {
    causes.push('media-extraction-methodology-blocked')
  }
  if (r.links?.status === 'FAIL' && (r.links.missingInternal?.length ?? 0) > 0) {
    causes.push('internal-link-rewriting-errors')
  }
  const docMissing = [...(r.links?.missingInternal || []).map((l) => l.href), ...(r.links?.missingExternal || [])].filter(isDocLink)
  if (docMissing.length > 0) {
    causes.push('document-download-migration-gap')
  }
  if (r.structure?.status === 'FAIL' || r.structure?.status === 'PARTIAL') {
    causes.push('page-family-structure-mismatch')
  }
  if (r.function?.status === 'FAIL') {
    causes.push('functional-workflow-mismatch')
  }
  if (r.visual?.status === 'FAIL') {
    causes.push('major-visual-mismatch')
  }
  if (r.text?.status === 'FAIL' && (r.structure?.clone?.paragraphs ?? 1) === 0 && (r.structure?.clone?.headings ?? 1) === 0) {
    causes.push('likely-missing-payload-data')
  } else if (r.text?.status === 'FAIL') {
    causes.push('likely-content-extractor-or-rendering-defect')
  }
  return causes.length ? causes : ['unclassified-deficit']
}

function loadResults(file) {
  if (!file || !fs.existsSync(file)) return []
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  return data.results || []
}

function main() {
  const cloned = loadResults(RESULTS_FILE)
  const gallerySample = loadResults(GALLERY_RESULTS_FILE)
  const classification = fs.existsSync(CLASSIFICATION_FILE) ? JSON.parse(fs.readFileSync(CLASSIFICATION_FILE, 'utf8')) : null

  const allScored = [...cloned, ...gallerySample]
  const scored = allScored.filter((r) => r.overall !== 'CANARY_MAPPING_ERROR' && r.overall !== undefined)

  const rootCauseCounts = {}
  const rootCauseExamples = {}
  const deficits = []

  for (const r of scored) {
    if (r.overall === 'PARITY_PASS') continue
    const causes = classifyRootCauses(r)
    for (const c of causes) {
      rootCauseCounts[c] = (rootCauseCounts[c] || 0) + 1
      if (!rootCauseExamples[c]) rootCauseExamples[c] = []
      if (rootCauseExamples[c].length < 5) rootCauseExamples[c].push(r.path)
    }
    deficits.push({ path: r.path, overall: r.overall, causes, dimensions: { url: r.urlDimension?.status, text: r.text?.status, media: r.media?.status, links: r.links?.status, structure: r.structure?.status, function: r.function?.status, visual: r.visual?.status } })
  }

  const brokenImages = scored.reduce((sum, r) => sum + (r.media?.brokenImageCount || 0), 0)
  const brokenLinks = scored.reduce((sum, r) => sum + (r.links?.brokenLinkCount || 0), 0)
  const docDeficitRoutes = scored.filter((r) => {
    const missing = [...(r.links?.missingInternal || []).map((l) => l.href), ...(r.links?.missingExternal || [])]
    return missing.some(isDocLink)
  })
  const methodologyBlocked = scored.filter((r) => Object.values({ media: r.media, text: r.text, links: r.links, structure: r.structure, function: r.function, visual: r.visual }).some((d) => d?.status === 'METHODOLOGY_BLOCKED'))
  const genericRedirectRoutes = scored.filter((r) => r.urlDimension?.status === 'FAIL_GENERIC_REDIRECT')

  const summary = {
    generatedAt: new Date().toISOString(),
    totalReferenceUrlsDiscovered: classification?.totalRoutes ?? null,
    classificationCounts: classification?.counts ?? null,
    totalScoredClonedRoutes: cloned.length,
    totalGalleryArchiveSampled: gallerySample.length,
    PARITY_PASS: scored.filter((r) => r.overall === 'PARITY_PASS').length,
    PARITY_PARTIAL: scored.filter((r) => r.overall === 'PARITY_PARTIAL').length,
    PARITY_FAIL: scored.filter((r) => r.overall === 'PARITY_FAIL').length,
    ERROR: scored.filter((r) => r.overall === 'ERROR').length,
    totalBrokenImageAssets: brokenImages,
    totalBrokenLinks: brokenLinks,
    routesWithDocDownloadDeficit: docDeficitRoutes.length,
    routesMethodologyBlocked: methodologyBlocked.length,
    routesWithGenericRedirectMisuse: genericRedirectRoutes.length,
    rootCauseCounts,
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'full-inventory-summary.json'), JSON.stringify(summary, null, 2))
  fs.writeFileSync(path.join(OUT_DIR, 'full-inventory-deficits.json'), JSON.stringify(deficits, null, 2))

  const csvRows = ['path,overall,url,text,media,links,structure,function,visual,causes']
  for (const d of deficits) {
    csvRows.push([d.path, d.overall, d.dimensions.url, d.dimensions.text, d.dimensions.media, d.dimensions.links, d.dimensions.structure, d.dimensions.function, d.dimensions.visual, d.causes.join('|')].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
  }
  fs.writeFileSync(path.join(OUT_DIR, 'full-inventory-deficits.csv'), csvRows.join('\n'))

  const md = [
    '# Clone Parity Full Inventory (K2, COLLAB.md commit 8fec18e)',
    '',
    `Generated: ${summary.generatedAt}`,
    '',
    '## Totals',
    '',
    '| Metric | Count |',
    '|---|---|',
    `| Total reference URLs discovered (full crawl) | ${summary.totalReferenceUrlsDiscovered} |`,
    `| Total CLONED routes scored | ${summary.totalScoredClonedRoutes} |`,
    `| Gallery-archive routes sampled | ${summary.totalGalleryArchiveSampled} |`,
    `| PARITY_PASS | ${summary.PARITY_PASS} |`,
    `| PARITY_PARTIAL | ${summary.PARITY_PARTIAL} |`,
    `| PARITY_FAIL | ${summary.PARITY_FAIL} |`,
    `| ERROR | ${summary.ERROR} |`,
    `| Total broken image assets | ${summary.totalBrokenImageAssets} |`,
    `| Total broken links | ${summary.totalBrokenLinks} |`,
    `| Routes with PDF/download deficits | ${summary.routesWithDocDownloadDeficit} |`,
    `| Routes METHODOLOGY_BLOCKED on any dimension | ${summary.routesMethodologyBlocked} |`,
    `| Routes with generic-redirect misuse (FAIL_GENERIC_REDIRECT) | ${summary.routesWithGenericRedirectMisuse} |`,
    '',
    '## Root-cause grouping (defect families, K2 item 4)',
    '',
    '| Root cause | Route count | Example routes |',
    '|---|---|---|',
    ...Object.entries(rootCauseCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cause, count]) => `| ${cause} | ${count} | ${(rootCauseExamples[cause] || []).join(', ')} |`),
    '',
    '## Classification of the full discovered scope',
    '',
    classification ? '| Category | Count |\n|---|---|\n' + Object.entries(classification.counts).map(([k, v]) => `| ${k} | ${v} |`).join('\n') : '(classification.json not found)',
    '',
    'Full per-route deficit detail: `full-inventory-deficits.json` / `.csv`. Raw oracle results: `results.json` (this directory).',
  ].join('\n')

  fs.writeFileSync(path.join(OUT_DIR, '..', 'CLONE_PARITY_FULL_INVENTORY.md'), md)
  console.log('Wrote full inventory summary, deficits JSON/CSV, and docs/CLONE_PARITY_FULL_INVENTORY.md')
  console.log(JSON.stringify(summary, null, 2))
}

main()
