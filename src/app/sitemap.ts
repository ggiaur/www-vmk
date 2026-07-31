import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.vmk.hu'

const STATIC_ROUTES = [
  '',
  '/nyitvatartas',
  '/elerhetosegeink',
  '/hirek',
  '/esemenyek',
  '/galeria',
  '/programarchivum',
  '/dokumentumok',
  '/munkatarsak',
  '/kapcsolat',
  '/szolgaltatasok',
  '/reszlegek',
  '/tagkonyvtarak',
  '/teremfoglalas',
  '/tamogatas',
  '/bolt',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.6,
  }))

  const payload = await getPayloadClient()
  if (!payload) return entries

  try {
    const [news, events, pages, libraries, products] = await Promise.all([
      payload.find({ collection: 'news', where: { _status: { equals: 'published' } }, limit: 1000, depth: 0 }),
      payload.find({ collection: 'events', where: { _status: { equals: 'published' } }, limit: 1000, depth: 0 }),
      payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, limit: 1000, depth: 0 }),
      payload.find({ collection: 'libraries', limit: 100, depth: 0 }),
      payload.find({ collection: 'products', where: { stockStatus: { equals: 'available' } }, limit: 500, depth: 0 }),
    ])

    for (const doc of news.docs) {
      entries.push({ url: `${SITE_URL}/hirek/${doc.slug}`, changeFrequency: 'monthly', priority: 0.5 })
    }
    for (const doc of events.docs) {
      entries.push({ url: `${SITE_URL}/esemenyek/${doc.slug}`, changeFrequency: 'weekly', priority: 0.5 })
    }
    for (const doc of pages.docs) {
      entries.push({ url: `${SITE_URL}/${doc.slug}`, changeFrequency: 'monthly', priority: 0.4 })
    }
    for (const doc of libraries.docs) {
      const base = doc.type === 'branch' ? 'tagkonyvtarak' : doc.type === 'department' ? 'reszlegek' : null
      if (base) entries.push({ url: `${SITE_URL}/${base}/${doc.slug}`, changeFrequency: 'monthly', priority: 0.5 })
    }
    for (const doc of products.docs) {
      entries.push({ url: `${SITE_URL}/bolt/${doc.slug}`, changeFrequency: 'weekly', priority: 0.3 })
    }
  } catch {
    // Payload unavailable — return the static routes only.
  }

  return entries
}
