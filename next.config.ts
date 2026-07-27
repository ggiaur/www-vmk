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
      // 301 Permanent Redirects mapped from legacy www.vmk.hu URLs
      {
        source: '/nyari-nyitvatartas-2026',
        destination: '/hirek/nyari-nyitvatartas-2026',
        permanent: true,
      },
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
      {
        source: '/page/menu/336',
        destination: '/programarchivum/barokk-ev-2018',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
