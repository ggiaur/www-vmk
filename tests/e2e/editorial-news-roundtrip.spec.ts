import { expect, test } from '@playwright/test'

// This is deliberately opt-in: it writes a short-lived record through the
// same authenticated Payload API used by the admin application. It proves the
// editorial boundary (including upload and publication) and then uses a real
// browser for the public-route assertions.
const adminEmail = process.env.E2E_EDITORIAL_ADMIN_EMAIL
const adminPassword = process.env.E2E_EDITORIAL_ADMIN_PASSWORD
const runEditorialRoundTrip = Boolean(adminEmail && adminPassword)

type LoginResponse = { token: string; user: { id: string | number } }
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

test.describe('editorial news round trip', () => {
  test.skip(!runEditorialRoundTrip, 'Set E2E_EDITORIAL_ADMIN_EMAIL and E2E_EDITORIAL_ADMIN_PASSWORD to run this write-enabled test.')

  test('admin creates, edits, attaches media, and publishes news to its public route', async ({ page, request }) => {
    const nonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const title = `E2E szerkesztői hír ${nonce}`
    const editedTitle = `${title} — frissítve`
    const slug = `e2e-szerkesztoi-hir-${nonce}`
    const summary = 'Automatizált szerkesztői körteszt: a publikált hír megjelenik a nyilvános oldalon.'
    const body = 'A szerkesztői próba szövege a Payload rich text mezőből érkezett.'
    let token: string | undefined
    let newsID: string | number | undefined
    let mediaID: string | number | undefined

    try {
      const login = await request.post('/api/users/login', {
        data: { email: adminEmail, password: adminPassword },
      })
      expect(login.ok(), await login.text()).toBeTruthy()
      const session = await login.json() as LoginResponse
      token = session.token
      const headers = { Authorization: `JWT ${token}` }

      // Upload the smallest valid PNG together with its mandatory WCAG alt text.
      // Payload's REST upload endpoint reads non-file fields from a single
      // `_payload` JSON-string field, not top-level multipart fields -- a
      // bare `alt` field here is silently ignored, causing a false
      // "required field" validation error even though data was sent.
      const media = await request.post('/api/media', {
        headers,
        multipart: {
          _payload: JSON.stringify({ alt: `E2E illusztráció: ${editedTitle}` }),
          file: {
            name: 'editorial-roundtrip.png',
            mimeType: 'image/png',
            buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9WAAAAABJRU5ErkJggg==', 'base64'),
          },
        },
      })
      expect(media.ok(), await media.text()).toBeTruthy()
      mediaID = (await media.json() as CreatedDocument).doc.id

      // Save a draft first; it must not be exposed by the public route.
      const draft = await request.post('/api/news?draft=true', {
        headers,
        data: {
          title,
          slug,
          category: 'general',
          summary,
          content: lexicalContent(body),
          author: session.user.id,
          _status: 'draft',
        },
      })
      expect(draft.ok(), await draft.text()).toBeTruthy()
      newsID = (await draft.json() as CreatedDocument).doc.id

      await page.goto(`/hirek/${slug}`)
      await expect(page.getByRole('heading', { name: title })).not.toBeVisible()

      // The edit attaches the uploaded media and publication makes the exact
      // record available to the public route.
      const publish = await request.patch(`/api/news/${newsID}`, {
        headers,
        data: { title: editedTitle, featuredImage: mediaID, _status: 'published' },
      })
      expect(publish.ok(), await publish.text()).toBeTruthy()

      await page.goto(`/hirek/${slug}`)
      await expect(page.getByRole('heading', { name: editedTitle })).toBeVisible()
      await expect(page.getByText(summary)).toBeVisible()
      await expect(page.getByText(body)).toBeVisible()
      await expect(page.getByRole('img', { name: `E2E illusztráció: ${editedTitle}` })).toBeVisible()
      await page.screenshot({ path: `test-results/editorial-news-${nonce}.png`, fullPage: true })
    } finally {
      // The proof must leave neither synthetic editorial content nor media in
      // the shared environment. Cleanup uses the same authenticated role.
      if (token && newsID) await request.delete(`/api/news/${newsID}`, { headers: { Authorization: `JWT ${token}` } })
      if (token && mediaID) await request.delete(`/api/media/${mediaID}`, { headers: { Authorization: `JWT ${token}` } })
    }
  })
})
