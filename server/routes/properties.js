import express from 'express';
import { pool } from '../db.js';
import { authenticateToken, requireRole } from '../middleware.js';
import { sendNewPropertyNotification } from '../services/pushService.js';

const router = express.Router();

// Helper to normalize active status checks
function isPublishedStatus(status) {
  if (!status) return false;
  const s = String(status).toLowerCase().trim();
  return s === 'active' || s === 'published' || s === 'public';
}

// 1. PUBLIC: Search & List All Active Properties
router.get('/', async (req, res) => {
  try {
    const { city, purpose, category, minPrice, maxPrice } = req.query;

    let query = `
      SELECT p.*, u.full_name as agent_name, u.agency_name, u.phone as agent_phone, u.badge as agent_badge
      FROM properties p
      LEFT JOIN users u ON p.dealer_id = u.id
      WHERE LOWER(p.status) IN ('active', 'published', 'public')
    `;
    const params = [];

    if (city && city !== 'all') {
      params.push(city);
      query += ` AND LOWER(p.city) = LOWER($${params.length})`;
    }

    if (purpose && purpose !== 'all') {
      params.push(purpose);
      query += ` AND LOWER(p.purpose) = LOWER($${params.length})`;
    }

    if (category && category !== 'all') {
      params.push(category);
      query += ` AND LOWER(p.category) = LOWER($${params.length})`;
    }

    if (maxPrice && maxPrice !== 'any') {
      params.push(Number(maxPrice));
      query += ` AND p.price <= $${params.length}`;
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);
    return res.json({ success: true, count: result.rows.length, properties: result.rows });
  } catch (error) {
    console.error('Fetch properties error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching properties.' });
  }
});

// 1b. PUBLIC / USER: Create & Publish Property into Neon PostgreSQL
router.post('/', async (req, res) => {
  try {
    const {
      id, title, purpose = 'sale', category = 'house', city, location, address,
      price, sizeMarla, bedrooms = 4, bathrooms = 5, description = '', images = [], features = [],
      agentName, agentPhone, agencyName, status = 'active'
    } = req.body;

    if (!title || !price || !city || !location) {
      return res.status(400).json({ success: false, message: 'Title, price, city, and location are required.' });
    }

    const propId = id || `prop-${Date.now()}`;

    // Check pre-existing status to prevent duplicate notifications on edit
    const existingCheck = await pool.query('SELECT status FROM properties WHERE id = $1', [propId]);
    const oldStatus = existingCheck.rows.length > 0 ? existingCheck.rows[0].status : null;

    const result = await pool.query(
      `INSERT INTO properties 
       (id, title, purpose, category, city, location, address, price, size_marla, bedrooms, bathrooms, description, images, features, agent_name, agent_phone, agency_name, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         purpose = EXCLUDED.purpose,
         category = EXCLUDED.category,
         city = EXCLUDED.city,
         location = EXCLUDED.location,
         address = EXCLUDED.address,
         price = EXCLUDED.price,
         size_marla = EXCLUDED.size_marla,
         bedrooms = EXCLUDED.bedrooms,
         bathrooms = EXCLUDED.bathrooms,
         description = EXCLUDED.description,
         images = EXCLUDED.images,
         features = EXCLUDED.features,
         agent_name = EXCLUDED.agent_name,
         agent_phone = EXCLUDED.agent_phone,
         agency_name = EXCLUDED.agency_name,
         status = EXCLUDED.status,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        propId, title, purpose, category, city, location, address || location,
        price, sizeMarla || 10, bedrooms, bathrooms, description, images, features,
        agentName || 'Verified Agent', agentPhone || '+92 300 0000000', agencyName || 'Sarmayadar Real Estate',
        status
      ]
    );

    const savedProperty = result.rows[0];

    // Trigger push notification ONLY if status transitions to published/active
    if (isPublishedStatus(savedProperty.status) && !isPublishedStatus(oldStatus)) {
      sendNewPropertyNotification(savedProperty).catch(err => {
        console.warn('Async Push notification notice:', err.message);
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Property saved successfully in Neon PostgreSQL Database.',
      property: savedProperty
    });
  } catch (error) {
    console.error('Create property error in Neon DB:', error);
    return res.status(500).json({ success: false, message: 'Error saving property to Neon Database.' });
  }
});

router.get('/dealer/inventory', authenticateToken, requireRole('DEALER', 'ADMIN'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM properties WHERE dealer_id = $1 ORDER BY created_at DESC`,
      [req.user.userId]
    );
    return res.json({ success: true, count: result.rows.length, properties: result.rows });
  } catch (error) {
    console.error('Fetch dealer inventory error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching inventory.' });
  }
});

// 3. DEALER PORTAL: Create New Property Listing
router.post('/dealer/properties', authenticateToken, requireRole('DEALER', 'ADMIN'), async (req, res) => {
  try {
    const {
      title, purpose = 'sale', category = 'house', city, location, address,
      price, sizeMarla, bedrooms = 4, bathrooms = 5, description, images = [], features = [],
      status = 'active'
    } = req.body;

    if (!title || !price || !city || !location) {
      return res.status(400).json({ success: false, message: 'Title, price, city, and location are required.' });
    }

    const result = await pool.query(
      `INSERT INTO properties 
       (dealer_id, title, purpose, category, city, location, address, price, size_marla, bedrooms, bathrooms, description, images, features, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        req.user.userId, title, purpose, category, city, location, address || location,
        price, sizeMarla || 10, bedrooms, bathrooms, description || '', images, features, status
      ]
    );

    const savedProperty = result.rows[0];

    // Trigger push notification for new publication
    if (isPublishedStatus(savedProperty.status)) {
      sendNewPropertyNotification(savedProperty).catch(err => {
        console.warn('Async Push notification notice:', err.message);
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Property created successfully.',
      property: savedProperty
    });
  } catch (error) {
    console.error('Create property error:', error);
    return res.status(500).json({ success: false, message: 'Error creating property.' });
  }
});

// 4. DEALER PORTAL: Update Property Listing
router.put('/dealer/properties/:id', authenticateToken, requireRole('DEALER', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, purpose, category, city, location, address, price, sizeMarla, bedrooms, bathrooms, description, images, features, status } = req.body;

    // Check ownership & existing status
    const check = await pool.query('SELECT dealer_id, status FROM properties WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    if (req.user.role !== 'ADMIN' && check.rows[0].dealer_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this property.' });
    }

    const oldStatus = check.rows[0].status;

    const result = await pool.query(
      `UPDATE properties SET
       title = COALESCE($1, title),
       purpose = COALESCE($2, purpose),
       category = COALESCE($3, category),
       city = COALESCE($4, city),
       location = COALESCE($5, location),
       address = COALESCE($6, address),
       price = COALESCE($7, price),
       size_marla = COALESCE($8, size_marla),
       bedrooms = COALESCE($9, bedrooms),
       bathrooms = COALESCE($10, bathrooms),
       description = COALESCE($11, description),
       images = COALESCE($12, images),
       features = COALESCE($13, features),
       status = COALESCE($14, status),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      [title, purpose, category, city, location, address, price, sizeMarla, bedrooms, bathrooms, description, images, features, status, id]
    );

    const updatedProperty = result.rows[0];

    // Trigger push notification ONLY when status transitions from non-active to active
    if (isPublishedStatus(updatedProperty.status) && !isPublishedStatus(oldStatus)) {
      sendNewPropertyNotification(updatedProperty).catch(err => {
        console.warn('Async Push notification notice:', err.message);
      });
    }

    return res.json({ success: true, message: 'Property updated.', property: updatedProperty });
  } catch (error) {
    console.error('Update property error:', error);
    return res.status(500).json({ success: false, message: 'Error updating property.' });
  }
});

// 5. DEALER PORTAL / ADMIN: Delete Property Listing
router.delete('/dealer/properties/:id', authenticateToken, requireRole('DEALER', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query('SELECT dealer_id FROM properties WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    if (req.user.role !== 'ADMIN' && check.rows[0].dealer_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this property.' });
    }

    await pool.query('DELETE FROM properties WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Property deleted successfully.' });
  } catch (error) {
    console.error('Delete property error:', error);
// 6. PUBLIC / USER: Delete Property Listing
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM properties WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Property deleted successfully.' });
  } catch (error) {
    console.error('Delete property error in Neon DB:', error);
    return res.status(500).json({ success: false, message: 'Error deleting property.' });
  }
});

export default router;
