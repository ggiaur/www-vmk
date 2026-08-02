import type { CollectionConfig } from 'payload'
import { syncToMeiliIndex, removeFromMeiliIndex, INDEXES } from '../lib/meilisearch'
import { scopedToOwnLibrary } from '../lib/access'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Esemény',
    plural: 'Események',
  },
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
    create: ({ req: { user } }) => !!user,
    // "Könyvtáros Szerkesztő" (author) csak a saját tagkönyvtárához
    // (location) kötött eseményeket szerkesztheti/törölheti.
    update: scopedToOwnLibrary('location'),
    delete: scopedToOwnLibrary('location'),
  },
  admin: {
    group: 'Tartalom',
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'location', 'targetAudience', '_status'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc._status === 'published') {
          await syncToMeiliIndex(INDEXES.EVENTS, {
            id: doc.id,
            title: doc.title,
            targetAudience: doc.targetAudience,
            slug: doc.slug,
            startDate: doc.startDate,
          })
        } else {
          await removeFromMeiliIndex(INDEXES.EVENTS, doc.id)
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await removeFromMeiliIndex(INDEXES.EVENTS, doc.id)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Rendezvény Címe',
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
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Kezdés Időpontja',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Befejezés Időpontja',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'libraries',
      required: true,
      label: 'Helyszín (Tagkönyvtár / Részleg)',
    },
    {
      name: 'targetAudience',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'Minden korosztály', value: 'all' },
        { label: 'Gyerekek (0-12 év)', value: 'children' },
        { label: 'Kamaszok / Fiatalok (13-18 év)', value: 'teens' },
        { label: 'Felnőttek', value: 'adults' },
        { label: 'Szeniorok', value: 'seniors' },
      ],
      label: 'Célcsoport',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Esemény Részletes Leírása',
    },
    {
      name: 'registrationUrl',
      type: 'text',
      label: 'Külső Regisztrációs Link (opcionális)',
    },
    {
      name: 'capacity',
      type: 'number',
      label: 'Létszámkorlát (üresen hagyva: nincs korlát, nincs beépített RSVP)',
      admin: {
        position: 'sidebar',
        description: 'Ha ki van töltve, a látogatók a beépített RSVP-vel jelentkezhetnek a rendezvényre a betelésig.',
      },
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Esemény Képe / Plakát',
    },
  ],
}
