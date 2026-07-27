import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { hu } from 'payload/i18n/hu'
import { fileURLToPath } from 'url'

import { Events } from './collections/Events'
import { Libraries } from './collections/Libraries'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { OpeningHours } from './collections/OpeningHours'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
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
    defaultLanguage: 'hu',
  },
  collections: [Users, Media, Libraries, News, Events, OpeningHours, Pages],
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
})
