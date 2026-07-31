import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // tests/e2e/** are Playwright specs (run via `npm run test:e2e`), not
    // Vitest — without this exclude, vitest's default glob picks up
    // *.spec.ts everywhere and fails trying to run Playwright's test().
    exclude: ['node_modules/**', 'tests/e2e/**'],
  },
})
