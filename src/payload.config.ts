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
    components: {
      graphics: {
        Logo: './components/admin/Logo#Logo',
        Icon: './components/admin/Icon#Icon',
      },
      beforeDashboard: ['./components/admin/DashboardBanner#DashboardBanner'],
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
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'vmk_super_secret_payload_key_2026_dev',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || 'postgres://vmk_user:vmk_password@localhost:5432/vmk_db',
    },
    // Payload's dev-mode default (push: true) diffs the DB against the
    // current collection schema on every `next dev` boot and offers an
    // interactive prompt to apply the diff -- including DROPs -- with no
    // way to preview them outside the TTY prompt itself. On this DB that
    // prompt currently offers to drop `header_settings` and the
    // `color`/`folder_id` columns (884+46+15+2 live rows) because the
    // collection config no longer declares them; that's stale schema debt,
    // not something a dev server boot should ever be able to apply
    // unattended. Disabling push makes dev mode read/write against the
    // schema exactly as it exists today (safe: the app doesn't need those
    // extra columns to run) and pushes the actual cleanup to an explicit,
    // reviewable migration instead. See COLLAB.md Phase B1.
    push: false,
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

