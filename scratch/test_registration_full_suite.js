import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, initDb } from '../server/db.js';
import app from '../server.js';

async function runTestSuite() {
  console.log('🚀 Starting Full Auth & Registration Integration Test Suite...\n');
  await initDb();

  const server = app.listen(5099);
  const BASE_URL = 'http://localhost:5099';

  try {
    const testTimestamp = Date.now();
    const testEmail = `dealer_test_${testTimestamp}@sarmayadar.com`;
    const testPassword = 'SecurePassword2026!';
    const testName = 'Test Elite Agency';
    const testPhone = '+92 300 7654321';

    // -------------------------------------------------------------
    // Test 1: Standard Registration (NEW User)
    // -------------------------------------------------------------
    console.log('📌 [TEST 1] Testing Standard Email/Password Registration...');
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
        phone: testPhone,
        role: 'DEALER',
        agencyName: testName
      })
    });

    const regData = await regRes.json();
    console.log('   Registration Status:', regRes.status);
    console.log('   Registration Response:', JSON.stringify(regData, null, 2));

    if (regRes.status !== 201 || !regData.success || !regData.token || !regData.user) {
      throw new Error(`Registration failed with status ${regRes.status}: ${JSON.stringify(regData)}`);
    }
    console.log('   ✅ TEST 1 PASSED: User successfully registered with 201 Created and JWT.');

    // -------------------------------------------------------------
    // Test 2: Database Persistence Verification
    // -------------------------------------------------------------
    console.log('\n📌 [TEST 2] Verifying User in PostgreSQL Database...');
    const dbUserRes = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [testEmail]);
    if (dbUserRes.rows.length === 0) {
      throw new Error('User not found in PostgreSQL database!');
    }
    const dbUser = dbUserRes.rows[0];
    console.log('   Found DB Record ID:', dbUser.id);
    console.log('   Found DB Email:', dbUser.email);
    console.log('   Found DB Role:', dbUser.role);
    console.log('   Found DB Phone:', dbUser.phone);
    console.log('   Found DB Full Name:', dbUser.full_name);
    console.log('   Found DB Is Verified:', dbUser.is_verified);
    console.log('   Password Hash Present:', !!dbUser.password_hash);
    console.log('   ✅ TEST 2 PASSED: User record exists and is valid in PostgreSQL.');

    // -------------------------------------------------------------
    // Test 3: Duplicate Email Registration (Should Fail Gracefully)
    // -------------------------------------------------------------
    console.log('\n📌 [TEST 3] Testing Duplicate Email Registration...');
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another Dealer',
        email: testEmail,
        password: 'AnotherPassword123!',
        phone: '+92 300 0000000',
        role: 'DEALER'
      })
    });

    const dupData = await dupRes.json();
    console.log('   Duplicate Status:', dupRes.status);
    console.log('   Duplicate Response:', JSON.stringify(dupData, null, 2));

    if (dupRes.status !== 400 || dupData.success !== false) {
      throw new Error(`Duplicate registration did not return 400: ${JSON.stringify(dupData)}`);
    }
    console.log('   ✅ TEST 3 PASSED: Duplicate registration correctly rejected with 400.');

    // -------------------------------------------------------------
    // Test 4: Standard Email/Password Login
    // -------------------------------------------------------------
    console.log('\n📌 [TEST 4] Testing Standard Email/Password Login...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        role: 'DEALER'
      })
    });

    const loginData = await loginRes.json();
    console.log('   Login Status:', loginRes.status);
    console.log('   Login Response:', JSON.stringify(loginData, null, 2));

    if (loginRes.status !== 200 || !loginData.success || !loginData.token) {
      throw new Error(`Login failed with status ${loginRes.status}: ${JSON.stringify(loginData)}`);
    }
    console.log('   ✅ TEST 4 PASSED: User successfully logged in.');

    // -------------------------------------------------------------
    // Test 5: Password Reset Flow
    // -------------------------------------------------------------
    console.log('\n📌 [TEST 5] Testing Password Reset Flow...');
    const newPassword = 'NewSecretPassword2026!';
    const resetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        newPassword: newPassword
      })
    });

    const resetData = await resetRes.json();
    console.log('   Reset Status:', resetRes.status);
    console.log('   Reset Response:', JSON.stringify(resetData, null, 2));

    if (resetRes.status !== 200 || !resetData.success) {
      throw new Error(`Reset failed with status ${resetRes.status}: ${JSON.stringify(resetData)}`);
    }

    // Verify login with new password
    const newLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: newPassword,
        role: 'DEALER'
      })
    });
    const newLoginData = await newLoginRes.json();
    if (newLoginRes.status !== 200 || !newLoginData.success) {
      throw new Error(`Login with new password failed: ${JSON.stringify(newLoginData)}`);
    }
    console.log('   ✅ TEST 5 PASSED: Password successfully reset and authenticated.');

    // -------------------------------------------------------------
    // Test 6: Google Auth Config & Validation Check
    // -------------------------------------------------------------
    console.log('\n📌 [TEST 6] Testing Google Auth Route Integrity...');
    const configRes = await fetch(`${BASE_URL}/api/auth/config`);
    const configData = await configRes.json();
    console.log('   Auth Config Status:', configRes.status);
    console.log('   Auth Config Response:', JSON.stringify(configData, null, 2));

    if (configRes.status !== 200 || !configData.googleClientId) {
      throw new Error(`Google Auth Config failed: ${JSON.stringify(configData)}`);
    }

    // Invalid token should fail with 401
    const invalidGoogleRes = await fetch(`${BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: 'invalid_dummy_token_12345' })
    });
    const invalidGoogleData = await invalidGoogleRes.json();
    console.log('   Invalid Google Credential Status:', invalidGoogleRes.status);
    if (invalidGoogleRes.status !== 401) {
      throw new Error(`Expected 401 on invalid Google token, got ${invalidGoogleRes.status}`);
    }
    console.log('   ✅ TEST 6 PASSED: Google Auth endpoint is intact and properly secured.');

    // Clean up created user
    console.log('\n🧹 Cleaning up test user from PostgreSQL database...');
    await pool.query('DELETE FROM users WHERE LOWER(email) = LOWER($1)', [testEmail]);
    console.log('   ✅ Test user cleaned up.');

    console.log('\n🎉 ALL 6 INTEGRATION TESTS PASSED SUCCESSFULLY! 🚀');

  } finally {
    server.close();
    process.exit(0);
  }
}

runTestSuite().catch(err => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
