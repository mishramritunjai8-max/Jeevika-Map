// ==============================================================================
// Hook: useNetworkStatus
// Detects online/offline connectivity changes in browser
// ==============================================================================

import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
};
