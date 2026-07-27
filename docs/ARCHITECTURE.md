# System Architecture Specification (Rendszerarchitektúra & Tervezés)

## 1. System Overview & Technology Stack

```
+-----------------------------------------------------------------------------------+
|                               NEXT.JS 15 FRONTEND                                 |
|  React 19 | Server Components | App Router | TailwindCSS | shadcn/ui | TypeScript |
+-----------------------------------------------------------------------------------+
                                         |
                  +----------------------+----------------------+
                  | REST / GraphQL / Local Payload API          |
                  v                                             v
+-----------------------------------+         +-----------------------------------+
|         PAYLOAD CMS v3            |         |            MEILISEARCH            |
| Headless CMS Engine in Next.js    |         | Instant Full-Text Search Engine   |
+-----------------------------------+         +-----------------------------------+
        |                   |
        v                   v
+---------------+   +-------------------+
|  POSTGRESQL   |   |       MINIO       |
| Relational DB |   | S3 Media Storage  |
+---------------+   +-------------------+
```

---

## 2. Payload CMS v3 Collections & Schema Architecture

### A. Collections (Gyűjtemények)
1. **`Libraries` (Könyvtárak & Részlegek):**
   - Slug, Name, Type (Central | Branch | Department), Address, Geolocation (lat/lng), Phone, Email, OpeningHours (Reláció), Staff (Reláció), Services (Reláció), FeaturedImage, DescriptionBlocks.
2. **`News` (Hírek & Közlemények):**
   - Slug, Title, PublishedAt, Author (Reláció -> Users), Category, Summary, Content (Lexical RichText), FeaturedImage, RelatedLibrary (Reláció).
3. **`Events` (Rendezvények):**
   - Slug, Title, StartDate, EndDate, Location (Reláció -> Libraries), TargetAudience, Summary, Description, RegistrationUrl, FeaturedImage, IsArchived.
4. **`Staff` (Munkatársak):**
   - Name, Position, Department (Reláció -> Libraries), Phone, Email, Avatar, Order.
5. **`Documents` (Dokumentumtár):**
   - Title, File (Reláció -> Media), Category (SZMSZ, Beszámoló, Pályázat, Űrlap), Year, DownloadCount.
6. **`Services` (Szolgáltatások):**
   - Slug, Title, ShortDescription, PricingTable, RulesPdf (Reláció -> Media), Icon.
7. **`Pages` (Moduláris Oldalak):**
   - Slug, Title, Layout (Block Editor array).
8. **`Media` (MinIO S3 feltöltések):**
   - File, AltText, Caption, FocalPoint, MimeType.
9. **`Users` (Adminisztrátorok & Szerkesztők):**
   - Email, Name, Role (Admin | Editor | Author), AssignedLibrary (Reláció).

### B. Globals (Globális Rendszerbeállítások)
* **`OpeningHoursGlobal`:** Központi és ünnepek körüli rendkívüli nyitvatartási mátrix.
* **`HeaderSettings`:** Fő navigáció, felső gombok, katalógus linkek.
* **`FooterSettings`:** Lábfej oszlopok, adatvédelmi hivatkozások, közösségi média linkek.
* **`SiteMetadata`:** Központi SEO, OpenGraph és Google Analytics / GTM azonosítók.

### C. Blocks (Újrahasználható Blokk Típusok)
* `HeroBlock`, `NewsFeedBlock`, `EventGridBlock`, `LibraryMapBlock`, `AccordionBlock`, `DocumentListBlock`, `RichTextBlock`, `ContactFormBlock`.

---

## 3. Roles & Permissions (RBAC)

* **Adminisztrátor (Admin):**
  - Teljes hozzáférés az összes Collection-höz, Globals-hoz, User managementhez és rendszerbeállításokhoz.
* **Főszerkesztő (Editor):**
  - Hírek, események, oldalak, dokumentumok hozása/módosítása/publikálása, Live Preview használata.
* **Könyvtáros Szerkesztő (Author):**
  - Szigorúan az adott tagkönyvtárhoz rendelt hírek és események szerkesztése. Piszkozat (`Draft`) mentési lehetőség, publikálás jóváhagyáshoz kötött (`Review`).

---

## 4. API & Search Architecture

* **Payload Local API:** A Next.js Server Components közvetlenül, Node.js folyamaton belül hívják a Payload Local API-t (nulla HTTP overhead).
* **Meilisearch Sync:** A Payload Collection Hooks (`afterChange`, `afterDelete`) automatikusan szinkronizálják a híreket, eseményeket és dokumentumokat a Meilisearch indexbe.
* **REST & GraphQL API:** Szükség esetén védett végpontok külső integrációkhoz (pl. mobilapplikáció vagy városi portál felé).

---

## 5. Next.js 15 App Router Alkalmazásstruktúra

```
/src
  /app
    (frontend)
      /page.tsx                     --> Főoldal
      /nyitvatartas/page.tsx        --> Nyitvatartási mátrix
      /hirek/page.tsx               --> Hírarchívum
      /hirek/[slug]/page.tsx        --> Egyedi hír
      /esemenyek/page.tsx           --> Eseménykalendárium
      /tagkonyvtarak/[slug]/page.tsx --> Tagkönyvtár adatlap
      /rolunk/munkatarsak/page.tsx   --> Munkatársak adatbázisa
      /rolunk/alapdokumentumok/page.tsx --> Dokumentumtár
      /layout.tsx                   --> Fő layout (Header, Footer)
    (payload)
      /admin/[[...segments]]/page.tsx --> Payload v3 Admin UI
      /api/[[...segments]]/route.tsx  --> Payload v3 API routes
  /components
    /ui                             --> shadcn/ui atomi komponensek
    /blocks                         --> Payload blocks (Hero, NewsFeed, Map, etc.)
    /navigation                     --> Header, Footer, AccessibilityBar
  /lib
    /payload                        --> Payload client & local API helper
    /meilisearch                    --> Search client & indexing helper
  /types                            --> Auto-generated Payload & TypeScript types
```

---

## 6. Docker Compose Architektúra

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URI=postgres://vmk_user:vmk_password@postgres:5432/vmk_db
      - PAYLOAD_SECRET=your_super_secret_payload_key
      - MINIO_ENDPOINT=minio
      - MINIO_BUCKET=vmk-media
      - MEILISEARCH_HOST=http://meilisearch:7700
    depends_on:
      - postgres
      - minio
      - meilisearch

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: vmk_db
      POSTGRES_USER: vmk_user
      POSTGRES_PASSWORD: vmk_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minio_admin
      MINIO_ROOT_PASSWORD: minio_password
    volumes:
      - minio_data:/data

  meilisearch:
    image: getmeili/meilisearch:v1.6
    environment:
      MEILI_MASTER_KEY: meili_master_key
    volumes:
      - meili_data:/meili_data

volumes:
  postgres_data:
  minio_data:
  meili_data:
```

---

## 7. CI/CD Pipeline & GitHub Actions

```
[ Push to main / PR ] 
         │
         ▼
┌───────────────────────────┐
│ 1. Lint & TypeScript Check│  (pnpm lint && pnpm type-check)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 2. Vitest Unit & RSC Tests│  (pnpm test:unit)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 3. Playwright E2E & A11y  │  (pnpm test:e2e --accessibility)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 4. Docker Build & Push    │  (Docker Hub / GHCR Container Registry)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ 5. Staging Deployment     │  (SSH / Webhook Docker Compose Pull)
└───────────────────────────┘
```

---

## 8. Tesztelési & Minőségbiztosítási Stratégia

* **Unit & RSC Tesztek:** Vitest + React Testing Library a komponensek és segédfüggvények tesztelésére (típusos props, hibakezelés).
* **End-to-End (E2E) Tesztek:** Playwright tesztek a kulcsfontosságú felhasználói utakra (nyitvatartási szűrő, katalógus belépési gomb, hír megtekintése, űrlap beküldés).
* **Akadálymentesítési Tesztelés:** Playwright + `@axe-core/playwright` integráció minden build automatikus lefutásakor. Szigorúan 0 kritikus vagy súlyos sérülés fogadható el.
* **No Application Code Execution Until Approval:** A tesztek és kódok megírására a fázis jóváhagyását követően kerül sor.
