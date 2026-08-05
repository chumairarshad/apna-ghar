import app from '../server.js';
import { initDb } from '../server/db.js';

// Auto-initialize Neon PostgreSQL DB schema on serverless invocation
initDb().catch(err => console.error('Neon DB init error:', err));

export default app;
