import { INITIAL_PROPERTIES } from './data/properties.js';
import { getFavorites, toggleFavorite, getCustomProperties, saveCustomProperty, getDealerLeads, saveDealerLeads, saveAgencyProfile } from './utils/storage.js';
import { convertArea, calculateMortgage, formatPKR } from './utils/formatters.js';

import { renderHeader } from './components/Header.js';
import { renderHeroSearch } from './components/SearchEngine.js';
import { renderCatalog } from './components/Catalog.js';
import { initLeafletMap } from './components/MapView.js';
import { renderDealerDashboard } from './components/DealerDashboard.js';
import { renderHousingProjects } from './components/HousingProjects.js';
import { renderFinancialTools } from './components/FinancialTools.js';
import { renderPostPropertyModal } from './components/PostPropertyWizard.js';
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

// Application State
const state = {
  properties: [],
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
    { sender: 'bot', text: 'Assalam-o-Alaikum! 👋 I am your **Apna Ghar AI Advisor**. Ask me about DHA prices, loan EMI calculations, or hot property deals!' }
  ],
  showSplash: true,
  authMethod: 'phone', // google | phone | email
  phoneStep: 1, // 1: enter number, 2: enter 6-digit OTP
  tempPhone: '+92 300 8472910',
  activeTool: 'converter', // converter | mortgage | valuate | fbr
  dealerTab: 'inventory', // inventory | leads | analytics | profile
  user: { name: 'Chaudhry Kamran', role: 'dealer' }
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
function initApp() {
  const custom = getCustomProperties();
  state.properties = [...INITIAL_PROPERTIES, ...custom];
  renderApp();
  setupEventListeners();

  if (state.showSplash) {
    triggerSplashAnimation();
    state.showSplash = false;
  }
}

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

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
  toast.innerHTML = `<i data-lucide="check-circle" style="width:18px; height:18px; color:var(--marigold);"></i> ${message}`;
  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.remove();
  }, 3500);
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

    // Navigation Links
    const navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      e.preventDefault();
      const tab = navBtn.getAttribute('data-nav');
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

    // Property Details Modal Trigger
    const detailBtn = e.target.closest('.view-details-btn, .popup-view-btn');
    if (detailBtn) {
      const id = detailBtn.getAttribute('data-id');
      const target = state.properties.find(p => p.id === id);
      if (target) {
        state.selectedProperty = target;
        renderApp();
      }
    }

    // Close Property Detail Modal
    if (e.target.closest('#close-prop-detail-btn') || e.target.id === 'prop-detail-modal-overlay') {
      state.selectedProperty = null;
      renderApp();
    }

    // Post Property Modal Controls
    if (e.target.closest('#open-post-property-btn') || e.target.closest('#dealer-post-btn') || e.target.id === 'footer-link-post') {
      e.preventDefault();
      state.showPostWizard = true;
      state.wizardStep = 1;
      renderApp();
    }

    if (e.target.closest('#close-wizard-btn')) {
      state.showPostWizard = false;
      renderApp();
    }

    if (e.target.closest('#wizard-next-btn')) {
      if (state.wizardStep < 4) {
        state.wizardStep += 1;
        renderApp();
      }
    }

    if (e.target.closest('#wizard-prev-btn')) {
      if (state.wizardStep > 1) {
        state.wizardStep -= 1;
        renderApp();
      }
    }

    // Publish New Property Submission
    if (e.target.closest('#wizard-submit-btn')) {
      const title = document.getElementById('wiz_title')?.value || '10 Marla Luxury Modern House';
      const city = document.getElementById('wiz_city')?.value || 'Lahore';
      const location = document.getElementById('wiz_location')?.value || 'DHA Phase 6';
      const address = document.getElementById('wiz_address')?.value || 'Main Boulevard, DHA';
      const price = Number(document.getElementById('wiz_price')?.value || 35000000);
      const size = Number(document.getElementById('wiz_size')?.value || 10);
      const beds = Number(document.getElementById('wiz_beds')?.value || 4);
      const baths = Number(document.getElementById('wiz_baths')?.value || 5);
      const desc = document.getElementById('wiz_desc')?.value || 'Brand new construction with solar backup.';
      const img = document.getElementById('wiz_image')?.value || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

      const newProp = {
        id: `prop-${Date.now()}`,
        title,
        purpose: 'sale',
        category: 'house',
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
        images: [img],
        coords: [31.4722, 74.4371],
        agency: {
          name: 'Apna Ghar Prime Realtors',
          agentName: 'Chaudhry Kamran',
          phone: '+92 300 8472910',
          whatsapp: '923008472910',
          badge: 'PLATINUM DEALER',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
        },
        description: desc,
        features: ['Solar Power Backup', 'Servant Quarter', 'Gas Connection'],
        status: 'active',
        postedDate: new Date().toISOString().split('T')[0],
        views: 1
      };

      saveCustomProperty(newProp);
      state.properties = [newProp, ...state.properties];
      state.showPostWizard = false;
      showToast('🎉 Property published live on Apna Ghar Portal!');
      renderApp();
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

    const removeFavBtn = e.target.closest('.remove-fav-item-btn');
    if (removeFavBtn) {
      const id = removeFavBtn.getAttribute('data-id');
      toggleFavorite(id);
      renderApp();
      showToast('Item removed from saved list.');
    }

    // Auth Modal Controls
    if (e.target.closest('#open-auth-btn')) {
      state.showAuthModal = true;
      state.phoneStep = 1;
      renderApp();
    }

    if (e.target.closest('#close-auth-btn')) {
      state.showAuthModal = false;
      renderApp();
    }

    // Auth Method Tab Switcher (Google | Phone | Email)
    const methodTab = e.target.closest('.auth-method-tab');
    if (methodTab) {
      state.authMethod = methodTab.getAttribute('data-method');
      state.phoneStep = 1;
      renderApp();
    }

    // Send Phone OTP Button
    if (e.target.closest('#send-otp-btn')) {
      const phoneInput = document.getElementById('phone-number-input')?.value;
      if (phoneInput) state.tempPhone = phoneInput;
      state.phoneStep = 2;
      showToast(`📲 Verification code 482910 sent to ${state.tempPhone}`);
      renderApp();
    }

    // Verify Phone OTP Button
    if (e.target.closest('#verify-otp-btn')) {
      state.user = { name: 'Chaudhry Kamran', phone: state.tempPhone, role: 'dealer' };
      state.showAuthModal = false;
      state.phoneStep = 1;
      showToast(`✅ Phone verified! Signed in as ${state.tempPhone}`);
      renderApp();
    }

    if (e.target.closest('#change-phone-btn')) {
      state.phoneStep = 1;
      renderApp();
    }

    // Google Sign-In Handler
    if (e.target.closest('#google-signin-btn')) {
      state.user = { name: 'Usman Malik', role: 'dealer', email: 'usman.malik@gmail.com' };
      state.showAuthModal = false;
      showToast('G Signed in successfully with Google! Welcome Usman Malik.');
      renderApp();
    }

    // Auth Role Switcher Button
    const authRoleBtn = e.target.closest('.auth-role-btn');
    if (authRoleBtn) {
      document.querySelectorAll('.auth-role-btn').forEach(b => {
        b.classList.remove('btn-dark', 'active');
        b.classList.add('btn-ghost');
      });
      authRoleBtn.classList.remove('btn-ghost');
      authRoleBtn.classList.add('btn-dark', 'active');
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
  
  let botReply = 'I have analyzed your query! Here are the best verified options available on Apna Ghar right now.';
  const q = query.toLowerCase();

  if (q.includes('dha') || q.includes('lahore')) {
    botReply = '📍 **DHA Lahore Phase 6 & 8 Update**: Average 10 Marla Luxury Houses range from **4.2 Crore to 5.5 Crore**. 1 Kanal Designer Villas start around **8.5 Crore**. We have 4 Verified DHA listings online right now!';
  } else if (q.includes('loan') || q.includes('emi') || q.includes('calculator')) {
    botReply = '🧮 **Home Loan Rate**: Current bank KIBOR interest is ~14.5%. For a **3 Crore** loan over 20 years, your estimated monthly EMI will be **~PKR 382,000 / month**. Check our **Calculators & Tools** tab for detailed breakdowns!';
  } else if (q.includes('islamabad') || q.includes('hot')) {
    botReply = '🔥 **Islamabad Megaproject Highlight**: Capital Smart City & Gulberg Greens feature prime 10 Marla and 1 Kanal plots with easy 3-Year quarterly installment plans starting at **PKR 35 Lakhs down payment**!';
  }

  state.aiChatMessages.push({ sender: 'bot', text: botReply });
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

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', initApp);
