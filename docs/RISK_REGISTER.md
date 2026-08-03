# Kockázati Napló (Risk Register) — VMK Website Modernization

Minden tétel ellenőrzött, a repóban ma (2026-08-03) ténylegesen
megfigyelt állapotot tükrözi — nincs kitalált/becsült adat. A
"Forrás" oszlop megmutatja, hol/hogyan lett ellenőrizve.

Súlyosság: **Kritikus / Magas / Közepes / Alacsony**. Valószínűség:
**Biztos (már bekövetkezett/aktív) / Valószínű / Lehetséges**.

| ID | Kockázat | Súlyosság | Valószínűség | Forrás | Mitigáció / Státusz |
|---|---|---|---|---|---|
| R-01 | `next@15.4.11`-en valós, magas súlyosságú CVE-k (DoS, request smuggling, middleware bypass, cache poisoning, SSRF); nincs biztonságos frissítési út, mert a `@payloadcms/next@3.87.0` peer-dependency tartománya kizárja a javított `15.5.x` sávot | Magas | Biztos (aktív) | `npm audit --omit=dev`, `npm view @payloadcms/next@latest`; ld. `PROJECT_STATUS.md` | Vár egy jövőbeli Payload-kiadásra, ami `next@15.5.x`+-t támogat, VAGY tudatos major-migráció `next@16.2.6+`-ra — utóbbi külön emberi jóváhagyást igényel |
| R-02 | `scripts/seed.ts` és `src/seed.ts` hardcode-olt admin hitelesítő adatot hoz létre (`admin@vmk.hu` / `VmkPassword2026!`), NODE_ENV-ellenőrzés vagy egyéb védelem nélkül a szkriptben | **Kritikus, ha éles adatbázison fut** | Lehetséges (jelenleg csak dev/seed kontextusban használt) | `scripts/seed.ts:10-18`, közvetlen fájlolvasással most ellenőrizve | **Nyitott.** Javaslat: env-guard (`if (process.env.NODE_ENV === 'production') throw`) hozzáadása, és a jelszó kötelező env-változóból olvasása fallback nélkül |
| R-03 | WCAG 2.2 AA audit **ténylegesen lefutott ma** (korábbi állítással ellentétben, ld. R-04) és **15/16 oldal elbukik**, döntően `color-contrast` hibák miatt (pl. fehér szöveg `#00909B` háttéren = 3.84:1 a szükséges 4.5:1 helyett; `#e4b02c` arany szöveg fehér háttéren = 1.99:1) | Magas | Biztos (mért, nem becsült) | `npx playwright test tests/e2e/accessibility.spec.ts` valós futtatása, 2026-08-03 | **Nyitott, és feszültségben áll a pixel-parity célkitűzéssel**: a hibás kontrasztarányok nagy része a valós vmk.hu saját márkaszíneinek (teal `#00909B`, arany `#e4b02c`) másolatai — a kontraszt javítása eltávolodna a vizuális 1:1 egyezéstől. Emberi döntés szükséges: WCAG-megfelelőség vagy vizuális hűség élvez elsőbbséget ezeken a helyeken |
| R-04 | `PROJECT_STATUS.md` és `.ai/context/current_state.md` azt állítja, hogy a Chromium/Playwright **nem indítható** ebben a sandbox-környezetben (hiányzó `libatk-1.0.so.0`, root hiánya) — ez az állítás **ma elavultnak bizonyult**: a Playwright Chromium ma többször sikeresen lefutott ugyanebben a sandboxban (pixel-diff mérésekhez és a WCAG audithoz is) | Közepes | Biztos (dokumentált tévedés) | Ma ténylegesen lefuttatott `npx playwright test` és `tools/pixel-diff-masked.mjs` hívások, mindkettő Chromiumot indít | **Dokumentáció frissítendő.** Ennek közvetlen következménye van a #24-es taskra (Események migráció) is, amit ugyanezzel az indokkal jelöltek blokkoltnak — érdemes újra megvizsgálni, hogy a blokkoló ok még fennáll-e |
| R-05 | Fizetési kapu (Stripe/Barion/SimplePay) hitelesítő adatok hiányoznak — a Shop/Adomány funkciók csak UI/struktúra szinten készek, éles fizetés nélkül | Magas (üzleti, nem technikai) | Biztos (ismert, dokumentált hiány) | `PROJECT_STATUS.md` | Vár a tulajdonos (ggiaur) által beszerzendő valós API-kulcsokra — nem AI-ügynök hatásköre |
| R-06 | `payload generate:types` és önálló `tsx` szkriptek (pl. közvetlen `scripts/seed.ts` futtatás) Node 24 alatt `ERR_REQUIRE_ASYNC_MODULE` hibába futnak (upstream Payload/Next.js ESM-CJS interop hiba) | Közepes | Biztos (aktív) | `.ai/context/current_state.md`, korábbi munkamenetekben megfigyelve | Workaround: seedelés a `src/app/api/dev-seed/route.ts` fejlesztői végponton keresztül, futó Next.js szerveren belül |
| R-07 | Nincs hozzáférés a valós vmk.hu Google Analytics / Search Console / backlink-adataihoz — a migrációs módszertan 4. fázisának (forgalmi/SEO baseline) kimenetei nem állíthatók elő valós adatból | Alacsony (jelenlegi fázisban) → Magas (cutover előtt) | Biztos (nincs hozzáférés) | Nincs beállítva ilyen integráció a projektben; a tulajdonos fiókjaihoz az AI-ügynöknek nincs hozzáférése | **Nem pótolható kitalált adattal.** Cutover előtt a tulajdonosnak kell exportálnia/megadnia a valós adatokat, vagy ezt a fázist tudatosan "N/A ebben a projektben" jelöléssel kell lezárni |
| R-08 | Események és Galéria-fotók migrációja (#24) korábban "blokkolt"-ként lett dokumentálva ugyanazon (ma megcáfolt, ld. R-04) sandbox-Chromium indoklással | Közepes | Valószínű (érdemes újravizsgálni) | Task #24 leírása + R-04 | Következő lépésként érdemes megpróbálni a böngésző-alapú scrapinget újra, mielőtt továbbra is "blokkolt"-ként kezeljük |

## Nem szerepel a listán (tudatosan)

Nem vettünk fel spekulatív kockázatokat (pl. "mi lesz, ha a szerver
leáll", "mi lesz, ha megnő a forgalom") valós mérés vagy dokumentált
tény nélkül — a `CLAUDE.md` elve szerint valószínű, de ellenőrizetlen
adatot nem rögzítünk tényként.
