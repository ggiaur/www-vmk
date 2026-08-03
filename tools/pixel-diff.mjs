#!/usr/bin/env node
// TELJES OLDALAS KÉPPONT-ÖSSZEHASONLÍTÁS
//
// Ez NEM kézzel kiválasztott tulajdonságokat ellenőriz (mint a
// visual-audit.mjs), hanem a teljes renderelt oldalt hasonlítja össze
// képpontonként a valós vmk.hu-val. Megtalálja azokat az eltéréseket is,
// amikre senki nem gondolt előre - ez a lényege.
//
// Kimenet:
//   - real.png / local.png            (nyers screenshotok)
//   - diff-heatmap.png                (piros = eltérés, sötét = egyezés)
//   - side-by-side.png                (egymás mellett + diff)
//   - konzol: teljes eltérés %, és 100px-es vízszintes sávonkénti bontás,
//     hogy lásd, MELYIK részen van a legtöbb eltérés
//
// Usage: node tools/pixel-diff.mjs [--width=1440] [--local-url=...]

import { chromium } from 'playwright'
import { execFileSync } from 'child_process'
import { mkdirSync, existsSync, copyFileSync, readFileSync } from 'fs'
import path from 'path'

const args = process.argv.slice(2)
const getArg = (name, dflt) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=')[1] : dflt
}
const hasFlag = (name) => args.includes(`--${name}`)

const WIDTH = parseInt(getArg('width', '1440'), 10)
const LOCAL_URL = getArg('local-url', 'http://localhost:3001')
const REAL_URL = 'https://www.vmk.hu/'
const OUT_DIR = getArg('out', '/tmp/claude-999/-srv-projects/5bb47936-566c-49a0-962f-2ea7d2865fe8/scratchpad/pixeldiff')

// FAGYASZTOTT VISZONYÍTÁSI ALAP: 2026-08-03-án a felhasználó kifejezetten
// előírta, hogy a valós vmk.hu főoldal EGYSZER legyen befagyasztva, és
// attól kezdve EZ legyen a folyamatos összehasonlítási alap - nem a mindig
// újra lekért élő oldal ("ezt nem használhatod kifogásnak"). A fagyasztott
// képet a tools/reference/real-baseline/ tartalmazza (real.png + meta.json).
// Csak --live kapcsolóval kérhető újra élő lekérés (pl. ha a felhasználó
// tudatosan frissíteni akarja a fagyasztott alapot).
const FROZEN_DIR = path.join(path.dirname(new URL(import.meta.url).pathname), 'reference', 'real-baseline')
const FROZEN_REAL = path.join(FROZEN_DIR, 'real.png')
const USE_FROZEN = !hasFlag('live') && WIDTH === 1440 && existsSync(FROZEN_REAL)

mkdirSync(OUT_DIR, { recursive: true })

async function shoot(browser, url, file, { dismissCookies = false } = {}) {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 1000 } })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  if (dismissCookies) {
    try {
      const btn = await page.$('.cc-nb-okagree, button:has-text("Got it")')
      if (btn) {
        await btn.click()
        await page.waitForTimeout(400)
      }
    } catch {
      /* nincs banner */
    }
  }
  // lazy-load képek betöltése: végiggörgetjük az oldalt
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0
      const step = 400
      const timer = setInterval(() => {
        window.scrollTo(0, y)
        y += step
        if (y >= document.body.scrollHeight) {
          clearInterval(timer)
          window.scrollTo(0, 0)
          setTimeout(resolve, 300)
        }
      }, 60)
    })
  })
  await page.waitForTimeout(500)
  const full = path.join(OUT_DIR, file)
  await page.screenshot({ path: full, fullPage: true })
  const height = await page.evaluate(() => document.body.scrollHeight)
  await page.close()
  return { path: full, height }
}

const browser = await chromium.launch()
let real
if (USE_FROZEN) {
  const meta = JSON.parse(readFileSync(path.join(FROZEN_DIR, 'meta.json'), 'utf-8'))
  console.log(`Valós oldal: FAGYASZTOTT ALAP (rögzítve: ${meta.capturedAt}), nem élő lekérés.`)
  const dest = path.join(OUT_DIR, 'real.png')
  copyFileSync(FROZEN_REAL, dest)
  real = { path: dest, height: meta.height }
} else {
  console.log(`Screenshot: valós oldal (${WIDTH}px, ÉLŐ lekérés)...`)
  real = await shoot(browser, REAL_URL, 'real.png', { dismissCookies: true })
}
console.log(`Screenshot: helyi klón (${WIDTH}px)...`)
const local = await shoot(browser, LOCAL_URL, 'local.png')
await browser.close()

console.log(`\nOldalmagasság: valós=${real.height}px, helyi=${local.height}px`)
const heightDiffPct = Math.abs(real.height - local.height) / real.height
console.log(
  `Magasság-eltérés: ${(heightDiffPct * 100).toFixed(1)}% ${
    heightDiffPct > 0.15 ? '<-- JELENTŐS: a klón lényegesen kevesebb/több tartalmat mutat' : ''
  }`,
)

console.log('\nKéppontonkénti összehasonlítás...')
const py = path.join(path.dirname(new URL(import.meta.url).pathname), 'pixel-diff.py')
const out = execFileSync('python3', [py, real.path, local.path, OUT_DIR], { encoding: 'utf-8' })
console.log(out)
console.log(`Képek: ${OUT_DIR}`)
