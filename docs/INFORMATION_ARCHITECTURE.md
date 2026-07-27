# Information Architecture (Részletes Információs Architektúra)

## 1. Szerkezeti Elvek
Az új architektúra nem puszta statikus menüfára, hanem **strukturált entitásokra (`Libraries`, `News`, `Events`, `Staff`, `Documents`, `Services`)** és **felhasználói célokra (User Journeys)** épül.

## 2. Részletes Menüfa & Funkcionális Térkép

```
[ FEJLÉC (Top Bar & Utility Navigation) ]
├── Online Katalógus / Beiratkozás (Kiemelt Corvina/TextLib TLWWW kapcsolat)
├── Quick Search Bar (Meilisearch azonnali kereső)
├── Akadálymentesítés (Magas kontraszt, Betűméret növelés, ARIA fókusz)
└── Nyelvválasztó (HU / EN / DE)

[ FŐ NAVIGÁCIÓ ]
├── 1. Nyitvatartás & Könyvtárak
│   ├── Központi Könyvtár (Felnőtt kölcsönző, Olvasóterem, Kötészet)
│   ├── Részlegek (Gyermekrészleg, Helyismeret, Zenei és Okosterem, Pedagógiai szakkönyvtár)
│   ├── Tagkönyvtárak (Budai úti, Mészöly Géza utcai, Széna téri, Tolnai utcai, Zsolt utcai)
│   └── Ünnepi & Rendkívüli Nyitvatartási Naptár
│
├── 2. Hírek & Események
│   ├── Friss Hírek & Közlemények
│   ├── Eseménykalendárium (Szűrhető korosztály, helyszín és dátum alapján)
│   ├── Foglalkozáskereső (Iskolai és gyermekcsoportos foglalkozások)
│   ├── Pályázatok (Olvasópályázatok, Karácsonyi írópályázat, Családi OlvasásMánia)
│   └── Programarchívum & Képgalériák (2012-től napjainkig)
│
├── 3. A Könyvtár Használata & Szolgáltatások
│   ├── Beiratkozás, Kölcsönzés & Szabályzatok
│   ├── Könyvtárközi Kölcsönzés (Olvasóknak / Könyvtáraknak)
│   ├── Digitális Szolgáltatások (Laptapír, Társasjáték-kölcsönzés, Wi-Fi infók)
│   └── Számítógép- és Internet-használat
│
├── 4. Rólunk & Dokumentumtár
│   ├── Munkatársaink (Strukturált névjegyek, elérhetőségek, beosztások)
│   ├── Alapdokumentumok (SZMSZ, Beszámolók, Adatkezelési tájékoztatók PDF-tára)
│   ├── Könyvtárunk Története
│   ├── Közérdekű Adatok & Álláspályázatok
│   ├── Projektek & NKA Pályázatok
│   └── Támogatók & Partnerkönyvtárak
│
└── 5. Megyei Ellátás (KSZR)
    └── Fejér Megyei Könyvtárellátási Szolgáltató Rendszer (fejerkszr.hu integráció)
```

## 3. SEO, URL & Átirányítási Integráció
Minden menüpont és bejegyzés egyedi, tiszta slug-ot kap (pl. `/tagkonyvtarak/budai-ut`, `/hirek/nyari-nyitvatartas-2026`), míg a régi összevissza URL-ekről a Next.js middleware automatikus 301-es átirányítást végez (`docs/MIGRATION_STRATEGY.md`).
