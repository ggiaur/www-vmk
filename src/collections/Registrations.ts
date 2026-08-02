import type { CollectionConfig } from 'payload'

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  labels: {
    singular: 'Jelentkezés',
    plural: 'Jelentkezések',
  },
  admin: {
    group: 'Foglalások és tranzakciók',
    useAsTitle: 'name',
    defaultColumns: ['event', 'name', 'email', 'guestCount', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      label: 'Rendezvény',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Jelentkező Neve',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-mail Cím',
    },
    {
      name: 'guestCount',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      label: 'Résztvevők Száma (jelentkezővel együtt)',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'confirmed',
      options: [
        { label: 'Visszaigazolva', value: 'confirmed' },
        { label: 'Lemondva', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
