# Developer Setup & Milestone 1 Report (Fejlesztői Útmutató)

A VMK Modernizációs Projekt I. Mérföldkövének (Milestone 1) összefoglalója és a helyi fejlesztői környezet indítása.

---

## 1. Előfeltételek
* **Node.js:** v20.x+ (LTS)
* **Docker Desktop:** v24.x+ Docker Compose V2 támogatással
* **Git**

---

## 2. Helyi Fejlesztői Környezet Indítása (Docker Compose)

1. **Repozitórium klónozása és környezeti változók:**
   ```bash
   cp .env.example .env
   ```

2. **Full-Stack Szolgáltatások Indítása (PostgreSQL 16, MinIO, Meilisearch):**
   ```bash
   docker compose up -d
   ```

3. **Infrastruktúra Szolgáltatások Elérése:**
   * **Next.js 15 Webapp & Payload CMS v3 Admin:** `http://localhost:3000` / `http://localhost:3000/admin`
   * **PostgreSQL Adatbázis:** `localhost:5432` (`vmk_db`)
   * **MinIO Object Storage Console:** `http://localhost:9001` (User: `minio_admin` / Pass: `minio_password`)
   * **Meilisearch Search Engine:** `http://localhost:7700`

---

## 3. Minőségbiztosítási & Tesztelési Parancsok

* **TypeScript Típusellenőrzés:**
  ```bash
  npm run type-check
  ```
* **Vitest Unit Tesztek:**
  ```bash
  npm run test:unit
  ```
* **Playwright E2E & WCAG 2.2 AA Audit:**
  ```bash
  npm run test:e2e
  ```

---

## 4. Milestone 1 Befejezési Jelentés

| Feladat / Komponens | Státusz | Leírás |
| :--- | :---: | :--- |
| **Next.js 15 Init** | ✅ Kész | App Router, React 19, TypeScript `strict: true`. |
| **Payload CMS v3 Config** | ✅ Kész | Native Next.js 15 integráció és Local API konfiguráció. |
| **PostgreSQL 16 Setup** | ✅ Kész | Relációs adatbázis Docker konténer perzisztens volume-mal. |
| **MinIO & Meilisearch** | ✅ Kész | S3 médiatároló és instant keresőmotor konténerek. |
| **Docker Compose Architecture** | ✅ Kész | Production-ready multi-service compose file (`docker-compose.yml`). |
| **CI/CD Pipeline** | ✅ Kész | GitHub Actions workflow (Lint, Type-check, Vitest, Playwright). |
| **301 SEO Redirects** | ✅ Kész | Régi vmk.hu URL-ek leképezése `next.config.ts`-ben. |
