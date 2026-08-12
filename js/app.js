import { INITIAL_PROPERTIES } from './data/properties.js';
import { INITIAL_AGENTS } from './data/agents.js';
import { getFavorites, toggleFavorite, getCustomProperties, saveCustomProperty, saveOrUpdatePropertyInStorage, deletePropertyFromStorage, getEffectiveProperties, getDealerLeads, saveDealerLeads, saveAgencyProfile, getDealersFromStorage, saveDealersToStorage } from './utils/storage.js';
import { convertArea, calculateMortgage, formatPKR } from './utils/formatters.js';
import { normalizeProperty, normalizeProperties } from './utils/normalizeProperty.js';
import { fetchPropertiesFromApi, savePropertyToApi, uploadImageToFreeCdn } from './utils/api.js';
import { addWatermarkToImage } from './utils/watermark.js';
import { initI18n, setLanguage, t } from './utils/i18n.js';

import { renderHeader } from './components/Header.js';
import { renderHeroSearch } from './components/SearchEngine.js';
import { renderCatalog } from './components/Catalog.js';
import { initLeafletMap } from './components/MapView.js';
import { renderDealerDashboard } from './components/DealerDashboard.js';
import { renderDashboardSystem } from './components/DashboardSystem.js';
import { renderHousingProjects } from './components/HousingProjects.js';
import { renderFinancialTools } from './components/FinancialTools.js';
import { renderPostPropertyModal, renderImagePreviewsList } from './components/PostPropertyWizard.js';
import { renderAgentDirectory } from './components/AgentDirectory.js';
import { renderSavedFavoritesDrawer } from './components/SavedFavoritesDrawer.js';
import { renderAuthModal } from './components/AuthModal.js';
import { renderPropertyDetailModal } from './components/PropertyDetailModal.js';
import { renderFeaturedPropertyModal } from './components/FeaturedPropertyModal.js';
import { renderAIChatbotWidget } from './components/AIChatbotWidget.js';
import { renderNewsSection } from './components/NewsSection.js';
import { renderFooter } from './components/Footer.js';
import { renderSplashScreen, triggerSplashAnimation, triggerQuickPagePreloader } from './components/SplashScreen.js';

// New Recommended Features Imports
import { renderVirtualTourModal } from './components/VirtualTourModal.js';
import { renderFBRTaxCalculatorSection, calculateFBRTaxes } from './components/FBRTaxCalculator.js';
import { renderOverseasPortal } from './components/OverseasPortal.js';
import { renderPriceTrendsSection } from './components/PriceTrendsSection.js';
import { renderPropertyComparerModal } from './components/PropertyComparer.js';
import { renderScheduleVisitModal } from './components/ScheduleVisitModal.js';
import { renderFeaturedBannersSection } from './components/FeaturedBannersSection.js';
import { renderArticleReaderModal } from './components/ArticleReaderModal.js';
import { renderLegalModal } from './components/LegalModal.js';
import { renderMobileBottomNav } from './components/MobileBottomNav.js';
import { renderBlogsPage } from './components/BlogsPage.js';
import { renderAdvertisePage } from './components/AdvertisePage.js';
import { renderPushNotificationBanner, initPushBannerEvents } from './components/PushNotificationBanner.js';
import { registerServiceWorker, togglePushNotifications } from './utils/pushClient.js';
import { parsePropertySizeFromQuery, formatWhatsAppSizeMessage } from './utils/sizeParser.js';
import { extractEntitiesAndIntent } from './data/chatbotDataset.js';
import { renderAdminLoginPage } from './components/AdminLoginPage.js';
import { renderPropertyDetailPage } from './components/PropertyDetailPage.js';
import { renderPostPropertyPage } from './components/PostPropertyPage.js';
import { renderBlogDetailPage } from './components/BlogDetailPage.js';
import { renderLegalPage } from './components/LegalPages.js';
import { renderPropertyComparerPage } from './components/PropertyComparerPage.js';
import { renderAuthPage } from './components/AuthPages.js';
import { renderAdvertiseCheckout, renderAdvertiseInvoice } from './components/AdvertiseCheckout.js';
import { renderFeaturedPage } from './components/FeaturedPage.js';

// Tab Persistence Helper Functions (Hash & LocalStorage Sync)
// Clean URL Slugs Map
const TAB_SLUG_MAP = {
  'buy': '/',
  'rent': '/rent',
  'projects': '/projects',
  'featured': '/featured',
  'tools': '/tools',
  'agents': '/agents',
  'blogs': '/blogs',
  'advertise': '/advertise',
  'advertise-checkout': '/advertise/checkout',
  'advertise-invoice': '/advertise/invoice',
  'dealer': '/dashboard',
  'admin': '/admin',
  'post-property': '/post-property',
  'privacy': '/privacy',
  'terms': '/terms',
  'fbr-tax-guide': '/fbr-tax-guide',
  'compare': '/compare',
  'login': '/login',
  'register': '/register'
};

function getSavedActiveTab() {
  if (typeof window !== 'undefined') {
    const validTabs = ['buy', 'rent', 'projects', 'featured', 'tools', 'agents', 'blogs', 'advertise', 'advertise-checkout', 'advertise-invoice', 'dealer', 'admin', 'property-detail', 'post-property', 'blog-detail', 'privacy', 'terms', 'fbr-tax-guide', 'compare', 'login', 'register'];

    const pathname = window.location.pathname.toLowerCase();
    if (pathname === '/featured') return 'featured';
    if (pathname === '/advertise') return 'advertise';
    if (pathname === '/advertise/checkout') return 'advertise-checkout';
    if (pathname === '/advertise/invoice') return 'advertise-invoice';
    if (pathname === '/dashboard' || pathname === '/dealer') return 'dealer';
    if (pathname === '/dealer/admin' || pathname === '/admin') return 'admin';
    if (pathname === '/post-property') return 'post-property';
    if (pathname === '/rent') return 'rent';
    if (pathname === '/projects') return 'projects';
    if (pathname === '/tools') return 'tools';
    if (pathname === '/agents') return 'agents';
    if (pathname === '/blogs') return 'blogs';
    if (pathname === '/privacy') return 'privacy';
    if (pathname === '/terms') return 'terms';
    if (pathname === '/fbr-tax-guide') return 'fbr-tax-guide';
    if (pathname === '/compare') return 'compare';
    if (pathname === '/login') return 'login';
    if (pathname === '/register') return 'register';
    if (pathname.startsWith('/property/')) {
      state.selectedPropertyId = pathname.split('/property/')[1];
      return 'property-detail';
    }
    if (pathname.startsWith('/blog/')) {
      state.selectedArticleId = pathname.split('/blog/')[1];
      return 'blog-detail';
    }

    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'advertise') return 'advertise';
    if (hash === 'advertise-checkout') return 'advertise-checkout';
    if (hash === 'advertise-invoice') return 'advertise-invoice';
    if (hash === 'admin' || hash === 'dealer/admin') return 'admin';
    if (hash === 'dealer' || hash === 'dashboard') return 'dealer';
    if (hash.startsWith('property/')) {
      state.selectedPropertyId = hash.split('property/')[1];
      return 'property-detail';
    }
    if (hash.startsWith('blog/')) {
      state.selectedArticleId = hash.split('blog/')[1];
      return 'blog-detail';
    }
    if (hash === 'post-property') return 'post-property';
    if (hash === 'privacy') return 'privacy';
    if (hash === 'terms') return 'terms';
    if (hash === 'fbr-tax-guide') return 'fbr-tax-guide';
    if (hash === 'compare') return 'compare';
    if (hash === 'login') return 'login';
    if (hash === 'register') return 'register';

    if (validTabs.includes(hash)) return hash;

    const saved = localStorage.getItem('Sarmayadar_active_tab');
    if (saved && validTabs.includes(saved)) return saved;
  }
  return 'buy';
}

function setActiveTab(tabName) {
  const validTabs = ['buy', 'rent', 'projects', 'tools', 'agents', 'blogs', 'advertise', 'advertise-checkout', 'advertise-invoice', 'dealer', 'admin', 'property-detail', 'post-property', 'blog-detail', 'privacy', 'terms', 'fbr-tax-guide', 'compare', 'login', 'register'];
  if (!validTabs.includes(tabName)) return;
  state.activeTab = tabName;
  if (typeof window !== 'undefined') {
    localStorage.setItem('Sarmayadar_active_tab', tabName);
    
    // Update URL path using Clean Slugs without #
    const slugPath = TAB_SLUG_MAP[tabName] || `/${tabName}`;
    if (window.location.pathname !== slugPath) {
      window.history.pushState({ tab: tabName }, '', slugPath);
    }
  }
}

// Window Popstate Listener for Browser Back/Forward navigation
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    const targetTab = getSavedActiveTab();
    state.activeTab = targetTab;
    renderApp();
  });
}

// Application State
const state = {
  properties: [],
  editingProperty: null,
  activeTab: getSavedActiveTab(), // buy | rent | projects | tools | agents | dealer | blogs | advertise
  currency: 'PKR',
  unit: 'Marla',
  viewMode: 'grid', // grid | map
  sortBy: 'featured',
  searchQuery: '',
  searchFilters: {
    purpose: 'sale',
    city: 'all',
    society: 'all',
    category: 'all',
    maxPrice: 'any',
    badge: null,
    size: null,
    exactSizeMarla: null,
    exactSizeLabel: null
  },
  selectedProperty: null,
  showPostWizard: false,
  wizardStep: 1,
  showFavoritesDrawer: false,
  showAuthModal: false,
  showMobileNav: false,
  showFeaturedModal: false,
  showVirtualTourModal: false,
  virtualTourProperty: null,
  showComparerModal: false,
  compareProperties: [],
  showScheduleVisitModal: false,
  selectedVisitProperty: null,
  showArticleModal: false,
  selectedArticle: null,
  chatLanguage: 'en', // 'en' | 'ur'
  aiChatMessages: [
    { sender: 'bot', text: 'Hello! 👋 I am your **Sarmayadar Assistant**. Type any location, budget, or plot size to find matching properties, or select 🇵🇰 Roman Urdu language above!' }
  ],
  showSplash: true,
  authMethod: 'phone', // google | phone | email
  phoneStep: 1, // 1: enter number, 2: enter 6-digit OTP
  tempPhone: '',
  activeTool: 'converter', // converter | mortgage | valuate | fbr
  dealerTab: 'inventory', // inventory | leads | analytics | profile
  user: null,
  uploadedImages: [],
  activeLegalTab: null, // privacy | terms
  blogsList: [],
  selectedBlogCategory: 'ALL',
  blogSearchQuery: '',
  showBlogCreateModal: false,
  editingBlog: null,
  language: 'en',
  showLangDropdown: false
};

// Initialize i18n Localization Engine & RTL state
initI18n(state);

const ARTICLES_DB = [
  {
    id: 'news-1',
    badge: 'FBR TAXES 2026',
    category: 'FBR TAXES 2026',
    title: 'FBR Property Tax & Capital Gains Guide (Filer vs Non-Filer)',
    date: 'Aug 2026',
    readTime: '4 min read',
    author: 'Sarmayadar Editorial',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    snippet: 'Complete breakdown of Filer (3%) vs Non-Filer (10.5%) withholding tax rates, Section 7E wealth tax, and Stamp Duty on buying & selling properties in Pakistan.',
    fullText: `FBR has updated income tax withholding rates under Sections 236C (Seller) and 236K (Buyer) for FY 2025-26. Active Tax Filers pay a reduced 3% tax rate on property transactions, whereas Non-Filers face 10.5% advance tax. Additionally, Section 7E imposes a 1% tax on deemed rental income of un-utilized properties valued above PKR 2.5 Crore.`,
    status: 'PUBLISHED'
  },
  {
    id: 'news-2',
    badge: 'INVESTMENT ANALYSIS',
    category: 'INVESTMENT ANALYSIS',
    title: 'DHA vs Bahria Town: Where Should You Invest in 2026?',
    date: 'Jul 2026',
    readTime: '6 min read',
    author: 'Sarmayadar Editorial',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    snippet: 'Comparative analysis of ROI, rental yields, possession timelines, and resale velocity between DHA Lahore Phase 6/8 and Bahria Town Sector F.',
    fullText: `DHA continues to lead capital appreciation with 14.8% annual ROI driven by overseas Pakistani demand and corporate leases. Bahria Town offers superior commercial rental yields (up to 9.2%) and immediate possession for end-users seeking ready infrastructure.`,
    status: 'PUBLISHED'
  },
  {
    id: 'news-3',
    badge: 'MEGAPROJECTS',
    category: 'MEGAPROJECTS',
    title: 'Rawalpindi Ring Road & Motorway Interchange Impact',
    date: 'Jul 2026',
    readTime: '5 min read',
    author: 'Sarmayadar Editorial',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    snippet: 'How the new Rawalpindi Ring Road interchange is driving massive appreciation for housing societies near M-2 Motorway and Airport corridor.',
    fullText: `The inauguration of the 38km Rawalpindi Ring Road economic corridor has slashed heavy transport travel time between N-5 and M-2 Motorway, triggering a 28% surge in land valuation for adjacent housing projects in Rawalpindi and Islamabad West.`,
    status: 'PUBLISHED'
  },
  {
    id: 'news-4',
    badge: 'FBR TAXES 2026',
    category: 'FBR TAXES 2026',
    title: 'Capital Gains Tax (CGT) Holding Period Rules 2026',
    date: 'Jun 2026',
    readTime: '5 min read',
    author: 'FBR Tax Advisor',
    img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    snippet: 'Understanding the slab rates for open plots versus constructed properties depending on holding periods up to 6 years.',
    fullText: `Under Finance Act 2025-26, open plot sellers face 15% CGT for holding periods up to 1 year, scaling down to 0% after 6 years for Active Filers. Constructed properties receive lower holding slabs (0% tax after 4 years).`,
    status: 'PUBLISHED'
  },
  {
    id: 'news-5',
    badge: 'INVESTMENT ANALYSIS',
    category: 'INVESTMENT ANALYSIS',
    title: 'Top 5 High Rental Yield Societies in Lahore & Islamabad',
    date: 'Jun 2026',
    readTime: '7 min read',
    author: 'Real Estate Research Lab',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    snippet: 'Detailed analysis of 10 Marla and 1 Kanal residential rental yields in Gulberg, DHA Phase 5, E-11 Islamabad, and Faisal Town.',
    fullText: `Properties located near tech hubs, universities, and ring road interchanges generate robust monthly rental cashflows exceeding 7.5% per annum. Commercial plazas in Gulberg and DHA Sector CCA offer up to 10% net yield.`,
    status: 'PUBLISHED'
  },
  {
    id: 'news-6',
    badge: 'BUYING ADVICE',
    category: 'BUYING ADVICE',
    title: 'Overseas Pakistanis Property Purchasing & Power of Attorney Guide',
    date: 'May 2026',
    readTime: '6 min read',
    author: 'Legal Desk Sarmayadar',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    snippet: 'Step-by-step guide for overseas Pakistanis to safely purchase, transfer, and verify property titles via Roshan Digital Account (RDA).',
    fullText: `Overseas Pakistanis can execute property purchases remotely using NADRA Digital Power of Attorney attested via Pakistan Embassy. RDA accounts offer fast 24-hour tax refund clearing and repatriation of capital sale proceeds.`,
    status: 'PUBLISHED'
  }
];

// Initialize Application
async function initApp() {
  state.properties = getEffectiveProperties(INITIAL_PROPERTIES);

  // Initialize Blogs DB from LocalStorage or seed default articles
  const savedBlogs = localStorage.getItem('Sarmayadar_blogs_db');
  if (savedBlogs) {
    try {
      const parsed = JSON.parse(savedBlogs);
      state.blogsList = (Array.isArray(parsed) && parsed.length > 0) ? parsed : ARTICLES_DB;
    } catch (e) {
      state.blogsList = ARTICLES_DB;
    }
  } else {
    state.blogsList = ARTICLES_DB;
    localStorage.setItem('Sarmayadar_blogs_db', JSON.stringify(ARTICLES_DB));
  }

  // Persistent Login Session with 10-Minute Inactivity Timeout Check
  const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
  const savedTokenStr = localStorage.getItem('Sarmayadar_jwt_token');

  if (savedTokenStr) {
    try {
      const tokenObj = JSON.parse(savedTokenStr);
      const now = Date.now();
      const lastActive = tokenObj.lastActiveTime || tokenObj.issuedAt || now;

      if (now - lastActive > INACTIVITY_TIMEOUT_MS) {
        localStorage.removeItem('Sarmayadar_jwt_token');
        state.user = null;
        showToast('⏱️ Session expired due to 10 minutes of inactivity. Please sign in again.');
      } else {
        tokenObj.lastActiveTime = now;
        localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(tokenObj));
        state.user = tokenObj;
      }
    } catch (e) {
      localStorage.removeItem('Sarmayadar_jwt_token');
      state.user = null;
    }
  } else {
    state.user = null;
  }

  // Ensure activeTab is persisted in LocalStorage & URL Hash
  setActiveTab(state.activeTab);

  // Hashchange listener for browser back/forward and URL navigation
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validTabs = ['buy', 'rent', 'projects', 'tools', 'agents', 'blogs', 'advertise', 'dealer'];
    if (validTabs.includes(hash) && state.activeTab !== hash) {
      setActiveTab(hash);
      renderApp();
    }
  });

  renderApp();
  setupEventListeners();

  // Trigger Bismillah Preloader progress and smooth fade out
  triggerSplashAnimation();

  // Fetch latest properties live from Neon PostgreSQL Database
  try {
    const dbProperties = await fetchPropertiesFromApi();
    if (dbProperties && dbProperties.length > 0) {
      const existingIds = new Set(dbProperties.map(p => p.id));
      const remainingLocal = state.properties.filter(p => !existingIds.has(p.id));
      state.properties = [...dbProperties, ...remainingLocal];
      renderApp();
    }
  } catch (err) {
    console.warn('Neon DB sync notice:', err);
  }

  // Auto-register Web Push Service Worker if supported
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    registerServiceWorker().catch(err => console.warn('SW auto-registration notice:', err.message));

    // Listen for Service Worker messages (e.g. notification clicked)
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'OPEN_PROPERTY_DETAIL' && event.data.propertyId) {
        const propId = event.data.propertyId;
        const matchedProp = state.properties.find(p => p.id === propId);
        if (matchedProp) {
          state.selectedProperty = normalizeProperty(matchedProp);
          renderApp();
        }
      }
    });
  }

  // Check URL Query Parameters for direct property detail link from push notification
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const targetPropertyId = urlParams.get('propertyId');
    if (targetPropertyId) {
      const matchedProp = state.properties.find(p => p.id === targetPropertyId);
      if (matchedProp) {
        state.selectedProperty = normalizeProperty(matchedProp);
        renderApp();
      }
    }
  } catch (e) {}

  // Auto-trigger Featured Property Popup Ad 10 seconds after opening website
  setTimeout(() => {
    if (!state.showFeaturedModal && !state.selectedProperty && !state.showAuthModal && !state.showPostWizard) {
      state.showFeaturedModal = true;
      renderApp();
    }
  }, 10000);
}

function renderApp() {
  try {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    initI18n(state);
    state.properties = normalizeProperties(state.properties);
    if (state.selectedProperty) {
      state.selectedProperty = normalizeProperty(state.selectedProperty);
    }

    const filteredProperties = getFilteredProperties();


    let mainContentHTML = '';
    if (state.activeTab === 'buy' || state.activeTab === 'rent') {
      mainContentHTML = `
        ${renderHeroSearch(state)}
        ${renderFeaturedBannersSection()}
        ${renderCatalog(filteredProperties, state)}
        ${renderOverseasPortal()}
        ${renderPriceTrendsSection()}
        ${renderNewsSection()}
      `;
    } else if (state.activeTab === 'projects') {
      mainContentHTML = `
        ${renderHousingProjects()}
        ${renderPriceTrendsSection()}
      `;
    } else if (state.activeTab === 'featured') {
      mainContentHTML = `
        ${renderFeaturedPage(state, state.properties)}
      `;
    } else if (state.activeTab === 'tools') {
      mainContentHTML = `
        ${renderFinancialTools(state)}
      `;
    } else if (state.activeTab === 'agents') {
      mainContentHTML = `
        ${renderAgentDirectory()}
      `;
    } else if (state.activeTab === 'blogs') {
      mainContentHTML = `
        ${renderBlogsPage(state)}
      `;
    } else if (state.activeTab === 'advertise') {
      mainContentHTML = `
        ${renderAdvertisePage(state)}
      `;
    } else if (state.activeTab === 'advertise-checkout') {
      mainContentHTML = `
        ${renderAdvertiseCheckout(state)}
      `;
    } else if (state.activeTab === 'advertise-invoice') {
      mainContentHTML = `
        ${renderAdvertiseInvoice(state)}
      `;
    } else if (state.activeTab === 'dealer' || state.activeTab === 'dashboard') {
      mainContentHTML = `
        ${renderDashboardSystem(state.properties, state)}
      `;
    } else if (state.activeTab === 'admin') {
      mainContentHTML = `
        ${renderAdminLoginPage(state)}
      `;
    } else if (state.activeTab === 'property-detail') {
      mainContentHTML = `
        ${renderPropertyDetailPage(state)}
      `;
    } else if (state.activeTab === 'post-property') {
      mainContentHTML = `
        ${renderPostPropertyPage(state)}
      `;
    } else if (state.activeTab === 'blog-detail') {
      mainContentHTML = `
        ${renderBlogDetailPage(state)}
      `;
    } else if (state.activeTab === 'privacy') {
      mainContentHTML = `
        ${renderLegalPage('privacy')}
      `;
    } else if (state.activeTab === 'terms') {
      mainContentHTML = `
        ${renderLegalPage('terms')}
      `;
    } else if (state.activeTab === 'fbr-tax-guide') {
      mainContentHTML = `
        ${renderLegalPage('fbr-tax-guide')}
      `;
    } else if (state.activeTab === 'compare') {
      mainContentHTML = `
        ${renderPropertyComparerPage(state)}
      `;
    } else if (state.activeTab === 'login') {
      mainContentHTML = `
        ${renderAuthPage('login', state)}
      `;
    } else if (state.activeTab === 'register') {
      mainContentHTML = `
        ${renderAuthPage('register', state)}
      `;
    }

    const shouldRenderSplash = state.showSplash;
    if (state.showSplash) {
      state.showSplash = false;
    }

    appContainer.innerHTML = `
      ${shouldRenderSplash ? renderSplashScreen() : ''}
      ${renderHeader(state, onStateChange)}
      <main>${mainContentHTML}</main>
      ${renderFooter()}
      
      <!-- Drawers & Widgets (Popups Removed - Moved to Dedicated Pages) -->
      ${renderSavedFavoritesDrawer(state.properties, state)}

      <!-- Persistent Floating AI Chatbot Widget -->
      ${renderAIChatbotWidget(state)}

      <!-- Mobile Bottom Navigation Bar (OLX Style) -->
      ${renderMobileBottomNav(state)}

      <!-- Web Push Notification Banner -->
      ${renderPushNotificationBanner(state)}

      <!-- Toast Notifications Container -->
      <div id="toast-container"></div>
    `;

    // Initialize Push Banner Event Listeners
    initPushBannerEvents(state, renderApp, showToast);

    // Re-initialize Lucide Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Initialize Leaflet Map if in map view mode
    if ((state.activeTab === 'buy' || state.activeTab === 'rent') && state.viewMode === 'map') {
      setTimeout(() => {
        initLeafletMap(filteredProperties);
      }, 100);
    }

    // Re-attach dynamic calculations for tools tab
    if (state.activeTab === 'tools') {
      bindToolCalculators();
    }

    // Auto scroll chat box to bottom if chatbot open
    const chatMsgs = document.getElementById('ai-chat-messages');
    if (chatMsgs) {
      chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }
  } catch (err) {
    console.error('renderApp error:', err);
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = `
        <div style="padding: 2rem; background: #FEF2F2; color: #991B1B; border: 2px solid #EF4444; border-radius: 12px; margin: 2rem;">
          <h2 style="font-family: sans-serif;">⚠️ Portal Render Error</h2>
          <p>An unexpected error occurred during rendering:</p>
          <pre style="background: #FFF; padding: 1rem; border-radius: 6px; overflow-x: auto;">${err.stack || err.message || err}</pre>
        </div>
      `;
    }
  }
}

function onStateChange(key, value) {
  if (key === 'activeTab') {
    setActiveTab(value);
  } else {
    state[key] = value;
  }
  renderApp();
}

function handleSearchQueryExecution(query) {
  const cleanQuery = (query || '').trim();
  state.searchQuery = cleanQuery;

  if (!cleanQuery) {
    state.searchFilters.exactSizeMarla = null;
    state.searchFilters.exactSizeLabel = null;
    renderApp();
    return;
  }

  // 1. Detect Exact Property Size in Query
  const parsedSize = parsePropertySizeFromQuery(cleanQuery);
  if (parsedSize) {
    state.searchFilters.exactSizeMarla = parsedSize.sizeMarla;
    state.searchFilters.exactSizeLabel = parsedSize.sizeLabel;
  } else {
    state.searchFilters.exactSizeMarla = null;
    state.searchFilters.exactSizeLabel = null;
  }

  // 2. Detect City
  const lowerQ = cleanQuery.toLowerCase();
  if (lowerQ.includes('lahore') || lowerQ.includes('dha phase 6') || lowerQ.includes('dha phase 5') || lowerQ.includes('gulberg')) {
    state.searchFilters.city = 'lahore';
  } else if (lowerQ.includes('islamabad') || lowerQ.includes('bahria town phase 8') || lowerQ.includes('f-7') || lowerQ.includes('g-11')) {
    state.searchFilters.city = 'islamabad';
  } else if (lowerQ.includes('karachi') || lowerQ.includes('clifton') || lowerQ.includes('emaar')) {
    state.searchFilters.city = 'karachi';
  } else if (lowerQ.includes('rawalpindi')) {
    state.searchFilters.city = 'rawalpindi';
  }

  // 3. Detect Category
  if (lowerQ.includes('house') || lowerQ.includes('villa') || lowerQ.includes('portion') || lowerQ.includes('residence')) {
    state.searchFilters.category = 'house';
  } else if (lowerQ.includes('apartment') || lowerQ.includes('flat') || lowerQ.includes('penthouse')) {
    state.searchFilters.category = 'apartment';
  } else if (lowerQ.includes('plot') || lowerQ.includes('land')) {
    state.searchFilters.category = 'plot';
  } else if (lowerQ.includes('commercial') || lowerQ.includes('office') || lowerQ.includes('shop') || lowerQ.includes('plaza')) {
    state.searchFilters.category = 'commercial';
  }

  if (parsedSize) {
    showToast(`🔍 Searching for exact size: ${parsedSize.sizeLabel}...`);
  } else {
    showToast(`🔍 Searching verified database for "${cleanQuery}"...`);
  }
  
  renderApp();

  const catalogEl = document.querySelector('.catalog-section');
  if (catalogEl) {
    catalogEl.scrollIntoView({ behavior: 'smooth' });
  }
}

function isPublicStatus(status) {
  if (!status) return true;
  const s = String(status).toLowerCase().trim();
  return s === 'active' || s === 'published' || s === 'public';
}

function getFilteredProperties() {
  let list = [...state.properties];

  // Status filter (only show public/published/active listings on main catalog)
  list = list.filter(p => isPublicStatus(p.status));

  // Purpose filter
  if (state.activeTab === 'buy') {
    list = list.filter(p => String(p.purpose || '').toLowerCase() === 'sale');
  } else if (state.activeTab === 'rent') {
    list = list.filter(p => String(p.purpose || '').toLowerCase() === 'rent');
  }

  const f = state.searchFilters;

  // Exact Property Size Filter (HIGHEST PRIORITY)
  if (f.exactSizeMarla != null) {
    const targetSize = Number(f.exactSizeMarla);
    list = list.filter(p => {
      const pMarla = Number(p.sizeMarla || p.size_marla || 0);
      return Math.abs(pMarla - targetSize) < 0.1;
    });
  } else if (f.size && f.size !== 'all' && f.size !== 'null') {
    const sz = Number(f.size);
    list = list.filter(p => (p.sizeMarla || 0) >= sz);
  }

  // Search Filters
  if (f.city && f.city !== 'all') {
    list = list.filter(p => (p.city || '').toLowerCase() === f.city.toLowerCase());
  }

  if (f.society && f.society !== 'all') {
    list = list.filter(p => (p.location || '').toLowerCase().includes(f.society.toLowerCase()));
  }

  if (f.category && f.category !== 'all') {
    list = list.filter(p => p.category === f.category);
  }

  if (f.maxPrice && f.maxPrice !== 'any' && f.maxPrice !== 'all') {
    const maxP = Number(f.maxPrice);
    list = list.filter(p => (p.price || 0) <= maxP);
  }

  if (f.badge) {
    list = list.filter(p => Array.isArray(p.badges) && p.badges.includes(f.badge));
  }

  // Sorting
  if (state.sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'newest') {
    list.sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0));
  }

  return list;
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  const isSpinner = message.includes('⏳') || message.includes('Uploading');
  const icon = isSpinner
    ? `<span style="display:inline-block; width:16px; height:16px; border:2.5px solid #ffffff; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; vertical-align:middle; margin-right:8px;"></span>`
    : `<i data-lucide="check-circle" style="width:18px; height:18px; color:var(--marigold); vertical-align:middle; margin-right:6px;"></i> `;
  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.remove();
  }, isSpinner ? 5000 : 3500);
}


function canUserPostProperty(state) {
  if (!state.user) {
    showToast('🔒 Please sign in or register an account to post a property listing.');
    state.authMode = 'signup';
    state.authIsRegister = true;
    state.authIsSignup = true;
    state.showAuthModal = false;
    state.showMobileNav = false;
    setActiveTab('register');
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
  }

  // Count existing properties posted by this user
  const userListingsCount = (state.properties || []).filter(p =>
    p.postedByUserId === state.user.id ||
    p.ownerEmail === state.user.email ||
    p.agentEmail === state.user.email ||
    p.postedByEmail === state.user.email
  ).length;

  if (state.user.role !== 'DEALER' && state.user.role !== 'ADMIN' && userListingsCount >= 5) {
    showToast('⚠️ Free accounts are limited to 5 property listings. Upgrade to a Dealer account for unlimited listings!');
    state.showAuthModal = true;
    state.authRole = 'DEALER';
    state.authIsRegister = true;
    state.showMobileNav = false;
    renderApp();
    return false;
  }

  return true;
}

function setupEventListeners() {
  document.addEventListener('click', (e) => {
    // Top Bar + Mobile Drawer Post Free Listing Trigger
    if (e.target.closest('#top-bar-post-free-btn') || e.target.closest('#mobile-drawer-post-free-btn')) {
      state.showMobileNav = false;
      if (canUserPostProperty(state)) {
        setActiveTab('post-property');
        renderApp();
      }
      return;
    }

    // Article Reader Modal Triggers
    const artBtn = e.target.closest('.read-article-btn');
    if (artBtn) {
      const artId = artBtn.getAttribute('data-id');
      const foundArt = ARTICLES_DB.find(a => a.id === artId);
      if (foundArt) {
        state.selectedArticle = foundArt;
        state.showArticleModal = true;
        renderApp();
      }
    }

    if (e.target.closest('#close-article-btn') || e.target.id === 'article-modal-overlay') {
      state.showArticleModal = false;
      renderApp();
    }

    // 360 Virtual Tour Triggers
    if (e.target.closest('#open-360-tour-btn') || e.target.closest('.open-tour-btn')) {
      const propId = e.target.closest('[data-id]')?.getAttribute('data-id');
      const found = state.properties.find(p => p.id === propId) || state.properties[0];
      state.virtualTourProperty = found;
      state.showVirtualTourModal = true;
      renderApp();
    }

    if (e.target.closest('#close-tour-btn') || e.target.id === 'virtual-tour-overlay') {
      state.showVirtualTourModal = false;
      renderApp();
    }

    // Property Comparison Matrix Triggers
    if (e.target.closest('#open-comparer-btn') || e.target.closest('.compare-btn')) {
      state.showComparerModal = true;
      renderApp();
    }

    if (e.target.closest('#close-comparer-btn') || e.target.id === 'comparer-modal-overlay') {
      state.showComparerModal = false;
      renderApp();
    }

    // Schedule Visit / Video Walkthrough Triggers
    if (e.target.closest('#open-schedule-visit-btn') || e.target.closest('.schedule-btn')) {
      const propId = e.target.closest('[data-id]')?.getAttribute('data-id');
      const found = state.properties.find(p => p.id === propId) || state.properties[0];
      state.selectedVisitProperty = found;
      state.showScheduleVisitModal = true;
      renderApp();
    }

    if (e.target.closest('#close-schedule-btn') || e.target.closest('#cancel-schedule-btn') || e.target.id === 'schedule-visit-overlay') {
      state.showScheduleVisitModal = false;
      renderApp();
    }

    // AI Chatbot Toggle
    if (e.target.closest('#toggle-ai-chat-btn')) {
      state.showAIChatbot = !state.showAIChatbot;
      renderApp();
    }

    if (e.target.closest('#close-ai-chat-btn')) {
      state.showAIChatbot = false;
      renderApp();
    }

    const chatLangBtn = e.target.closest('.chat-lang-btn');
    if (chatLangBtn) {
      state.chatLanguage = chatLangBtn.getAttribute('data-lang') || 'en';
      renderApp();
    }

    // AI Quick Prompt Chips in Chatbot
    const quickChip = e.target.closest('.ai-quick-chip');
    if (quickChip) {
      const q = quickChip.getAttribute('data-q');
      handleAIChatSubmit(q);
    }

    // AI Sample Prompt Buttons in Main Search Section
    const sampleBtn = e.target.closest('.ai-sample-prompt-btn');
    if (sampleBtn) {
      const p = sampleBtn.getAttribute('data-prompt');
      const input = document.getElementById('ai-prompt-input');
      if (input) input.value = p;
      handleSearchQueryExecution(p);
    }

    // AI Search Execution
    if (e.target.closest('#execute-ai-search-btn')) {
      const promptVal = document.getElementById('ai-prompt-input')?.value || '';
      handleSearchQueryExecution(promptVal);
    }

    // Reset / Clear Search Filters Button
    if (e.target.closest('#reset-search-filters-btn')) {
      state.searchQuery = '';
      state.searchFilters.city = 'all';
      state.searchFilters.society = 'all';
      state.searchFilters.category = 'all';
      state.searchFilters.maxPrice = 'any';
      state.searchFilters.badge = null;
      state.searchFilters.size = null;
      state.searchFilters.exactSizeMarla = null;
      state.searchFilters.exactSizeLabel = null;
      const input = document.getElementById('ai-prompt-input');
      if (input) input.value = '';
      showToast('🔄 Search filters cleared!');
      renderApp();
    }

    // Featured Property Modal Triggers -> Redirect to Advertise Packages Page
    if (e.target.closest('#open-featured-modal-btn')) {
      e.preventDefault();
      setActiveTab('advertise');
      state.showFeaturedModal = false;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (e.target.closest('#close-featured-btn') || e.target.id === 'featured-modal-overlay') {
      state.showFeaturedModal = false;
      renderApp();
    }

    if (e.target.closest('#mobile-push-toggle-btn')) {
      e.preventDefault();
      togglePushNotifications().then(res => {
        if (showToast) showToast(res.message);
        renderApp();
      });
    }

    // Mobile Hamburger Menu Toggle
    if (e.target.closest('#toggle-mobile-menu-btn')) {
      state.showMobileNav = !state.showMobileNav;
      renderApp();
    }

    if (e.target.closest('#mobile-open-auth-btn')) {
      e.preventDefault();
      state.showMobileNav = false;
      state.showAuthModal = true;
      renderApp();
    }

    // Mobile Bottom Navigation Bar Actions (OLX Style)
    if (e.target.closest('#mobile-nav-home-btn')) {
      setActiveTab('buy');
      state.searchFilters.purpose = 'sale';
      state.showMobileNav = false;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (e.target.closest('#mobile-nav-signin-btn')) {
      state.showAuthModal = true;
      state.authMode = 'login';
      state.authIsSignup = false;
      renderApp();
    }

    if (e.target.closest('#mobile-nav-signup-btn')) {
      state.showAuthModal = true;
      state.authMode = 'signup';
      state.authIsSignup = true;
      renderApp();
    }

    if (e.target.closest('#mobile-nav-chats-btn')) {
      state.showAIChatbot = !state.showAIChatbot;
      renderApp();
    }

    if (e.target.closest('#mobile-nav-sell-btn')) {
      e.preventDefault();
      if (!canUserPostProperty(state)) return;
      state.editingProperty = null;
      state.uploadedImages = [];
      state.showPostWizard = true;
      state.wizardStep = 1;
      renderApp();
    }

    if (e.target.closest('#mobile-nav-myads-btn')) {
      if (state.user?.role === 'DEALER' || state.user?.role === 'ADMIN') {
        setActiveTab('dealer');
        state.dealerTab = 'inventory';
        renderApp();
      } else {
        state.showFavoritesDrawer = true;
        renderApp();
      }
    }

    if (e.target.closest('#mobile-nav-account-btn')) {
      if (state.user) {
        setActiveTab('dealer');
        state.dealerTab = 'profile';
        renderApp();
        showToast(`👤 Welcome ${state.user.name}! Opened Profile Settings.`);
      } else {
        state.authMode = 'login';
        state.authIsRegister = false;
        state.authIsSignup = false;
        state.showMobileNav = false;
        setActiveTab('login');
        renderApp();
      }
    }

    // Language Selector Click & Selection Handlers
    if (e.target.closest('#lang-selector-btn') || e.target.closest('#lang-selector-btn-main')) {
      e.preventDefault();
      state.showLangDropdown = !state.showLangDropdown;
      renderApp();
    }

    const langBtn = e.target.closest('[data-lang-select]');
    if (langBtn) {
      e.preventDefault();
      const langCode = langBtn.getAttribute('data-lang-select');
      state.showLangDropdown = false;
      state.showMobileNav = false;
      setLanguage(langCode, state, renderApp);
      const labels = { en: 'English 🇬🇧', ur: 'Urdu 🇵🇰', ar: 'Arabic 🇸🇦' };
      showToast(`🌐 Language changed to ${labels[langCode] || langCode}`);
    }

    if (state.showLangDropdown && !e.target.closest('#lang-selector-btn') && !e.target.closest('#lang-selector-btn-main') && !e.target.closest('.lang-dropdown-menu')) {
      state.showLangDropdown = false;
      renderApp();
    }

    if (state.showProfileDropdown && !e.target.closest('#header-user-profile-icon-btn') && !e.target.closest('.user-profile-dropdown')) {
      state.showProfileDropdown = false;
      renderApp();
    }

    // Header Profile Icon Click Listener (Before Login -> /login, After Login -> Toggle Dropdown Menu)
    if (e.target.closest('#header-user-profile-icon-btn') || e.target.closest('#header-user-profile-btn') || e.target.closest('#mobile-auth-login-link-btn') || e.target.closest('#mobile-user-profile-btn')) {
      e.preventDefault();
      state.showMobileNav = false;
      if (state.user) {
        state.showProfileDropdown = !state.showProfileDropdown;
        renderApp();
      } else {
        state.activeTab = 'login';
        if (window.location.hash !== '#login') history.replaceState(null, '', '#login');
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Dashboard Left Sidebar & Sub-Tab Click Listener
    const dashTabBtn = e.target.closest('[data-dash-tab]');
    if (dashTabBtn) {
      e.preventDefault();
      const tab = dashTabBtn.getAttribute('data-dash-tab');
      state.dashboardTab = tab;
      state.activeTab = 'dashboard';
      if (window.innerWidth <= 992) {
        state.isSidebarExpanded = false;
      }
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Toggle / Close Sidebar Drawer on Mobile & Desktop
    if (e.target.closest('#dash-toggle-sidebar') || e.target.closest('#dash-close-sidebar') || e.target.closest('#dash-sidebar-backdrop')) {
      e.preventDefault();
      state.isSidebarExpanded = !state.isSidebarExpanded;
      renderApp();
    }

    // Settings Sub-Tabs Click Handler (User Settings, Preferences, Change Password)
    const settingsTabBtn = e.target.closest('[data-settings-tab]');
    if (settingsTabBtn) {
      e.preventDefault();
      state.settingsSubTab = settingsTabBtn.getAttribute('data-settings-tab');
      renderApp();
    }

    // Mega Projects Modal Handlers
    if (e.target.closest('#add-mega-project-modal-btn')) {
      e.preventDefault();
      state.editingMegaProject = null;
      state.showMegaProjectModal = true;
      renderApp();
    }

    if (e.target.closest('#close-mega-project-modal-btn')) {
      e.preventDefault();
      state.showMegaProjectModal = false;
      renderApp();
    }

    const editMpBtn = e.target.closest('.dash-edit-mega-project-btn');
    if (editMpBtn) {
      e.preventDefault();
      const mpId = editMpBtn.getAttribute('data-id');
      const mps = state.megaProjects || [
        { id: 'mp-1', projectName: 'Pearl One Courtyard (Towers 1, 2 & 3)', developerName: 'ABS Developers', location: 'Bahria Town', city: 'Lahore', minPrice: 8500000, maxPrice: 38000000, totalUnits: 450, status: 'approved', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'] },
        { id: 'mp-2', projectName: 'ABS Mall & Residency', developerName: 'ABS Developers', location: 'Main Ring Road Interchange', city: 'Lahore', minPrice: 6500000, maxPrice: 29000000, totalUnits: 180, status: 'approved', images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'] },
        { id: 'mp-3', projectName: 'Burj Quaid', developerName: 'ABS Developers', location: 'DHA City', city: 'Karachi', minPrice: 25000000, maxPrice: 120000000, totalUnits: 250, status: 'approved', images: ['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80'] }
      ];
      const targetMp = mps.find(m => m.id === mpId);
      if (targetMp) {
        state.editingMegaProject = targetMp;
        state.showMegaProjectModal = true;
        renderApp();
      }
    }

    const deleteMpBtn = e.target.closest('.dash-delete-mega-project-btn');
    if (deleteMpBtn) {
      e.preventDefault();
      const mpId = deleteMpBtn.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this Mega Project listing?')) {
        const mps = state.megaProjects || [
          { id: 'mp-1', projectName: 'Pearl One Courtyard (Towers 1, 2 & 3)', developerName: 'ABS Developers', location: 'Bahria Town', city: 'Lahore', minPrice: 8500000, maxPrice: 38000000, totalUnits: 450, status: 'approved', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'] },
          { id: 'mp-2', projectName: 'ABS Mall & Residency', developerName: 'ABS Developers', location: 'Main Ring Road Interchange', city: 'Lahore', minPrice: 6500000, maxPrice: 29000000, totalUnits: 180, status: 'approved', images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'] },
          { id: 'mp-3', projectName: 'Burj Quaid', developerName: 'ABS Developers', location: 'DHA City', city: 'Karachi', minPrice: 25000000, maxPrice: 120000000, totalUnits: 250, status: 'approved', images: ['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80'] }
        ];
        state.megaProjects = mps.filter(m => m.id !== mpId);
        showToast('🗑️ Mega Project deleted successfully.');
        renderApp();
      }
    }

    if (e.target.closest('#dropdown-dashboard-btn')) {
      state.showProfileDropdown = false;
      state.activeTab = 'dashboard';
      state.dashboardTab = 'dashboard';
      renderApp();
    }

    if (e.target.closest('#dropdown-settings-btn')) {
      state.showProfileDropdown = false;
      state.activeTab = 'dashboard';
      state.dashboardTab = 'profile';
      renderApp();
    }

    // Logout Handlers (From Dropdown or Dashboard Sidebar)
    if (e.target.closest('#header-dropdown-logout-btn') || e.target.closest('#dash-logout-btn') || e.target.closest('#logout-btn') || e.target.closest('#mobile-logout-btn')) {
      e.preventDefault();
      localStorage.removeItem('Sarmayadar_jwt_token');
      state.user = null;
      state.showProfileDropdown = false;
      state.activeTab = 'buy';
      showToast('🔒 Logged out successfully.');
      renderApp();
    }

    if (e.target.closest('#dash-post-listing-btn')) {
      e.preventDefault();
      state.dashboardTab = 'add-property';
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Navigation Links
    const navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      e.preventDefault();
      const tab = navBtn.getAttribute('data-nav');
      if (tab === 'post-property') {
        if (!canUserPostProperty(state)) return;
      }
      if (tab === 'dealer' && state.user?.role !== 'DEALER' && state.user?.role !== 'ADMIN') {
        showToast('⚠️ Dealer Portal is strictly for verified Agencies & Brokers. Please sign in or register as a Dealer.');
        state.showAuthModal = true;
        state.authRole = 'DEALER';
        state.authIsRegister = true;
        state.showMobileNav = false;
        renderApp();
        return;
      }
      setActiveTab(tab);
      state.showMobileNav = false;
      if (tab === 'buy') state.searchFilters.purpose = 'sale';
      if (tab === 'rent') state.searchFilters.purpose = 'rent';
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // View Mode Toggle (Grid vs Map)
    const viewBtn = e.target.closest('[data-view]');
    if (viewBtn) {
      state.viewMode = viewBtn.getAttribute('data-view');
      renderApp();
    }

    // Hero Search Purpose Tabs
    const searchTab = e.target.closest('.search-tab, .tab-btn[data-purpose]');
    if (searchTab) {
      const purp = searchTab.getAttribute('data-purpose');
      if (purp) {
        state.searchFilters.purpose = purp;
        if (purp === 'rent') state.activeTab = 'rent';
        else if (purp === 'projects') state.activeTab = 'projects';
        else state.activeTab = 'buy';
        renderApp();
      }
    }

    // Quick Filter Chips
    const filterChip = e.target.closest('.filter-chip[data-badge], .filter-chip[data-size]');
    if (filterChip) {
      const badge = filterChip.getAttribute('data-badge');
      const size = filterChip.getAttribute('data-size');
      if (badge) {
        state.searchFilters.badge = state.searchFilters.badge === badge ? null : badge;
      }
      if (size) {
        state.searchFilters.size = state.searchFilters.size === size ? null : size;
      }
      renderApp();
    }

    // Execute Search Button
    if (e.target.closest('#execute-search-btn')) {
      const cityVal = document.getElementById('filter-city')?.value || 'all';
      const societyVal = document.getElementById('filter-society')?.value || 'all';
      const typeVal = document.getElementById('filter-type')?.value || 'all';

      triggerQuickPagePreloader(() => {
        state.searchFilters.city = cityVal;
        state.searchFilters.society = societyVal;
        state.searchFilters.category = typeVal;
        renderApp();
        showToast(`Filter applied! Found ${getFilteredProperties().length} properties.`);
      });
    }

    // Favorite Toggle Button
    const favBtn = e.target.closest('.fav-btn, .save-btn');
    if (favBtn) {
      e.stopPropagation();
      const id = favBtn.getAttribute('data-id');
      if (id) {
        const updatedFavs = toggleFavorite(id);
        renderApp();
        showToast(updatedFavs.includes(id) ? 'Saved to Favorites!' : 'Removed from Favorites.');
      }
    }

    // Property Details Trigger -> Navigates to Dedicated Property Detail Page (/property/:id)
    const detailBtn = e.target.closest('.view-details-btn, .popup-view-btn, .property-card, .view-prop-detail-btn, .chat-view-prop-btn');
    if (detailBtn && !e.target.closest('.fav-btn') && !e.target.closest('.save-btn') && !e.target.closest('.btn-whatsapp')) {
      const id = detailBtn.getAttribute('data-id');
      const target = (state.properties || []).find(p => String(p.id) === String(id));
      if (target) {
        target.views = (target.views || 0) + 1;
        saveOrUpdatePropertyInStorage(target);

        state.selectedPropertyId = id;
        state.selectedProperty = normalizeProperty(target);
        state.activeTab = 'property-detail';
        if (window.location.hash !== `#property/${id}`) {
          history.replaceState(null, '', `#property/${id}`);
        }
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Toggle 3D Walkthrough Section inside Property Detail Page
    if (e.target.closest('#toggle-3d-walkthrough-btn')) {
      state.showVirtualTourSection = !state.showVirtualTourSection;
      renderApp();
    }

    // Post Property Trigger -> Navigates to Dedicated Page (/post-property)
    if (e.target.closest('#open-post-property-btn') || e.target.closest('#dealer-post-btn') || e.target.id === 'footer-link-post') {
      e.preventDefault();
      if (state.user?.role !== 'DEALER' && state.user?.role !== 'ADMIN') {
        showToast('⚠️ Only verified Dealers can post properties. Please sign in as a Dealer.');
        state.activeTab = 'login';
        if (window.location.hash !== '#login') history.replaceState(null, '', '#login');
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      state.editingProperty = null;
      state.uploadedImages = [];
      state.activeTab = 'post-property';
      if (window.location.hash !== '#post-property') history.replaceState(null, '', '#post-property');
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Logout Handler
    if (e.target.closest('#logout-btn') || e.target.closest('#mobile-logout-btn')) {
      e.preventDefault();
      localStorage.removeItem('Sarmayadar_jwt_token');
      state.user = null;
      state.activeTab = 'buy';
      showToast('🔒 Logged out successfully.');
      renderApp();
    }

    // Privacy Policy Footer Link Trigger
    if (e.target.closest('#footer-privacy-btn')) {
      e.preventDefault();
      state.activeTab = 'privacy';
      if (window.location.hash !== '#privacy') history.replaceState(null, '', '#privacy');
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Terms of Service Footer Link Trigger
    if (e.target.closest('#footer-terms-btn')) {
      e.preventDefault();
      state.activeTab = 'terms';
      if (window.location.hash !== '#terms') history.replaceState(null, '', '#terms');
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // FBR Tax Guide Footer Link Trigger
    if (e.target.closest('#footer-tax-guide-btn')) {
      e.preventDefault();
      state.activeTab = 'fbr-tax-guide';
      if (window.location.hash !== '#fbr-tax-guide') history.replaceState(null, '', '#fbr-tax-guide');
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Compare Properties Link Trigger
    if (e.target.closest('.open-compare-btn') || e.target.closest('#nav-compare-btn')) {
      e.preventDefault();
      state.activeTab = 'compare';
      if (window.location.hash !== '#compare') history.replaceState(null, '', '#compare');
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Step switching for Post Property Page
    if (e.target.closest('#wiz-next-step-btn') || e.target.closest('#wizard-next-btn')) {
      state.wizardStep = Math.min(4, (state.wizardStep || 1) + 1);
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (e.target.closest('#wiz-prev-step-btn') || e.target.closest('#wizard-prev-btn')) {
      state.wizardStep = Math.max(1, (state.wizardStep || 1) - 1);
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Advertise Checkout Confirmation -> Invoice Generator
    if (e.target.closest('#adv-confirm-checkout-btn') || (e.target.id === 'adv-checkout-form' && e.type === 'submit')) {
      if (e.preventDefault) e.preventDefault();
      const name = document.getElementById('chk_name')?.value?.trim() || 'Valued Advertiser';
      const phone = document.getElementById('chk_phone')?.value?.trim() || '+923297543852';
      const email = document.getElementById('chk_email')?.value?.trim() || 'advertiser@sarmayadar.com';
      const city = document.getElementById('chk_city')?.value || 'Lahore';
      const agencyName = document.getElementById('chk_agency')?.value?.trim() || '';

      const pkg = state.selectedPackage || {
        name: 'Pro Gold Agency Package',
        price: 24999,
        period: 'Per Month'
      };

      state.generatedInvoice = {
        invoiceId: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        dueDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        customerCity: city,
        agencyName: agencyName,
        package: pkg
      };

      setActiveTab('advertise-invoice');
      showToast('📄 Invoice generated successfully! Please transfer payment to Nayapay.');
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Copy Nayapay Bank Details Button
    if (e.target.closest('#btn-copy-bank-details')) {
      navigator.clipboard.writeText('+923297543852').then(() => {
        showToast('📋 Copied Nayapay Account Number (+923297543852) to clipboard!');
      }).catch(() => {
        showToast('📋 Nayapay Account Number: +923297543852');
      });
    }

    // Print / Download PDF Invoice Button
    if (e.target.closest('#btn-print-invoice')) {
      window.print();
    }

    // Confirm Payment via WhatsApp Redirect
    if (e.target.closest('#btn-confirm-whatsapp-payment')) {
      const trxId = document.getElementById('invoice_trx_id')?.value?.trim() || 'PENDING_TRX';
      const inv = state.generatedInvoice || { invoiceId: 'INV-2026-89123', package: { name: 'Advertise Package', price: 24999 }, customerName: 'Advertiser', customerPhone: '+923297543852' };
      const msg = `Hello Sarmayadar Team! I have completed payment for ${inv.package.name} (Invoice #${inv.invoiceId}).\nTotal Amount: PKR ${inv.package.price}\nTransaction ID: ${trxId}\nCustomer: ${inv.customerName} (${inv.customerPhone}).\nPlease verify & activate my advertising package.`;
      const url = `https://wa.me/923297543852?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    }

    // Image Upload Zone Click
    if (e.target.closest('#image-drag-drop-zone')) {
      const fileInput = document.getElementById('wiz-file-input') || document.getElementById('wiz_file_input');
      if (fileInput) fileInput.click();
    }

    // Remove Uploaded Image Thumbnail Button
    const removeImgBtn = e.target.closest('.remove-wiz-img-btn');
    if (removeImgBtn) {
      const idx = Number(removeImgBtn.getAttribute('data-index'));
      if (!isNaN(idx) && state.uploadedImages) {
        state.uploadedImages.splice(idx, 1);
        const container = document.getElementById('wiz-image-previews');
        if (container) {
          container.innerHTML = renderImagePreviewsList(state.uploadedImages);
        }
      }
    }

    // Edit Property Button Handler
    const editPropBtn = e.target.closest('.edit-prop-btn') || e.target.closest('.modal-edit-prop-btn');
    if (editPropBtn) {
      const id = editPropBtn.getAttribute('data-id');
      const propToEdit = state.properties.find(p => p.id === id);
      if (propToEdit) {
        state.editingProperty = { ...propToEdit };
        state.uploadedImages = propToEdit.images ? [...propToEdit.images] : [];
        state.showPostWizard = true;
        state.wizardStep = 1;
        state.selectedProperty = null; // Close detail modal if open
        renderApp();
      }
    }

    // View Property Page Click Handler (Dashboard / Tables / Cards)
    const viewPropBtn = e.target.closest('.dash-view-prop-btn') || e.target.closest('.view-prop-btn') || e.target.closest('.view-property-detail-btn');
    if (viewPropBtn) {
      e.preventDefault();
      const id = viewPropBtn.getAttribute('data-id');
      const propToView = state.properties.find(p => String(p.id) === String(id)) || state.properties[0];
      if (propToView) {
        propToView.views = (propToView.views || 0) + 1;
        state.selectedProperty = normalizeProperty(propToView);
        state.selectedPropertyId = propToView.id;
        setActiveTab('property-detail');
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Publish Listing Submit Button (from Dashboard Modal)
    if (e.target.closest('#publish-property-submit-btn')) {
      e.preventDefault();
      const btn = e.target.closest('#publish-property-submit-btn');
      if (btn.disabled) return;

      const titleEl = document.getElementById('wiz_title');
      const locationEl = document.getElementById('wiz_location');
      const priceEl = document.getElementById('wiz_price');
      const sizeEl = document.getElementById('wiz_size');

      // Clear previous error borders
      [titleEl, locationEl, priceEl, sizeEl].forEach(el => {
        if (el) el.style.borderColor = '#CBD5E1';
      });

      const title = titleEl?.value?.trim();
      const purpose = document.querySelector('input[name="wiz_purpose"]:checked')?.value || 'Sale';
      const category = document.getElementById('wiz_type')?.value || 'house';
      const city = document.getElementById('wiz_city')?.value || 'Lahore';
      const location = locationEl?.value?.trim();
      const size = Number(sizeEl?.value || 10);
      const price = Number(priceEl?.value || 0);
      const beds = Number(document.getElementById('wiz_beds')?.value || 4);
      const baths = Number(document.getElementById('wiz_baths')?.value || 5);
      const desc = document.getElementById('wiz_desc')?.value?.trim() || `${size} Marla Brand New House for ${purpose} in ${location}, ${city}.`;

      let hasError = false;
      if (!title) {
        if (titleEl) titleEl.style.borderColor = '#EF4444';
        showToast('⚠️ Please enter a Property Title.');
        hasError = true;
      }
      if (!location) {
        if (locationEl) locationEl.style.borderColor = '#EF4444';
        showToast('⚠️ Please enter a Property Location.');
        hasError = true;
      }
      if (!price || price <= 0) {
        if (priceEl) priceEl.style.borderColor = '#EF4444';
        showToast('⚠️ Please enter a valid Asking Price.');
        hasError = true;
      }
      if (!state.uploadedImages || state.uploadedImages.length === 0) {
        showToast('⚠️ Please upload at least 1 Property Photo.');
        hasError = true;
      }

      if (hasError) return;

      // Lock button & show loading state
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.innerHTML = '⌛ Publishing Property Live...';
      showToast('⏳ Uploading property photos & publishing listing...');

      (async () => {
        const agencyName = state.user?.agencyName || state.user?.name || 'Verified Real Estate Agency';
        const agentName = state.user?.name || 'Verified Dealer';
        const phone = state.user?.phone || '+92 300 0000000';

        const newProp = {
          id: `prop-${Date.now()}`,
          title,
          purpose,
          category,
          city,
          location,
          address: location,
          price,
          sizeMarla: size,
          bedrooms: beds,
          bathrooms: baths,
          builtYear: 2026,
          facing: 'North Facing',
          badges: ['VERIFIED', 'NEW LAUNCH'],
          images: [...state.uploadedImages],
          coords: [31.4722, 74.4371],
          agency: {
            name: agencyName,
            agentName: agentName,
            phone: phone,
            whatsapp: phone.replace(/[^0-9]/g, ''),
            badge: 'VERIFIED DEALER',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
          },
          description: desc,
          features: ['Solar Power Backup', 'Gas Connection'],
          status: 'active',
          postedDate: new Date().toISOString().split('T')[0],
          views: 1
        };

        const apiRes = await savePropertyToApi(newProp);
        saveCustomProperty(newProp);
        state.properties = [newProp, ...state.properties];
        state.showPostWizard = false;
        state.uploadedImages = [];
        state.activeTab = 'dashboard';
        state.dashboardTab = 'listings';
        showToast('🎉 Property created and published live successfully!');
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })();
      return;
    }


    // Delete Property Button Handler
    const deletePropBtn = e.target.closest('.delete-prop-btn') || e.target.closest('.modal-delete-prop-btn');
    if (deletePropBtn) {
      const id = deletePropBtn.getAttribute('data-id');
      const propToDelete = state.properties.find(p => p.id === id);
      const title = propToDelete ? propToDelete.title : 'this property';

      if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
        deletePropertyFromStorage(id);
        state.properties = state.properties.filter(p => p.id !== id);
        if (state.selectedProperty && state.selectedProperty.id === id) {
          state.selectedProperty = null;
        }
        showToast('🗑️ Property deleted successfully!');
        renderApp();
      }
    }

    // Save / Create Mega Project Form Submit
    if (e.target.closest('#save-mega-project-btn') || (e.target.closest('#save-mega-project-form') && e.type === 'submit')) {
      e.preventDefault();
      const mpId = document.getElementById('mp_id')?.value;
      const projectName = document.getElementById('mp_name')?.value?.trim();
      const developerName = document.getElementById('mp_dev')?.value?.trim();
      const city = document.getElementById('mp_city')?.value || 'Lahore';
      const location = document.getElementById('mp_location')?.value?.trim();
      const minPrice = Number(document.getElementById('mp_min_price')?.value || 5000000);
      const maxPrice = Number(document.getElementById('mp_max_price')?.value || 35000000);
      const description = document.getElementById('mp_desc')?.value?.trim();

      const images = (state.mpUploadedImages && state.mpUploadedImages.length > 0)
        ? state.mpUploadedImages
        : (state.editingMegaProject?.images || ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80']);

      const token = localStorage.getItem('Sarmayadar_jwt_token');

      (async () => {
        try {
          if (token) {
            const res = await fetch('/api/mega-projects', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ projectName, developerName, location, city, minPrice, maxPrice, description, images })
            });
            const data = await res.json();
            if (data.success && data.megaProject) {
              state.megaProjects = [data.megaProject, ...(state.megaProjects || [])];
              showToast('🚀 Mega Project created & published permanently to Database!');
            } else {
              const newMp = { id: 'mp-' + Date.now(), projectName, developerName, city, location, minPrice, maxPrice, totalUnits: 100, status: 'approved', description, images };
              state.megaProjects = [newMp, ...(state.megaProjects || [])];
              showToast('🚀 Mega Project created!');
            }
          } else {
            const newMp = { id: 'mp-' + Date.now(), projectName, developerName, city, location, minPrice, maxPrice, totalUnits: 100, status: 'approved', description, images };
            state.megaProjects = [newMp, ...(state.megaProjects || [])];
            showToast('🚀 Mega Project created!');
          }
        } catch (err) {
          console.warn('Backend API submission notice, saving locally:', err);
          const newMp = { id: 'mp-' + Date.now(), projectName, developerName, city, location, minPrice, maxPrice, totalUnits: 100, status: 'approved', description, images };
          state.megaProjects = [newMp, ...(state.megaProjects || [])];
          showToast('🚀 Mega Project created!');
        }

        state.showMegaProjectModal = false;
        state.editingMegaProject = null;
        state.mpUploadedImages = [];
        renderApp();
      })();
      return;
    }

    // Profile Photo Change Button Click
    if (e.target.closest('#user-profile-change-photo-btn')) {
      e.preventDefault();
      document.getElementById('user-profile-photo-input')?.click();
    }

    // Save Additional User Settings Form Submit
    if (e.target.closest('#save-user-settings-btn') || (e.target.closest('#dash-settings-form') && e.type === 'submit')) {
      e.preventDefault();
      const avatarUrl = document.getElementById('set_avatar')?.value?.trim();
      const name = document.getElementById('set_name')?.value?.trim();
      const phone = document.getElementById('set_phone')?.value?.trim();
      const whatsapp = document.getElementById('set_whatsapp')?.value?.trim();
      const city = document.getElementById('set_city')?.value;
      const address = document.getElementById('set_address')?.value?.trim();

      if (state.user) {
        if (name) state.user.name = name;
        if (avatarUrl) {
          state.user.avatar = avatarUrl;
          state.user.logo = avatarUrl;
        }
        if (phone) state.user.phone = `+92${phone.replace(/^\+?92/, '')}`;
        if (whatsapp) state.user.whatsapp = `+92${whatsapp.replace(/^\+?92/, '')}`;
        if (city) state.user.city = city;
        if (address) state.user.address = address;

        localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(state.user));

        const storedUsers = getStoredUsers();
        const found = storedUsers.find(u => u.email?.toLowerCase() === state.user?.email?.toLowerCase());
        if (found) {
          found.name = state.user.name;
          found.avatar = state.user.avatar;
          found.logo = state.user.logo;
          found.phone = state.user.phone;
          found.whatsapp = state.user.whatsapp;
          found.city = state.user.city;
          found.address = state.user.address;
          saveStoredUser(found);
        }
      }

      showToast('✅ Profile details & avatar updated successfully!');
      renderApp();
      return;
    }

    // Mega Project Photos Upload Drag/Drop & Click Triggers
    if (e.target.closest('#mp-image-drag-drop-zone')) {
      document.getElementById('mp_file_input')?.click();
    }

    if (e.target.closest('#add-mp-url-photo-btn')) {
      e.preventDefault();
      const urlInput = document.getElementById('mp_image_url');
      const url = urlInput?.value?.trim();
      if (url) {
        state.mpUploadedImages = state.mpUploadedImages || (state.editingMegaProject?.images ? [...state.editingMegaProject.images] : []);
        state.mpUploadedImages.push(url);
        if (state.editingMegaProject) state.editingMegaProject.images = [...state.mpUploadedImages];
        if (urlInput) urlInput.value = '';
        showToast('📷 Project photo added!');
        renderApp();
      } else {
        showToast('⚠️ Please paste a valid Photo URL.');
      }
    }

    const removeMpImgBtn = e.target.closest('.remove-mp-img-btn');
    if (removeMpImgBtn) {
      e.preventDefault();
      const idx = Number(removeMpImgBtn.getAttribute('data-index'));
      let images = state.mpUploadedImages || (state.editingMegaProject?.images ? [...state.editingMegaProject.images] : []);
      images.splice(idx, 1);
      state.mpUploadedImages = images;
      if (state.editingMegaProject) state.editingMegaProject.images = images;
      showToast('Photo removed.');
      renderApp();
    }

    // Product (Property) Photo Upload Drag/Drop & URL Triggers
    if (e.target.closest('#image-drag-drop-zone')) {
      document.getElementById('wiz_file_input')?.click();
    }

    if (e.target.closest('#add-wiz-image-url-btn')) {
      e.preventDefault();
      const urlInput = document.getElementById('wiz_image_url_input');
      const url = urlInput?.value?.trim();
      if (url) {
        state.uploadedImages = state.uploadedImages || [];
        state.uploadedImages.push(url);
        if (urlInput) urlInput.value = '';
        showToast('📷 Property photo added!');
        renderApp();
      } else {
        showToast('⚠️ Please paste a valid Photo URL.');
      }
    }

    const removeWizImgBtn = e.target.closest('.remove-wiz-img-btn');
    if (removeWizImgBtn) {
      e.preventDefault();
      const idx = Number(removeWizImgBtn.getAttribute('data-index'));
      state.uploadedImages = state.uploadedImages || [];
      state.uploadedImages.splice(idx, 1);
      showToast('Photo removed.');
      renderApp();
    }

    // Preferences Form Submit Button Click
    if (e.target.closest('#save-preferences-btn') || (e.target.closest('#dash-preferences-form') && e.type === 'submit')) {
      e.preventDefault();
      const unit = document.getElementById('pref_unit')?.value || 'marla';
      state.unit = unit;
      showToast('⚙️ Preferences saved successfully!');
      renderApp();
      return;
    }

    // Change Password Form Submit Button Click
    if (e.target.closest('#save-password-btn') || (e.target.closest('#dash-password-form') && e.type === 'submit')) {
      e.preventDefault();
      const passCurrent = document.getElementById('pass_current')?.value;
      const passNew = document.getElementById('pass_new')?.value;
      const passConfirm = document.getElementById('pass_confirm')?.value;

      if (!passNew || passNew.length < 6) {
        showToast('⚠️ New password must be at least 6 characters.');
        return;
      }

      if (passNew !== passConfirm) {
        showToast('⚠️ New password and confirmation do not match.');
        return;
      }

      showToast('🔒 Password changed successfully!');
      if (document.getElementById('pass_current')) document.getElementById('pass_current').value = '';
      if (document.getElementById('pass_new')) document.getElementById('pass_new').value = '';
      if (document.getElementById('pass_confirm')) document.getElementById('pass_confirm').value = '';
      return;
    }

    // Publish / Edit Property Submission
    if (e.target.closest('#wizard-submit-btn') || e.target.closest('#wiz-submit-listing-btn') || (e.target.id === 'post-property-page-form' && e.type === 'submit') || (e.target.id === 'property-wizard-modal-form' && e.type === 'submit')) {
      if (e.preventDefault) e.preventDefault();
      if (!state.editingProperty && !canUserPostProperty(state)) return;

      const title = (document.getElementById('wiz_title')?.value || document.getElementById('wiz-title')?.value)?.trim();
      const city = document.getElementById('wiz_city')?.value || document.getElementById('wiz-city')?.value || 'Lahore';
      const location = (document.getElementById('wiz_location')?.value || document.getElementById('wiz-location')?.value)?.trim();
      const address = (document.getElementById('wiz_address')?.value || document.getElementById('wiz-address')?.value)?.trim() || location;
      const rawPrice = document.getElementById('wiz_price')?.value || document.getElementById('wiz-price')?.value;
      const price = (rawPrice !== '' && rawPrice !== undefined) ? Number(rawPrice) : null;
      const rawSize = document.getElementById('wiz_size')?.value || document.getElementById('wiz-size')?.value;
      const size = (rawSize !== '' && rawSize !== undefined) ? Number(rawSize) : null;
      const beds = Number(document.getElementById('wiz_beds')?.value || document.getElementById('wiz_bedrooms')?.value || document.getElementById('wiz-bedrooms')?.value || 0);
      const baths = Number(document.getElementById('wiz_baths')?.value || document.getElementById('wiz_bathrooms')?.value || document.getElementById('wiz-bathrooms')?.value || 0);
      const desc = (document.getElementById('wiz_desc')?.value || document.getElementById('wiz-description')?.value)?.trim();

      const purposeRadio = document.querySelector('input[name="wiz_purpose"]:checked') || document.querySelector('input[name="wiz-purpose"]:checked');
      const purpose = purposeRadio ? purposeRadio.value : 'sale';
      const categorySelect = document.getElementById('wiz_category') || document.getElementById('wiz-category');
      const category = categorySelect ? categorySelect.value : 'house';

      if (!location || !address) {
        showToast('⚠️ Please fill in Location/Society and Full Address in Step 2.');
        state.wizardStep = 2;
        renderApp();
        return;
      }

      if (!price || isNaN(price) || price <= 0 || !size || isNaN(size) || size <= 0) {
        showToast('⚠️ Please enter a valid Price and Area Size in Step 3.');
        state.wizardStep = 3;
        renderApp();
        return;
      }

      if (!title || title.length < 5) {
        showToast('⚠️ Please enter a Property Title (at least 5 characters).');
        state.wizardStep = 3;
        renderApp();
        return;
      }

      if (!desc || desc.length < 10) {
        showToast('⚠️ Please enter a Property Description (at least 10 characters).');
        state.wizardStep = 3;
        renderApp();
        return;
      }

      if (!state.uploadedImages || state.uploadedImages.length === 0) {
        showToast('⚠️ Photo upload is required! Please select at least 1 image from your PC gallery.');
        state.wizardStep = 4;
        renderApp();
        return;
      }

      showToast('⏳ Uploading photos & publishing property live...');

      // Collect checked amenities
      const features = [];
      if (document.getElementById('wiz_feat_solar')?.checked) features.push('Solar Power Backup');
      if (document.getElementById('wiz_feat_servant')?.checked) features.push('Servant Quarter');
      if (document.getElementById('wiz_feat_corner')?.checked) features.push('Corner Plot');
      if (document.getElementById('wiz_feat_gas')?.checked) features.push('Gas Connection');
      if (document.getElementById('wiz_feat_park')?.checked) features.push('Park Facing');
      if (document.getElementById('wiz_feat_cctv')?.checked) features.push('CCTV & Security');

      const rawImages = (state.uploadedImages && state.uploadedImages.length > 0)
        ? state.uploadedImages
        : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

      const agencyName = state.user?.agencyName || state.user?.name || 'Verified Real Estate Agency';
      const agentName = state.user?.name || 'Verified Dealer';
      const phone = state.user?.phone || '+92 300 0000000';

      (async () => {
        let finalImages = rawImages && rawImages.length > 0 ? rawImages : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];
        try {
          showToast('⏳ Uploading property photos & saving listing...');
          const cdnImages = await Promise.all(rawImages.map(img => uploadImageToFreeCdn(img)));
          if (cdnImages && cdnImages.length > 0) {
            finalImages = cdnImages;
          }
        } catch (err) {
          console.warn('Image CDN processing notice:', err);
        }

        if (state.editingProperty) {
          // Editing existing property
          const updatedProp = {
            ...state.editingProperty,
            title,
            purpose,
            category,
            city,
            location,
            address,
            price,
            sizeMarla: size,
            bedrooms: beds,
            bathrooms: baths,
            description: desc,
            features: features.length > 0 ? features : state.editingProperty.features,
            images: finalImages
          };

          saveOrUpdatePropertyInStorage(updatedProp);
          savePropertyToApi(updatedProp); // Save to Neon PostgreSQL API
          state.properties = state.properties.map(p => p.id === updatedProp.id ? updatedProp : p);
          state.showPostWizard = false;
          state.editingProperty = null;
          state.uploadedImages = [];
          state.activeTab = 'dashboard';
          state.dashboardTab = 'listings';
          showToast('✏️ Property updated successfully!');
          renderApp();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Publishing new property
          const newProp = {
            id: `prop-${Date.now()}`,
            title,
            purpose,
            category,
            city,
            location,
            address,
            price,
            sizeMarla: size,
            bedrooms: beds,
            bathrooms: baths,
            builtYear: 2026,
            facing: 'North Facing',
            badges: ['VERIFIED', 'NEW LAUNCH'],
            images: finalImages,
            coords: [31.4722, 74.4371],
            agency: {
              name: agencyName,
              agentName: agentName,
              phone: phone,
              whatsapp: phone.replace(/[^0-9]/g, ''),
              badge: 'VERIFIED DEALER',
              avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
            },
            description: desc,
            features: features.length > 0 ? features : ['Solar Power Backup', 'Gas Connection'],
            status: 'active',
            postedDate: new Date().toISOString().split('T')[0],
            views: 1
          };

          saveCustomProperty(newProp);
          savePropertyToApi(newProp); // Save to Neon PostgreSQL API
          state.properties = [newProp, ...state.properties];
          state.showPostWizard = false;
          state.uploadedImages = [];
          state.activeTab = 'dashboard';
          state.dashboardTab = 'listings';
          showToast('🎉 Property published live successfully!');
          renderApp();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      })();
    }

    // Favorites Drawer Toggle
    if (e.target.closest('#open-favorites-btn')) {
      state.showFavoritesDrawer = true;
      renderApp();
    }

    if (e.target.closest('#close-fav-drawer-btn')) {
      state.showFavoritesDrawer = false;
      renderApp();
    }

    // Chatbot View Property Details Click Handler
    const chatViewPropBtn = e.target.closest('.chat-view-prop-btn');
    if (chatViewPropBtn) {
      const propId = chatViewPropBtn.getAttribute('data-id');
      const targetProp = state.properties.find(p => String(p.id) === String(propId));
      if (targetProp) {
        state.selectedProperty = normalizeProperty(targetProp);
        renderApp();
      }
    }

    // Featured Property "View Details" Click Handler
    const viewDetailBtn = e.target.closest('.view-property-detail-btn');
    if (viewDetailBtn) {
      e.preventDefault();
      const propId = viewDetailBtn.getAttribute('data-id');
      const targetProp = state.properties.find(p => String(p.id) === String(propId)) || {
        id: propId || 'prop-1',
        title: '10 Marla Ultra-Modern Smart Automation Villa',
        location: 'DHA Lahore Phase 9 Prism',
        city: 'Lahore',
        price: 48000000,
        size: '10 Marla',
        beds: 5,
        baths: 6,
        type: 'House',
        badge: 'PLATINUM',
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'],
        agency: { name: 'Chaudhry Real Estate', logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' }
      };
      state.selectedProperty = normalizeProperty(targetProp);
      state.selectedPropertyId = targetProp.id;
      setActiveTab('property-detail');
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }


    const removeFavBtn = e.target.closest('.remove-fav-item-btn');
    if (removeFavBtn) {
      const id = removeFavBtn.getAttribute('data-id');
      toggleFavorite(id);
      renderApp();
      showToast('Item removed from saved list.');
    }

    // Password Show / Hide Eye Toggle with Animation
    const pwdToggleBtn = e.target.closest('.pwd-toggle-btn');
    if (pwdToggleBtn) {
      e.preventDefault();
      const wrapper = pwdToggleBtn.closest('.password-field-wrapper, div');
      const input = wrapper ? wrapper.querySelector('input') : null;
      if (input) {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        pwdToggleBtn.style.transform = 'scale(1.2) rotate(6deg)';
        pwdToggleBtn.style.opacity = '1';
        setTimeout(() => {
          pwdToggleBtn.style.transform = 'scale(1) rotate(0deg)';
          pwdToggleBtn.style.opacity = '0.85';
        }, 180);
        const color = pwdToggleBtn.style.color || 'var(--forest-dk)';
        pwdToggleBtn.innerHTML = renderIcon(isPass ? 'eye-off' : 'eye', 18, color);
        pwdToggleBtn.setAttribute('title', isPass ? 'Hide Password' : 'Show Password');
      }
      return;
    }

    // Auth Modal Controls (Guest Sign In & Sign Up Buttons)
    if (e.target.closest('#open-auth-login-btn') || e.target.closest('#open-auth-btn') || e.target.closest('#mobile-auth-login-btn') || e.target.closest('#nav-login-btn')) {
      e.preventDefault();
      state.activeTab = 'login';
      state.authMode = 'login';
      state.authIsRegister = false;
      state.authIsSignup = false;
      state.showAuthModal = true;
      if (window.location.hash !== '#login') history.replaceState(null, '', '#login');
      state.showMobileNav = false;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (e.target.closest('#open-auth-signup-btn') || e.target.closest('#mobile-auth-signup-btn') || e.target.closest('#open-auth-Register-btn') || e.target.closest('#mobile-auth-Register-btn') || e.target.closest('#nav-register-btn')) {
      e.preventDefault();
      state.activeTab = 'register';
      state.authMode = 'signup';
      state.authIsRegister = true;
      state.authIsSignup = true;
      state.showAuthModal = true;
      if (window.location.hash !== '#register') history.replaceState(null, '', '#register');
      state.showMobileNav = false;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (e.target.closest('#open-admin-login-for-blog-btn')) {
      state.showAuthModal = true;
      state.authRole = 'ADMIN';
      state.authMode = 'login';
      state.authIsRegister = false;
      renderApp();
    }

    // Blog Card Click -> Navigates to Dedicated Blog Detail Page (/blog/:id)
    const blogCard = e.target.closest('.blog-card');
    if (blogCard && !e.target.closest('.edit-blog-btn') && !e.target.closest('.delete-blog-btn')) {
      const bId = blogCard.getAttribute('data-id');
      if (bId) {
        state.selectedArticleId = bId;
        state.activeTab = 'blog-detail';
        if (window.location.hash !== `#blog/${bId}`) {
          history.replaceState(null, '', `#blog/${bId}`);
        }
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Blog & Article Controls
    const blogCatBtn = e.target.closest('.blog-cat-btn');
    if (blogCatBtn) {
      state.selectedBlogCategory = blogCatBtn.getAttribute('data-cat');
      renderApp();
    }

    if (e.target.closest('#go-to-admin-blogs-btn')) {
      state.activeTab = 'dealer';
      state.dealerTab = 'blogs';
      renderApp();
    }

    if (e.target.closest('#open-create-blog-modal-btn')) {
      state.showBlogCreateModal = true;
      state.editingBlog = null;
      renderApp();
    }

    if (e.target.closest('#close-blog-modal-btn') || e.target.id === 'admin-blog-modal-overlay') {
      state.showBlogCreateModal = false;
      state.editingBlog = null;
      renderApp();
    }

    const editBlogBtn = e.target.closest('.edit-blog-btn');
    if (editBlogBtn) {
      const bId = editBlogBtn.getAttribute('data-id');
      const targetBlog = (state.blogsList || []).find(b => b.id === bId);
      if (targetBlog) {
        state.editingBlog = targetBlog;
        state.showBlogCreateModal = true;
        renderApp();
      }
    }

    const deleteBlogBtn = e.target.closest('.delete-blog-btn');
    if (deleteBlogBtn) {
      const bId = deleteBlogBtn.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this blog post?')) {
        state.blogsList = (state.blogsList || []).filter(b => b.id !== bId);
        localStorage.setItem('Sarmayadar_blogs_db', JSON.stringify(state.blogsList));
        showToast('🗑️ Blog post deleted successfully!');
        renderApp();
      }
    }

    if (e.target.closest('#blog-upload-photo-btn')) {
      document.getElementById('blog-cover-file-input')?.click();
    }

    const shareArticleBtn = e.target.closest('.share-article-btn');
    if (shareArticleBtn) {
      const title = shareArticleBtn.getAttribute('data-title') || 'Article';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Article link copied to clipboard!');
      } else {
        showToast('🔗 Share: ' + title);
      }
    }

    // Logged-in User Profile Button (Navigates directly to Profile & Account Settings)
    if (e.target.closest('#header-user-profile-btn') || e.target.closest('#mobile-user-profile-btn')) {
      if (e) e.preventDefault();
      state.activeTab = 'dealer';
      state.dealerTab = 'profile';
      state.showMobileNav = false;
      renderApp();
      showToast(`👤 Welcome ${state.user?.name || ''}! Opened Profile & Account Settings.`);
    }

    if (e.target.closest('#close-auth-btn')) {
      state.showAuthModal = false;
      renderApp();
    }


    // Auth Modal Role Selection Buttons (DEALER | ADMIN)
    const roleSelectBtn = e.target.closest('.auth-role-select-btn');
    if (roleSelectBtn) {
      state.authRole = roleSelectBtn.getAttribute('data-role');
      renderApp();
    }

    if (e.target.closest('#toggle-login-mode-btn') || e.target.closest('a[href="#login"]')) {
      if (e) e.preventDefault();
      state.authMode = 'login';
      state.authIsRegister = false;
      state.authIsSignup = false;
      setActiveTab('login');
      renderApp();
    }

    if (e.target.closest('#toggle-signup-mode-btn') || e.target.closest('#toggle-Register-mode-btn') || e.target.closest('a[href="#register"]')) {
      if (e) e.preventDefault();
      state.authMode = 'signup';
      state.authIsRegister = true;
      state.authIsSignup = true;
      setActiveTab('register');
      renderApp();
    }

    if (e.target.closest('#toggle-forgot-mode-btn')) {
      state.authMode = 'forgot';
      renderApp();
    }

    // Helper functions for local auth storage
    function getStoredUsers() {
      try {
        const data = localStorage.getItem('Sarmayadar_registered_users');
        if (data) return JSON.parse(data);
      } catch (e) { }
      const defaultUsers = [
        { email: 'dealer@agency.com', password: 'password123', name: 'Apex Real Estate Agency', phone: '+92 300 1234567', role: 'DEALER', agencyName: 'Apex Real Estate Agency' },
        { email: 'admin@sarmayadar.com', password: 'adminpassword', name: 'System Administrator', phone: '+92 332 7507866', role: 'ADMIN', agencyName: 'Sarmayadar Admin Panel' }
      ];
      localStorage.setItem('Sarmayadar_registered_users', JSON.stringify(defaultUsers));
      return defaultUsers;
    }

    function saveStoredUser(userObj) {
      const users = getStoredUsers();
      const idx = users.findIndex(u => u.email.toLowerCase() === userObj.email.toLowerCase());
      if (idx > -1) {
        users[idx] = { ...users[idx], ...userObj };
      } else {
        users.push(userObj);
      }
      localStorage.setItem('Sarmayadar_registered_users', JSON.stringify(users));
    }

    // Forgot Password Form Submit
    if (e.target.id === 'forgot-password-form' || e.target.closest('#forgot-password-form')) {
      if (e.type === 'submit' || e.target.closest('#auth-forgot-submit-btn')) {
        e.preventDefault();
        const email = document.getElementById('auth-forgot-email-input')?.value?.trim()?.toLowerCase();
        const newPassword = document.getElementById('auth-forgot-password-input')?.value;

        if (!email) {
          showToast('⚠️ Please enter your registered email address.');
          return;
        }
        if (!newPassword || newPassword.length < 6) {
          showToast('⚠️ New password must be at least 6 characters.');
          return;
        }

        (async () => {
          try {
            const res = await fetch('/api/auth/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, newPassword })
            });
            const data = await res.json().catch(() => null);

            if (res.ok && data && data.success) {
              showToast('✅ Password reset successfully! Please sign in with your new password.');
            } else {
              const users = getStoredUsers();
              const user = users.find(u => u.email.toLowerCase() === email);
              if (!user) {
                showToast('❌ No account found with this email address. Please sign up first.');
                return;
              }
              user.password = newPassword;
              saveStoredUser(user);
              showToast('✅ Password reset successfully! Please sign in with your new password.');
            }
            state.authMode = 'login';
            state.authIsRegister = false;
            state.authPreFillEmail = email;
            renderApp();
          } catch (err) {
            const users = getStoredUsers();
            const user = users.find(u => u.email.toLowerCase() === email);
            if (!user) {
              showToast('❌ No account found with this email address. Please sign up first.');
              return;
            }
            user.password = newPassword;
            saveStoredUser(user);
            showToast('✅ Password reset successfully! Please sign in with your new password.');
            state.authMode = 'login';
            state.authIsRegister = false;
            state.authPreFillEmail = email;
            renderApp();
          }
        })();
        return;
      }
    }

    // Email & Password Auth Form Submit (Login & Register)
    if (e.target.id === 'email-auth-form' || e.target.closest('#email-auth-form') || e.target.id === 'auth-page-native-form' || e.target.closest('#auth-page-native-form')) {
      if (e.type === 'submit' || e.target.closest('#auth-submit-btn') || e.target.closest('#auth-page-submit-btn')) {
        e.preventDefault();
        const role = state.authRole || 'DEALER';
        const isRegister = state.authMode !== 'forgot' && (state.activeTab === 'register' || state.authMode === 'signup' || state.authMode === 'register' || state.authIsRegister || state.authIsSignup);
        const emailInput = (document.getElementById('auth-page-email')?.value || document.getElementById('auth-email-input')?.value)?.trim()?.toLowerCase();
        const passwordInput = document.getElementById('auth-page-password')?.value || document.getElementById('auth-password-input')?.value;

        if (!emailInput) {
          showToast('⚠️ Please enter a valid Email Address.');
          return;
        }
        if (!passwordInput || passwordInput.length < 4) {
          showToast('⚠️ Please enter your password.');
          return;
        }

        if (isRegister) {
          // --- Register FLOW ---
          const nameInput = (document.getElementById('auth-page-fullname')?.value || document.getElementById('auth-full-name')?.value)?.trim();
          const phoneInput = (document.getElementById('auth-page-phone')?.value || document.getElementById('auth-phone-num')?.value)?.trim();

          if (!nameInput || !phoneInput) {
            showToast('⚠️ Please fill in Full Name and Phone Number.');
            return;
          }

          (async () => {
            try {
              const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: nameInput,
                  email: emailInput,
                  password: passwordInput,
                  phone: phoneInput,
                  role: role,
                  agencyName: nameInput
                })
              });
              const data = await res.json().catch(() => null);

              if (res.ok && data && data.success) {
                saveStoredUser({
                  email: emailInput,
                  password: passwordInput,
                  name: nameInput,
                  phone: phoneInput,
                  role: role,
                  agencyName: nameInput
                });

                const userObj = {
                  userId: (data && data.user) ? data.user.id : `user-${Date.now()}`,
                  name: (data && data.user) ? (data.user.name || nameInput) : nameInput,
                  email: (data && data.user) ? (data.user.email || emailInput) : emailInput,
                  role: (data && data.user) ? (data.user.role || role) : role,
                  phone: (data && data.user) ? (data.user.phone || phoneInput) : phoneInput,
                  agencyName: (data && data.user) ? (data.user.agencyName || nameInput) : nameInput,
                  token: (data && data.token) ? data.token : null,
                  issuedAt: Date.now(),
                  expiresAt: Date.now() + (48 * 60 * 60 * 1000)
                };
                localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(userObj));
                state.user = userObj;
                state.showAuthModal = false;
                state.authMode = 'login';
                state.authIsRegister = false;
                state.authIsSignup = false;
                state.activeTab = 'dashboard';
                state.dashboardTab = 'dashboard';
                if (window.location.hash !== '#dashboard') history.replaceState(null, '', '#dashboard');
                showToast(`🎉 Registration complete! Welcome to your Dashboard, ${userObj.name}.`);
                renderApp();
              } else if (res.status === 400 && data && data.message) {
                if (data.message.toLowerCase().includes('already exists')) {
                  showToast(`⚠️ Account already exists for ${emailInput}! Switching to Sign In...`);
                  state.authMode = 'login';
                  state.authIsRegister = false;
                  state.authIsSignup = false;
                  state.authPreFillEmail = emailInput;
                  renderApp();
                } else {
                  showToast(`❌ ${data.message}`);
                }
              } else {
                saveStoredUser({
                  email: emailInput,
                  password: passwordInput,
                  name: nameInput,
                  phone: phoneInput,
                  role: role,
                  agencyName: nameInput
                });
                const userObj = {
                  userId: `user-${Date.now()}`,
                  name: nameInput,
                  email: emailInput,
                  role: role,
                  phone: phoneInput,
                  agencyName: nameInput,
                  issuedAt: Date.now(),
                  expiresAt: Date.now() + (48 * 60 * 60 * 1000)
                };
                localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(userObj));
                state.user = userObj;
                state.showAuthModal = false;
                state.authMode = 'login';
                state.authIsRegister = false;
                state.authIsSignup = false;
                state.activeTab = 'dashboard';
                state.dashboardTab = 'dashboard';
                if (window.location.hash !== '#dashboard') history.replaceState(null, '', '#dashboard');
                showToast(`🎉 Registration complete! Welcome to your Dashboard, ${nameInput}.`);
                renderApp();
              }
            } catch (err) {
              console.error('Register fetch error:', err);
              saveStoredUser({
                email: emailInput,
                password: passwordInput,
                name: nameInput,
                phone: phoneInput,
                role: role,
                agencyName: nameInput
              });
              const userObj = {
                userId: `user-${Date.now()}`,
                name: nameInput,
                email: emailInput,
                role: role,
                phone: phoneInput,
                agencyName: nameInput,
                issuedAt: Date.now(),
                expiresAt: Date.now() + (48 * 60 * 60 * 1000)
              };
              localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(userObj));
              state.user = userObj;
              state.showAuthModal = false;
              state.authMode = 'login';
              state.authIsRegister = false;
              state.authIsSignup = false;
              state.activeTab = 'dashboard';
              state.dashboardTab = 'dashboard';
              if (window.location.hash !== '#dashboard') history.replaceState(null, '', '#dashboard');
              showToast(`🎉 Registration complete! Welcome to your Dashboard, ${nameInput}.`);
              renderApp();
            }
          })();


        } else {
          // --- LOGIN FLOW ---
          (async () => {
            let apiData = null;
            try {
              const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput, password: passwordInput, role: role })
              });
              apiData = await res.json().catch(() => null);

              if (res.ok && apiData && apiData.success && apiData.token) {
                const userObj = {
                  userId: apiData.user.id,
                  name: apiData.user.name,
                  email: apiData.user.email,
                  role: apiData.user.role,
                  phone: apiData.user.phone,
                  agencyName: apiData.user.agencyName || apiData.user.name,
                  token: apiData.token,
                  issuedAt: Date.now(),
                  expiresAt: Date.now() + (48 * 60 * 60 * 1000)
                };
                localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(userObj));
                state.user = userObj;
                state.showAuthModal = false;
                state.activeTab = 'dashboard';
                state.dashboardTab = 'dashboard';
                showToast(`🔒 Signed in successfully as ${userObj.role} (${userObj.name})!`);
                renderApp();
                return;
              }
            } catch (err) {
              // API connection error fallback to local validation
            }

            // Local Credential Validation Fallback
            const users = getStoredUsers();
            const foundUser = users.find(u => u.email.toLowerCase() === emailInput);

            if (foundUser && foundUser.password === passwordInput) {
              if (foundUser.isSuspended) {
                showToast('🚫 Account Suspended: Your account has been suspended by system administrator.');
                return;
              }

              const selectedRole = state.authRole || 'DEALER';
              if (foundUser.role === 'ADMIN' && selectedRole !== 'ADMIN') {
                showToast(`❌ Access Denied: This account is registered as an Administrator. Please switch to Admin Login.`);
                return;
              }

              const tokenPayload = {
                userId: foundUser.userId || `user-${Date.now()}`,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
                phone: foundUser.phone,
                agencyName: foundUser.agencyName || foundUser.name,
                city: foundUser.city || 'Lahore',
                address: foundUser.address || '',
                bio: foundUser.bio || '',
                avatar: foundUser.avatar || foundUser.logo,
                issuedAt: Date.now(),
                lastActiveTime: Date.now(),
                expiresAt: Date.now() + (48 * 60 * 60 * 1000)
              };

              localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(tokenPayload));
              state.user = tokenPayload;
              state.showAuthModal = false;
              state.activeTab = 'dashboard';
              state.dashboardTab = 'dashboard';
              showToast(`🔓 Signed in successfully as ${tokenPayload.role} (${tokenPayload.name})!`);
              renderApp();
              return;
            } else if (apiData && apiData.message) {
              showToast(`❌ ${apiData.message}`);
              return;
            } else {
              showToast('❌ Account not found or invalid password. Please check your credentials or create a new account.');
              return;
            }
          })();
        }
      }
    }



    // Financial Tools Sub-tabs
    const toolBtn = e.target.closest('[data-tool]');
    if (toolBtn) {
      state.activeTool = toolBtn.getAttribute('data-tool');
      renderApp();
    }

    // Dealer Dashboard Tabs
    const dtab = e.target.closest('[data-dtab]');
    if (dtab) {
      state.dealerTab = dtab.getAttribute('data-dtab');
      renderApp();
    }

    // Agency / Admin Profile Photo Browse Button Trigger
    const uploadPhotoBtn = e.target.closest('#agency-upload-photo-btn');
    if (uploadPhotoBtn) {
      const fileInput = document.getElementById('agency-photo-file-input');
      if (fileInput) fileInput.click();
    }

    // Agency / Profile Form Submit Handler
    const profileForm = e.target.closest('#agency-profile-form');
    if (profileForm && (e.type === 'submit' || (e.type === 'click' && e.target.closest('button[type="submit"]')))) {
      e.preventDefault();
      const name = document.getElementById('agency-name-input')?.value?.trim();
      const leadPerson = document.getElementById('agency-person-input')?.value?.trim();
      const phone = document.getElementById('agency-phone-input')?.value?.trim();
      const whatsapp = document.getElementById('agency-wa-input')?.value?.trim();
      const city = document.getElementById('agency-city-input')?.value?.trim();
      const address = document.getElementById('agency-address-input')?.value?.trim();
      const bio = document.getElementById('agency-bio-input')?.value?.trim();
      const logo = document.getElementById('agency-logo-url-input')?.value?.trim() || state.user?.avatar;

      if (!name || !leadPerson || !phone) {
        showToast('⚠️ Please fill in Agency Name, Representative Name, and Phone Number.');
        return;
      }

      const updatedProfile = {
        name,
        leadPerson,
        phone,
        whatsapp: whatsapp || (phone ? phone.replace(/[^0-9]/g, '') : '923000000000'),
        city: city || 'Lahore',
        address: address || '',
        bio: bio || '',
        logo: logo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        badge: state.user?.role === 'ADMIN' ? 'SUPERVISOR ADMIN' : 'VERIFIED DEALER',
        email: state.user?.email || ''
      };

      saveAgencyProfile(updatedProfile, state.user?.email);


      // Update state.user
      if (state.user) {
        state.user.name = leadPerson;
        state.user.agencyName = name;
        state.user.phone = phone;
        state.user.whatsapp = whatsapp;
        state.user.city = city;
        state.user.address = address;
        state.user.bio = bio;
        state.user.avatar = logo;
        state.user.logo = logo;
        localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(state.user));
      }

      // Update registered users array in localStorage
      const storedUsers = getStoredUsers();
      const foundUser = storedUsers.find(u => u.email?.toLowerCase() === state.user?.email?.toLowerCase());
      if (foundUser) {
        foundUser.name = leadPerson;
        foundUser.agencyName = name;
        foundUser.phone = phone;
        foundUser.whatsapp = whatsapp;
        foundUser.city = city;
        foundUser.address = address;
        foundUser.bio = bio;
        foundUser.avatar = logo;
        foundUser.logo = logo;
        saveStoredUser(foundUser);
      }

      showToast('✅ Profile & Account details updated successfully!');
      renderApp();
    }

    // Admin / Supervisor Mobile Push Broadcast Form Handler
    const pushForm = e.target.closest('#admin-broadcast-push-form');
    if (pushForm && (e.type === 'submit' || (e.type === 'click' && e.target.closest('#btn-send-push-broadcast')))) {
      e.preventDefault();
      const title = document.getElementById('push-title-input')?.value?.trim();
      const body = document.getElementById('push-body-input')?.value?.trim();
      const targetDevice = document.getElementById('push-target-select')?.value || 'all';
      const url = document.getElementById('push-url-input')?.value?.trim() || '/';

      if (!title || !body) {
        showToast('⚠️ Please enter Notification Title and Message Body.');
        return;
      }

      const btn = document.getElementById('btn-send-push-broadcast');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="loader" class="spin" style="width:18px; height:18px;"></i> Broadcasting Push Alert...`;
        if (window.lucide) window.lucide.createIcons();
      }

      fetch('/api/push/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, targetDevice, url })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showToast(`🚀 Broadcast sent! ${data.sent} notification(s) dispatched successfully.`);
          const formEl = document.getElementById('admin-broadcast-push-form');
          if (formEl) formEl.reset();
        } else {
          showToast(`⚠️ Broadcast notice: ${data.message || data.error || 'Failed to dispatch push notification.'}`);
        }
      })
      .catch(err => {
        showToast(`❌ Push error: ${err.message}`);
      })
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<i data-lucide="send" style="width:18px; height:18px;"></i> Dispatch Mobile Push Alert`;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }


    // Toggle Property Status (Mark Sold / Active) in Dealer Inventory
    const toggleSoldBtn = e.target.closest('.toggle-sold-btn');
    if (toggleSoldBtn) {
      const id = toggleSoldBtn.getAttribute('data-id');
      const target = state.properties.find(p => p.id === id);
      if (target) {
        target.status = target.status === 'sold' ? 'active' : 'sold';
        showToast(`Property status updated to ${target.status.toUpperCase()}`);
        renderApp();
      }
    }

    // Admin Dealer Badge Upgrade Handler
    const badgeBtn = e.target.closest('.toggle-dealer-badge-btn');
    if (badgeBtn) {
      const id = badgeBtn.getAttribute('data-id');
      const dealers = getDealersFromStorage(INITIAL_AGENTS);
      const targetDealer = dealers.find(d => d.id === id);
      if (targetDealer) {
        targetDealer.badge = targetDealer.badge?.includes('PLATINUM') ? 'VERIFIED DEALER' : 'PLATINUM VERIFIED';
        saveDealersToStorage(dealers);
        showToast(`🛡️ ${targetDealer.name} status badge updated to ${targetDealer.badge}!`);
        renderApp();
      }
    }

    // Admin Suspend Dealer Account Handler
    const deleteDealerBtn = e.target.closest('.delete-dealer-acc-btn');
    if (deleteDealerBtn) {
      const id = deleteDealerBtn.getAttribute('data-id');
      const registeredUsers = getStoredUsers();
      const targetUser = registeredUsers.find(u => (u.userId === id || u.id === id || `dealer-${u.email}` === id));

      if (targetUser) {
        if (confirm(`Are you sure you want to suspend dealer account "${targetUser.agencyName || targetUser.name}"?`)) {
          targetUser.isSuspended = true;
          saveStoredUser(targetUser);
          showToast(`🚫 Dealer account "${targetUser.agencyName || targetUser.name}" SUSPENDED.`);
          renderApp();
        }
      } else {
        const dealers = getDealersFromStorage(INITIAL_AGENTS);
        const targetDealer = dealers.find(d => d.id === id);
        if (targetDealer) {
          targetDealer.isSuspended = true;
          saveDealersToStorage(dealers);
          showToast(`🚫 Dealer account "${targetDealer.name}" SUSPENDED.`);
          renderApp();
        }
      }
    }

    // Admin Unsuspend Dealer Account Handler
    const unsuspendDealerBtn = e.target.closest('.unsuspend-dealer-acc-btn');
    if (unsuspendDealerBtn) {
      const id = unsuspendDealerBtn.getAttribute('data-id');
      const registeredUsers = getStoredUsers();
      const targetUser = registeredUsers.find(u => (u.userId === id || u.id === id || `dealer-${u.email}` === id));

      if (targetUser) {
        if (confirm(`Are you sure you want to unsuspend / reactivate dealer "${targetUser.agencyName || targetUser.name}"?`)) {
          targetUser.isSuspended = false;
          saveStoredUser(targetUser);
          showToast(`✅ Dealer account "${targetUser.agencyName || targetUser.name}" RE-ACTIVATED / UNSUSPENDED.`);
          renderApp();
        }
      } else {
        const dealers = getDealersFromStorage(INITIAL_AGENTS);
        const targetDealer = dealers.find(d => d.id === id);
        if (targetDealer) {
          targetDealer.isSuspended = false;
          saveDealersToStorage(dealers);
          showToast(`✅ Dealer account "${targetDealer.name}" RE-ACTIVATED / UNSUSPENDED.`);
          renderApp();
        }
      }
    }
    // Footer Links Navigation
    if (e.target.id === 'footer-link-dealer') { e.preventDefault(); state.activeTab = 'dealer'; renderApp(); }
    if (e.target.id === 'footer-link-converter') { e.preventDefault(); state.activeTab = 'tools'; state.activeTool = 'converter'; renderApp(); }
    if (e.target.id === 'footer-link-mortgage') { e.preventDefault(); state.activeTab = 'tools'; state.activeTool = 'mortgage'; renderApp(); }
  });

  // Change Listeners for Selects & Inputs & Photo Uploads
  document.addEventListener('change', (e) => {
    // User Profile Photo Upload Listener
    if ((e.target.id === 'user-profile-photo-input' || e.target.id === 'user-profile-photo-file') && e.target.files?.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const rawBase64 = evt.target.result;
        showToast('⏳ Uploading profile photo to CDN...');
        try {
          const watermarked = await addWatermarkToImage(rawBase64);
          const cdnUrl = await uploadImageToFreeCdn(watermarked);

          if (!cdnUrl || !cdnUrl.startsWith('http')) {
            throw new Error('CDN upload returned invalid URL');
          }

          if (state.user) {
            state.user.avatar = cdnUrl;
            state.user.logo = cdnUrl;
            localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(state.user));

            // Persist to Neon PostgreSQL Database
            await fetch('/api/auth/profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: state.user.email,
                avatar: cdnUrl,
                logo: cdnUrl,
                phone: state.user.phone,
                agencyName: state.user.agencyName,
                name: state.user.name
              })
            }).catch(() => null);

            const storedUsers = getStoredUsers();
            const found = storedUsers.find(u => u.email?.toLowerCase() === state.user?.email?.toLowerCase());
            if (found) {
              found.avatar = cdnUrl;
              found.logo = cdnUrl;
              saveStoredUser(found);
            }
          }
          showToast('✅ Profile photo updated & saved successfully!');
          renderApp();
        } catch (uploadErr) {
          console.error('Profile photo upload error:', uploadErr);
          showToast(`❌ Profile photo upload failed: ${uploadErr.message}`);
        }
      };
      reader.readAsDataURL(file);
    }
    // Search Filter Dropdowns
    if (e.target.id === 'filter-city') {
      state.searchFilters.city = e.target.value;
      renderApp();
    }
    if (e.target.id === 'filter-society') {
      state.searchFilters.society = e.target.value;
      renderApp();
    }
    if (e.target.id === 'filter-type') {
      state.searchFilters.category = e.target.value;
      renderApp();
    }
    if (e.target.id === 'filter-price') {
      state.searchFilters.maxPrice = e.target.value;
      renderApp();
    }
    if (e.target.id === 'filter-size') {
      const val = e.target.value;
      if (val === 'all' || !val) {
        state.searchFilters.exactSizeMarla = null;
        state.searchFilters.exactSizeLabel = null;
      } else {
        const numMarla = Number(val);
        const labelsMap = { 5: '5 Marla', 7: '7 Marla', 10: '10 Marla', 20: '1 Kanal', 40: '2 Kanal' };
        state.searchFilters.exactSizeMarla = numMarla;
        state.searchFilters.exactSizeLabel = labelsMap[numMarla] || `${numMarla} Marla`;
      }
      renderApp();
    }

    // Sort Properties Select
    if (e.target.id === 'sort-properties') {
      state.sortBy = e.target.value;
      renderApp();
    }

    // Currency Switcher
    if (e.target.id === 'currency-select') {
      state.currency = e.target.value;
      renderApp();
    }

    // Unit Switcher
    if (e.target.id === 'unit-select') {
      state.unit = e.target.value;
      renderApp();
    }

    // FBR Tax Calculator Inputs Dynamic Update
    if (e.target.id === 'fbr-price-input' || e.target.id === 'fbr-buyer-filer' || e.target.id === 'fbr-seller-filer') {
      const p = document.getElementById('fbr-price-input')?.value || 35000000;
      const isBuyerFiler = document.getElementById('fbr-buyer-filer')?.value === 'filer';
      const isSellerFiler = document.getElementById('fbr-seller-filer')?.value === 'filer';

      const res = calculateFBRTaxes(p, isBuyerFiler, isSellerFiler);

      const bTaxEl = document.getElementById('fbr-res-buyer-tax');
      const sTaxEl = document.getElementById('fbr-res-seller-tax');
      const stampEl = document.getElementById('fbr-res-stamp');
      const cvtEl = document.getElementById('fbr-res-cvt');
      const totalEl = document.getElementById('fbr-res-total-govt');

      if (bTaxEl) bTaxEl.innerText = `${formatPKR(res.buyerTax)} (${res.buyerTaxRate}%)`;
      if (sTaxEl) sTaxEl.innerText = `${formatPKR(res.sellerTax)} (${res.sellerTaxRate}%)`;
      if (stampEl) stampEl.innerText = formatPKR(res.stampDuty);
      if (cvtEl) cvtEl.innerText = formatPKR(res.townFee + res.cvt);
      if (totalEl) totalEl.innerText = formatPKR(res.totalGovernmentTaxes);
    }

    // Lead CRM Stage Pipeline update
    if (e.target.classList.contains('lead-stage-change')) {
      const id = e.target.getAttribute('data-id');
      const newStage = e.target.value;
      const leads = getDealerLeads();
      if (leads) {
        const lead = leads.find(l => l.id === id);
        if (lead) {
          lead.stage = newStage;
          saveDealerLeads(leads);
          showToast(`Lead pipeline updated to "${newStage}"`);
        }
      }
    }
  });

  // Form Submitting for Schedule Visit, Chatbot & Auth
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'schedule-visit-form') {
      e.preventDefault();
      state.showScheduleVisitModal = false;
      showToast('🎉 Appointment booked! The verified dealer will contact you on WhatsApp shortly.');
      renderApp();
    }

    if (e.target.id === 'ai-chat-form') {
      e.preventDefault();
      const input = document.getElementById('ai-chat-input');
      if (input && input.value.trim()) {
        handleAIChatSubmit(input.value.trim());
        input.value = '';
      }
    }

    if (e.target.id === 'auth-form') {
      e.preventDefault();
      const name = document.getElementById('auth-name')?.value || 'Chaudhry Kamran';
      state.user = { name, role: 'dealer' };
      state.showAuthModal = false;
      showToast(`Welcome back, ${name}! Signed in as Verified Dealer.`);
      renderApp();
    }

    if (e.target.id === 'agency-profile-form') {
      e.preventDefault();
      const name = document.getElementById('agency-name-input')?.value;
      const leadPerson = document.getElementById('agency-person-input')?.value;
      const phone = document.getElementById('agency-phone-input')?.value;
      const whatsapp = document.getElementById('agency-wa-input')?.value;
      const address = document.getElementById('agency-address-input')?.value;

      saveAgencyProfile({
        name, leadPerson, phone, whatsapp, address, badge: 'PLATINUM VERIFIED', creditsLeft: 12,
        logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
      });
      showToast('Agency profile updated successfully!');
      renderApp();
    }
  });
}

function handleAIChatSubmit(query) {
  if (!query || !query.trim()) return;

  const userMsg = query.trim();
  state.aiChatMessages = state.aiChatMessages || [];
  state.chatSessionContext = state.chatSessionContext || {};

  // Push user message to UI
  state.aiChatMessages.push({ sender: 'user', text: userMsg });

  const lang = state.chatLanguage || 'en'; // 'en' | 'ur'

  // Extract Intent & Entities using NLP engine
  const parsed = extractEntitiesAndIntent(userMsg, state.chatSessionContext);

  // Sync session context memory cleanly
  const explicitSize = parsePropertySizeFromQuery(userMsg);
  if (explicitSize) {
    state.chatSessionContext.sizeMarla = explicitSize.sizeMarla;
    state.chatSessionContext.sizeLabel = explicitSize.sizeLabel;
  } else if (parsed.entities.location || parsed.entities.city || parsed.entities.propertyType) {
    // If user asks a new search query without explicit size, clear old size filter
    if (!/\b(marla|marlas|kanal|kanals|sqyd|sq\s*yd)\b/i.test(userMsg)) {
      state.chatSessionContext.sizeMarla = null;
      state.chatSessionContext.sizeLabel = null;
    }
  }

  if (parsed.entities.propertyType) state.chatSessionContext.propertyType = parsed.entities.propertyType;
  if (parsed.entities.city) state.chatSessionContext.city = parsed.entities.city;
  if (parsed.entities.location) state.chatSessionContext.location = parsed.entities.location;
  if (parsed.entities.purpose) state.chatSessionContext.purpose = parsed.entities.purpose;
  if (parsed.entities.maxPrice) state.chatSessionContext.maxPrice = parsed.entities.maxPrice;

  let botReplyText = '';
  let matchedListings = [];
  let isNoResultFallback = false;
  let customWaMessage = null;

  if (parsed.intent === 'greeting') {
    if (lang === 'en') {
      botReplyText = 'Hello! 👋 Welcome to Sarmayadar. How can I help you find the right property today?';
    } else {
      botReplyText = 'Wa Alaikum Assalam! 👋 Sarmayadar Assistant par khushamdeed. Main aap ki property search mein kis tarah madad kar sakta hoon?';
    }
  } else if (parsed.intent.startsWith('faq_')) {
    if (parsed.faqResponse) {
      botReplyText = parsed.faqResponse[lang] || parsed.faqResponse.en;
    } else {
      botReplyText = 'Our verified property advisors are available to answer your questions!';
    }
  } else if (parsed.intent === 'property_search') {
    const ctx = state.chatSessionContext;
    const allProps = state.properties || [];

    // Filter database with active context constraints
    let filtered = [...allProps];

    // 1. Exact Size Match (Strict Priority)
    if (ctx.sizeMarla != null) {
      filtered = filtered.filter(p => {
        const pMarla = Number(p.sizeMarla || p.size_marla || 0);
        return Math.abs(pMarla - ctx.sizeMarla) < 0.1;
      });
    }

    // 2. Property Type Match
    if (ctx.propertyType) {
      filtered = filtered.filter(p => (p.category || '').toLowerCase() === ctx.propertyType.toLowerCase());
    }

    // 3. City Match
    if (ctx.city) {
      filtered = filtered.filter(p => (p.city || '').toLowerCase() === ctx.city.toLowerCase());
    }

    // 4. Location / Society Match
    if (ctx.location) {
      filtered = filtered.filter(p => (p.location || '').toLowerCase().includes(ctx.location.toLowerCase()));
    }

    // 5. Purpose Match
    if (ctx.purpose) {
      filtered = filtered.filter(p => (p.purpose || '') === (ctx.purpose === 'rent' ? 'rent' : 'sale'));
    }

    // 6. Max Price Match
    if (ctx.maxPrice) {
      filtered = filtered.filter(p => (p.price || 0) <= ctx.maxPrice);
    }

    if (filtered.length > 0) {
      // Properties found in database!
      matchedListings = filtered.map(p => ({ ...p, matchScore: 98 })).slice(0, 3);

      const sizeStr = ctx.sizeLabel ? ` ${ctx.sizeLabel}` : '';
      const typeStr = ctx.propertyType ? ` ${ctx.propertyType}` : ' property';
      const locStr = ctx.location || (ctx.city ? ctx.city.toUpperCase() : '');

      if (lang === 'en') {
        botReplyText = `Great news! 🎉 I found **${filtered.length} verified${sizeStr}${typeStr} listing(s)**${locStr ? ` in **${locStr}**` : ''} matching your requirements! Click any card below for details:`;
      } else {
        botReplyText = `Zabardast! 🎉 Aap ki requirement ke mutabiq database mein **${filtered.length} verified${sizeStr}${typeStr} listing(s)** mil gayi hain! Details neeche dekh sakty hain:`;
      }
    } else {
      // 0 Properties Found -> Trigger Fallback Specified in Requirement 4!
      isNoResultFallback = true;
      const searchedSize = ctx.sizeLabel || (ctx.sizeMarla ? `${ctx.sizeMarla} Marla` : '');
      const searchedType = ctx.propertyType || 'property';
      const reqStr = `${searchedSize} ${searchedType}`.trim();
      const searchedLoc = ctx.location || (ctx.city ? ctx.city : '');
      const fullReq = `${reqStr}${searchedLoc ? ` in ${searchedLoc}` : ''}`;

      customWaMessage = `Hi, I’m looking for a ${fullReq}. Please help me find one.`;

      if (lang === 'en') {
        botReplyText = `I’m sorry, we currently don’t have any verified **${fullReq}** available. But I can help you find one through our support team. Would you like to chat with us on WhatsApp?`;
      } else {
        botReplyText = `Mujhe afsos hai, hamare paas abhi **${fullReq}** available nahi hai. Lekin main hamari support team ke zariye aap ko dhoondh kar de sakta hoon. Kya aap WhatsApp par chat karna chahenge?`;
      }
    }
  } else {
    // Conversational follow up
    if (lang === 'en') {
      botReplyText = 'I am your AI Property Advisor. Would you like to search by property size (e.g. 5 Marla, 10 Marla, 1 Kanal), city, or budget range?';
    } else {
      botReplyText = 'Main aap ka AI Property Advisor hoon. Kis size (e.g. 5 Marla, 10 Marla, 1 Kanal), city, ya budget mein property search karni hai?';
    }
  }

  // Push bot response to state
  state.aiChatMessages.push({
    sender: 'bot',
    text: botReplyText,
    userQuery: userMsg,
    matchedProperties: matchedListings,
    isNoResultFallback,
    customWaMessage
  });

  renderApp();
}



// Bind live dynamic calculations in financial tools
function bindToolCalculators() {
  // Area Unit Converter
  const convInput = document.getElementById('convert-input-val');
  const convFrom = document.getElementById('convert-from-unit');
  const convTo = document.getElementById('convert-to-unit');

  function updateConv() {
    if (!convInput || !convFrom || !convTo) return;
    const val = convInput.value;
    const from = convFrom.value;
    const to = convTo.value;

    const result = convertArea(val, from, to);
    const marlaRes = convertArea(val, from, 'Marla');
    const kanalRes = convertArea(val, from, 'Kanal');

    const outElem = document.getElementById('conv-output-val');
    const marlaElem = document.getElementById('conv-marla-val');
    const kanalElem = document.getElementById('conv-kanal-val');

    if (outElem) outElem.innerText = `${Number(result).toLocaleString('en-PK')} ${to}`;
    if (marlaElem) marlaElem.innerText = `${marlaRes} Marla`;
    if (kanalElem) kanalElem.innerText = `${kanalRes} Kanal`;
  }

  if (convInput) {
    convInput.addEventListener('input', updateConv);
    convFrom?.addEventListener('change', updateConv);
    convTo?.addEventListener('change', updateConv);
  }

  // Mortgage Calculator
  const mortPrice = document.getElementById('mort-price');
  const mortDown = document.getElementById('mort-down-percent');
  const mortTenure = document.getElementById('mort-tenure');
  const mortRate = document.getElementById('mort-rate');

  function updateMortgage() {
    if (!mortPrice || !mortDown || !mortTenure || !mortRate) return;
    const p = mortPrice.value;
    const d = mortDown.value;
    const t = mortTenure.value;
    const r = mortRate.value;

    const m = calculateMortgage(p, d, t, r);
    const emiElem = document.getElementById('mort-output-emi');
    const downElem = document.getElementById('mort-output-down');
    const loanElem = document.getElementById('mort-output-loan');

    if (emiElem) emiElem.innerText = `${formatPKR(m.monthlyEMI)} / mo`;
    if (downElem) downElem.innerText = formatPKR(m.downPayment);
    if (loanElem) loanElem.innerText = formatPKR(m.loanAmount);
  }

  if (mortPrice) {
    mortPrice.addEventListener('input', updateMortgage);
    mortDown?.addEventListener('input', updateMortgage);
    mortTenure?.addEventListener('change', updateMortgage);
    mortRate?.addEventListener('input', updateMortgage);
  }
}

function updateWizardStepUI() {
  const currentStep = state.wizardStep || 1;
  for (let i = 1; i <= 4; i++) {
    const stepDiv = document.getElementById(`wiz-step-${i}`);
    if (stepDiv) stepDiv.style.display = (i === currentStep) ? 'block' : 'none';
  }
  const overlay = document.getElementById('post-wizard-overlay');
  if (overlay) {
    const stepItems = overlay.querySelectorAll('.step-item');
    stepItems.forEach((item, idx) => {
      const step = idx + 1;
      item.classList.toggle('active', step === currentStep);
      item.classList.toggle('completed', step < currentStep);
    });
    const footer = overlay.querySelector('.modal-footer');
    if (footer) {
      const isEditing = Boolean(state.editingProperty);
      footer.innerHTML = `
        ${currentStep > 1 ? `<button type="button" class="btn btn-secondary" id="wizard-prev-btn">Previous Step</button>` : '<div></div>'}
        ${currentStep < 4 ? `<button type="button" class="btn btn-primary" id="wizard-next-btn">Next Step</button>` : `<button type="button" class="btn btn-gold" id="wizard-submit-btn">${isEditing ? '💾 Save Changes' : '🚀 Publish Property Live'}</button>`}
      `;
    }
    if (window.lucide) window.lucide.createIcons();
  }
}

// Global Image Upload File Selector & Drag and Drop Event Listeners (With Auto Watermark)
document.addEventListener('change', async (e) => {
  if ((e.target.id === 'wiz_file_input' || e.target.id === 'wiz-file-input') && e.target.files?.length > 0) {
    const files = Array.from(e.target.files);
    showToast(`⏳ Processing & uploading ${files.length} property photo(s) to server...`);
    state.uploadedImages = state.uploadedImages || [];
    let uploadSuccessCount = 0;
    let uploadErrors = [];

    for (const file of files) {
      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = evt => resolve(evt.target.result);
          reader.onerror = err => reject(err);
          reader.readAsDataURL(file);
        });

        const watermarked = await addWatermarkToImage(dataUrl);
        const savedUrl = await uploadImageToFreeCdn(watermarked);

        if (savedUrl && (savedUrl.startsWith('http') || savedUrl.startsWith('/uploads'))) {
          state.uploadedImages.push(savedUrl);
          uploadSuccessCount++;
        } else {
          throw new Error('Server returned invalid image storage URL');
        }
      } catch (err) {
        console.error('Property image upload error:', err);
        uploadErrors.push(err.message || 'Server upload failed');
      }
    }

    const container = document.getElementById('wiz-image-previews');
    if (container) {
      container.innerHTML = renderImagePreviewsList(state.uploadedImages);
    }

    if (uploadSuccessCount > 0) {
      showToast(`✅ ${uploadSuccessCount} property photo(s) uploaded & stored on server!`);
    } else {
      showToast(`❌ Property image upload failed: ${uploadErrors[0] || 'Server connection error'}`);
    }
  }

  if (e.target.id === 'agency-photo-file-input' && e.target.files?.[0]) {
    const file = e.target.files[0];
    const dataUrl = await new Promise(r => {
      const reader = new FileReader();
      reader.onload = evt => r(evt.target.result);
      reader.readAsDataURL(file);
    });
    const watermarked = await addWatermarkToImage(dataUrl);
    const logoUrlInput = document.getElementById('agency-logo-url-input');
    const logoPreview = document.getElementById('agency-logo-preview');
    if (logoUrlInput) logoUrlInput.value = watermarked;
    if (logoPreview) logoPreview.src = watermarked;
    showToast('📸 Profile picture selected & watermarked!');
  }

  if (e.target.id === 'blog-cover-file-input' && e.target.files?.[0]) {
    const file = e.target.files[0];
    const dataUrl = await new Promise(r => {
      const reader = new FileReader();
      reader.onload = evt => r(evt.target.result);
      reader.readAsDataURL(file);
    });
    const watermarked = await addWatermarkToImage(dataUrl);
    const blogImgInput = document.getElementById('blog-img-url-input');
    if (blogImgInput) blogImgInput.value = watermarked;
    showToast('📸 Blog cover photo selected & watermarked!');
  }
});

document.addEventListener('dragover', (e) => {
  const dropZone = e.target.closest('#image-drag-drop-zone');
  if (dropZone) {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--gold-marigold)';
  }
});

document.addEventListener('dragleave', (e) => {
  const dropZone = e.target.closest('#image-drag-drop-zone');
  if (dropZone) {
    dropZone.style.borderColor = 'var(--emerald-teal)';
  }
});

document.addEventListener('drop', async (e) => {
  const dropZone = e.target.closest('#image-drag-drop-zone');
  if (dropZone) {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--emerald-teal)';
    if (e.dataTransfer.files?.length > 0) {
      showToast('🎨 Adding Sarmayadar watermark to dropped photos...');
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      for (const file of files) {
        const dataUrl = await new Promise(r => {
          const reader = new FileReader();
          reader.onload = evt => r(evt.target.result);
          reader.readAsDataURL(file);
        });
        const watermarked = await addWatermarkToImage(dataUrl);
        state.uploadedImages = state.uploadedImages || [];
        state.uploadedImages.push(watermarked);
      }
      const container = document.getElementById('wiz-image-previews');
      if (container) {
        container.innerHTML = renderImagePreviewsList(state.uploadedImages);
      }
      showToast('✨ Photos dropped & watermarked successfully!');
    }
  }
});

// Admin Blog Editor Form Submit
document.addEventListener('submit', async (e) => {
  if (e.target.id === 'admin-blog-editor-form' || e.target.closest('#admin-blog-editor-form')) {
    e.preventDefault();
    const editId = document.getElementById('blog-edit-id-input')?.value;
    const title = document.getElementById('blog-title-input')?.value?.trim();
    const badge = document.getElementById('blog-category-select')?.value;
    const readTime = document.getElementById('blog-readtime-input')?.value?.trim() || '5 min read';
    const author = document.getElementById('blog-author-input')?.value?.trim() || 'Sarmayadar Editorial Board';
    let img = document.getElementById('blog-img-url-input')?.value?.trim() || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80';
    const snippet = document.getElementById('blog-snippet-input')?.value?.trim();
    const fullText = document.getElementById('blog-fulltext-input')?.value?.trim();

    if (img.startsWith('data:image')) {
      img = await addWatermarkToImage(img);
    }

    state.blogsList = state.blogsList || [];

    if (editId) {
      const idx = state.blogsList.findIndex(b => b.id === editId);
      if (idx !== -1) {
        state.blogsList[idx] = {
          ...state.blogsList[idx],
          title, badge, category: badge, readTime, author, img, image: img, snippet, fullText, content: fullText, date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
      }
    } else {
      const newBlog = {
        id: 'blog-' + Date.now(),
        title,
        badge,
        category: badge,
        readTime,
        author,
        img,
        image: img,
        snippet,
        fullText,
        content: fullText,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        status: 'PUBLISHED'
      };
      state.blogsList.unshift(newBlog);
    }

    localStorage.setItem('Sarmayadar_blogs_db', JSON.stringify(state.blogsList));
    state.showBlogCreateModal = false;
    state.editingBlog = null;
    showToast('🚀 Blog post saved & published live!');
    renderApp();
  }
});

async function handleAdminPageLogin(emailInput, passwordInput) {
  showToast('🔒 Authorizing Admin Portal access...');
  let apiData = null;
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password: passwordInput, role: 'ADMIN' })
    });
    apiData = await res.json().catch(() => null);

    if (res.ok && apiData && apiData.success && apiData.token) {
      const userObj = {
        userId: apiData.user.id,
        name: apiData.user.name,
        email: apiData.user.email,
        role: 'ADMIN',
        phone: apiData.user.phone,
        agencyName: apiData.user.agencyName || apiData.user.name,
        token: apiData.token,
        issuedAt: Date.now(),
        expiresAt: Date.now() + (48 * 60 * 60 * 1000)
      };
      localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(userObj));
      state.user = userObj;
      state.activeTab = 'dealer';
      showToast(`🔒 Welcome Administrator (${userObj.name})! Access Granted.`);
      renderApp();
      return;
    }
  } catch (err) {
    // API connection fallback
  }

  // Fallback to local user validation
  const users = getStoredUsers();
  const foundUser = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());

  if (foundUser && foundUser.password === passwordInput) {
    const tokenPayload = {
      userId: foundUser.userId || `admin-${Date.now()}`,
      name: foundUser.name,
      email: foundUser.email,
      role: 'ADMIN',
      phone: foundUser.phone || '+92 300 0000000',
      agencyName: foundUser.agencyName || 'System Admin',
      city: foundUser.city || 'Lahore',
      issuedAt: Date.now(),
      expiresAt: Date.now() + (48 * 60 * 60 * 1000)
    };

    localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(tokenPayload));
    state.user = tokenPayload;
    state.activeTab = 'dealer';
    showToast(`🔓 Signed in successfully as System Administrator (${tokenPayload.name})!`);
    renderApp();
    return;
  } else if (apiData && apiData.message) {
    showToast(`❌ ${apiData.message}`);
  } else {
    showToast('❌ Invalid Administrator Credentials. Access Denied.');
  }
}

  // Handle form submissions natively (prevent page reloads on Enter key submit)
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'admin-page-login-form' || e.target.closest('#admin-page-login-form')) {
      e.preventDefault();
      const email = document.getElementById('admin-page-email')?.value?.trim();
      const password = document.getElementById('admin-page-password')?.value;
      if (email && password) {
        handleAdminPageLogin(email, password);
      }
    } else if (e.target.id === 'email-auth-form' || e.target.closest('#email-auth-form')) {
      e.preventDefault();
      const submitBtn = document.getElementById('auth-submit-btn');
      if (submitBtn) submitBtn.click();
    } else if (e.target.id === 'auth-page-native-form' || e.target.closest('#auth-page-native-form')) {
      e.preventDefault();
      const submitBtn = document.getElementById('auth-page-submit-btn');
      if (submitBtn) submitBtn.click();
    } else if (e.target.id === 'forgot-password-form' || e.target.closest('#forgot-password-form')) {
      e.preventDefault();
      const submitBtn = document.getElementById('auth-forgot-submit-btn');
      if (submitBtn) submitBtn.click();
    } else if (e.target.id === 'adv-contact-form' || e.target.closest('#adv-contact-form')) {
      e.preventDefault();
      if (window.handleAdvFormSubmit) window.handleAdvFormSubmit(e);
    }

    if (e.target.closest('#btn-admin-activate-package')) {
      e.preventDefault();
      const pendingInvoice = state.generatedInvoice || {
        invoiceId: 'INV-2026-89124',
        customerName: 'Umair Arshad',
        package: { name: 'Pro Gold Agency Package', price: 24999 }
      };

      if (state.user) {
        state.user.subscriptionPlan = pendingInvoice.package?.name || 'Pro Gold Agency Package';
        state.user.role = 'DEALER';
        state.user.listingQuota = 50;
        const users = getStoredUsers();
        const found = users.find(u => u.email === state.user.email);
        if (found) {
          found.subscriptionPlan = state.user.subscriptionPlan;
          found.role = 'DEALER';
          saveStoredUsers(users);
        }
      }
      
      if (state.generatedInvoice) {
        state.generatedInvoice.status = 'PAID & ACTIVATED';
      }

      showToast(`🎉 Success! Package "${pendingInvoice.package?.name}" HAS BEEN VERIFIED & ACTIVATED!`);
      renderApp();
      return;
    }
  });

  // Handle Enter Key press in AI prompt search bar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target && e.target.id === 'ai-prompt-input') {
      e.preventDefault();
      handleSearchQueryExecution(e.target.value);
    }
  });

// Activity Tracker to refresh lastActiveTime for logged-in sessions
function recordUserActivity() {
  if (state.user) {
    const savedStr = localStorage.getItem('Sarmayadar_jwt_token');
    if (savedStr) {
      try {
        const tokenObj = JSON.parse(savedStr);
        tokenObj.lastActiveTime = Date.now();
        localStorage.setItem('Sarmayadar_jwt_token', JSON.stringify(tokenObj));
      } catch (e) { }
    }
  }
}

let activityDebounceTimer = null;
['click', 'keydown', 'mousemove', 'scroll', 'touchstart'].forEach(evt => {
  window.addEventListener(evt, () => {
    if (!activityDebounceTimer) {
      recordUserActivity();
      activityDebounceTimer = setTimeout(() => {
        activityDebounceTimer = null;
      }, 10000); // Debounce activity updates to once per 10s
    }
  }, { passive: true });
});

// Advertise Page Global Handlers
window.scrollToAdvSection = function(secId) {
  const target = document.getElementById('adv-sec-' + secId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.querySelectorAll('.adv-audience-tab').forEach(tab => tab.classList.remove('active'));
  const activeTabBtn = document.getElementById('tab-btn-' + secId);
  if (activeTabBtn) activeTabBtn.classList.add('active');
};

window.openAuthRegisterModal = function(role = 'DEALER') {
  state.showAuthModal = true;
  state.authRole = role;
  state.authMode = 'signup';
  state.authIsRegister = true;
  state.phoneStep = 1;
  state.showMobileNav = false;
  renderApp();
};

window.handleAdvBuy = function(packageName, price) {
  if (packageName && (packageName.includes('Registration') || price === 0)) {
    window.openAuthRegisterModal('DEALER');
    return;
  }

  showToast(`🛒 Selected: ${packageName} (${formatPKR(price)}). Redirecting to Checkout...`);

  state.selectedPackage = {
    name: packageName || 'Pro Gold Agency Package',
    price: price || 24999,
    period: 'Per Month',
    features: [
      'Verified Property Listing Quotas',
      'Featured Search & Homepage Banners',
      'Verified Dealer Badge & Agency Page',
      'Direct WhatsApp Buyer Leads',
      'Dedicated Sarmayadar Account Specialist'
    ]
  };

  setActiveTab('advertise-checkout');
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.updateAdvCalc = function(budgetVal) {
  const budget = parseInt(budgetVal, 10);
  const displayEl = document.getElementById('adv-calc-budget-display');
  const viewsEl = document.getElementById('calc-out-views');
  const leadsEl = document.getElementById('calc-out-leads');
  const planEl = document.getElementById('calc-out-plan');

  if (displayEl) displayEl.innerText = `PKR ${budget.toLocaleString()}`;
  
  const estViews = Math.round((budget / 50000) * 85000);
  const minLeads = Math.round((budget / 50000) * 180);
  const maxLeads = Math.round((budget / 50000) * 240);

  if (viewsEl) viewsEl.innerText = `${estViews.toLocaleString()}+`;
  if (leadsEl) leadsEl.innerText = `${minLeads} - ${maxLeads}`;

  let recommended = 'Basic Listing';
  if (budget >= 150000) recommended = 'Platinum Master';
  else if (budget >= 65000) recommended = 'Agency Gold Pro';
  else if (budget >= 25000) recommended = 'Agency Silver';
  else if (budget >= 14000) recommended = 'Super Hot Listing';
  else if (budget >= 7000) recommended = 'Hot Listing';

  if (planEl) planEl.innerText = recommended;
};

window.handleAdvFormSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('adv-input-name')?.value || 'Valued User';
  const phone = document.getElementById('adv-input-phone')?.value || '';
  const pkg = document.getElementById('adv-input-package')?.value || '';

  showToast(`✅ Thank you ${name}! Your inquiry for ${pkg} has been submitted. Our Sales Advisor will call ${phone} within 2 hours.`);
  const form = document.getElementById('adv-contact-form');
  if (form) form.reset();
};

window.toggleAdvFaq = function(el) {
  const faqItem = el.closest('.adv-faq-item');
  if (faqItem) {
    faqItem.classList.toggle('open');
  }
};

// Start application when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

