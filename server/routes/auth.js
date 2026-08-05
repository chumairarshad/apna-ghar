import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'apnaghar_super_secret_jwt_key_2026_48h';

// 1. SIGNUP API
// Body: { name, email, password, phone, role: 'DEALER' | 'ADMIN', agencyName, city }
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role = 'DEALER', agencyName, city } = req.body;
    console.log(`[SIGNUP STEP 1] Request received: name="${name}", email="${email}", role="${role}"`);

    if (!name || !email || !password) {
      console.warn(`[SIGNUP VALIDATION FAILED] Missing required fields`);
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const targetRole = ['DEALER', 'ADMIN'].includes(role.toUpperCase()) ? role.toUpperCase() : 'DEALER';
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[SIGNUP STEP 2] Validation passed. Normalized email: "${normalizedEmail}", Target Role: "${targetRole}"`);

    // Check if email exists
    console.log(`[SIGNUP STEP 3] Checking if email "${normalizedEmail}" already exists in Neon DB...`);
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      console.warn(`[SIGNUP FAILED] Email "${normalizedEmail}" already exists in users table`);
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    console.log(`[SIGNUP STEP 4] Hashing password with bcrypt saltRounds=10...`);
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log(`[SIGNUP STEP 5] Password hashed successfully.`);

    // Generate explicit UUID for id column
    const userId = crypto.randomUUID();
    console.log(`[SIGNUP STEP 6] Executing INSERT INTO users table with ID: ${userId}...`);

    const newUser = await pool.query(
      `INSERT INTO users (id, full_name, email, password_hash, phone, role, agency_name, city, badge, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, full_name, email, phone, role, agency_name, city, badge, is_verified, created_at`,
      [
        userId,
        name,
        normalizedEmail,
        passwordHash,
        phone || '',
        targetRole,
        agencyName || name,
        city || 'Lahore',
        targetRole === 'ADMIN' ? 'SUPER_ADMIN' : 'VERIFIED',
        true
      ]
    );

    const user = newUser.rows[0];
    console.log(`[SIGNUP STEP 7] User successfully created & inserted into Neon users table! User ID: ${user.id}`);

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
    console.error('❌ [SIGNUP ERROR] Database insertion failed:', error);
    return res.status(500).json({ success: false, message: `Server error during signup: ${error.message}` });
  }
});

// 2. LOGIN API
// Body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN STEP 1] Login request received for email: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Fetch user from Neon Database
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (result.rows.length === 0) {
      console.warn(`[LOGIN FAILED] No user found for email: ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Verify Role match if provided
    if (req.body.role && user.role !== req.body.role.toUpperCase()) {
      console.warn(`[LOGIN ROLE MISMATCH] Registered: ${user.role}, Attempted: ${req.body.role}`);
      return res.status(401).json({
        success: false,
        message: `Access Denied: This account is registered as a ${user.role}. Please switch to the ${user.role} Login tab.`
      });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.warn(`[LOGIN PASSWORD FAILED] Incorrect password for email: ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    console.log(`[LOGIN SUCCESS] User authenticated: ${user.full_name} (${user.role})`);

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
    console.error('❌ [LOGIN ERROR]:', error);
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

// 4. RESET PASSWORD API
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No account found with this email address.' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [passwordHash, normalizedEmail]);

    return res.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Server error during password reset.' });
  }
});

export default router;

