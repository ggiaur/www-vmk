import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('https://www.vmk.hu/', { waitUntil: 'networkidle', timeout: 60000 })
try {
  const btn = await page.$('.cc-nb-okagree, button:has-text("Got it")')
  if (btn) { await btn.click(); await page.waitForTimeout(300) }
} catch {}

const data = await page.evaluate(() => {
  const boxes = document.querySelectorAll('.box')
  const out = []
  boxes.forEach((box) => {
    const h1 = box.querySelector('h1')
    const label = h1 ? h1.textContent.trim() : '(no h1)'
    const imgs = box.querySelectorAll('img')
    const imgData = Array.from(imgs).map((img) => {
      const r = img.getBoundingClientRect()
      const cs = getComputedStyle(img)
      return {
        src: img.currentSrc || img.src,
        natural: { w: img.naturalWidth, h: img.naturalHeight },
        display: { w: Math.round(r.width), h: Math.round(r.height) },
        objectFit: cs.objectFit,
        maxHeight: cs.maxHeight,
        maxWidth: cs.maxWidth,
      }
    })
    const contentDiv = box.querySelector('.content')
    const contentRect = contentDiv ? contentDiv.getBoundingClientRect() : null
    out.push({
      label,
      contentWidth: contentRect ? Math.round(contentRect.width) : null,
      imgs: imgData,
    })
  })
  return out
})

console.log(JSON.stringify(data, null, 2))
await browser.close()
