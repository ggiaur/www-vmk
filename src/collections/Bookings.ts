import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: 'Foglalás',
    plural: 'Foglalások',
  },
  admin: {
    group: 'Foglalások és tranzakciók',
    useAsTitle: 'requesterName',
    defaultColumns: ['room', 'date', 'startTime', 'endTime', 'status'],
    description: 'Beérkezett teremfoglalási kérelmek kezelése.',
  },
  fields: [
    {
      name: 'room',
      type: 'relationship',
      relationTo: 'rooms',
      required: true,
      label: 'Terem',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Foglalás Dátuma',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'startTime',
      type: 'text',
      required: true,
      label: 'Kezdés (HH:mm)',
    },
    {
      name: 'endTime',
      type: 'text',
      required: true,
      label: 'Befejezés (HH:mm)',
    },
    {
      name: 'requesterName',
      type: 'text',
      required: true,
      label: 'Igénylő Neve',
    },
    {
      name: 'requesterEmail',
      type: 'email',
      required: true,
      label: 'Igénylő E-mail Címe',
    },
    {
      name: 'purpose',
      type: 'textarea',
      label: 'Foglalás Célja',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Függőben', value: 'pending' },
        { label: 'Jóváhagyva', value: 'confirmed' },
        { label: 'Elutasítva', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
