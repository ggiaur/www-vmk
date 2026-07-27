# Content Inventory (Tartalomleltár & Becslések)

## 1. Tartalomtípusok & Becsült Mennyiségek

| Tartalom Típusa | Becsült Darabszám | Migrációs Módszer | Megjegyzés / Szabály |
| :--- | :--- | :--- | :--- |
| **Hírek / Cikkek** | 500+ cikk | Automata szkript (Scraper / API export) | Cím, törzsszöveg, kiemelt kép, dátum és kategória transzformáció. |
| **Rendezvények / Események** | 200+ esemény | Automata import + Manuális felülvizsgálat | Dátumok és helyszínek szigorú validációja. |
| **PDF & Dokumentumok** | 1000+ PDF/DOCX | Automata letöltés & MinIO feltöltés | Szigorú metaadat-hozzárendelés (cím, kategória, év). |
| **Statikus Oldalak** | ~150 oldal | Félig-automata / Újraszerkesztés | Átemelés a Payload v3 Block Editor struktúrájába. |
| **Média / Képek** | 5000+ kép | Automata tömeges feltöltés MinIO-ba | Automatikus WebP/AVIF konverzió és átméretezés. |
| **Nyitvatartási Adatok** | 6 helyszín | Manuális struktúrált rögzítés | Globális Payload beállításként struktúrált JSON/Global-ban. |

## 2. Minőségi & Szanálási Elvek
* **Archív Tartalmak Kezelése:** A 2018 előtti elavult programajánlók tiszta programarchívum gyűjteménybe kerülnek.
* **Törött Képek / Média Szűrése:** A hiányzó vagy hibás hivatkozással rendelkező képek pótlása alapértelmezett kategóriaborítókkal.
* **PDF Akadálymentesítés:** A csatolt alapszabályzatokhoz és dokumentumokhoz olvasható címkék és letöltési számlálók rendelése.
