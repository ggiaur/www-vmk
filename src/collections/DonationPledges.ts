import type { CollectionConfig } from 'payload'

// No live payment gateway is configured (needs real Stripe/Barion/SimplePay
// credentials at deployment time). This collection captures support intent
// so a staff member can follow up manually — it does not process payments.
export const DonationPledges: CollectionConfig = {
  slug: 'donation-pledges',
  admin: {
    group: 'Foglalások és tranzakciók',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'amount', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Név',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-mail Cím',
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Felajánlott Összeg (Ft, opcionális)',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Üzenet',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'Új', value: 'new' },
        { label: 'Felvettük a kapcsolatot', value: 'contacted' },
        { label: 'Lezárva', value: 'completed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
