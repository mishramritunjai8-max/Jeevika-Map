import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import App from './App.tsx';
import { getActiveOccupations } from './services/occupationCatalogService';

// 1. Register Service Worker for offline app shell caching and PWA functionality
if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('[PWA] New content available, auto-updating...');
    },
    onOfflineReady() {
      console.log('[PWA] Jeevika Map is offline-ready.');
    },
  });
}

// 2. Pre-cache authoritative occupation catalog into IndexedDB in background
getActiveOccupations().catch((err) =>
  console.warn('[PWA] Initial offline catalog cache sync:', err)
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
