import { chromium } from 'playwright'
const OUT = '/tmp/claude-999/-srv-projects/5bb47936-566c-49a0-962f-2ea7d2865fe8/scratchpad'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/local_full_top.png`, clip: { x: 0, y: 130, width: 1440, height: 350 } })
await browser.close()
