import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: 'Partner',
    plural: 'Partnerek',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Szolgáltatások & Bolt',
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
