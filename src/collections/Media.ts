import type { CollectionConfig } from 'payload'

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
