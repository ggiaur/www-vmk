/**
 * FooterSettings Global — A lábléc admin-szerkeszthető tartalmai.
 *
 * A valódi vmk.hu lábléce 3 oszlopos elrendezésű:
 *  1. oszlop: Intézményi adatok (cím, telefon, e-mail, nyitvatartás összefoglaló)
 *  2. oszlop: Gyors linkek (belső oldalak listája)
 *  3. oszlop: Közösségi média + esetleges logók
 *
 * + Jogi sáv: copyright szöveg, adatvédelmi tájékoztató link,
 *   akadálymentesítési nyilatkozat link.
 *
 * Ezek az adatok jelenleg hardcoded-ek a Footer.tsx komponensben —
 * ez a Global teszi őket CMS-ből szerkeszthetővé, kód-módosítás nélkül.
 */
import type { GlobalConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const FooterSettings: GlobalConfig = {
  slug: 'footer-settings',
  label: 'Lábléc Beállítások',
  access: {
    read: () => true,
    update: adminOrEditorOnly,
  },
  admin: {
    group: 'Rendszer',
    description: 'A weboldal lábléce (3 oszlop + jogi sáv) szerkeszthető tartalmai.',
    hideAPIURL: false,
  },
  fields: [
    // --- 1. Oszlop: Intézményi adatok ---
    {
      name: 'institutionName',
      type: 'text',
      label: 'Intézmény Neve (1. oszlop)',
      defaultValue: 'Vörösmarty Mihály Könyvtár',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Cím',
      defaultValue: '8000 Székesfehérvár, Kossuth u. 3.',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefonszám',
      defaultValue: '+36 22 313-971',
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mail Cím',
      defaultValue: 'vmk@vmk.hu',
    },
    {
      name: 'openingHoursSummary',
      type: 'textarea',
      label: 'Nyitvatartás Összefoglaló (szabad szöveg)',
      defaultValue: 'H–P: 10:00–18:00\nSzo: 10:00–14:00\nV: Zárva',
      admin: {
        description: 'Rövid összefoglaló a lábléc 1. oszlopához — a részletes mátrix a /nyitvatartas oldalon.',
      },
    },
    // --- 2. Oszlop: Gyors linkek ---
    {
      name: 'quickLinks',
      type: 'array',
      label: 'Gyors Linkek (2. oszlop)',
      admin: {
        description: 'Belső oldalak listája a lábléc középső oszlopában.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Felirat',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
    // --- 3. Oszlop: Közösségi média ---
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'Facebook oldal URL',
      admin: {
        description: 'pl. https://www.facebook.com/vmkhu',
      },
    },
    {
      name: 'instagramUrl',
      type: 'text',
      label: 'Instagram profil URL',
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube csatorna URL',
    },
    // --- Jogi sáv ---
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Copyright Szöveg',
      defaultValue: '© Vörösmarty Mihály Könyvtár',
      admin: {
        description: 'Az év automatikusan hozzáadódik — nem kell ide beleírni.',
      },
    },
    {
      name: 'privacyUrl',
      type: 'text',
      label: 'Adatvédelmi Tájékoztató URL',
      defaultValue: '/adatvedelmi-tajekoztato',
    },
    {
      name: 'accessibilityStatementUrl',
      type: 'text',
      label: 'Akadálymentesítési Nyilatkozat URL',
      defaultValue: '/akadalymentesites',
    },
  ],
}
