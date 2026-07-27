# Editorial Workflow & Governance (Szerkesztői Folyamat & Jóváhagyási Mátrix)

A Vörösmarty Mihály Könyvtár (VMK) intézményi szerkesztési, jóváhagyási és publikálási folyamatának szabályzata.

---

## 1. Szerkesztői Szerepkörök & Jogosultságok (RBAC Mátrix)

| Szerepkör | Szerepkör Leírása | Piszkozat Mentés (Draft) | Előnézet (Live Preview) | Jóváhagyás & Publikálás | Felhasználó & Rendszer Kezelés |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Adminisztrátor (Admin)** | Rendszergazda / IT | ✅ | ✅ | ✅ | ✅ (Teljes hozzáférés) |
| **Főszerkesztő (Editor)** | Könyvtári Kommunikációs Vezető | ✅ | ✅ | ✅ (Minden tartalom) | ❌ |
| **Könyvtáros Szerkesztő (Author)** | Tagkönyvtári / Részleg Szerkesztő | ✅ | ✅ | ⚠️ (Saját tagkönyvtárhoz rendelt tartalmak) | ❌ |

---

## 2. A Tartalom Életciklusa (Draft -> Review -> Publish Workflow)

```
+------------------+         +------------------+         +------------------+
|  1. PISZKOZAT    |  ───►   |  2. JÓVÁHAGYÁS   |  ───►   |  3. PUBLIKÁLÁS   |
|     (Draft)      |         |     (Review)     |         |    (Published)   |
|                  |         |                  |         |                  |
| Könyvtáros szer- |         | Főszerkesztő /   |         | Éles megjelenés  |
| keszti a tartal- |         | Admin ellenőrzi  |         | a frontend       |
| mot & élő előné- |         | az élő előnézet- |         | felületen        |
| zetet néz        |         | ben              |         | (Live Site)      |
+------------------+         +------------------+         +------------------+
```

### Lépések Részletezése:
1. **Létrehozás & Piszkozat (`Draft`):**
   - A szerkesztő kitölti a címet, összefoglalót, törzsszöveget és csatolja a borítóképet.
   - Mentés `Draft` állapotban. Az oldal még **nem látható** az olvasók számára.
2. **Élő Előnézet (`Live Preview`):**
   - A szerkesztő vagy főszerkesztő rákattint az "Előnézet" gombra.
   - A Payload CMS élő osztott képernyőn mutatja, hogyan fog kinézni a tartalom mobilon, tableten és asztali kijelzőn.
3. **Jóváhagyás & Publikálás (`Published`):**
   - A főszerkesztő vagy feljogosított könyvtáros rákattint a "Publish" gombra.
   - A Payload webhook / revalidation automatikusan frissíti a Next.js gyorsítótárat.

---

## 3. Emberi Elfogadás (Human Acceptance Checklist)

A CMS szerkesztői felület akkor tekintendő véglegesen elfogadottnak a könyvtárosok által, ha:
- [ ] Egy nem-fejlesztő könyvtáros **10 percen belül** önállóan képes felvinni egy új hírt.
- [ ] A borítókép feltöltésekor a WCAG 2.2 AA alt-szöveg mező egyértelmű.
- [ ] Az élő előnézeti képernyő hiba nélkül betöltődik.
- [ ] Véletlen hibás publikálás visszavonható (`Revert to Draft` / `Version Restore`).
