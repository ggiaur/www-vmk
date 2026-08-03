import { chromium } from 'playwright'
import { writeFileSync } from 'fs'

const WIDTH = 1440
const OUT = '/srv/projects/www-vmk/tools/reference/real-baseline'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: WIDTH, height: 1000 } })
await page.goto('https://www.vmk.hu/', { waitUntil: 'networkidle', timeout: 60000 })
try {
  const btn = await page.$('.cc-nb-okagree, button:has-text("Got it")')
  if (btn) { await btn.click(); await page.waitForTimeout(400) }
} catch {}
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
await page.screenshot({ path: `${OUT}/real.png`, fullPage: true })
const height = await page.evaluate(() => document.body.scrollHeight)
const html = await page.content()
writeFileSync(`${OUT}/real.html`, html)
writeFileSync(`${OUT}/meta.json`, JSON.stringify({
  capturedAt: new Date().toISOString(),
  url: 'https://www.vmk.hu/',
  width: WIDTH,
  height,
  note: 'Fagyasztott állapot - ez a fejlesztés végéig változatlan viszonyítási alap. Nem frissítendő automatikusan.'
}, null, 2))
await browser.close()
console.log('Kész. Magasság:', height)
