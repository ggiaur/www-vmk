import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { syncToMeiliIndex, INDEXES } from '@/lib/meilisearch'

// Dev-only: the News/Events afterChange hooks only sync documents saved
// *after* the hooks existed — this backfills everything already in the
// database into Meilisearch (one-time, or re-run after a bulk import
// like the vmk.hu content scraper).
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const payload = await getPayloadClient()
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Payload not available' }, { status: 500 })
  }

  const [news, events] = await Promise.all([
    payload.find({ collection: 'news', where: { _status: { equals: 'published' } }, limit: 1000, depth: 0 }),
    payload.find({ collection: 'events', where: { _status: { equals: 'published' } }, limit: 1000, depth: 0 }),
  ])

  await Promise.all(
    news.docs.map((doc) =>
      syncToMeiliIndex(INDEXES.NEWS, {
        id: doc.id,
        title: doc.title,
        summary: doc.summary,
        category: doc.category,
        slug: doc.slug,
        publishedAt: doc.publishedAt,
      }),
    ),
  )
  await Promise.all(
    events.docs.map((doc) =>
      syncToMeiliIndex(INDEXES.EVENTS, {
        id: doc.id,
        title: doc.title,
        targetAudience: doc.targetAudience,
        slug: doc.slug,
        startDate: doc.startDate,
      }),
    ),
  )

  return NextResponse.json({ ok: true, newsIndexed: news.docs.length, eventsIndexed: events.docs.length })
}
