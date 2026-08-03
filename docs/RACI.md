# RACI Mátrix — VMK Website Modernization

Ez a dokumentum azt rögzíti, hogy a projekt jelenlegi, tényleges
felállásában (2026-08-03 állapot szerint) ki felelős (**R**esponsible), ki
elszámoltatható (**A**ccountable), kit kell megkérdezni (**C**onsulted), és
kit kell tájékoztatni (**I**nformed) az egyes döntéstípusoknál.

**Fontos, őszinte kiindulópont:** a projektnek jelenleg nincs többfős
emberi csapata — egy tulajdonos/megrendelő (ggiaur) dolgozik együtt egy AI
kódoló ügynökkel (Claude Code) interaktív munkamenetekben. A lenti mátrix
ezt a tényleges felállást tükrözi, nem egy elképzelt szervezeti ábrát. A
"Könyvtáros Szerkesztő" és "Főszerkesztő" sorok a `docs/PROJECT_SPEC.md`
3. szakaszában meghatározott *jövőbeli, éles üzemi* szerepek — ők a
rendszer leendő végfelhasználói, nem a jelenlegi fejlesztési projekt
résztvevői. Ezt a mátrixot frissíteni kell, amint a projektnek valódi,
megnevezett emberi szerkesztői/üzemeltetői lesznek.

## Fejlesztési döntések (jelenlegi fázis)

| Döntéstípus | Tulajdonos (ggiaur) | AI ügynök (Claude Code) |
|---|---|---|
| Termék-scope, prioritás, roadmap (`PROJECT_STATUS.md`) | **A/R** | C |
| Architektúra-választás (stack, adatmodell) | A | **R**, C |
| Vizuális/pixel-parity elfogadási küszöb | **A** | R |
| Kód írása, tesztek írása, refaktor | I | **A/R** |
| Nem-triviális implementáció megkezdése | **A** (jóváhagyás a `CLAUDE.md` "human gate" szabálya szerint) | R (javaslattevő) |
| Commit / push megosztott állapotba | **A** | R (csak jóváhagyás után) |
| Biztonsági/megfelelőségi kockázat elfogadása | **A** | C, R (feltárás) |
| Fizetési kapu (Stripe/Barion/SimplePay) hitelesítő adatok beszerzése | **A/R** | I (nincs hozzáférése külső fiókokhoz) |
| Valós vmk.hu analitikai/backlink adatokhoz hozzáférés | **A/R** | I (nincs hozzáférése — ld. `RISK_REGISTER.md` R-07) |

## Éles üzemi szerepek (jövőbeli — `PROJECT_SPEC.md` 3. szakasz alapján, még nem betöltve)

| Döntéstípus | Olvasó/Látogató | Könyvtáros Szerkesztő | Admin/Főszerkesztő | Fejlesztő/DevOps |
|---|---|---|---|---|
| Tartalom megtekintése | R | I | I | I |
| Tartalom szerkesztése (blokk-szerkesztő, live preview) | — | **A/R** | C | I |
| Publikálási munkafolyamat (Draft → Approval → Publish) | — | R | **A** | I |
| Felhasználókezelés, jogosultságok | — | — | **A/R** | C |
| CI/CD, Docker stack, infrastruktúra | — | — | I | **A/R** |

## Karbantartási megjegyzés

Amint a projektnek lesz kinevezett könyvtáros szerkesztője vagy
rendszergazdája, ezt a fájlt frissíteni kell valós névvel/szereppel — a
jelenlegi táblázat szándékosan generikus szerepnevet használ ott, ahol nincs
tényleges személy hozzárendelve, a `CLAUDE.md` "ne fabrikálj valószínű
adatot" elve szerint.
