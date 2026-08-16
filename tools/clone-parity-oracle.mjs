#!/usr/bin/env node
// Clone Parity Oracle v2 (K1, COLLAB.md section 4-5).
//
// Root-cause rebuild of the parity acceptance model. The old
// tools/visual-oracle.mjs classified a route CLONED from HTTP 200 +
// word-set Jaccard similarity + raw image/link COUNTS -- none of which
// prove the same actual content, images, or links are present. This tool
// compares a reference route against its clone counterpart on real
// dimensions: URL, TEXT (ordered main-content coverage), MEDIA (image
// inventory + broken-image detection), LINKS (anchor+href+type parity +
// broken-link detection), STRUCTURE (heading/paragraph/list/table/form
// counts). VISUAL and FUNCTION dimensions are separate, heavier passes
// (see clone-parity-visual.mjs and manual/E2E FUNCTION notes in the gap
// report) -- this script marks them `not_evaluated` rather than fake a
// result.
//
// Usage:
//   node tools/clone-parity-oracle.mjs --routes=tools/parity-canary-routes.json \
//     --ref-base=https://www.vmk.hu --clone-base=http://localhost:3011 \
//     --out=docs/parity-oracle-v2

import { chromium } from 'playwright'
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
const REF_BASE = args['ref-base'] || 'https://www.vmk.hu'
const CLONE_BASE = args['clone-base'] || 'http://localhost:3011'
const ROUTES_FILE = args['routes'] || 'tools/parity-canary-routes.json'
const OUT_DIR = args['out'] || 'docs/parity-oracle-v2'

const CHROME_SELECTORS = [
  'header',
  'nav',
  'footer',
  '[role="banner"]',
  '[role="contentinfo"]',
  '[role="navigation"]',
  '[role="dialog"]', // cookie consent banner
  'aside',
]

// Reference-site-specific: the real vmk.hu also has a left sidebar
// (id="sidebar" or similar) and a cookie/GDPR bar of its own -- best
// effort removal, not exhaustive, since the reference site's DOM
// structure isn't in our control the way the clone's is.
const REF_EXTRA_CHROME = ['.sidebar', '#sidebar', '.cookie-consent', '.cookie-bar', '.navbar']

// Verified against the live reference DOM (fetched /strandkonyvtar):
// the actual per-page template puts the real article body in
// `.col-content` and the ~90-link sitewide widget/menu sidebar in a
// sibling `.col-box` -- neither is a semantic <nav>/<aside>, so a
// generic chrome-strip alone (the first attempt at this tool) still
// picked up the whole sidebar as "content" and produced a
// near-uniform ~1% link-coverage / near-0% text-coverage result on
// almost every route -- not a real content gap, a wrong selector. The
// clone's shared layout.tsx wraps every page's real content in a
// single <main>. Prefer selecting the real content root directly on
// both sides; only fall back to whole-body chrome-stripping if the
// preferred selector isn't present on that particular page template.
const REF_CONTENT_SELECTOR = '.col-content'
const CLONE_CONTENT_SELECTOR = 'main'

async function extractPageData(page, { extraChromeSelectors = [], contentSelector = null } = {}) {
  return page.evaluate(
    ({ chromeSelectors, extra, contentSelector }) => {
      const doc = document.cloneNode(true)
      for (const sel of [...chromeSelectors, ...extra]) {
        doc.querySelectorAll(sel).forEach((el) => el.remove())
      }
      // Some clone page templates (PageWithSidebar) nest a second, more
      // specific <main> inside the root layout's <main> -- take the last
      // (innermost) match, not the first, or the outer one wins and pulls
      // the sidebar widget menu in as "content".
      const matches = contentSelector ? Array.from(doc.querySelectorAll(contentSelector)) : []
      const preferred = matches.length ? matches[matches.length - 1] : null
      const root = preferred || doc.body

      const text = (root?.innerText || '').replace(/\s+/g, ' ').trim()

      const headings = Array.from(root?.querySelectorAll('h1,h2,h3,h4,h5,h6') || []).map((h) => ({
        level: h.tagName.toLowerCase(),
        text: h.textContent.trim().replace(/\s+/g, ' '),
      }))

      const images = Array.from(root?.querySelectorAll('img') || [])
        .map((img) => ({
          src: img.getAttribute('src') || img.getAttribute('data-src') || '',
          alt: img.getAttribute('alt') || '',
        }))
        .filter((i) => i.src && !i.src.startsWith('data:'))

      const links = Array.from(root?.querySelectorAll('a[href]') || [])
        .map((a) => ({
          href: a.getAttribute('href') || '',
          text: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
        }))
        .filter((l) => l.href && !l.href.startsWith('#') && !l.href.startsWith('javascript:'))

      const paragraphs = (root?.querySelectorAll('p') || []).length
      const lists = (root?.querySelectorAll('ul,ol') || []).length
      const tables = (root?.querySelectorAll('table') || []).length
      const forms = (root?.querySelectorAll('form') || []).length

      return { text, headings, images, links, paragraphs, lists, tables, forms, usedContentSelector: !!preferred }
    },
    { chromeSelectors: CHROME_SELECTORS, extra: extraChromeSelectors, contentSelector },
  )
}

// Normalize text into comparable "lines": split on sentence-ish
// boundaries, drop very short fragments (nav labels, single words)
// that would trivially "match" almost anything and inflate coverage.
function toLines(text) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 20)
}

function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents for fuzzier match
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Ordered coverage: for each reference line, check whether a
// sufficiently-similar line exists anywhere in the clone text (not
// requiring exact order match across the whole page, since layout
// differences are expected, but requiring the actual sentence content
// to be present somewhere) -- this is deliberately much stricter than
// word-set Jaccard, which the old tool used and which the K1 review
// flagged as unable to detect missing paragraphs/sections.
function textCoverage(refText, cloneText) {
  const refLines = toLines(refText)
  const cloneLines = toLines(cloneText).map(normalize)
  if (refLines.length === 0) return { coverage: 1, matched: 0, total: 0, missing: [] }

  const missing = []
  let matched = 0
  for (const line of refLines) {
    const nLine = normalize(line)
    const found = cloneLines.some((cLine) => {
      // substring containment either direction, or high token overlap
      if (cLine.includes(nLine) || nLine.includes(cLine)) return true
      const a = new Set(nLine.split(' '))
      const b = new Set(cLine.split(' '))
      if (a.size === 0) return false
      let overlap = 0
      for (const w of a) if (b.has(w)) overlap++
      return overlap / a.size >= 0.85
    })
    if (found) matched++
    else missing.push(line)
  }
  return { coverage: matched / refLines.length, matched, total: refLines.length, missing }
}

function normalizeHref(href, base) {
  try {
    const u = new URL(href, base)
    return u.pathname.replace(/\/$/, '') || '/'
  } catch {
    return href
  }
}

function compareLinks(refLinks, refBase, cloneLinks, cloneBase) {
  const refInternal = refLinks.filter((l) => {
    try {
      return new URL(l.href, refBase).host === new URL(refBase).host
    } catch {
      return l.href.startsWith('/')
    }
  })
  const refExternal = refLinks.filter((l) => !refInternal.includes(l))

  const cloneNormalizedSet = new Set(
    cloneLinks.map((l) => normalizeHref(l.href, cloneBase)),
  )
  const refExternalHrefSet = new Set(refExternal.map((l) => l.href))
  const cloneExternalHrefSet = new Set(
    cloneLinks.filter((l) => /^https?:\/\//.test(l.href) && !l.href.includes(new URL(cloneBase).host)).map((l) => l.href),
  )

  const missingInternal = []
  for (const l of refInternal) {
    const norm = normalizeHref(l.href, refBase)
    if (!cloneNormalizedSet.has(norm)) missingInternal.push({ href: l.href, text: l.text })
  }
  const missingExternal = []
  for (const href of refExternalHrefSet) {
    if (!cloneExternalHrefSet.has(href)) missingExternal.push(href)
  }

  return {
    refInternalCount: refInternal.length,
    refExternalCount: refExternal.length,
    missingInternal,
    missingExternal,
    internalCoverage: refInternal.length ? (refInternal.length - missingInternal.length) / refInternal.length : 1,
    externalCoverage: refExternalHrefSet.size ? (refExternalHrefSet.size - missingExternal.length) / refExternalHrefSet.size : 1,
  }
}

function compareMedia(refImages, cloneImages) {
  // Content-identity matching (perceptual hash) is a separate, heavier
  // pass -- see docs/CLONE_PARITY_GAP_REPORT.md FUTURE WORK. This level
  // compares counts and alt-text overlap, which is already strictly
  // more than the old tool's bare imageCount, and flags a clear FAIL
  // when the clone has visibly fewer content images than the reference.
  const refCount = refImages.length
  const cloneCount = cloneImages.length
  const refAlts = new Set(refImages.map((i) => normalize(i.alt)).filter((a) => a.length > 2))
  const cloneAlts = new Set(cloneImages.map((i) => normalize(i.alt)).filter((a) => a.length > 2))
  let altMatches = 0
  for (const a of refAlts) if (cloneAlts.has(a)) altMatches++
  return {
    refCount,
    cloneCount,
    countDeficit: Math.max(0, refCount - cloneCount),
    altOverlap: refAlts.size ? altMatches / refAlts.size : 1,
  }
}

async function checkBrokenLinks(page, links, base, limit = 15) {
  const sample = links.slice(0, limit)
  const broken = []
  for (const l of sample) {
    try {
      const url = new URL(l.href, base).toString()
      const res = await page.request.get(url, { timeout: 8000 }).catch(() => null)
      if (!res || res.status() >= 400) broken.push({ href: l.href, status: res ? res.status() : 'ERR' })
    } catch {
      broken.push({ href: l.href, status: 'INVALID_URL' })
    }
  }
  return broken
}

async function checkBrokenImages(page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .filter((img) => img.src && !img.src.startsWith('data:'))
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.src)
  })
}

async function auditRoute(browser, route) {
  const refUrl = `${REF_BASE}${route.refPath || route.path}`
  const cloneUrl = `${CLONE_BASE}${route.path}`

  const refCtx = await browser.newContext()
  const cloneCtx = await browser.newContext()
  const refPage = await refCtx.newPage()
  const clonePage = await cloneCtx.newPage()

  const result = { path: route.path, refUrl, cloneUrl, family: route.family || 'unclassified' }

  try {
    const refResp = await refPage.goto(refUrl, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => null)
    result.refStatus = refResp ? refResp.status() : null
    result.refFinalUrl = refPage.url()
  } catch (e) {
    result.refStatus = null
    result.refError = String(e.message || e)
  }

  try {
    const cloneResp = await clonePage.goto(cloneUrl, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => null)
    result.cloneStatus = cloneResp ? cloneResp.status() : null
    result.cloneFinalUrl = clonePage.url()
  } catch (e) {
    result.cloneStatus = null
    result.cloneError = String(e.message || e)
  }

  // URL dimension
  const cloneRedirected = result.cloneFinalUrl && new URL(result.cloneFinalUrl).pathname !== route.path
  result.urlDimension = {
    status: result.refStatus,
    cloneStatus: result.cloneStatus,
    cloneRedirected,
    cloneRedirectTarget: cloneRedirected ? new URL(result.cloneFinalUrl).pathname : null,
  }

  if (result.refStatus && result.refStatus < 400 && result.cloneStatus && result.cloneStatus < 400) {
    const refData = await extractPageData(refPage, { extraChromeSelectors: REF_EXTRA_CHROME, contentSelector: REF_CONTENT_SELECTOR })
    const cloneData = await extractPageData(clonePage, { contentSelector: CLONE_CONTENT_SELECTOR })

    const text = textCoverage(refData.text, cloneData.text)
    const media = compareMedia(refData.images, cloneData.images)
    const links = compareLinks(refData.links, refUrl, cloneData.links, cloneUrl)
    const brokenImages = await checkBrokenImages(clonePage)
    const brokenLinks = await checkBrokenLinks(clonePage, cloneData.links, cloneUrl)

    result.text = {
      coveragePct: Math.round(text.coverage * 1000) / 10,
      matched: text.matched,
      total: text.total,
      missingSample: text.missing.slice(0, 5),
      status: text.coverage >= 0.99 ? 'PASS' : text.coverage >= 0.7 ? 'PARTIAL' : 'FAIL',
    }
    result.media = {
      ...media,
      brokenImageCount: brokenImages.length,
      brokenImageSample: brokenImages.slice(0, 5),
      status: brokenImages.length > 0 ? 'FAIL' : media.refCount > 0 && media.cloneCount === 0 ? 'FAIL' : media.countDeficit > 0 ? 'PARTIAL' : 'PASS',
    }
    result.links = {
      ...links,
      brokenLinkCount: brokenLinks.length,
      brokenLinkSample: brokenLinks.slice(0, 5),
      status: brokenLinks.length > 0 ? 'FAIL' : links.internalCoverage >= 0.99 && links.externalCoverage >= 0.99 ? 'PASS' : links.internalCoverage >= 0.7 ? 'PARTIAL' : 'FAIL',
    }
    result.structure = {
      ref: { headings: refData.headings.length, paragraphs: refData.paragraphs, lists: refData.lists, tables: refData.tables, forms: refData.forms },
      clone: { headings: cloneData.headings.length, paragraphs: cloneData.paragraphs, lists: cloneData.lists, tables: cloneData.tables, forms: cloneData.forms },
    }
    result.urlDimension.status = cloneRedirected && (route.family === 'gallery-archive' || route.family === 'gallery') && text.coverage < 0.3
      ? 'FAIL_GENERIC_REDIRECT'
      : 'PASS'
  } else {
    result.urlDimension.status = 'FAIL'
    result.text = { status: 'NOT_EVALUATED', reason: 'page load failed' }
    result.media = { status: 'NOT_EVALUATED' }
    result.links = { status: 'NOT_EVALUATED' }
    result.structure = { status: 'NOT_EVALUATED' }
  }

  result.function = { status: 'NOT_EVALUATED', note: 'separate E2E pass, see CLONE_PARITY_GAP_REPORT.md' }
  result.visual = { status: 'NOT_EVALUATED', note: 'separate screenshot-diff pass, see clone-parity-visual.mjs' }

  const dims = [result.urlDimension.status === 'PASS' ? 'PASS' : 'FAIL', result.text.status, result.media.status, result.links.status]
  result.overall = dims.every((d) => d === 'PASS') ? 'PARITY_PASS' : dims.some((d) => d === 'FAIL' || d === 'FAIL_GENERIC_REDIRECT') ? 'PARITY_FAIL' : 'PARITY_PARTIAL'

  await refCtx.close()
  await cloneCtx.close()
  return result
}

async function main() {
  const routes = JSON.parse(fs.readFileSync(ROUTES_FILE, 'utf8'))
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const results = []
  for (const route of routes) {
    process.stderr.write(`Auditing ${route.path} ...\n`)
    try {
      const r = await auditRoute(browser, route)
      results.push(r)
      process.stderr.write(`  -> ${r.overall} (text=${r.text.status} media=${r.media.status} links=${r.links.status})\n`)
    } catch (e) {
      results.push({ path: route.path, overall: 'ERROR', error: String(e.message || e) })
      process.stderr.write(`  -> ERROR: ${e.message}\n`)
    }
  }
  await browser.close()

  const jsonPath = path.join(OUT_DIR, 'results.json')
  fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), refBase: REF_BASE, cloneBase: CLONE_BASE, results }, null, 2))

  const summary = {
    total: results.length,
    PARITY_PASS: results.filter((r) => r.overall === 'PARITY_PASS').length,
    PARITY_PARTIAL: results.filter((r) => r.overall === 'PARITY_PARTIAL').length,
    PARITY_FAIL: results.filter((r) => r.overall === 'PARITY_FAIL').length,
    ERROR: results.filter((r) => r.overall === 'ERROR').length,
  }
  console.log('SUMMARY', JSON.stringify(summary))
  fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2))
}

main()
