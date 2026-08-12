import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

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

async function runDealerSubscriptionManagementAudit() {
  console.log('====================================================================');
  console.log('⭐ STARTING DEALER SUBSCRIPTION MANAGEMENT E2E AUDIT');
  console.log('====================================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failedTests++;
    }
  }

  try {
    const timestamp = Date.now();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sarmayadar.com';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_PASSWORD;

    // 1. Admin Login
    console.log('--- 1. Admin Login ---');
    const adminLoginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN'
    });

    assert(adminLoginRes.statusCode === 200, 'ADMIN login returns HTTP 200 Success');
    const adminToken = adminLoginRes.data.token;

    // 2. Register a new Dealer for Subscription Testing
    console.log('\n--- 2. Create Dealer Account for Activation Test ---');
    const dealerEmail = `sub_dealer_${timestamp}@agency.com`;
    const dealerRegRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Sub Test Agency',
      email: dealerEmail,
      password: 'DealerPassword123!',
      phone: '+923007766554',
      role: 'DEALER',
      agencyName: 'Sub Test Real Estate'
    });

    assert(dealerRegRes.statusCode === 200 || dealerRegRes.statusCode === 201, 'Dealer account registered successfully');
    const dealerId = dealerRegRes.data.user.id;
    const dealerToken = dealerRegRes.data.token;

    // 3. Admin Fetches Dealers Directory
    console.log('\n--- 3. Admin Fetches Dealers Directory ---');
    const dealersListRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/dealers',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    assert(dealersListRes.statusCode === 200, 'Admin fetches dealers directory successfully (HTTP 200)');
    const targetDealerInList = (dealersListRes.data.dealers || []).find(d => d.id === dealerId);
    assert(Boolean(targetDealerInList), 'Target dealer appears in Admin Dealers Directory');

    // 4. Admin Activates PRO DEALER Subscription (90 Days)
    console.log('\n--- 4. Admin Activates PRO DEALER Subscription ---');
    const activateRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/dealers/${dealerId}/activate-subscription`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    }, {
      planName: 'PRO DEALER',
      customDurationDays: 90
    });

    assert(activateRes.statusCode === 200, 'Admin activates PRO DEALER subscription (HTTP 200)');
    assert(activateRes.data.subscription && activateRes.data.subscription.plan_name === 'PRO DEALER', 'Subscription plan confirmed as PRO DEALER');
    assert(activateRes.data.subscription.expiry_date, 'Subscription expiry_date calculated on backend');

    // 5. Dealer Checks Subscription (Cross-Browser Verification)
    console.log('\n--- 5. Dealer Dashboard Synchronization Check ---');
    const dealerSubRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/subscriptions/my-subscription',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${dealerToken}` }
    });

    assert(dealerSubRes.statusCode === 200, 'Dealer fetches my-subscription from PostgreSQL (HTTP 200)');
    assert(dealerSubRes.data.subscription.plan_name === 'PRO DEALER', 'Dealer reflects activated PRO DEALER plan from PostgreSQL');
    assert(dealerSubRes.data.subscription.listing_limit === 25, 'Dealer reflects updated listing limit = 25');

    // 6. Admin Upgrades Dealer to AGENCY ELITE Plan (365 Days)
    console.log('\n--- 6. Admin Upgrades Dealer to AGENCY ELITE Plan ---');
    const upgradeRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/dealers/${dealerId}/activate-subscription`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      }
    }, {
      planName: 'AGENCY ELITE',
      customDurationDays: 365
    });

    assert(upgradeRes.statusCode === 200, 'Admin upgrades dealer to AGENCY ELITE plan (HTTP 200)');

    const dealerSubAfterUpgrade = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/subscriptions/my-subscription',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${dealerToken}` }
    });

    assert(dealerSubAfterUpgrade.data.subscription.plan_name === 'AGENCY ELITE', 'Dealer reflects upgraded AGENCY ELITE plan in PostgreSQL');
    assert(dealerSubAfterUpgrade.data.subscription.listing_limit === 100, 'Dealer listing limit upgraded to 100');

    // 7. Security Check (USER / DEALER calling Admin Activate API)
    console.log('\n--- 7. Security Authorization Check ---');
    const unauthActivateRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/dealers/${dealerId}/activate-subscription`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dealerToken}` // DEALER attempting Admin API
      }
    }, {
      planName: 'AGENCY ELITE'
    });

    assert(unauthActivateRes.statusCode === 403, 'DEALER token is REJECTED (HTTP 403) from calling Admin activate-subscription API');

    console.log('\n====================================================================');
    console.log(`📊 E2E SUBSCRIPTION AUDIT SUMMARY: ${passedTests} Passed | ${failedTests} Failed`);
    console.log('====================================================================\n');

    if (failedTests > 0) process.exit(1);

  } catch (err) {
    console.error('Audit error:', err);
    process.exit(1);
  }
}

runDealerSubscriptionManagementAudit();
