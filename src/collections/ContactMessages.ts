import type { CollectionConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

// A /kapcsolat oldal üzenetküldő űrlapja korábban egy teljesen "halott"
// <form> volt: nem volt sem action, sem onSubmit handlere, és az input
// mezőknek még name attribútuma sem. A látogató kitöltötte, elküldte, a
// böngésző egy üres GET-tel újratöltötte az oldalt — az üzenet nyomtalanul
// elveszett. A required mezők miatt viszont a felhasználó azt hihette,
// hogy sikeresen elküldte.
//
// Ez a gyűjtemény tárolja a beérkező megkereséseket, hogy a munkatársak az
// admin felületen lássák és megválaszolhassák őket. Ugyanaz a minta, mint a
// DonationPledges: nincs automatikus e-mail-küldés (nincs konfigurált SMTP
// vagy tranzakciós e-mail szolgáltató), a feldolgozás emberi munkafolyamat.
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: {
    singular: 'Kapcsolatfelvételi üzenet',
    plural: 'Kapcsolatfelvételi üzenetek',
  },
  admin: {
    group: 'Foglalások és tranzakciók',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
  },
  access: {
    // A nyilvános űrlap beküldése a submitContactMessage Server Action-ön
    // keresztül fut a Local API-val (ami felülbírálja ezt az access beállítást).
    // Gyűjteményszinten a create-et is munkatársakra korlátozzuk, hogy ne
    // lehessen névtelenül, közvetlenül a REST API-n át szpemmelni.
    create: adminOrEditorOnly,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Teljes Név',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-mail Cím',
    },
    {
      name: 'subject',
      type: 'select',
      required: true,
      defaultValue: 'general',
      label: 'Tárgy / Téma',
      // Az értékkészletnek egyeznie kell a /kapcsolat oldal <select>
      // mezőjének option value-ival.
      options: [
        { label: 'Általános érdeklődés', value: 'general' },
        { label: 'Könyvhosszabbítás / Kölcsönzés', value: 'lending' },
        { label: 'Rendezvény regisztráció', value: 'event' },
        { label: 'Terembérlés', value: 'room' },
        { label: 'Helyismereti kutatás', value: 'local-history' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Üzenet szövege',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: 'Állapot',
      options: [
        { label: 'Új', value: 'new' },
        { label: 'Folyamatban', value: 'in-progress' },
        { label: 'Megválaszolva', value: 'answered' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
