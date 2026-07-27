# Automatic Self-Review Checklist

Minden feladat vagy komponens elkészítése után az AI önállóan lefuttatja az alábbi felülvizsgálatot:

- [ ] **Kódminőség & TypeScript:** Szigorú típusosság, nincs `any`, nincsenek elnyomott linter hibák (`ts-ignore`).
- [ ] **Komponens Architektúra:** Ugyanaz a kód nem ismétlődik, a komponens újrahasználható.
- [ ] **Akadálymentesítés (WCAG 2.2 AA):** Billentyűzet-navigáció működik, van látható fókusz, ARIA címkék és alt szövegek kitöltve.
- [ ] **UX & Design System:** Illeszkedik a könyvtári minimalista dizájnhoz, tipográfia és térközök konzisztensek.
- [ ] **Teljesítmény:** Megfelelő Server Component használat, nincsenek felesleges `use client` direktívák, képek optimálisak.
- [ ] **Tesztelés:** Playwright E2E vagy Vitest unit teszt lefuttatva és sikeres.

Ha bármilyen hibát, ismétlést vagy rossz architektúrát találsz, **automatikusan javítsd**, majd teszteld újra!
