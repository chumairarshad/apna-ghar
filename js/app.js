import { INITIAL_PROPERTIES } from './data/properties.js';
import { INITIAL_AGENTS } from './data/agents.js';
import { getFavorites, toggleFavorite, getCustomProperties, saveCustomProperty, saveOrUpdatePropertyInStorage, deletePropertyFromStorage, getEffectiveProperties, getDealerLeads, saveDealerLeads, saveAgencyProfile, getDealersFromStorage, saveDealersToStorage } from './utils/storage.js';
import { convertArea, calculateMortgage, formatPKR } from './utils/formatters.js';
import { normalizeProperty, normalizeProperties } from './utils/normalizeProperty.js';
import { fetchPropertiesFromApi, savePropertyToApi, uploadImageToFreeCdn } from './utils/api.js';


import { renderHeader } from './components/Header.js';
import { renderHeroSearch } from './components/SearchEngine.js';
import { renderCatalog } from './components/Catalog.js';
import { initLeafletMap } from './components/MapView.js';
import { renderDealerDashboard } from './components/DealerDashboard.js';
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
import { renderSplashScreen, triggerSplashAnimation } from './components/SplashScreen.js';

// New Recommended Features Imports
import { renderVirtualTourModal } from './components/VirtualTourModal.js';
import { renderFBRTaxCalculatorSection, calculateFBRTaxes } from './components/FBRTaxCalculator.js';
import { renderOverseasPortal } from './components/OverseasPortal.js';
import { renderPriceTrendsSection } from './components/PriceTrendsSection.js';
import { renderPropertyComparerModal } from './components/PropertyComparer.js';
import { renderScheduleVisitModal } from './components/ScheduleVisitModal.js';
import { renderFeaturedBannersSection } from './components/FeaturedBannersSection.js';
import { renderArticleReaderModal } from './components/ArticleReaderModal.js';
import { renderMobileBottomNav } from './components/MobileBottomNav.js';

// Application State
const state = {
  properties: [],
  editingProperty: null,
  activeTab: 'buy', // buy | rent | projects | tools | agents | dealer | overseas
  currency: 'PKR',
  unit: 'Marla',
  viewMode: 'grid', // grid | map
  sortBy: 'featured',
  searchFilters: {
    purpose: 'sale',
    city: 'all',
    society: 'all',
    category: 'all',
    maxPrice: 'any',
    badge: null,
    size: null
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
  showAIChatbot: false,
  aiChatMessages: [
    { sender: 'bot', text: 'Assalam-o-Alaikum! 👋 I am your **Sarmayadar AI Advisor**. Ask me about DHA prices, loan EMI calculations, or hot property deals!' }
  ],
  showSplash: false,
  authMethod: 'phone', // google | phone | email
  phoneStep: 1, // 1: enter number, 2: enter 6-digit OTP
  tempPhone: '',
  activeTool: 'converter', // converter | mortgage | valuate | fbr
  dealerTab: 'inventory', // inventory | leads | analytics | profile
  user: null,
  uploadedImages: []
};

const ARTICLES_DB = [
  {
    id: 'news-1',
    badge: 'FBR TAXES 2026',
    title: 'FBR Property Tax & Capital Gains Guide (Filer vs Non-Filer)',
    date: 'Aug 2026',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    fullText: `FBR has updated income tax withholding rates under Sections 236C (Seller) and 236K (Buyer) for FY 2025-26. Active Tax Filers pay a reduced 3% tax rate on property transactions, whereas Non-Filers face 10.5% advance tax. Additionally, Section 7E imposes a 1% tax on deemed rental income of un-utilized properties valued above PKR 2.5 Crore.`
  },
  {
    id: 'news-2',
    badge: 'INVESTMENT ANALYSIS',
    title: 'DHA vs Bahria Town: Where Should You Invest in 2026?',
    date: 'Jul 2026',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    fullText: `DHA continues to lead capital appreciation with 14.8% annual ROI driven by overseas Pakistani demand and corporate leases. Bahria Town offers superior commercial rental yields (up to 9.2%) and immediate possession for end-users seeking ready infrastructure.`
  },
  {
    id: 'news-3',
    badge: 'DEVELOPMENT UPDATE',
    title: 'Rawalpindi Ring Road & Motorway Interchange Impact',
    date: 'Jul 2026',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    fullText: `The inauguration of the 38km Rawalpindi Ring Road economic corridor has slashed heavy transport travel time between N-5 and M-2 Motorway, triggering a 28% surge in land valuation for adjacent housing projects in Rawalpindi and Islamabad West.`
  }
];

// Initialize Application
async function initApp() {
  state.properties = getEffectiveProperties(INITIAL_PROPERTIES);

  // Persistent Login Session with 10-Minute Inactivity Timeout Check
  const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
  const savedTokenStr = localStorage.getItem('apnaghar_jwt_token');

  if (savedTokenStr) {
    try {
      const tokenObj = JSON.parse(savedTokenStr);
      const now = Date.now();
      const lastActive = tokenObj.lastActiveTime || tokenObj.issuedAt || now;

      if (now - lastActive > INACTIVITY_TIMEOUT_MS) {
        localStorage.removeItem('apnaghar_jwt_token');
        state.user = null;
        showToast('⏱️ Session expired due to 10 minutes of inactivity. Please sign in again.');
      } else {
        tokenObj.lastActiveTime = now;
        localStorage.setItem('apnaghar_jwt_token', JSON.stringify(tokenObj));
        state.user = tokenObj;
      }
    } catch (e) {
      localStorage.removeItem('apnaghar_jwt_token');
      state.user = null;
    }
  } else {
    state.user = null;
  }

  renderApp();
  setupEventListeners();


  if (state.showSplash) {
    triggerSplashAnimation();
    state.showSplash = false;
  }

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
}

function renderApp() {
  try {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

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
    } else if (state.activeTab === 'tools') {
      mainContentHTML = `
        ${renderFinancialTools(state)}
      `;
    } else if (state.activeTab === 'agents') {
      mainContentHTML = `
        ${renderAgentDirectory()}
      `;
    } else if (state.activeTab === 'dealer') {
      mainContentHTML = `
        ${renderDealerDashboard(state.properties, state)}
      `;
    }

    appContainer.innerHTML = `
      ${state.showSplash ? renderSplashScreen() : ''}
      ${renderHeader(state, onStateChange)}
      <main>${mainContentHTML}</main>
      ${renderFooter()}
      
      <!-- Modals & Overlays -->
      ${renderPostPropertyModal(state)}
      ${renderSavedFavoritesDrawer(state.properties, state)}
      ${renderAuthModal(state)}
      ${renderPropertyDetailModal(state)}
      ${renderFeaturedPropertyModal(state)}

      <!-- New Recommended Feature Modals -->
      ${renderVirtualTourModal(state)}
      ${renderPropertyComparerModal(state)}
      ${renderScheduleVisitModal(state)}
      ${renderArticleReaderModal(state)}

      <!-- Persistent Floating AI Chatbot Widget -->
      ${renderAIChatbotWidget(state)}

      <!-- Mobile Bottom Navigation Bar (OLX Style) -->
      ${renderMobileBottomNav(state)}

      <!-- Toast Notifications Container -->
      <div id="toast-container"></div>
    `;

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
  state[key] = value;
  renderApp();
}

function getFilteredProperties() {
  let list = [...state.properties];

  // Purpose filter
  if (state.activeTab === 'buy') {
    list = list.filter(p => p.purpose === 'sale');
  } else if (state.activeTab === 'rent') {
    list = list.filter(p => p.purpose === 'rent');
  }

  // Search Filters
  const f = state.searchFilters;
  if (f.city && f.city !== 'all') {
    list = list.filter(p => p.city.toLowerCase() === f.city.toLowerCase());
  }

  if (f.society && f.society !== 'all') {
    list = list.filter(p => p.location.toLowerCase().includes(f.society.toLowerCase()));
  }

  if (f.category && f.category !== 'all') {
    list = list.filter(p => p.category === f.category);
  }

  if (f.maxPrice && f.maxPrice !== 'any') {
    const maxP = Number(f.maxPrice);
    list = list.filter(p => p.price <= maxP);
  }

  if (f.badge) {
    list = list.filter(p => p.badges.includes(f.badge));
  }

  if (f.size) {
    const sz = Number(f.size);
    list = list.filter(p => p.sizeMarla >= sz);
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


function setupEventListeners() {
  document.addEventListener('click', (e) => {
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
    }

    // AI Search Execution
    if (e.target.closest('#execute-ai-search-btn')) {
      const promptVal = document.getElementById('ai-prompt-input')?.value || '';
      if (promptVal.toLowerCase().includes('dha') || promptVal.toLowerCase().includes('lahore')) {
        state.searchFilters.city = 'lahore';
      }
      if (promptVal.toLowerCase().includes('islamabad')) {
        state.searchFilters.city = 'islamabad';
      }
      if (promptVal.toLowerCase().includes('karachi')) {
        state.searchFilters.city = 'karachi';
      }
      showToast('🤖 AI Recommendation Engine matched top verified properties for your request!');
      renderApp();
      const catalog = document.querySelector('.catalog-section');
      if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
    }

    // Featured Property Modal Triggers
    if (e.target.closest('#open-featured-modal-btn')) {
      state.showFeaturedModal = true;
      renderApp();
    }

    if (e.target.closest('#close-featured-btn') || e.target.id === 'featured-modal-overlay') {
      state.showFeaturedModal = false;
      renderApp();
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
      state.activeTab = 'buy';
      state.searchFilters.purpose = 'sale';
      state.showMobileNav = false;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (e.target.closest('#mobile-nav-chats-btn')) {
      state.showAIChatbot = !state.showAIChatbot;
      renderApp();
    }

    if (e.target.closest('#mobile-nav-sell-btn')) {
      e.preventDefault();
      if (state.user?.role !== 'DEALER' && state.user?.role !== 'ADMIN') {
        showToast('⚠️ Only registered Dealers can post properties. Please sign in or join as a Dealer.');
        state.showAuthModal = true;
        state.authRole = 'DEALER';
        state.authIsSignup = true;
        renderApp();
        return;
      }
      state.editingProperty = null;
      state.uploadedImages = [];
      state.showPostWizard = true;
      state.wizardStep = 1;
      renderApp();
    }

    if (e.target.closest('#mobile-nav-myads-btn')) {
      if (state.user?.role === 'DEALER' || state.user?.role === 'ADMIN') {
        state.activeTab = 'dealer';
        state.dealerTab = 'inventory';
        renderApp();
      } else {
        state.showFavoritesDrawer = true;
        renderApp();
      }
    }

    if (e.target.closest('#mobile-nav-account-btn')) {
      if (state.user) {
        state.activeTab = 'dealer';
        state.dealerTab = 'profile';
        renderApp();
        showToast(`👤 Welcome ${state.user.name}! Opened Profile Settings.`);
      } else {
        state.showAuthModal = true;
        state.phoneStep = 1;
        renderApp();
      }
    }

    // Navigation Links
    const navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      e.preventDefault();
      const tab = navBtn.getAttribute('data-nav');
      if (tab === 'dealer' && state.user?.role !== 'DEALER' && state.user?.role !== 'ADMIN') {
        showToast('⚠️ Dealer Portal is strictly for verified Agencies & Brokers. Please sign in or register as a Dealer.');
        state.showAuthModal = true;
        state.authRole = 'DEALER';
        state.authIsSignup = true;
        state.showMobileNav = false;
        renderApp();
        return;
      }
      state.activeTab = tab;
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

      state.searchFilters.city = cityVal;
      state.searchFilters.society = societyVal;
      state.searchFilters.category = typeVal;
      renderApp();
      showToast(`Filter applied! Found ${getFilteredProperties().length} properties.`);
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

    // Property Details Modal Trigger (Real Views Counter)
    const detailBtn = e.target.closest('.view-details-btn, .popup-view-btn');
    if (detailBtn) {
      const id = detailBtn.getAttribute('data-id');
      const target = state.properties.find(p => p.id === id);
      if (target) {
        // Increment real view counter & save to storage
        target.views = (target.views || 0) + 1;
        saveOrUpdatePropertyInStorage(target);

        state.selectedProperty = target;
        renderApp();
      }
    }


    // Close Property Detail Modal
    if (e.target.closest('#close-prop-detail-btn') || e.target.id === 'prop-detail-modal-overlay') {
      state.selectedProperty = null;
      renderApp();
    }

    // Logout Handler
    if (e.target.closest('#logout-btn') || e.target.closest('#mobile-logout-btn')) {
      e.preventDefault();
      localStorage.removeItem('apnaghar_jwt_token');
      state.user = null;
      state.activeTab = 'buy';
      showToast('🔒 Logged out successfully.');
      renderApp();
    }

    // Post Property Modal Controls
    if (e.target.closest('#open-post-property-btn') || e.target.closest('#dealer-post-btn') || e.target.id === 'footer-link-post') {
      e.preventDefault();
      if (state.user?.role !== 'DEALER' && state.user?.role !== 'ADMIN') {
        showToast('⚠️ Only verified Dealers can post properties. Please sign in as a Dealer.');
        state.showAuthModal = true;
        state.authRole = 'DEALER';
        state.authIsSignup = true;
        renderApp();
        return;
      }
      state.editingProperty = null;
      state.uploadedImages = [];
      state.showPostWizard = true;
      state.wizardStep = 1;
      renderApp();
    }

    if (e.target.closest('#close-wizard-btn')) {
      state.showPostWizard = false;
      state.editingProperty = null;
      state.uploadedImages = [];
      renderApp();
    }

    // Step switching with strict required-fields validation
    if (e.target.closest('#wizard-next-btn')) {
      const step = state.wizardStep || 1;

      if (step === 1) {
        const purpose = document.querySelector('input[name="wiz_purpose"]:checked')?.value;
        const category = document.getElementById('wiz_category')?.value;
        if (!purpose || !category) {
          showToast('⚠️ Please select both Property Purpose and Category.');
          return;
        }
      } else if (step === 2) {
        const location = document.getElementById('wiz_location')?.value?.trim();
        const address = document.getElementById('wiz_address')?.value?.trim();
        if (!location || !address) {
          showToast('⚠️ Please fill in both Location/Society and Full Address.');
          return;
        }
      } else if (step === 3) {
        const price = Number(document.getElementById('wiz_price')?.value);
        const size = Number(document.getElementById('wiz_size')?.value);
        const beds = document.getElementById('wiz_beds')?.value;
        const baths = document.getElementById('wiz_baths')?.value;
        if (!price || price <= 0 || !size || size <= 0 || beds === '' || baths === '') {
          showToast('⚠️ Please enter valid Asking Price, Area Size, Bedrooms, and Bathrooms.');
          return;
        }
      }

      if (state.wizardStep < 4) {
        state.wizardStep += 1;
        updateWizardStepUI();
      }
    }

    if (e.target.closest('#wizard-prev-btn')) {
      if (state.wizardStep > 1) {
        state.wizardStep -= 1;
        updateWizardStepUI();
      }
    }

    // Image Upload Zone Click
    if (e.target.closest('#image-drag-drop-zone')) {
      const fileInput = document.getElementById('wiz_file_input');
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

    // View Property Button Handler in Dealer Inventory (Real Views Counter)
    const viewPropBtn = e.target.closest('.view-prop-btn');
    if (viewPropBtn) {
      const id = viewPropBtn.getAttribute('data-id');
      const propToView = state.properties.find(p => p.id === id);
      if (propToView) {
        propToView.views = (propToView.views || 0) + 1;
        saveOrUpdatePropertyInStorage(propToView);
        state.selectedProperty = propToView;
        renderApp();
      }
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

    // Publish / Edit Property Submission
    if (e.target.closest('#wizard-submit-btn')) {
      const title = document.getElementById('wiz_title')?.value?.trim();
      const city = document.getElementById('wiz_city')?.value || 'Lahore';
      const location = document.getElementById('wiz_location')?.value?.trim();
      const address = document.getElementById('wiz_address')?.value?.trim() || location;
      const rawPrice = document.getElementById('wiz_price')?.value;
      const price = (rawPrice !== '' && rawPrice !== undefined) ? Number(rawPrice) : null;
      const rawSize = document.getElementById('wiz_size')?.value;
      const size = (rawSize !== '' && rawSize !== undefined) ? Number(rawSize) : null;
      const beds = Number(document.getElementById('wiz_beds')?.value || 0);
      const baths = Number(document.getElementById('wiz_baths')?.value || 0);
      const desc = document.getElementById('wiz_desc')?.value?.trim();

      const purposeRadio = document.querySelector('input[name="wiz_purpose"]:checked');
      const purpose = purposeRadio ? purposeRadio.value : 'sale';
      const categorySelect = document.getElementById('wiz_category');
      const category = categorySelect ? categorySelect.value : 'house';

      if (!location || !address) {
        showToast('⚠️ Please fill in Location/Society and Full Address in Step 2.');
        state.wizardStep = 2;
        updateWizardStepUI();
        return;
      }

      if (!price || isNaN(price) || price <= 0 || !size || isNaN(size) || size <= 0) {
        showToast('⚠️ Please enter a valid Price and Area Size in Step 3.');
        state.wizardStep = 3;
        updateWizardStepUI();
        return;
      }

      if (!title || title.length < 5) {
        showToast('⚠️ Please enter a Property Title (at least 5 characters).');
        state.wizardStep = 4;
        updateWizardStepUI();
        return;
      }

      if (!desc || desc.length < 10) {
        showToast('⚠️ Please enter a Property Description (at least 10 characters).');
        state.wizardStep = 4;
        updateWizardStepUI();
        return;
      }

      if (!state.uploadedImages || state.uploadedImages.length === 0) {
        showToast('⚠️ Photo upload is required! Please select at least 1 image from your PC gallery.');
        state.wizardStep = 4;
        updateWizardStepUI();
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
        // Upload images to Free CDN (ImgBB)
        const finalImages = await Promise.all(rawImages.map(img => uploadImageToFreeCdn(img)));

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
          savePropertyToApi(updatedProp); // Save to Neon PostgreSQL
          state.properties = state.properties.map(p => p.id === updatedProp.id ? updatedProp : p);
          state.showPostWizard = false;
          state.editingProperty = null;
          state.uploadedImages = [];
          showToast('✏️ Property updated successfully!');
          renderApp();
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
          savePropertyToApi(newProp); // Save to Neon PostgreSQL Database
          state.properties = [newProp, ...state.properties];
          state.showPostWizard = false;
          state.uploadedImages = [];
          showToast('🎉 Property published live successfully!');
          renderApp();
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


    const removeFavBtn = e.target.closest('.remove-fav-item-btn');
    if (removeFavBtn) {
      const id = removeFavBtn.getAttribute('data-id');
      toggleFavorite(id);
      renderApp();
      showToast('Item removed from saved list.');
    }

    // Auth Modal Controls (Guest Sign In Button)
    if (e.target.closest('#open-auth-btn')) {
      state.showAuthModal = true;
      state.phoneStep = 1;
      renderApp();
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

    if (e.target.closest('#toggle-login-mode-btn')) {
      state.authMode = 'login';
      state.authIsSignup = false;
      renderApp();
    }

    if (e.target.closest('#toggle-signup-mode-btn')) {
      state.authMode = 'signup';
      state.authIsSignup = true;
      renderApp();
    }

    if (e.target.closest('#toggle-forgot-mode-btn')) {
      state.authMode = 'forgot';
      renderApp();
    }

    // Helper functions for local auth storage
    function getStoredUsers() {
      try {
        const data = localStorage.getItem('apnaghar_registered_users');
        if (data) return JSON.parse(data);
      } catch (e) { }
      const defaultUsers = [
        { email: 'dealer@agency.com', password: 'password123', name: 'Apex Real Estate Agency', phone: '+92 300 1234567', role: 'DEALER', agencyName: 'Apex Real Estate Agency' },
        { email: 'admin@apnaghar.pk', password: 'adminpassword', name: 'System Administrator', phone: '+92 300 9999999', role: 'ADMIN', agencyName: 'Sarmayadar Admin Panel' }
      ];
      localStorage.setItem('apnaghar_registered_users', JSON.stringify(defaultUsers));
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
      localStorage.setItem('apnaghar_registered_users', JSON.stringify(users));
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
            state.authIsSignup = false;
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
            state.authIsSignup = false;
            state.authPreFillEmail = email;
            renderApp();
          }
        })();
        return;
      }
    }

    // Email & Password Auth Form Submit (Login & Signup)
    if (e.target.id === 'email-auth-form' || e.target.closest('#email-auth-form')) {
      if (e.type === 'submit' || e.target.closest('#auth-submit-btn')) {
        e.preventDefault();
        const role = state.authRole || 'DEALER';
        const isSignup = state.authMode === 'signup';
        const emailInput = document.getElementById('auth-email-input')?.value?.trim()?.toLowerCase();
        const passwordInput = document.getElementById('auth-password-input')?.value;

        if (!emailInput) {
          showToast('⚠️ Please enter a valid Email Address.');
          return;
        }
        if (!passwordInput || passwordInput.length < 4) {
          showToast('⚠️ Please enter your password.');
          return;
        }

        if (isSignup) {
          // --- SIGNUP FLOW ---
          const nameInput = document.getElementById('auth-full-name')?.value?.trim();
          const phoneInput = document.getElementById('auth-phone-num')?.value?.trim();

          if (!nameInput || !phoneInput) {
            showToast('⚠️ Please fill in Full Name and Phone Number.');
            return;
          }

          (async () => {
            try {
              const res = await fetch('/api/auth/signup', {
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

                showToast(`🎉 Account created successfully! Please sign in.`);
                state.authMode = 'login';
                state.authIsSignup = false;
                state.authPreFillEmail = emailInput;
                renderApp();
              } else {
                const errMsg = data?.message || 'Error creating account. Please try again.';
                showToast(`❌ ${errMsg}`);
              }
            } catch (err) {
              console.error('Signup fetch error:', err);
              saveStoredUser({
                email: emailInput,
                password: passwordInput,
                name: nameInput,
                phone: phoneInput,
                role: role,
                agencyName: nameInput
              });
              showToast(`🎉 Account created locally! Please sign in with your password.`);
              state.authMode = 'login';
              state.authIsSignup = false;
              state.authPreFillEmail = emailInput;
              renderApp();
            }
          })();


        } else {
          // --- LOGIN FLOW ---
          (async () => {
            try {
              const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput, password: passwordInput, role: role })
              });
              const data = await res.json().catch(() => null);

              if (res.ok && data && data.success && data.token) {
                const userObj = {
                  userId: data.user.id,
                  name: data.user.name,
                  email: data.user.email,
                  role: data.user.role,
                  phone: data.user.phone,
                  agencyName: data.user.agencyName || data.user.name,
                  token: data.token,
                  issuedAt: Date.now(),
                  expiresAt: Date.now() + (48 * 60 * 60 * 1000)
                };
                localStorage.setItem('apnaghar_jwt_token', JSON.stringify(userObj));
                state.user = userObj;
                state.showAuthModal = false;
                state.activeTab = 'dealer';
                showToast(`🔒 Signed in successfully as ${userObj.role} (${userObj.name})!`);
                renderApp();
                return;
              } else if (data && data.message) {
                showToast(`❌ ${data.message}`);
                return;
              }

            } catch (err) {
              // API connection error fallback to local validation
            }

            // Local Credential Validation
            const users = getStoredUsers();
            const foundUser = users.find(u => u.email.toLowerCase() === emailInput);

            if (!foundUser) {
              showToast('❌ Account not found. Please create an account first.');
              return;
            }

            if (foundUser.password !== passwordInput) {
              showToast('❌ Invalid email or password credentials. Please try again.');
              return;
            }

            if (foundUser.isSuspended) {
              showToast('🚫 Account Suspended: Your account has been suspended by system administrator.');
              return;
            }

            // Strictly separate Dealer & Admin logins!
            const selectedRole = state.authRole || 'DEALER';
            if (foundUser.role && foundUser.role !== selectedRole) {
              showToast(`❌ Access Denied: This account is registered as a ${foundUser.role}. Please switch to the ${foundUser.role} Login tab.`);
              return;
            }

            // Valid local login
            const tokenPayload = {
              userId: foundUser.userId || `user-${Date.now()}`,
              name: foundUser.name,
              email: foundUser.email,
              role: foundUser.role, // Registered role
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


            localStorage.setItem('apnaghar_jwt_token', JSON.stringify(tokenPayload));
            state.user = tokenPayload;
            state.showAuthModal = false;
            state.activeTab = 'dealer';
            showToast(`🔓 Signed in successfully as ${tokenPayload.role} (${tokenPayload.name})!`);
            renderApp();
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
        localStorage.setItem('apnaghar_jwt_token', JSON.stringify(state.user));
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
    if (e.target.id === 'footer-link-valuation') { e.preventDefault(); state.activeTab = 'tools'; state.activeTool = 'valuate'; renderApp(); }
  });

  // Change Listeners for Selects & Inputs
  document.addEventListener('change', (e) => {
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
  state.aiChatMessages.push({ sender: 'user', text: query });

  const q = query.toLowerCase();
  const allProps = state.properties || [];

  // Score each property in database based on user query keywords
  const scored = allProps.map(rawP => {
    const p = normalizeProperty(rawP);
    let score = 35; // base match threshold

    const titleLower = (p.title || '').toLowerCase();
    const cityLower = (p.city || '').toLowerCase();
    const locationLower = (p.location || '').toLowerCase();
    const categoryLower = (p.category || '').toLowerCase();
    const purposeLower = (p.purpose || '').toLowerCase();

    if (q.includes(cityLower) && cityLower.length > 2) score += 25;
    if (q.includes(locationLower) && locationLower.length > 2) score += 25;
    else {
      const locWords = locationLower.split(' ').filter(w => w.length > 2);
      if (locWords.some(w => q.includes(w))) score += 20;
    }

    if (q.includes(categoryLower)) score += 15;
    else if (q.includes('house') && categoryLower.includes('house')) score += 15;
    else if (q.includes('plot') && categoryLower.includes('plot')) score += 15;
    else if (q.includes('flat') || q.includes('apartment')) score += 15;

    if (q.includes('sale') && purposeLower === 'sale') score += 10;
    if (q.includes('rent') && purposeLower === 'rent') score += 10;

    if (p.sizeMarla && (q.includes(`${p.sizeMarla} marla`) || q.includes(`${p.sizeMarla}marla`))) score += 15;
    if (p.bedrooms && (q.includes(`${p.bedrooms} bed`) || q.includes(`${p.bedrooms}bed`))) score += 15;

    // Normalize match percentage score between 55% and 98%
    const matchScore = Math.min(98, Math.max(55, score));

    return { ...p, matchScore };
  });

  // Sort by highest match score and select top 3 matched properties
  scored.sort((a, b) => b.matchScore - a.matchScore);
  const matchedProperties = scored.slice(0, 3);

  let botReply = `Assalam-o-Alaikum! 🤖 Aap ki requirement **"${query}"** ke mutabiq database se ye milte julte (similar) verified options match huay hain. Details dekhnay ke liye niche card par click karein, ya agar koi khas location/budget chahiye toh **WhatsApp button** par click karke hamare Agent se direct baat karein (Hum dhoondh dain ge)!`;

  if (q.includes('loan') || q.includes('emi') || q.includes('calculator')) {
    botReply = '🧮 **Home Loan Rate**: Current bank KIBOR interest rate is ~14.5%. For a **3 Crore** loan over 20 years, estimated monthly EMI is **~PKR 382,000 / month**. Detailed breakdowns ke liye **Calculators & Tools** tab check karein!';
  }

  state.aiChatMessages.push({
    sender: 'bot',
    text: botReply,
    userQuery: query,
    matchedProperties: (q.includes('loan') || q.includes('emi')) ? [] : matchedProperties
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

// Global Image Upload File Selector & Drag and Drop Event Listeners
document.addEventListener('change', (e) => {
  if (e.target.id === 'wiz_file_input' && e.target.files?.length > 0) {
    const files = Array.from(e.target.files);
    let loadedCount = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        state.uploadedImages = state.uploadedImages || [];
        state.uploadedImages.push(evt.target.result);
        loadedCount++;
        if (loadedCount === files.length) {
          const container = document.getElementById('wiz-image-previews');
          if (container) {
            container.innerHTML = renderImagePreviewsList(state.uploadedImages);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'agency-photo-file-input') {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        const base64Photo = evt.target.result;
        const logoUrlInput = document.getElementById('agency-logo-url-input');
        const logoPreview = document.getElementById('agency-logo-preview');
        if (logoUrlInput) logoUrlInput.value = base64Photo;
        if (logoPreview) logoPreview.src = base64Photo;
        showToast('📸 Profile picture selected from gallery!');
      };
      reader.readAsDataURL(file);
    }
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

document.addEventListener('drop', (e) => {
  const dropZone = e.target.closest('#image-drag-drop-zone');
  if (dropZone) {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--emerald-teal)';
    if (e.dataTransfer.files?.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      let loadedCount = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          state.uploadedImages = state.uploadedImages || [];
          state.uploadedImages.push(evt.target.result);
          loadedCount++;
          if (loadedCount === files.length) {
            const container = document.getElementById('wiz-image-previews');
            if (container) {
              container.innerHTML = renderImagePreviewsList(state.uploadedImages);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }
});

// Activity Tracker to refresh lastActiveTime for logged-in sessions
function recordUserActivity() {
  if (state.user) {
    const savedStr = localStorage.getItem('apnaghar_jwt_token');
    if (savedStr) {
      try {
        const tokenObj = JSON.parse(savedStr);
        tokenObj.lastActiveTime = Date.now();
        localStorage.setItem('apnaghar_jwt_token', JSON.stringify(tokenObj));
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

// Start application when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

