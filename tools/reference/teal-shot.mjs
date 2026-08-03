import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(500)
await page.screenshot({ path: '/tmp/claude-999/-srv-projects/5bb47936-566c-49a0-962f-2ea7d2865fe8/scratchpad/local_full.png', fullPage: false })
await browser.close()
