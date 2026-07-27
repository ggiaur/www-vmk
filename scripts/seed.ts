import { getPayload } from 'payload'
import config from '../src/payload.config'

export async function seedRuntimeData() {
  console.log('🌱 Starting VMK Payload CMS Runtime Seed & Validation...')

  const payload = await getPayload({ config })

  // 1. Create Test Admin User
  const adminUser = await payload.create({
    collection: 'users',
    data: {
      email: 'admin@vmk.hu',
      name: 'VMK Rendszergazda',
      password: 'VmkPassword2026!',
      role: 'admin',
    },
  })
  console.log('✅ Created Admin User:', adminUser.email)

  // 2. Create Test Library (Central)
  const centralLibrary = await payload.create({
    collection: 'libraries',
    data: {
      name: 'Vörösmarty Mihály Könyvtár - Központi Könyvtár',
      slug: 'kozponti-konyvtar',
      type: 'central',
      address: '8000 Székesfehérvár, Bartók Béla tér 1.',
      phone: '+36 22 340 699',
      email: 'kolcsonzo@vmk.hu',
      geolocation: {
        latitude: 47.1905,
        longitude: 18.4103,
      },
    },
  })
  console.log('✅ Created Central Library:', centralLibrary.name)

  // 3. Create Opening Hours Record
  const openingHours = await payload.create({
    collection: 'opening-hours',
    data: {
      library: centralLibrary.id,
      dayOfWeek: 'monday',
      openTime: '08:00',
      closeTime: '18:00',
      isClosed: false,
      specialNote: 'Standard hétfői nyitvatartás',
    },
  })
  console.log('✅ Created OpeningHours Record:', openingHours.id)

  // 4. Create Draft & Published News Article
  const newsArticle = await payload.create({
    collection: 'news',
    data: {
      title: 'Nyári Nyitvatartási Rend 2026',
      slug: 'nyari-nyitvatartas-2026',
      category: 'announcement',
      summary: 'A Vörösmarty Mihály Könyvtár nyári működési rendje a központi és tagkönyvtárakban.',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Tájékoztatjuk kedves olvasóinkat a nyári nyitvatartásról.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      relatedLibrary: centralLibrary.id,
      author: adminUser.id,
      _status: 'published',
    },
  })
  console.log('✅ Created News Article:', newsArticle.title, 'Status:', newsArticle._status)

  // 5. Create Test Event
  const eventRecord = await payload.create({
    collection: 'events',
    data: {
      title: 'Ünnepi Könyvhét és Gyermeknap 2026',
      slug: 'unnepi-konyvhet-2026',
      startDate: new Date('2026-06-10T10:00:00.000Z').toISOString(),
      endDate: new Date('2026-06-12T18:00:00.000Z').toISOString(),
      location: centralLibrary.id,
      targetAudience: 'all',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Szeretettel várunk mindenkit az Ünnepi Könyvhét programjaira.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      _status: 'published',
    },
  })
  console.log('✅ Created Event Record:', eventRecord.title)

  console.log('🎉 VMK Payload CMS Runtime Seed Completed Successfully!')
}

if (process.env.RUN_SEED === 'true') {
  seedRuntimeData().catch(console.error)
}
