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
      { source: '/pedagogiai-reszleg', destination: '/reszlegek/pedagogia', permanent: true },
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
      // Használat
      {
        source: '/konyvtarkozi-kolcsonzes',
        destination: '/hasznalat/konyvtarkozi-kolcsonzes',
        permanent: true,
      },
      // Egyéb
      { source: '/gallery', destination: '/galeria', permanent: true },
      { source: '/opening-hours', destination: '/nyitvatartas', permanent: true },
      { source: '/page/menu/336', destination: '/programarchivum', permanent: true },
    ]
  },
}

export default withPayload(nextConfig)
