import webpush from 'web-push';
import { pool } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

// VAPID Configuration Setup
let vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
let vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@sarmayadar.pk';

// Fallback auto-generation if VAPID keys are missing
if (!vapidPublicKey || !vapidPrivateKey) {
  console.warn('⚠️ VAPID keys missing in environment. Auto-generating transient VAPID keypair for Web Push notifications...');
  const generated = webpush.generateVAPIDKeys();
  vapidPublicKey = generated.publicKey;
  vapidPrivateKey = generated.privateKey;
}

try {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  console.log('✅ Web Push VAPID Service initialized successfully.');
} catch (err) {
  console.error('❌ Error configuring Web Push VAPID details:', err.message);
}

/**
 * Get Public VAPID Key for browser subscription initialization
 */
export function getVapidPublicKey() {
  return vapidPublicKey;
}

/**
 * Helper to determine device type from payload or User-Agent string
 */
function determineDeviceType(explicitDeviceType, userAgent = '') {
  if (explicitDeviceType && (explicitDeviceType === 'mobile' || explicitDeviceType === 'desktop')) {
    return explicitDeviceType;
  }
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent || '')) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Save or update a browser Push Subscription in Neon PostgreSQL with device type
 */
export async function saveSubscription(subscriptionPayload, userId = null, userAgent = null) {
  if (!subscriptionPayload || !subscriptionPayload.endpoint || !subscriptionPayload.keys) {
    throw new Error('Invalid subscription payload structure. Endpoint and keys (p256dh, auth) are required.');
  }

  const { endpoint, keys, deviceType } = subscriptionPayload;
  if (!keys.p256dh || !keys.auth) {
    throw new Error('Subscription keys must include p256dh and auth tokens.');
  }

  const detectedDevice = determineDeviceType(deviceType, userAgent);

  const query = `
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent, device_type, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, TRUE)
    ON CONFLICT (endpoint) DO UPDATE SET
      user_id = COALESCE(EXCLUDED.user_id, push_subscriptions.user_id),
      p256dh = EXCLUDED.p256dh,
      auth = EXCLUDED.auth,
      user_agent = COALESCE(EXCLUDED.user_agent, push_subscriptions.user_agent),
      device_type = EXCLUDED.device_type,
      is_active = TRUE,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const values = [userId || null, endpoint, keys.p256dh, keys.auth, userAgent || null, detectedDevice];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Deactivate an existing Push Subscription in Neon PostgreSQL
 */
export async function unsubscribe(endpoint) {
  if (!endpoint) throw new Error('Endpoint is required to unsubscribe.');

  const query = `
    UPDATE push_subscriptions
    SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
    WHERE endpoint = $1
    RETURNING id;
  `;

  const result = await pool.query(query, [endpoint]);
  return result.rows.length > 0;
}

/**
 * Deactivate invalid/expired subscription by ID or endpoint
 */
export async function deactivateSubscription(idOrEndpoint) {
  try {
    await pool.query(
      `UPDATE push_subscriptions SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id::text = $1 OR endpoint = $1`,
      [idOrEndpoint]
    );
    console.log(`ℹ️ Push subscription deactivated: ${idOrEndpoint}`);
  } catch (err) {
    console.warn('Deactivate subscription notice:', err.message);
  }
}

/**
 * Get active Push Subscription Statistics (Total, Mobile, Desktop)
 */
export async function getPushSubscriptionStats() {
  try {
    const res = await pool.query(`
      SELECT 
        COUNT(*)::int as total,
        COUNT(CASE WHEN device_type = 'mobile' THEN 1 END)::int as mobile_count,
        COUNT(CASE WHEN device_type = 'desktop' OR device_type IS NULL THEN 1 END)::int as desktop_count
      FROM push_subscriptions
      WHERE is_active = TRUE;
    `);
    return res.rows[0] || { total: 0, mobile_count: 0, desktop_count: 0 };
  } catch (err) {
    console.error('Error fetching push stats:', err);
    return { total: 0, mobile_count: 0, desktop_count: 0 };
  }
}

/**
 * Dispatch Custom Broadcast Push Notification (Supports targeting mobile, desktop, or all subscribers)
 */
export async function sendCustomBroadcastNotification({ title, body, targetDevice = 'all', url = '/' }) {
  try {
    let query = `SELECT id, endpoint, p256dh, auth, device_type FROM push_subscriptions WHERE is_active = TRUE`;
    const params = [];

    if (targetDevice === 'mobile') {
      query += ` AND device_type = $1`;
      params.push('mobile');
    } else if (targetDevice === 'desktop') {
      query += ` AND (device_type = $1 OR device_type IS NULL)`;
      params.push('desktop');
    }

    const subResult = await pool.query(query, params);
    const subscriptions = subResult.rows;

    if (subscriptions.length === 0) {
      return { success: true, count: 0, sent: 0, message: 'No subscribers match target device criteria.' };
    }

    const payload = JSON.stringify({
      title: title || '📱 Sarmayadar Real Estate Alert',
      body: body || 'Check out latest verified property listings in Pakistan!',
      icon: '/css/favicon.png',
      badge: '/css/favicon.png',
      tag: `broadcast-${Date.now()}`,
      renotify: true,
      vibrate: [200, 100, 200, 100, 200],
      data: {
        propertyUrl: url || '/'
      }
    });

    let sentCount = 0;
    let failedCount = 0;

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
        sentCount++;
      } catch (err) {
        failedCount++;
        if (err.statusCode === 404 || err.statusCode === 410) {
          await deactivateSubscription(sub.id);
        }
      }
    });

    await Promise.allSettled(sendPromises);

    return {
      success: true,
      count: subscriptions.length,
      sent: sentCount,
      failed: failedCount,
      targetDevice
    };

  } catch (error) {
    console.error('Broadcast push error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Dispatch Push Notification for a newly published property to all active subscribers
 */
export async function sendNewPropertyNotification(property) {
  if (!property || !property.id) {
    console.warn('⚠️ Push Notification skipped: Invalid property object.');
    return { success: false, message: 'Invalid property.' };
  }

  try {
    // 1. Fetch active push subscriptions
    const subResult = await pool.query(
      `SELECT id, endpoint, p256dh, auth, device_type FROM push_subscriptions WHERE is_active = TRUE`
    );

    const subscriptions = subResult.rows;
    if (subscriptions.length === 0) {
      console.log('ℹ️ No active Web Push subscribers to notify.');
      return { success: true, count: 0, sent: 0 };
    }

    console.log(`🔔 Sending Web Push Notifications to ${subscriptions.length} active subscriber(s) for property: ${property.title}...`);

    // 2. Format Notification Payload
    const formattedPrice = property.price 
      ? `PKR ${Number(property.price).toLocaleString('en-PK')}`
      : '';
    const formattedLocation = [property.location, property.city].filter(Boolean).join(', ');

    const payload = JSON.stringify({
      title: '🏠 New Property Published!',
      body: `"${property.title}" in ${formattedLocation} ${formattedPrice ? `(${formattedPrice})` : ''} is now available. Click to view details!`,
      icon: '/css/favicon.png',
      image: Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null,
      badge: '/css/favicon.png',
      tag: `property-${property.id}`,
      renotify: true,
      vibrate: [200, 100, 200, 100, 200],
      data: {
        propertyId: property.id,
        propertyUrl: `/?propertyId=${property.id}`
      }
    });

    // 3. Dispatch Push Notifications Concurrently
    let sentCount = 0;
    let failedCount = 0;

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
        sentCount++;
      } catch (err) {
        failedCount++;
        const statusCode = err.statusCode;
        console.warn(`⚠️ Web Push failed for subscriber ${sub.id} (HTTP ${statusCode || 'ERR'}): ${err.message}`);

        // If subscription is expired or unregistered (404 / 410), deactivate it in DB
        if (statusCode === 404 || statusCode === 410) {
          await deactivateSubscription(sub.id);
        }
      }
    });

    await Promise.allSettled(sendPromises);

    console.log(`✅ Push Notification Job Completed: ${sentCount} sent successfully, ${failedCount} failed/deactivated.`);
    return { success: true, count: subscriptions.length, sent: sentCount, failed: failedCount };

  } catch (error) {
    console.error('❌ Error executing Web Push notification job:', error);
    return { success: false, error: error.message };
  }
}

