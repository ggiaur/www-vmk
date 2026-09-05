import type { CollectionConfig } from 'payload'
import { adminOrEditorFieldAccess, adminOrEditorOnly } from '../lib/access'

// Clone of the reference site's /wishbasket comment form
// (POST /wishbasket/postComment) -- see WishRequests.ts for the shared
// access-control pattern and reasoning.
export const WishComments: CollectionConfig = {
  slug: 'wish-comments',
  labels: {
    singular: 'Kívánságkosár Hozzászólás',
    plural: 'Kívánságkosár Hozzászólások',
  },
  admin: {
    group: 'Foglalások és tranzakciók',
    useAsTitle: 'comment',
    defaultColumns: ['shownName', 'comment', 'status', 'createdAt'],
    description: 'A /wishbasket oldal hozzászólás-űrlapján beküldött vélemények moderálása.',
  },
  access: {
    create: adminOrEditorOnly,
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
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-mail Cím',
      access: { read: adminOrEditorFieldAccess },
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      label: 'Hozzászólás',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Beérkezett', value: 'pending' },
        { label: 'Jóváhagyva (publikus)', value: 'approved' },
        { label: 'Elutasítva', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
