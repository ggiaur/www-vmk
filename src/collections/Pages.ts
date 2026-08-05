import type { CollectionConfig } from 'payload'
import { PageBlocks } from '../blocks/PageBlocks'
import { generateSlug } from '../lib/slugify'
import { restrictPublishToEditors } from '../lib/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Oldal',
    plural: 'Oldalak',
  },
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
  admin: {
    group: 'Tartalom',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Egyedi oldalak szerkesztése blokk-építővel (pl. Rólunk, Beiratkozás).',
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'
        return `${base}/${(data as Record<string, unknown>).slug ?? ''}`
      },
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    // Automatikus slug-generálás az oldal címéből.
    // Megjegyzés: az Oldalaknál a slug lehet többszintű útvonal
    // (pl. 'hasznalat/beiratkozas') — a szerkesztő átírhatja.
    beforeChange: [
      ({ data }) => {
        if (!data.slug && data.title) {
          data.slug = generateSlug(data.title)
        }
        return data
      },
      restrictPublishToEditors,
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Oldal Címe',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug (pl. hasznalat/beiratkozas)',
      admin: {
        position: 'sidebar',
        description: 'Perjellel tagolt útvonal / a domain után, kezdő perjel nélkül.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'SEO Meta Leírás',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: PageBlocks,
      label: 'Oldal Blokk-Építő (Dynamic Blocks)',
    },
  ],
}
