import { expect, test } from '@playwright/test'

// Pages has the same draft/publish lifecycle as News/Events (versions.drafts:
// true, read access gated on _status: 'published' -- see src/collections/
// Pages.ts and getPageBySlug in src/lib/payload.ts), rendered by the generic
// catch-all route src/app/(frontend)/[...slug]/page.tsx via PageBlockRenderer.
// Unlike News/Events, content lives in a block-builder `layout` field rather
// than a single body field -- this test creates a single richText block to
// prove the block-builder round trip, not just the draft/publish gate.
const adminEmail = process.env.E2E_EDITORIAL_ADMIN_EMAIL
const adminPassword = process.env.E2E_EDITORIAL_ADMIN_PASSWORD
const runEditorialRoundTrip = Boolean(adminEmail && adminPassword)

type LoginResponse = { token: string }
type CreatedDocument = { doc: { id: string | number } }

const lexicalContent = (text: string) => ({
  root: {
    type: 'root',
    children: [{
      type: 'paragraph',
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
      direction: 'ltr', format: '', indent: 0, version: 1,
    }],
    direction: 'ltr', format: '', indent: 0, version: 1,
  },
})

test.describe('editorial pages round trip', () => {
  test.skip(!runEditorialRoundTrip, 'Set E2E_EDITORIAL_ADMIN_EMAIL and E2E_EDITORIAL_ADMIN_PASSWORD to run this write-enabled test.')

  test('admin creates, edits a block-builder page, and publishes it to its public route', async ({ page, request }) => {
    const login = await request.post('/api/users/login', {
      data: { email: adminEmail, password: adminPassword },
    })
    expect(login.ok(), await login.text()).toBeTruthy()
    const { token } = (await login.json()) as LoginResponse
    const headers = { Authorization: `JWT ${token}` }

    const nonce = `${Date.now()}`.slice(-6)
    const title = `E2E szerkesztői oldal ${nonce}`
    const editedTitle = `${title} — frissítve`
    const slug = `e2e-szerkesztoi-oldal-${nonce}`
    const bodyText = 'A szerkesztői próba szövege a blokk-építő richText mezőjéből érkezett.'
    const editedBodyText = `${bodyText} (szerkesztve)`
    let pageID: string | number | undefined

    try {
      const draft = await request.post('/api/pages', {
        headers,
        data: {
          title,
          slug,
          layout: [{ blockType: 'richText', content: lexicalContent(bodyText) }],
          _status: 'draft',
        },
      })
      expect(draft.ok(), await draft.text()).toBeTruthy()
      pageID = (await draft.json() as CreatedDocument).doc.id

      // Draft pages must not be reachable on the public catch-all route.
      const draftResponse = await page.goto(`/${slug}`)
      expect(draftResponse?.status()).toBe(404)

      const publish = await request.patch(`/api/pages/${pageID}`, {
        headers,
        data: {
          title: editedTitle,
          layout: [{ blockType: 'richText', content: lexicalContent(editedBodyText) }],
          _status: 'published',
        },
      })
      expect(publish.ok(), await publish.text()).toBeTruthy()

      await page.goto(`/${slug}`)
      await expect(page.getByRole('heading', { name: editedTitle })).toBeVisible()
      await expect(page.getByText(editedBodyText)).toBeVisible()
      await page.screenshot({ path: `test-results/editorial-pages-${nonce}.png`, fullPage: true })
    } finally {
      if (pageID) {
        await request.delete(`/api/pages/${pageID}`, { headers })
      }
    }
  })
})
