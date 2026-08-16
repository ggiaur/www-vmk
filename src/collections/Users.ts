import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Felhasználó',
    plural: 'Felhasználók',
  },
  // No collection-level access was ever defined here at all -- the most
  // severe possible version of the E0-audited gap class, since an
  // implicit-allow here would mean anyone could self-register an admin
  // account via POST /api/users. Verified empirically it was NOT actually
  // exploitable: Payload's `auth: true` collections get safe built-in
  // defaults distinct from regular collections (anon create/read/update/
  // delete all returned 403 before this change too). Made explicit anyway
  // per E0 rather than relying on that undocumented distinction.
  //
  // F1 (ChatGPT review, 2026-08-16): the first version of this rule let
  // any authenticated user read the full users list -- too broad for
  // `author` (a "Könyvtáros Szerkesztő" has no legitimate reason to see
  // every other user's account). admin/editor keep full read (they
  // legitimately manage staff accounts); author is scoped to their own
  // record only, via the same query-constraint-return pattern
  // scopedToOwnLibrary uses elsewhere. Update stays admin/editor-or-self
  // (self-service profile edits); the sensitive `role` field is
  // separately field-gated to admin-only regardless (see below), so
  // neither rule can be used to self-promote.
  access: {
    create: adminOrEditorOnly,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'editor') return true
      return { id: { equals: user.id } }
    },
    update: ({ req: { user }, id }) => !!user && (user.role === 'admin' || user.role === 'editor' || user.id === id),
    delete: adminOrEditorOnly,
  },
  admin: {
    group: 'Rendszer',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Név',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      options: [
        {
          label: 'Adminisztrátor (Teljes hozzáférés)',
          value: 'admin',
        },
        {
          label: 'Főszerkesztő (Minden tartalom szerkesztése és publikálása)',
          value: 'editor',
        },
        {
          label: 'Könyvtáros Szerkesztő (Saját tagkönyvtár tartalmai)',
          value: 'author',
        },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      label: 'Szerepkör (RBAC)',
    },
    {
      name: 'assignedLibrary',
      type: 'relationship',
      relationTo: 'libraries',
      label: 'Hozzárendelt Tagkönyvtár',
      admin: {
        condition: (data) => data.role === 'author',
      },
    },
  ],
}
