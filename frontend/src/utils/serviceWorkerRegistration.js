// ============================================================================
// FEATURE 17: SERVICE WORKER REGISTRATION
// ============================================================================
// File: src/utils/serviceWorkerRegistration.js
// Register service worker for offline support

export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service Workers not supported');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[SW] Registered successfully:', registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              notifyUserOfUpdate();
            }
          });
        });
      })
      .catch((error) => {
        console.error('[SW] Registration failed:', error);
      });
  });

  // Handle controller change
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[SW] Controller changed, reloading page');
    window.location.reload();
  });
};

// Notify user of update
const notifyUserOfUpdate = () => {
  const updateNotification = document.createElement('div');
  updateNotification.className = `
    fixed bottom-4 left-4 right-4 md:right-auto md:w-96
    bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg
    z-50 flex items-center justify-between
  `;
  updateNotification.innerHTML = `
    <span>A new version is available!</span>
    <button id="update-btn" class="ml-4 px-4 py-1 bg-white text-blue-500 rounded font-semibold hover:bg-gray-100">
      Update
    </button>
  `;

  document.body.appendChild(updateNotification);

  document.getElementById('update-btn').addEventListener('click', () => {
    // Trigger service worker update
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
  });
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Send local notification
export const sendNotification = (title, options = {}) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title,
      options,
    });
  }
};

// Register background sync
export const registerBackgroundSync = (tag) => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.sync.register(tag);
    });
  }
};

console.log('[SW Registration] Loaded');