import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const Rooms: CollectionConfig = {
  slug: 'rooms',
  labels: {
    singular: 'Terem',
    plural: 'Termek',
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
    defaultColumns: ['name', 'library', 'capacity'],
    description: 'Foglalható termek és közösségi terek.',
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
