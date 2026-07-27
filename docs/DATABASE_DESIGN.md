# Database Design & Schema Contract (Adatbázis & CMS Schema Terv)

A Payload CMS v3 PostgreSQL relációs adatmodelljének és adatbázis-szerződésének részletes műszaki specifikációja.

---

## 1. Core Collections Schema Specification

### A. `Users` (Felhasználók & Szerkesztők)
* **Tábla Neve:** `users`
* **Mezők:**
  - `id`: `UUID` (Primary Key, Auto-gen)
  - `email`: `String` (NOT NULL, UNIQUE, Validated Email)
  - `name`: `String` (NOT NULL)
  - `role`: `Enum` (`'admin' | 'editor' | 'author'`, NOT NULL, Default: `'author'`)
  - `assignedLibrary`: `Relation` (HasOne -> `Libraries`, Optional)
  - `createdAt`: `Timestamp` (NOT NULL)
  - `updatedAt`: `Timestamp` (NOT NULL)
* **Indexek:** `idx_users_email` (UNIQUE), `idx_users_role`.

### B. `Media` (Médiatároló / MinIO S3)
* **Tábla Neve:** `media`
* **Mezők:**
  - `id`: `UUID` (Primary Key)
  - `filename`: `String` (NOT NULL)
  - `alt`: `String` (NOT NULL, Accessibility Validation)
  - `caption`: `String` (Optional)
  - `mimeType`: `String` (NOT NULL)
  - `filesize`: `Number` (NOT NULL)
  - `url`: `String` (NOT NULL)
* **Indexek:** `idx_media_filename`.

### C. `Libraries` (Tagkönyvtárak & Részlegek)
* **Tábla Neve:** `libraries`
* **Mezők:**
  - `id`: `UUID` (Primary Key)
  - `name`: `String` (NOT NULL)
  - `slug`: `String` (NOT NULL, UNIQUE, Indexed)
  - `type`: `Enum` (`'central' | 'branch' | 'department'`, NOT NULL)
  - `address`: `String` (NOT NULL)
  - `phone`: `String` (Optional)
  - `email`: `String` (Optional)
  - `geolocation`: `JSONB` (`{ lat: number, lng: number }`, Optional)
  - `featuredImage`: `Relation` (HasOne -> `Media`, Optional)
  - `description`: `RichText` (Lexical, Optional)
* **Indexek:** `idx_libraries_slug` (UNIQUE), `idx_libraries_type`.

### D. `News` (Hírek & Közlemények)
* **Tábla Neve:** `news`
* **Mezők:**
  - `id`: `UUID` (Primary Key)
  - `title`: `String` (NOT NULL)
  - `slug`: `String` (NOT NULL, UNIQUE, Indexed)
  - `publishedAt`: `Timestamp` (NOT NULL, Default: `now()`)
  - `category`: `Enum` (`'general' | 'announcement' | 'grant'`, NOT NULL)
  - `summary`: `Text` (NOT NULL, Max 300 chars)
  - `content`: `RichText` (Lexical Blocks, NOT NULL)
  - `featuredImage`: `Relation` (HasOne -> `Media`, Optional)
  - `relatedLibrary`: `Relation` (HasOne -> `Libraries`, Optional)
  - `author`: `Relation` (HasOne -> `Users`, NOT NULL)
  - `_status`: `Enum` (`'draft' | 'published'`, Default: `'draft'`)
* **Indexek:** `idx_news_slug` (UNIQUE), `idx_news_published_at`, `idx_news_status`.

### E. `Events` (Rendezvények & Programok)
* **Tábla Neve:** `events`
* **Mezők:**
  - `id`: `UUID` (Primary Key)
  - `title`: `String` (NOT NULL)
  - `slug`: `String` (NOT NULL, UNIQUE, Indexed)
  - `startDate`: `Timestamp` (NOT NULL)
  - `endDate`: `Timestamp` (Optional)
  - `location`: `Relation` (HasOne -> `Libraries`, NOT NULL)
  - `targetAudience`: `Enum` (`'children' | 'teens' | 'adults' | 'seniors' | 'all'`, NOT NULL)
  - `description`: `RichText` (Lexical, NOT NULL)
  - `registrationUrl`: `String` (Optional)
  - `featuredImage`: `Relation` (HasOne -> `Media`, Optional)
  - `_status`: `Enum` (`'draft' | 'published'`, Default: `'draft'`)
* **Indexek:** `idx_events_slug` (UNIQUE), `idx_events_start_date`, `idx_events_location`.

### F. `Pages` (Moduláris Oldalak)
* **Tábla Neve:** `pages`
* **Mezők:**
  - `id`: `UUID` (Primary Key)
  - `title`: `String` (NOT NULL)
  - `slug`: `String` (NOT NULL, UNIQUE, Indexed)
  - `layout`: `Blocks` (Array of UI Blocks: Hero, NewsFeed, EventGrid, Map, Accordion, ContactForm)
  - `_status`: `Enum` (`'draft' | 'published'`, Default: `'draft'`)
* **Indexek:** `idx_pages_slug` (UNIQUE).

---

## 2. Dynamic Blocks Array Structure

```ts
type PageLayoutBlocks = 
  | HeroBlockSpec
  | NewsFeedBlockSpec
  | EventGridBlockSpec
  | LibraryMapBlockSpec
  | AccordionBlockSpec
  | ContactFormBlockSpec
```

---

## 3. Milestone 2A Elfogadási Kritériumai (DoD)

- [ ] A Payload Admin elérhető a `/admin` útvonalon.
- [ ] A felhasználói belépés és az RBAC jogosultságok (Admin/Editor/Author) igazoltan működnek.
- [ ] Új `Library`, `News`, `Event` és `Page` bejegyzés sikeresen létrehozható és szerkeszthető.
- [ ] A Média feltöltés megfelelően továbbítja a fájlokat a MinIO S3 tárolóra.
- [ ] A `Draft` és `Publish` állapotváltások és a Live Preview funkciók teszteltek.
