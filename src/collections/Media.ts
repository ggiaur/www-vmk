import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Médiafájl',
    plural: 'Médiafájlok',
  },
  access: {
    // Media (images/PDFs on a public library site) should be viewable by
    // anyone. Any logged-in staff member (including `author` role) can upload
    // new media for their news/events; update/delete stay restricted to admin/editor.
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: adminOrEditorOnly,
    delete: adminOrEditorOnly,
  },
  admin: {
    group: 'Rendszer',
    useAsTitle: 'filename',
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: 400,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1200,
        height: 675,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Akadálymentesítés Alt Szöveg (WCAG 2.2 AA)',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Képaláírás / Megjegyzés',
    },
  ],
}
