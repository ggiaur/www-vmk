import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
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
