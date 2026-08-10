import express from 'express';
import jwt from 'jsonwebtoken';
import { getVapidPublicKey, saveSubscription, unsubscribe, getPushSubscriptionStats, sendCustomBroadcastNotification } from '../services/pushService.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'Sarmayadar_super_secret_jwt_key_2026_48h';

// Helper to extract optional user ID from Bearer token
function getOptionalUserId(req) {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.userId || null;
    }
  } catch (e) {
    // Soft failure for anonymous visitors
  }
  return null;
}

// 1. GET Public VAPID Key
router.get(['/vapid-public-key', '/api/push/vapid-public-key'], (req, res) => {
  try {
    const publicKey = getVapidPublicKey();
    return res.json({
      success: true,
      publicKey
    });
  } catch (error) {
    console.error('Error fetching VAPID public key:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving VAPID configuration.' });
  }
});

// 2. GET Subscription Stats
router.get(['/stats', '/api/push/stats'], async (req, res) => {
  try {
    const stats = await getPushSubscriptionStats();
    return res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Push stats endpoint error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve push subscription statistics.' });
  }
});

// 3. POST Subscribe endpoint (Supports Anonymous Visitors & Logged-in Users)
router.post(['/subscribe', '/api/push/subscribe'], async (req, res) => {
  try {
    const { endpoint, keys } = req.body || {};

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription payload. Endpoint and keys (p256dh, auth) are required.'
      });
    }

    const userId = getOptionalUserId(req);
    const userAgent = req.headers['user-agent'] || null;

    const savedSub = await saveSubscription(req.body, userId, userAgent);

    return res.status(201).json({
      success: true,
      message: `You're all set! Mobile property push alerts enabled for your ${savedSub.device_type || 'device'}.`,
      subscription: savedSub
    });

  } catch (error) {
    console.error('Subscribe endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save push subscription in database.',
      error: error.message
    });
  }
});

// 4. POST Unsubscribe endpoint
router.post(['/unsubscribe', '/api/push/unsubscribe'], async (req, res) => {
  try {
    const { endpoint } = req.body || {};

    if (!endpoint) {
      return res.status(400).json({ success: false, message: 'Endpoint is required to unsubscribe.' });
    }

    const unsubscribed = await unsubscribe(endpoint);

    return res.json({
      success: true,
      message: unsubscribed ? 'Unsubscribed successfully.' : 'Subscription not found or already inactive.'
    });

  } catch (error) {
    console.error('Unsubscribe endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to deactivate push subscription.',
      error: error.message
    });
  }
});

// 5. POST Custom Broadcast Push Notification endpoint (Admin / Supervisor)
router.post(['/broadcast', '/api/push/broadcast'], async (req, res) => {
  try {
    const { title, body, targetDevice, url } = req.body || {};

    const result = await sendCustomBroadcastNotification({
      title,
      body,
      targetDevice: targetDevice || 'all',
      url: url || '/'
    });

    return res.json(result);

  } catch (error) {
    console.error('Broadcast endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send broadcast push notification.',
      error: error.message
    });
  }
});

export default router;

