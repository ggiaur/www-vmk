# Accessibility Guidelines (WCAG 2.2 AA)

## 1. Core Mandates
* **Keyboard Navigation:** Minden interaktív elem elérhető és működtethető billentyűzettel (Tab, Enter, Space, Nyilak). Látható fókusz indikátor kötelező.
* **Contrast Ratios:** Normál szövegek esetén legalább 4.5:1, nagy szövegeknél legalább 3:1 kontrasztarány.
* **ARIA & Semantics:** Megfelelő ARIA role-ok, label-ök, élő régiók (live region) dinamikus frissüléseknél. Szemantikus HTML5 tags (`<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<aside>`).
* **Media Accessibility:** Minden képhez alt text, minden csatolt PDF-hez elérhető szöveges tartalom vagy leírás.
* **Screen Reader Testing:** Playwright + axe-core automatizált akadálymentesítési tesztek minden build során.
