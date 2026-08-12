import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;

async function cleanTestAccounts() {
  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('--- INSPECTING AND CLEANING TEST ACCOUNTS IN POSTGRESQL ---');
    
    // Find all test/attacker accounts
    const searchRes = await pool.query(`
      SELECT id, full_name, email, role, created_at
      FROM users
      WHERE email LIKE '%attacker%'
         OR email LIKE '%hack%'
         OR email LIKE '%audit%'
         OR full_name LIKE '%Attacker%'
         OR full_name LIKE '%Hacked%'
         OR full_name LIKE '%Malicious%'
         OR email LIKE '%test_dealer%'
         OR email LIKE '%test_user%'
    `);

    console.log(`Found ${searchRes.rows.length} automated test records in database:`);
    searchRes.rows.forEach(r => {
      console.log(`- ${r.full_name} (${r.email}) [Role: ${r.role}]`);
    });

    const deleteRes = await pool.query(`
      DELETE FROM users
      WHERE email LIKE '%@test.com%'
         OR email LIKE '%@hack.com%'
         OR email LIKE '%@agency.com%'
         OR email LIKE '%@client.com%'
         OR email LIKE '%subadmin_%'
         OR email LIKE '%dealer_%'
         OR email LIKE '%test_%'
         OR full_name LIKE '%Attacker%'
         OR full_name LIKE '%Hacked%'
         OR full_name LIKE '%Malicious%'
         OR full_name LIKE '%Normal User%'
         OR full_name LIKE '%Secondary Admin%'
    `);
    console.log(`\n✅ Cleaned up ${deleteRes.rowCount} test records from PostgreSQL database!`);

    // List remaining clean accounts
    const remainingRes = await pool.query(`
      SELECT id, full_name, email, role, created_at
      FROM users
      ORDER BY created_at ASC
    `);

    console.log(`\nRemaining Active Users in Database (${remainingRes.rows.length}):`);
    remainingRes.rows.forEach(r => {
      console.log(`- ${r.full_name} (${r.email}) [Role: ${r.role}]`);
    });

  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    await pool.end();
  }
}

cleanTestAccounts();
