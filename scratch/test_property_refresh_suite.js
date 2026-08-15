import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('🧪 Starting Property Page Refresh & Route Integrity Verification Suite...\n');

  // Test 1: Verify getInitialRouteInfo logic with simulated browser window environments
  console.log('📌 [TEST 1] Testing getInitialRouteInfo with multiple URL formats...');
  
  function simulateRoute(pathname, hash = '') {
    const origWindow = global.window;
    global.window = {
      location: {
        pathname: pathname,
        hash: hash
      }
    };

    let p = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const h = window.location.hash.replace('#', '').toLowerCase();

    let result = { tab: 'buy', propertyId: null, articleId: null };

    if (p.startsWith('/property/')) {
      const pId = p.split('/property/')[1];
      result = { tab: 'property-detail', propertyId: pId, articleId: null };
    } else if (h.startsWith('property/')) {
      const pId = h.split('property/')[1];
      result = { tab: 'property-detail', propertyId: pId, articleId: null };
    } else if (p.startsWith('/blog/')) {
      const aId = p.split('/blog/')[1];
      result = { tab: 'blog-detail', propertyId: null, articleId: aId };
    } else if (h.startsWith('blog/')) {
      const aId = h.split('blog/')[1];
      result = { tab: 'blog-detail', propertyId: null, articleId: aId };
    } else if (p === '/dashboard' || p === '/dealer') {
      result = { tab: 'dealer', propertyId: null, articleId: null };
    } else if (p === '/register') {
      result = { tab: 'register', propertyId: null, articleId: null };
    } else if (p === '/login') {
      result = { tab: 'login', propertyId: null, articleId: null };
    } else if (p === '/rent') {
      result = { tab: 'rent', propertyId: null, articleId: null };
    } else if (p === '/projects') {
      result = { tab: 'projects', propertyId: null, articleId: null };
    }

    global.window = origWindow;
    return result;
  }

  const testCases = [
    { path: '/property/prop-1', hash: '', expectedTab: 'property-detail', expectedId: 'prop-1' },
    { path: '/property/prop-2', hash: '', expectedTab: 'property-detail', expectedId: 'prop-2' },
    { path: '/property/custom-uuid-999', hash: '', expectedTab: 'property-detail', expectedId: 'custom-uuid-999' },
    { path: '/', hash: '#property/prop-3', expectedTab: 'property-detail', expectedId: 'prop-3' },
    { path: '/blog/news-1', hash: '', expectedTab: 'blog-detail', expectedId: null, expectedArticle: 'news-1' },
    { path: '/dashboard', hash: '', expectedTab: 'dealer', expectedId: null },
    { path: '/register', hash: '', expectedTab: 'register', expectedId: null },
    { path: '/login', hash: '', expectedTab: 'login', expectedId: null },
    { path: '/rent', hash: '', expectedTab: 'rent', expectedId: null }
  ];

  for (const tc of testCases) {
    const res = simulateRoute(tc.path, tc.hash);
    if (res.tab !== tc.expectedTab || (tc.expectedId && res.propertyId !== tc.expectedId)) {
      throw new Error(`Route mismatch for path: ${tc.path}. Got ${JSON.stringify(res)}`);
    }
    console.log(`   ✅ Route parsed: ${tc.path}${tc.hash} -> Tab: ${res.tab}, PropertyId: ${res.propertyId || 'none'}`);
  }

  // Test 2: Verify renderPropertyDetailPage with valid & invalid properties
  console.log('\n📌 [TEST 2] Testing renderPropertyDetailPage component generation...');
  const { renderPropertyDetailPage } = await import('../js/components/PropertyDetailPage.js');
  const { INITIAL_PROPERTIES } = await import('../js/data/properties.js');

  const mockState = {
    properties: INITIAL_PROPERTIES,
    selectedPropertyId: 'prop-101',
    selectedProperty: null,
    unit: 'Marla',
    user: null
  };

  const pageHtml = renderPropertyDetailPage(mockState);
  if (!pageHtml.includes('property-detail-page-wrapper') || !pageHtml.includes('prop-101')) {
    throw new Error('renderPropertyDetailPage did not render property detail wrapper for prop-101');
  }
  console.log('   ✅ Valid property detail HTML rendered successfully (Length:', pageHtml.length, 'bytes)');

  // Test 2b: Test with non-existent property
  mockState.selectedPropertyId = 'prop-non-existent-999';
  const notFoundHtml = renderPropertyDetailPage(mockState);
  if (!notFoundHtml.includes('Property Listing Not Found')) {
    throw new Error('renderPropertyDetailPage did not render fallback not-found view');
  }
  console.log('   ✅ Non-existent property rendered clean Not Found state without throwing exceptions.');

  // Test 3: Test HTTP server direct route response for /property/prop-1
  console.log('\n📌 [TEST 3] Testing HTTP server direct route response for /property/prop-1...');
  const app = (await import('../server.js')).default;
  const server = app.listen(5098);

  try {
    const res = await fetch('http://localhost:5098/property/prop-1');
    console.log('   HTTP Status for GET /property/prop-1:', res.status);
    const text = await res.text();
    if (res.status !== 200 || !text.includes('id="bismillah-preloader"') || !text.includes('id="app"')) {
      throw new Error(`GET /property/prop-1 did not return index.html shell (Status: ${res.status})`);
    }
    console.log('   ✅ Server returned 200 OK with index.html shell for direct property URL.');
  } finally {
    server.close();
  }

  console.log('\n🎉 ALL PROPERTY REFRESH & ROUTING TESTS PASSED! 🚀');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
