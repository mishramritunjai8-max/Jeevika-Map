// ==============================================================================
// Service: Offline Queue Service
// Platform: Jeevika Map (PM-AJAY Livelihood & Skilling Convergence Platform)
//
// Purpose:
// Manages the IndexedDB sync_queue object store for offline citizen intake.
// Provides typed enqueue, state transition, and recovery functions.
// Completely decoupled from UI layers.
// ==============================================================================

import { getOfflineDb, type SyncQueueItem } from '../../lib/offline/indexedDb';
import type { BeneficiaryFormData } from '../../types/mapping';

export const generateQueueUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Enqueues a new offline citizen intake submission into IndexedDB.
 */
export const enqueueCitizenIntake = async (params: {
  id?: string;
  beneficiaryId: string;
  profileId: string;
  formData: BeneficiaryFormData;
  beneficiaryInserted?: boolean;
  profileInserted?: boolean;
}): Promise<SyncQueueItem> => {
  const db = await getOfflineDb();
  const queueItem: SyncQueueItem = {
    id: params.id || generateQueueUUID(),
    type: 'citizen_intake',
    beneficiaryId: params.beneficiaryId,
    profileId: params.profileId,
    formData: params.formData,
    createdAt: new Date().toISOString(),
    syncStatus: 'pending',
    retryCount: 0,
    lastError: null,
    beneficiaryInserted: Boolean(params.beneficiaryInserted),
    profileInserted: Boolean(params.profileInserted),
  };

  await db.put('sync_queue', queueItem);
  console.log(`[OfflineQueueService] Enqueued citizen intake (Queue ID: ${queueItem.id}, Beneficiary ID: ${queueItem.beneficiaryId})`);
  return queueItem;
};

/**
 * Retrieves all queue items that are pending or failed and need synchronization.
 */
export const getPendingQueueItems = async (): Promise<SyncQueueItem[]> => {
  try {
    const db = await getOfflineDb();
    const all = await db.getAll('sync_queue');
    return all.filter((item) => item.syncStatus === 'pending' || item.syncStatus === 'failed');
  } catch (err) {
    console.error('[OfflineQueueService] Error retrieving pending queue items:', err);
    return [];
  }
};

/**
 * Retrieves all queue items regardless of status.
 */
export const getAllQueueItems = async (): Promise<SyncQueueItem[]> => {
  try {
    const db = await getOfflineDb();
    return await db.getAll('sync_queue');
  } catch (err) {
    console.error('[OfflineQueueService] Error retrieving all queue items:', err);
    return [];
  }
};

/**
 * Retrieves a single queue item by ID.
 */
export const getQueueItem = async (id: string): Promise<SyncQueueItem | undefined> => {
  try {
    const db = await getOfflineDb();
    return await db.get('sync_queue', id);
  } catch (err) {
    console.error(`[OfflineQueueService] Error retrieving queue item ${id}:`, err);
    return undefined;
  }
};

/**
 * Marks a queue item as currently synchronizing.
 */
export const markSyncing = async (id: string): Promise<void> => {
  try {
    const db = await getOfflineDb();
    const item = await db.get('sync_queue', id);
    if (item) {
      item.syncStatus = 'syncing';
      await db.put('sync_queue', item);
    }
  } catch (err) {
    console.error(`[OfflineQueueService] Error marking item ${id} as syncing:`, err);
  }
};

/**
 * Marks a queue item as successfully synchronized.
 */
export const markSynced = async (id: string): Promise<void> => {
  try {
    const db = await getOfflineDb();
    const item = await db.get('sync_queue', id);
    if (item) {
      item.syncStatus = 'synced';
      item.lastError = null;
      await db.put('sync_queue', item);
      console.log(`[OfflineQueueService] Marked queue item ${id} as synced.`);
    }
  } catch (err) {
    console.error(`[OfflineQueueService] Error marking item ${id} as synced:`, err);
  }
};

/**
 * Marks a queue item as failed with error details and updated retry count.
 */
export const markFailed = async (
  id: string,
  errorMsg: string,
  retryCount: number
): Promise<void> => {
  try {
    const db = await getOfflineDb();
    const item = await db.get('sync_queue', id);
    if (item) {
      item.syncStatus = 'failed';
      item.lastError = errorMsg;
      item.retryCount = retryCount;
      await db.put('sync_queue', item);
      console.warn(`[OfflineQueueService] Marked queue item ${id} as failed (Attempt #${retryCount}): ${errorMsg}`);
    }
  } catch (err) {
    console.error(`[OfflineQueueService] Error marking item ${id} as failed:`, err);
  }
};

/**
 * Updates specific progress properties on a queue item (e.g. partial step success).
 */
export const updateQueueItem = async (
  id: string,
  updates: Partial<SyncQueueItem>
): Promise<void> => {
  try {
    const db = await getOfflineDb();
    const item = await db.get('sync_queue', id);
    if (item) {
      const merged: SyncQueueItem = { ...item, ...updates };
      await db.put('sync_queue', merged);
    }
  } catch (err) {
    console.error(`[OfflineQueueService] Error updating queue item ${id}:`, err);
  }
};

/**
 * Resets all 'failed' items back to 'pending' for retry.
 */
export const retryFailedItems = async (): Promise<void> => {
  try {
    const db = await getOfflineDb();
    const all = await db.getAll('sync_queue');
    const failed = all.filter((i) => i.syncStatus === 'failed');
    for (const item of failed) {
      item.syncStatus = 'pending';
      await db.put('sync_queue', item);
    }
  } catch (err) {
    console.error('[OfflineQueueService] Error resetting failed queue items:', err);
  }
};

/**
 * Returns the count of items currently awaiting synchronization (pending, syncing, or failed).
 */
export const getPendingCount = async (): Promise<number> => {
  try {
    const db = await getOfflineDb();
    const all = await db.getAll('sync_queue');
    return all.filter((i) => i.syncStatus === 'pending' || i.syncStatus === 'syncing' || i.syncStatus === 'failed').length;
  } catch {
    return 0;
  }
};

/**
 * Removes completed 'synced' items to minimize client-side storage retention.
 */
export const clearSyncedItems = async (): Promise<void> => {
  try {
    const db = await getOfflineDb();
    const all = await db.getAll('sync_queue');
    const synced = all.filter((i) => i.syncStatus === 'synced');
    for (const item of synced) {
      await db.delete('sync_queue', item.id);
    }
  } catch (err) {
    console.error('[OfflineQueueService] Error clearing synced queue items:', err);
  }
};

/**
 * Deletes a specific queue item by ID.
 */
export const deleteQueueItem = async (id: string): Promise<void> => {
  try {
    const db = await getOfflineDb();
    await db.delete('sync_queue', id);
  } catch (err) {
    console.error(`[OfflineQueueService] Error deleting queue item ${id}:`, err);
  }
};
