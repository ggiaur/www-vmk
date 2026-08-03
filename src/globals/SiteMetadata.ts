/**
 * SiteMetadata Global — Oldal-szintű SEO és analitika beállítások.
 *
 * Miért szükséges?
 * A Next.js metadata API (`generateMetadata`) jelenlegi implementációja
 * statikus értékeket ad vissza a layout.tsx-ekben. Ez a Global lehetővé
 * teszi, hogy a könyvtár kommunikációs munkatársa kód-módosítás nélkül
 * frissíthesse az oldal leírását, a Google Analytics/GTM azonosítót,
 * vagy az OpenGraph képet.
 *
 * Fontos: ezek az adatok az összes oldalon öröklödnek az alap layout-ból.
 * Oldal-specifikus meta adatok felülbírálhatók az egyes Pages collection
 * rekordjaiban (metaDescription mező).
 */
import type { GlobalConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const SiteMetadata: GlobalConfig = {
  slug: 'site-metadata',
  label: 'Oldal Metaadatok (SEO)',
  access: {
    read: () => true,
    update: adminOrEditorOnly,
  },
  admin: {
    group: 'Rendszer',
    description: 'Globális SEO beállítások, OpenGraph és analitika azonosítók — minden oldalra érvényes alap.',
    hideAPIURL: false,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      label: 'Oldal Neve (title suffix)',
      defaultValue: 'Vörösmarty Mihály Könyvtár',
      admin: {
        description: 'Minden böngészőfül cím végére kerül: pl. "Hírek | Vörösmarty Mihály Könyvtár"',
      },
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      label: 'Alap Meta Leírás',
      defaultValue: 'A Vörösmarty Mihály Könyvtár (VMK) Székesfehérvár egyik legnagyobb közkönyvtára. Hírek, rendezvények, tagkönyvtárak és szolgáltatások.',
      admin: {
        description: 'Ha az adott oldal Pages collection rekordja nem ad meg saját meta leírást, ez az alap kerül be.',
      },
    },
    {
      name: 'ogImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Alap OpenGraph Kép',
      admin: {
        description: 'Az oldal megosztásakor (Facebook, WhatsApp stb.) megjelenő kép. Ajánlott méret: 1200×630 px.',
      },
    },
    {
      name: 'canonicalBaseUrl',
      type: 'text',
      required: true,
      label: 'Canonical Alap URL',
      defaultValue: 'https://vmk.hu',
      admin: {
        description: 'A weboldal végleges, éles domain-je. Fontos: https:// előtag kötelező, perjel nélkül a végén.',
      },
    },
    {
      name: 'gtmId',
      type: 'text',
      label: 'Google Tag Manager Azonosító',
      admin: {
        description: 'Formátum: GTM-XXXXXXX. Ha üres, a GTM kód nem töltődik be.',
        placeholder: 'GTM-XXXXXXX',
      },
    },
    {
      name: 'gaId',
      type: 'text',
      label: 'Google Analytics Azonosító (GA4)',
      admin: {
        description: 'Formátum: G-XXXXXXXXXX. Csak akkor töltsd ki, ha NEM GTM-en keresztül töltöd be a GA4-et.',
        placeholder: 'G-XXXXXXXXXX',
      },
    },
    {
      name: 'robotsNoindex',
      type: 'checkbox',
      label: 'Teljes oldal indexelés letiltva (robots: noindex)',
      defaultValue: false,
      admin: {
        description: 'FIGYELEM: Ha bejelölöd, a Google nem fogja indexelni az oldalt. Csak staging/teszt környezetben használd!',
      },
    },
  ],
}
