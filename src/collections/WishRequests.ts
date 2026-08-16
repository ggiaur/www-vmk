import type { CollectionConfig } from 'payload'
import { adminOrEditorFieldAccess, adminOrEditorOnly } from '../lib/access'

// Clone of the reference site's /wishbasket book-request form
// (https://www.vmk.hu/wishbasket -> POST /wishbasket/postWish). Real
// persistence + admin moderation, not a static page. Public submission
// goes through submitWishRequest() in src/app/actions.ts using the Local
// API (bypasses this access config by default, same pattern already used
// for DonationPledges) -- collection-level `create` stays staff-only so a
// direct REST/GraphQL POST can't write here.
export const WishRequests: CollectionConfig = {
  slug: 'wish-requests',
  labels: {
    singular: 'Könyvkívánság',
    plural: 'Könyvkívánságok',
  },
  admin: {
    group: 'Foglalások és tranzakciók',
    useAsTitle: 'title',
    defaultColumns: ['title', 'writer', 'shownName', 'status', 'createdAt'],
    description: 'A /wishbasket űrlapon beküldött könyvigénylések moderálása.',
  },
  access: {
    create: adminOrEditorOnly,
    // Public (anonymous) reads only see approved wishes, and even then
    // only through the field-level access below -- name/email/library
    // card stay staff-only regardless of document status.
    read: ({ req: { user } }) => (user ? true : { status: { equals: 'approved' } }),
    update: adminOrEditorOnly,
    delete: adminOrEditorOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Valódi Név',
      access: { read: adminOrEditorFieldAccess },
    },
    {
      name: 'shownName',
      type: 'text',
      label: 'Megjelenített Név',
      admin: { description: 'Ha üres, a publikus listán "Olvasónk" jelenik meg.' },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-mail Cím',
      access: { read: adminOrEditorFieldAccess },
    },
    {
      name: 'libraryCard',
      type: 'text',
      required: true,
      label: 'Olvasójegy Száma',
      access: { read: adminOrEditorFieldAccess },
    },
    {
      name: 'writer',
      type: 'text',
      required: true,
      label: 'Szerző',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Cím',
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Beküldő Megjegyzése',
      access: { read: adminOrEditorFieldAccess },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Beérkezett', value: 'pending' },
        { label: 'Jóváhagyva (publikus listán látszik)', value: 'approved' },
        { label: 'Beszerezve', value: 'fulfilled' },
        { label: 'Elutasítva', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'adminNote',
      type: 'text',
      label: 'Publikus Státusz-megjegyzés',
      admin: {
        position: 'sidebar',
        description: 'Pl. "Beszerezve, 2026. augusztus" -- ez jelenik meg a publikus listán a beküldő megjegyzése helyett.',
      },
    },
  ],
}
