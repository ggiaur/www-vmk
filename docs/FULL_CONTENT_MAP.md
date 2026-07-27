# Full Content Map (Teljes Tartalom- és URL Feltérképezés)

Minden meglévő vmk.hu URL, tartalomtípus és azok cél-struktúrája a Payload CMS v3 + Next.js 15 architektúrában.

## 1. Navigációs & Intézményi Oldalak

| Régi URL / Minta | Tartalom Típusa | Cél Payload Entitás / Kollekció | Átirányítási Szabály (301) |
| :--- | :--- | :--- | :--- |
| `/` | Főoldal | Globális Főoldal Blokk Struktúra | `/` |
| `/nyitvatartas` | Nyitvatartási mátrix | `OpeningHours` Global / Collection | `/nyitvatartas` |
| `/elerhetosegeink` | Kapcsolat & Térképek | `Libraries` Collection | `/elerhetosegeink` |
| `/kozponti-konyvtar-1` | Intézményi bemutatás | `Libraries` Collection (Central) | `/reszlegek/kozponti-konyvtar` |
| `/felnott-kolcsonzo-reszleg` | Részleg | `Libraries` (Sub-department) | `/reszlegek/felnott-kolcsonzo` |
| `/olvasoterem` | Részleg | `Libraries` (Sub-department) | `/reszlegek/olvasoterem` |
| `/pedagogiai-reszleg` | Részleg | `Libraries` (Sub-department) | `/reszlegek/pedagogia` |
| `/koteszet` | Szolgáltatás | `Services` Collection | `/szolgaltatasok/koteszet` |
| `/budai-uti-tagkonyvtar` | Tagkönyvtár | `Libraries` Collection | `/tagkonyvtarak/budai-ut` |
| `/meszoly-geza-utcai-tagkonyvtar` | Tagkönyvtár | `Libraries` Collection | `/tagkonyvtarak/meszoly-geza` |
| `/szena-teri-tagkonyvtar` | Tagkönyvtár | `Libraries` Collection | `/tagkonyvtarak/szena-ter` |
| `/tolnai-utcai-tagkonyvtar` | Tagkönyvtár | `Libraries` Collection | `/tagkonyvtarak/tolnai-ut` |
| `/zsolt-utcai-tagkonyvtar` | Tagkönyvtár | `Libraries` Collection | `/tagkonyvtarak/zsolt-ut` |

## 2. Hírek, Események & Programarchívum

| Régi URL / Minta | Tartalom Típusa | Cél Payload Entitás / Kollekció | Átirányítási Szabály (301) |
| :--- | :--- | :--- | :--- |
| `/nyari-nyitvatartas-2026` | Hír | `News` Collection | `/hirek/nyari-nyitvatartas-2026` |
| `/20260824_megvaltozott_nyitvatartas_zene_ped` | Hír | `News` Collection | `/hirek/20260824-megvaltozott-nyitvatartas` |
| `/strandkonyvtar` | Hír / Esemény | `News` Collection | `/hirek/strandkonyvtar` |
| `/news/details/1988/preview/1` | Legacy Hír | `News` Collection | `/hirek/gondolatok-tarhaza` |
| `/page/menu/336` | Archív Rendezvény | `Events` Collection (Archived) | `/programarchivum/barokk-ev-2018` |
| `/gallery` | Fotóarchívum | `Galleries` Collection | `/galeria` |

## 3. Szolgáltatások, Szabályzatok & Dokumentumok

| Régi URL / Minta | Tartalom Típusa | Cél Payload Entitás / Kollekció | Átirányítási Szabály (301) |
| :--- | :--- | :--- | :--- |
| `https://www.vmk.hu/munkatarsak` | Munkatársak | `Staff` Collection | `/rolunk/munkatarsak` |
| `/alapdokumentumok` | Dokumentumtár | `Documents` Collection | `/rolunk/alapdokumentumok` |
| `/_upload/editor/Alapdokumentumok/*.pdf` | PDF Dokumentumok | `Media` Collection (MinIO) | `/documents/*.pdf` |
| `/konyvtarkozi-kolcsonzes` | Szolgáltatás | `Services` Collection | `/hasznalat/konyvtarkozi-kolcsonzes` |
| `/foglalkozaskereso` | Interaktív Kereső | `Workshops` / `Services` | `/foglalkozaskereso` |
| `Google Forms URL (Virtuális postaláda)` | Külső Űrlap | `Forms` Global / Payload Form | `/kapcsolat/virtualis-postalada` |
