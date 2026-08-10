import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { RegisterSchema, loginSchema } from '../validators/auth.validator.js';

const JWT_SECRET = process.env.JWT_SECRET || 'Sarmayadar_super_secret_jwt_key_2026_48h';
const JWT_EXPIRES_IN = '48h'; // Strictly 48 Hours

/**
 * @route   POST /api/auth/Register
 * @desc    Register a new User or Dealer account
 * @access  Public
 */
export async function Register(req, res, next) {
  try {
    // 1. Zod Input Validation
    const validationResult = RegisterSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errorMessages
      });
    }

    const { name, email, password, phone, role, agencyName, city } = validationResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if user email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // 3. Hash password using bcrypt (10 salt rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create User in Neon PostgreSQL Database via Prisma
    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || '',
        role, // DEALER or ADMIN
        agencyName: role === 'DEALER' ? (agencyName || name) : null,
        city: city || 'Lahore',
        isVerified: true,
        badge: role === 'ADMIN' ? 'SUPER_ADMIN' : 'VERIFIED'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        agencyName: true,
        city: true,
        badge: true,
        createdAt: true
      }
    });

    // 5. Generate 48-Hour JWT Security Token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: `Account created successfully as ${newUser.role}.`,
      token,
      expiresIn: JWT_EXPIRES_IN,
      user: newUser
    });

  } catch (error) {
    next(error);
  }
}

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate User/Dealer/Admin & return 48-Hour JWT
 * @access  Public
 */
export async function login(req, res, next) {
  try {
    // 1. Zod Input Validation
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errorMessages
      });
    }

    const { email, password } = validationResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 2. Fetch User from Neon Database
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    // 3. Verify Password via bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    // 4. Generate 48-Hour JWT Security Token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      expiresIn: JWT_EXPIRES_IN,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        agencyName: user.agencyName,
        city: user.city,
        badge: user.badge
      }
    });

  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/auth/me
 * @desc    Get Current Authenticated User Profile
 * @access  Protected
 */
export async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        agencyName: true,
        city: true,
        badge: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
}
