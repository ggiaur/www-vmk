import { expect, test } from '@playwright/test'

// This is deliberately opt-in: it writes a short-lived record through the
// same authenticated Payload API used by the admin application. It proves the
// editorial boundary (including publication) and then uses a real browser
// for the public-route assertions.
const adminEmail = process.env.E2E_EDITORIAL_ADMIN_EMAIL
const adminPassword = process.env.E2E_EDITORIAL_ADMIN_PASSWORD
const runEditorialRoundTrip = Boolean(adminEmail && adminPassword)

type LoginResponse = { token: string; user: { id: string | number } }
type CreatedDocument = { doc: { id: string | number } }
type LibraryList = { docs: { id: string | number }[] }

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

test.describe('editorial events round trip', () => {
  test.skip(!runEditorialRoundTrip, 'Set E2E_EDITORIAL_ADMIN_EMAIL and E2E_EDITORIAL_ADMIN_PASSWORD to run this write-enabled test.')

  test('admin creates, edits, and publishes an event to its public route', async ({ page, request }) => {
    const nonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const title = `E2E teszt rendezvény ${nonce}`
    const editedTitle = `${title} — frissítve`
    const slug = `e2e-teszt-rendezveny-${nonce}`
    const description = 'Az esemény oldal szerkesztői körtesztje: a publikált rendezvény megjelenik a nyilvános oldalon.'
    let token: string | undefined
    let eventID: string | number | undefined

    try {
      const login = await request.post('/api/users/login', {
        data: { email: adminEmail, password: adminPassword },
      })
      expect(login.ok(), await login.text()).toBeTruthy()
      const session = await login.json() as LoginResponse
      token = session.token
      const headers = { Authorization: `JWT ${token}` }

      // Events require a real `location` relationship (to `libraries`) --
      // reuse an existing library rather than inventing one.
      const libraries = await request.get('/api/libraries?limit=1', { headers })
      expect(libraries.ok(), await libraries.text()).toBeTruthy()
      const libraryList = await libraries.json() as LibraryList
      expect(libraryList.docs.length).toBeGreaterThan(0)
      const locationID = libraryList.docs[0].id

      // Save a draft first; it must not be exposed by the public route.
      const draft = await request.post('/api/events?draft=true', {
        headers,
        data: {
          title,
          slug,
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: locationID,
          targetAudience: 'all',
          description: lexicalContent(description),
          _status: 'draft',
        },
      })
      expect(draft.ok(), await draft.text()).toBeTruthy()
      eventID = (await draft.json() as CreatedDocument).doc.id

      await page.goto(`/esemenyek/${slug}`)
      await expect(page.getByRole('heading', { name: title })).not.toBeVisible()

      // Publication makes the exact record available to the public route.
      const publish = await request.patch(`/api/events/${eventID}`, {
        headers,
        data: { title: editedTitle, _status: 'published' },
      })
      expect(publish.ok(), await publish.text()).toBeTruthy()

      await page.goto(`/esemenyek/${slug}`)
      await expect(page.getByRole('heading', { name: editedTitle })).toBeVisible()
      await expect(page.getByText(description)).toBeVisible()
      await page.screenshot({ path: `test-results/editorial-events-${nonce}.png`, fullPage: true })
    } finally {
      // The proof must leave no synthetic editorial content in the shared
      // environment.
      if (token && eventID) await request.delete(`/api/events/${eventID}`, { headers: { Authorization: `JWT ${token}` } })
    }
  })
})
