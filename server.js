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
const PORT = process.env.PORT || 5000;

// Auto-initialize Neon PostgreSQL DB schema
initDb().catch(err => console.error('Neon DB init error:', err));

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static frontend files
app.use(express.static(__dirname));

// API Routes (Mounted for both /api/ and root paths for Vercel Serverless Function compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/properties', propertyRoutes);
app.use('/properties', propertyRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.use('/api/upload', uploadRoutes);
app.use('/upload', uploadRoutes);


// Fallback for Single Page Application
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

export default app;

// Start Server locally if not running as serverless function
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Apna Ghar Express & Neon Backend live at http://localhost:${PORT}`);
    console.log(`🔐 Auth APIs: http://localhost:${PORT}/api/auth/signup | /login`);
    console.log(`🏢 Property APIs: http://localhost:${PORT}/api/properties`);
    console.log(`====================================================`);
  });
}
