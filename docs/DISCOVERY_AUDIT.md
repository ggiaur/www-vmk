# Discovery Audit (Discovery Dokumentumok Auditálása)

## 1. Az Audit Célja
A korábban elkészült Discovery dokumentáció szigorú szakmai auditálása a meglévő `www.vmk.hu` éles weboldal alapján. Az alábbiakban feltárjuk az igazolt tényeket, az esetleges téves feltételezéseket, hiányzó funkciókat és az elengedhetetlen további vizsgálatokat.

---

## 2. Igazolt Tények vs. Tételes Ellenőrzés

| Állítás / Terület | Státusz | Bizonyíték / Megállapítás |
| :--- | :--- | :--- |
| **CMS & Technológiai Stack** | ✅ Igazolt | NeoSoft Kft. által készített egyedi PHP rendszer, Zend Framework elemekkel, Bootstrap 3, jQuery, HTML5shiv, GTM. |
| **Integrált Rendszerek** | ✅ Igazolt | Corvina / TextLib (TLWWW) online katalógus, külső aldomének (`gyerek`, `helyismeret`, `av`, `fejerkszr.hu`, `mke`). |
| **Külső Űrlap Integráció** | ⚠️ Pontosított | A "Virtuális postaláda" nem beépített CMS modul, hanem külső Google Forms hivatkozás (`docs.google.com/forms/...`). |
| **SEO & URL Szanálás** | ✅ Igazolt | Inkonzisztens slugok (`/page/menu/336`, `/news/details/1988/preview/1`, kevert aláhúzások és dátum-előtagok). |
| **Média és PDF Struktúra** | ✅ Igazolt | Közvetlen webszerver elérés (`/_upload/editor/Alapdokumentumok/...`, `/_upload/news_pic/...`). |

---

## 3. Hiányzó Funkciók & Tartalomtípusok (Feltárt Hiányok)

1. **Hiányzó Tartalomtípusok:**
   - **Munkatársak Adatbázisa (`/munkatarsak`):** Nem statikus szöveg, hanem névvel, beosztással, tagkönyvtárral, e-maillel és telefonszámmal rendelkező strukturált entitás.
   - **Foglalkozáskereső (`/foglalkozaskereso`):** Iskolai és gyermekcsoportos foglalkozások szűrhető adatbázisa.
   - **Partnerkönyvtárak & Támogatók (`/tamogatok-2022`, `/partnerkonyvtarunk`):** Logo, név, leírás és külső hivatkozási kapcsolatok.
   - **Karácsonyi / Nyári Pályázatok & Olvasópályázatok (`/csaladi-olvasasmania-2026`, `/karacsonyi-iropalyazat-2025-irasok`):** Pályázati kiírások és beérkezett írások gyűjteménye.

2. **Hiányzó Felhasználói & Szerkesztői Folyamatok:**
   - **Olvasói Beiratkozás & Előjegyzés:** Integráció az online katalógushoz (TLWWW) és a regisztrációs laphoz.
   - **Ünnepi & Rendkívüli Nyitvatartási Rendszer:** A könyvtárak nyitvatartása dinamikusan változik a nyári zárvatartások és ünnepek alatt (pl. nyári strandkönyvtár, összevont kölcsönzési limitek).
   - **Könyvtáros Munkamenet:** Többlépcsős jóváhagyás (Draft -> Review -> Publish) és Live Preview hiányzott a korábbi elemzésből.

---

## 4. Szükséges További Vizsgálatok (Action Items)
* [ ] **TLWWW / Corvina Integráció:** Annak tisztázása, hogy az új Next.js felületről közvetlen API/OpenURL vagy iframe/link alapú keresés történik-e a katalógusba.
* [ ] **Google Forms Kiváltása:** A "Virtuális postaláda" beépített, biztonságos Payload CMS űrlap-kezelővel (Payload Form Builder / custom action) történő kiváltása.
* [ ] **Szerkezeti Adatmodellezés:** A "Page" központúság elhagyása és a strukturált entitás-alapú gyűjtemények (`Collections`) elsődlegessége.
