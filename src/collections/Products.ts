import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

// No live payment/checkout is wired up (needs real payment gateway
// credentials at deployment time) — this is a browsing-only catalog.
// Visitors are directed to contact/visit the library to purchase.
export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Termék',
    plural: 'Termékek',
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
    group: 'Foglalások és tranzakciók',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'stockStatus'],
    description: 'Könyvtári bolt: selejtezett könyvek, ajándéktárgyak.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Termék Neve',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'other',
      options: [
        { label: 'Selejtezett Könyv', value: 'used_book' },
        { label: 'Ajándéktárgy', value: 'gift' },
        { label: 'Egyéb', value: 'other' },
      ],
      label: 'Kategória',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Ár (Ft)',
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
      label: 'Termékfotó',
    },
    {
      name: 'stockStatus',
      type: 'select',
      required: true,
      defaultValue: 'available',
      options: [
        { label: 'Elérhető', value: 'available' },
        { label: 'Elfogyott', value: 'soldout' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
