import { chromium } from 'playwright'
const OUT = '/tmp/claude-999/-srv-projects/5bb47936-566c-49a0-962f-2ea7d2865fe8/scratchpad'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 400 } })
await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/local_header.png` })

// measure icon geometry
const icons = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('header a[aria-label]'))
  return els.map(el => {
    const r = el.getBoundingClientRect()
    const img = el.querySelector('img, svg')
    const ir = img ? img.getBoundingClientRect() : null
    return {
      label: el.getAttribute('aria-label'),
      box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      inner: ir ? { w: Math.round(ir.width), h: Math.round(ir.height) } : null,
    }
  })
})
console.log(JSON.stringify(icons, null, 2))

// measure the teal strip below the nav bar and above banner
const stripInfo = await page.evaluate(() => {
  const header = document.querySelector('header')
  const hr = header.getBoundingClientRect()
  return { headerBottom: Math.round(hr.bottom), headerWidth: Math.round(hr.width), viewportWidth: window.innerWidth }
})
console.log('STRIP', JSON.stringify(stripInfo))

await browser.close()
