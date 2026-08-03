import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('https://www.vmk.hu/', { waitUntil: 'networkidle', timeout: 60000 })
try {
  const btn = await page.$('.cc-nb-okagree, button:has-text("Got it")')
  if (btn) { await btn.click(); await page.waitForTimeout(300) }
} catch {}

const data = await page.evaluate(() => {
  const boxes = Array.from(document.querySelectorAll('.box')).filter((b) => b.querySelector('h1'))
  return boxes.map((box) => {
    const h1 = box.querySelector('h1')
    const content = box.querySelector('.content')
    const img = box.querySelector('img')
    const boxR = box.getBoundingClientRect()
    const contentR = content ? content.getBoundingClientRect() : null
    const imgR = img ? img.getBoundingClientRect() : null
    const cs = img ? getComputedStyle(img) : null
    return {
      label: h1.textContent.trim(),
      box: { x: Math.round(boxR.x), w: Math.round(boxR.width) },
      content: contentR ? { x: Math.round(contentR.x), w: Math.round(contentR.width), padLeft: getComputedStyle(content).paddingLeft, padRight: getComputedStyle(content).paddingRight } : null,
      img: imgR ? { x: Math.round(imgR.x), w: Math.round(imgR.width), inlineWidth: img.getAttribute('width'), inlineStyle: img.getAttribute('style'), cssWidth: cs.width, className: img.className } : null,
    }
  })
})
console.log(JSON.stringify(data, null, 2))
await browser.close()
