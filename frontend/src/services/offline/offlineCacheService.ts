// ==============================================================================
// Service: Offline Cache Service
// Manages local IndexedDB storage, retrieval, and search for read-only Jeevika data
// ==============================================================================

import { getOfflineDb, type CacheMetadata } from '../../lib/offline/indexedDb';
import type { OccupationCatalog } from '../../types/database';

export const OCCUPATIONS_CACHE_KEY = 'occupations_catalog';
export const CURRENT_DATASET_VERSION = 1;

/**
 * Bulk saves or updates active occupations into IndexedDB and records timestamp metadata
 */
export const cacheOccupations = async (occupations: OccupationCatalog[]): Promise<void> => {
  if (!occupations || occupations.length === 0) return;

  try {
    const db = await getOfflineDb();
    const tx = db.transaction(['occupations', 'cache_metadata'], 'readwrite');

    // Put all occupations
    const occStore = tx.objectStore('occupations');
    for (const occ of occupations) {
      await occStore.put(occ);
    }

    // Update metadata
    const metaStore = tx.objectStore('cache_metadata');
    const metadata: CacheMetadata = {
      key: OCCUPATIONS_CACHE_KEY,
      lastSynced: new Date().toISOString(),
      version: CURRENT_DATASET_VERSION,
      count: occupations.length,
    };
    await metaStore.put(metadata);

    await tx.done;
    console.log(`[OfflineCache] Successfully cached ${occupations.length} occupations to IndexedDB.`);
  } catch (err) {
    console.warn('[OfflineCache] Error caching occupations to IndexedDB:', err);
  }
};

/**
 * Retrieves all cached occupations from IndexedDB
 */
export const getCachedOccupations = async (): Promise<OccupationCatalog[]> => {
  try {
    const db = await getOfflineDb();
    const records = await db.getAll('occupations');
    return records || [];
  } catch (err) {
    console.warn('[OfflineCache] Error reading occupations from IndexedDB:', err);
    return [];
  }
};

/**
 * Searches cached occupations by keyword, job role, sector, or QP-NOS code
 */
export const searchCachedOccupations = async (query: string): Promise<OccupationCatalog[]> => {
  const all = await getCachedOccupations();
  if (!query || !query.trim()) return all;

  const qLower = query.toLowerCase().trim();
  return all.filter((occ) => {
    const roleMatch = occ.job_role.toLowerCase().includes(qLower);
    const codeMatch = occ.qp_nos_code.toLowerCase().includes(qLower);
    const sectorMatch = occ.sector_skill_council.toLowerCase().includes(qLower);
    const descMatch = occ.description.toLowerCase().includes(qLower);
    return roleMatch || codeMatch || sectorMatch || descMatch;
  });
};

/**
 * Retrieves metadata for a specific cache key (e.g. lastSynced timestamp)
 */
export const getCacheMetadata = async (
  key: string = OCCUPATIONS_CACHE_KEY
): Promise<CacheMetadata | null> => {
  try {
    const db = await getOfflineDb();
    const meta = await db.get('cache_metadata', key);
    return meta || null;
  } catch (err) {
    console.warn('[OfflineCache] Error reading cache metadata from IndexedDB:', err);
    return null;
  }
};

/**
 * Clears all cached offline records
 */
export const clearOfflineCache = async (): Promise<void> => {
  try {
    const db = await getOfflineDb();
    const tx = db.transaction(['occupations', 'cache_metadata'], 'readwrite');
    await tx.objectStore('occupations').clear();
    await tx.objectStore('cache_metadata').clear();
    await tx.done;
    console.log('[OfflineCache] Offline IndexedDB cache cleared.');
  } catch (err) {
    console.warn('[OfflineCache] Error clearing IndexedDB cache:', err);
  }
};
