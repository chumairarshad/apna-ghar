import app from '../../server.js';
import { initDb } from '../../server/db.js';

initDb().catch(err => console.error('Neon DB init error:', err));

export default app;
