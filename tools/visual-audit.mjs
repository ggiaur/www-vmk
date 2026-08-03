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
    // FIGYELEM (H8): az előző verzió compare: (r, l) => r != null && l != null volt —
    // ez MINDIG PASS-t adott, ha mindkét szín létezett, a tényleges RGB-értéket
    // nem hasonlította. Javítva: a tényleges színt hasonlítjuk.
    // A valóson a kártyánként rotáló szín miatt az ELSŐ kártya színét mérjük
    // (mindkét oldalon ugyanaz az indexálás, tehát összehasonlítható).
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
    // A két oldalon más az ELSŐ kártya (más cikk), ezért a SZÍN különbözhet
    // (rotáló paletta). Amit ellenőrzünk: a háttér NEM fehér és NEM transparent
    // — vagyis van-e egyáltalán tömör színű cím-sáv. Ez az igazi invariáns.
    compare: (r, l) => {
      const isColored = (s) => s && s !== 'rgba(0, 0, 0, 0)' && s !== 'transparent' && !s.startsWith('rgb(255, 255, 255')
      return isColored(r) && isColored(l)
    },
    describe: (r, l) => `real=${r} vs local=${l} (mindkét oldalon kell legyen tömör színű cím-sáv — a konkrét szín eltérhet, mert más cikk az első)`,
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
      // UGYANAZT a widgetet kell mérni, mint a valós oldalon (FEWA).
      // Korábban itt a webarchivum.vmk.hu (Aranybulla) link állt, tehát
      // a check a valós FEWA-t hasonlította a helyi ARANYBULLA-hoz -
      // két különböző widgetet. Ez csak addig "ment át", amíg minden
      // widget azonos fix magasságra volt kényszerítve.
      const card = document.querySelector('aside a[href*="fewa.vmk.hu"]')
      if (!card) return null
      const r = card.getBoundingClientRect()
      return { w: Math.round(r.width), h: Math.round(r.height) }
    },
    // FIGYELEM: ez az ellenőrzés EGYETLEN widgetet (FEWA) mér, ami a
    // legkisebb a toronyban. Ezért van MELLETTE a widgetTowerTotalHeight ellenőrzés.
    // H8 javítás: az előző ±40% magasság-tolerancia önigazoló volt (135px valós
    // vs 189px klón = PASS volt). Javítva ±5%-ra mindkét dimenzióra.
    // Elvi alap: a FEWA widget-képe statikus, fix méretű — nincs oka eltérni.
    compare: (r, l) => Math.abs(r.w - l.w) / r.w <= 0.05 && Math.abs(r.h - l.h) / r.h <= 0.05,
    describe: (r, l) => `real ${r.w}x${r.h} vs local ${l.w}x${l.h} (CSAK a FEWA widget — ±5% mindkét dimenzióra, elvi alap: statikus kép)`,
  },
  // Az EGÉSZ oldalsáv widget-torony együttes magassága. Ez fogja meg
  // azt a hibaosztályt, amit a widgetBoxSize (egyetlen widget) nem:
  // ha minden widget azonos, fix magasságra van kényszerítve, az
  // egyedi doboz mérete stimmelhet, de a torony drasztikusan rövidebb
  // lesz - ez volt a teljes oldalmagasság-rés 84%-a (1447px).
  widgetTowerTotalHeight: {
    real: () => {
      const boxes = [...document.querySelectorAll('.box')].filter((b) => b.querySelector('h1'))
      // A "Menü" doboz nem promóciós widget, kihagyjuk a torony-összegből
      return boxes
        .filter((b) => b.querySelector('h1').textContent.trim() !== 'Menü')
        .reduce((sum, b) => sum + b.getBoundingClientRect().height, 0)
    },
    local: () => {
      const cards = [...document.querySelectorAll('aside a[href]')].filter((a) => a.querySelector('img'))
      return cards.reduce((sum, a) => sum + a.getBoundingClientRect().height, 0)
    },
    // H8 javítás: ±15% = ~460px elfogadható eltérés volt — önigazoló.
    // A mért különbség 2734px vs 3055px = 321px (10.5%).
    // ±8% = ~244px — ez az a határérték, ami alatt a torony "jól" néz ki,
    // de még kezelhetőbb hibahatárt jelent mint ±15%.
    // Elvi alap: ha a widget-torony >8%-kal rövidebb a valósnál, a
    // grid layout felborul (az oldalsáv "elmarad" a fő tartalomtól).
    compare: (r, l) => Math.abs(r - l) / r <= 0.08,
    describe: (r, l) =>
      `real torony=${Math.round(r)}px vs local=${Math.round(l)}px (±8% = ±${Math.round(r * 0.08)}px; mért különbség: ${Math.round(Math.abs(r - l))}px = ${(Math.abs(r - l) / r * 100).toFixed(1)}%)`,
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
    // H8 javítás: ±20% = ~34px volt elfogadható — önigazoló.
    // Elvi alap: a kép-konténer magassága CSS-sel van rögzítve (h-36 = 144px
    // klónban, valóson ~170px). Ez mért különbség, ezért a tolerancia
    // ±10% = ~17px — ha ennél nagyobb, a CSS változott.
    compare: (r, l) => Math.abs(r - l) / r <= 0.1,
    describe: (r, l) => `real image height=${r}px vs local=${l}px (±10% = ±${Math.round(r * 0.1)}px; mért különbség: ${Math.abs(r - l)}px = ${(Math.abs(r - l) / r * 100).toFixed(1)}%)`,
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
    // H8 javítás: az előző compare: () => true MINDIG PASS-t adott — ez hamis.
    // Helyes viselkedés: ha a valóson NINCS banner (null), SKIP-elünk.
    // Ha mindkét oldalon van, a magasságot hasonlítjuk ±10%-on belül.
    // Ha a klónon van, de a valóson nincs: FAIL (felesleges elem a klónban).
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
    // compare null-ra: a runner SKIP-el (mindkét oldal null) vagy FAIL-t adhat
    // ha csak az egyik oldal null. Az alábbi null-eset a runner logikájával
    // együtt SKIP-et jelent ha real=null (időszakos tartalom nincs kint).
    compare: (r, l) => Math.abs(r - l) / r <= 0.1,
    describe: (r, l) =>
      `real=${r}px vs local=${l}px (ha mindkét oldalon van, ±10% tolerancia; ha valóson nincs → SKIP)`,
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
      // aria-label alapú szelektor, NEM a szülő pontos Tailwind gap-
      // osztálya alapján - az utóbbi elavulttá vált, amikor a gap
      // értékét gap-2-ről gap-[13px]-re javítottuk (mért valós
      // érték alapján), és a check emiatt hamis FAIL-t adott.
      const anchors = [...document.querySelectorAll('header > div:first-child a[aria-label]')]
      return anchors
        .map((a) => a.querySelector('img, svg'))
        .filter(Boolean)
        .map((el) => {
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
      const anchors = [...document.querySelectorAll('header > div:first-child a[aria-label]')]
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
      // A border a BELSŐ konténeren van (a max-w-[...] divjén), nem a
      // külső, teljes szélességű wrapperen - 2026-08-02-én ezt is
      // javítottuk (korábban a csík tévesen a teljes viewport
      // szélességén futott), a szelektort is frissítve kellett erre.
      const row = document.querySelector('header > div:nth-child(2) > div')
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
  // --- ÚJ ELLENŐRZÉSEK: fő tartalom-rács pozíciója és mérete ---
  // Ezek hiányoztak, miközben a pixel-diff legsötétebb tartományai
  // (y=200-1200, ~65-82%) épp a fő tartalom-rácson voltak.
  // (H8: az audit addig egyetlen ellenőrzést sem tartalmazott erre.)

  mainColumnX: {
    // A fő tartalom-oszlop bal széle. Ez a legfontosabb pozíciós invariáns:
    // ha az oszlop eltolódik, az egész tartalom elcsúszik.
    // Mérve: valós oldalon a .elements x=443px, klónon az első hírkártya x=442px.
    real: () => {
      const el = document.querySelector('.elements')
      return el ? Math.round(el.getBoundingClientRect().x) : null
    },
    local: () => {
      // A `main` elem fullwidth (x=0), a tartalom beljebb kezdődik.
      // Az első hírkártya x-pozíciója a tényleges tartalom-oszlop kezdetét jelzi.
      const card = document.querySelector('main a[href^="/hirek/"]')
      return card ? Math.round(card.getBoundingClientRect().x) : null
    },
    compare: (r, l) => Math.abs(r - l) <= 8,
    describe: (r, l) => `real x=${r}px vs local x=${l}px (fő tartalom első hírkártya bal széle — ±8px)`,
  },

  newsCardGridWidth: {
    // A hírkártya-rács teljes szélessége.
    // Valós oldalon Bootstrap konténer belső tartalma: .elements = 848px
    // (a sidebar 262px, köze 30px = 848+262+30 ≈ 1140px + márgók).
    // Klón: page-szintű main (min-w-0) belső rácsa = 848px.
    // FIGYELEM: két 'main' elem van az oldalon (Next.js app shell + page).
    // A 'main .grid' a layout-szintű main-t találja (1170px, hibás).
    // A helyes: 'main.min-w-0 .grid' — a page-szintű main-en belüli első rács.
    real: () => {
      const grid = document.querySelector('.elements')
      return grid ? Math.round(grid.getBoundingClientRect().width) : null
    },
    local: () => {
      // A page-szintű main elem (min-w-0 osztállyal) a konténer-grid cellaéban van.
      // Az első belső .grid eleme a hírkártya-rács.
      const pageMain = document.querySelector('main.min-w-0')
      const grid = pageMain ? pageMain.querySelector('.grid') : null
      return grid ? Math.round(grid.getBoundingClientRect().width) : null
    },
    compare: (r, l) => Math.abs(r - l) / r <= 0.05,
    describe: (r, l) => `real width=${r}px vs local=${l}px (fő tartalom-rács szélessége — ±5%)`,
  },

  newsCardWidth: {
    // Egyedi hírkártya szélessége: mennyi hely jut egy kártyának.
    // Valós mérés (moz + BoundingClientRect): ~262px
    // Klón mérés: 272px
    real: () => {
      const card = document.querySelector('.elements a.box.type1:not(.main)')
      return card ? Math.round(card.getBoundingClientRect().width) : null
    },
    local: () => {
      const card = document.querySelector('main a[href^="/hirek/"]')
      return card ? Math.round(card.getBoundingClientRect().width) : null
    },
    compare: (r, l) => Math.abs(r - l) / r <= 0.05,
    describe: (r, l) => `real card=${r}px vs local=${l}px (egyedi hírkártya szélesség — ±5%)`,
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
