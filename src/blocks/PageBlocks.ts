import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero Szekció', plural: 'Hero Szekciók' },
  fields: [
    { name: 'heading', type: 'text', required: true, label: 'Főcím' },
    { name: 'subheading', type: 'textarea', label: 'Alcím' },
    { name: 'image', type: 'relationship', relationTo: 'media', label: 'Háttérkép' },
    { name: 'ctaLabel', type: 'text', label: 'Gomb Szövege' },
    { name: 'ctaHref', type: 'text', label: 'Gomb Célja (URL)' },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Szövegblokk', plural: 'Szövegblokkok' },
  fields: [{ name: 'content', type: 'richText', required: true, label: 'Tartalom' }],
}

export const ContactInfoBlock: Block = {
  slug: 'contactInfo',
  labels: { singular: 'Elérhetőség Blokk', plural: 'Elérhetőség Blokkok' },
  fields: [
    { name: 'title', type: 'text', label: 'Cím' },
    { name: 'address', type: 'text', label: 'Postai Cím' },
    { name: 'phone', type: 'text', label: 'Telefonszám' },
    { name: 'email', type: 'email', label: 'E-mail Cím' },
    { name: 'mapEmbedUrl', type: 'text', label: 'Térkép Beágyazási URL (iframe src)' },
  ],
}

export const DownloadsBlock: Block = {
  slug: 'downloads',
  labels: { singular: 'Letöltések Blokk', plural: 'Letöltések Blokkok' },
  fields: [
    { name: 'title', type: 'text', label: 'Blokk Címe' },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      label: 'Kapcsolódó Dokumentumok',
    },
  ],
}

export const AccordionBlock: Block = {
  slug: 'accordion',
  labels: { singular: 'GYIK / Harmonika Blokk', plural: 'GYIK / Harmonika Blokkok' },
  fields: [
    { name: 'title', type: 'text', label: 'Blokk Címe' },
    {
      name: 'items',
      type: 'array',
      label: 'Kérdések',
      fields: [
        { name: 'question', type: 'text', required: true, label: 'Kérdés' },
        { name: 'answer', type: 'richText', required: true, label: 'Válasz' },
      ],
    },
  ],
}

export const PartnersGridBlock: Block = {
  slug: 'partnersGrid',
  labels: { singular: 'Partnerek / Támogatók Blokk', plural: 'Partnerek / Támogatók Blokkok' },
  fields: [
    { name: 'title', type: 'text', label: 'Blokk Címe' },
    {
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      label: 'Megjelenítendő Partnerek/Támogatók',
    },
  ],
}

export const PageBlocks: Block[] = [
  HeroBlock,
  RichTextBlock,
  ContactInfoBlock,
  DownloadsBlock,
  AccordionBlock,
  PartnersGridBlock,
]
