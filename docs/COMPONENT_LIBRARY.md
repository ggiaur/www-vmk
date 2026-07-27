# Component Strategy & Library

## 1. Component First Methodology
Nem oldalakat, hanem univerzálisan kombinálható atomi és összetett komponenseket írunk.

## 2. Required Component Inventory
* **Navigation & Shell:** Header, Footer, NavigationMenu, Breadcrumb, Sidebar, MobileDrawer.
* **Hero & Banners:** HeroSection, AnnouncementBanner, PageHeader.
* **Content Cards:** NewsCard, EventCard, DocumentCard, BranchCard.
* **Library Specific:** OpeningHoursWidget, FastCatalogSearch, EventCalendar, FAQAccordion, BranchMap.
* **Media & Layout:** ImageGallery, PDFViewerWidget, GridContainer, SectionWrapper.
* **UI Controls:** Button, Input, Select, Checkbox, Dialog, Toast, Tabs.

## 3. Implementation Rules
* Minden komponens szigorúan típusos TypeScript interfészekkel rendelkezik (`props`).
* Minden UI elem WCAG 2.2 AA kompatibilis billentyűzet fókusszal és ARIA attributumokkal.
