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
 * Save or update a browser Push Subscription in Neon PostgreSQL
 */
export async function saveSubscription(subscriptionPayload, userId = null, userAgent = null) {
  if (!subscriptionPayload || !subscriptionPayload.endpoint || !subscriptionPayload.keys) {
    throw new Error('Invalid subscription payload structure. Endpoint and keys (p256dh, auth) are required.');
  }

  const { endpoint, keys } = subscriptionPayload;
  if (!keys.p256dh || !keys.auth) {
    throw new Error('Subscription keys must include p256dh and auth tokens.');
  }

  const query = `
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent, is_active)
    VALUES ($1, $2, $3, $4, $5, TRUE)
    ON CONFLICT (endpoint) DO UPDATE SET
      user_id = COALESCE(EXCLUDED.user_id, push_subscriptions.user_id),
      p256dh = EXCLUDED.p256dh,
      auth = EXCLUDED.auth,
      user_agent = COALESCE(EXCLUDED.user_agent, push_subscriptions.user_agent),
      is_active = TRUE,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const values = [userId || null, endpoint, keys.p256dh, keys.auth, userAgent || null];
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
      `SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE is_active = TRUE`
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
      body: `"${property.title}" in ${formattedLocation} ${formattedPrice ? `(${formattedPrice})` : ''} is now available. Click to view full details!`,
      icon: '/css/favicon.png',
      image: Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null,
      badge: '/css/favicon.png',
      tag: `property-${property.id}`,
      renotify: true,
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
