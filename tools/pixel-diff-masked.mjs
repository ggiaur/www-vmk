#!/usr/bin/env node
// MASZKOLT PIXEL-DIFF — csak strukturális eltérések
// A dinamikus tartalom-területeket (hírek képei, galériák, esemény-képek)
// feketével fedi el mindkét screenshoton, majd összehasonlítja.
// Így a pixel-diff csak a LAYOUTOT méri, nem a tartalmat.
//
// Ipari best practice (BackstopJS, Percy): "mask: [selector]" — 
// a dinamikus elemeket egyforma solid-box-szal fedik be.

import { chromium } from 'playwright'
import { execFileSync } from 'child_process'
import { mkdirSync, existsSync, copyFileSync } from 'fs'
import path from 'path'

const WIDTH = 1440
const LOCAL_URL = 'http://localhost:3001'
const REAL_URL = 'https://www.vmk.hu/'
const OUT_DIR = '/tmp/claude-999/-srv-projects/5bb47936-566c-49a0-962f-2ea7d2865fe8/scratchpad/pixeldiff'
mkdirSync(OUT_DIR, { recursive: true })

// FIGYELEM: ez a NEM mérvadó eszköz (ld. docs/MINOSEGPOLITIKA.md) - a
// MASK_REGIONS gyakorlatilag az egész főtartalom-oszlopot kitakarja.
// Csak strukturális/layout ellenőrzésre használd, SOHA ne idézd ennek a
// számát "a" pixel-diff eredményként. A mérvadó szám a pixel-diff.mjs-é.
const USE_FROZEN = existsSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'reference', 'real-baseline', 'real.png'))
const FROZEN_REAL = path.join(path.dirname(new URL(import.meta.url).pathname), 'reference', 'real-baseline', 'real.png')

// Maszk koordináták (1440px viewport): dinamikus tartalom területei
// Ezeket feketével kell lefedni a diff előtt
// x=420..1290: a főtartalom (főoszlop) teljes szélességén
// y értékek: kiterjedtek az oldal teljes tartalom-magasságára
const MASK_REGIONS = [
  // Teljes főtartalom (jobb oszlop) — hírek, események, galéria, egyéb szekciók
  // x=420..1290 (870px széles), y=580..5200 (teljes tartalom terület)
  { x: 420, y: 580, w: 870, h: 4620 },
]

async function shoot(browser, url, file, { dismissCookies = false } = {}) {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 1000 } })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  if (dismissCookies) {
    try {
      const btn = await page.$('.cc-nb-okagree, button:has-text("Got it")')
      if (btn) { await btn.click(); await page.waitForTimeout(400) }
    } catch { /* nincs */ }
  }
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0; const step = 400
      const timer = setInterval(() => {
        window.scrollTo(0, y); y += step
        if (y >= document.body.scrollHeight) { clearInterval(timer); window.scrollTo(0, 0); setTimeout(resolve, 300) }
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
  console.log('Valós oldal: FAGYASZTOTT ALAP (tools/reference/real-baseline/), nem élő lekérés.')
  const dest = path.join(OUT_DIR, 'real_masked.png')
  copyFileSync(FROZEN_REAL, dest)
  const meta = JSON.parse(execFileSync('cat', [path.join(path.dirname(new URL(import.meta.url).pathname), 'reference', 'real-baseline', 'meta.json')], { encoding: 'utf-8' }))
  real = { path: dest, height: meta.height }
} else {
  console.log('Screenshot: valós oldal (ÉLŐ lekérés)...')
  real = await shoot(browser, REAL_URL, 'real_masked.png', { dismissCookies: true })
}
console.log('Screenshot: helyi klón...')
const local = await shoot(browser, LOCAL_URL, 'local_masked.png')
await browser.close()

// Maszkolás Python-nal
const maskScript = `
from PIL import Image, ImageDraw
import json

regions = ${JSON.stringify(MASK_REGIONS)}

for fname in ['real_masked.png', 'local_masked.png']:
    path = '${OUT_DIR}/' + fname
    img = Image.open(path).convert('RGB')
    draw = ImageDraw.Draw(img)
    for r in regions:
        draw.rectangle([r['x'], r['y'], r['x']+r['w'], min(r['y']+r['h'], img.height)], fill=(0, 0, 0))
    img.save(path)
    print(f'Maszkolva: {fname} ({img.size[0]}x{img.size[1]})')
`
execFileSync('python3', ['-c', maskScript], { encoding: 'utf-8' })

console.log(`\nOldalmagasság: valós=${real.height}px, helyi=${local.height}px`)
const heightDiffPct = Math.abs(real.height - local.height) / real.height
console.log(`Magasság-eltérés: ${(heightDiffPct * 100).toFixed(1)}%`)

console.log('\nMaszkolt összehasonlítás (strukturális eltérések)...')
const py = path.join(path.dirname(new URL(import.meta.url).pathname), 'pixel-diff.py')
const maskedReal = path.join(OUT_DIR, 'real_masked.png')
const maskedLocal = path.join(OUT_DIR, 'local_masked.png')
const out = execFileSync('python3', [py, maskedReal, maskedLocal, OUT_DIR], { encoding: 'utf-8' })
console.log(out)
console.log(`Képek: ${OUT_DIR}`)
