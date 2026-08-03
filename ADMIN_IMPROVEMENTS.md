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
> Érintett fájlok: `src/collections/*.ts` (~15 fájl)  
> Hatás: Az admin oldalsávja logikusan csoportosítva jelenik meg.

- [x] `News.ts` — már kész: csoport = `'Tartalom'`
- [x] `Events.ts` — már kész: csoport = `'Tartalom'`
- [x] `Users.ts` — már kész: csoport = `'Rendszer'`
- [x] `Bookings.ts` — már kész: csoport = `'Foglalások és tranzakciók'`
- [x] `ContactMessages.ts` — már kész: csoport = `'Foglalások és tranzakciók'`
- [ ] `Libraries.ts` — hiányzik: célcsoport = `'Könyvtárak & Helyszínek'`
- [ ] `OpeningHours.ts` — hiányzik: célcsoport = `'Könyvtárak & Helyszínek'`
- [ ] `Rooms.ts` — hiányzik: célcsoport = `'Könyvtárak & Helyszínek'`
- [ ] `Staff.ts` — hiányzik: célcsoport = `'Munkatársak & Dokumentumok'`
- [ ] `Documents.ts` — hiányzik: célcsoport = `'Munkatársak & Dokumentumok'`
- [ ] `Services.ts` — hiányzik: célcsoport = `'Szolgáltatások & Bolt'`
- [ ] `Products.ts` — hiányzik: célcsoport = `'Szolgáltatások & Bolt'`
- [ ] `Partners.ts` — hiányzik: célcsoport = `'Szolgáltatások & Bolt'`
- [ ] `Galleries.ts` — hiányzik: célcsoport = `'Tartalom'`
- [ ] `Pages.ts` — hiányzik: célcsoport = `'Tartalom'`
- [ ] `Media.ts` — hiányzik: célcsoport = `'Médiatár'`
- [ ] `DonationPledges.ts` — hiányzik: célcsoport = `'Foglalások és tranzakciók'`
- [ ] `NewsletterSubscribers.ts` — hiányzik: célcsoport = `'Foglalások és tranzakciók'`
- [ ] `Registrations.ts` — hiányzik: célcsoport = `'Foglalások és tranzakciók'`

### 1B. Slug auto-generálás (`beforeChange` hook)
> Érintett fájlok: `src/collections/News.ts`, `src/collections/Events.ts`, `src/collections/Pages.ts`, `src/collections/Services.ts`  
> Hatás: A szerkesztőnek nem kell manuálisan kitölteni a slug mezőt — a cím alapján automatikusan generálódik (ékezet-mentesítve, kisbetűs, kötőjeles).

- [ ] `src/lib/slugify.ts` — segédfüggvény létrehozása
- [ ] `News.ts` — `beforeChange` hook hozzáadása
- [ ] `Events.ts` — `beforeChange` hook hozzáadása
- [ ] `Pages.ts` — `beforeChange` hook hozzáadása
- [ ] `Services.ts` — `beforeChange` hook hozzáadása

### 1C. Globals implementálása
> Érintett fájlok: `src/globals/*.ts` (új mappa), `src/payload.config.ts`  
> Hatás: A könyvtárosok az admin felületen szerkeszthetik a fejlécet, láblécet és a SEO adatokat.

- [ ] `src/globals/HeaderSettings.ts` létrehozása
- [ ] `src/globals/FooterSettings.ts` létrehozása
- [ ] `src/globals/SiteMetadata.ts` létrehozása
- [ ] `src/globals/OpeningHoursGlobal.ts` létrehozása
- [ ] `src/payload.config.ts` — globals regisztrálása

### 1D. Custom Admin Dashboard
> Érintett fájlok: `src/components/admin/Dashboard.tsx`, `src/payload.config.ts`  
> Hatás: Az admin főoldala statisztikákat mutat (hírek száma, foglalások, legutóbbi üzenetek).

- [ ] `src/components/admin/Dashboard.tsx` — React Server Component
- [ ] `payload.config.ts` — `admin.components.views.Dashboard` regisztráció

---

## 2. IMPLEMENTÁLÁS SORRENDJE

```
1A (admin.group) → 1B (slugify) → 1C (globals) → 1D (dashboard)
```

Minden lépés után: `npm run type-check` → commit → push.

---

## 3. COMMIT-NAPLÓ (folyamatosan frissítve)

| Commit hash | Leírás |
|---|---|
| *(üres — fejlesztés elkezdődik)* | — |

---

## 4. FEJLESZTŐI FOLYTATÁSI ÚTMUTATÓ

Ha félbeszakadt a munka:

1. `git checkout feature/admin-improvements`
2. Olvasd el ezt a dokumentumot — keress `[~]` (folyamatban) jelölésű tételeket
3. Ha nincs `[~]`, az első `[ ]` feladatot vedd fel
4. `npm run type-check` — mindig ellenőrizd az aktuális állapotot
5. Commit-olj minden logikai egység után

---

## 5. TESZTELÉSI ELLENŐRZŐLISTA (PR előtt)

- [ ] `npm run type-check` — 0 hiba
- [ ] `npm run test:unit` — 0 elbukott teszt
- [ ] Admin `/admin` URL betöltődik
- [ ] Minden collection látható a megfelelő csoportban
- [ ] Slug automatikusan generálódik új hír/esemény létrehozásakor
- [ ] Globals megjelennek az admin navigációban
