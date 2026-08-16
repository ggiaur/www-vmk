import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

// A valós vmk.hu lábléce tartalmaz egy "Hírlevél" feliratkozó űrlapot
// (e-mail + név + adatkezelési hozzájárulás). Ugyanazt a hibaosztályt
// kerüljük el, mint a /kapcsolat űrlapnál: nem statikus <form>-ot építünk
// action nélkül, hanem valódi, ellenőrzött beküldést.
export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: {
    singular: 'Hírlevél-feliratkozó',
    plural: 'Hírlevél-feliratkozók',
  },
  admin: {
    group: 'Foglalások és tranzakciók',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
  },
  access: {
    create: adminOrEditorOnly,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'E-mail cím',
    },
    {
      name: 'name',
      type: 'text',
      label: 'Név (opcionális)',
    },
  ],
}
