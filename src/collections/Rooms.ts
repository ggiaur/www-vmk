import type { CollectionConfig } from 'payload'

export const Rooms: CollectionConfig = {
  slug: 'rooms',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'library', 'capacity'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Terem / Erőforrás Neve',
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
      name: 'library',
      type: 'relationship',
      relationTo: 'libraries',
      required: true,
      label: 'Könyvtár / Részleg',
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      label: 'Befogadóképesség (fő)',
    },
    {
      name: 'equipment',
      type: 'array',
      label: 'Felszereltség',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Leírás',
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      label: 'Fotó',
    },
    {
      name: 'openFrom',
      type: 'text',
      defaultValue: '09:00',
      label: 'Foglalható Kezdő Időpont (HH:mm)',
      admin: { position: 'sidebar' },
    },
    {
      name: 'openTo',
      type: 'text',
      defaultValue: '18:00',
      label: 'Foglalható Záró Időpont (HH:mm)',
      admin: { position: 'sidebar' },
    },
  ],
}
