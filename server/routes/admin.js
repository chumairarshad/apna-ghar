import express from 'express';
import { pool } from '../db.js';
import { authenticateToken, requireRole } from '../middleware.js';

const router = express.Router();

// 1. ADMIN: List All Platform Users (Filterable by role: USER, DEALER, ADMIN)
router.get('/users', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { role } = req.query;
    let sql = `SELECT id, full_name, email, phone, role, agency_name, city, badge, is_verified, created_at FROM users`;
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

// 2. ADMIN: Edit User Role (USER <-> DEALER <-> ADMIN)
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

// 3. ADMIN: Delete User Account
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

// 4. ADMIN: List All Registered Dealers
router.get('/dealers', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, role, agency_name, city, badge, is_verified, created_at 
       FROM users 
       WHERE role = 'DEALER' 
       ORDER BY created_at DESC`
    );
    return res.json({ success: true, count: result.rows.length, dealers: result.rows });
  } catch (error) {
    console.error('Fetch admin dealers error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching dealers.' });
  }
});

// 5. ADMIN: Verify / Badge Dealer
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

// 6. ADMIN: Moderate Property Status (approved, rejected, suspended, blocked, sold, rented)
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
