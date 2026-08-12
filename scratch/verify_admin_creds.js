import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { pool } from '../server/db.js';

dotenv.config();

async function verifyAdminCreds() {
  console.log('====================================================');
  console.log('🔍 INSPECTING ADMIN ACCOUNT IN POSTGRESQL DATABASE');
  console.log('====================================================');

  const res = await pool.query("SELECT * FROM users WHERE role = 'ADMIN' OR email = 'admin@sarmayadar.com'");

  console.log(`Found ${res.rows.length} Admin account(s):`);
  for (const user of res.rows) {
    console.log(`- ID: ${user.id}`);
    console.log(`  Name: ${user.full_name || user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Status: ${user.status || 'active'}, Suspended: ${user.is_suspended || false}`);
    console.log(`  Password Hash: ${user.password_hash ? user.password_hash.substring(0, 20) + '...' : 'NULL'}`);

    // Check with candidate passwords
    const candidatePasswords = [
      process.env.ADMIN_SEED_PASSWORD,
      'AdminSecretPass2026!',
      'AdminPassword123!',
      'admin123',
      'Admin123!'
    ].filter(Boolean);

    for (const pwd of candidatePasswords) {
      const match = await bcrypt.compare(pwd, user.password_hash);
      if (match) {
        console.log(`  ✅ PASSWORD MATCH FOUND: "${pwd}"`);
      }
    }
  }

  console.log('====================================================');
  process.exit(0);
}

verifyAdminCreds().catch(err => {
  console.error('Error verifying admin creds:', err);
  process.exit(1);
});
