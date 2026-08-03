/**
 * OpeningHoursGlobal — Rendkívüli és ünnepi nyitvatartás admin-szerkeszthető táblázata.
 *
 * Miért Global és nem Collection?
 * Az OpeningHours Collection az ISMÉTLŐDŐ, heti rendszeres nyitvatartást
 * tárolja (pl. "Kossuth könyvtár, Hétfő: 10:00–18:00"). Ez a Global az
 * EGYSZERI, rendkívüli eseteket tárolja: ünnepnapok, nyári szünet, váratlan
 * zárás stb. — amiket a CMS-ből kell gyorsan frissíteni anélkül, hogy az
 * egész Collection-t módosítani kellene.
 *
 * A frontend /nyitvatartas oldal mindkettőt megjeleníti:
 *  1. A Collection-ből: heti mátrix
 *  2. Ebből a Global-ból: "Közelgő rendkívüli változások" szekció
 *
 * Jogosultság: admin ÉS editor (Főszerkesztő) szerkesztheti,
 * author (Könyvtáros) nem — a rendkívüli nyitvatartás intézményis döntés.
 */
import type { GlobalConfig } from 'payload'
import { adminOrEditorOnly } from '../lib/access'

export const OpeningHoursGlobal: GlobalConfig = {
  slug: 'opening-hours-global',
  label: 'Rendkívüli Nyitvatartás (Ünnepek & Szünet)',
  access: {
    read: () => true,
    update: adminOrEditorOnly,
  },
  admin: {
    group: 'Könyvtárak',
    description: 'Ünnepi, rendkívüli vagy ideiglenes nyitvatartási változások — ezek jelennek meg a /nyitvatartas oldal tetején kiemelve.',
    hideAPIURL: false,
  },
  fields: [
    {
      name: 'bannerMessage',
      type: 'text',
      label: 'Figyelemfelhívó Banner Üzenet',
      admin: {
        description: 'Ha ki van töltve, ez megjelenik az összes oldal tetején (pl. "2026. augusztus 20-án, nemzeti ünnepen a könyvtár zárva tart."). Ha üres, nem jelenik meg banner.',
        placeholder: 'pl. Augusztus 20-án, nemzeti ünnepen zárva tartunk.',
      },
    },
    {
      name: 'specialPeriods',
      type: 'array',
      label: 'Rendkívüli Nyitvatartási Időszakok',
      admin: {
        description: 'Ünnepnapok, nyári szünet, karácsonyi zárás stb. Az érvényességi dátum lejárta után töröld a listából.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Dátum',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'yyyy. MMMM d.',
            },
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Megnevezés',
          admin: {
            placeholder: 'pl. Húsvét hétfő, Nyári szünet első napja',
          },
        },
        {
          name: 'isClosed',
          type: 'checkbox',
          label: 'Ezen a napon ZÁRVA',
          defaultValue: true,
        },
        {
          name: 'openTime',
          type: 'text',
          label: 'Nyitás (HH:mm) — ha nem zárva',
          admin: {
            condition: (data) => !data?.isClosed,
            placeholder: '10:00',
          },
        },
        {
          name: 'closeTime',
          type: 'text',
          label: 'Zárás (HH:mm) — ha nem zárva',
          admin: {
            condition: (data) => !data?.isClosed,
            placeholder: '14:00',
          },
        },
        {
          name: 'affectedLibrary',
          type: 'relationship',
          relationTo: 'libraries',
          label: 'Csak erre a tagkönyvtárra vonatkozik (ha üres: minden helyszín)',
          admin: {
            description: 'Üres = intézményis zárás. Kitöltve = csak az adott tagkönyvtár érintett.',
          },
        },
      ],
    },
  ],
}
