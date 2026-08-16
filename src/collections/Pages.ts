import type { CollectionConfig } from 'payload'
import { PageBlocks } from '../blocks/PageBlocks'
import { adminOrEditorOnly } from '../lib/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Oldal',
    plural: 'Oldalak',
  },
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
    // create/update/delete were previously undefined -- see Documents.ts
    // for why that was empirically still safe, made explicit here too per
    // the E0 audit. Pages now holds 52 real migrated content records
    // (A2a/A2b), so explicit write protection matters in practice, not
    // just in principle.
    create: adminOrEditorOnly,
    update: adminOrEditorOnly,
    delete: adminOrEditorOnly,
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
