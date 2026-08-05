import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'apnaghar_super_secret_jwt_key_2026_48h';

// 1. SIGNUP API
// Body: { name, email, password, phone, role: 'DEALER' | 'ADMIN', agencyName, city }
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role = 'DEALER', agencyName, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const targetRole = ['DEALER', 'ADMIN'].includes(role.toUpperCase()) ? role.toUpperCase() : 'DEALER';
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert into Neon Database
    const newUser = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone, role, agency_name, city, badge, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, full_name, email, phone, role, agency_name, city, badge, is_verified, created_at`,
      [name, normalizedEmail, passwordHash, phone || '', targetRole, agencyName || '', city || 'Lahore', targetRole === 'ADMIN' ? 'SUPER_ADMIN' : 'VERIFIED', true]
    );

    const user = newUser.rows[0];

    // Generate JWT token with 48 hours expiration
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.full_name },
      JWT_SECRET,
      { expiresIn: '48h' }
    );

    return res.status(201).json({
      success: true,
      message: `Account created successfully as ${user.role}.`,
      token,
      expiresIn: '48h',
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        agencyName: user.agency_name,
        city: user.city,
        badge: user.badge
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
});

// 2. LOGIN API
// Body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Fetch user from Neon Database
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT Token (48h expiration)
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.full_name },
      JWT_SECRET,
      { expiresIn: '48h' }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.full_name}!`,
      token,
      expiresInHours: 48,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        agencyName: user.agency_name,
        city: user.city,
        badge: user.badge
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// 3. GET PROFILE API (/me)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, role, agency_name, city, badge, is_verified, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
});

export default router;
