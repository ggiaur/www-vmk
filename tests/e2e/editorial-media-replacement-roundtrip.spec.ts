import { expect, test } from '@playwright/test'

// Content path: News (src/collections/News.ts) `featuredImage` -- a single
// `relationship` field to `media` (not an array, unlike Galleries' `images`),
// rendered as exactly one <img> on the public route
// src/app/(frontend)/hirek/[slug]/page.tsx (lines ~43-47, ~84-89), with its
// `alt` sourced from the media doc. A single-relationship field gives the
// cleanest possible proof of "the old asset is gone": after the PATCH there
// is structurally only one <img> in the DOM, so if the new alt text is
// visible and the old alt text is not, the old asset has genuinely been
// replaced, not just duplicated alongside the new one.
//
// This test proves the full editorial media-replacement round trip: publish
// a News article with an OLD image -> real browser confirms the OLD image
// renders -> upload a NEW distinct image (mandatory WCAG alt text) -> PATCH
// the article's featuredImage to the NEW asset (the same update path a real
// editor uses) -> real browser confirms the NEW image renders AND the OLD
// image/alt text is no longer present anywhere on the page.
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

// Two distinct 1x1 PNGs (different bytes) so the OLD and NEW uploads are
// genuinely different media assets, not the same file re-uploaded twice.
const OLD_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9WAAAAABJRU5ErkJggg=='
const NEW_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC'

test.describe('editorial media replacement round trip', () => {
  test.skip(!runEditorialRoundTrip, 'Set E2E_EDITORIAL_ADMIN_EMAIL and E2E_EDITORIAL_ADMIN_PASSWORD to run this write-enabled test.')

  test('replacing a published News featuredImage removes the old asset and renders the new one', async ({ page, request }) => {
    const nonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const title = `E2E médiacsere hír ${nonce}`
    const slug = `e2e-media-csere-${nonce}`
    const summary = 'Automatizált médiacsere-körteszt: a lecserélt borítókép jelenik meg a nyilvános oldalon.'
    const body = 'A médiacsere próba szövege a Payload rich text mezőből érkezett.'
    const oldAlt = `E2E régi borítókép ${nonce}`
    const newAlt = `E2E új borítókép ${nonce}`
    let token: string | undefined
    let newsID: string | number | undefined
    let oldMediaID: string | number | undefined
    let newMediaID: string | number | undefined

    try {
      const login = await request.post('/api/users/login', {
        data: { email: adminEmail, password: adminPassword },
      })
      expect(login.ok(), await login.text()).toBeTruthy()
      const session = await login.json() as LoginResponse
      token = session.token
      const headers = { Authorization: `JWT ${token}` }

      // 1. Upload the OLD media asset with mandatory WCAG alt text. Payload's
      // REST upload endpoint reads non-file fields from a single `_payload`
      // JSON-string multipart field, not bare top-level multipart fields.
      const oldMedia = await request.post('/api/media', {
        headers,
        multipart: {
          _payload: JSON.stringify({ alt: oldAlt }),
          file: {
            name: 'editorial-media-replacement-old.png',
            mimeType: 'image/png',
            buffer: Buffer.from(OLD_PNG_BASE64, 'base64'),
          },
        },
      })
      expect(oldMedia.ok(), await oldMedia.text()).toBeTruthy()
      oldMediaID = (await oldMedia.json() as CreatedDocument).doc.id

      // 2. Publish a News article with the OLD asset attached.
      const create = await request.post('/api/news', {
        headers,
        data: {
          title,
          slug,
          category: 'general',
          summary,
          content: lexicalContent(body),
          author: session.user.id,
          featuredImage: oldMediaID,
          _status: 'published',
        },
      })
      expect(create.ok(), await create.text()).toBeTruthy()
      newsID = (await create.json() as CreatedDocument).doc.id

      // 3. Real browser: the OLD image renders on the public route.
      await page.goto(`/hirek/${slug}`)
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
      await expect(page.getByRole('img', { name: oldAlt })).toBeVisible()

      // 4. Upload a NEW, distinct media asset with its own mandatory alt text.
      const newMedia = await request.post('/api/media', {
        headers,
        multipart: {
          _payload: JSON.stringify({ alt: newAlt }),
          file: {
            name: 'editorial-media-replacement-new.png',
            mimeType: 'image/png',
            buffer: Buffer.from(NEW_PNG_BASE64, 'base64'),
          },
        },
      })
      expect(newMedia.ok(), await newMedia.text()).toBeTruthy()
      newMediaID = (await newMedia.json() as CreatedDocument).doc.id

      // 5. Replace the article's media reference via the real editor update
      // path (PATCH), swapping featuredImage from OLD to NEW.
      const replace = await request.patch(`/api/news/${newsID}`, {
        headers,
        data: { featuredImage: newMediaID },
      })
      expect(replace.ok(), await replace.text()).toBeTruthy()

      // 6. Real browser: the NEW image renders, and the OLD image/alt text
      // is gone -- not just duplicated alongside the new one.
      await page.goto(`/hirek/${slug}`)
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
      await expect(page.getByRole('img', { name: newAlt })).toBeVisible()
      await expect(page.getByRole('img', { name: oldAlt })).not.toBeVisible()
      await expect(page.getByAltText(oldAlt)).toHaveCount(0)
      await page.screenshot({ path: `test-results/editorial-media-replacement-${nonce}.png`, fullPage: true })
    } finally {
      // Leave no synthetic content, and no orphaned media, in the shared
      // environment.
      if (token && newsID) await request.delete(`/api/news/${newsID}`, { headers: { Authorization: `JWT ${token}` } })
      if (token && oldMediaID) await request.delete(`/api/media/${oldMediaID}`, { headers: { Authorization: `JWT ${token}` } })
      if (token && newMediaID) await request.delete(`/api/media/${newMediaID}`, { headers: { Authorization: `JWT ${token}` } })
    }
  })
})
