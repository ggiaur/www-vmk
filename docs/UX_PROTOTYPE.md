# UX Prototype & Interaction Specification (UX Prototípus és Interakciós Terv)

A Vörösmarty Mihály Könyvtár (VMK) új digitális platformjának vizuális és interakciós terve. Ez a dokumentum az **emberi jóváhagyást (vezetőség, marketing, könyvtárosok)** készíti elő kódolás nélkül.

---

## 1. UX Célok & Érintetti Szempontok

* **Olvasói & Látogatói Célok:** Max. 2 kattintással elérni a nyitvatartást, a könyvkeresést/beiratkozást és az aktuális programokat.
* **Könyvtáros Szerkesztői Célok:** Letisztult blokk-alapú szerkesztés, hogy 15 percen belül felvihető legyen egy új hír vagy esemény élő előnézettel (`Live Preview`).
* **Intézményi & Kommunikációs Célok:** Modern, akadálymentes, bizalmat sugárzó közösségi és kulturális arculat.

---

## 2. Főoldal Vizuális & Interakciós Prototípus (Home Page Layout)

```
+-----------------------------------------------------------------------------------+
| TOP BAR: Gyors infók | Tel: +36 22 340 699 | Katalógus Belépés | A11y | HU EN DE |
+-----------------------------------------------------------------------------------+
| HEADER: [ Logo: VMK ]          FŐ NAVIGÁCIÓ MENŰ          [ Q Keresés Input ]     |
+-----------------------------------------------------------------------------------+
| HERO SECTION:                                                                     |
| "A tudás és közösség otthona Székesfehérváron"                                    |
| [ Olvasói Beiratkozás ]  [ Online Katalógus ]                                     |
+-----------------------------------------------------------------------------------+
| MAI NYITVATARTÁS & GYORS KERESŐ WIDGET (Dinamikus kártya-sor 6 tagkönyvtárral)    |
+-----------------------------------------------------------------------------------+
| KIEMELT HÍREK (Grid: 1 Főhír + 3 Kisebb NewsCard kártya)                          |
+-----------------------------------------------------------------------------------+
| KÖZELGŐ RENDEZVÉNYEK (EventCard sor dátum-jelvénnyel & szűrőkkel)                |
+-----------------------------------------------------------------------------------+
| SZOLGÁLTATÁSAINK (Kártyák: Társasjáték, Laptapír, Kötészet, Könyvtárközi)         |
+-----------------------------------------------------------------------------------+
| FOOTER: Nyitvatartási Összegző | Elérhetőségek | Adatvédelem | Social Links       |
+-----------------------------------------------------------------------------------+
```

### Elemek Részletezése:
1. **Header & TopBar:** Intézményi kék (`#0F4C81`), mindig látható beiratkozási CTA és gyorskereső.
2. **Hero Section:** Nagy tipográfia, meleg könyvtári tónusú háttérkép, tiszta értékajánlat.
3. **Nyitvatartás Widget:** Automatikusan a hét aktuális napjának nyitvatartását mutatja (Zöld badge = Nyitva, Piros badge = Zárva).
4. **Hírek & Események:** Magas kontrasztú kártyák kategória címkékkel. Mobilon vízszintesen lapozható swiper/carousel.

---

## 3. Hír Részletező Oldal Specifikáció (News Detail)

* **Cím & Metaadatok:** H1 cím, publikálás dátuma, kategória badge, becsült olvasási idő.
* **Média:** Kiemelt borítókép reszponzív méretezéssel és alt szöveggel.
* **Törzsszöveg (Lexical RichText):** 18px sorközös törzsszöveg, kiemelt idézetek, beágyazott PDF letöltési kártyák (`DocumentCard`).
* **Interakciók:** Megosztási gombok (Facebook, E-mail, Nyomtatási nézet), kapcsolódó 3 friss hír.

---

## 4. Esemény Részletező Oldal Specifikáció (Event Detail)

* **Esemény Fejléc:** Dátum-jelvény (Hónap/Nap), Rendezvény címe, Szervező tagkönyvtár.
* **Info Kártya:** Pontos időpont (Kezdés/Befejezés), Helyszín (térkép hivatkozás), Célcsoport (Gyerek/Felnőtt).
* **Akciók:** `[ Naptárhoz adás (.ics / Google Calendar) ]` és `[ Regisztráció az eseményre ]` gombok.

---

## 5. Tagkönyvtár Adatlap Specifikáció (Library Detail)

* **Bemutatkozás & Kép:** Borítókép az épületről, leírás, megközelíthetőség.
* **Nyitvatartási Táblázat:** Heti bontású teljes nyitvatartási mátrix kiemelve az aktuális napot.
* **Kapcsolat & Térkép:** Cím, telefonszám, e-mail, interakcióba lépő OpenStreetMap / Google Maps modul.
* **Munkatársak & Szolgáltatások:** Adott tagkönyvtárban dolgozó munkatársak kártyái (`StaffCard`) és elérhető szolgáltatásaik.

---

## 6. Intelligens Keresési Oldal Specifikáció (Search & Filter)

* **Keresősáv:** Meilisearch gépelés közbeni azonnali találat-frissítéssel.
* **Szűrőpanel:** Típus szerint (Hír, Esemény, Dokumentum, Tagkönyvtár), Dátum intervallum, Tagkönyvtár helyszín.
* **Találati Lista:** Egységes kártyaelrendezés kiemelt keresési kulcsszavakkal.

---

## 7. Mobil UX & Interakciós Szabályok

* **Hamburger Menü:** Teljes képernyős, könnyen érinthető navigációs fiók (min. `48x48px` touch target).
* **Sticky Elements:** A fejléc és a katalógus gyorsgomb mobilon görgetéskor felül rögzül.
* **Interaktív Kártyák:** Kézreálló érintési zónák mobilkijelzőn kilógó elemek nélkül.

---

## 8. Accessibility UX (WCAG 2.2 AA)

* **Focus States:** Kontrasztos fókuszgyűrű minden billentyűzettel elérhető elemen (`ring-2 ring-primary`).
* **Screen Reader Flow:** Szemantikus landmark-ok (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`).
* **Skip Link:** Az első Tab megnyomásakor megjelenő "Ugrás a főtartalomhoz" hivatkozás.
* **Reduced Motion:** Animációk és elmozdulások kikapcsolása `prefers-reduced-motion` esetén.
