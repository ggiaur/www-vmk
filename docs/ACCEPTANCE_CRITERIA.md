# Project Acceptance Criteria (Átvételi Feltételek)

A VMK Website Modernization Project akkor tekinthető sikeresen elvégzettnek és átadottnak, ha az alábbi szigorú ellenőrzőlista minden pontja igazoltan teljesül:

## 1. Migráció & Hivatkozásbiztonság
- [ ] Minden fontos régi oldal és hír át lett migrálva az új struktúrába.
- [ ] Zéró nem kezelt 404-es hiba: Az összes régi URL-re be van állítva a 301-es átirányítás (`docs/MIGRATION_STRATEGY.md`).
- [ ] Az összes PDF és médiafájl elérhető és letölthető az új felületről.

## 2. Felhasználói Élmény, Mobil & Akadálymentesítés
- [ ] Teljes körű mobil- és tablet-kompatibilitás (minden elem reszponzív, nincs vízszintes görgetés).
- [ ] Szigorú WCAG 2.2 AA megfelelőség (axe-core audit 0 kritikus vagy súlyos hibát jelez).
- [ ] Teljes billentyűzet-navigálhatóság és látható fókusz indikátorok minden oldalon.

## 3. Teljesítmény & SEO (Core Web Vitals)
- [ ] Google Lighthouse teljesítménypontszám > 90 (Mobile & Desktop).
- [ ] LCP (Largest Contentful Paint) < 2.5s.
- [ ] Szemantikus HTML5 felépítés és automatikus `sitemap.xml` / OpenGraph metaadatok.

## 4. Szerkesztői Élmény (Payload CMS v3)
- [ ] A könyvtáros szerkesztők max. 15 perces betanulással tudnak új hírt, eseményt, nyitvatartást és dokumentumot felvinni.
- [ ] Működik a Live Preview (élő előnézet) és a Piszkozat (Draft) / Publikálási (Publish) workflow.
- [ ] Szerepkör alapú hozzáférés-kezelés (RBAC) beállítva.

## 5. Üzemeltetés, Tesztelés & Biztonság
- [ ] Playwright E2E tesztek lefedik az összes főbb felhasználói utat.
- [ ] A Docker Compose környezet hiba nélkül elindul és fut.
- [ ] Működik az automatizált adatbázis és MinIO mentési/helyreállítási (Backup & Rollback) eljárás.
