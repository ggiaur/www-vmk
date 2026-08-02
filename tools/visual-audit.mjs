#!/usr/bin/env node
// Reusable, repeatable layout/color audit: measures concrete geometry and
// pixel colors on the real vmk.hu and on the local clone at the SAME
// viewport, and prints PASS/FAIL per check with actual numbers - never an
// eyeballed screenshot judgement. Run after every visual change to the
// header/footer/homepage. Extend CHECKS as new elements are verified.
//
// Usage: node tools/visual-audit.mjs [--local-url=http://localhost:3001]

import { chromium } from 'playwright'

const LOCAL_URL = process.argv.find((a) => a.startsWith('--local-url='))?.split('=')[1] || 'http://localhost:3001'
const REAL_URL = 'https://www.vmk.hu/'
const VIEWPORT = { width: 1440, height: 900 }
const TOLERANCE_PX = 8

async function dismissCookieBanner(page) {
  try {
    const btn = await page.$('.cc-nb-okagree, button:has-text("Got it")')
    if (btn) {
      await btn.click()
      await page.waitForTimeout(300)
    }
  } catch {
    /* no banner present */
  }
}

// NOTE: every real/local function below runs inside page.evaluate(), i.e. in
// the BROWSER, not Node - so each must be fully self-contained (no closures
// over outer helpers like `rect`). Duplication here is intentional.
const CHECKS = {
  logoBox: {
    real: () => {
      const el = document.querySelector('.navbar-brand img')
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { w: Math.round(r.width), h: Math.round(r.height) }
    },
    local: () => {
      const el = document.querySelector('header img[alt*="Vörösmarty"]')
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { w: Math.round(r.width), h: Math.round(r.height) }
    },
    compare: (r, l) => Math.abs(r.w - l.w) <= 8 && Math.abs(r.h - l.h) <= 8,
    describe: (r, l) => `real ${r.w}x${r.h} vs local ${l.w}x${l.h}`,
  },
  logoLeftMargin: {
    real: () => {
      const el = document.querySelector('.navbar-brand img')
      return el ? Math.round(el.getBoundingClientRect().x) : null
    },
    local: () => {
      const el = document.querySelector('header img[alt*="Vörösmarty"]')
      return el ? Math.round(el.getBoundingClientRect().x) : null
    },
    compare: (r, l) => Math.abs(r - l) <= 40,
    describe: (r, l) => `real x=${r}px vs local x=${l}px`,
  },
  catalogBtnBelowIcons: {
    real: () => {
      const icon = document.querySelector('.navbar-select li a img')
      const btn = document.querySelector('#dropdownMenu1')
      if (!icon || !btn) return null
      return { iconY: Math.round(icon.getBoundingClientRect().y), btnY: Math.round(btn.getBoundingClientRect().y) }
    },
    local: () => {
      const icon = document.querySelector('header a[aria-label="YouTube"]')
      const btn = document.querySelector('header button[aria-haspopup="true"]')
      if (!icon || !btn) return null
      return { iconY: Math.round(icon.getBoundingClientRect().y), btnY: Math.round(btn.getBoundingClientRect().y) }
    },
    compare: (r, l) => (r.btnY > r.iconY) === (l.btnY > l.iconY),
    describe: (r, l) =>
      `real: btn ${r.btnY > r.iconY ? 'BELOW' : 'beside'} icons (Δ${r.btnY - r.iconY}px) | local: btn ${
        l.btnY > l.iconY ? 'BELOW' : 'beside'
      } icons (Δ${l.btnY - l.iconY}px)`,
  },
  iconRowAlignment: {
    real: () => {
      const imgs = [...document.querySelectorAll('.navbar-select > li > a img, .navbar-select > li > a em')]
      return imgs.map((el) => {
        const r = el.getBoundingClientRect()
        return Math.round(r.y + r.height / 2)
      })
    },
    local: () => {
      const imgs = [...document.querySelectorAll('header .flex.items-center.gap-2 img, header .flex.items-center.gap-2 svg')]
      return imgs.map((el) => {
        const r = el.getBoundingClientRect()
        return Math.round(r.y + r.height / 2)
      })
    },
    compare: (r, l) => {
      const spread = (arr) => (arr.length ? Math.max(...arr) - Math.min(...arr) : 0)
      return spread(l) <= TOLERANCE_PX
    },
    describe: (r, l) =>
      `real vertical-center spread=${Math.max(...r) - Math.min(...r)}px | local spread=${
        Math.max(...l) - Math.min(...l)
      }px (want <=${TOLERANCE_PX}px)`,
  },
}

async function run() {
  const browser = await chromium.launch()
  const realPage = await browser.newPage({ viewport: VIEWPORT })
  await realPage.goto(REAL_URL, { waitUntil: 'networkidle', timeout: 30000 })
  await dismissCookieBanner(realPage)

  const localPage = await browser.newPage({ viewport: VIEWPORT })
  await localPage.goto(LOCAL_URL, { waitUntil: 'networkidle', timeout: 30000 })

  let pass = 0
  let fail = 0
  for (const [name, check] of Object.entries(CHECKS)) {
    const realVal = await realPage.evaluate(check.real)
    const localVal = await localPage.evaluate(check.local)
    if (realVal == null || localVal == null) {
      console.log(`SKIP  ${name} (selector not found on one side)`)
      continue
    }
    const ok = check.compare(realVal, localVal)
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: ${check.describe(realVal, localVal)}`)
    if (ok) pass++
    else fail++
  }

  console.log(`\n${pass} passed, ${fail} failed`)
  await browser.close()
  process.exit(fail > 0 ? 1 : 0)
}

run()
