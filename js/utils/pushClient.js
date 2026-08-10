/**
 * Web Push Notification Client Utility
 * Handles Service Worker registration, VAPID key conversion, permission handling, and backend API sync.
 */

const PUSH_STORAGE_KEY = 'sarmayadar_push_subscribed';
const PUSH_DISMISSED_KEY = 'sarmayadar_push_dismissed';

/**
 * Utility: Convert URL-safe base64 string to Uint8Array for VAPID applicationServerKey
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if the current browser supports Web Push & Service Worker APIs
 */
export function checkPushSupport() {
  const isSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const permission = isSupported ? Notification.permission : 'unsupported';
  const isSubscribed = localStorage.getItem(PUSH_STORAGE_KEY) === 'true';
  const isDismissed = localStorage.getItem(PUSH_DISMISSED_KEY) === 'true';

  return {
    supported: isSupported,
    permission,
    isSubscribed,
    isDismissed
  };
}

/**
 * Register Service Worker for Web Push Notifications
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Workers are not supported in this browser.');
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    console.log('✅ Web Push Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
    throw error;
  }
}

/**
 * Fetch VAPID Public Key from backend Express API
 */
export async function fetchVapidPublicKey() {
  try {
    const res = await fetch('/api/push/vapid-public-key');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.success && data.publicKey) {
      return data.publicKey;
    }
    throw new Error('VAPID public key not found in server response.');
  } catch (error) {
    console.error('Error fetching VAPID public key:', error);
    throw error;
  }
}

/**
 * Subscribe visitor to Web Push Notifications
 */
export async function subscribeToPushNotifications() {
  const support = checkPushSupport();
  if (!support.supported) {
    return {
      success: false,
      reason: 'unsupported',
      message: 'Web Push notifications are not supported in this browser.'
    };
  }

  try {
    // 1. Register Service Worker
    const registration = await registerServiceWorker();
    await navigator.serviceWorker.ready;

    // 2. Request Notification Permission
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      localStorage.setItem(PUSH_DISMISSED_KEY, 'true');
      return {
        success: false,
        reason: 'denied',
        message: 'Notifications are currently disabled. You can enable them from your browser settings.'
      };
    }

    // 3. Fetch VAPID Public Key
    const vapidKey = await fetchVapidPublicKey();
    const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

    // 4. Create Push Subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    const subJson = subscription.toJSON();

    // 5. Sync Subscription with Backend Database
    const headers = { 'Content-Type': 'application/json' };
    const userToken = localStorage.getItem('Sarmayadar_token') || localStorage.getItem('token');
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers,
      body: JSON.stringify(subJson)
    });

    const resData = await response.json();
    if (resData.success) {
      localStorage.setItem(PUSH_STORAGE_KEY, 'true');
      localStorage.removeItem(PUSH_DISMISSED_KEY);
      return {
        success: true,
        message: resData.message || "You're all set! We'll notify you when new properties are published.",
        subscription: subJson
      };
    } else {
      throw new Error(resData.message || 'Backend failed to save subscription.');
    }

  } catch (error) {
    console.error('Subscription process failed:', error);
    return {
      success: false,
      reason: 'error',
      message: error.message || 'Could not subscribe to notifications. Please try again.'
    };
  }
}

/**
 * Unsubscribe visitor from Web Push Notifications
 */
export async function unsubscribeFromPushNotifications() {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Notify backend to deactivate endpoint
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        }).catch(err => console.warn('Unsubscribe API notice:', err.message));

        await subscription.unsubscribe();
      }
    }

    localStorage.removeItem(PUSH_STORAGE_KEY);
    return { success: true, message: 'Unsubscribed successfully.' };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Mark notification prompt as dismissed by user
 */
export function dismissPushPrompt() {
  localStorage.setItem(PUSH_DISMISSED_KEY, 'true');
}
