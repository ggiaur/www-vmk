import type { CollectionConfig } from 'payload'

export const OpeningHours: CollectionConfig = {
  slug: 'opening-hours',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'specialNote',
    defaultColumns: ['library', 'dayOfWeek', 'openTime', 'closeTime', 'isClosed'],
  },
  fields: [
    {
      name: 'library',
      type: 'relationship',
      relationTo: 'libraries',
      required: true,
      label: 'Hozzárendelt Tagkönyvtár / Részleg',
    },
    {
      name: 'dayOfWeek',
      type: 'select',
      required: true,
      options: [
        { label: 'Hétfő', value: 'monday' },
        { label: 'Kedd', value: 'tuesday' },
        { label: 'Szerda', value: 'wednesday' },
        { label: 'Csütörtök', value: 'thursday' },
        { label: 'Péntek', value: 'friday' },
        { label: 'Szombat', value: 'saturday' },
        { label: 'Vasárnap', value: 'sunday' },
      ],
      label: 'A Hét Napja',
    },
    {
      name: 'openTime',
      type: 'text',
      label: 'Nyitás Időpontja (pl. 08:00)',
      admin: {
        condition: (data) => !data?.isClosed,
      },
    },
    {
      name: 'closeTime',
      type: 'text',
      label: 'Zárás Időpontja (pl. 17:00)',
      admin: {
        condition: (data) => !data?.isClosed,
      },
    },
    {
      name: 'isClosed',
      type: 'checkbox',
      defaultValue: false,
      label: 'Ezen a napon ZÁRVA',
    },
    {
      name: 'specialNote',
      type: 'text',
      label: 'Különleges Megjegyzés (pl. Ünnepi / nyári nyitvatartás)',
    },
  ],
}
