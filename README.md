# Vörösmarty Mihály Könyvtár (VMK) - Modernized Web Platform

[![CI/CD Pipeline](https://github.com/ggiaur/www-vmk/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ggiaur/www-vmk/actions/workflows/ci-cd.yml)
[![Version](https://img.shields.io/badge/version-v0.1.0--foundation-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A Vörösmarty Mihály Könyvtár ([https://www.vmk.hu](https://www.vmk.hu)) teljesen újratervezett, modern, akadálymentes (WCAG 2.2 AA) és fenntartható digitális platformjának hivatalos repozitóriuma.

---

## 🏛️ A Projekt Célja
A meglévő egyedi PHP/WordPress rendszer felváltása egy intézményi szintű, modern, fenntartható és skálázható **Next.js 15 + Payload CMS v3** headless architektúrával.

### Fő Tervezési Alapelvek:
* **Szerkesztői Egyszerűség:** A könyvtáros szerkesztők 15 perces betanulással képesek hírek, rendezvények, nyitvatartások és dokumentumok feltöltésére.
* **Akadálymentesítés (WCAG 2.2 AA):** Nem elszigetelt "vak-oldal", hanem a teljes felület billentyűzettel navigálható, magas kontrasztú és ARIA-címkézett.
* **Adat- és SEO-Védelem:** 100%-os URL megőrzés és 301-es átirányítás a keresőmotorok helyezéseinek megtartásával.

---

## 🛠️ Technológiai Stack

* **Frontend:** Next.js 15 (App Router, Server Components), React 19, TypeScript, TailwindCSS, shadcn/ui, Lucide Icons.
* **Headless CMS:** Payload CMS v3 (Native Next.js 15 integration).
* **Adatbázis:** PostgreSQL 16.
* **Médiatároló:** MinIO (S3-compatible Object Storage).
* **Keresőmotor:** Meilisearch (Instant Full-Text Search).
* **Konténerizáció:** Docker & Docker Compose.
* **CI/CD Pipeline:** GitHub Actions (Lint, Type-check, Vitest, Playwright, Accessibility audit).

---

## 🚀 Gyorsindítás (Local Development)

### 1. Előfeltételek
* Node.js v20+ LTS
* Docker Desktop v24+

### 2. Környezet Beállítása & Indítása
```bash
# 1. Repozitórium klónozása
git clone https://github.com/ggiaur/www-vmk.git
cd www-vmk

# 2. Környezeti változók másolása
cp .env.example .env

# 3. Docker Compose infrastruktúra elindítása
docker compose up -d
```

### 3. Szolgáltatások Elérése
* **Next.js Webapp & Admin:** `http://localhost:3000` / `http://localhost:3000/admin`
* **PostgreSQL:** `localhost:5432` (`vmk_db`)
* **MinIO Console:** `http://localhost:9001` (`minio_admin` / `minio_password`)
* **Meilisearch:** `http://localhost:7700`

---

## 🧪 Tesztelés & Minőségbiztosítás

```bash
# TypeScript Típusellenőrzés
npm run type-check

# Vitest Unit & RSC Tesztek
npm run test:unit

# Playwright E2E & WCAG 2.2 AA Audit
npm run test:e2e
```

---

## 📚 Projekt Dokumentáció

* **[README_AI.md](file:///c:/Users/bj/vmk.hu/IT%20-%20Dokumentumok/General/dev/vmk.hu/README_AI.md)** — Az AI agent belépési pontja és a projekt Alkotmánya.
* **[docs/VISION.md](file:///c:/Users/bj/vmk.hu/IT%20-%20Dokumentumok/General/dev/vmk.hu/docs/VISION.md)** — Jövőkép és intézményi stratégiák.
* **[docs/ARCHITECTURE.md](file:///c:/Users/bj/vmk.hu/IT%20-%20Dokumentumok/General/dev/vmk.hu/docs/ARCHITECTURE.md)** — Rendszerarchitektúra és Docker Compose specifikáció.
* **[docs/DESIGN_SYSTEM.md](file:///c:/Users/bj/vmk.hu/IT%20-%20Dokumentumok/General/dev/vmk.hu/docs/DESIGN_SYSTEM.md)** — Vizuális és komponens szabványrendszer (WCAG 2.2 AA).
* **[docs/UX_PROTOTYPE.md](file:///c:/Users/bj/vmk.hu/IT%20-%20Dokumentumok/General/dev/vmk.hu/docs/UX_PROTOTYPE.md)** — UX Prototípus és interakciós specifikáció.
