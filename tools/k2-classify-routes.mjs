#!/usr/bin/env node
// K2 (COLLAB.md, commit 8fec18e) -- classify every route in a fresh
// .visual-oracle-full/route-manifest.json into the same categories
// FULL_SITE_ROUTE_MATRIX.md (H1-H4 round) established:
//   CLONED | GALLERY_ARCHIVE_MULTI | GALLERY_ARCHIVE_SINGLE |
//   MULTILANG_LEGACY | PREVIEW_INTERNAL | DOWNLOAD_ASSET
//
// This mirrors the real resolver logic in
// src/app/(frontend)/[...slug]/page.tsx and the routeOverrides table in
// tools/visual-oracle.config.json, not an independent guess -- classifying
// a route CLONED here should mean the resolver actually serves real content
// for it, not a fallback.
//
// Usage: node tools/k2-classify-routes.mjs --manifest=.visual-oracle-full/route-manifest.json --out=docs/parity-oracle-v2

import fs from 'fs'
import path from 'path'

function parseArgs(argv) {
  const args = {}
  for (const token of argv) {
    if (token.startsWith('--')) {
      const [k, ...rest] = token.slice(2).split('=')
      args[k] = rest.join('=') || true
    }
  }
  return args
}
const args = parseArgs(process.argv.slice(2))
const MANIFEST_FILE = args['manifest'] || '.visual-oracle-full/route-manifest.json'
const OUT_DIR = args['out'] || 'docs/parity-oracle-v2'
const CONFIG_FILE = args['config'] || 'tools/visual-oracle.config.json'
const SLUGS_FILE = args['slugs'] || 'src/data/legacyGalleryArchiveSlugs.ts'

function loadLegacyGallerySlugs() {
  const src = fs.readFileSync(SLUGS_FILE, 'utf8')
  const m = src.match(/legacyGalleryArchiveSlugs:\s*string\[\]\s*=\s*(\[[\s\S]*?\])/)
  if (!m) throw new Error(`Could not parse ${SLUGS_FILE} -- expected 'export const legacyGalleryArchiveSlugs: string[] = [...]'`)
  return new Set(JSON.parse(m[1]))
}

function isPreviewInternal(routePath) {
  return /\/preview\/\d+/.test(routePath)
}

function isDownloadAsset(routePath) {
  return routePath.startsWith('/download')
}

function isGalleryArchiveMulti(routePath) {
  const seg = routePath.split('/').filter(Boolean)
  return seg[0] === 'gallery'
}

function isSingleSegment(routePath) {
  const seg = routePath.split('/').filter(Boolean)
  return seg.length === 1
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'))
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
  const legacySlugs = loadLegacyGallerySlugs()
  const routeOverrides = config.routeOverrides || {}

  const byPath = new Map(manifest.routes.map((r) => [r.path, r]))
  const LANG_ROOTS = new Set(['/start/index/lang/en', '/start/index/lang/de'])

  // MULTILANG_LEGACY: any route whose source-chain (first-discovered
  // parent, walked upward) passes through a lang-root before reaching '/',
  // excluding the lang-roots themselves (those display real content).
  function isUnderLangRoot(routePath, depthGuard = 0) {
    if (depthGuard > 20) return false // cycle guard, shouldn't happen on a tree
    const entry = byPath.get(routePath)
    if (!entry || !entry.source || entry.source === 'root' || entry.source === 'cli') return false
    if (LANG_ROOTS.has(entry.source)) return true
    if (entry.source === routePath) return false
    return isUnderLangRoot(entry.source, depthGuard + 1)
  }

  const classified = manifest.routes.map((r) => {
    let category
    let target
    const seg = r.path.split('/').filter(Boolean)
    const slug = seg[0]

    if (isPreviewInternal(r.path)) {
      category = 'PREVIEW_INTERNAL'
      target = null
    } else if (isDownloadAsset(r.path)) {
      category = 'DOWNLOAD_ASSET'
      target = null
    } else if (isGalleryArchiveMulti(r.path)) {
      category = 'GALLERY_ARCHIVE_MULTI'
      target = '/galeria'
    } else if (isSingleSegment(r.path) && legacySlugs.has(slug) && !LANG_ROOTS.has(r.path)) {
      category = 'GALLERY_ARCHIVE_SINGLE'
      target = '/galeria' // exact Gallery match (if any) resolved at request time, not here
    } else if (!LANG_ROOTS.has(r.path) && isUnderLangRoot(r.path)) {
      category = 'MULTILANG_LEGACY'
      target = null
    } else {
      category = 'CLONED'
      target = routeOverrides[r.path] || r.path
    }

    return { ...r, category, clonePath: target }
  })

  const counts = {}
  for (const c of classified) counts[c.category] = (counts[c.category] || 0) + 1

  const clonedRoutes = classified.filter((c) => c.category === 'CLONED')
  const galleryArchive = classified.filter((c) => c.category === 'GALLERY_ARCHIVE_MULTI' || c.category === 'GALLERY_ARCHIVE_SINGLE')

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(
    path.join(OUT_DIR, 'full-inventory-classification.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), sourceManifest: MANIFEST_FILE, totalRoutes: classified.length, counts, routes: classified }, null, 2),
  )

  console.log('Classification counts:', counts)
  console.log('Total:', classified.length)
  console.log('CLONED routes for full oracle run:', clonedRoutes.length)
  console.log('Gallery-archive routes (sample candidates):', galleryArchive.length)
  console.log('Wrote', path.join(OUT_DIR, 'full-inventory-classification.json'))
}

main()
