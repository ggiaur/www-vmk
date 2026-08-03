import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(500)
const info = await page.evaluate(() => {
  const img = document.querySelector('img[alt^="A városban"]')
  if (!img) return null
  const r = img.getBoundingClientRect()
  const cs = getComputedStyle(img)
  let parent = img.parentElement
  const chain = []
  for (let i = 0; i < 4 && parent; i++) {
    const pr = parent.getBoundingClientRect()
    chain.push({ tag: parent.tagName, cls: parent.className, x: Math.round(pr.x), w: Math.round(pr.width) })
    parent = parent.parentElement
  }
  return { img: { x: Math.round(r.x), w: Math.round(r.width) }, objectFit: cs.objectFit, chain }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
