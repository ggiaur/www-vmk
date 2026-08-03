import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { hu } from 'payload/i18n/hu'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Bookings } from './collections/Bookings'
import { Documents } from './collections/Documents'
import { ContactMessages } from './collections/ContactMessages'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { DonationPledges } from './collections/DonationPledges'
import { Events } from './collections/Events'
import { Galleries } from './collections/Galleries'
import { Libraries } from './collections/Libraries'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { OpeningHours } from './collections/OpeningHours'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { Products } from './collections/Products'
import { Registrations } from './collections/Registrations'
import { Rooms } from './collections/Rooms'
import { Services } from './collections/Services'
import { Staff } from './collections/Staff'
import { Users } from './collections/Users'
import { HeaderSettings } from './globals/HeaderSettings'
import { FooterSettings } from './globals/FooterSettings'
import { SiteMetadata } from './globals/SiteMetadata'
import { OpeningHoursGlobal } from './globals/OpeningHoursGlobal'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — VMK Admin',
    },
    // Egyedi admin főoldal (dashboard) — felváltja a Payload alapértelmezett
    // 'Welcome to Payload' képernyőjét. Az elérési út az importMap baseDir-hez
    // képest relatív — a Payload v3 ezt automatikusan feloldja.
    components: {
      graphics: {
        Logo: './components/admin/Logo#Logo',
        Icon: './components/admin/Icon#Icon',
      },
      views: {
        dashboard: {
          Component: '/components/admin/Dashboard#default',
        },
      },
    },
    livePreview: {
      collections: ['news', 'events', 'pages'],
      url: ({ data, collectionConfig }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'
        const slug = (data as Record<string, unknown>).slug as string | undefined
        if (!slug) return base
        switch (collectionConfig?.slug) {
          case 'news':
            return `${base}/hirek/${slug}`
          case 'events':
            return `${base}/esemenyek/${slug}`
          case 'pages':
            return `${base}/${slug}`
          default:
            return base
        }
      },
      breakpoints: [
        {
          label: 'Mobil',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Asztali',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  i18n: {
    supportedLanguages: { hu },
  },
  sharp,
  collections: [
    Users,
    Media,
    Libraries,
    News,
    Events,
    OpeningHours,
    Pages,
    Staff,
    Documents,
    Services,
    Partners,
    Galleries,
    Registrations,
    Rooms,
    Bookings,
    DonationPledges,
    ContactMessages,
    NewsletterSubscribers,
    Products,
  ],
  // Globals: singleton rekordok, amelyekből pontosan 1 példány létezik.
  // A szerkesztők ezeket az admin-ban a bal oldalsáv alján találják.
  globals: [
    HeaderSettings,    // Fejléc: telefon, OPAC URL, navigáció
    FooterSettings,    // Lábléc: cím, gyors linkek, social, jogi sáv
    SiteMetadata,      // Globális SEO, OpenGraph, GTM/GA4
    OpeningHoursGlobal, // Rendıvüli nyitvatartás, banner üzenet
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'vmk_super_secret_payload_key_2026_dev',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgres://vmk_user:vmk_password@localhost:5432/vmk_db',
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.MINIO_BUCKET || 'vmk-media',
      config: {
        credentials: {
          accessKeyId: process.env.MINIO_ROOT_USER || 'minio_admin',
          secretAccessKey: process.env.MINIO_ROOT_PASSWORD || 'minio_password',
        },
        region: 'us-east-1',
        endpoint: `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`,
        forcePathStyle: true,
      },
    }),
  ],
})

