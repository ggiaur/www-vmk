import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'order'],
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
