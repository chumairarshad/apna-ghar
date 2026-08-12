import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './server/routes/auth.js';
import propertyRoutes from './server/routes/properties.js';
import adminRoutes from './server/routes/admin.js';
import megaProjectRoutes from './server/routes/megaProjects.js';
import subscriptionRoutes from './server/routes/subscriptions.js';
import uploadRoutes from './server/routes/upload.js';
import pushRoutes from './server/routes/push.js';
import { initDb } from './server/db.js';

dotenv.config();

// Initialize DB schema (users, properties, push_subscriptions tables)
initDb();

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

app.use('/api/mega-projects', megaProjectRoutes);
app.use('/mega-projects', megaProjectRoutes);

app.use('/api/subscriptions', subscriptionRoutes);
app.use('/subscriptions', subscriptionRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/upload', uploadRoutes);
app.use('/upload', uploadRoutes);

app.use('/api/push', pushRoutes);
app.use('/push', pushRoutes);

// Serve static files (index.html, css, js)
app.use(express.static(__dirname));

// Health check endpoint
app.get(['/api', '/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Sarmayadar Real Estate Express API & Neon PostgreSQL'
  });
});

// SPA Fallback Route for non-API GET requests / client-side page refreshes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
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
