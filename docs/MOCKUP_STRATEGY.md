# Mockup & Prototyping Strategy (Vizuális Prototípus Stratégia)

A tényleges kódolás előtti UX/UI prototípus sorrend és az egyes kulcsoldalak képviseleti szerepe.

---

## 1. A Vizuális Prototípusok Célja
Biztosítani, hogy az AI fejlesztő ne "ad-hoc oldalkészítésbe" kezdjen, hanem előre egyeztetett, reprezentatív drótvázak és prototípus-specifikációk alapján valósítsa meg a Next.js frontendet.

---

## 2. A Prototípusok Készítési Sorrendje & Szempontjai

### 1. Főoldal (Home Page)
* **Képviseleti Szerep:** A teljes rendszer "kirakata".
* **Tesztelt Komponensek:** Header, TopBar, Mobil Menü, Hero Section, Nyitvatartási Widget, Kiemelt Hírek (NewsCard), Közelgő Rendezvények (EventCard), Tagkönyvtár Választó, Footer.

### 2. Hír Részletező Oldal (News Detail Page)
* **Képviseleti Szerep:** Tipográfia, olvashatóság, Lexical RichText blokkok és médiahszználat.
* **Tesztelt Komponensek:** Breadcrumb, Cikk Fejléc, Kiemelt Kép, Törzsszöveg Blokkok, Csatolt PDF Letöltések (DocumentCard), Kapcsolódó Hírek.

### 3. Esemény Részletező Oldal (Event Detail Page)
* **Képviseleti Szerep:** Dátumok, naptár integráció, regisztráció és helyszíni adatok.
* **Tesztelt Komponensek:** Dátum/Időpont Widget, Helyszín Kártya, Regisztrációs Gomb / Naptárhoz Adás, Korosztály Címkék.

### 4. Tagkönyvtár Adatlap (Library Branch Detail Page)
* **Képviseleti Szerep:** A legfontosabb strukturált entitási felület.
* **Tesztelt Komponensek:** Nyitvatartási táblázat, Elérhetőségek & Térkép, Munkatársak kártyái (StaffCard), Adott tagkönyvtárhoz tartozó hírek és rendezvények.

### 5. Intelligens Keresőoldal (Search & Filter Page)
* **Képviseleti Szerep:** Meilisearch integráció és szűrési UX.
* **Tesztelt Komponensek:** Keresőmező, Kategória/Dátum/Helyszín szűrők, Találati kártya-lista, Lapozó (Pagination).

---

## 3. Protokoll & Jóváhagyási Szabály
A prototípus leírások és drótváz-specifikációk elfogadása után indulhat csak el a CMS és Frontend tényleges React kódolása.
