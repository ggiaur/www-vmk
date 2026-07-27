# Data & URL Migration Strategy (Migrációs és Átirányítási Stratégia)

## 1. Migrációs Alapelvek
Ez a projekt **nem puszta új oldal építése**, hanem egy kritikus **adat- és tartalommigrációs folyamat**. Egyetlen régi látogató, olvasó vagy külső hivatkozás sem maradhat törött linkkel (404).

## 2. Régi → Új URL Megfeleltetési Stratégia

### Oldal & Hír URL Példák
```
[ Régi URL minták ]                                  [ Új URL struktúra (Next.js 15) ]
https://www.vmk.hu/nyari-nyitvatartas-2026      --->  https://www.vmk.hu/hirek/nyari-nyitvatartas-2026
https://www.vmk.hu/budai-uti-tagkonyvtar        --->  https://www.vmk.hu/tagkonyvtarak/budai-ut
https://www.vmk.hu/page/menu/336                --->  https://www.vmk.hu/programarchivum/barokk-ev-2018
https://www.vmk.hu/news/details/1988/preview/1  --->  https://www.vmk.hu/hirek/gondolatok-tarhaza
```

### Média & PDF Átirányítások
```
https://www.vmk.hu/_upload/editor/Alapdokumentumok/Kolcsonzesi_politika_260601.pdf
  ---> 301 Permanent Redirect --->
https://www.vmk.hu/documents/kolcsonzesi-politika.pdf (Vagy MinIO S3 CDN URL)
```

## 3. SEO-Védelmi Redirect Stratégia (301 Permanent Redirect)
* **Next.js `next.config.ts` redirects Map:** Minden ismert régi URL-ről automatikus `301 Permanent Redirect` beállítása az új megfelelőkre.
* **Catch-all Fallback & Search Suggestion:** Ha egy régi URL nem határozható meg 1:1 alapon, a kérés nem 404-re fut, hanem a Meilisearch alapú Intelligens Keresőoldalra irányít át a régi slug kulcsszavaival.
* **Google Search Console & Sitemap:** Új `sitemap.xml` automatikus generálása és benyújtása a keresőmotorok felé az élesítés pillanatában.

## 4. Adatmigrációs Pipeline
1. **Extraction:** Python / Node.js crawler szkript lekaparja a meglévő oldal tartalmát és médiafájljait.
2. **Transformation:** A megszerzett adatokat átalakítja a Payload CMS v3 schema formátumára (HTML -> Lexical RichText / Blocks).
3. **Loading:** Payload Local API-n keresztül szórja be az adatokat a PostgreSQL adatbázisba és a képeket a MinIO-ba.
