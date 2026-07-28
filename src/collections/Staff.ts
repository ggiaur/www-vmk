import type { CollectionConfig } from 'payload'

export const Staff: CollectionConfig = {
  slug: 'staff',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'department', 'email', 'order'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Munkatárs Neve',
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      label: 'Beosztás / Munkakör',
    },
    {
      name: 'department',
      type: 'relationship',
      relationTo: 'libraries',
      label: 'Részleg / Tagkönyvtár',
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
      name: 'avatar',
      type: 'relationship',
      relationTo: 'media',
      label: 'Profilkép / Fotó',
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
