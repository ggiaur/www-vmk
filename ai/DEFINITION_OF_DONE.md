# Definition of Done (DoD)

Egy fázis, modul vagy komponens akkor tekinthető késznek, ha:

1. **Code Complete:** Az összes funkcionalitás elkészült a specifikáció szerint.
2. **Strict Typing:** A TypeScript fordító 0 hibával és 0 `any` típussal fut le.
3. **Docs Updated:** A `/docs` mappa vonatkozó dokumentációja (pl. `CONTENT_MODEL.md` vagy `COMPONENT_LIBRARY.md`) frissült.
4. **Tests Passed:** A Vitest unit/komponens tesztek és Playwright E2E/A11y tesztek zölden futnak le.
5. **Self-Review Completed:** Az `ai/REVIEW_CHECKLIST.md` minden eleme igazolt.
6. **No Redundant Dependencies:** Nincsenek felesleges harmadik féltől származó csomagok beiktatva.
