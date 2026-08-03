# Teljesítmény Baseline — VMK Website Modernization

**Mérés dátuma:** 2026-08-03. **Eszköz:** Lighthouse 13.4.1 CLI, Playwright
Chromium 1234 (headless), a repóban futtatva. **Módszertan:** Lighthouse
alapértelmezett "desktop" preset, **szimulált** hálózati/CPU throttlinggel
(nem valós hálózati mérés) — `rttMs:150, throughputKbps:1638.4,
cpuSlowdownMultiplier:4`. Ez a Lighthouse gyári desktop-profilja, nem
egyedi beállítás.

**Kritikus módszertani megjegyzés:** két mérési kört futtattunk, és a
számok drámaian eltérnek — ez maga is dokumentálásra érdemes tanulság:

| | `npm run dev` (fejlesztői szerver) | `npm run build` + `npm run start` (production build) |
|---|---|---|
| Performance score (Homepage) | **30/100** | **66/100** |
| LCP | 5.5 s | 3.1 s |
| TBT | 1570 ms | 80 ms |
| TTI | 23.6 s | 4.3 s |

A dev-szerver számai **nem reprezentatívak** — a Next.js dev mód
kikapcsolja a minifikációt/optimalizációt és on-demand fordít minden
route-ot, ami irreálisan magas TBT/TTI értékeket ad. Az alábbi táblázatok
kizárólag a **production build** (`next build` + `next start`, port 3099)
mérését tartalmazzák — ez a valós, telepítés utáni teljesítményhez közelebb
álló szám.

## Eredmények oldalanként (production build)

| Oldal | Performance | Accessibility (Lighthouse) | Best Practices | SEO | FCP | LCP | TBT | CLS | TTI |
|---|---|---|---|---|---|---|---|---|---|
| `/` (Főoldal) | 66 | 86 | 92 | 100 | 2.8 s | **3.1 s** | 80 ms | 0.002 | 4.3 s |
| `/hirek` | 66 | 95 | 92 | 100 | 1.8 s | **5.0 s** | 120 ms | 0.002 | 5.5 s |
| `/nyitvatartas` | 72 | 96 | 92 | 100 | 1.6 s | **4.0 s** | 50 ms | 0.002 | 4.3 s |
| `/kapcsolat` | 73 | 97 | 92 | 100 | 1.5 s | **3.9 s** | 40 ms | 0.002 | 4.3 s |

*(A Lighthouse "Accessibility" oszlop egy heurisztikus gyorsteszt, nem
helyettesíti a `tests/e2e/accessibility.spec.ts` teljes axe-core auditját —
a részletes, valós WCAG 2.2 AA eredményekért ld. `docs/RISK_REGISTER.md`
R-03 tétele: 15/16 oldal ténylegesen elbukik teljes körű auditon.)*

## Célértékek vs. mért állapot (`docs/PROJECT_SPEC.md` NFR-szakasz)

| Metrika | Cél (NFR) | Mért (Főoldal, production) | Állapot |
|---|---|---|---|
| LCP | < 2.5 s | 3.1 s (legjobb mért oldal: 3.9 s) | **Nem teljesül** minden mért oldalon |
| CLS | < 0.1 | 0.002 | ✅ Teljesül, bőven |
| TBT (INP proxy) | < 200 ms | 40–120 ms | ✅ Teljesül |

## Megfigyelt, konkrét okok (nem találgatás — Lighthouse "opportunities" audit alapján)

* **`redirects` audit a főoldalon:** "Avoid multiple page redirects — Est
  savings of 620 ms" — a főoldal betöltése jelenleg legalább egy extra
  redirect-kört tartalmaz, ami közvetlenül az LCP-be számít bele. Ez a
  legkonkrétabb, azonnal vizsgálható tétel.
* A `/hirek` oldal LCP-je (5.0 s) a listaoldalak közül kiugróan a
  legrosszabb — valószínűsíthető ok (nem mért, csak feltételezés): a 335
  cikkes lista sok kép egyidejű betöltése/streamelése, de ezt **nem
  állítom tényként** további profilozás (pl. `lcp-breakdown` audit
  részletes elemzése) nélkül.

## Amit ez a baseline NEM tartalmaz

* **Valós terepi (field) adat** (CrUX, valós felhasználói RUM) — ehhez
  nincs hozzáférés, mert a projektnek nincs éles domainje/forgalma még.
  Csak laborméréssel (Lighthouse szimuláció) tudunk dolgozni.
* **Mobil form-factor mérés** — csak desktop presettel mértünk ebben a
  körben; mobil Core Web Vitals külön mérést igényel, ha az szükséges.
* **Valós vmk.hu-val való összehasonlítás** — a régi oldal jelenlegi
  teljesítményét nem mértük ezzel a módszertannal; ha az összevetés cél,
  külön Lighthouse-futtatás szükséges a `https://www.vmk.hu` élő oldalon.

Nyers Lighthouse JSON/HTML riportok (nem részei a repónak, csak erre a
munkamenetre): `/tmp/claude-999/-srv-projects/5bb47936-566c-49a0-962f-2ea7d2865fe8/scratchpad/lighthouse/`.
