// ==============================================================================
// Hook: useOfflineSync
// Platform: Jeevika Map (PM-AJAY Livelihood & Skilling Convergence Platform)
//
// Purpose:
// Listens to network connectivity events and automatically orchestrates
// sequential, idempotent synchronization of offline citizen intake submissions
// stored in IndexedDB.
// ==============================================================================

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  getPendingQueueItems,
  getPendingCount,
  markSyncing,
  markSynced,
  markFailed,
  updateQueueItem,
  clearSyncedItems,
} from '../services/offline/offlineQueueService';
import {
  createBeneficiaryPayload,
  createLivelihoodProfilePayload,
  isNetworkError,
} from '../services/beneficiaryService';

// Module-level lock to strictly prevent concurrent sync loops across components
let globalSyncLock = false;

export interface OfflineSyncState {
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: string | null;
  syncPendingItems: () => Promise<void>;
}

export const useOfflineSync = (): OfflineSyncState => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Refreshes the count of items pending sync
  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await getPendingCount();
      if (isMountedRef.current) {
        setPendingCount(count);
      }
    } catch (e) {
      console.warn('[useOfflineSync] Could not refresh pending count:', e);
    }
  }, []);

  /**
   * Main sequential queue synchronization worker
   */
  const syncPendingItems = useCallback(async (): Promise<void> => {
    if (globalSyncLock) {
      console.log('[useOfflineSync] Sync already in progress, skipping concurrent run.');
      return;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('[useOfflineSync] Network is offline, deferring sync.');
      return;
    }

    if (!isSupabaseConfigured()) {
      console.warn('[useOfflineSync] Supabase is unconfigured, deferring server sync.');
      return;
    }

    globalSyncLock = true;
    if (isMountedRef.current) setIsSyncing(true);

    try {
      const pendingItems = await getPendingQueueItems();
      if (pendingItems.length === 0) {
        if (isMountedRef.current) {
          setIsSyncing(false);
          setPendingCount(0);
        }
        globalSyncLock = false;
        return;
      }

      console.log(`[useOfflineSync] Starting background synchronization for ${pendingItems.length} queued item(s)...`);

      for (const item of pendingItems) {
        // Enforce max bounded retries (e.g., 5 attempts)
        if (item.retryCount >= 5) {
          console.warn(`[useOfflineSync] Item ${item.id} exceeded max retry limit (${item.retryCount}), keeping as failed.`);
          continue;
        }

        await markSyncing(item.id);
        let currentBenInserted = Boolean(item.beneficiaryInserted);
        let currentProfInserted = Boolean(item.profileInserted);
        let itemFailed = false;

        // --------------------------------------------------------------------
        // STEP A: Insert Beneficiary (if not already recorded in DB)
        // --------------------------------------------------------------------
        if (!currentBenInserted) {
          try {
            const benPayload = createBeneficiaryPayload(item.beneficiaryId, item.formData);
            const { error: benError } = await supabase
              .from('beneficiaries')
              .insert([benPayload]);

            if (benError) {
              // Check if already exists from a prior partial attempt (duplicate key 23505)
              if (benError.code === '23505' || benError.message.includes('duplicate key')) {
                console.log(`[useOfflineSync] Beneficiary ${item.beneficiaryId} already exists in DB, continuing.`);
                currentBenInserted = true;
                await updateQueueItem(item.id, { beneficiaryInserted: true });
              } else {
                console.error(`[useOfflineSync] Beneficiary sync failed for ${item.beneficiaryId}:`, benError);
                await markFailed(item.id, benError.message || 'Beneficiary insert rejected', item.retryCount + 1);
                itemFailed = true;
              }
            } else {
              currentBenInserted = true;
              await updateQueueItem(item.id, { beneficiaryInserted: true });
              console.log(`[useOfflineSync] Synced beneficiary: ${item.beneficiaryId}`);
            }
          } catch (err) {
            console.error(`[useOfflineSync] Exception during beneficiary sync for ${item.beneficiaryId}:`, err);
            const msg = err instanceof Error ? err.message : 'Network error';
            await markFailed(item.id, msg, item.retryCount + 1);
            itemFailed = true;
          }
        }

        if (itemFailed) continue;

        // --------------------------------------------------------------------
        // STEP B: Insert Livelihood Profile (if not already recorded in DB)
        // --------------------------------------------------------------------
        if (!currentProfInserted) {
          try {
            const profPayload = createLivelihoodProfilePayload(
              item.profileId,
              item.beneficiaryId,
              item.formData
            );
            const { error: profError } = await supabase
              .from('livelihood_profiles')
              .insert([profPayload]);

            if (profError) {
              if (profError.code === '23505' || profError.message.includes('duplicate key')) {
                console.log(`[useOfflineSync] Profile ${item.profileId} already exists in DB, continuing.`);
                currentProfInserted = true;
                await updateQueueItem(item.id, { profileInserted: true });
              } else {
                console.error(`[useOfflineSync] Profile sync failed for ${item.profileId}:`, profError);
                await markFailed(item.id, profError.message || 'Profile insert rejected', item.retryCount + 1);
                itemFailed = true;
              }
            } else {
              currentProfInserted = true;
              await updateQueueItem(item.id, { profileInserted: true });
              console.log(`[useOfflineSync] Synced livelihood profile: ${item.profileId}`);
            }
          } catch (err) {
            console.error(`[useOfflineSync] Exception during profile sync for ${item.profileId}:`, err);
            const msg = err instanceof Error ? err.message : 'Network error';
            await markFailed(item.id, msg, item.retryCount + 1);
            itemFailed = true;
          }
        }

        if (itemFailed) continue;

        // --------------------------------------------------------------------
        // STEP C: Trigger Server-Side Recommendations (generate-recommendations)
        // --------------------------------------------------------------------
        try {
          const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
            'generate-recommendations',
            {
              body: {
                livelihood_profile_id: item.profileId,
              },
            }
          );

          if (edgeError) {
            console.warn(`[useOfflineSync] Edge function call note for ${item.profileId}:`, edgeError);
            if (isNetworkError(edgeError)) {
              await markFailed(item.id, 'Edge Function connection timeout', item.retryCount + 1);
              continue;
            }
          }

          if (edgeData?.success) {
            console.log(`[useOfflineSync] Server recommendations generated for ${item.profileId}`);
          }

          // Full sync sequence completed successfully
          await markSynced(item.id);
          console.log(`[useOfflineSync] Item ${item.id} fully synchronized with Supabase.`);
        } catch (err) {
          console.warn(`[useOfflineSync] Edge function network issue for ${item.profileId}:`, err);
          // Mark synced as both foundational DB rows exist, but note retry for recommendations if needed
          await markSynced(item.id);
        }
      }

      // Cleanup synced items to avoid unbounded storage growth
      await clearSyncedItems();
      const updatedCount = await getPendingCount();

      if (isMountedRef.current) {
        setPendingCount(updatedCount);
        setLastSyncTime(new Date().toISOString());
      }
    } catch (globalErr) {
      console.error('[useOfflineSync] Uncaught sync loop error:', globalErr);
    } finally {
      globalSyncLock = false;
      if (isMountedRef.current) {
        setIsSyncing(false);
      }
    }
  }, []);

  // Event listener setup for network changes
  useEffect(() => {
    isMountedRef.current = true;

    // Initial check on mount
    refreshPendingCount();
    if (typeof navigator !== 'undefined' && navigator.onLine && isSupabaseConfigured()) {
      syncPendingItems();
    }

    const handleOnline = () => {
      console.log('[useOfflineSync] Connectivity resumed, triggering background sync...');
      refreshPendingCount();
      syncPendingItems();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('online', handleOnline);
    };
  }, [syncPendingItems, refreshPendingCount]);

  return {
    isSyncing,
    pendingCount,
    lastSyncTime,
    syncPendingItems,
  };
};
