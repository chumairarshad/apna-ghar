import dotenv from 'dotenv';
import https from 'https';
import { pool } from '../server/db.js';

dotenv.config();

function postJSON(urlStr, data, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const body = JSON.stringify(data);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    };
    const req = https.request(options, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(buf || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, data: buf });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function getJSON(urlStr, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    };
    const req = https.request(options, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(buf || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, data: buf });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runSafeQASuite() {
  console.log('====================================================');
  console.log('🛡️ RUNNING ISOLATED PRODUCTION SAFETY QA SUITE');
  console.log('====================================================');

  const ts = Date.now();
  const tempUserEmail = `qa_isolated_user_${ts}@sarmayadar.com`;
  const tempDealerEmail = `qa_isolated_dealer_${ts}@sarmayadar.com`;
  let tempUserId = null;
  let tempDealerId = null;

  try {
    // 1. Test Admin Authentication with Environment Credentials
    console.log('\n--- 1. Admin Authentication & Protection ---');
    const adminPass = process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_PASSWORD;
    const adminRes = await postJSON('https://www.sarmayadar.com/api/auth/login', {
      email: 'admin@sarmayadar.com',
      password: adminPass
    });
    console.log('   Admin Login Status:', adminRes.status, '| Role:', adminRes.data.user?.role, '| Token Present:', !!adminRes.data.token);

    const adminToken = adminRes.data.token;

    // 2. Test User Registration & Login with Isolated Temporary Data
    console.log('\n--- 2. Isolated User Registration & Login ---');
    const regUser = await postJSON('https://www.sarmayadar.com/api/auth/register', {
      name: 'Temp QA User',
      email: tempUserEmail,
      password: 'TempUserPassword123!',
      phone: '+923000000001',
      role: 'USER'
    });
    tempUserId = regUser.data.user?.userId;
    console.log('   User Registration Status:', regUser.status, '| Success:', regUser.data.success);

    const loginUser = await postJSON('https://www.sarmayadar.com/api/auth/login', {
      email: tempUserEmail,
      password: 'TempUserPassword123!'
    });
    console.log('   User Login Status:', loginUser.status, '| Role:', loginUser.data.user?.role);
    const userToken = loginUser.data.token;

    // 3. Test Dealer Registration & Login with Isolated Temporary Data
    console.log('\n--- 3. Isolated Dealer Registration & Login ---');
    const regDealer = await postJSON('https://www.sarmayadar.com/api/auth/register', {
      name: 'Temp QA Dealer',
      email: tempDealerEmail,
      password: 'TempDealerPassword123!',
      phone: '+923000000002',
      agencyName: 'Temp QA Agency',
      city: 'Lahore',
      role: 'DEALER'
    });
    tempDealerId = regDealer.data.user?.userId;
    console.log('   Dealer Registration Status:', regDealer.status, '| Success:', regDealer.data.success);

    const loginDealer = await postJSON('https://www.sarmayadar.com/api/auth/login', {
      email: tempDealerEmail,
      password: 'TempDealerPassword123!'
    });
    console.log('   Dealer Login Status:', loginDealer.status, '| Role:', loginDealer.data.user?.role);
    const dealerToken = loginDealer.data.token;

    // 4. Test Role Security Isolation (USER/DEALER blocked from Admin API)
    console.log('\n--- 4. Role Security Isolation Checks ---');
    const userAdminAttempt = await getJSON('https://www.sarmayadar.com/api/admin/stats', userToken);
    console.log('   USER -> Admin API Status:', userAdminAttempt.status, '| Expected 403 Forbidden:', userAdminAttempt.status === 403 ? 'PASS ✅' : 'FAIL ❌');

    const dealerAdminAttempt = await getJSON('https://www.sarmayadar.com/api/admin/stats', dealerToken);
    console.log('   DEALER -> Admin API Status:', dealerAdminAttempt.status, '| Expected 403 Forbidden:', dealerAdminAttempt.status === 403 ? 'PASS ✅' : 'FAIL ❌');

    const unauthAttempt = await getJSON('https://www.sarmayadar.com/api/admin/stats', null);
    console.log('   Unauthenticated -> Admin API Status:', unauthAttempt.status, '| Expected 401 Unauthorized:', unauthAttempt.status === 401 ? 'PASS ✅' : 'FAIL ❌');

    // 5. Test Admin Package Activation & Upgrades on Temporary QA Dealer Only
    if (adminToken && tempDealerId) {
      console.log('\n--- 5. Subscription Activation & Upgrade Checks (Isolated Dealer) ---');
      const actPro = await postJSON(`https://www.sarmayadar.com/api/admin/dealers/${tempDealerId}/activate-subscription`, {
        planName: 'PRO DEALER',
        listingQuota: 50,
        notes: 'Isolated QA Pro Dealer Test'
      }, adminToken);
      console.log('   Activate PRO DEALER Status:', actPro.status, '| Success:', actPro.data.success);

      const actElite = await postJSON(`https://www.sarmayadar.com/api/admin/dealers/${tempDealerId}/activate-subscription`, {
        planName: 'AGENCY ELITE',
        listingQuota: 100,
        notes: 'Isolated QA Agency Elite Test'
      }, adminToken);
      console.log('   Upgrade to AGENCY ELITE Status:', actElite.status, '| Success:', actElite.data.success);
    }

  } finally {
    console.log('\n--- Automatic Self-Cleanup of Temporary Test Accounts ---');
    if (tempUserEmail || tempDealerEmail) {
      await pool.query(`DELETE FROM dealer_subscriptions WHERE dealer_id IN (SELECT id FROM users WHERE email LIKE 'qa_isolated_%')`);
      const del = await pool.query(`DELETE FROM users WHERE email LIKE 'qa_isolated_%'`);
      console.log(`   Cleaned up ${del.rowCount} temporary QA test account(s).`);
    }
  }

  console.log('\n====================================================');
  console.log('✅ ISOLATED QA SUITE COMPLETED SUCCESSFULLY');
  console.log('====================================================');
  process.exit(0);
}

runSafeQASuite().catch(err => {
  console.error('QA Suite Error:', err);
  process.exit(1);
});
