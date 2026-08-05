import type { CollectionConfig } from 'payload'

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: {
    singular: 'Galéria',
    plural: 'Galériák',
  },
  access: {
    read: () => true,
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
