import { chromium } from 'playwright'

async function deepAudit() {
  const browser = await chromium.launch()
  const pReal = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const pLocal = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  await pReal.goto('https://www.vmk.hu/', { waitUntil: 'networkidle' })
  await pLocal.goto('http://localhost:3001/', { waitUntil: 'networkidle' })

  const getStyleMap = (page) =>
    page.evaluate(() => {
      const map = {}
      const query = (name, sel) => {
        const el = document.querySelector(sel)
        if (el) {
          const r = el.getBoundingClientRect()
          const cs = getComputedStyle(el)
          map[name] = {
            rect: `${Math.round(r.x)},${Math.round(r.y)} (${Math.round(r.width)}x${Math.round(r.height)})`,
            font: cs.fontFamily.split(',')[0].replace(/"/g, ''),
            size: cs.fontSize,
            weight: cs.fontWeight,
            lineHeight: cs.lineHeight,
            transform: cs.textTransform,
            color: cs.color,
            bg: cs.backgroundColor,
            padding: cs.padding,
            margin: cs.margin,
          }
        } else {
          map[name] = null
        }
      }

      query('Header Logo', 'header img, .logo img')
      query('Nav Link', 'nav a, header nav a')
      query('Catalog Button', '.btn-catalog, header button, header a[href*="tlwww"]')
      query('Section Title HÍREK', 'h1, h2, .section-title')
      query(
        'News Tile Title',
        '.elements a.box.type1 h2, main a[href*="hirek"] h3, main a[href*="hirek"] div:nth-child(2)',
      )
      query('News Tile Body', '.elements a.box.type1 p, main a[href*="hirek"] p')
      query('Sidebar Menu Header', '.box.menu h1, aside div:first-child')
      query('Sidebar Menu Link', '.box.menu a, aside nav a')
      query('Sidebar Widget Header', '.box:not(.menu) h1, aside > div div:first-child')
      query('Footer Header', 'footer h2, footer h3, footer h4')
      query('Footer Link/Text', 'footer a, footer p')
      query('Footer Bottom Bar', 'footer .copy, footer > div:last-child')

      return map
    })

  const realM = await getStyleMap(pReal)
  const localM = await getStyleMap(pLocal)

  console.log('=== DEEP COMPUTED STYLE AUDIT ===')
  Object.keys(realM).forEach((k) => {
    console.log(`\n--- ${k} ---`)
    console.log('REAL: ', JSON.stringify(realM[k], null, 2))
    console.log('LOCAL:', JSON.stringify(localM[k], null, 2))
  })

  await browser.close()
}

deepAudit().catch(console.error)
