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
 * Helper: Detect if current client is mobile or desktop device
 */
export function getDeviceType() {
  const userAgent = navigator.userAgent || '';
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || (window.innerWidth && window.innerWidth <= 768)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Helper: Check if client device is running iOS (iPhone/iPad)
 */
export function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || '');
}

/**
 * Helper: Check if web app is running in Standalone PWA mode
 */
export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
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
    const deviceType = getDeviceType();

    // 5. Sync Subscription with Backend Database
    const headers = { 'Content-Type': 'application/json' };
    const userToken = localStorage.getItem('Sarmayadar_token') || localStorage.getItem('token');
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }

    const payload = {
      ...subJson,
      deviceType: deviceType
    };

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const resData = await response.json();
    if (resData.success) {
      localStorage.setItem(PUSH_STORAGE_KEY, 'true');
      localStorage.removeItem(PUSH_DISMISSED_KEY);
      return {
        success: true,
        message: resData.message || `You're all set! Mobile property push alerts enabled for your ${deviceType} device.`,
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
    return { success: true, message: 'Push notifications disabled.' };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Toggle Mobile / Web Push Notification Subscription
 */
export async function togglePushNotifications() {
  const support = checkPushSupport();
  if (support.isSubscribed) {
    return await unsubscribeFromPushNotifications();
  } else {
    return await subscribeToPushNotifications();
  }
}

/**
 * Mark notification prompt as dismissed by user
 */
export function dismissPushPrompt() {
  localStorage.setItem(PUSH_DISMISSED_KEY, 'true');
}

