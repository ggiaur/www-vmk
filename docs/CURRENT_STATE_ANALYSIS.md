# Current State Analysis - vmk.hu (Régi Rendszer Vizsgálata)

## 1. Technikai Elemzés & Architektúra (Legacy)
* **Szolgáltató / Fejlesztő:** NeoSoft Kft. (neosoft.hu).
* **CMS & Technológiai Stack:** Egyedi PHP alapú CMS (Zend Framework / custom PHP elemekkel).
* **Frontend Framework:** Legacy Bootstrap 3.x, jQuery, HTML5shiv & Respond.js (IE8 kompatibilitási szkriptek).
* **Fontok & Stílusok:** Roboto (Google Fonts), monolitikus minifikált CSS (`assets/dist/style.min.a44d63c95cab04f3964b8d86a667393a.css`).
* **Analitika & Cookie Consent:** Google Tag Manager (`G-765H6BS3MG`), FreePrivacyPolicy Cookie Consent modal, reCAPTCHA v2.
* **Integrált Külső Rendszerek:**
  - TextLib / Corvina Online Katalógus (`http://tlwww.vmk.hu/tlwww`)
  - Subdomainek: `gyerek.vmk.hu`, `helyismeret.vmk.hu`, `av.vmk.hu`, `konyvtar.vmk.hu/mke/`
  - Megyei Ellátási Szolgáltató Rendszer: `fejerkszr.hu`

## 2. Jelenlegi URL Struktúra & Minták
* **Főoldali Hírek:** `/nyari-nyitvatartas-2026`, `/20260824_megvaltozott_nyitvatartas_zene_ped`, `/strandkonyvtar` (Nem konzisztens slug képzés: kevert dátum előtagok, aláhúzások és kötőjelek).
* **Paraméterezett & Nevesített Menüpontok:** `/kozponti-konyvtar-1`, `/page/menu/336`, `/news/details/1988/preview/1` (Instabil és SEO-labilis URL-ek).
* **Média & Fájlelérés:** `/_upload/editor/...`, `/_upload/news_pic/600x600/...`, `/_upload/images/banner/...` (Közvetlen webszerver könyvtárstruktúra).
* **Nyelvi Választó:** `/start/index/lang/hu`, `/start/index/lang/en`, `/start/index/lang/de` (Dinamikus átirányítások).

## 3. Identifikált Hibák, Teljesítmény & Akadálymentesítési Problémák
* **Akadálymentesítés (WCAG 2.2 AA Hiányosságok):**
  - A gyengénlátó mód külön URL-re mutató maszk (`/page/blind`), ahelyett hogy a teljes oldal lenne szemantikusan és kontrasztosan felépítve.
  - Számos hivatkozás és gomb hiányos ARIA címkékkel rendelkezik.
  - Billentyűzet fókusz indikátor sok helyen nem látható.
* **Mobil Használhatóság:**
  - Asztali nézetű táblázatok és beágyazott képek kilógnak a mobil kijelzőről.
  - Bootstrap 3-as összeomló menü (hamburgermenü) nehezen kezelhető érintőképernyőn.
* **SEO & Teljesítmény:**
  - Duplikált tartalom a nyelvi paraméterek és a `/page/menu/...` hivatkozások miatt.
  - Optimálatlan képek közvetlenül töltődnek be (nincs WebP/AVIF konverzió, hiányzó responsive `srcset`).
