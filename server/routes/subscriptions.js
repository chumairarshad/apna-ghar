import express from 'express';
import { pool } from '../db.js';
import { authenticateToken, requireRole } from '../middleware.js';

const router = express.Router();

// 1. PUBLIC / DEALER: Get All Subscription Plans
router.get('/plans', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM subscription_plans WHERE status = 'active' ORDER BY price_pkr ASC`
    );
    return res.json({ success: true, count: result.rows.length, plans: result.rows });
  } catch (error) {
    console.error('Fetch subscription plans error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching subscription plans.' });
  }
});

// 2. DEALER: Get Active Dealer Subscription & Current Usage
router.get('/my-subscription', authenticateToken, async (req, res) => {
  try {
    const dealerId = req.user.userId;

    // Fetch active subscription or default to PRO DEALER plan
    const subResult = await pool.query(
      `SELECT ds.*, sp.name as plan_name, sp.price_pkr, sp.listing_limit, sp.mega_project_limit, sp.featured_limit
       FROM dealer_subscriptions ds
       JOIN subscription_plans sp ON ds.plan_id = sp.id
       WHERE ds.dealer_id = $1 AND ds.status = 'active'
       ORDER BY ds.created_at DESC LIMIT 1`,
      [dealerId]
    );

    // Count actual current active property listings count
    const propCountRes = await pool.query(
      `SELECT COUNT(*)::int as count FROM properties WHERE dealer_id = $1 AND status = 'active'`,
      [dealerId]
    );

    const activeListingsCount = propCountRes.rows[0]?.count || 0;

    if (subResult.rows.length > 0) {
      const sub = subResult.rows[0];
      return res.json({
        success: true,
        subscription: {
          ...sub,
          listings_used: activeListingsCount,
          is_limit_reached: activeListingsCount >= sub.listing_limit
        }
      });
    }

    // Default Pro Dealer fallback if not in DB yet
    return res.json({
      success: true,
      subscription: {
        plan_name: 'PRO DEALER',
        price_pkr: 15000,
        listing_limit: 25,
        mega_project_limit: 2,
        featured_limit: 5,
        status: 'active',
        listings_used: activeListingsCount,
        is_limit_reached: activeListingsCount >= 25,
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('Fetch my subscription error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching subscription.' });
  }
});

// 3. ADMIN: Create or Update Subscription Plan
router.post('/admin/plans', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, pricePkr = 15000, durationDays = 30, listingLimit = 25, megaProjectLimit = 2, featuredLimit = 5 } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Plan name is required.' });
    }

    const sql = `
      INSERT INTO subscription_plans (name, price_pkr, duration_days, listing_limit, mega_project_limit, featured_limit)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (name) DO UPDATE SET 
        price_pkr = EXCLUDED.price_pkr,
        duration_days = EXCLUDED.duration_days,
        listing_limit = EXCLUDED.listing_limit,
        mega_project_limit = EXCLUDED.mega_project_limit,
        featured_limit = EXCLUDED.featured_limit
      RETURNING *
    `;

    const result = await pool.query(sql, [name, pricePkr, durationDays, listingLimit, megaProjectLimit, featuredLimit]);
    return res.json({ success: true, message: `Subscription plan ${name} updated.`, plan: result.rows[0] });
  } catch (error) {
    console.error('Save subscription plan error:', error);
    return res.status(500).json({ success: false, message: 'Error saving plan.' });
  }
});

export default router;
