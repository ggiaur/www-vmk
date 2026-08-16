import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: 'Partner',
    plural: 'Partnerek',
  },
  access: {
    read: () => true,
    // create/update/delete were previously undefined here (only
    // `read` was set) -- empirically still denied anonymous writes
    // (Payload defaults unlisted operations in a partial access
    // object to deny, unlike a fully-absent access block, which
    // defaults to allow -- see Bookings.ts/OpeningHours.ts). Made
    // explicit anyway per the E0 full-collection audit so this
    // doesn't rely on an undocumented Payload default.
    create: adminOrEditorOnly,
    update: adminOrEditorOnly,
    delete: adminOrEditorOnly,
  },
  admin: {
    group: 'Könyvtárak',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'order'],
    description: 'Támogatók és együttműködő partnerek.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Név',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Támogató', value: 'supporter' },
        { label: 'Partnerkönyvtár', value: 'partner' },
      ],
      defaultValue: 'supporter',
      label: 'Típus',
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      label: 'Logó',
    },
    {
      name: 'url',
      type: 'text',
      label: 'Weboldal (URL)',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Rövid Leírás',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Megjelenítési Sorrend',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
