#!/usr/bin/env node
// Clone Parity Oracle v2 -- FUNCTION dimension (K1, COLLAB.md section 4.6 / 6).
//
// Real E2E workflow checks against the running clone. Unlike TEXT/MEDIA/
// LINKS/VISUAL, FUNCTION isn't a reference-vs-clone diff (the reference is a
// legacy CMS with a fundamentally different form/auth implementation, not
// something the same automated workflow can run against) -- it answers
// "does this real user/admin workflow actually work end to end," per
// COLLAB.md's explicit rule that a functional route can't get PASS from a
// static 200/H1 smoke check alone. Merges into the same results.json the
// other two dimension scripts write to.
//
// Usage: node tools/clone-parity-function.mjs --clone-base=http://localhost:3011 --out=docs/parity-oracle-v2

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
const CLONE_BASE = args['clone-base'] || 'http://localhost:3011'
const OUT_DIR = args['out'] || 'docs/parity-oracle-v2'

async function checkSearch(browser) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  try {
    await page.goto(`${CLONE_BASE}/kereses`, { waitUntil: 'networkidle' })
    await page.fill('input[type="search"]', 'könyvtár')
    await page.waitForTimeout(800)
    const count = await page.locator('main a[href^="/hirek/"], main a[href^="/esemenyek/"]').count()
    if (count === 0) return { status: 'FAIL', reason: 'no results rendered for a known-good query' }
    const link = page.locator('main a[href^="/hirek/"], main a[href^="/esemenyek/"]').first()
    const href = await link.getAttribute('href')
    await Promise.all([page.waitForURL(`**${href}`, { timeout: 5000 }), link.click()])
    const h1 = await page.locator('h1').first().textContent().catch(() => null)
    return { status: 'PASS', evidence: { resultCount: count, navigatedTo: page.url(), destinationH1: h1 } }
  } catch (e) {
    return { status: 'FAIL', reason: String(e.message || e) }
  } finally {
    await ctx.close()
  }
}

async function checkContactForm(browser) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const marker = `K1-FUNC-TEST-${Date.now()}`
  try {
    await page.goto(`${CLONE_BASE}/kapcsolat`, { waitUntil: 'networkidle' })
    const nameInput = page.locator('form input[name="name"]').first()
    if ((await nameInput.count()) === 0) return { status: 'FAIL', reason: 'no contact form found on /kapcsolat' }
    await nameInput.fill(marker)
    await page.locator('form input[name="email"]').first().fill('k1-func-test@example.invalid')
    const messageField = page.locator('form textarea[name="message"], form input[name="message"]').first()
    if ((await messageField.count()) > 0) await messageField.fill('K1 function-dimension automated check')
    await page.locator('form button[type="submit"]').first().click()
    await page.waitForTimeout(1500)
    const bodyText = await page.locator('body').textContent()
    const looksSuccessful = /köszönjük|sikeres/i.test(bodyText)
    return {
      status: looksSuccessful ? 'PASS' : 'FAIL',
      reason: looksSuccessful ? undefined : 'no success confirmation text after submit',
      evidence: { marker },
    }
  } catch (e) {
    return { status: 'FAIL', reason: String(e.message || e) }
  } finally {
    await ctx.close()
  }
}

async function checkWishbasket(browser) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const marker = `K1-FUNC-TEST-${Date.now()}`
  try {
    await page.goto(`${CLONE_BASE}/wishbasket`, { waitUntil: 'networkidle' })
    const nameInput = page.locator('input[name="name"]').first()
    if ((await nameInput.count()) === 0) return { status: 'FAIL', reason: 'no wish request form found on /wishbasket' }
    await nameInput.fill('K1 Function Test')
    await page.locator('input[name="email"]').first().fill('k1-func-test@example.invalid')
    await page.locator('input[name="libraryCard"]').first().fill('K1-0000')
    await page.locator('input[name="writer"]').first().fill('K1 Test Writer')
    await page.locator('input[name="title"]').first().fill(marker)
    await page.locator('button[type="submit"]').first().click()
    await page.waitForSelector('text=Köszönjük', { timeout: 5000 })
    return { status: 'PASS', evidence: { marker, note: 'submitted successfully; DB row left for manual cleanup verification, see gap report' } }
  } catch (e) {
    return { status: 'FAIL', reason: String(e.message || e) }
  } finally {
    await ctx.close()
  }
}

async function main() {
  const browser = await chromium.launch()
  const checks = {
    search: await checkSearch(browser),
    contactForm: await checkContactForm(browser),
    wishbasket: await checkWishbasket(browser),
  }
  await browser.close()

  for (const [k, v] of Object.entries(checks)) {
    console.log(k, '->', v.status, v.reason || '')
  }

  const resultsPath = path.join(OUT_DIR, 'results.json')
  const existing = fs.existsSync(resultsPath) ? JSON.parse(fs.readFileSync(resultsPath, 'utf8')) : { results: [] }
  existing.functionChecks = { generatedAt: new Date().toISOString(), checks }

  // Also attach to the specific routes these checks correspond to, so the
  // per-route HTML report shows FUNCTION status instead of NOT_EVALUATED
  // for /kereses, /kapcsolat, /wishbasket specifically.
  const routeMap = { '/kapcsolat': checks.contactForm, '/wishbasket': checks.wishbasket }
  for (const r of existing.results) {
    if (routeMap[r.path]) r.function = routeMap[r.path]
  }

  fs.writeFileSync(resultsPath, JSON.stringify(existing, null, 2))
  console.log('Updated', resultsPath, 'with FUNCTION checks')
}

main()
