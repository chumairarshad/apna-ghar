import http from 'http';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
        }
        resolve({ statusCode: res.statusCode, data: parsed, headers: res.headers });
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function verifyAdminAccount() {
  console.log('=== VERIFYING ADMIN ACCOUNT & CREDENTIALS ===');
  
  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const dbRes = await pool.query(`
      SELECT id, email, full_name, role, status, is_suspended, created_at
      FROM users
      WHERE role = 'ADMIN' AND email = 'admin@sarmayadar.com'
    `);

    if (dbRes.rows.length === 0) {
      console.log('DB Record: NOT FOUND');
    } else {
      const user = dbRes.rows[0];
      console.log('DB Record Found:');
      console.log('- Email:', user.email);
      console.log('- Role:', user.role);
      console.log('- Full Name:', user.full_name);
      console.log('- Status:', user.status || 'active');
      console.log('- Is Suspended:', user.is_suspended || false);
    }

    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'AdminSecretPass2026!';
    console.log('- Configured Seed Password in .env:', process.env.ADMIN_SEED_PASSWORD);

    // Test API Login
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'admin@sarmayadar.com',
      password: adminPassword,
      role: 'ADMIN'
    });

    console.log('\nAPI Login Test:');
    console.log('- HTTP Status:', loginRes.statusCode);
    console.log('- Login Success:', loginRes.data?.success || false);
    console.log('- Returned User Role:', loginRes.data?.user?.role || 'NONE');
    console.log('- JWT Token Issued:', Boolean(loginRes.data?.token));

  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await pool.end();
  }
}

verifyAdminAccount();
