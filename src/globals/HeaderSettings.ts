/**
 * HeaderSettings Global — A főoldali fejléc admin-szerkeszthető tartalmai.
 *
 * Miért Global és nem Collection?
 * A fejlécből pontosan EGY példány létezik a teljes oldalon — nincs szükség
 * több rekordra. A Payload CMS "Globals" funkciója pontosan erre való:
 * egyedi, singleton rekordok admin-szerkeszthetővé tételére.
 *
 * Szerkeszthető elemek:
 *  - Katalógus gomb URL-je (OPAC link) — jelenleg hardcoded a frontenden
 *  - Intézményi telefonszám (TopBar)
 *  - Intézményi e-mail (TopBar)
 *  - Fő navigációs menüpontok (label + URL párok)
 */
import type { GlobalConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const HeaderSettings: GlobalConfig = {
  slug: 'header-settings',
  label: 'Fejléc Beállítások',
  access: {
    read: () => true,
    update: adminOrEditorOnly,
  },
  admin: {
    group: 'Rendszer',
    description: 'A weboldal fejlécének (TopBar, navigáció, katalógus gomb) szerkeszthető tartalmai.',
    hideAPIURL: false,
  },
  fields: [
    {
      name: 'topBarPhone',
      type: 'text',
      label: 'Telefonszám (TopBar)',
      defaultValue: '+36 22 313-971',
      admin: {
        description: 'Megjelenik a fejléc tetején lévő kontaktsávban.',
      },
    },
    {
      name: 'topBarEmail',
      type: 'email',
      label: 'E-mail Cím (TopBar)',
      defaultValue: 'vmk@vmk.hu',
    },
    {
      name: 'catalogUrl',
      type: 'text',
      label: 'OPAC Katalógus URL',
      defaultValue: 'https://vmk.ik.hu',
      admin: {
        description: 'A "Katalógus" gomb céloldala. Általában az OPAC (WebPAC/Koha) rendszer URL-je.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Fő Navigációs Menüpontok',
      admin: {
        description: 'A fejléc navigációs sávjában megjelenő menüpontok sorrendben. Módosítsd a sorrendet az egérrel.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Megjelenített Felirat',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Hivatkozás (URL)',
          admin: {
            description: 'Belső oldalnál pl. /hirek, külsőnél teljes URL pl. https://vmk.ik.hu',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Új ablakban nyílik meg',
          defaultValue: false,
        },
      ],
    },
  ],
}
