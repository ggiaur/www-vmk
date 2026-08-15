import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: 'Foglalás',
    plural: 'Foglalások',
  },
  // No access block previously existed, which means Payload's default
  // (allow everyone, unauthenticated included) applied: any anonymous
  // request could list every requester's name/email/purpose, or update/
  // delete other people's bookings, via the REST/GraphQL API or admin
  // Local API. The real public submission path (submitBooking ->
  // createBookingAtomically in src/lib/payload.ts) writes with raw SQL
  // over payload.db.pool, not payload.create() -- it does not go through
  // this access layer at all, so restricting it to staff cannot break the
  // public teremfoglalás form.
  access: {
    create: adminOrEditorOnly,
    read: adminOrEditorOnly,
    update: adminOrEditorOnly,
    delete: adminOrEditorOnly,
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
