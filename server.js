import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './server/routes/auth.js';
import propertyRoutes from './server/routes/properties.js';
import adminRoutes from './server/routes/admin.js';
import uploadRoutes from './server/routes/upload.js';
import { initDb } from './server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount API routes for both /api/* and /* for Vercel Serverless Function compatibility
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/properties', propertyRoutes);
app.use('/properties', propertyRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.use('/api/upload', uploadRoutes);
app.use('/upload', uploadRoutes);

// Health check endpoint
app.get(['/api', '/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Sarmayadar Real Estate Express API & Neon PostgreSQL'
  });
});

export default app;

// Start Server locally if running as standalone process
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Sarmayadar Express Server live at http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}
