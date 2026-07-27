# VMK Website Modernization - Project Specification

## 1. Scope & Legacy Migration
* **Target Domain:** [https://www.vmk.hu](https://www.vmk.hu)
* **Goal:** A meglévő funkcionalitás teljes megőrzése és kibővítése modern architektúrával.
* **Approach:** Teljes újratervezés (Greenfield Next.js 15 + Payload CMS v3).

## 2. Non-Functional Requirements (NFR)
* **Accessibility:** WCAG 2.2 AA teljes körű megfelelőség (billentyűzet-navigáció, képernyőolvasó támogatás, megfelelő színkontraszt).
* **Performance:** Core Web Vitals (LCP < 2.5s, FID/INP < 200ms, CLS < 0.1), Server Components, Streaming, Image Optimization.
* **SEO:** Szemantikus HTML5, dinamikus Metadata API, OpenGraph támogatás, strukturált adatok (JSON-LD library schema).
* **Security:** RBAC, biztonságos Média/MinIO tárolás, rate limiting, szigorú input sanitization.
* **Maintainability:** Komponensalapú architektúra, szigorú TypeScript, moduláris blokk-készlet.

## 3. Key User Roles
1. **Olvasók / Látogatók:** Gyors infószerzés (nyitvatartás, katalógus linkek, események, hírek, akadálymentes használat).
2. **Könyvtáros Szerkesztők:** Egyszerű tartalomkezelés 15 perc betanulás után (blokk szerkesztő, live preview, media management).
3. **Adminisztrátorok / Főszerkesztők:** Workflow jogosultságok (Draft -> Approval -> Publish), verziózás, felhasználókezelés.
4. **Fejlesztők / DevOps:** Zökkenőmentes CI/CD, Docker Compose stack, automatizált tesztelés.
