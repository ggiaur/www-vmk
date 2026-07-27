# AI Short Memory - Coding Rules

1. **No Explicit Any:** Szigorú TypeScript. Tilos az `any` és a `ts-ignore`.
2. **WCAG 2.2 AA:** Billentyűzettel navigálható, magas kontrasztú UI, ARIA attributumok és alt szövegek kötelezőek.
3. **DRY & Single Source of Truth:** Nincs komponens duplikáció. Használd a `docs/DESIGN_SYSTEM.md` előírásait.
4. **Self-Review Checklist:** Minden subtask után kötelező lefuttatni az `ai/REVIEW_CHECKLIST.md`-t.
5. **Security & Secrets:** `.env` és titkok soha nem kerülhetnek Git-be.
