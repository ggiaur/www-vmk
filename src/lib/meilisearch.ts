import { MeiliSearch } from 'meilisearch'

const meiliHost = process.env.MEILI_HOST || 'http://localhost:7700'
const meiliMasterKey = process.env.MEILI_MASTER_KEY || 'vmk_meili_master_key_2026_dev'

export const meiliClient = new MeiliSearch({
  host: meiliHost,
  apiKey: meiliMasterKey,
})

export const INDEXES = {
  NEWS: 'vmk_news',
  EVENTS: 'vmk_events',
  DOCUMENTS: 'vmk_documents',
} as const

export async function setupMeiliSearchIndexes() {
  try {
    const newsIndex = meiliClient.index(INDEXES.NEWS)
    await newsIndex.updateSearchableAttributes(['title', 'summary', 'category'])
    await newsIndex.updateFilterableAttributes(['category', 'publishedAt'])

    const eventsIndex = meiliClient.index(INDEXES.EVENTS)
    await eventsIndex.updateSearchableAttributes(['title', 'locationName', 'targetAudience'])
    await eventsIndex.updateFilterableAttributes(['targetAudience', 'startDate'])

    console.log('[Meilisearch] Indexes initialized successfully.')
  } catch (error) {
    console.warn('[Meilisearch] Setup index warning (server may be offline during build):', error)
  }
}
