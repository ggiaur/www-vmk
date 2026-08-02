# VMK Frontend Design System & Component Governance Standard

A Vörösmarty Mihály Könyvtár (VMK) digitális platformjának hivatalos vizuális és komponens szabványrendszere. Ez a dokumentum kötelező érvényű normát képez minden eljövendő frontend és UI fejlesztés számára.

---

## 1. Brand Identity & Vizuális Karakter

* **Intézményi Jelleg:** Hagyománytisztelő, mégis modern közkönyvtári arculat.
* **Értékek:** Tudás, bizalom, nyitottság, kultúra, közösség és egyenlő esélyű hozzáférés.
* **Vizuális Érzés:** Szellős, letisztult, kiváló tipográfiájú, csendes eleganciájú felület, ahol a tartalom és az olvashatóság az elsődleges.

---

## 2. Design Principles (Tervezési Elvek)

1. **Vizuális Hierarchia:** Egyértelmű horgonypontok, kint és bent jól megkülönböztethető címsorok.
2. **Egyszerűség & Csendes Elegancia:** Nincsenek felesleges dekoratív elemek vagy öncélú animációk.
3. **Kiváló Olvashatóság (Readability First):** Megfelelő sorközök (`line-height`), betűméretek és kontraszt.
4. **Célzott Whitespace Használat:** Bőséges térközök a blokkok között az átláthatóságért.
5. **Mobile-First Megközelítés:** Minden elem és komponens alapértelmezetten mobilra van megtervezve, majd fokozatosan bővül asztali nézetre.
6. **Szigorú Konzisztencia:** Ugyanaz a UI feladat mindig ugyanazzal a komponenssel valósul meg.

---

## 3. Color System (Színrendszer & WCAG 2.2 AA Kontraszt)

> **2026-08 frissítés:** a felhasználó kifejezetten úgy döntött, hogy a www-vmk vizuális
> megjelenése a **jelenlegi, élő `www.vmk.hu`** oldalt kövesse pontosan (nem a korábban
> tervezett `uj.vmk.hu` "Scientia" témát) — a motor és az admin felület modern marad, csak
> a látogatói felszín legyen a mostani oldallal egyező. A paletta a valódi, éles
> `assets/dist/style.min.*.css` fájl közvetlen letöltésével és ellenőrzésével készült
> (nem becsléssel): `.btn-primary{background-color:#159097}`, `.navbar{border-bottom:5px
> solid #00909b}`, `a{color:#159097}`.

| Színkategória | Változó Neve | HEX Érték | Használati Szabály | WCAG AA Kontraszt (Háttérhez) |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `--primary` | `#159097` | Valódi vmk.hu teal — linkek, CTA gombok, aktív elemek. | 3.84:1 (Fehéren - nagy szövegre/UI-ra PASS AA, kis szövegre a sötétebb `--primary-hover` kell) |
| **Primary Hover**| `--primary-hover` | `#0f656a` | Interaktív állapotokhoz, és kis testű szövegre is biztonságos. | 6.79:1 (Fehéren - PASS AA kis szövegre is) |
| **Secondary** | `--secondary` | `#e4b02c` | A valódi oldal arany/sárga akcentszíne, jelvényekhez. | Csak ikonnal/nagy elemmel, sosem önmagában szövegszínként |
| **Accent** | `--accent` | `#f16f30` | A valódi oldal narancs akcentszíne, figyelemfelkeltő elemekhez. | Csak ikonnal/nagy elemmel |
| **Fejléc/Nav Sáv** | `--header-bg` / `--header-text` | `#159097` / `#FFFFFF` | Fejléc navigációs sáv - a felhasználó által küldött élő oldal-képernyőkép alapján teal, NEM sötét (a korábbi `#212121`/`#9F9F9F` egy sosem használt, elavult token volt). | Fehér szöveg tealon 3.84:1 (PASS AA nagy/UI szövegre) |
| **Neutral Dark** | `--text-main` | `#333333` | Törzsszövegek, címsorok (a valódi oldal `body{color:#333}` szabálya). | 12.6:1 (Fehéren - PASS AAA) |
| **Neutral Muted**| `--text-muted` | `#777777` | Metaadatok, dátumok, másodlagos infók. | 4.5:1 (Fehéren - PASS AA, határon — ne használd kisebb mint 14px szövegre) |
| **Background** | `--bg-page` | `#FFFFFF` | Alapértelmezett oldalháttér. | N/A |
| **Surface** | `--bg-card` | `#FFFFFF` | Kártyák, modálok és felületek háttérszíne. | N/A |
| **Success** | `--color-success` | `#166534` | Sikeres üzenetek, nyitva tartó gombok. | 5.2:1 (Fehéren - PASS AA) |
| **Warning** | `--color-warning` | `#B45309` | Ünnepi / megváltozott nyitvatartás jelzés. | 4.7:1 (Fehéren - PASS AA) |
| **Error** | `--color-error` | `#991B1B` | Hibaüzenetek, zárva tartó jelzés. | 7.1:1 (Fehéren - PASS AAA) |

> **Kontraszt-figyelmeztetés:** a `--primary` teal (`#159097`) önmagában, kis testű
> szövegként fehér háttéren **nem** éri el a WCAG AA 4.5:1 küszöböt — ezért kizárólag
> gombháttérként (fehér szöveggel), ikonszínként, vagy vastag/nagy UI-elemként használható.
> Testszövegben mindig `--text-main` vagy a sötétebb `--primary-hover` viszi a szöveget.

---

## 4. Typography (Tipográfia & Betűskála)

* **Font Család:** Címsorok: `Cinzel` (szerif) — a valódi `www.vmk.hu` betűtípusa (`h1-h6{font-family:Cinzel,serif}`). Törzsszöveg: `Roboto` (a valódi oldal `body{font-family:Roboto,...}` szabálya).
* **Betűméret & Sorköz Skála:**

```css
/* Typography Scale */
--text-xs:   0.75rem / 1.00rem; /* 12px / 16px - Caption / Badges */
--text-sm:   0.875rem / 1.25rem;/* 14px / 20px - Meta / Small UI */
--text-base: 1.00rem / 1.625rem;/* 16px / 26px - Body text */
--text-lg:   1.125rem / 1.75rem; /* 18px / 28px - Lead text / Card titles */
--text-xl:   1.25rem / 1.875rem; /* 20px / 30px - H4 */
--text-2xl:  1.50rem / 2.00rem;  /* 24px / 32px - H3 */
--text-3xl:  1.875rem / 2.25rem; /* 30px / 36px - H2 */
--text-4xl:  2.25rem / 2.50rem;  /* 36px / 40px - H1 Main Title */
```

---

## 5. Spacing System (8px Grid Rendszer)

```css
--space-xs:  0.25rem; /* 4px  - Micro spacing */
--space-sm:  0.50rem; /* 8px  - Compact gap */
--space-md:  1.00rem; /* 16px - Default padding / gap */
--space-lg:  1.50rem; /* 24px - Card interior padding */
--space-xl:  2.00rem; /* 32px - Section spacing */
--space-2xl: 3.00rem; /* 48px - Major layout block gap */
--space-3xl: 4.00rem; /* 64px - Hero & Section margins */
```

---

## 6. Layout System & Breakpoints

* **Container Max Width:** `1280px` (`max-w-7xl` centered with `px-4 sm:px-6 lg:px-8`).
* **Breakpoints:**
  - `sm`: `640px` (Nagyobb mobilok)
  - `md`: `768px` (Tabletek)
  - `lg`: `1024px` (Kisebb kijelzők / Asztali)
  - `xl`: `1280px` (Asztali monitorok)

---

## 7. Component Specification (Komponens Specifikációk)

### A. Navigation & Shell (Header, Navigation, Footer, Breadcrumb)
* **Header & TopBar:** Intézményi kék háttér, gyors elérhetőségek, nyelvválasztó, akadálymentes gomb és katalógus bejelentkezés.
* **Navigation:** Sticky asztali menü sor visszahúzható mobilfiókkal (Drawer).
* **Footer:** Háromoszlopos lábléc (Elérhetőség, Gyorshivatkozások, Adatvédelem/Impresszum).
* **Breadcrumb:** Szemantikus `<nav aria-label="Morzsamenü">` SEO és navigációs támogatáshoz.

### B. Core Cards (News, Event, Library, Staff, Document Card)
* **NewsCard:** Kép (16:9), Kategória jelvény, Cím (H3/H4), Összefoglaló (max 2 sor), Dátum, Megtekintés gomb.
* **EventCard:** Dátum jelvény (Hónap/Nap block), Cím, Helyszín (Tagkönyvtár reláció), Korosztály címke.
* **LibraryCard:** Könyvtár neve, Cím, Mai nyitvatartás státusz (Zöld = Nyitva, Piros = Zárva), Térkép link.
* **StaffCard:** Névjegy fotóval, beosztással, közvetlen e-mail és telefon elérhetőséggel.
* **DocumentCard:** Fájltípus ikon (PDF/DOCX), Cím, Feltöltés éve, Méret, Letöltés CTA gomb.

### C. Controls & Interactive (Hero, Button, Search, Accordion, Alert, Form, Modal)
* **Button:** Variánsok: `primary`, `secondary`, `outline`, `ghost`, `destructive`. Szigorúan látható fókuszkeret.
* **Search:** Azonnali Meilisearch gépeléses kereső input lebegő találati listával.
* **Accordion:** Gyakran Ismételt Kérdésekhez (FAQ) és szabályzatokhoz (`aria-expanded` kezeléssel).
* **Alert:** Rendszerüzenetekhez (Információ, Sikeres, Figyelmeztetés, Hiba).

---

## 8. shadcn/ui Integration Strategy

| Komponens Neve | Típus | Forrás | Testreszabás Szabályai |
| :--- | :--- | :--- | :--- |
| **Button, Input, Badge, Dialog, Accordion** | Standard UI | `shadcn/ui` (Radix Primitives) | Testreszabva a VMK színpalettára és WCAG AA fókuszstílusra. |
| **NewsCard, EventCard, LibraryCard** | Domain UI | Egyedi React Server Component | Közkönyvtári entitásokra szabott specifikus struktúra. |
| **OpeningHoursWidget** | Domain UI | Egyedi React Component | Dinamikus valós idejű óra- és nyitvatartás kalkulátor. |

---

## 9. Responsive & Accessibility Rules (WCAG 2.2 AA)

* **Keyboard Navigation:** Tabindex és billentyűzet-kezelés minden elemen (Enter/Space akciókhoz, Esc modál bezáráshoz).
* **Focus State:** Látható kontrasztos fókusz gyűrű (`ring-2 ring-primary ring-offset-2`).
* **ARIA & Alt Texts:** Minden ikonhoz és képhez kötelező alt szöveg vagy `aria-hidden="true"`.
* **Reduced Motion:** `@media (prefers-reduced-motion: reduce)` esetén animációk kikapcsolása.

---

## 10. Component Governance (Duplikáció Elleni Szabályzat)

1. **Egyetlen Forrás (Single Source of Truth):** Nem hozható létre új kártya vagy gomb variáns, ha a meglévő komponens prop-pal bővíthető.
2. **Atomi és Strukturális Szétválasztás:** A `ui/` könyvtár tartalmazza az atomi elemeket, míg a `blocks/` a CMS blokk-összetevőket.
3. **Audit & Review:** Minden új komponens esetén kötelező az `ai/REVIEW_CHECKLIST.md` lefuttatása.

---

## 11. Component Inventory Summary

| Komponens Neve | Kategória | Reusability | Szükséges Tesztek |
| :--- | :--- | :--- | :--- |
| `Header` | Shell | Globális | Playwright A11y & Navigáció |
| `Footer` | Shell | Globális | Playwright Link Audit |
| `HeroSection` | Block | Magas | Visual Regression / Vitest |
| `NewsCard` | Card | Magas | Vitest Component Test |
| `EventCard` | Card | Magas | Vitest Component Test |
| `LibraryCard` | Card | Magas | Vitest Opening Hours Logic |
| `StaffCard` | Card | Közepes | Vitest Component Test |
| `DocumentCard` | Card | Magas | Vitest Download Link Test |
| `OpeningHoursWidget` | Domain | Magas | Vitest Time Calculation Unit Test |
| `SearchInput` | Control | Magas | Playwright Meili Integration |
