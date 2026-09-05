import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Szolgáltatás',
    plural: 'Szolgáltatások',
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
    group: 'Tartalom',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'icon'],
    description: 'Könyvtári szolgáltatások és díjtáblázatok.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Szolgáltatás Neve',
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
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      label: 'Rövid Összefoglaló',
    },
    {
      name: 'pricingTable',
      type: 'array',
      label: 'Díjtáblázat',
      fields: [
        {
          name: 'serviceItem',
          type: 'text',
          required: true,
          label: 'Tétel / Szolgáltatás eleme',
        },
        {
          name: 'price',
          type: 'text',
          required: true,
          label: 'Díj (pl. 500 Ft/oldal, Ingyenes)',
        },
      ],
    },
    {
      name: 'rulesPdf',
      type: 'relationship',
      relationTo: 'media',
      label: 'Kapcsolódó Szabályzat (PDF)',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Ikon neve (Lucide-react)',
    },
  ],
}
