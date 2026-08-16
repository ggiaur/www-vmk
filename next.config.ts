import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'www.vmk.hu',
      },
    ],
  },
  async redirects() {
    return [
      // 301 Permanent Redirects mapped from legacy www.vmk.hu URLs.
      // Source & mapping table: docs/SCRAPE_URL_INVENTORY.md.
      // Individual scraped news-article slugs (old: /<slug>, new: /hirek/<slug>)
      // are NOT hardcoded here — see middleware.ts, which redirects any
      // unmatched root-level path to /hirek/<slug> if that News document
      // exists, so this list doesn't need updating every migration run.
      {
        source: '/nyari-nyitvatartas-2026',
        destination: '/hirek/nyari-nyitvatartas-2026',
        permanent: true,
      },
      // Tagkönyvtárak
      {
        source: '/budai-uti-tagkonyvtar',
        destination: '/tagkonyvtarak/budai-ut',
        permanent: true,
      },
      {
        source: '/meszoly-geza-utcai-tagkonyvtar',
        destination: '/tagkonyvtarak/meszoly-geza',
        permanent: true,
      },
      {
        source: '/szena-teri-tagkonyvtar',
        destination: '/tagkonyvtarak/szena-ter',
        permanent: true,
      },
      {
        source: '/tolnai-utcai-tagkonyvtar',
        destination: '/tagkonyvtarak/tolnai-ut',
        permanent: true,
      },
      {
        source: '/zsolt-utcai-tagkonyvtar',
        destination: '/tagkonyvtarak/zsolt-ut',
        permanent: true,
      },
      // Részlegek
      {
        source: '/felnott-kolcsonzo-reszleg',
        destination: '/reszlegek/felnott-kolcsonzo',
        permanent: true,
      },
      { source: '/olvasoterem', destination: '/reszlegek/olvasoterem', permanent: true },
      { source: '/koteszet', destination: '/reszlegek/koteszet', permanent: true },
      { source: '/pedagogiai-reszleg', destination: '/reszlegek/pedagogiai-reszleg', permanent: true },
      // Rólunk / intézményi oldalak — régi URL-ek átirányítása az új belső oldalakra
      { source: '/alapdokumentumok', destination: '/dokumentumok', permanent: true },
      { source: '/projektek', destination: '/nka-palyazatok', permanent: true },
      { source: '/tamogatok-2022', destination: '/tamogatas', permanent: true },
      { source: '/partnerkonyvtarunk', destination: '/tamogatas', permanent: true },
      {
        source: '/tamogatok-egyuttmukodo-partnerek',
        destination: '/tamogatas',
        permanent: true,
      },
      { source: '/egyuttmukodo-partnereink', destination: '/tamogatas', permanent: true },
      { source: '/egyuttmukodo-partnerek-2022', destination: '/tamogatas', permanent: true },
      { source: '/konyvtarunk-rovid-tortenete', destination: '/konyvtarunkrol', permanent: true },
      // Egyéb
      { source: '/gallery', destination: '/galeria', permanent: true },
      { source: '/opening-hours', destination: '/nyitvatartas', permanent: true },
      { source: '/page/menu/336', destination: '/programarchivum', permanent: true },
      // Legacy CMS listing/stub URLs -- same content family as an existing
      // route, no dedicated page needed. See docs/FIRST_HOP_ROUTE_MATRIX.md.
      { source: '/events', destination: '/esemenyek', permanent: true },
      { source: '/news', destination: '/hirek', permanent: true },
      { source: '/start/index/lang/hu', destination: '/', permanent: true },
      { source: '/start/index/lang/en', destination: '/', permanent: true },
      { source: '/start/index/lang/de', destination: '/', permanent: true },
      // Old site's accessibility-mode toggle stub (itself a redirect on
      // vmk.hu, not a distinct page); no equivalent feature on the clone.
      { source: '/page/blind', destination: '/', permanent: false },
      // A2b legacy closure: these yearly program-archive stub URLs are
      // themselves empty on the live reference site now (verified: 0 chars
      // of real body text under the page title, for every one of them) --
      // there is no content left to migrate. /programarchivum is the site's
      // current equivalent for browsing the program archive, so redirect
      // there rather than leaving a real 404 or fabricating page content
      // for a page the source site itself no longer has.
      { source: '/programok-2012', destination: '/programarchivum', permanent: true },
      { source: '/programok-2013', destination: '/programarchivum', permanent: true },
      { source: '/programok-2014', destination: '/programarchivum', permanent: true },
      { source: '/programok-2015', destination: '/programarchivum', permanent: true },
      { source: '/programok-2016', destination: '/programarchivum', permanent: true },
      { source: '/programok-2017', destination: '/programarchivum', permanent: true },
      { source: '/programok-2018', destination: '/programarchivum', permanent: true },
      { source: '/programok-2019-1', destination: '/programarchivum', permanent: true },
      { source: '/programok-2020', destination: '/programarchivum', permanent: true },
      { source: '/programok-2022', destination: '/programarchivum', permanent: true },
      { source: '/muzeumok-ejszakaja-2018', destination: '/programarchivum', permanent: true },
      // E1/E2 depth-2 closure: same pattern as above -- both empty on the
      // live reference (0 chars of body text), redirected to the closest
      // existing modern equivalent (the page that actually linked to them)
      // instead of fabricating content for pages the source no longer has.
      { source: '/marai-programok-a-konyvtarban', destination: '/nka-palyazatok', permanent: true },
      { source: '/teritesi-dijak', destination: '/szolgaltatasok', permanent: true },
      // F2 (ChatGPT review): the reference site's own two dead depth-2
      // links, closed with controlled canonical redirects instead of
      // staying BROKEN, even though neither link actually appears
      // anywhere in our own cloned content (verified: grepped the
      // rendered /unnepi-konyvhet-2022 and /reszlegek/pedagogiai-reszleg
      // pages for both hrefs, zero matches -- the scrape/template
      // pipeline never carried them over) -- these redirects only guard
      // against someone hitting the old URL directly (bookmarks, search
      // engine index, a hand-typed link).
      //
      // /pedagogiai-szakkonyvtar: on the reference, this is a "back to
      // top of page" link on /pedagogiai-reszleg pointing at what was
      // evidently this department's URL before a rename -- not a
      // distinct page, so redirected to the department's real current
      // route.
      { source: '/pedagogiai-szakkonyvtar', destination: '/reszlegek/pedagogiai-reszleg', permanent: true },
      // /kozott-kiallitas: an image-only link (no anchor text) on
      // /unnepi-konyvhet-2022 for a named 2022 exhibition program
      // ("Között - kiállítás") that no longer has its own page on the
      // reference at all -- no modern equivalent exists, so redirected
      // to the event page that actually listed it (matches the
      // A2b precedent for reference-side content that's genuinely gone).
      { source: '/kozott-kiallitas', destination: '/unnepi-konyvhet-2022', permanent: true },
    ]
  },
}

export default withPayload(nextConfig)
