import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security Headers via Helmet.js
app.use(helmet());

// 2. Cross-Origin Resource Sharing (CORS) for Next.js / Frontend Frameworks
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

// 3. API Rate Limiting to prevent Brute-Force & Denial of Service attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', apiLimiter);

// 4. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 5. Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Sarmayadar Real Estate Express API & Neon PostgreSQL'
  });
});

// 6. API Route Registrations
app.use('/api/auth', authRoutes);

// 7. Global Error Handler Middleware
app.use(errorHandler);

// Start Express Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Real Estate API Server live on port ${PORT}`);
    console.log(`🔒 Security: Helmet.js, CORS, and Rate-Limiter Enabled`);
    console.log(`🔑 Auth Endpoints: http://localhost:${PORT}/api/auth/signup | /login`);
    console.log(`=======================================================`);
  });
}

export default app;
