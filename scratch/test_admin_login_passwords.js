import http from 'http';

function makeLoginRequest(password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'admin@sarmayadar.com',
      password: password,
      role: 'ADMIN'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runAdminLoginTest() {
  console.log('====================================================');
  console.log('🔑 TESTING ADMIN LOGIN WITH ENVIRONMENT CREDENTIALS');
  console.log('====================================================');

  const passwordsToTest = [
    process.env.ADMIN_SEED_PASSWORD,
    process.env.ADMIN_PASSWORD
  ].filter(Boolean);

  let passed = 0;

  for (const pwd of passwordsToTest) {
    const res = await makeLoginRequest(pwd);
    if (res.status === 200 && res.data.success && res.data.user.role === 'ADMIN') {
      console.log(`✅ PASS: Admin login SUCCESS with environment credentials`);
      passed++;
    } else {
      console.error(`❌ FAIL: Admin login failed for environment credentials: ${res.data.message || res.status}`);
    }
  }

  console.log(`\n📊 Result: ${passed}/${passwordsToTest.length} Environment Passwords Authorized`);
  console.log('====================================================');
  if (passed === 0) process.exit(1);
}

runAdminLoginTest();
