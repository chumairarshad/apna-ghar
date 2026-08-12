import http from 'http';

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

async function runMasterSecurityAudit() {
  console.log('====================================================================');
  console.log('🛡️ STARTING FINAL ADMIN SECURITY & PRODUCTION E2E AUDIT');
  console.log('====================================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  let securityPass = 0;
  let roleEscalationPass = 0;
  let subPass = 0;
  let quotaPass = 0;
  let suspensionPass = 0;
  let syncPass = 0;

  function assert(condition, message, category = 'General') {
    if (condition) {
      console.log(`✅ PASS [${category}]: ${message}`);
      passedTests++;
      if (category === 'Security') securityPass++;
      if (category === 'Role Escalation') roleEscalationPass++;
      if (category === 'Subscription') subPass++;
      if (category === 'Quota') quotaPass++;
      if (category === 'Suspension') suspensionPass++;
      if (category === 'Cross-Browser') syncPass++;
    } else {
      console.error(`❌ FAIL [${category}]: ${message}`);
      failedTests++;
    }
  }

  try {
    const timestamp = Date.now();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sarmayadar.com';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_PASSWORD;

    // ------------------------------------------------------------------
    // SECTION 1: ADMIN REGISTRATION SECURITY & PRIVILEGE ESCALATION
    // ------------------------------------------------------------------
    console.log('--- SECTION 1: Admin Registration Security ---');
    const attackerEmail = `attacker_${timestamp}_${Math.floor(Math.random() * 10000)}@test.com`;
    const regRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Malicious Attacker',
      email: attackerEmail,
      password: 'AttackerPassword123!',
      phone: '+923001112233',
      role: 'ADMIN' // Malicious attempt to self-register as ADMIN
    });

    assert(regRes.statusCode === 200 || regRes.statusCode === 201, 'Public registration returns 200/201 Success', 'Security');
    assert(regRes.data.user && regRes.data.user.role !== 'ADMIN', 'Public registration strips role: ADMIN and sets role to USER/DEALER', 'Security');

    const attackerToken = regRes.data.token;

    // Test /api/admin/create-admin with non-admin token
    const unauthCreateAdmin = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/create-admin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${attackerToken}`
      }
    }, {
      name: 'Hacked Admin',
      email: `hacked_admin_${timestamp}@sarmayadar.com`,
      password: 'Password123!'
    });

    assert(unauthCreateAdmin.statusCode === 403, '/api/admin/create-admin rejects non-admin token with HTTP 403 Forbidden', 'Security');

    // ------------------------------------------------------------------
    // SECTION 2: ROLE ESCALATION PROTECTION (USER & DEALER BLOCKED)
    // ------------------------------------------------------------------
    console.log('\n--- SECTION 2: Role Escalation Protection ---');

    // Register a normal USER
    const userEmail = `normal_user_${timestamp}@test.com`;
    const userRegRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Normal User',
      email: userEmail,
      password: 'UserPassword123!',
      phone: '+923002223344',
      role: 'USER'
    });

    const normalUserToken = userRegRes.data.token;

    // Test USER attempting Admin Operations
    const userAdminStats = await makeRequest({ hostname: 'localhost', port: 5000, path: '/api/admin/stats', method: 'GET', headers: { 'Authorization': `Bearer ${normalUserToken}` } });
    assert(userAdminStats.statusCode === 403, 'USER token blocked from /api/admin/stats (HTTP 403)', 'Role Escalation');

    const userAdminUsers = await makeRequest({ hostname: 'localhost', port: 5000, path: '/api/admin/users', method: 'GET', headers: { 'Authorization': `Bearer ${normalUserToken}` } });
    assert(userAdminUsers.statusCode === 403, 'USER token blocked from /api/admin/users (HTTP 403)', 'Role Escalation');

    const userAdminDealers = await makeRequest({ hostname: 'localhost', port: 5000, path: '/api/admin/dealers', method: 'GET', headers: { 'Authorization': `Bearer ${normalUserToken}` } });
    assert(userAdminDealers.statusCode === 403, 'USER token blocked from /api/admin/dealers (HTTP 403)', 'Role Escalation');

    const userCreateUser = await makeRequest({
      hostname: 'localhost', port: 5000, path: '/api/admin/users', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${normalUserToken}` }
    }, { name: 'Fake User', email: `fake_${timestamp}@test.com`, password: 'Password123!', role: 'USER' });
    assert(userCreateUser.statusCode === 403, 'USER token blocked from creating users via /api/admin/users (HTTP 403)', 'Role Escalation');

    const userActivateSub = await makeRequest({
      hostname: 'localhost', port: 5000, path: `/api/admin/dealers/fake-id/activate-subscription`, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${normalUserToken}` }
    }, { planName: 'PRO DEALER' });
    assert(userActivateSub.statusCode === 403, 'USER token blocked from activating dealer subscriptions (HTTP 403)', 'Role Escalation');

    const userDeleteUser = await makeRequest({ hostname: 'localhost', port: 5000, path: `/api/admin/users/fake-id`, method: 'DELETE', headers: { 'Authorization': `Bearer ${normalUserToken}` } });
    assert(userDeleteUser.statusCode === 403, 'USER token blocked from deleting users (HTTP 403)', 'Role Escalation');

    // Login System Admin
    const adminLoginRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: adminEmail, password: adminPassword, role: 'ADMIN' });

    assert(adminLoginRes.statusCode === 200, 'System Admin logs in successfully', 'Security');
    const adminToken = adminLoginRes.data.token;
    const adminUserId = adminLoginRes.data.user.id;

    // Legitimate Admin Operation succeeds
    const adminStatsRes = await makeRequest({ hostname: 'localhost', port: 5000, path: '/api/admin/stats', method: 'GET', headers: { 'Authorization': `Bearer ${adminToken}` } });
    assert(adminStatsRes.statusCode === 200, 'ADMIN token accesses /api/admin/stats successfully (HTTP 200)', 'Role Escalation');

    // ------------------------------------------------------------------
    // SECTION 3: ADMIN DELETION PROTECTION
    // ------------------------------------------------------------------
    console.log('\n--- SECTION 3: Admin Deletion Protection ---');
    const selfDeleteRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: `/api/admin/users/${adminUserId}`, method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    assert(selfDeleteRes.statusCode === 400, 'Admin self-deletion attempt is blocked with HTTP 400', 'Security');
    assert(selfDeleteRes.data.message.includes('Self-deletion prohibited'), 'Error message explicitly warns against self-deletion', 'Security');

    // ------------------------------------------------------------------
    // SECTION 4 & 5: DEALER SUBSCRIPTION SECURITY & EXPIRATION
    // ------------------------------------------------------------------
    console.log('\n--- SECTION 4 & 5: Subscription Security & Expiration ---');

    // Admin creates a Dealer
    const auditDealerEmail = `audit_dealer_${timestamp}@test.com`;
    const createDealerRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: '/api/admin/users', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, {
      name: 'Audit Dealer Agency',
      email: auditDealerEmail,
      password: 'DealerPassword123!',
      phone: '+923004445566',
      role: 'DEALER',
      agencyName: 'Audit Estate'
    });

    assert(createDealerRes.statusCode === 201, 'Admin creates Dealer in PostgreSQL', 'Subscription');
    const auditDealerId = createDealerRes.data.user.id;

    // Admin activates PRO DEALER subscription
    const subRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: `/api/admin/dealers/${auditDealerId}/activate-subscription`, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, { planName: 'PRO DEALER' });

    assert(subRes.statusCode === 200, 'Admin activates PRO DEALER subscription', 'Subscription');
    assert(subRes.data.subscription.plan_name === 'PRO DEALER', 'Subscription plan stored as PRO DEALER', 'Subscription');
    assert(!!subRes.data.subscription.expiry_date, 'Subscription expiry_date calculated on backend', 'Subscription');

    // Fetch Dealer Directory to verify single source of truth in PostgreSQL
    const dealersListRes = await makeRequest({ hostname: 'localhost', port: 5000, path: '/api/admin/dealers', method: 'GET', headers: { 'Authorization': `Bearer ${adminToken}` } });
    assert(dealersListRes.statusCode === 200, 'Admin fetches dealers directory', 'Subscription');
    const targetDealerInList = dealersListRes.data.dealers.find(d => d.id === auditDealerId);
    assert(targetDealerInList && targetDealerInList.subscription_status === 'ACTIVE', 'Dealer subscription status verified as ACTIVE in PostgreSQL', 'Subscription');

    // ------------------------------------------------------------------
    // SECTION 6: LISTING LIMIT ENFORCEMENT & DYNAMIC UPGRADE
    // ------------------------------------------------------------------
    console.log('\n--- SECTION 6: Listing Limit Enforcement & Dynamic Upgrade ---');

    // Downgrade Dealer to BASIC plan (listing limit = 5)
    const downgradeRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: `/api/admin/dealers/${auditDealerId}/activate-subscription`, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, { planName: 'BASIC' });

    assert(downgradeRes.statusCode === 200, 'Admin downgrades dealer to BASIC plan (limit = 5)', 'Quota');

    // Dealer logs in
    const dealerLoginRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: auditDealerEmail, password: 'DealerPassword123!', role: 'DEALER' });

    assert(dealerLoginRes.statusCode === 200, 'Dealer logs in to post listings', 'Quota');
    const dealerToken = dealerLoginRes.data.token;

    // Create 5 listings (reaching quota limit)
    for (let i = 1; i <= 5; i++) {
      await makeRequest({
        hostname: 'localhost', port: 5000, path: '/api/properties', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${dealerToken}` }
      }, {
        id: `prop-audit-${timestamp}-${i}`,
        title: `Quota Test Property ${i}`,
        price: 15000000,
        city: 'Lahore',
        location: 'DHA Phase 5',
        dealerId: auditDealerId,
        ownerEmail: auditDealerEmail
      });
    }

    // Attempt creation of 6th listing (exceeding limit)
    const extraPropRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: '/api/properties', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${dealerToken}` }
    }, {
      id: `prop-audit-${timestamp}-6`,
      title: `Quota Test Property 6 (Should Fail)`,
      price: 15000000,
      city: 'Lahore',
      location: 'DHA Phase 5',
      dealerId: auditDealerId,
      ownerEmail: auditDealerEmail
    });

    assert(extraPropRes.statusCode === 403, 'Backend rejects 6th listing attempt with HTTP 403 (Quota Exceeded)', 'Quota');
    assert(extraPropRes.data.message.includes('limit'), 'Backend message explicitly mentions quota limit reached', 'Quota');

    // Upgrade Dealer to AGENCY ELITE plan (higher limit)
    const upgradeRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: `/api/admin/dealers/${auditDealerId}/activate-subscription`, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, { planName: 'AGENCY ELITE' });

    assert(upgradeRes.statusCode === 200, 'Admin upgrades dealer to AGENCY ELITE plan', 'Quota');

    // Attempt 6th listing creation after upgrade
    const retryPropRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: '/api/properties', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${dealerToken}` }
    }, {
      id: `prop-audit-${timestamp}-6-retry`,
      title: `Quota Test Property 6 (After Upgrade)`,
      price: 15000000,
      city: 'Lahore',
      location: 'DHA Phase 5',
      dealerId: auditDealerId,
      ownerEmail: auditDealerEmail
    });

    assert(retryPropRes.statusCode === 200 || retryPropRes.statusCode === 201, 'Posting 6th listing succeeds after plan upgrade (HTTP 200/201)', 'Quota');

    // ------------------------------------------------------------------
    // SECTION 7: ACCOUNT SUSPENSION & REACTIVATION
    // ------------------------------------------------------------------
    console.log('\n--- SECTION 7: Account Suspension & Reactivation ---');

    // Admin suspends Dealer
    const suspRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: `/api/admin/users/${auditDealerId}/status`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, { status: 'suspended', isSuspended: true });

    assert(suspRes.statusCode === 200, 'Admin suspends Dealer in PostgreSQL', 'Suspension');

    // Suspended Dealer attempts login
    const suspLoginRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: auditDealerEmail, password: 'DealerPassword123!', role: 'DEALER' });

    assert(suspLoginRes.statusCode === 403, 'Suspended dealer login attempt blocked with HTTP 403', 'Suspension');

    // Admin reactivates Dealer
    const reactRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: `/api/admin/users/${auditDealerId}/status`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    }, { status: 'active', isSuspended: false });

    assert(reactRes.statusCode === 200, 'Admin reactivates Dealer in PostgreSQL', 'Suspension');

    // Reactivated Dealer logs in
    const reactLoginRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: auditDealerEmail, password: 'DealerPassword123!', role: 'DEALER' });

    assert(reactLoginRes.statusCode === 200, 'Reactivated dealer logs in successfully (HTTP 200)', 'Suspension');

    // ------------------------------------------------------------------
    // SECTION 8 & 10: CROSS-BROWSER ADMIN SYNC & FRONTEND SECURITY
    // ------------------------------------------------------------------
    console.log('\n--- SECTION 8 & 10: Cross-Browser Sync & Frontend Security ---');

    // Simulate Admin Browser B logging in and querying endpoints
    const adminBrowserBRes = await makeRequest({
      hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: adminEmail, password: adminPassword, role: 'ADMIN' });

    const adminBrowserBToken = adminBrowserBRes.data.token;
    const fetchDealersB = await makeRequest({ hostname: 'localhost', port: 5000, path: '/api/admin/dealers', method: 'GET', headers: { 'Authorization': `Bearer ${adminBrowserBToken}` } });

    assert(fetchDealersB.statusCode === 200, 'Browser B Admin fetches live dealers from PostgreSQL', 'Cross-Browser');
    const dealerInB = fetchDealersB.data.dealers.find(d => d.id === auditDealerId);
    assert(dealerInB && dealerInB.subscription_plan_name === 'AGENCY ELITE', 'Browser B reflects upgraded AGENCY ELITE plan from PostgreSQL single source of truth', 'Cross-Browser');

    // ------------------------------------------------------------------
    // SECTION 9 & 11: EXISTING DATA INTEGRITY & REGRESSION CHECK
    // ------------------------------------------------------------------
    console.log('\n--- SECTION 9 & 11: Production Data Integrity & Regression Check ---');

    const publicPropsRes = await makeRequest({ hostname: 'localhost', port: 5000, path: '/api/properties', method: 'GET' });
    assert(publicPropsRes.statusCode === 200, 'Public API returns properties', 'Cross-Browser');
    assert(publicPropsRes.data.properties.length > 0, 'Public property catalog remains intact', 'Cross-Browser');

    const hasNullDealer = publicPropsRes.data.properties.some(p => p.dealer_id === null || p.dealer_id === undefined);
    assert(!hasNullDealer, '0 records with NULL dealer_id in properties table', 'Cross-Browser');

  } catch (err) {
    console.error('\n❌ UNEXPECTED ERROR IN MASTER AUDIT:', err);
    failedTests++;
  }

  console.log('\n====================================================================');
  console.log('📊 FINAL MASTER AUDIT SUMMARY REPORT');
  console.log('====================================================================');
  console.log(`TOTAL TESTS EXECUTED: ${passedTests + failedTests}`);
  console.log(`✅ PASSED: ${passedTests}`);
  console.log(`❌ FAILED: ${failedTests}`);
  console.log('--------------------------------------------------------------------');
  console.log(`🔒 Security Tests: ${securityPass} PASSED`);
  console.log(`🛡️ Role Escalation Tests: ${roleEscalationPass} PASSED`);
  console.log(`⭐ Subscription Tests: ${subPass} PASSED`);
  console.log(`⚡ Quota Enforcement Tests: ${quotaPass} PASSED`);
  console.log(`🚫 Account Suspension Tests: ${suspensionPass} PASSED`);
  console.log(`🔄 Cross-Browser Sync Tests: ${syncPass} PASSED`);
  console.log('====================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runMasterSecurityAudit();
