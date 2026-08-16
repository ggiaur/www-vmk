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
import sharp from 'sharp'
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

// Families where the page's whole point is to display photos -- a 0-image
// extraction on these is a red flag (extraction gap), not a green light.
const MEDIA_HEAVY_FAMILIES = new Set(['gallery', 'gallery-archive', 'gallery-detail', 'gallery-hub'])

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

      // K1 round 3 (ChatGPT review, commit f284c89, item 2): the
      // gallery-archive family's real thumbnails don't use <img src> at
      // all -- confirmed on the live reference (curl
      // https://www.vmk.hu/gallery/folder/1023) they render as
      // `<figure style="background-image:url('...')" alt="...">` inside
      // .col-content. Plain <img> extraction silently missed all of them.
      // Inventory three delivery mechanisms, not just <img src>:
      const imgTagImages = Array.from(root?.querySelectorAll('img') || [])
        .map((img) => ({
          src: img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('data-lazy-src') || '',
          alt: img.getAttribute('alt') || '',
          source: 'img',
        }))
        .filter((i) => i.src && !i.src.startsWith('data:'))

      const bgImages = Array.from(root?.querySelectorAll('[style*="background-image"]') || [])
        .map((el) => {
          const style = el.getAttribute('style') || ''
          const m = style.match(/background-image\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i)
          return m ? { src: m[1], alt: el.getAttribute('alt') || el.getAttribute('title') || '', source: 'css-background' } : null
        })
        .filter(Boolean)

      const srcsetImages = Array.from(root?.querySelectorAll('img[srcset], source[srcset]') || [])
        .flatMap((el) => (el.getAttribute('srcset') || '').split(',').map((entry) => entry.trim().split(/\s+/)[0]).filter(Boolean))
        .filter((src) => src && !src.startsWith('data:'))
        .map((src) => ({ src, alt: '', source: 'srcset' }))

      const seenImageSrc = new Set()
      const images = [...imgTagImages, ...bgImages, ...srcsetImages].filter((i) => {
        if (seenImageSrc.has(i.src)) return false
        seenImageSrc.add(i.src)
        return true
      })

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

// Perceptual hash (average hash / aHash): resize to 8x8 grayscale, compare
// each pixel to the mean -> 64-bit fingerprint. Cheap, dependency-free
// (sharp is already a project dependency for Payload's own media
// pipeline), and robust to re-encoding/resizing/rehosting -- exactly the
// K1 review's concern: the clone may legitimately serve a re-encoded or
// differently-sized copy of the same reference photo at a different URL,
// which plain URL/count comparison can never detect.
async function perceptualHash(buffer) {
  try {
    const { data } = await sharp(buffer)
      .resize(8, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const mean = data.reduce((a, b) => a + b, 0) / data.length
    let hash = 0n
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 1n) | (data[i] >= mean ? 1n : 0n)
    }
    return hash
  } catch {
    return null
  }
}

function hammingDistance(a, b) {
  let x = a ^ b
  let count = 0n
  while (x > 0n) {
    count += x & 1n
    x >>= 1n
  }
  return Number(count)
}

async function fetchImageBuffer(request, url) {
  try {
    const res = await request.get(url, { timeout: 10000 })
    if (!res.ok()) return null
    const ct = res.headers()['content-type'] || ''
    if (!ct.startsWith('image/')) return null
    return await res.body()
  } catch {
    return null
  }
}

// Caps how many images per side get downloaded+hashed, to keep a 22-route
// canary run bounded -- pages with large photo galleries (the exact family
// this check matters most for) are sampled, not exhaustively hashed here;
// full-scale identity matching across all 1626 gallery routes is K2 scope.
const MEDIA_HASH_LIMIT = 20
const MEDIA_HASH_MATCH_THRESHOLD = 10 // Hamming distance out of 64 bits

async function compareMediaByIdentity(refImages, cloneImages, refBase, cloneBase, refRequest, cloneRequest) {
  const refSample = refImages.slice(0, MEDIA_HASH_LIMIT)
  const cloneSample = cloneImages.slice(0, MEDIA_HASH_LIMIT)

  const refHashes = []
  for (const img of refSample) {
    const url = new URL(img.src, refBase).toString()
    const buf = await fetchImageBuffer(refRequest, url)
    const hash = buf ? await perceptualHash(buf) : null
    refHashes.push({ src: img.src, alt: img.alt, hash })
  }
  const cloneHashes = []
  for (const img of cloneSample) {
    const url = new URL(img.src, cloneBase).toString()
    const buf = await fetchImageBuffer(cloneRequest, url)
    const hash = buf ? await perceptualHash(buf) : null
    cloneHashes.push({ src: img.src, alt: img.alt, hash })
  }

  const matched = []
  const missing = []
  const usedClone = new Set()
  for (const r of refHashes) {
    if (r.hash === null) {
      missing.push({ src: r.src, alt: r.alt, reason: 'reference image could not be downloaded/decoded' })
      continue
    }
    let best = null
    let bestDist = Infinity
    for (let i = 0; i < cloneHashes.length; i++) {
      if (usedClone.has(i) || cloneHashes[i].hash === null) continue
      const d = hammingDistance(r.hash, cloneHashes[i].hash)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    }
    if (best !== null && bestDist <= MEDIA_HASH_MATCH_THRESHOLD) {
      usedClone.add(best)
      matched.push({ refSrc: r.src, cloneSrc: cloneHashes[best].src, distance: bestDist })
    } else {
      missing.push({ src: r.src, alt: r.alt, reason: 'no perceptually-matching image found in clone sample', closestDistance: bestDist === Infinity ? null : bestDist })
    }
  }

  return {
    refCount: refImages.length,
    cloneCount: cloneImages.length,
    sampledRef: refSample.length,
    sampledClone: cloneSample.length,
    matchedCount: matched.length,
    missingCount: missing.length,
    identityCoverage: refSample.length ? matched.length / refSample.length : 1,
    matched: matched.slice(0, 10),
    missing: missing.slice(0, 10),
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
    const media = await compareMediaByIdentity(refData.images, cloneData.images, refUrl, cloneUrl, refPage.request, clonePage.request)
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
    // K1 round 3 (ChatGPT review, commit f284c89, item 2): a media-heavy
    // family (gallery/archive) reporting 0 reference images is much more
    // likely an extraction gap than a genuine absence of media -- silently
    // scoring that PASS (as round 2 did) is a vacuous pass, not measurement.
    // Only non-media-family routes get the benefit of the doubt that 0/0 is
    // real. Media-family routes with 0 extracted reference images are
    // METHODOLOGY_BLOCKED instead: never PASS, and never silently misscored.
    const mediaHeavyFamily = MEDIA_HEAVY_FAMILIES.has(route.family)
    const vacuousZero = media.refCount === 0
    result.media = {
      ...media,
      brokenImageCount: brokenImages.length,
      brokenImageSample: brokenImages.slice(0, 5),
      reason: vacuousZero && mediaHeavyFamily ? 'media-heavy family but 0 images extracted from reference content -- treated as an extraction gap, not a verified absence of media' : undefined,
      // Identity coverage, not equal counts, per K1 review: a route only
      // passes MEDIA if the reference's actual photos (sampled, matched by
      // perceptual hash, not just present-somewhere) are present in the
      // clone, and nothing on the clone is broken.
      status:
        brokenImages.length > 0
          ? 'FAIL'
          : vacuousZero
            ? mediaHeavyFamily
              ? 'METHODOLOGY_BLOCKED'
              : 'PASS'
            : media.identityCoverage >= 0.95
              ? 'PASS'
              : media.identityCoverage >= 0.5
                ? 'PARTIAL'
                : 'FAIL',
    }
    result.links = {
      ...links,
      brokenLinkCount: brokenLinks.length,
      brokenLinkSample: brokenLinks.slice(0, 5),
      status: brokenLinks.length > 0 ? 'FAIL' : links.internalCoverage >= 0.99 && links.externalCoverage >= 0.99 ? 'PASS' : links.internalCoverage >= 0.7 ? 'PARTIAL' : 'FAIL',
    }
    {
      // Structural parity: the clone should have at least as much
      // structural richness as the reference's real content (a deficit in
      // any block type is a real signal; an excess is not penalized, since
      // the clone's own chrome/components can legitimately add markup the
      // reference didn't have).
      const refS = { headings: refData.headings.length, paragraphs: refData.paragraphs, lists: refData.lists, tables: refData.tables, forms: refData.forms }
      const cloneS = { headings: cloneData.headings.length, paragraphs: cloneData.paragraphs, lists: cloneData.lists, tables: cloneData.tables, forms: cloneData.forms }
      const deficits = Object.keys(refS).filter((k) => cloneS[k] < refS[k])
      result.structure = {
        ref: refS,
        clone: cloneS,
        deficits,
        status: deficits.length === 0 ? 'PASS' : deficits.length <= 1 ? 'PARTIAL' : 'FAIL',
      }
    }
    result.urlDimension.status = cloneRedirected && (route.family === 'gallery-archive' || route.family === 'gallery') && text.coverage < 0.3
      ? 'FAIL_GENERIC_REDIRECT'
      : 'PASS'
  } else if (result.refStatus && result.refStatus >= 400) {
    // K1 review (ChatGPT, commit a7b25db): a broken *reference* path is a
    // canary-list authoring mistake, not evidence the clone lacks parity --
    // scoring it PARITY_FAIL conflates "our route list is wrong" with "the
    // clone is missing content." Flag distinctly and exclude from parity
    // totals until the canary list itself is fixed (see the earlier
    // /kapcsolat -> /elerhetosegeink correction for a real example).
    result.urlDimension.status = 'CANARY_MAPPING_ERROR'
    result.text = { status: 'NOT_EVALUATED', reason: 'reference route did not resolve -- likely a wrong refPath in the canary list, not a clone content gap' }
    result.media = { status: 'NOT_EVALUATED' }
    result.links = { status: 'NOT_EVALUATED' }
    result.structure = { status: 'NOT_EVALUATED' }
  } else {
    result.urlDimension.status = 'FAIL'
    result.text = { status: 'NOT_EVALUATED', reason: 'clone page load failed' }
    result.media = { status: 'NOT_EVALUATED' }
    result.links = { status: 'NOT_EVALUATED' }
    result.structure = { status: 'NOT_EVALUATED' }
  }

  result.function = { status: 'NOT_APPLICABLE', reason: 'no distinct interactive workflow on this route for the current K1 canary; see clone-parity-function.mjs for the routes that do have one' }
  result.visual = { status: 'NOT_EVALUATED', note: 'separate screenshot-diff pass, see clone-parity-visual.mjs; overall is not final until clone-parity-finalize.mjs recomputes it post-merge' }

  // K1 round 3: this is a PRELIMINARY overall only -- VISUAL and (for most
  // routes) FUNCTION haven't been merged in yet at this point in the
  // pipeline (clone-parity-visual.mjs and clone-parity-function.mjs run
  // after this script and merge into the same results.json). The
  // authoritative, all-7-dimension overall is recomputed by
  // clone-parity-finalize.mjs once every dimension has real merged data.
  result.overall = computeOverall(result)

  await refCtx.close()
  await cloneCtx.close()
  return result
}

const jsonPath = path.join(OUT_DIR, 'results.json')

// K2 (COLLAB.md commit 8fec18e, checkpoint discipline): a full-inventory
// run covers ~270+ routes and can run for a long time. Writing results.json
// only after the whole loop finished meant a crash (or a background run
// that gets interrupted) on route 200/272 lost all progress on the first
// 199 -- no partial evidence, nothing to checkpoint-commit. Flushing after
// every route makes progress durable and inspectable mid-run, and is cheap
// (this file stays well under a few MB even at full-site scale).
function flushResults(currentBatchResults) {
  // Merge with whatever is already on disk: VISUAL/FUNCTION data from the
  // separate slower passes (by sub-field, as before), AND any route entries
  // not present in this run's route list at all (e.g. a prior, different
  // batch) -- so this never silently drops routes another invocation wrote.
  const existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf8')) : null
  const existingByPath = new Map((existing?.results || []).map((r) => [r.path, r]))
  const currentPaths = new Set(currentBatchResults.map((r) => r.path))

  for (const r of currentBatchResults) {
    const prior = existingByPath.get(r.path)
    if (prior?.visual) r.visual = prior.visual
    if (prior?.function && ['PASS', 'FAIL', 'PARTIAL'].includes(prior.function.status)) r.function = prior.function
  }
  const carriedOver = (existing?.results || []).filter((r) => !currentPaths.has(r.path))
  const merged = [...carriedOver, ...currentBatchResults]

  fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), refBase: REF_BASE, cloneBase: CLONE_BASE, results: merged, visualGeneratedAt: existing?.visualGeneratedAt, functionChecks: existing?.functionChecks }, null, 2))
  return merged
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
    flushResults(results)
  }
  await browser.close()

  const merged = flushResults(results)
  const resultsForSummary = merged

  // K1 review (ChatGPT, commit a7b25db): canary-list mapping errors (a
  // wrong reference path) must not count toward parity totals -- they
  // measure a mistake in tools/parity-canary-routes.json, not the clone.
  const canaryErrors = resultsForSummary.filter((r) => r.overall === 'CANARY_MAPPING_ERROR')
  const scored = resultsForSummary.filter((r) => r.overall !== 'CANARY_MAPPING_ERROR')
  const summary = {
    total: resultsForSummary.length,
    scoredTotal: scored.length,
    CANARY_MAPPING_ERROR: canaryErrors.length,
    canaryMappingErrorRoutes: canaryErrors.map((r) => r.path),
    PARITY_PASS: scored.filter((r) => r.overall === 'PARITY_PASS').length,
    PARITY_PARTIAL: scored.filter((r) => r.overall === 'PARITY_PARTIAL').length,
    PARITY_FAIL: scored.filter((r) => r.overall === 'PARITY_FAIL').length,
    ERROR: scored.filter((r) => r.overall === 'ERROR').length,
  }
  console.log('SUMMARY (provisional -- run clone-parity-finalize.mjs after visual+function for the authoritative one)', JSON.stringify(summary))
  fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2))
}

main()
