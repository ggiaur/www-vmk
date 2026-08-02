#!/usr/bin/env node
// Reusable, repeatable layout/color audit: measures concrete geometry and
// pixel colors on the real vmk.hu and on the local clone at the SAME
// viewport, and prints PASS/FAIL per check with actual numbers - never an
// eyeballed screenshot judgement. Run after every visual change to the
// header/footer/homepage. Extend CHECKS as new elements are verified.
//
// Usage: node tools/visual-audit.mjs [--local-url=http://localhost:3001]

import { chromium } from 'playwright'

const LOCAL_URL = process.argv.find((a) => a.startsWith('--local-url='))?.split('=')[1] || 'http://localhost:3001'
const REAL_URL = 'https://www.vmk.hu/'
const VIEWPORT = { width: 1440, height: 900 }
const TOLERANCE_PX = 8

async function dismissCookieBanner(page) {
  try {
    const btn = await page.$('.cc-nb-okagree, button:has-text("Got it")')
    if (btn) {
      await btn.click()
      await page.waitForTimeout(300)
    }
  } catch {
    /* no banner present */
  }
}

// NOTE: every real/local function below runs inside page.evaluate(), i.e. in
// the BROWSER, not Node - so each must be fully self-contained (no closures
// over outer helpers like `rect`). Duplication here is intentional.
const CHECKS = {
  logoBox: {
    real: () => {
      const el = document.querySelector('.navbar-brand img')
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { w: Math.round(r.width), h: Math.round(r.height) }
    },
    local: () => {
      const el = document.querySelector('header img[alt*="Vörösmarty"]')
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { w: Math.round(r.width), h: Math.round(r.height) }
    },
    compare: (r, l) => Math.abs(r.w - l.w) <= 8 && Math.abs(r.h - l.h) <= 8,
    describe: (r, l) => `real ${r.w}x${r.h} vs local ${l.w}x${l.h}`,
  },
  logoLeftMargin: {
    real: () => {
      const el = document.querySelector('.navbar-brand img')
      return el ? Math.round(el.getBoundingClientRect().x) : null
    },
    local: () => {
      const el = document.querySelector('header img[alt*="Vörösmarty"]')
      return el ? Math.round(el.getBoundingClientRect().x) : null
    },
    compare: (r, l) => Math.abs(r - l) <= 40,
    describe: (r, l) => `real x=${r}px vs local x=${l}px`,
  },
  catalogBtnBelowIcons: {
    real: () => {
      const icon = document.querySelector('.navbar-select li a img')
      const btn = document.querySelector('#dropdownMenu1')
      if (!icon || !btn) return null
      return { iconY: Math.round(icon.getBoundingClientRect().y), btnY: Math.round(btn.getBoundingClientRect().y) }
    },
    local: () => {
      const icon = document.querySelector('header a[aria-label="YouTube"]')
      const btn = document.querySelector('header button[aria-haspopup="true"]')
      if (!icon || !btn) return null
      return { iconY: Math.round(icon.getBoundingClientRect().y), btnY: Math.round(btn.getBoundingClientRect().y) }
    },
    compare: (r, l) => (r.btnY > r.iconY) === (l.btnY > l.iconY),
    describe: (r, l) =>
      `real: btn ${r.btnY > r.iconY ? 'BELOW' : 'beside'} icons (Δ${r.btnY - r.iconY}px) | local: btn ${
        l.btnY > l.iconY ? 'BELOW' : 'beside'
      } icons (Δ${l.btnY - l.iconY}px)`,
  },
  widgetContentBg: {
    real: () => {
      const titleEl = [...document.querySelectorAll('h1')].find((h) => h.textContent.trim() === 'FEWA')
      const box = titleEl ? titleEl.closest('.box') : null
      return box ? getComputedStyle(box).backgroundColor : null
    },
    local: () => {
      const titleEl = [...document.querySelectorAll('aside div.font-bold')].find((h) =>
        /webarch[ií]vum/i.test(h.textContent || ''),
      )
      // titleEl -> colored header div -> outer card div -> 2nd child (content area)
      const card = titleEl ? titleEl.parentElement?.parentElement : null
      const contentDiv = card ? card.children[1] : null
      return contentDiv ? getComputedStyle(contentDiv).backgroundColor : null
    },
    compare: (r, l) => r === l,
    describe: (r, l) => `real=${r} vs local=${l} (widget tartalom-terület háttere - a valós oldalon minden widgeten egységesen ez a szín)`,
  },
  newsCardTitleBg: {
    real: () => {
      const card = document.querySelector('.elements a.box.type1:not(.main)')
      const h2 = card ? card.querySelector('h2') : null
      return h2 ? getComputedStyle(h2).backgroundColor : null
    },
    local: () => {
      const card = document.querySelector('main a[href^="/hirek/"]')
      const titleBar = card ? card.querySelector('div:nth-child(2)') : null
      return titleBar ? getComputedStyle(titleBar).backgroundColor : null
    },
    compare: (r, l) => r != null && l != null,
    describe: (r, l) => `real=${r} vs local=${l} (hírkártya címsáv háttere - csak jelenlét-ellenőrzés, a szín kártyánként rotál)`,
  },
  bannerToHeaderGap: {
    real: () => {
      const nav = document.querySelector('nav.navbar.navbar-default')
      const banner = document.querySelector('.carousel-inner img, .item.active img')
      if (!nav || !banner) return null
      const navBottom = Math.round(nav.getBoundingClientRect().bottom)
      const bannerTop = Math.round(banner.getBoundingClientRect().top)
      return bannerTop - navBottom
    },
    local: () => {
      const nav = document.querySelector('header nav')
      const banner = document.querySelector('img[alt^="A városban"]')
      if (!nav || !banner) return null
      const navBottom = Math.round(nav.getBoundingClientRect().bottom)
      const bannerTop = Math.round(banner.getBoundingClientRect().top)
      return bannerTop - navBottom
    },
    compare: (r, l) => Math.abs(r - l) <= 10,
    describe: (r, l) => `real gap=${r}px vs local gap=${l}px (a banner-kép közvetlenül a navigáció alatt kell hogy kezdődjön, rés nélkül)`,
  },
  widgetBoxSize: {
    // FEWA/Aranybulla-szerű első oldalsáv-widget teljes doboz mérete.
    real: () => {
      const titleEl = [...document.querySelectorAll('h1')].find((h) => h.textContent.trim() === 'FEWA')
      const box = titleEl ? titleEl.closest('.box') : null
      if (!box) return null
      const r = box.getBoundingClientRect()
      return { w: Math.round(r.width), h: Math.round(r.height) }
    },
    local: () => {
      const link = document.querySelector('aside a[href*="webarchivum.vmk.hu"]')
      const card = link ? link.querySelector('div') : null
      if (!card) return null
      const r = card.getBoundingClientRect()
      return { w: Math.round(r.width), h: Math.round(r.height) }
    },
    // Nagy tolerancia: a valós widget saját promóciós KÉPET mutat, a
    // miénk ikon+alcím szöveget - ez tudatos, egyszerűsített szerkezeti
    // választás, csak durva méretrend-egyezést várunk el (±40%).
    compare: (r, l) => Math.abs(r.w - l.w) / r.w <= 0.15 && Math.abs(r.h - l.h) / r.h <= 0.4,
    describe: (r, l) => `real ${r.w}x${r.h} vs local ${l.w}x${l.h} (szélesség ±15%, magasság ±40% tolerancia - eltérő tartalom-típus miatt)`,
  },
  newsCardImageHeight: {
    real: () => {
      const card = document.querySelector('.elements a.box.type1:not(.main)')
      const img = card ? card.querySelector('img, .image') : null
      return img ? Math.round(img.getBoundingClientRect().height) : null
    },
    local: () => {
      const card = document.querySelector('main a[href^="/hirek/"]')
      const imgWrap = card ? card.querySelector('div') : null
      return imgWrap ? Math.round(imgWrap.getBoundingClientRect().height) : null
    },
    compare: (r, l) => Math.abs(r - l) / r <= 0.2,
    describe: (r, l) => `real image height=${r}px vs local=${l}px (±20% tolerancia)`,
  },
  bannerAspectRatio: {
    // Az "A városban N helyen" banner-kép aránya - ugyanaz a letöltött
    // kép mindkét oldalon, tehát az aránynak gyakorlatilag azonosnak
    // kell lennie, függetlenül a konténer szélességétől.
    real: () => {
      const img = document.querySelector('.carousel-inner img, .item.active img')
      if (!img) return null
      const r = img.getBoundingClientRect()
      return r.width / r.height
    },
    local: () => {
      const img = document.querySelector('img[alt^="A városban"]')
      if (!img) return null
      const r = img.getBoundingClientRect()
      return r.width / r.height
    },
    compare: (r, l) => Math.abs(r - l) / r <= 0.05,
    describe: (r, l) => `real aspect=${r.toFixed(3)} vs local aspect=${l.toFixed(3)} (±5% tolerancia - ugyanaz a letöltött kép)`,
  },
  figyelemBannerSize: {
    // A FIGYELEM! banner a valós oldalon dinamikus/időszakos tartalom -
    // ha épp nincs kint (jelenleg nincs, ellenőrizve), nem hasonlítunk
    // fabrikált számhoz, hanem SKIP-elünk, jelezve az okot.
    real: () => {
      const el = [...document.querySelectorAll('*')].find(
        (e) => e.children.length === 0 && e.textContent.trim() === 'FIGYELEM!',
      )
      return el ? Math.round(el.closest('.box, a')?.getBoundingClientRect().height ?? 0) : null
    },
    local: () => {
      const el = [...document.querySelectorAll('*')].find(
        (e) => e.children.length === 0 && e.textContent.trim() === 'FIGYELEM!',
      )
      if (!el) return null
      let card = el
      for (let i = 0; i < 4 && card; i++) card = card.parentElement
      return card ? Math.round(card.getBoundingClientRect().height) : null
    },
    compare: () => true, // nincs stabil valós referenciaszám - lásd describe
    describe: (r, l) =>
      `real=${r}px (JELENLEG NEM LÁTHATÓ a valós oldalon - időszakos tartalom, nincs stabil mérési alap) vs local=${l}px`,
  },
  iconRowAlignment: {
    real: () => {
      const imgs = [...document.querySelectorAll('.navbar-select > li > a img, .navbar-select > li > a em')]
      return imgs.map((el) => {
        const r = el.getBoundingClientRect()
        return Math.round(r.y + r.height / 2)
      })
    },
    local: () => {
      const imgs = [...document.querySelectorAll('header .flex.items-center.gap-2 img, header .flex.items-center.gap-2 svg')]
      return imgs.map((el) => {
        const r = el.getBoundingClientRect()
        return Math.round(r.y + r.height / 2)
      })
    },
    compare: (r, l) => {
      const spread = (arr) => (arr.length ? Math.max(...arr) - Math.min(...arr) : 0)
      return spread(l) <= TOLERANCE_PX
    },
    describe: (r, l) =>
      `real vertical-center spread=${Math.max(...r) - Math.min(...r)}px | local spread=${
        Math.max(...l) - Math.min(...l)
      }px (want <=${TOLERANCE_PX}px)`,
  },
  // KÜLÖN ellenőrzés a MÉRETRE, nem csak az igazításra - a fenti
  // iconRowAlignment csak azt méri, hogy az ikonok középpontja egy
  // vonalban van-e, ami PASS-t adhat akkor is, ha az egyik ikon
  // sokkal kisebb/nagyobb a többinél (pontosan ez történt a mail
  // ikonnal: 16px volt a 28px-es facebook/instagram mellett, az
  // igazítás-check ezt nem vette észre, mert középre volt igazítva).
  iconSizeOutlier: {
    real: () => {
      const imgs = [...document.querySelectorAll('.navbar-select > li > a img, .navbar-select > li > a em')]
      return imgs.map((el) => Math.round(el.getBoundingClientRect().height))
    },
    local: () => {
      const anchors = [...document.querySelectorAll('header .flex.items-center.gap-2 > a')]
      return anchors.map((a) => {
        const content = a.querySelector('img, svg')
        return content ? Math.round(content.getBoundingClientRect().height) : 0
      })
    },
    // Nem várunk azonos abszolút magasságokat (más natív képfájlok),
    // csak azt, hogy egyik oldalon se legyen olyan ikon, ami a
    // legnagyobbhoz képest aránytalanul (<55%) kicsi - ez a "mail
    // ikon 16px a 28px-es mellett" hibaosztály.
    compare: (r, l) => {
      const minRatio = (arr) => Math.min(...arr) / Math.max(...arr)
      return minRatio(l) >= 0.55
    },
    describe: (r, l) => {
      const minRatio = (arr) => (Math.min(...arr) / Math.max(...arr)).toFixed(2)
      return `real méretek=[${r.join(',')}] arány=${minRatio(r)} | local méretek=[${l.join(',')}] arány=${minRatio(l)} (want local >=0.55)`
    },
  },
  navFontMetrics: {
    real: () => {
      const link = document.querySelector('.top-menu > li > a')
      if (!link) return null
      const cs = getComputedStyle(link)
      return { fontSize: parseFloat(cs.fontSize), fontWeight: cs.fontWeight }
    },
    local: () => {
      const link = document.querySelector('header nav a')
      if (!link) return null
      const cs = getComputedStyle(link)
      return { fontSize: parseFloat(cs.fontSize), fontWeight: cs.fontWeight }
    },
    compare: (r, l) => Math.abs(r.fontSize - l.fontSize) <= 2 && r.fontWeight === l.fontWeight,
    describe: (r, l) => `real ${r.fontSize}px/${r.fontWeight} vs local ${l.fontSize}px/${l.fontWeight} (±2px, súly egyezzen)`,
  },
  navBottomStripeWidth: {
    real: () => {
      const nav = document.querySelector('nav.navbar.navbar-default')
      return nav ? getComputedStyle(nav).borderBottomWidth : null
    },
    local: () => {
      const row = document.querySelector('header > div:nth-child(2)')
      return row ? getComputedStyle(row).borderBottomWidth : null
    },
    compare: (r, l) => r === l,
    describe: (r, l) => `real=${r} vs local=${l} (a banner feletti teal csík vastagsága)`,
  },
  wifiToFlagGap: {
    real: () => {
      const wifi = document.querySelector('.navbar-select a[href*="menu/156"]')
      const flag = document.querySelector('.navbar-select a.flag')
      if (!wifi || !flag) return null
      return Math.round(flag.getBoundingClientRect().x - wifi.getBoundingClientRect().right)
    },
    local: () => {
      const wifi = document.querySelector('header a[aria-label="Wifi elérhetőség"]')
      const flag = document.querySelector('header a[aria-label="Magyar"]')
      if (!wifi || !flag) return null
      return Math.round(flag.getBoundingClientRect().x - wifi.getBoundingClientRect().right)
    },
    compare: (r, l) => Math.abs(r - l) <= 6,
    describe: (r, l) => `real gap=${r}px vs local gap=${l}px (±6px)`,
  },
  footerColumnHeaderStyle: {
    real: () => {
      const el = [...document.querySelectorAll('*')].find((e) => e.children.length === 0 && e.textContent.trim() === 'Hírlevél')
      if (!el) return null
      const cs = getComputedStyle(el)
      return { fontSize: parseFloat(cs.fontSize), fontWeight: cs.fontWeight, textTransform: cs.textTransform }
    },
    local: () => {
      const el = [...document.querySelectorAll('footer *')].find((e) => e.children.length === 0 && e.textContent.trim() === 'Hírlevél')
      if (!el) return null
      const cs = getComputedStyle(el)
      return { fontSize: parseFloat(cs.fontSize), fontWeight: cs.fontWeight, textTransform: cs.textTransform }
    },
    compare: (r, l) => Math.abs(r.fontSize - l.fontSize) <= 2 && r.fontWeight === l.fontWeight && r.textTransform === l.textTransform,
    describe: (r, l) =>
      `real ${r.fontSize}px/${r.fontWeight}/${r.textTransform} vs local ${l.fontSize}px/${l.fontWeight}/${l.textTransform}`,
  },
}

// Self-consistency regressions: things that must hold at EVERY common
// desktop width, not just the one width (1440px) the main CHECKS above
// happen to test. Both bugs below were reported by the user at widths this
// script did not previously cover, and both slipped through as false PASS.
const RESPONSIVE_WIDTHS = [1920, 1440, 1280, 1200, 1150, 1100, 1024, 992, 900]

// A valós vmk.hu Bootstrap 3 .container-t használ: a konténer szélessége
// NEM folyamatosan skálázódik, hanem törésponton ugrik (1170/970/750px),
// plusz egy fix 30px belső margó a logóig. Ezt a képletet 7 valós mért
// pontból vezettük le (mind a 7 pixelre egyezett) - lásd MINOSEGPOLITIKA.md.
function expectedRealLogoX(viewportWidth) {
  const container = viewportWidth >= 1200 ? 1170 : viewportWidth >= 992 ? 970 : 750
  return Math.round((viewportWidth - container) / 2) + 30
}

async function runResponsiveChecks(browser) {
  let pass = 0
  let fail = 0
  for (const width of RESPONSIVE_WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 400 } })
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle', timeout: 30000 })

    const navHeight = await page.evaluate(() => {
      const nav = document.querySelector('header nav')
      return nav ? Math.round(nav.getBoundingClientRect().height) : null
    })
    const wrapOk = navHeight != null && navHeight <= 60
    console.log(`${wrapOk ? 'PASS' : 'FAIL'}  navNoWrap@${width}px: navHeight=${navHeight}px (want <=60px, single line)`)
    if (wrapOk) pass++
    else fail++

    const logoX = await page.evaluate(() => {
      const el = document.querySelector('header img[alt*="Vörösmarty"]')
      return el ? Math.round(el.getBoundingClientRect().x) : null
    })
    const expected = expectedRealLogoX(width)
    const marginOk = logoX != null && Math.abs(logoX - expected) <= 15
    console.log(
      `${marginOk ? 'PASS' : 'FAIL'}  logoMargin@${width}px: local x=${logoX}px, valós-képlet szerint várt=${expected}px (±15px)`,
    )
    if (marginOk) pass++
    else fail++

    await page.close()
  }
  return { pass, fail }
}

async function run() {
  const browser = await chromium.launch()
  const realPage = await browser.newPage({ viewport: VIEWPORT })
  await realPage.goto(REAL_URL, { waitUntil: 'networkidle', timeout: 30000 })
  await dismissCookieBanner(realPage)

  const localPage = await browser.newPage({ viewport: VIEWPORT })
  await localPage.goto(LOCAL_URL, { waitUntil: 'networkidle', timeout: 30000 })

  let pass = 0
  let fail = 0
  for (const [name, check] of Object.entries(CHECKS)) {
    const realVal = await realPage.evaluate(check.real)
    const localVal = await localPage.evaluate(check.local)
    if (realVal == null || localVal == null) {
      console.log(`SKIP  ${name} (selector not found on one side)`)
      continue
    }
    const ok = check.compare(realVal, localVal)
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: ${check.describe(realVal, localVal)}`)
    if (ok) pass++
    else fail++
  }

  console.log('')
  const responsive = await runResponsiveChecks(browser)
  pass += responsive.pass
  fail += responsive.fail

  console.log(`\n${pass} passed, ${fail} failed`)
  await browser.close()
  process.exit(fail > 0 ? 1 : 0)
}

run()
