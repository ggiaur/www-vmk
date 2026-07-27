# User Journeys (Felhasználói Célok & Útvonalak)

A weboldal szerkezete nem puszta hierarchikus menükre, hanem valós felhasználói feladatokra és célokra épül.

---

## 1. Olvasó (Gyors információ & Kölcsönzés)
* **Cél:** Gyorsan megtudni a Budai úti tagkönyvtár mai nyitvatartását, vagy meghosszabbítani a kölcsönzött könyveket.
* **Útvonal:**
  1. Érkezés a főoldalra (Mobil / Desktop).
  2. A főoldali **Nyitvatartási Widget** automatikusan mutatja az aktuális nap nyitvatartását az összes fióknál.
  3. Egy kattintással eléri az **Online Katalógus / Bejelentkezés** gombot a fejlécben a Corvina/TextLib olvasói fiókhoz.

---

## 2. Szülő / Gyermek (Események & Foglalkozáskereső)
* **Cél:** Hétvégi kézműves vagy gyermekprogramot keresni a 6-10 éves korosztály számára.
* **Útvonal:**
  1. Érkezés -> `Hírek & Események` vagy `Foglalkozáskereső` menüpont.
  2. Szűrés: **Célcsoport: Gyerekek** | **Tagkönyvtár: Gyermekrészleg / Széna tér**.
  3. Rendezvény részleteinek megtekintése, naptárhoz adás (iCal / Google Calendar), vagy részvételi regisztráció.

---

## 3. Kutató / Helytörténész (Dokumentumtár & Helyismeret)
* **Cél:** Székesfehérvár helytörténeti kiadványainak és a könyvtár SZMSZ/alapdokumentumainak elérése.
* **Útvonal:**
  1. Érkezés -> `Részlegek -> Helyismereti csoport` vagy `Rólunk -> Alapdokumentumok`.
  2. Kereső használata (Meilisearch azonnali szűrés címkére és évszámra).
  3. Visszakereshető, akadálymentesített PDF dokumentum letöltése vagy megtekintése beépített PDF-nézőben.

---

## 4. Akadálymentes Használó (Látássérült / Billentyűzettel navigáló)
* **Cél:** Az oldal tartalmának és híreinek felolvasása képernyőolvasóval vagy navigálás billentyűzet-fókusszal.
* **Útvonal:**
  1. `Tab` gomb megnyomásakor megjelenik a "Ugrás a főtartalomhoz" (Skip to Content) akadálymentes gomb.
  2. Nincs szükség külön elszigetelt aloldalra (`/page/blind`), a teljes felület magas kontrasztú, dinamikusan állítható betűméretű és ARIA-címkézett.

---

## 5. Könyvtáros Szerkesztő (Tartalomkezelő Munkamenet)
* **Cél:** Új nyári nyitvatartási hír és borítókép feltöltése minél egyszerűbben.
* **Útvonal:**
  1. Belépés a Payload CMS v3 biztonságos admin felületére (`/admin`).
  2. Belépés a `News` gyökérbe -> "Create New".
  3. Cím, borítókép (húzással a MinIO médiatárba), törzsszöveg blokkok (Lexical RichText Editor) kitöltése.
  4. **Live Preview** (Élő előnézet) gombra kattintva megtekintheti a valós Next.js frontend megjelenést.
  5. Mentés `Draft` állapotba -> Átnézés után egy kattintással `Publish`.
