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

// Allowlisted embed hosts only -- this field is populated by the migration
// scraper from external HTML (src/lib/scraper/vmkPageScraper.ts), so unlike
// ContactInfoBlock's admin-authored mapEmbedUrl, its value isn't purely
// admin-trusted input. The renderer re-validates against this same list
// before emitting an <iframe> (see PageBlockRenderer.tsx).
export const VIDEO_EMBED_ALLOWED_HOSTS = ['fehervartv.hu', 'www.fehervartv.hu']

export const VideoEmbedBlock: Block = {
  slug: 'videoEmbed',
  labels: { singular: 'Videó Beágyazás', plural: 'Videó Beágyazások' },
  fields: [
    { name: 'title', type: 'text', label: 'Cím' },
    {
      name: 'embedUrl',
      type: 'text',
      required: true,
      label: 'Beágyazási URL (iframe src)',
      admin: { description: `Csak engedélyezett forrás: ${VIDEO_EMBED_ALLOWED_HOSTS.join(', ')}` },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value) return 'Kötelező mező'
        try {
          const host = new URL(value).hostname
          return VIDEO_EMBED_ALLOWED_HOSTS.includes(host) || `Nem engedélyezett host: ${host}`
        } catch {
          return 'Érvénytelen URL'
        }
      },
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
  VideoEmbedBlock,
]
