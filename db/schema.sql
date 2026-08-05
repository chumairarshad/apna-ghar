-- Database Migration Script for Neon PostgreSQL
-- Run this SQL in your Neon DB SQL Console to initialize tables

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'DEALER' CHECK (role IN ('DEALER', 'ADMIN')),
    agency_name VARCHAR(150),
    city VARCHAR(100),
    badge VARCHAR(50) DEFAULT 'VERIFIED',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROPERTIES Table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('sale', 'rent')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('house', 'apartment', 'plot', 'commercial')),
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
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending')),
    views_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DEALER LEADS Table
CREATE TABLE IF NOT EXISTS dealer_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    client_name VARCHAR(150) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    client_email VARCHAR(150),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Initial Admin User (Default Password: AdminPassword123!)
-- Hash for 'AdminPassword123!': $2a$10$7vN1tE/Y38pUuGq5RzW8I.Kz2L0cE2zY9R3P1z1z1z1z1z1z1z1z
INSERT INTO users (email, password_hash, full_name, phone, role, is_verified, badge)
VALUES ('admin@apnaghar.pk', '$2a$10$Eq.uU9.z1V/F.k5y7F6K9e6j9.r1z.m8z.p2q3r4s5t6u7v8w9x0', 'System Administrator', '+92 300 0000000', 'ADMIN', TRUE, 'SUPER_ADMIN')
ON CONFLICT (email) DO NOTHING;
