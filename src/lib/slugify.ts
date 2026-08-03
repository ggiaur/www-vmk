/**
 * slugify.ts — Magyar ékezetes karaktereket is kezelő slug-generáló segédfüggvény.
 *
 * Miért szükséges?
 * A News, Events, Pages, Services collection-öknél a slug mező jelenleg
 * manuálisan töltendő ki, ami szerkesztői hibák forrása (pl. ékezetes slug,
 * nagybetűs slug, szóközzel kezdődő slug). Ez a helper a title mezőből
 * automatikusan állítja elő a helyes slug-ot a beforeChange hook-on keresztül.
 *
 * Szabályok:
 *  - Kisbetűs
 *  - Magyar ékezetek → ASCII (á→a, é→e, í→i, ó→o, ö→o, ő→o, ú→u, ü→u, ű→u)
 *  - Szóközök és speciális karakterek → kötőjel
 *  - Több egymást követő kötőjel → egy kötőjel
 *  - Vezető/záró kötőjel eltávolítva
 *  - Max 100 karakter (DB unique index limit kompatibilis)
 *
 * Használat:
 *   import { generateSlug } from '../lib/slugify'
 *   // beforeChange hook-ban:
 *   if (!data.slug && data.title) {
 *     data.slug = generateSlug(data.title)
 *   }
 */
export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/[óő]/g, 'o')
    .replace(/[öő]/g, 'o')
    .replace(/[úű]/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')   // nem-alfanumerikus karakterek törlése
    .replace(/[\s_]+/g, '-')         // szóköz/aláhúzás → kötőjel
    .replace(/-+/g, '-')             // több kötőjel → egy kötőjel
    .replace(/^-+|-+$/g, '')         // vezető/záró kötőjel törlése
    .slice(0, 100)                   // max hossz
}
