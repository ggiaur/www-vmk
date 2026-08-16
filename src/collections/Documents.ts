import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: 'Dokumentum',
    plural: 'Dokumentumok',
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
    defaultColumns: ['title', 'category', 'year', 'downloadCount'],
    description: 'Letölthető PDF dokumentumok: szabályzatok, beszámolók, űrlapok.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Dokumentum Címe',
    },
    {
      name: 'file',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      label: 'Csatolt Fájl',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'SZMSZ & Szabályzatok', value: 'szmsz' },
        { label: 'Éves Beszámolók', value: 'report' },
        { label: 'Pályázati Kiírások', value: 'grant' },
        { label: 'Letölthető Űrlapok', value: 'form' },
        { label: 'Egyéb Hivatalos Iratok', value: 'other' },
      ],
      defaultValue: 'other',
      label: 'Kategória',
    },
    {
      name: 'year',
      type: 'number',
      label: 'Vonatkozó Év',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      label: 'Letöltések Száma',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      unique: true,
      label: 'Forrás URL (migráció)',
      admin: {
        position: 'sidebar',
        description: 'A régi vmk.hu-n lévő eredeti PDF URL-je — a migrációs duplikátum-szűrés ez alapján dolgozik, mivel több dokumentum azonos címmel, eltérő dátumú verzióban létezik.',
      },
    },
  ],
}
