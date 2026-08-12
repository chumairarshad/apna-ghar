import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool } from '../db.js';
import { authenticateToken, requireRole } from '../middleware.js';

const router = express.Router();

// 1. ADMIN: Platform High-Level Statistics & Overview
router.get('/stats', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const totalUsersRes = await pool.query(`SELECT COUNT(*)::int as count FROM users`);
    const totalDealersRes = await pool.query(`SELECT COUNT(*)::int as count FROM users WHERE role = 'DEALER'`);
    const activeDealersRes = await pool.query(`SELECT COUNT(*)::int as count FROM users WHERE role = 'DEALER' AND COALESCE(is_suspended, false) = false`);
    const suspendedDealersRes = await pool.query(`SELECT COUNT(*)::int as count FROM users WHERE role = 'DEALER' AND (is_suspended = true OR status = 'suspended')`);
    
    const activeSubsRes = await pool.query(`SELECT COUNT(*)::int as count FROM dealer_subscriptions WHERE status = 'active' AND expiry_date >= NOW()`);
    const expiredSubsRes = await pool.query(`SELECT COUNT(*)::int as count FROM dealer_subscriptions WHERE status = 'active' AND expiry_date < NOW()`);

    const totalPropsRes = await pool.query(`SELECT COUNT(*)::int as count FROM properties`);
    const activePropsRes = await pool.query(`SELECT COUNT(*)::int as count FROM properties WHERE status = 'active'`);

    return res.json({
      success: true,
      stats: {
        totalUsers: totalUsersRes.rows[0].count,
        totalDealers: totalDealersRes.rows[0].count,
        activeDealers: activeDealersRes.rows[0].count,
        suspendedDealers: suspendedDealersRes.rows[0].count,
        activeSubscriptions: activeSubsRes.rows[0].count,
        expiredSubscriptions: expiredSubsRes.rows[0].count,
        totalProperties: totalPropsRes.rows[0].count,
        activeProperties: activePropsRes.rows[0].count
      }
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
});

// 2. ADMIN: List All Platform Users (Filterable by role: USER, DEALER, ADMIN)
router.get('/users', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { role } = req.query;
    let sql = `SELECT id, full_name, email, phone, role, agency_name, city, badge, is_verified, COALESCE(status, 'active') as status, COALESCE(is_suspended, false) as is_suspended, created_at FROM users`;
    const params = [];

    if (role && ['USER', 'DEALER', 'ADMIN'].includes(String(role).toUpperCase())) {
      sql += ` WHERE role = $1`;
      params.push(String(role).toUpperCase());
    }

    sql += ` ORDER BY created_at DESC`;
    const result = await pool.query(sql, params);
    return res.json({ success: true, count: result.rows.length, users: result.rows });
  } catch (error) {
    console.error('Fetch admin users error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching users.' });
  }
});

// 3. ADMIN: Create User / Dealer Account directly in Database
router.post('/users', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, email, password, phone, role = 'DEALER', agencyName, city } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
    }

    const targetRole = ['USER', 'DEALER'].includes(String(role).toUpperCase()) ? String(role).toUpperCase() : 'DEALER';
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    const insertSql = `
      INSERT INTO users (id, full_name, email, password_hash, phone, role, agency_name, city, badge, is_verified, status, is_suspended)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, 'active', false)
      RETURNING id, full_name, email, phone, role, agency_name, city, badge, is_verified, status, created_at
    `;
    const sqlParams = [
      userId, name, normalizedEmail, passwordHash, phone || '',
      targetRole, agencyName || name, city || 'Lahore',
      targetRole === 'DEALER' ? 'VERIFIED' : 'USER'
    ];

    const newUser = await pool.query(insertSql, sqlParams);
    return res.status(201).json({ success: true, message: `Account created successfully as ${targetRole}.`, user: newUser.rows[0] });
  } catch (error) {
    console.error('Admin create user error:', error);
    return res.status(500).json({ success: false, message: 'Error creating user account.' });
  }
});

// 4. ADMIN: Create Another Admin Account (Protected)
router.post('/create-admin', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    const insertSql = `
      INSERT INTO users (id, full_name, email, password_hash, phone, role, agency_name, city, badge, is_verified, status, is_suspended)
      VALUES ($1, $2, $3, $4, $5, 'ADMIN', 'Sarmayadar Executive Board', 'Lahore', 'SUPER_ADMIN', true, 'active', false)
      RETURNING id, full_name, email, role, badge, created_at
    `;

    const newAdmin = await pool.query(insertSql, [userId, name, normalizedEmail, passwordHash, phone || '']);
    return res.status(201).json({ success: true, message: 'New Administrator created successfully.', admin: newAdmin.rows[0] });
  } catch (error) {
    console.error('Admin creation error:', error);
    return res.status(500).json({ success: false, message: 'Error creating admin.' });
  }
});

// 5. ADMIN: Activate / Suspend User Account in PostgreSQL
router.put('/users/:id/status', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'active', isSuspended = false } = req.body;
    const targetStatus = ['active', 'suspended', 'disabled'].includes(status) ? status : (isSuspended ? 'suspended' : 'active');
    const suspendBool = targetStatus === 'suspended' || targetStatus === 'disabled' || Boolean(isSuspended);

    const result = await pool.query(
      `UPDATE users SET status = $1, is_suspended = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, full_name, email, role, status, is_suspended`,
      [targetStatus, suspendBool, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, message: `Account status updated to ${targetStatus}.`, user: result.rows[0] });
  } catch (error) {
    console.error('Update user status error:', error);
    return res.status(500).json({ success: false, message: 'Error updating status.' });
  }
});

// 6. ADMIN: Edit User Role (USER <-> DEALER <-> ADMIN)
router.put('/users/:id/role', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role = 'DEALER' } = req.body;
    const targetRole = String(role).toUpperCase();

    if (!['USER', 'DEALER', 'ADMIN'].includes(targetRole)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const result = await pool.query(
      `UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, full_name, email, role`,
      [targetRole, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, message: `User role updated to ${targetRole}.`, user: result.rows[0] });
  } catch (error) {
    console.error('Update user role error:', error);
    return res.status(500).json({ success: false, message: 'Error updating user role.' });
  }
});

// 7. ADMIN: Delete User Account
router.delete('/users/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, message: 'User account removed successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ success: false, message: 'Error removing user.' });
  }
});

// 8. ADMIN: List All Registered Dealers with Subscription Info & Listing Counts
router.get('/dealers', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const sql = `
      SELECT 
        u.id, u.full_name, u.email, u.phone, u.role, u.agency_name, u.city, u.badge, u.is_verified,
        COALESCE(u.status, 'active') as status, COALESCE(u.is_suspended, false) as is_suspended, u.created_at,
        COUNT(p.id)::int as active_listings_count,
        sp.name as subscription_plan_name,
        sp.listing_limit,
        ds.expiry_date as subscription_expiry,
        CASE 
          WHEN ds.expiry_date IS NULL THEN 'NO_SUBSCRIPTION'
          WHEN ds.expiry_date < NOW() THEN 'EXPIRED'
          ELSE 'ACTIVE'
        END as subscription_status
      FROM users u
      LEFT JOIN properties p ON p.dealer_id = u.id AND p.status = 'active'
      LEFT JOIN dealer_subscriptions ds ON ds.dealer_id = u.id AND ds.status = 'active'
      LEFT JOIN subscription_plans sp ON ds.plan_id = sp.id
      WHERE u.role = 'DEALER'
      GROUP BY u.id, sp.name, sp.listing_limit, ds.expiry_date
      ORDER BY u.created_at DESC
    `;
    const result = await pool.query(sql);
    return res.json({ success: true, count: result.rows.length, dealers: result.rows });
  } catch (error) {
    console.error('Fetch admin dealers error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching dealers.' });
  }
});

// 9. ADMIN: Verify / Badge Dealer
router.patch('/dealers/:id/verify', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified = true, badge = 'VERIFIED DEALER' } = req.body;

    const result = await pool.query(
      `UPDATE users SET is_verified = $1, badge = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND role = 'DEALER' RETURNING id, full_name, email, role, badge, is_verified`,
      [isVerified, badge, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Dealer not found.' });
    }

    return res.json({ success: true, message: '✓ Dealer status & verification badge updated.', dealer: result.rows[0] });
  } catch (error) {
    console.error('Verify dealer error:', error);
    return res.status(500).json({ success: false, message: 'Error updating dealer.' });
  }
});

// 10. ADMIN: Activate or Upgrade Dealer Subscription Plan
router.post('/dealers/:id/activate-subscription', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params; // Dealer User ID
    const { planName = 'PRO DEALER', customDurationDays } = req.body;

    // Find Plan ID
    const planRes = await pool.query('SELECT * FROM subscription_plans WHERE UPPER(name) = UPPER($1)', [planName]);
    if (planRes.rows.length === 0) {
      return res.status(400).json({ success: false, message: `Subscription plan "${planName}" not found.` });
    }

    const plan = planRes.rows[0];
    const durationDays = customDurationDays ? Number(customDurationDays) : plan.duration_days;

    // Deactivate previous active subscriptions for this dealer
    await pool.query("UPDATE dealer_subscriptions SET status = 'replaced' WHERE dealer_id = $1 AND status = 'active'", [id]);

    // Insert new active subscription with calculated expiry_date
    const insertSubSql = `
      INSERT INTO dealer_subscriptions (dealer_id, plan_id, start_date, expiry_date, status, assigned_by_admin_id)
      VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + ($3 || ' days')::INTERVAL, 'active', $4)
      RETURNING *
    `;

    const subRes = await pool.query(insertSubSql, [id, plan.id, durationDays, req.user.userId]);
    const newSub = subRes.rows[0];

    return res.json({
      success: true,
      message: `🎉 Subscription "${plan.name}" successfully activated for dealer! Expiry: ${newSub.expiry_date.toISOString().split('T')[0]}`,
      subscription: {
        ...newSub,
        plan_name: plan.name,
        listing_limit: plan.listing_limit
      }
    });
  } catch (error) {
    console.error('Activate dealer subscription error:', error);
    return res.status(500).json({ success: false, message: 'Error activating subscription for dealer.' });
  }
});

// 11. ADMIN: Moderate Property Status (approved, rejected, suspended, blocked, sold, rented)
router.put('/properties/:id/status', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'approved' } = req.body;

    const result = await pool.query(
      `UPDATE properties SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, title, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    return res.json({ success: true, message: `Property status updated to ${status}.`, property: result.rows[0] });
  } catch (error) {
    console.error('Update property status error:', error);
    return res.status(500).json({ success: false, message: 'Error updating property.' });
  }
});

export default router;
