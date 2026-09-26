// ==============================================================================
// Component: OfflineStatusBar
// Non-intrusive indicator displayed when offline or synchronizing offline queue items
// ==============================================================================

import React from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useAccessibility } from '../context/useAccessibility';
import { useOfflineSync } from '../hooks/useOfflineSync';

export const OfflineStatusBar: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const { isHighContrast } = useAccessibility();
  const { isSyncing, pendingCount } = useOfflineSync();

  // If online and nothing is pending or syncing, do not show anything
  if (isOnline && !isSyncing && pendingCount === 0) {
    return null;
  }

  // 1. Online but syncing pending offline queue items
  if (isOnline && (isSyncing || pendingCount > 0)) {
    return (
      <aside
        role="status"
        aria-live="polite"
        aria-label="Synchronizing Offline Queue"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100000,
          backgroundColor: isHighContrast ? '#1e3a8a' : '#eff6ff',
          color: isHighContrast ? '#dbeafe' : '#1e40af',
          borderBottom: `1.5px solid ${isHighContrast ? '#3b82f6' : '#bfdbfe'}`,
          padding: '6px 16px',
          fontSize: '12px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid #3b82f6',
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
          }}
        />
        <span>
          🔄 <strong>सिंक्रोनाइज़ेशन सक्रिय (Syncing)</strong> —{' '}
          {pendingCount > 1 ? `${pendingCount} ऑफलाइन आवेदन सर्वर पर सुरक्षित हो रहे हैं...` : 'ऑफलाइन आवेदन सर्वर पर सुरक्षित हो रहा है...'}
        </span>
      </aside>
    );
  }

  // 2. Offline Mode
  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Offline Mode Active"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100000,
        backgroundColor: isHighContrast ? '#450a0a' : '#fff7ed',
        color: isHighContrast ? '#ffedd5' : '#9a3412',
        borderBottom: `1.5px solid ${isHighContrast ? '#ef4444' : '#fed7aa'}`,
        padding: '6px 16px',
        fontSize: '12px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: '#ea580c',
          display: 'inline-block',
        }}
      />
      <span>
        ⚡ <strong>ऑफलाइन मोड (Offline Mode)</strong> — सुरक्षित स्थानीय ऐप शैल सक्रिय है।{' '}
        {pendingCount > 0 ? `(${pendingCount} आवेदन इंटरनेट आने पर स्वतः सिंक होंगे)` : 'इंटरनेट आने पर लाइव सेवाएं स्वतः सक्रिय हो जाएंगी।'}
      </span>
    </aside>
  );
};

