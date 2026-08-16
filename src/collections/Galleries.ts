import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: {
    singular: 'Galéria',
    plural: 'Galériák',
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
    defaultColumns: ['title', 'slug', 'eventDate'],
    description: 'Fotógalériák rendezvényekhez és könyvtári eseményekhez.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Galéria Címe',
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
      name: 'eventDate',
      type: 'date',
      label: 'Esemény Dátuma',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedEvent',
      type: 'relationship',
      relationTo: 'events',
      label: 'Kapcsolódó Rendezvény',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Borítókép',
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Galéria Képei',
    },
  ],
}
