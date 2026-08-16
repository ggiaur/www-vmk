import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: {
    singular: 'Munkatárs',
    plural: 'Munkatársak',
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
    group: 'Könyvtárak',
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'department', 'email', 'order'],
    description: 'Könyvtári munkatársak és elérhetőségeik.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Munkatárs Neve',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'URL Slug (egyéni profiloldalhoz)',
      admin: {
        position: 'sidebar',
        description: 'Ha üres, nincs egyéni profiloldala (csak a listában szerepel).',
      },
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
