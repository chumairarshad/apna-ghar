import express from 'express';
import { pool } from '../db.js';
import { authenticateToken, requireRole } from '../middleware.js';

const router = express.Router();

// 1. PUBLIC / DEALER: Get All Approved Mega Projects
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT mp.*, u.agency_name, u.phone as dealer_phone, u.email as dealer_email 
       FROM mega_projects mp
       LEFT JOIN users u ON mp.dealer_id = u.id
       ORDER BY mp.created_at DESC`
    );
    return res.json({ success: true, count: result.rows.length, megaProjects: result.rows });
  } catch (error) {
    console.error('Fetch mega projects error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching mega projects.' });
  }
});

// 2. DEALER / ADMIN: Create New Mega Project Listing
router.post('/', authenticateToken, requireRole('DEALER', 'ADMIN'), async (req, res) => {
  try {
    const {
      projectName,
      developerName,
      location,
      city = 'Lahore',
      address,
      description,
      images = [],
      propertyTypes = ['Apartments', 'Shops'],
      totalUnits = 100,
      minPrice = 5000000,
      maxPrice = 50000000,
      paymentPlanDesc = '3 Year Easy Installments Plan with 15% Downpayment.',
      amenities = ['24/7 Security', 'Elevators', 'Power Backup', 'Parking']
    } = req.body;

    if (!projectName || !developerName || !location || !description) {
      return res.status(400).json({ success: false, message: 'Project Name, Developer Name, Location, and Description are required.' });
    }

    const dealerId = req.user.userId;

    const sql = `
      INSERT INTO mega_projects (
        dealer_id, project_name, developer_name, location, city, address, 
        description, images, property_types, total_units, min_price, max_price, 
        payment_plan_desc, amenities, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'approved')
      RETURNING *
    `;

    const params = [
      dealerId,
      projectName,
      developerName,
      location,
      city,
      address || `${location}, ${city}`,
      description,
      images.length > 0 ? images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
      propertyTypes,
      totalUnits,
      minPrice,
      maxPrice,
      paymentPlanDesc,
      amenities
    ];

    const result = await pool.query(sql, params);
    return res.status(201).json({ success: true, message: '🚀 Mega Project created successfully!', megaProject: result.rows[0] });
  } catch (error) {
    console.error('Create mega project error:', error);
    return res.status(500).json({ success: false, message: 'Error creating mega project.' });
  }
});

// 3. ADMIN: Approve / Reject / Feature Mega Project Status
router.put('/:id/status', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'approved', isFeatured = false } = req.body;

    const result = await pool.query(
      `UPDATE mega_projects SET status = $1, is_featured = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      [status, isFeatured, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mega Project not found.' });
    }

    return res.json({ success: true, message: `Mega Project status updated to ${status}.`, megaProject: result.rows[0] });
  } catch (error) {
    console.error('Update mega project status error:', error);
    return res.status(500).json({ success: false, message: 'Error updating mega project.' });
  }
});

// 4. DEALER / ADMIN: Delete Mega Project
router.delete('/:id', authenticateToken, requireRole('DEALER', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';

    const sql = isAdmin 
      ? `DELETE FROM mega_projects WHERE id = $1 RETURNING id`
      : `DELETE FROM mega_projects WHERE id = $1 AND dealer_id = $2 RETURNING id`;
    
    const params = isAdmin ? [id] : [id, userId];
    const result = await pool.query(sql, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mega Project not found or access denied.' });
    }

    return res.json({ success: true, message: '🗑️ Mega Project deleted successfully.' });
  } catch (error) {
    console.error('Delete mega project error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting mega project.' });
  }
});

export default router;
