import express from 'express';
import { signup, login, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Routes
router.post('/signup', signup);
router.post('/login', login);

// Protected Profile Route
router.get('/me', verifyToken, getMe);

export default router;
