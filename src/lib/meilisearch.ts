import { MeiliSearch } from 'meilisearch'

// Matches the names actually defined in .env(.example) and docker-compose.yml
// — MEILI_HOST/MEILI_MASTER_KEY (the previous names here) were never set
// anywhere, so this always silently fell back to the hardcoded defaults
// below, which don't even match the real docker-compose master key.
const meiliHost = process.env.MEILISEARCH_HOST || 'http://localhost:7700'
const meiliMasterKey = process.env.MEILISEARCH_KEY || 'vmk_meili_master_key'

export const meiliClient = new MeiliSearch({
  host: meiliHost,
  apiKey: meiliMasterKey,
})

export const INDEXES = {
  NEWS: 'vmk_news',
  EVENTS: 'vmk_events',
  DOCUMENTS: 'vmk_documents',
} as const

/** Syncs a single document into a Meilisearch index — used from Payload
 *  collection afterChange hooks. Never throws: Meilisearch is a
 *  nice-to-have search layer, not a source of truth, so a transient
 *  outage here must not block editors from saving content. */
export async function syncToMeiliIndex(indexName: string, doc: Record<string, unknown>) {
  try {
    await meiliClient.index(indexName).addDocuments([doc], { primaryKey: 'id' })
  } catch (error) {
    console.warn(`[Meilisearch] Failed to sync document into ${indexName}:`, error)
  }
}

export async function removeFromMeiliIndex(indexName: string, id: string | number) {
  try {
    await meiliClient.index(indexName).deleteDocument(id)
  } catch (error) {
    console.warn(`[Meilisearch] Failed to remove document from ${indexName}:`, error)
  }
}

export async function setupMeiliSearchIndexes() {
  try {
    const newsIndex = meiliClient.index(INDEXES.NEWS)
    await newsIndex.updateSearchableAttributes(['title', 'summary', 'category'])
    await newsIndex.updateFilterableAttributes(['category', 'publishedAt'])

    const eventsIndex = meiliClient.index(INDEXES.EVENTS)
    await eventsIndex.updateSearchableAttributes(['title', 'targetAudience'])
    await eventsIndex.updateFilterableAttributes(['targetAudience', 'startDate'])

    console.log('[Meilisearch] Indexes initialized successfully.')
  } catch (error) {
    console.warn('[Meilisearch] Setup index warning (server may be offline during build):', error)
  }
}
