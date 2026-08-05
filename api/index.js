import app from '../server.js';
import { initDb } from '../server/db.js';

// Non-blocking auto-initialization of Neon DB schema
initDb().catch(err => console.error('Neon DB init notice:', err));

export default app;
