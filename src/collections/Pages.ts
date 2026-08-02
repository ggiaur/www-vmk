import type { CollectionConfig } from 'payload'
import { PageBlocks } from '../blocks/PageBlocks'

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
  },
  versions: {
    drafts: true,
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
