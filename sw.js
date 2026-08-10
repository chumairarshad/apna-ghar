/* Sarmayadar Real Estate - Web Push Service Worker (Mobile & Desktop PWA) */
const SW_VERSION = 'v1.1.0';

self.addEventListener('install', (event) => {
  console.log(`[ServiceWorker] Installed version: ${SW_VERSION}`);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log(`[ServiceWorker] Activated version: ${SW_VERSION}`);
  event.waitUntil(self.clients.claim());
});

// Handle incoming Web Push Notifications on Mobile & Desktop
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push event received.');

  let payload = {
    title: '🏠 New Property Published!',
    body: 'A new verified property has just been listed on Sarmayadar Real Estate Portal.',
    icon: '/css/favicon.png',
    badge: '/css/favicon.png',
    data: {
      propertyUrl: '/'
    }
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const notificationOptions = {
    body: payload.body,
    icon: payload.icon || '/css/favicon.png',
    badge: payload.badge || '/css/favicon.png',
    image: payload.image || undefined,
    tag: payload.tag || 'new-property-notification',
    renotify: payload.renotify !== undefined ? payload.renotify : true,
    vibrate: payload.vibrate || [200, 100, 200, 100, 200],
    data: payload.data || { propertyUrl: '/' },
    actions: [
      { action: 'view', title: '👁️ View Property' },
      { action: 'close', title: '✖️ Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || '🏠 New Property Alert', notificationOptions)
  );
});

// Handle Notification Click & Touch Actions
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked:', event.notification, 'Action:', event.action);
  event.notification.close();

  if (event.action === 'close') return;

  const notificationData = event.notification.data || {};
  const propertyId = notificationData.propertyId;
  const targetUrl = notificationData.propertyUrl || (propertyId ? `/?propertyId=${propertyId}` : '/');

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if site tab is already open
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();

          // Send message to open property detail modal
          if (propertyId) {
            client.postMessage({
              type: 'OPEN_PROPERTY_DETAIL',
              propertyId: propertyId,
              url: targetUrl
            });
          }

          // If client location can be navigated
          if ('navigate' in client && targetUrl !== '/') {
            return client.navigate(targetUrl);
          }
          return;
        }
      }

      // If no tab is open, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('[ServiceWorker] Notification dismissed:', event.notification.tag);
});

