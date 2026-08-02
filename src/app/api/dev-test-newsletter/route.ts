import { NextResponse } from 'next/server'
import { submitNewsletterSignup } from '@/app/actions'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const marker = `webhook-test-${Date.now()}@example.com`
  const results: Record<string, unknown> = {}

  try {
    const form = new FormData()
    form.set('email', marker)
    form.set('name', 'Newsletter Teszt')
    results.submit = await submitNewsletterSignup(form)

    const dupForm = new FormData()
    dupForm.set('email', marker)
    dupForm.set('name', 'Duplikátum Teszt')
    results.duplicateSubmit = await submitNewsletterSignup(dupForm)

    const payload = await getPayloadClient()
    if (!payload) return NextResponse.json({ error: 'Payload client unavailable' }, { status: 500 })

    const found = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: marker } },
      limit: 10,
    })
    results.persistedCount = found.totalDocs

    for (const doc of found.docs) {
      await payload.delete({ collection: 'newsletter-subscribers', id: (doc as { id: string }).id })
    }
    results.cleanedUp = found.docs.length

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: String(error), partialResults: results }, { status: 500 })
  }
}
