# Page Specifications & CMS Mapping (Oldaltípus Specifikációk)

A VMK alkalmazás összes oldaltípusának részletes adatspecifikációja, blokk-sorrendje, SEO és strukturált adat elvárásai.

---

## 1. Oldaltípus Specifikációk

### 1. Főoldal (Home Page)
* **Cél:** Áttekintés, nyitvatartás, beiratkozás, friss hírek és rendezvények.
* **CMS Adatforrások:** `Globals (Header, OpeningHoursSettings)`, `News (latest 4)`, `Events (upcoming 3)`, `Libraries`.
* **Blokkok Sorrendje:** `HeroBlock` -> `OpeningHoursWidgetBlock` -> `NewsFeedBlock` -> `EventGridBlock` -> `ServicesBlock` -> `LibraryMapBlock`.
* **SEO Metaadatok:** Title: "Vörösmarty Mihály Könyvtár - Székesfehérvár", Description: "Székesfehérvár és Fejér megye legnagyobb könyvtára."
* **Strukturált Adatok (JSON-LD):** `Library`, `EducationalOrganization`.

### 2. Hírek Archívum & Részletező (News Listing & Detail)
* **Cél:** Könyvtári hírek és közlemények böngészése és olvasása.
* **CMS Adatforrások:** `News` collection (pagination, filter by category/branch).
* **Blokkok Sorrendje (Detail):** `Breadcrumb` -> `NewsHeader` -> `FeaturedImage` -> `LexicalRichText` -> `DocumentListBlock` -> `RelatedNewsBlock`.
* **SEO Metaadatok:** Dynamic Title & OG Image a hír adataiból.
* **Strukturált Adatok (JSON-LD):** `NewsArticle`.

### 3. Események Archívum & Részletező (Events Listing & Detail)
* **Cél:** Rendezvények, kiállítások, olvasóklubok és könyvbemutatók naptára.
* **CMS Adatforrások:** `Events` collection (filter by date, age group, branch).
* **Blokkok Sorrendje (Detail):** `Breadcrumb` -> `EventHeader` -> `EventInfoCard` -> `RichText` -> `RegistrationBlock` -> `RelatedEventsBlock`.
* **SEO Metaadatok:** Dynamic Event Title, Date, Location.
* **Strukturált Adatok (JSON-LD):** `Event`.

### 4. Tagkönyvtár Adatlap (Library Detail)
* **Cél:** Egy adott tagkönyvtár elérhetőségei, nyitvatartása és munkatársai.
* **CMS Adatforrások:** `Libraries` collection (relation to `Staff`, `OpeningHours`, `News`, `Events`).
* **Blokkok Sorrendje:** `LibraryHero` -> `OpeningHoursTableBlock` -> `ContactMapBlock` -> `StaffGridBlock` -> `LibraryNewsBlock`.
* **SEO Metaadatok:** Title: "[Tagkönyvtár Neve] - Vörösmarty Mihály Könyvtár".
* **Strukturált Adatok (JSON-LD):** `PublicLibrary`, `LocalBusiness`.

### 5. Dokumentumtár & Szolgáltatások (Documents & Services)
* **Cél:** SZMSZ, beszámolók, szabályzatok és szolgáltatások elérése.
* **CMS Adatforrások:** `Documents`, `Services` collections.
* **Blokkok Sorrendje:** `PageHeader` -> `DocumentFilterBlock` -> `DocumentGridBlock`.
* **Strukturált Adatok (JSON-LD):** `DigitalDocument`.

### 6. Intelligens Keresőoldal (Search Results)
* **Cél:** Meilisearch azonnali keresési találatok megjelenítése.
* **CMS Adatforrások:** Meilisearch Index (News, Events, Documents, Libraries).
* **Blokkok Sorrendje:** `SearchHeader` -> `FilterSidebar` -> `SearchResultsGrid` -> `Pagination`.

---

## 2. Komponens Használati Mátrix

| Oldaltípus | Hero | NewsCard | EventCard | LibraryCard | StaffCard | DocumentCard | OpeningHours |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Home** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **News Listing/Detail** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Event Listing/Detail**| ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Library Detail** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| **Documents Page** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Search Page** | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |

---

## 3. CMS Block & Payload Collection Megfeleltetés

* `HeroBlock` <---> `Pages.layout` / `Globals`
* `NewsFeedBlock` <---> `News` collection (`publishedAt` DESC)
* `EventGridBlock` <---> `Events` collection (`eventDate` ASC)
* `OpeningHoursWidgetBlock` <---> `OpeningHoursSettings` global & `Libraries`
* `StaffGridBlock` <---> `Staff` collection (`department` relation)
* `DocumentListBlock` <---> `Documents` collection (`category` filter)

---

## 4. Fejlesztési Prioritási Sorrend

1. **Adatbázis Schema & Payload v3 Init** (Collections, Globals, Roles).
2. **Core Layout & Shell Components** (Header, Footer, Navigation, Accessibility Bar).
3. **Atomi UI & Kártya Komponensek** (NewsCard, EventCard, LibraryCard, DocumentCard).
4. **Főoldal & Tagkönyvtár Adatlapok** (Integrált nézetek).
5. **Hírek, Események & Dokumentumtár** (Listázó és részletező nézetek).
6. **Meilisearch Kereső Integráció & 301 Redirect Middleware**.
7. **Playwright E2E & WCAG 2.2 AA Audits**.
