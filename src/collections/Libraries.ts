import type { CollectionConfig } from 'payload'
import { scopedToOwnLibraryRecord, adminOrEditorOnly } from '../lib/access'

export const Libraries: CollectionConfig = {
  slug: 'libraries',
  labels: {
    singular: 'Könyvtár',
    plural: 'Könyvtárak',
  },
  access: {
    read: () => true,
    // "Könyvtáros Szerkesztő" (author) csak a saját tagkönyvtárát
    // szerkesztheti (pl. nyitvatartás, telefonszám frissítése), új
    // könyvtár/részleg felvétele és mások törlése admin/editor jog.
    create: adminOrEditorOnly,
    update: scopedToOwnLibraryRecord,
    delete: adminOrEditorOnly,
  },
  admin: {
    group: 'Könyvtárak',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'phone', 'email'],
    description: 'Központi könyvtár, tagkönyvtárak és részlegek adatai.',
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
      name: 'color',
      type: 'text',
      label: 'Megjelenítési Szín (hex)',
      admin: {
        description:
          'A munkatársak oldalon ez a szín jelenik meg a részleg/tagkönyvtár fejlécén, pl. #159097.',
        position: 'sidebar',
      },
      validate: (value: unknown) => {
        if (!value) return true
        return /^#[0-9a-fA-F]{6}$/.test(String(value)) || 'Érvénytelen hex szín (pl. #159097).'
      },
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
