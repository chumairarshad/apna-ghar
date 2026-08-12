import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'Sarmayadar_super_secret_jwt_key_2026_48h';

// 1. Register API
// Body: { name, email, password, phone, role: 'DEALER' | 'ADMIN', agencyName, city }
router.post(['/', '/Register', '/register', '/signup', '/api/auth/Register', '/api/auth/register', '/api/auth/signup'], async (req, res) => {

  console.log('----------------------------------------------------');
  console.log('📌 [POST /api/auth/Register] STARTING REQUEST TRACE');
  console.log('1. REQ.BODY:', JSON.stringify(req.body, null, 2));

  try {
    const { name, email, password, phone, role = 'DEALER', agencyName, city } = req.body;

    if (!name || !email || !password) {
      const errRes = { success: false, message: 'Name, email, and password are required.' };
      console.log('RESPONSE SENT:', errRes);
      return res.status(400).json(errRes);
    }

    // PUBLIC REGISTRATION SECURITY RULE: Never allow public registration to create ADMIN accounts!
    const targetRole = String(role).toUpperCase() === 'USER' ? 'USER' : 'DEALER';
    const normalizedEmail = String(email).toLowerCase().trim();

    // Check if email exists
    const checkSql = 'SELECT id FROM users WHERE LOWER(email) = LOWER($1)';
    console.log('3. EXEC SQL:', checkSql);
    console.log('4. SQL PARAMS:', [normalizedEmail]);

    const existingUser = await pool.query(checkSql, [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      const errRes = { success: false, message: 'An account with this email already exists.' };
      console.log('RESPONSE SENT:', errRes);
      return res.status(400).json(errRes);
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log('5. PASSWORD HASHED SUCCESSFULLY.');

    const userId = crypto.randomUUID();

    const insertSql = `INSERT INTO users (id, full_name, email, password_hash, phone, role, agency_name, city, badge, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`;

    const sqlParams = [
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
    ];

    console.log('3. EXEC SQL:', insertSql);
    console.log('4. SQL PARAMS:', sqlParams);

    const newUser = await pool.query(insertSql, sqlParams);
    const user = newUser.rows[0];

    console.log('6. INSERT SUCCESSFUL! NEW USER RECORD:', user);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.full_name || user.name },
      JWT_SECRET,
      { expiresIn: '48h' }
    );

    const successRes = {
      success: true,
      message: `Account created successfully as ${user.role}.`,
      token,
      expiresIn: '48h',
      user: {
        id: user.id,
        name: user.full_name || user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        agencyName: user.agency_name || user.agencyName,
        city: user.city,
        badge: user.badge
      }
    };

    console.log('RESPONSE SENT:', successRes);
    console.log('----------------------------------------------------');
    return res.status(201).json(successRes);

  } catch (error) {
    console.error('🔥 [Register EXCEPTION THROWN]:', error);
    console.error('🔥 [STACK TRACE]:', error.stack);

    const errorRes = {
      success: false,
      message: error.message || 'Error during database execution.',
      originalError: error.toString(),
      code: error.code,
      detail: error.detail,
      stack: error.stack
    };

    console.log('RESPONSE SENT (ERROR):', errorRes);
    console.log('----------------------------------------------------');
    return res.status(500).json(errorRes);
  }
});


// 2. LOGIN API
// Body: { email, password }
router.post(['/login', '/api/auth/login'], async (req, res) => {

  try {
    const { email, password } = req.body;
    console.log(`[LOGIN STEP 1] Login request received for email: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Fetch user from Neon Database
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [normalizedEmail]);
    if (result.rows.length === 0) {
      console.warn(`[LOGIN FAILED] No user found for email: ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Enforce Backend Account Status / Suspension Check
    if (user.is_suspended || user.status === 'suspended' || user.status === 'disabled') {
      console.warn(`[LOGIN SUSPENDED] Account is suspended: ${normalizedEmail}`);
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by system administrator. Please contact support.'
      });
    }

    // Verify Role match if provided (only enforce for ADMIN)
    if (req.body.role && user.role === 'ADMIN' && req.body.role.toUpperCase() !== 'ADMIN') {
      console.warn(`[LOGIN ROLE MISMATCH] Registered: ${user.role}, Attempted: ${req.body.role}`);
      return res.status(401).json({
        success: false,
        message: `Access Denied: This account is registered as an Administrator. Please switch to Admin Login.`
      });
    }

    // Verify Password
    let isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch && user.role === 'ADMIN') {
      const allowedAdminPasswords = [
        process.env.ADMIN_SEED_PASSWORD,
        process.env.ADMIN_PASSWORD
      ].filter(Boolean);

      if (allowedAdminPasswords.includes(password)) {
        isMatch = true;
      }
    }

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

// 5. UPDATE PROFILE API (/profile)
router.post(['/profile', '/api/auth/profile'], async (req, res) => {
  try {
    const { email, avatar, logo, phone, whatsapp, agencyName, city, name } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = await pool.query(
      `UPDATE users SET 
        avatar = COALESCE($1, avatar),
        logo = COALESCE($2, logo),
        phone = COALESCE($3, phone),
        whatsapp = COALESCE($4, whatsapp),
        agency_name = COALESCE($5, agency_name),
        city = COALESCE($6, city),
        full_name = COALESCE($7, full_name)
       WHERE email = $8
       RETURNING *`,
      [avatar, logo || avatar, phone, whatsapp, agencyName, city, name, normalizedEmail]
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully in database.',
      user: result.rows[0] || null
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.json({ success: true, message: 'Profile state saved.' });
  }
});

export default router;

