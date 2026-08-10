import express from 'express';
import { Register, login, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Routes
router.post('/Register', Register);
router.post('/login', login);

// Protected Profile Route
router.get('/me', verifyToken, getMe);

export default router;
