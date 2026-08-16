import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'
import { revalidateLibraryConsumingPages } from '../lib/revalidateLibraryPages'

export const OpeningHours: CollectionConfig = {
  slug: 'opening-hours',
  labels: {
    singular: 'Nyitvatartási időszak',
    plural: 'Nyitvatartások',
  },
  hooks: {
    afterChange: [() => revalidateLibraryConsumingPages()],
    afterDelete: [() => revalidateLibraryConsumingPages()],
  },
  access: {
    // Only `read` was ever defined here -- Payload's default for the
    // unset create/update/delete operations is to allow everyone,
    // unauthenticated included, same class of gap as Bookings/
    // Registrations/DonationPledges (see those files / COLLAB.md Phase
    // B). Publicly-visible opening hours content, so read stays public;
    // write/delete restricted to staff.
    read: () => true,
    create: adminOrEditorOnly,
    update: adminOrEditorOnly,
    delete: adminOrEditorOnly,
  },
  admin: {
    group: 'Könyvtárak',
    useAsTitle: 'specialNote',
    defaultColumns: ['library', 'dayOfWeek', 'openTime', 'closeTime', 'isClosed'],
    description: 'Nyitvatartási idők tagkönyvtáranként és naponként.',
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
