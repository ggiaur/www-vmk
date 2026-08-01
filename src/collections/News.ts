import type { CollectionConfig } from 'payload'
import { syncToMeiliIndex, removeFromMeiliIndex, INDEXES } from '../lib/meilisearch'

export const News: CollectionConfig = {
  slug: 'news',
  access: {
    // Public REST API only sees published articles; logged-in editors see
    // drafts too (matches the admin panel's own preview behaviour).
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc._status === 'published') {
          await syncToMeiliIndex(INDEXES.NEWS, {
            id: doc.id,
            title: doc.title,
            summary: doc.summary,
            category: doc.category,
            slug: doc.slug,
            publishedAt: doc.publishedAt,
          })
        } else {
          await removeFromMeiliIndex(INDEXES.NEWS, doc.id)
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await removeFromMeiliIndex(INDEXES.NEWS, doc.id)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Hír Címe',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Publikáció Dátuma',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Friss Hír', value: 'general' },
        { label: 'Közlemény / Hirdetmény', value: 'announcement' },
        { label: 'Pályázat / Olvasópályázat', value: 'grant' },
        { label: 'Programarchívum (korábbi évek)', value: 'archive' },
      ],
      defaultValue: 'general',
      label: 'Kategória',
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 300,
      label: 'Rövid Összefoglaló (Kártyákhoz)',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Törzsszöveg (Lexical Editor)',
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Borítókép',
    },
    {
      name: 'relatedLibrary',
      type: 'relationship',
      relationTo: 'libraries',
      label: 'Kapcsolódó Tagkönyvtár / Részleg',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      label: 'Szerző',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sourceNote',
      type: 'text',
      label: 'Migrációs Megjegyzés (pl. becsült dátum)',
      admin: {
        position: 'sidebar',
        description: 'Csak a vmk.hu-ról migrált tartalmaknál kitöltve — szerkesztői ellenőrzésre vár.',
      },
    },
  ],
}
