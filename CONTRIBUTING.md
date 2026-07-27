# Contributing Guidelines

Köszönjük, hogy hozzájárulsz a Vörösmarty Mihály Könyvtár (VMK) új digitális platformjának fejlesztéséhez!

## 1. Fejlesztési Elvek & Alkotmány
Minden hozzájárulásnak szigorúan követnie kell a repozitóriumban rögzített szabványokat:
* **[README_AI.md](file:///c:/Users/bj/vmk.hu/IT%20-%20Dokumentumok/General/dev/vmk.hu/README_AI.md)** — Alapvető nem-megszeghető szabályok.
* **[docs/DESIGN_SYSTEM.md](file:///c:/Users/bj/vmk.hu/IT%20-%20Dokumentumok/General/dev/vmk.hu/docs/DESIGN_SYSTEM.md)** — Vizuális és komponens szabványok (WCAG 2.2 AA).
* **[ai/CODING_STANDARDS.md](file:///c:/Users/bj/vmk.hu/IT%20-%20Dokumentumok/General/dev/vmk.hu/ai/CODING_STANDARDS.md)** — Szigorú TypeScript elvárások (nincs `any`).

## 2. Branching & Commit Konvenciók
* `main` — Stabil production kód.
* `develop` — Integrációs fejlesztői ág.
* `feature/<funkció-neve>` — Egyedi funkció fejlesztése.

### Conventional Commit Formátum:
* `feat: add news card component`
* `fix: correct opening hours status calculation`
* `docs: update migration strategy`
* `chore: update dependencies`

## 3. Pull Request (PR) Ellenőrzőlista
Minden PR beküldése előtt futtasd le a kötelező ellenőrzéseket:
```bash
npm run type-check
npm run test:unit
npm run test:e2e
```
