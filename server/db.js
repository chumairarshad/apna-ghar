import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Neon Serverless PostgreSQL Pool Connection
export const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_uhLwYqKU2t4G@ep-cool-star-ax61pej5.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});


let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (

        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'DEALER',
        agency_name VARCHAR(150),
        city VARCHAR(100),
        badge VARCHAR(50) DEFAULT 'VERIFIED',
        is_verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS properties (
        id VARCHAR(100) PRIMARY KEY,
        dealer_id UUID REFERENCES users(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        purpose VARCHAR(20) NOT NULL DEFAULT 'sale',
        category VARCHAR(50) NOT NULL DEFAULT 'house',
        city VARCHAR(100) NOT NULL,
        location VARCHAR(150) NOT NULL,
        address TEXT NOT NULL,
        price BIGINT NOT NULL,
        size_marla NUMERIC(10,2) NOT NULL,
        bedrooms INT DEFAULT 0,
        bathrooms INT DEFAULT 0,
        description TEXT NOT NULL,
        images TEXT[] DEFAULT '{}',
        features TEXT[] DEFAULT '{}',
        status VARCHAR(20) DEFAULT 'active',
        views_count INT DEFAULT 0,
        agent_name VARCHAR(150),
        agent_phone VARCHAR(50),
        agency_name VARCHAR(150),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    isInitialized = true;
    console.log('✅ Neon PostgreSQL Database schema ready!');
  } catch (err) {
    console.warn('⚠️ Neon Database table initialization notice:', err.message);
  }
}

pool.on('connect', () => {
  console.log('⚡ Connected to Neon PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌ Neon Database connection error:', err);
});
