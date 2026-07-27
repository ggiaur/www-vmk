# Testing Strategy - Vitest & Playwright

## 1. Automated Testing Stack
* **Unit & Component Testing:** Vitest + React Testing Library (komponensek, segédfüggvények, utility-k).
* **End-to-End (E2E) Testing:** Playwright (felhasználói útvonalak, űrlap beküldés, navigáció).
* **Accessibility Auditing:** Playwright + `@axe-core/playwright`.

## 2. Playwright Automated Testing Protocol
* **Minden új oldal vagy lényegi komponens után automatikusan E2E és Accessibility teszt készül.**
* Ha a Playwright hibaállapotot észlel, a rendszert automatikusan javítani kell, majd újra kell futtatni a tesztet a sikeres végrehajtásig.
