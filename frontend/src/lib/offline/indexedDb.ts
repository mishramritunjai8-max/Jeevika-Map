// ==============================================================================
// Module: IndexedDB Storage Layer for Jeevika Map Offline Cache & Sync Queue
// Stores verified read-only occupation catalog and offline citizen intake queue
// ==============================================================================

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { OccupationCatalog } from '../../types/database';
import type { BeneficiaryFormData } from '../../types/mapping';

export const DB_NAME = 'jeevika_offline_db';
export const DB_VERSION = 2;

export interface CacheMetadata {
  key: string;
  lastSynced: string;
  version: number;
  count: number;
}

export type SyncQueueItemType = 'citizen_intake';
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface SyncQueueItem {
  id: string;
  type: SyncQueueItemType;
  beneficiaryId: string;
  profileId: string;
  formData: BeneficiaryFormData;
  createdAt: string;
  syncStatus: SyncStatus;
  retryCount: number;
  lastError: string | null;
  beneficiaryInserted?: boolean;
  profileInserted?: boolean;
}

export interface JeevikaOfflineDBSchema extends DBSchema {
  occupations: {
    key: string;
    value: OccupationCatalog;
    indexes: {
      'by-qp-nos': string;
      'by-sector': string;
      'by-nsqf-level': number;
      'by-job-role': string;
    };
  };
  cache_metadata: {
    key: string;
    value: CacheMetadata;
  };
  sync_queue: {
    key: string;
    value: SyncQueueItem;
    indexes: {
      'by-status': SyncStatus;
      'by-created': string;
      'by-type': SyncQueueItemType;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<JeevikaOfflineDBSchema>> | null = null;

/**
 * Initializes and returns the open IndexedDB instance
 */
export const getOfflineDb = (): Promise<IDBPDatabase<JeevikaOfflineDBSchema>> => {
  if (!dbPromise) {
    dbPromise = openDB<JeevikaOfflineDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // 1. Occupations Store (Version 1)
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains('occupations')) {
            const occStore = db.createObjectStore('occupations', { keyPath: 'id' });
            occStore.createIndex('by-qp-nos', 'qp_nos_code', { unique: false });
            occStore.createIndex('by-sector', 'sector_skill_council', { unique: false });
            occStore.createIndex('by-nsqf-level', 'nsqf_level', { unique: false });
            occStore.createIndex('by-job-role', 'job_role', { unique: false });
          }

          // 2. Cache Metadata Store (Version 1)
          if (!db.objectStoreNames.contains('cache_metadata')) {
            db.createObjectStore('cache_metadata', { keyPath: 'key' });
          }
        }

        // 3. Sync Queue Store (Version 2)
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('sync_queue')) {
            const queueStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
            queueStore.createIndex('by-status', 'syncStatus', { unique: false });
            queueStore.createIndex('by-created', 'createdAt', { unique: false });
            queueStore.createIndex('by-type', 'type', { unique: false });
          }
        }
      },
    });
  }
  return dbPromise;
};

