import express from 'express';
import { pool } from '../db.js';
import { authenticateToken, requireRole } from '../middleware.js';

const router = express.Router();

// 1. ADMIN: List All Registered Dealers
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

// 2. ADMIN: Verify / Badge Dealer
router.patch('/dealers/:id/verify', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified = true, badge = 'PLATINUM_VERIFIED' } = req.body;

    const result = await pool.query(
      `UPDATE users SET is_verified = $1, badge = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND role = 'DEALER' RETURNING id, full_name, email, role, badge, is_verified`,
      [isVerified, badge, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Dealer not found.' });
    }

    return res.json({ success: true, message: 'Dealer status & verification badge updated.', dealer: result.rows[0] });
  } catch (error) {
    console.error('Verify dealer error:', error);
    return res.status(500).json({ success: false, message: 'Error updating dealer.' });
  }
});

// 3. ADMIN: Delete / Suspend Dealer
router.delete('/dealers/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM users WHERE id = $1 AND role = 'DEALER' RETURNING id`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Dealer not found.' });
    }

    return res.json({ success: true, message: 'Dealer account and associated listings removed.' });
  } catch (error) {
    console.error('Delete dealer error:', error);
    return res.status(500).json({ success: false, message: 'Error removing dealer.' });
  }
});

export default router;
