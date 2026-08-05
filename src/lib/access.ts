import type { Access, CollectionBeforeChangeHook, FieldAccess } from 'payload'
import { APIError } from 'payload'

// A "Könyvtáros Szerkesztő" szerepkör a Users.ts-ben mindig is definiálva
// volt "Saját tagkönyvtár tartalmai" leírással és assignedLibrary mezővel,
// de ezt a korlátozást SEMMILYEN más gyűjtemény nem érvényesítette - egy
// author szerepkörű felhasználó bármely tagkönyvtár/részleg tartalmát
// szerkeszthette. Ez a helper adja a tényleges érvényesítést:
//   - admin, editor: teljes hozzáférés
//   - author: csak azokhoz a rekordokhoz fér hozzá írásra, amiknek a
//     `libraryField` mezője megegyezik a saját assignedLibrary-jével
export function scopedToOwnLibrary(libraryField: string): Access {
  return ({ req: { user } }) => {
    if (!user) return false
    if (user.role === 'admin' || user.role === 'editor') return true
    if (user.role === 'author' && user.assignedLibrary) {
      const libId = typeof user.assignedLibrary === 'object' ? user.assignedLibrary.id : user.assignedLibrary
      return { [libraryField]: { equals: libId } }
    }
    return false
  }
}

// Ugyanaz, mint scopedToOwnLibrary, de arra az esetre, amikor a gyűjtemény
// MAGA a könyvtár/tagkönyvtár rekord (pl. Libraries) - itt nem egy külső
// relation-mezőt hasonlítunk, hanem magát a rekord `id`-ját az assignedLibrary-hez.
export const scopedToOwnLibraryRecord: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true
  if (user.role === 'author' && user.assignedLibrary) {
    const libId = typeof user.assignedLibrary === 'object' ? user.assignedLibrary.id : user.assignedLibrary
    return { id: { equals: libId } }
  }
  return false
}

// Csak admin/editor hozhat létre - author nem hozhat létre önállóan új
// rekordot más könyvtár nevében (a mezőszintű alapértelmezés a sajátjára
// állítható, de a létrehozás jogát admin/editor-ra korlátozzuk, hogy ne
// tudjon más könyvtárnak címzett tartalmat indítani).
export const adminOrEditorOnly: Access = ({ req: { user } }) =>
  !!user && (user.role === 'admin' || user.role === 'editor')

// Mező-szintű: az assignedLibrary/relatedLibrary mezőt csak admin/editor
// módosíthatja szabadon; author a sajátjára van korlátozva a fenti
// dokumentum-szintű access által, itt csak azt zárjuk ki, hogy MÁS
// mezőn keresztül admin-jogot szerezzen.
export const adminOrEditorFieldAccess: FieldAccess = ({ req: { user } }) =>
  !!user && (user.role === 'admin' || user.role === 'editor')

// Publikálás jóváhagyás: a szerkesztő (author/Könyvtáros) menthet vázlatot,
// de a "Publikálás" gomb (data._status === 'published') csak admin vagy
// editor (Főszerkesztő) számára engedélyezett. Default-deny: bármi, ami
// nem kifejezetten admin/editor (beleértve a hiányzó/anonim felhasználót
// is), publikálási kísérletnél hibát kap. A collection update access-e
// enged szerkesztést az author számára is - ez a hook csak a publikált
// állapotba váltást zárja le, a vázlat-mentést nem.
export const restrictPublishToEditors: CollectionBeforeChangeHook = ({ data, req }) => {
  const role = req.user?.role
  if (data?._status === 'published' && role !== 'admin' && role !== 'editor') {
    throw new APIError(
      'Nincs jogosultságod tartalom publikálásához — mentsd vázlatként, admin vagy szerkesztő fogja jóváhagyni és publikálni.',
      403,
    )
  }
  return data
}
