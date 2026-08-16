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
    // anyone — only the admin panel write operations stay behind auth.
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
