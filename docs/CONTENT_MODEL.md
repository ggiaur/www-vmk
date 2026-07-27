# Payload CMS v3 Content Model (Strukturált Entitások)

A könyvtári rendszernél **nem a generikus "Page" a központi elem**, hanem a szigorúan strukturált entitás-gyűjtemények (`Collections`). A frontend a relációkból és gyűjteményekből építi fel a dinamikus felületeket.

## 1. Core Collections (Gyűjtemények)

### A. `Libraries` (Könyvtárak & Részlegek)
- **Mezők:** `name`, `slug`, `type` (Central | Branch | SubDepartment), `address`, `geolocation` (lat/lng), `phone`, `email`, `openingHours` (reláció), `staff` (reláció), `featuredImage`, `descriptionBlocks` (Blocks), `services` (reláció).

### B. `News` (Hírek & Közlemények)
- **Mezők:** `title`, `slug`, `publishedAt`, `author` (reláció), `featuredImage`, `summary`, `content` (Lexical RichText Blocks), `category` (Hír, Közlemény, Pályázat), `relatedLibrary` (reláció).

### C. `Events` (Rendezvények & Események)
- **Mezők:** `title`, `slug`, `eventDate` (start/end), `location` (reláció -> `Libraries`), `targetAudience` (Gyerek, Kamasz, Felnőtt, Szenior), `featuredImage`, `description`, `registrationUrl`, `isArchived`.

### D. `Staff` (Munkatársak)
- **Mezők:** `name`, `position`, `department` (reláció -> `Libraries`), `email`, `phone`, `avatar`, `order`.

### E. `Documents` (Dokumentumtár)
- **Mezők:** `title`, `file` (reláció -> `Media`), `category` (SZMSZ, Beszámoló, Pályázat, Űrlap), `year`, `downloadCount`.

### F. `Services` (Szolgáltatások)
- **Mezők:** `title`, `slug`, `shortDescription`, `pricingTable`, `rulesPdf` (reláció), `icon`.

### G. `Pages` (Hagyományos/Moduláris Oldalak)
- **Mezők:** `title`, `slug`, `layout` (Dynamic Blocks: Hero, Cards, Accordion, ContactForm, DynamicNewsFeed, DynamicEventGrid).

### H. `Media` (Médiatár / MinIO)
- **Mezők:** `file`, `altText`, `caption`, `mimeType`, `focalPoint`.

---

## 2. Globals (Könyvtári Globális Beállítások)

* **`OpeningHoursSettings`:** Központi és ünnepi nyitvatartások, rendkívüli zárvatartások naptára.
* **`NavigationSettings`:** Fejléc és lábléc strukturált menüfája, katalógus linkek.
* **`SiteSettings`:** Intézményi elérhetőségek, adatvédelmi dokumentumok, social media linkek.

---

## 3. Dynamic Blocks (Blokk Építők)

* `HeroBlock`: Kiemelt banner képpel, címmel és CTA gombbal.
* `NewsFeedBlock`: Szűrhető hírfolyam modul.
* `EventGridBlock`: Eseménykalendárium és kártya-rács.
* `LibraryMapBlock`: Interaktív térkép tagkönyvtárakkal.
* `AccordionBlock`: Gyakran Ismételt Kérdések (FAQ) és kinyitható információk.
* `DocumentListBlock`: Dokumentumok listája kategóriák szerint.
