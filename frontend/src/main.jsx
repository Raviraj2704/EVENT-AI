// ============================================================================
// React App Entry Point
// ============================================================================
// File: src/main.jsx
// Purpose: Initialize React application
// Status: Production-Ready ✅

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Preserved your existing CSS path to prevent crashes

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register Service Worker for Offline Support & PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ ServiceWorker registered with scope: ', registration.scope);
      })
      .catch((error) => {
        console.error('❌ ServiceWorker registration failed: ', error);
      });
  });
}