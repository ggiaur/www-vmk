import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'location', 'targetAudience', '_status'],
  },
  versions: {
    drafts: true,
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
      label: 'Regisztrációs Link (opcionális)',
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Esemény Képe / Plakát',
    },
  ],
}
