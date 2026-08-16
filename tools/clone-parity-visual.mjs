#!/usr/bin/env node
// Clone Parity Oracle v2 -- VISUAL dimension (K1, COLLAB.md section 4.7 / 6).
//
// Real screenshot diff at desktop (1440) and mobile (390) widths, reference
// vs clone, using pixelmatch on full-page PNG captures. Reads the same
// canary route list as clone-parity-oracle.mjs and merges its output into
// that tool's results.json so the HTML report shows a real VISUAL status
// instead of NOT_EVALUATED.
//
// Usage:
//   node tools/clone-parity-visual.mjs --routes=tools/parity-canary-routes.json \
//     --ref-base=https://www.vmk.hu --clone-base=http://localhost:3011 \
//     --out=docs/parity-oracle-v2

import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
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
const SHOTS_DIR = path.join(OUT_DIR, 'screenshots')

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

// A page's real height can legitimately differ between reference and clone
// (different content length) -- diffing must not silently resize/crop one
// image to match the other in a way that hides a missing section. Instead,
// pad both images to the taller of the two heights with a neutral fill
// before pixelmatch, so a height mismatch shows up as diffed area, not as
// invisible cropping.
function padToSameSize(imgA, imgB) {
  const width = Math.max(imgA.width, imgB.width)
  const height = Math.max(imgA.height, imgB.height)
  const pad = (img) => {
    if (img.width === width && img.height === height) return img
    const out = new PNG({ width, height })
    out.data.fill(255)
    PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0)
    return out
  }
  return [pad(imgA), pad(imgB), width, height]
}

async function captureAndDiff(browser, refUrl, cloneUrl, routeSlug) {
  const results = {}
  for (const vp of VIEWPORTS) {
    const refCtx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const cloneCtx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const refPage = await refCtx.newPage()
    const clonePage = await cloneCtx.newPage()

    let refBuf = null
    let cloneBuf = null
    try {
      await refPage.goto(refUrl, { waitUntil: 'networkidle', timeout: 30000 })
      // dismiss the reference's own cookie banner if present, so it doesn't
      // dominate the diff on every single route
      await refPage.evaluate(() => {
        const btn = document.querySelector('.cc-dismiss, .cc-btn, [class*="cookie"] button')
        if (btn) btn.click()
      }).catch(() => {})
      refBuf = await refPage.screenshot({ fullPage: true }).catch(() => null)
    } catch {
      /* leave null, recorded as capture failure below */
    }
    try {
      await clonePage.goto(cloneUrl, { waitUntil: 'networkidle', timeout: 30000 })
      cloneBuf = await clonePage.screenshot({ fullPage: true }).catch(() => null)
    } catch {
      /* leave null */
    }

    await refCtx.close()
    await cloneCtx.close()

    if (!refBuf || !cloneBuf) {
      results[vp.name] = { status: 'CAPTURE_FAILED', refCaptured: !!refBuf, cloneCaptured: !!cloneBuf }
      continue
    }

    fs.mkdirSync(SHOTS_DIR, { recursive: true })
    const refPath = path.join(SHOTS_DIR, `${routeSlug}-${vp.name}-ref.png`)
    const clonePath = path.join(SHOTS_DIR, `${routeSlug}-${vp.name}-clone.png`)
    fs.writeFileSync(refPath, refBuf)
    fs.writeFileSync(clonePath, cloneBuf)

    let imgA, imgB
    try {
      imgA = PNG.sync.read(refBuf)
      imgB = PNG.sync.read(cloneBuf)
    } catch (e) {
      results[vp.name] = { status: 'DECODE_FAILED', error: String(e.message || e) }
      continue
    }

    const [paddedA, paddedB, width, height] = padToSameSize(imgA, imgB)
    const diffPng = new PNG({ width, height })
    const diffPixels = pixelmatch(paddedA.data, paddedB.data, diffPng.data, width, height, { threshold: 0.15 })
    const totalPixels = width * height
    const diffPct = Math.round((diffPixels / totalPixels) * 10000) / 100

    const diffPath = path.join(SHOTS_DIR, `${routeSlug}-${vp.name}-diff.png`)
    fs.writeFileSync(diffPath, PNG.sync.write(diffPng))

    results[vp.name] = {
      status: diffPct <= 15 ? 'PASS' : diffPct <= 40 ? 'PARTIAL' : 'FAIL',
      diffPct,
      refHeight: imgA.height,
      cloneHeight: imgB.height,
      heightDeltaPct: Math.round((Math.abs(imgA.height - imgB.height) / Math.max(imgA.height, imgB.height)) * 10000) / 100,
      refImage: path.relative(OUT_DIR, refPath),
      cloneImage: path.relative(OUT_DIR, clonePath),
      diffImage: path.relative(OUT_DIR, diffPath),
    }
  }
  return results
}

function slugify(p) {
  return (p === '/' ? 'home' : p).replace(/^\//, '').replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 80)
}

async function main() {
  const routes = JSON.parse(fs.readFileSync(ROUTES_FILE, 'utf8'))
  const resultsPath = path.join(OUT_DIR, 'results.json')
  const existing = fs.existsSync(resultsPath) ? JSON.parse(fs.readFileSync(resultsPath, 'utf8')) : { results: [] }
  const byPath = new Map(existing.results.map((r) => [r.path, r]))

  const browser = await chromium.launch()
  for (const route of routes) {
    const refUrl = `${REF_BASE}${route.refPath || route.path}`
    const cloneUrl = `${CLONE_BASE}${route.path}`
    process.stderr.write(`Visual diff ${route.path} ...\n`)
    const visual = await captureAndDiff(browser, refUrl, cloneUrl, slugify(route.path))
    const overallVisual = Object.values(visual).every((v) => v.status === 'PASS')
      ? 'PASS'
      : Object.values(visual).some((v) => v.status === 'FAIL' || v.status === 'CAPTURE_FAILED' || v.status === 'DECODE_FAILED')
        ? 'FAIL'
        : 'PARTIAL'
    process.stderr.write(`  -> ${overallVisual} (${Object.entries(visual).map(([k, v]) => `${k}:${v.status}${v.diffPct !== undefined ? ' ' + v.diffPct + '%' : ''}`).join(', ')})\n`)

    const existingRoute = byPath.get(route.path)
    if (existingRoute) {
      existingRoute.visual = { status: overallVisual, ...visual }
    } else {
      byPath.set(route.path, { path: route.path, refUrl, cloneUrl, family: route.family, visual: { status: overallVisual, ...visual } })
    }
  }
  await browser.close()

  existing.results = Array.from(byPath.values())
  existing.visualGeneratedAt = new Date().toISOString()
  fs.writeFileSync(resultsPath, JSON.stringify(existing, null, 2))
  console.log('Updated', resultsPath, 'with VISUAL dimension for', routes.length, 'routes')
}

main()
