import { expect, test } from '@playwright/test'

// OpeningHours has no draft/publish lifecycle (unlike News/Events) -- it's a
// small, always-public collection whose afterChange hook revalidates a fixed
// set of consuming pages (see src/lib/revalidateLibraryPages.ts, itself a fix
// for a real bug found in an earlier session: an admin edit updated Postgres
// and the REST API immediately but the public page kept serving stale
// build-time HTML until a full `next build`). This test proves an admin edit
// to the one real, already-seeded opening-hours record propagates to the
// public /nyitvatartas route through that revalidation path, then reverts
// the edit so no synthetic change persists in the shared environment.
const adminEmail = process.env.E2E_EDITORIAL_ADMIN_EMAIL
const adminPassword = process.env.E2E_EDITORIAL_ADMIN_PASSWORD
const runEditorialRoundTrip = Boolean(adminEmail && adminPassword)

type LoginResponse = { token: string }
type OpeningHoursDoc = {
  id: string | number
  library: { id: string | number } | string | number
  dayOfWeek: string
  openTime: string | null
  closeTime: string | null
  isClosed: boolean
}

test.describe('opening hours edit -> public route round trip', () => {
  test.skip(!runEditorialRoundTrip, 'Set E2E_EDITORIAL_ADMIN_EMAIL and E2E_EDITORIAL_ADMIN_PASSWORD to run this write-enabled test.')

  test('admin edits an existing opening-hours record and the change reaches /nyitvatartas', async ({ page, request }) => {
    const login = await request.post('/api/users/login', {
      data: { email: adminEmail, password: adminPassword },
    })
    expect(login.ok(), await login.text()).toBeTruthy()
    const { token } = (await login.json()) as LoginResponse
    const headers = { Authorization: `JWT ${token}` }

    // Use the real, already-seeded central-library Monday record (the only
    // opening-hours document that currently exists) rather than inventing a
    // new one -- OpeningHours documents are one-per-library-per-day, so
    // creating a duplicate for an existing day/library pair would be a
    // meaningless or conflicting fixture, not a realistic edit.
    const listResp = await request.get('/api/opening-hours?limit=1', { headers })
    expect(listResp.ok(), await listResp.text()).toBeTruthy()
    const list = (await listResp.json()) as { docs: OpeningHoursDoc[] }
    expect(list.docs.length, 'expected at least one existing opening-hours record to edit').toBeGreaterThan(0)
    const record = list.docs[0]
    const recordId = record.id
    const originalCloseTime = record.closeTime
    const nonce = `${Date.now()}`.slice(-4)
    const testCloseTime = `18:${nonce.padStart(2, '0').slice(0, 2)}`

    try {
      const patch = await request.patch(`/api/opening-hours/${recordId}`, {
        headers,
        data: { closeTime: testCloseTime },
      })
      expect(patch.ok(), await patch.text()).toBeTruthy()

      await page.goto('/nyitvatartas')
      await expect(page.getByText(`08:00 - ${testCloseTime}`)).toBeVisible()
      await page.screenshot({ path: `test-results/editorial-openinghours-${nonce}.png`, fullPage: true })
    } finally {
      // Revert rather than delete -- this is an edit-in-place collection
      // with no draft state, so "cleanup" means restoring the original
      // value, not removing the only real record.
      if (originalCloseTime) {
        await request.patch(`/api/opening-hours/${recordId}`, {
          headers,
          data: { closeTime: originalCloseTime },
        })
      }
    }
  })
})
