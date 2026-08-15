#!/usr/bin/env node
/**
 * VMK Visual Clone Oracle
 *
 * Deterministic, route-aware visual parity checker for www.vmk.hu -> local clone.
 *
 * Modes:
 *   discover  Crawl the reference site breadth-first and write route-manifest.json.
 *   capture   Crawl + freeze reference screenshots/metadata as baseline.
 *   compare   Compare local clone against a previously captured baseline.
 *   live      Compare live reference and local clone in the same Chromium run.
 *
 * Examples:
 *   node tools/visual-oracle.mjs discover --depth=1
 *   node tools/visual-oracle.mjs live --depth=1 --max-routes=30
 *   node tools/visual-oracle.mjs live --route=/nyitvatartas
 *   node tools/visual-oracle.mjs capture --depth=1
 *   node tools/visual-oracle.mjs compare
 */

import { chromium } from 'playwright'
import sharp from 'sharp'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DEFAULT_CONFIG = path.join(__dirname, 'visual-oracle.config.json')

function parseArgs(argv) {
  const args = { _: [] }
  for (const token of argv) {
    if (!token.startsWith('--')) {
      args._.push(token)
      continue
    }
    const raw = token.slice(2)
    const eq = raw.indexOf('=')
    if (eq === -1) args[raw] = true
    else args[raw.slice(0, eq)] = raw.slice(eq + 1)
  }
  return args
}

const args = parseArgs(process.argv.slice(2))
const mode = args._[0] ?? 'live'
const configPath = path.resolve(ROOT, String(args.config ?? DEFAULT_CONFIG))
if (!existsSync(configPath)) {
  throw new Error(`Visual Oracle config not found: ${configPath}`)
}
const config = JSON.parse(readFileSync(configPath, 'utf8'))

const REFERENCE_BASE = new URL(String(args['reference-url'] ?? config.referenceBaseUrl ?? 'https://www.vmk.hu/'))
const LOCAL_BASE = new URL(String(args['local-url'] ?? config.localBaseUrl ?? 'http://localhost:3001/'))
const DEPTH = Number(args.depth ?? config.depth ?? 1)
const MAX_ROUTES = Number(args['max-routes'] ?? config.maxRoutes ?? 1000)
const TOP_REGIONS = Number(args['top-regions'] ?? config.topRegions ?? 8)
const PIXEL_THRESHOLD = Number(args.threshold ?? config.pixelThreshold ?? 0)
const MAX_PIXEL_DIFF = Number(args['max-pixel-diff'] ?? config.maxPixelDiffPercent ?? 5)
const MAX_HEIGHT_DIFF = Number(args['max-height-diff'] ?? config.maxHeightDiffPercent ?? 5)
const MIN_CONTENT_SIMILARITY = Number(args['min-content-similarity'] ?? config.minContentSimilarityPercent ?? 95)
const OUT_DIR = path.resolve(ROOT, String(args.out ?? config.outputDir ?? '.visual-oracle'))
const REPORT_DIR = path.join(OUT_DIR, 'report')
const BASELINE_DIR = path.join(OUT_DIR, 'baseline')
const MANIFEST_FILE = path.join(OUT_DIR, 'route-manifest.json')
const BASELINE_MANIFEST_FILE = path.join(BASELINE_DIR, 'manifest.json')
const selectedRoutes = parseRouteSelection(args.route)
const viewports = parseViewports(args.viewports ?? config.viewports ?? ['1440x1000', '390x844'])

const assetExtension = /\.(?:avif|bmp|css|csv|docx?|eot|gif|ico|jpe?g|js|json|map|mp3|mp4|ogg|otf|pdf|png|pptx?|rar|rss|svg|tar|tiff?|ttf|txt|wav|webm|webp|woff2?|xlsx?|xml|zip)$/i
const excludePatterns = (config.excludePatterns ?? []).map((pattern) => new RegExp(pattern))
const volatileSelectors = Array.from(new Set([
  ...(config.volatileSelectors ?? []),
  '.cc-window',
  '.cc-revoke',
]))
const cookieSelectors = Array.from(new Set([
  ...(config.cookieSelectors ?? []),
  '.cc-nb-okagree',
  'button:has-text("Got it")',
  'button:has-text("Elfogad")',
]))
const routeOverrides = config.routeOverrides ?? {}

mkdirSync(OUT_DIR, { recursive: true })
mkdirSync(REPORT_DIR, { recursive: true })
mkdirSync(BASELINE_DIR, { recursive: true })

function parseRouteSelection(value) {
  if (!value) return []
  const values = Array.isArray(value) ? value : String(value).split(',')
  return values.map((v) => normalizePath(v.trim())).filter(Boolean)
}

function parseViewports(value) {
  const items = Array.isArray(value) ? value : String(value).split(',')
  return items.map((item) => {
    if (typeof item === 'object' && item.width && item.height) {
      return { name: item.name ?? `${item.width}x${item.height}`, width: Number(item.width), height: Number(item.height) }
    }
    const match = String(item).trim().match(/^(?:(.+?):)?(\d+)x(\d+)$/)
    if (!match) throw new Error(`Invalid viewport: ${item}`)
    return { name: match[1] ?? `${match[2]}x${match[3]}`, width: Number(match[2]), height: Number(match[3]) }
  })
}

function normalizePath(value) {
  if (!value) return '/'
  const url = new URL(value, REFERENCE_BASE)
  url.hash = ''
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_|fbclid|gclid)/i.test(key)) url.searchParams.delete(key)
  }
  let pathname = url.pathname.replace(/\/{2,}/g, '/')
  if (pathname.length > 1) pathname = pathname.replace(/\/$/, '')
  const search = url.searchParams.toString()
  return `${pathname || '/'}${search ? `?${search}` : ''}`
}

function isCrawlableUrl(href) {
  if (!href) return false
  if (/^(?:mailto:|tel:|javascript:|data:)/i.test(href)) return false
  let url
  try {
    url = new URL(href, REFERENCE_BASE)
  } catch {
    return false
  }
  // Compare hostname, not full origin: the live site links to some of its
  // own pages with a stale http:// scheme (server 301s to https). Comparing
  // origin (scheme+host) silently dropped those same-site pages from the
  // crawl; subdomains (konyvtar./helyismeret./tlwww.vmk.hu) still differ by
  // hostname and stay excluded.
  if (url.hostname !== REFERENCE_BASE.hostname) return false
  if (assetExtension.test(url.pathname)) return false
  const normalized = normalizePath(url.toString())
  if (excludePatterns.some((pattern) => pattern.test(normalized))) return false
  return true
}

function routeId(routePath) {
  if (routePath === '/') return 'home'
  const base = routePath
    .replace(/^\//, '')
    .replace(/[?&=]/g, '-')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return base || 'home'
}

function localUrlFor(referencePath) {
  const override = routeOverrides[referencePath] ?? referencePath
  return new URL(override, LOCAL_BASE).toString()
}

function referenceUrlFor(referencePath) {
  return new URL(referencePath, REFERENCE_BASE).toString()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function dismissCookies(page) {
  for (const selector of cookieSelectors) {
    try {
      const locator = page.locator(selector).first()
      if (await locator.isVisible({ timeout: 300 }).catch(() => false)) {
        await locator.click({ timeout: 1000 }).catch(() => {})
        await sleep(150)
      }
    } catch {
      // Optional banner; ignore.
    }
  }
}

async function stabilizePage(page) {
  await page.addStyleTag({
    content: `
      html { scroll-behavior: auto !important; }
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
      ${volatileSelectors.map((selector) => `${selector} { visibility: hidden !important; }`).join('\n')}
    `,
  }).catch(() => {})

  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready
  }).catch(() => {})

  // Force lazy-loaded content to enter the viewport at least once.
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.75))
    const max = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 35))
    }
    window.scrollTo(0, 0)
  }).catch(() => {})

  await page.waitForFunction(() => {
    return [...document.images].every((img) => img.complete)
  }, null, { timeout: 5000 }).catch(() => {})

  await sleep(200)
}

async function openPage(page, url) {
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await dismissCookies(page)
  await stabilizePage(page)
  return response
}

async function collectPageSnapshot(page) {
  return page.evaluate(() => {
    const visible = (el) => {
      const style = getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
    }
    const clean = (text) => String(text ?? '').replace(/\s+/g, ' ').trim()
    const rectOf = (el) => {
      const r = el.getBoundingClientRect()
      return {
        x: Math.round(r.x + window.scrollX),
        y: Math.round(r.y + window.scrollY),
        width: Math.round(r.width),
        height: Math.round(r.height),
      }
    }
    const landmarks = [...document.querySelectorAll('header, nav, main, aside, footer')]
      .filter(visible)
      .slice(0, 30)
      .map((el, index) => ({
        key: `${el.tagName.toLowerCase()}#${index}`,
        tag: el.tagName.toLowerCase(),
        text: clean(el.textContent).slice(0, 100),
        rect: rectOf(el),
      }))
    const headings = [...document.querySelectorAll('h1, h2, h3')]
      .filter(visible)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: clean(el.textContent),
        rect: rectOf(el),
      }))
      .filter((h) => h.text)
      .slice(0, 100)
    const text = clean(document.body?.innerText ?? '')
    return {
      title: document.title,
      url: location.href,
      width: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
      text,
      headings,
      landmarks,
      imageCount: [...document.images].filter(visible).length,
      linkCount: [...document.querySelectorAll('a[href]')].filter(visible).length,
      tableCount: [...document.querySelectorAll('table')].filter(visible).length,
      formCount: [...document.querySelectorAll('form')].filter(visible).length,
    }
  })
}

async function stableScreenshot(page, filePath) {
  mkdirSync(path.dirname(filePath), { recursive: true })
  const options = {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
    scale: 'css',
  }
  let previous = null
  let last = null
  for (let attempt = 0; attempt < 4; attempt += 1) {
    last = await page.screenshot(options)
    if (previous) {
      const stability = await rawMismatch(previous, last, 0)
      if (stability.percent <= 0.01) break
    }
    previous = last
    await sleep(180)
  }
  writeFileSync(filePath, last)
  return last
}

async function rawMismatch(leftBuffer, rightBuffer, threshold = 0) {
  const leftMeta = await sharp(leftBuffer).metadata()
  const rightMeta = await sharp(rightBuffer).metadata()
  const width = Math.max(leftMeta.width ?? 1, rightMeta.width ?? 1)
  const height = Math.max(leftMeta.height ?? 1, rightMeta.height ?? 1)
  const left = await normalizeImage(leftBuffer, width, height)
  const right = await normalizeImage(rightBuffer, width, height)
  let different = 0
  const pixels = width * height
  for (let i = 0; i < left.length; i += 3) {
    const d = Math.max(
      Math.abs(left[i] - right[i]),
      Math.abs(left[i + 1] - right[i + 1]),
      Math.abs(left[i + 2] - right[i + 2]),
    )
    if (d > threshold) different += 1
  }
  return { different, pixels, percent: pixels ? (different / pixels) * 100 : 0 }
}

async function normalizeImage(buffer, width, height) {
  const metadata = await sharp(buffer).metadata()
  const sourceWidth = metadata.width ?? width
  const sourceHeight = metadata.height ?? height
  return sharp(buffer)
    .flatten({ background: '#ffffff' })
    .extend({
      top: 0,
      left: 0,
      right: Math.max(0, width - sourceWidth),
      bottom: Math.max(0, height - sourceHeight),
      background: '#ffffff',
    })
    .resize(width, height, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer()
}

function wordSet(text) {
  return new Set(
    String(text ?? '')
      .toLocaleLowerCase('hu-HU')
      .normalize('NFKC')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 1),
  )
}

function contentSimilarity(reference, local) {
  const a = wordSet(reference.text)
  const b = wordSet(local.text)
  if (!a.size && !b.size) return 100
  let intersection = 0
  for (const word of a) if (b.has(word)) intersection += 1
  const union = new Set([...a, ...b]).size
  return union ? (intersection / union) * 100 : 0
}

function geometryComparison(reference, local) {
  const refHeadings = reference.headings ?? []
  const localHeadings = local.headings ?? []
  const localByText = new Map()
  for (const heading of localHeadings) {
    const key = heading.text.toLocaleLowerCase('hu-HU')
    if (!localByText.has(key)) localByText.set(key, heading)
  }
  const headingMatches = []
  for (const ref of refHeadings) {
    const match = localByText.get(ref.text.toLocaleLowerCase('hu-HU'))
    if (!match) continue
    headingMatches.push({
      text: ref.text,
      tag: ref.tag,
      reference: ref.rect,
      local: match.rect,
      delta: {
        x: match.rect.x - ref.rect.x,
        y: match.rect.y - ref.rect.y,
        width: match.rect.width - ref.rect.width,
        height: match.rect.height - ref.rect.height,
      },
    })
  }
  const heightDiffPercent = reference.height
    ? (Math.abs(reference.height - local.height) / reference.height) * 100
    : 0
  return {
    heightDiffPercent,
    widthDiff: local.width - reference.width,
    headingMatches,
  }
}

// Pads `buffer` (whose own metadata is `meta`) up to width x height with a
// white background, materializing the extended image to its own buffer
// before returning it. This sharp/libvips build (0.35.3 / 8.18.3) fails
// with "extract_area: bad extract area" when .extend() and .extract() are
// chained in a single lazy pipeline and the extract region falls inside the
// newly padded area -- reproduced in isolation outside this codebase.
// Materializing the extend step first (a real toBuffer() round-trip) avoids
// the fused pipeline and lets a later .extract() reach the padded pixels.
async function padToCanvas(buffer, meta, width, height) {
  return sharp(buffer)
    .flatten({ background: '#ffffff' })
    .extend({
      top: 0,
      left: 0,
      right: Math.max(0, width - (meta.width ?? width)),
      bottom: Math.max(0, height - (meta.height ?? height)),
      background: '#ffffff',
    })
    .png()
    .toBuffer()
}

async function imageComparison(referenceBuffer, localBuffer, dir) {
  const refMeta = await sharp(referenceBuffer).metadata()
  const localMeta = await sharp(localBuffer).metadata()
  const width = Math.max(refMeta.width ?? 1, localMeta.width ?? 1)
  const height = Math.max(refMeta.height ?? 1, localMeta.height ?? 1)
  const reference = await normalizeImage(referenceBuffer, width, height)
  const local = await normalizeImage(localBuffer, width, height)
  const pixels = width * height
  const mask = new Uint8Array(pixels)
  const heat = Buffer.alloc(pixels * 3)
  const overlay = Buffer.alloc(pixels * 3)
  let different = 0
  let differenceMagnitude = 0

  for (let p = 0, i = 0; p < pixels; p += 1, i += 3) {
    const dr = Math.abs(reference[i] - local[i])
    const dg = Math.abs(reference[i + 1] - local[i + 1])
    const db = Math.abs(reference[i + 2] - local[i + 2])
    const max = Math.max(dr, dg, db)
    differenceMagnitude += (dr + dg + db) / 3
    const isDifferent = max > PIXEL_THRESHOLD
    if (isDifferent) {
      different += 1
      mask[p] = 1
      heat[i] = 255
      heat[i + 1] = 40
      heat[i + 2] = 40
    } else {
      const gray = Math.round((reference[i] + reference[i + 1] + reference[i + 2]) / 3)
      const faded = Math.round(gray * 0.4 + 255 * 0.6)
      heat[i] = faded
      heat[i + 1] = faded
      heat[i + 2] = faded
    }
    overlay[i] = Math.round((reference[i] + local[i]) / 2)
    overlay[i + 1] = Math.round((reference[i + 1] + local[i + 1]) / 2)
    overlay[i + 2] = Math.round((reference[i + 2] + local[i + 2]) / 2)
  }

  mkdirSync(dir, { recursive: true })
  await sharp(heat, { raw: { width, height, channels: 3 } }).png().toFile(path.join(dir, 'diff-heatmap.png'))
  await sharp(overlay, { raw: { width, height, channels: 3 } }).png().toFile(path.join(dir, 'overlay.png'))

  const regions = detectRegions(mask, width, height, TOP_REGIONS)
  for (let index = 0; index < regions.length; index += 1) {
    const region = regions[index]
    const cropDir = path.join(dir, 'regions')
    mkdirSync(cropDir, { recursive: true })
    const crop = {
      left: region.x,
      top: region.y,
      width: region.width,
      height: region.height,
    }
    await sharp(await padToCanvas(referenceBuffer, refMeta, width, height))
      .extract(crop)
      .png()
      .toFile(path.join(cropDir, `${String(index + 1).padStart(2, '0')}-reference.png`))
    await sharp(await padToCanvas(localBuffer, localMeta, width, height))
      .extract(crop)
      .png()
      .toFile(path.join(cropDir, `${String(index + 1).padStart(2, '0')}-local.png`))
    await sharp(heat, { raw: { width, height, channels: 3 } })
      .extract(crop)
      .png()
      .toFile(path.join(cropDir, `${String(index + 1).padStart(2, '0')}-diff.png`))
  }

  const coarse = await coarseMismatch(referenceBuffer, localBuffer)
  return {
    width,
    height,
    differentPixels: different,
    totalPixels: pixels,
    pixelMismatchPercent: pixels ? (different / pixels) * 100 : 0,
    meanAbsoluteDifference: pixels ? differenceMagnitude / pixels : 0,
    coarseMismatchPercent: coarse,
    regions,
  }
}

async function coarseMismatch(referenceBuffer, localBuffer) {
  const refMeta = await sharp(referenceBuffer).metadata()
  const localMeta = await sharp(localBuffer).metadata()
  const width = Math.max(refMeta.width ?? 1, localMeta.width ?? 1)
  const height = Math.max(refMeta.height ?? 1, localMeta.height ?? 1)
  const targetWidth = Math.max(1, Math.round(width / 8))
  const targetHeight = Math.max(1, Math.round(height / 8))
  const preprocess = (buffer) => sharp(buffer)
    .flatten({ background: '#ffffff' })
    .resize(targetWidth, targetHeight, { fit: 'fill' })
    .blur(0.8)
    .removeAlpha()
    .raw()
    .toBuffer()
  const [a, b] = await Promise.all([preprocess(referenceBuffer), preprocess(localBuffer)])
  let diff = 0
  const pixels = targetWidth * targetHeight
  for (let i = 0; i < a.length; i += 3) {
    const max = Math.max(
      Math.abs(a[i] - b[i]),
      Math.abs(a[i + 1] - b[i + 1]),
      Math.abs(a[i + 2] - b[i + 2]),
    )
    if (max > 8) diff += 1
  }
  return pixels ? (diff / pixels) * 100 : 0
}

function detectRegions(mask, width, height, limit) {
  const tile = 16
  const cols = Math.ceil(width / tile)
  const rows = Math.ceil(height / tile)
  const active = new Uint8Array(cols * rows)
  const density = new Float32Array(cols * rows)

  for (let ty = 0; ty < rows; ty += 1) {
    for (let tx = 0; tx < cols; tx += 1) {
      const x0 = tx * tile
      const y0 = ty * tile
      const x1 = Math.min(width, x0 + tile)
      const y1 = Math.min(height, y0 + tile)
      let changed = 0
      const count = (x1 - x0) * (y1 - y0)
      for (let y = y0; y < y1; y += 1) {
        const row = y * width
        for (let x = x0; x < x1; x += 1) changed += mask[row + x]
      }
      const ratio = count ? changed / count : 0
      const idx = ty * cols + tx
      density[idx] = ratio
      // A small amount of anti-alias noise should not create a defect region.
      if (ratio >= 0.03) active[idx] = 1
    }
  }

  const visited = new Uint8Array(active.length)
  const components = []
  const neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]

  for (let start = 0; start < active.length; start += 1) {
    if (!active[start] || visited[start]) continue
    const queue = [start]
    visited[start] = 1
    let q = 0
    let minX = cols
    let minY = rows
    let maxX = 0
    let maxY = 0
    let score = 0
    let tiles = 0
    while (q < queue.length) {
      const idx = queue[q++]
      const ty = Math.floor(idx / cols)
      const tx = idx % cols
      minX = Math.min(minX, tx)
      minY = Math.min(minY, ty)
      maxX = Math.max(maxX, tx)
      maxY = Math.max(maxY, ty)
      score += density[idx]
      tiles += 1
      for (const [dx, dy] of neighbors) {
        const nx = tx + dx
        const ny = ty + dy
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
        const ni = ny * cols + nx
        if (active[ni] && !visited[ni]) {
          visited[ni] = 1
          queue.push(ni)
        }
      }
    }
    if (tiles < 2) continue
    const padding = 12
    const x = Math.max(0, minX * tile - padding)
    const y = Math.max(0, minY * tile - padding)
    const x2 = Math.min(width, (maxX + 1) * tile + padding)
    const y2 = Math.min(height, (maxY + 1) * tile + padding)
    components.push({
      x,
      y,
      width: x2 - x,
      height: y2 - y,
      tileCount: tiles,
      densityPercent: (score / tiles) * 100,
      score,
    })
  }

  return components
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...region }, index) => ({ rank: index + 1, ...region }))
}

async function discoverRoutes(browser) {
  if (selectedRoutes.length) {
    return selectedRoutes.map((routePath) => ({ path: routePath, depth: routePath === '/' ? 0 : 1, source: 'cli' }))
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    locale: 'hu-HU',
    timezoneId: 'Europe/Budapest',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  const queue = [{ path: '/', depth: 0 }]
  const seen = new Map([['/', { path: '/', depth: 0, source: 'root' }]])

  while (queue.length && seen.size < MAX_ROUTES) {
    const current = queue.shift()
    if (current.depth >= DEPTH) continue
    const url = referenceUrlFor(current.path)
    try {
      const response = await openPage(page, url)
      const contentType = response?.headers()?.['content-type'] ?? ''
      if (response && (!response.ok() || !contentType.includes('text/html'))) continue
      const hrefs = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((a) => a.href))
      for (const href of hrefs) {
        if (!isCrawlableUrl(href)) continue
        const routePath = normalizePath(href)
        if (seen.has(routePath)) continue
        const entry = { path: routePath, depth: current.depth + 1, source: current.path }
        seen.set(routePath, entry)
        if (entry.depth < DEPTH) queue.push(entry)
        if (seen.size >= MAX_ROUTES) break
      }
    } catch (error) {
      console.warn(`WARN discover ${url}: ${error.message}`)
    }
  }

  await context.close()
  if (seen.size >= MAX_ROUTES) {
    console.warn(`WARN route discovery reached maxRoutes=${MAX_ROUTES}; raise the limit before treating coverage as complete.`)
  }
  return [...seen.values()].sort((a, b) => a.depth - b.depth || a.path.localeCompare(b.path, 'hu'))
}

function browserContextOptions(viewport) {
  return {
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    locale: 'hu-HU',
    timezoneId: 'Europe/Budapest',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  }
}

async function captureOne(browser, url, viewport, filePath) {
  const context = await browser.newContext(browserContextOptions(viewport))
  const page = await context.newPage()
  let response = null
  try {
    response = await openPage(page, url)
    const snapshot = await collectPageSnapshot(page)
    const screenshot = await stableScreenshot(page, filePath)
    return {
      ok: response ? response.ok() : true,
      status: response?.status() ?? null,
      finalUrl: page.url(),
      screenshot,
      snapshot,
    }
  } finally {
    await context.close()
  }
}

async function captureBaseline(browser, routes) {
  const baseline = {
    version: 1,
    capturedAt: new Date().toISOString(),
    referenceBaseUrl: REFERENCE_BASE.toString(),
    viewports,
    routes: [],
  }
  for (const route of routes) {
    const item = { ...route, referenceUrl: referenceUrlFor(route.path), viewports: {} }
    console.log(`\n[baseline] ${route.path}`)
    for (const viewport of viewports) {
      const dir = path.join(BASELINE_DIR, viewport.name)
      const filePath = path.join(dir, `${routeId(route.path)}.png`)
      try {
        const result = await captureOne(browser, item.referenceUrl, viewport, filePath)
        item.viewports[viewport.name] = {
          status: result.status,
          finalUrl: result.finalUrl,
          snapshot: result.snapshot,
          file: path.relative(BASELINE_DIR, filePath),
        }
        console.log(`  ${viewport.name}: ${result.status ?? 'n/a'} ${result.snapshot.width}x${result.snapshot.height}`)
      } catch (error) {
        item.viewports[viewport.name] = { error: error.message }
        console.error(`  ${viewport.name}: ERROR ${error.message}`)
      }
    }
    baseline.routes.push(item)
  }
  writeFileSync(BASELINE_MANIFEST_FILE, JSON.stringify(baseline, null, 2))
  return baseline
}

function readBaseline() {
  if (!existsSync(BASELINE_MANIFEST_FILE)) {
    throw new Error(`Baseline missing: ${BASELINE_MANIFEST_FILE}. Run: npm run visual:oracle:capture`)
  }
  return JSON.parse(readFileSync(BASELINE_MANIFEST_FILE, 'utf8'))
}

async function compareRouteViewport({ browser, route, viewport, baselineViewport = null, liveReference = false }) {
  const id = routeId(route.path)
  const resultDir = path.join(REPORT_DIR, viewport.name, id)
  mkdirSync(resultDir, { recursive: true })

  let referenceResult
  let referenceBuffer
  let referenceSnapshot
  let referenceStatus
  let referenceFinalUrl

  if (liveReference) {
    referenceResult = await captureOne(browser, referenceUrlFor(route.path), viewport, path.join(resultDir, 'reference.png'))
    referenceBuffer = referenceResult.screenshot
    referenceSnapshot = referenceResult.snapshot
    referenceStatus = referenceResult.status
    referenceFinalUrl = referenceResult.finalUrl
  } else {
    if (!baselineViewport?.file) throw new Error(`No baseline for ${route.path} @ ${viewport.name}`)
    const baselinePath = path.join(BASELINE_DIR, baselineViewport.file)
    referenceBuffer = readFileSync(baselinePath)
    referenceSnapshot = baselineViewport.snapshot
    referenceStatus = baselineViewport.status
    referenceFinalUrl = baselineViewport.finalUrl
    writeFileSync(path.join(resultDir, 'reference.png'), referenceBuffer)
  }

  const localResult = await captureOne(browser, localUrlFor(route.path), viewport, path.join(resultDir, 'local.png'))
  const image = await imageComparison(referenceBuffer, localResult.screenshot, resultDir)
  const geometry = geometryComparison(referenceSnapshot, localResult.snapshot)
  const contentSimilarityPercent = contentSimilarity(referenceSnapshot, localResult.snapshot)
  const failures = []
  if (localResult.status != null && localResult.status >= 400) failures.push(`local HTTP ${localResult.status}`)
  if (image.pixelMismatchPercent > MAX_PIXEL_DIFF) failures.push(`pixel ${image.pixelMismatchPercent.toFixed(2)}% > ${MAX_PIXEL_DIFF}%`)
  if (geometry.heightDiffPercent > MAX_HEIGHT_DIFF) failures.push(`height ${geometry.heightDiffPercent.toFixed(2)}% > ${MAX_HEIGHT_DIFF}%`)
  if (contentSimilarityPercent < MIN_CONTENT_SIMILARITY) failures.push(`content ${contentSimilarityPercent.toFixed(2)}% < ${MIN_CONTENT_SIMILARITY}%`)

  return {
    route: route.path,
    depth: route.depth,
    viewport: viewport.name,
    referenceUrl: referenceUrlFor(route.path),
    referenceFinalUrl,
    referenceStatus,
    localUrl: localUrlFor(route.path),
    localFinalUrl: localResult.finalUrl,
    localStatus: localResult.status,
    pixelMismatchPercent: image.pixelMismatchPercent,
    coarseMismatchPercent: image.coarseMismatchPercent,
    meanAbsoluteDifference: image.meanAbsoluteDifference,
    heightDiffPercent: geometry.heightDiffPercent,
    contentSimilarityPercent,
    geometry,
    counts: {
      reference: {
        images: referenceSnapshot.imageCount,
        links: referenceSnapshot.linkCount,
        tables: referenceSnapshot.tableCount,
        forms: referenceSnapshot.formCount,
      },
      local: {
        images: localResult.snapshot.imageCount,
        links: localResult.snapshot.linkCount,
        tables: localResult.snapshot.tableCount,
        forms: localResult.snapshot.formCount,
      },
    },
    regions: image.regions,
    files: {
      reference: `${viewport.name}/${id}/reference.png`,
      local: `${viewport.name}/${id}/local.png`,
      heatmap: `${viewport.name}/${id}/diff-heatmap.png`,
      overlay: `${viewport.name}/${id}/overlay.png`,
    },
    status: failures.length ? 'FAIL' : 'PASS',
    failures,
  }
}

async function runComparison(browser, routes, baseline = null, liveReference = false) {
  const results = []
  const baselineByRoute = new Map((baseline?.routes ?? []).map((route) => [route.path, route]))
  for (const route of routes) {
    console.log(`\n[oracle] ${route.path}`)
    for (const viewport of viewports) {
      try {
        const baselineViewport = baselineByRoute.get(route.path)?.viewports?.[viewport.name] ?? null
        const result = await compareRouteViewport({ browser, route, viewport, baselineViewport, liveReference })
        results.push(result)
        console.log(
          `  ${viewport.name}: ${result.status} | pixel ${result.pixelMismatchPercent.toFixed(2)}% | coarse ${result.coarseMismatchPercent.toFixed(2)}% | height ${result.heightDiffPercent.toFixed(2)}% | content ${result.contentSimilarityPercent.toFixed(2)}%`,
        )
        for (const failure of result.failures) console.log(`    - ${failure}`)
        for (const region of result.regions.slice(0, 3)) {
          console.log(`    #${region.rank} region x=${region.x}-${region.x + region.width} y=${region.y}-${region.y + region.height} density=${region.densityPercent.toFixed(1)}%`)
        }
      } catch (error) {
        console.error(`  ${viewport.name}: ERROR ${error.message}`)
        results.push({
          route: route.path,
          depth: route.depth,
          viewport: viewport.name,
          referenceUrl: referenceUrlFor(route.path),
          localUrl: localUrlFor(route.path),
          status: 'ERROR',
          failures: [error.message],
          regions: [],
        })
      }
    }
  }

  const report = {
    version: 1,
    generatedAt: new Date().toISOString(),
    mode: liveReference ? 'live' : 'baseline',
    referenceBaseUrl: REFERENCE_BASE.toString(),
    localBaseUrl: LOCAL_BASE.toString(),
    thresholds: {
      pixelMismatchPercent: MAX_PIXEL_DIFF,
      heightDiffPercent: MAX_HEIGHT_DIFF,
      contentSimilarityPercent: MIN_CONTENT_SIMILARITY,
      pixelThreshold: PIXEL_THRESHOLD,
    },
    routes,
    results,
    summary: summarize(results),
  }
  writeFileSync(path.join(REPORT_DIR, 'report.json'), JSON.stringify(report, null, 2))
  writeFileSync(path.join(REPORT_DIR, 'index.html'), renderHtmlReport(report))
  return report
}

function summarize(results) {
  const pass = results.filter((r) => r.status === 'PASS').length
  const fail = results.filter((r) => r.status === 'FAIL').length
  const error = results.filter((r) => r.status === 'ERROR').length
  const measured = results.filter((r) => Number.isFinite(r.pixelMismatchPercent))
  const avgPixel = measured.length ? measured.reduce((sum, r) => sum + r.pixelMismatchPercent, 0) / measured.length : null
  const worst = [...measured]
    .sort((a, b) => b.pixelMismatchPercent - a.pixelMismatchPercent)
    .slice(0, 10)
    .map((r) => ({ route: r.route, viewport: r.viewport, pixelMismatchPercent: r.pixelMismatchPercent, status: r.status }))
  return { total: results.length, pass, fail, error, averagePixelMismatchPercent: avgPixel, worst }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderHtmlReport(report) {
  const rows = report.results.map((r, index) => {
    const statusClass = r.status.toLowerCase()
    const regionRows = (r.regions ?? []).slice(0, 5).map((region) => `
      <li>#${region.rank}: x=${region.x}..${region.x + region.width}, y=${region.y}..${region.y + region.height}, density=${region.densityPercent.toFixed(1)}%</li>`).join('')
    const metrics = r.status === 'ERROR'
      ? `<p class="failures">${escapeHtml((r.failures ?? []).join('; '))}</p>`
      : `
        <div class="metrics">
          <span><b>pixel</b> ${r.pixelMismatchPercent.toFixed(2)}%</span>
          <span><b>coarse</b> ${r.coarseMismatchPercent.toFixed(2)}%</span>
          <span><b>height</b> ${r.heightDiffPercent.toFixed(2)}%</span>
          <span><b>content</b> ${r.contentSimilarityPercent.toFixed(2)}%</span>
        </div>
        ${(r.failures ?? []).length ? `<p class="failures">${escapeHtml(r.failures.join(' · '))}</p>` : ''}
      `
    const visual = r.files ? `
      <div class="visual-grid">
        <div>
          <h4>Reference / Clone scrubber</h4>
          <div class="scrubber" data-scrubber>
            <img src="${escapeHtml(r.files.reference)}" alt="Reference">
            <div class="local-layer" data-layer><img src="${escapeHtml(r.files.local)}" alt="Clone"></div>
          </div>
          <input type="range" min="0" max="100" value="50" data-slider aria-label="Reference/clone overlay">
        </div>
        <div>
          <h4>Diff heatmap</h4>
          <a href="${escapeHtml(r.files.heatmap)}"><img class="heatmap" src="${escapeHtml(r.files.heatmap)}" alt="Diff heatmap"></a>
        </div>
      </div>
    ` : ''
    return `
      <details class="result ${statusClass}" ${index < 5 ? 'open' : ''}>
        <summary>
          <span class="status">${escapeHtml(r.status)}</span>
          <code>${escapeHtml(r.route)}</code>
          <span>${escapeHtml(r.viewport)}</span>
          ${Number.isFinite(r.pixelMismatchPercent) ? `<strong>${r.pixelMismatchPercent.toFixed(2)}%</strong>` : ''}
        </summary>
        ${metrics}
        ${visual}
        ${regionRows ? `<h4>Top defect regions</h4><ol>${regionRows}</ol>` : ''}
      </details>
    `
  }).join('\n')

  return `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VMK Visual Clone Oracle</title>
<style>
  :root { font-family: ui-sans-serif, system-ui, sans-serif; color-scheme: light dark; }
  body { max-width: 1500px; margin: 0 auto; padding: 24px; }
  h1 { margin-bottom: 4px; }
  .summary { display: flex; gap: 12px; flex-wrap: wrap; margin: 20px 0; }
  .pill { border: 1px solid #8886; border-radius: 999px; padding: 8px 12px; }
  .result { border: 1px solid #8885; border-radius: 10px; margin: 10px 0; overflow: hidden; }
  .result > summary { display: grid; grid-template-columns: 70px minmax(240px,1fr) 120px 90px; gap: 12px; align-items: center; cursor: pointer; padding: 12px 14px; }
  .result > :not(summary) { margin-left: 14px; margin-right: 14px; }
  .pass { border-left: 5px solid #2e9d59; }
  .fail, .error { border-left: 5px solid #d64545; }
  .status { font-weight: 700; }
  .metrics { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 12px; }
  .failures { font-weight: 600; }
  .visual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 16px 14px 20px; align-items: start; }
  .scrubber { position: relative; overflow: hidden; border: 1px solid #8885; background: white; }
  .scrubber > img, .local-layer img, .heatmap { display: block; width: 100%; height: auto; }
  .local-layer { position: absolute; inset: 0; width: 50%; overflow: hidden; border-right: 2px solid #ff3b30; }
  .local-layer img { width: var(--oracle-image-width, 100%); max-width: none; }
  input[type=range] { width: 100%; }
  code { overflow-wrap: anywhere; }
  @media (max-width: 800px) { .visual-grid { grid-template-columns: 1fr; } .result > summary { grid-template-columns: 60px 1fr; } }
</style>
</head>
<body>
<h1>VMK Visual Clone Oracle</h1>
<p>${escapeHtml(report.generatedAt)} · mode=${escapeHtml(report.mode)} · reference=${escapeHtml(report.referenceBaseUrl)} · local=${escapeHtml(report.localBaseUrl)}</p>
<div class="summary">
  <span class="pill">Total: <b>${report.summary.total}</b></span>
  <span class="pill">PASS: <b>${report.summary.pass}</b></span>
  <span class="pill">FAIL: <b>${report.summary.fail}</b></span>
  <span class="pill">ERROR: <b>${report.summary.error}</b></span>
  <span class="pill">Avg pixel: <b>${report.summary.averagePixelMismatchPercent == null ? 'n/a' : report.summary.averagePixelMismatchPercent.toFixed(2) + '%'}</b></span>
</div>
${rows}
<script>
  for (const root of document.querySelectorAll('[data-scrubber]')) {
    const details = root.closest('details')
    const slider = details.querySelector('[data-slider]')
    const layer = root.querySelector('[data-layer]')
    const localImage = layer.querySelector('img')
    const referenceImage = root.querySelector(':scope > img')
    const sync = () => {
      layer.style.width = slider.value + '%'
      if (referenceImage.clientWidth) localImage.style.width = referenceImage.clientWidth + 'px'
    }
    slider.addEventListener('input', sync)
    new ResizeObserver(sync).observe(root)
    sync()
  }
</script>
</body>
</html>`
}

function writeRouteManifest(routes) {
  writeFileSync(MANIFEST_FILE, JSON.stringify({
    generatedAt: new Date().toISOString(),
    referenceBaseUrl: REFERENCE_BASE.toString(),
    depth: DEPTH,
    routes,
  }, null, 2))
}

async function main() {
  if (!['discover', 'capture', 'compare', 'live'].includes(mode)) {
    throw new Error(`Unknown mode: ${mode}. Use discover, capture, compare or live.`)
  }

  console.log('VMK Visual Clone Oracle')
  console.log(`mode=${mode} reference=${REFERENCE_BASE} local=${LOCAL_BASE}`)
  console.log(`depth=${DEPTH} viewports=${viewports.map((v) => v.name).join(',')} threshold=${PIXEL_THRESHOLD}`)

  const browser = await chromium.launch()
  try {
    let routes
    if (mode === 'compare' && !selectedRoutes.length) {
      const baseline = readBaseline()
      routes = baseline.routes.map(({ path: routePath, depth = 0, source = 'baseline' }) => ({ path: routePath, depth, source }))
    } else {
      routes = await discoverRoutes(browser)
    }
    writeRouteManifest(routes)
    console.log(`Routes: ${routes.length}`)

    if (mode === 'discover') {
      console.log(`Manifest: ${MANIFEST_FILE}`)
      return
    }
    if (mode === 'capture') {
      await captureBaseline(browser, routes)
      console.log(`Baseline: ${BASELINE_MANIFEST_FILE}`)
      return
    }

    const baseline = mode === 'compare' ? readBaseline() : null
    const report = await runComparison(browser, routes, baseline, mode === 'live')
    console.log('\nSUMMARY')
    console.log(JSON.stringify(report.summary, null, 2))
    console.log(`HTML report: ${path.join(REPORT_DIR, 'index.html')}`)
    if (report.summary.fail > 0 || report.summary.error > 0) process.exitCode = 2
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error.stack ?? error.message)
  process.exitCode = 1
})
