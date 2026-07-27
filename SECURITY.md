# Security Policy & Vulnerability Disclosure

A Vörösmarty Mihály Könyvtár (VMK) biztonsági szabályzata és sérülékenység-bejelentési eljárása.

## 1. Támogatott Verziók

| Verzió | Támogatási Státusz |
| :--- | :--- |
| `v0.1.x` (Foundation) | ✅ Aktív fejlesztés & Biztonsági frissítések |
| Legacy PHP / WP (`vmk-timber`) | ⚠️ Csak olvasható archívum |

---

## 2. Biztonsági Alapelvek & Szabályok

1. **Titkok & Környezeti Változók Kezelése:**
   - Adatbázis jelszók, API kulcsok és `PAYLOAD_SECRET` soha nem kerülhetnek Git verziókövetésbe.
   - Minden secret a `.env` és Docker environment fájlokban tárolandó, melyeket a `.gitignore` kizár.
2. **Adatbázis & RBAC Védelem:**
   - Szigorú szerepkör alapú hozzáférés-kezelés (Admin, Editor, Author).
   - Input sanitization és szigorú TypeScript típusosság (`no explicit any`).
3. **Függőségek Frissítési Szabálya:**
   - Automatikus függőség-ellenőrzés GitHub Actions CI pipeline-ban.
   - Súlyos sérülékenység esetén a függőségek azonnali frissítése.

---

## 3. Sérülékenység Bejelentése

Ha biztonsági rést vagy sérülékenységet találsz a platformon, kérjük, **ne hozz létre nyilvános GitHub Issue-t**.

Kérjük, küldd el a bejelentést közvetlenül a fejlesztő csapatnak:
* **E-mail:** `konyvtar@vmk.hu` (Tárgy: `SECURITY VULNERABILITY REPORT`)
* **Válaszadási idő:** 48 órán belül visszajelzünk, és a javítást a lehető leggyorsabban kiadjuk.
