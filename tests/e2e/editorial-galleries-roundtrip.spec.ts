import { expect, test } from '@playwright/test'

// Galleries (src/collections/Galleries.ts) has no draft/publish lifecycle --
// `read: () => true` unconditionally, so a created record is immediately
// public, unlike News/Events/Pages. Its public route is
// src/app/(frontend)/galeria/[slug]/page.tsx via getGalleryBySlug, which
// renders `title` and the `images` media relationship as a grid. This test
// proves create (immediately visible, no images yet) -> edit (attach an
// uploaded media image) -> public page shows the image -> delete (both the
// gallery and the uploaded media), since there's no draft step to round-trip.
const adminEmail = process.env.E2E_EDITORIAL_ADMIN_EMAIL
const adminPassword = process.env.E2E_EDITORIAL_ADMIN_PASSWORD
const runEditorialRoundTrip = Boolean(adminEmail && adminPassword)

type LoginResponse = { token: string }
type CreatedDocument = { doc: { id: string | number } }

test.describe('editorial galleries round trip', () => {
  test.skip(!runEditorialRoundTrip, 'Set E2E_EDITORIAL_ADMIN_EMAIL and E2E_EDITORIAL_ADMIN_PASSWORD to run this write-enabled test.')

  test('admin creates a gallery, attaches media, and the public gallery page shows it', async ({ page, request }) => {
    const login = await request.post('/api/users/login', {
      data: { email: adminEmail, password: adminPassword },
    })
    expect(login.ok(), await login.text()).toBeTruthy()
    const { token } = (await login.json()) as LoginResponse
    const headers = { Authorization: `JWT ${token}` }

    const nonce = `${Date.now()}`.slice(-6)
    const title = `E2E szerkesztői galéria ${nonce}`
    const slug = `e2e-szerkesztoi-galeria-${nonce}`
    const altText = `E2E galéria illusztráció: ${nonce}`
    let galleryID: string | number | undefined
    let mediaID: string | number | undefined

    try {
      const create = await request.post('/api/galleries', {
        headers,
        data: { title, slug },
      })
      expect(create.ok(), await create.text()).toBeTruthy()
      galleryID = (await create.json() as CreatedDocument).doc.id

      // No draft state -- verify the gallery is immediately public, but with
      // no images yet (the collection's own documented empty-state copy).
      await page.goto(`/galeria/${slug}`)
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
      await expect(page.getByText('Ehhez a galériához még nincsenek feltöltött képek.')).toBeVisible()

      const media = await request.post('/api/media', {
        headers,
        multipart: {
          _payload: JSON.stringify({ alt: altText }),
          file: {
            name: 'editorial-gallery-roundtrip.png',
            mimeType: 'image/png',
            buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9WAAAAABJRU5ErkJggg==', 'base64'),
          },
        },
      })
      expect(media.ok(), await media.text()).toBeTruthy()
      mediaID = (await media.json() as CreatedDocument).doc.id

      const attach = await request.patch(`/api/galleries/${galleryID}`, {
        headers,
        data: { images: [mediaID] },
      })
      expect(attach.ok(), await attach.text()).toBeTruthy()

      await page.goto(`/galeria/${slug}`)
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
      await expect(page.getByAltText(altText)).toBeVisible()
      await page.screenshot({ path: `test-results/editorial-galleries-${nonce}.png`, fullPage: true })
    } finally {
      if (galleryID) {
        await request.delete(`/api/galleries/${galleryID}`, { headers })
      }
      if (mediaID) {
        await request.delete(`/api/media/${mediaID}`, { headers })
      }
    }
  })
})
