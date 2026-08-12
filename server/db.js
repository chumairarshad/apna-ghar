import pg from 'pg';
import bcrypt from 'bcryptjs';
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

      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        endpoint TEXT UNIQUE NOT NULL,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        user_agent TEXT,
        device_type VARCHAR(20) DEFAULT 'desktop',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE push_subscriptions ADD COLUMN IF NOT EXISTS device_type VARCHAR(20) DEFAULT 'desktop';

      CREATE INDEX IF NOT EXISTS idx_push_sub_is_active ON push_subscriptions(is_active);
      CREATE INDEX IF NOT EXISTS idx_push_sub_user_id ON push_subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_push_sub_device_type ON push_subscriptions(device_type);

      -- 4. Mega Projects Table
      CREATE TABLE IF NOT EXISTS mega_projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        dealer_id UUID REFERENCES users(id) ON DELETE CASCADE,
        project_name VARCHAR(255) NOT NULL,
        developer_name VARCHAR(150) NOT NULL,
        location VARCHAR(150) NOT NULL,
        city VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        description TEXT NOT NULL,
        images TEXT[] DEFAULT '{}',
        property_types TEXT[] DEFAULT '{}',
        total_units INT DEFAULT 100,
        min_price BIGINT NOT NULL DEFAULT 5000000,
        max_price BIGINT NOT NULL DEFAULT 50000000,
        payment_plan_desc TEXT,
        amenities TEXT[] DEFAULT '{}',
        status VARCHAR(30) DEFAULT 'approved',
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- 5. Subscription Plans Table
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        price_pkr BIGINT NOT NULL DEFAULT 0,
        duration_days INT NOT NULL DEFAULT 30,
        listing_limit INT NOT NULL DEFAULT 5,
        mega_project_limit INT NOT NULL DEFAULT 0,
        featured_limit INT NOT NULL DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Seed Standard Subscription Plans
      INSERT INTO subscription_plans (name, price_pkr, duration_days, listing_limit, mega_project_limit, featured_limit)
      VALUES 
        ('BASIC', 0, 365, 5, 0, 0),
        ('PRO DEALER', 15000, 30, 25, 2, 5),
        ('AGENCY ELITE', 45000, 30, 100, 10, 25)
      ON CONFLICT (name) DO NOTHING;

      -- 6. Dealer Subscriptions Active Table
      CREATE TABLE IF NOT EXISTS dealer_subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        dealer_id UUID REFERENCES users(id) ON DELETE CASCADE,
        plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
        start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expiry_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
        status VARCHAR(20) DEFAULT 'active',
        listings_used INT DEFAULT 0,
        mega_projects_used INT DEFAULT 0,
        assigned_by_admin_id UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Add Migration Columns safely
      ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;
      ALTER TABLE dealer_subscriptions ADD COLUMN IF NOT EXISTS assigned_by_admin_id UUID REFERENCES users(id);
    `);

    // Seed Initial Super Admin Account if not existing
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_SEED_PASSWORD environment variable must be defined.');
    }
    const adminHash = bcrypt.hashSync(adminPassword, 10);
    await pool.query(`
      INSERT INTO users (full_name, email, password_hash, phone, role, agency_name, city, badge, is_verified, status, is_suspended)
      VALUES (
        'Sarmayadar Super Admin',
        'admin@sarmayadar.com',
        $1,
        '+92 300 0000000',
        'ADMIN',
        'Sarmayadar Executive Board',
        'Lahore',
        'SUPER_ADMIN',
        true,
        'active',
        false
      )
      ON CONFLICT (email) DO UPDATE SET password_hash = $1, role = 'ADMIN', status = 'active', is_suspended = false;
    `, [adminHash]);
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
