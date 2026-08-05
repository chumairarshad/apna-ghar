import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_uhLwYqKU2t4G@ep-cool-star-ax61pej5.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

console.log('⚡ Connecting to Neon PostgreSQL...');

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testNeon() {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to Neon Database!');

    // 1. Check existing tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Existing Public Tables in Neon:', tablesRes.rows.map(r => r.table_name));

    // 2. Check users table columns if users table exists
    const usersCols = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    console.log('👤 "users" Table Columns:', usersCols.rows);

    // 3. Count rows in users
    try {
      const usersCount = await client.query('SELECT COUNT(*) FROM users');
      console.log('📊 Current total users count:', usersCount.rows[0].count);
    } catch (e) {
      console.error('Error counting users:', e.message);
    }

    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection or Query Error:', err);
    process.exit(1);
  }
}

testNeon();
