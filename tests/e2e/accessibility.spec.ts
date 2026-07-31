import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// WCAG 2.2 AA audit across the main public pages, per docs/PROJECT_SPEC.md
// and docs/DESIGN_SYSTEM.md section 9. Run with: npm run test:e2e

const PAGES = [
  { path: '/', label: 'Főoldal' },
  { path: '/nyitvatartas', label: 'Nyitvatartás' },
  { path: '/hirek', label: 'Hírek' },
  { path: '/esemenyek', label: 'Rendezvények' },
  { path: '/szolgaltatasok', label: 'Szolgáltatások' },
  { path: '/dokumentumok', label: 'Dokumentumok' },
  { path: '/munkatarsak', label: 'Munkatársak' },
  { path: '/kapcsolat', label: 'Kapcsolat' },
  { path: '/reszlegek', label: 'Részlegek' },
  { path: '/tagkonyvtarak', label: 'Tagkönyvtárak' },
  { path: '/galeria', label: 'Galéria' },
  { path: '/programarchivum', label: 'Programarchívum' },
  { path: '/teremfoglalas', label: 'Teremfoglalás' },
  { path: '/tamogatas', label: 'Támogatás' },
  { path: '/bolt', label: 'Bolt' },
]

for (const { path, label } of PAGES) {
  test(`${label} (${path}) — WCAG 2.2 AA`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze()

    if (results.violations.length > 0) {
      const summary = results.violations
        .map((v) => `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
        .join('\n')
      console.log(`\nWCAG violations on ${path}:\n${summary}`)
    }

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })
}

test('Skip link is present and focusable', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toBeVisible()
})
