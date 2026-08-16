import { revalidatePath } from 'next/cache'

// Libraries.ts and OpeningHours.ts have no dynamic route segment of their
// own (unlike /hirek/[slug], /esemenyek/[slug], which Next renders
// on-demand per request because they have no generateStaticParams) --
// the fixed-path pages that read this data (getAllLibraries,
// getOpeningHoursForLibrary/getAllOpeningHours in src/lib/payload.ts) get
// fully static-prerendered at build time instead. Without this, an admin
// edit to a library's phone number or a day's opening hours would only
// ever show up on the next full `next build`, not on save -- reproduced
// live (D1 audit, 2026-08-16): editing Libraries[1].phone via the real
// admin UI changed the value in Postgres and the REST API immediately,
// but /kapcsolat kept serving the pre-edit build-time HTML.
//
// Fixed via Next's on-demand revalidation instead of making these pages
// `force-dynamic` (which would drop their caching benefit on every
// request, not just when the data actually changes): call this from
// Libraries/OpeningHours afterChange & afterDelete hooks.
const CONSUMING_PATHS = ['/', '/kapcsolat', '/nyitvatartas', '/reszlegek', '/tagkonyvtarak']

export function revalidateLibraryConsumingPages() {
  for (const path of CONSUMING_PATHS) revalidatePath(path)
}
