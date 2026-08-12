import http from 'http';
import fs from 'fs';
import path from 'path';

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body, headers: res.headers });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runProductionRoutingAudit() {
  console.log('====================================================================');
  console.log('🌐 STARTING PRODUCTION SPA ROUTING & VERCEL CONFIGURATION AUDIT');
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
    // 1. Audit vercel.json configuration file
    console.log('--- 1. vercel.json Rewrite Rule Syntax Audit ---');
    const vercelPath = path.resolve(process.cwd(), 'vercel.json');
    assert(fs.existsSync(vercelPath), 'vercel.json file exists in project root');

    const vercelContent = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    assert(Array.isArray(vercelContent.rewrites), 'vercel.json contains a valid "rewrites" array');

    const apiRewrite = vercelContent.rewrites.find(r => r.source.includes('/api/'));
    assert(Boolean(apiRewrite) && apiRewrite.destination === '/api/index.js', 'vercel.json contains API rewrite matching /api/* -> /api/index.js');

    const spaRewrite = vercelContent.rewrites.find(r => r.destination === '/index.html');
    assert(Boolean(spaRewrite), 'vercel.json contains SPA fallback rewrite to /index.html');
    assert(!spaRewrite.source.includes('(?!api)'), 'vercel.json uses clean, standard path wildcards without unsupported negative lookahead regex');

    // 2. Audit _redirects file
    console.log('\n--- 2. _redirects Hosting Configuration Audit ---');
    const redirectsPath = path.resolve(process.cwd(), '_redirects');
    assert(fs.existsSync(redirectsPath), '_redirects file exists in project root for hosting compatibility');

    // 3. Test Local Express SPA Server Routing behavior
    console.log('\n--- 3. Testing Express SPA Server Routing Endpoints ---');
    const routesToTest = [
      '/',
      '/admin-login',
      '/dealer-login',
      '/login',
      '/register',
      '/admin',
      '/dashboard'
    ];

    for (const routePath of routesToTest) {
      const res = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: routePath,
        method: 'GET'
      });

      assert(res.statusCode === 200, `GET "${routePath}" returns HTTP 200 OK`);
      assert(res.body.includes('<!DOCTYPE html>') || res.body.includes('html'), `GET "${routePath}" serves index.html (SPA Entry Point)`);
    }

    // 4. Verify API Route Separation (ensure API calls return JSON, not index.html)
    console.log('\n--- 4. Testing API Endpoint Separation ---');
    const apiRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    });

    assert(apiRes.statusCode === 200, 'GET "/api/health" returns HTTP 200 OK');
    assert(apiRes.body.includes('Sarmayadar Real Estate Express API'), 'GET "/api/health" returns JSON API response (not intercepted by SPA fallback)');

    const badApiRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/nonexistent-route-test',
      method: 'GET'
    });

    assert(badApiRes.statusCode === 404, 'GET "/api/nonexistent" returns HTTP 404');
    assert(badApiRes.body.includes('API route not found'), 'Nonexistent API endpoint returns JSON error (not HTML SPA page)');

    console.log('\n====================================================================');
    console.log(`📊 PRODUCTION ROUTING AUDIT SUMMARY: ${passedTests} Passed | ${failedTests} Failed`);
    console.log('====================================================================\n');

    if (failedTests > 0) process.exit(1);

  } catch (err) {
    console.error('Audit execution error:', err);
    process.exit(1);
  }
}

runProductionRoutingAudit();
