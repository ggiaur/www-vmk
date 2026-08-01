import type { CollectionConfig } from 'payload'

export const Libraries: CollectionConfig = {
  slug: 'libraries',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Könyvtárak',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'phone', 'email'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tagkönyvtár / Részleg Neve',
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
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Központi Könyvtár', value: 'central' },
        { label: 'Tagkönyvtár', value: 'branch' },
        { label: 'Részleg / Szakkönyvtár', value: 'department' },
      ],
      label: 'Könyvtár Típusa',
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      label: 'Cím',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefonszám',
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mail Cím',
    },
    {
      name: 'geolocation',
      type: 'group',
      fields: [
        { name: 'latitude', type: 'number', label: 'Szélességi fok (Lat)' },
        { name: 'longitude', type: 'number', label: 'Hosszúsági fok (Lng)' },
      ],
      label: 'Térkép Koordináták',
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Kiemelt Borítókép',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Részletes Bemutatkozó Leírás',
    },
  ],
}
