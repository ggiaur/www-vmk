# Admin Fejlesztési Terv — Élő Feladatkövető

**Branch:** `feature/admin-improvements`  
**Cél:** A Payload CMS v3 admin felület teljes kialakítása — navigáció, Globals, slug auto-generálás, Custom Dashboard.  
**Folytathatóság:** Ez a dokumentum mindig az aktuális állapotot tükrözi. Ha valaki új fejlesztőként veszi át, innen tudja, hol tartunk.

---

## Státusz-jelölések
- `[ ]` — elvégzendő
- `[~]` — folyamatban
- `[x]` — kész (commitálva)

---

## 1. FELADATLISTA

### 1A. Admin navigáció rendezése — `admin.group` minden collection-ben
> Commit: `882f1d6`

- [x] `News.ts` — `'Tartalom'`
- [x] `Events.ts` — `'Tartalom'`
- [x] `Users.ts` — `'Rendszer'`
- [x] `Bookings.ts` — `'Foglalások és tranzakciók'`
- [x] `ContactMessages.ts` — `'Foglalások és tranzakciók'`
- [x] `DonationPledges.ts` — `'Foglalások és tranzakciók'`
- [x] `NewsletterSubscribers.ts` — `'Foglalások és tranzakciók'`
- [x] `Registrations.ts` — `'Foglalások és tranzakciók'`
- [x] `Libraries.ts` — `'Könyvtárak'`
- [x] `OpeningHours.ts` — `'Könyvtárak'`
- [x] `Rooms.ts` — `'Könyvtárak'`
- [x] `Staff.ts` — `'Munkatársak & Dokumentumok'` *(javítva: volt 'Könyvtárak')*
- [x] `Documents.ts` — `'Munkatársak & Dokumentumok'` *(javítva: volt 'Tartalom')*
- [x] `Services.ts` — `'Szolgáltatások & Bolt'` *(javítva: volt 'Tartalom')*
- [x] `Partners.ts` — `'Szolgáltatások & Bolt'` *(javítva: volt 'Könyvtárak')*
- [x] `Products.ts` — `'Szolgáltatások & Bolt'` *(javítva: volt 'Foglalások és tranzakciók')*
- [x] `Galleries.ts` — `'Tartalom'`
- [x] `Pages.ts` — `'Tartalom'`
- [x] `Media.ts` — `'Médiatár'` *(javítva: volt 'Rendszer')*

**Végső admin navigáció-struktúra:**
```
📚 Könyvtárak          → Libraries, OpeningHours, Rooms
📝 Tartalom            → News, Events, Pages, Galleries
👥 Munkatársak & Dok.  → Staff, Documents
🛒 Szolgáltatások      → Services, Products, Partners
📋 Foglalások          → Bookings, Registrations, ContactMessages, DonationPledges, NewsletterSubscribers
🖼️  Médiatár           → Media
⚙️  Rendszer           → Users
(alján) Globals        → HeaderSettings, FooterSettings, SiteMetadata, OpeningHoursGlobal
```

### 1B. Slug auto-generálás (`beforeChange` hook)
> Commit: `8e49953`

- [x] `src/lib/slugify.ts` — segédfüggvény (`generateSlug`) — magyar ékezetek kezelése
- [x] `News.ts` — `beforeChange` hook hozzáadva
- [x] `Events.ts` — `beforeChange` hook hozzáadva
- [x] `Pages.ts` — `beforeChange` hook hozzáadva (többszintű slug átírható)
- [x] `Services.ts` — `beforeChange` hook hozzáadva

### 1C. Globals implementálása
> Commit: `8f1a5a5`

- [x] `src/globals/HeaderSettings.ts` — TopBar telefon/email, OPAC URL, navigációs menüpontok
- [x] `src/globals/FooterSettings.ts` — 3 oszlopos lábléc, social URL-ek, jogi sáv
- [x] `src/globals/SiteMetadata.ts` — siteName, OG kép, canonical URL, GTM/GA4, noindex
- [x] `src/globals/OpeningHoursGlobal.ts` — ünnepi zárások, banner üzenet
- [x] `src/payload.config.ts` — globals[] tömb regisztrálva

### 1D. Custom Admin Dashboard
> Commit: `aeead7f`

- [x] `src/components/admin/Dashboard.tsx` — statisztika kártyák + gyors-hozzáférés panel
- [x] `payload.config.ts` — `admin.components.views.dashboard` regisztrálva

---

## 2. COMMIT-NAPLÓ

| Commit hash | Leírás |
|---|---|
| `882f1d6` | feat(admin): admin navigáció logikus csoportosítása — 6 collection javítva |
| `8e49953` | feat(admin): slug auto-generálás beforeChange hook-okkal (News, Events, Pages, Services) |
| `8f1a5a5` | feat(admin): 4 Payload Globals implementálva és regisztrálva |
| `aeead7f` | feat(admin): custom admin dashboard — statisztika kártyák és gyors-hozzáférési panel |

---

## 3. ELVÉGZETT — A BRANCH MERGE-ELHETŐ

Az összes feladat kész. A branch `feature/admin-improvements` → `main` merge előtt:

### PR Ellenőrzőlista
- [x] `npm run type-check` — 0 hiba
- [x] `npm run test:unit` — 33/33 OK
- [ ] Admin `/admin` URL betöltődik (manuális ellenőrzés futó stack-en)
- [ ] Minden collection látható a megfelelő csoportban (manuális ellenőrzés)
- [ ] Slug automatikusan generálódik új hír/esemény létrehozásakor (manuális ellenőrzés)
- [ ] Globals megjelennek az admin navigációban (manuális ellenőrzés)
- [ ] Dashboard statisztikák betöltődnek (manuális ellenőrzés)

### Merge parancs (ha manuális ellenőrzés OK):
```bash
git checkout main
git merge --no-ff feature/admin-improvements -m "feat(admin): admin felület teljes kialakítása (navigáció, globals, slugify, dashboard)"
```

---

## 4. FEJLESZTŐI FOLYTATÁSI ÚTMUTATÓ

Ha félbeszakadt a munka:

1. `git checkout feature/admin-improvements`
2. Olvasd el ezt a dokumentumot — keress `[~]` (folyamatban) jelölésű tételeket
3. Ha nincs `[~]`, az első `[ ]` feladatot vedd fel
4. `npm run type-check` — mindig ellenőrizd az aktuális állapotot
5. Commit-olj minden logikai egység után

### Esetleges jövőbeli fejlesztések (nem kritikus, nem blokkoló)

- [ ] `Galleries.ts`, `Products.ts`, `Rooms.ts` slug auto-generálás (ha szükséges)
- [ ] E-mail értesítések `ContactMessages` és `Bookings` beérkezésekor (SMTP konfig szükséges)
- [ ] `Dashboard.tsx` — „Legutóbb módosított tartalmak" szekció
- [ ] Frontend: `HeaderSettings` és `FooterSettings` Globals bekötése a `Header.tsx` és `Footer.tsx` komponensekbe (jelenleg hardcoded adatok)
- [ ] Frontend: `SiteMetadata` Global bekötése a `layout.tsx` `generateMetadata` funkciójába
- [ ] Frontend: `OpeningHoursGlobal.bannerMessage` megjelenítése site-wide bannerként
