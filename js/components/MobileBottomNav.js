import { renderIcon } from '../utils/icons.js';

/**
 * Mobile Bottom Navigation Bar Component (OLX Style)
 * Displays a fixed 5-item bottom bar on mobile screens (< 768px).
 * Features Home, Chats, Central Raised 'Sell' (+), My Ads, and Account.
 */
export function renderMobileBottomNav(state) {
  const activeTab = state.activeTab || 'buy';
  const isPostWizardOpen = state.showPostWizard || false;
  const isAIChatOpen = state.showAIChatbot || false;
  const isFavoritesOpen = state.showFavoritesDrawer || false;
  const isProfileActive = activeTab === 'dealer' && state.dealerTab === 'profile';

  return `
    <nav class="mobile-bottom-nav" id="mobile-bottom-navbar" aria-label="Mobile Bottom Navigation">
      <!-- 1. Home -->
      <button type="button" class="mobile-nav-item ${activeTab === 'buy' || activeTab === 'rent' ? 'active' : ''}" id="mobile-nav-home-btn" data-nav="buy" title="Home">
        <div class="mobile-nav-icon">
          ${renderIcon('home', 22)}
        </div>
        <span class="mobile-nav-label">Home</span>
      </button>

      <!-- 2. Chats (AI Advisor & Messaging) -->
      <button type="button" class="mobile-nav-item ${isAIChatOpen ? 'active' : ''}" id="mobile-nav-chats-btn" title="Chats & AI Support">
        <div class="mobile-nav-icon">
          ${renderIcon('message-square', 22)}
          <span class="mobile-nav-badge-dot" title="Active AI Chatbot"></span>
        </div>
        <span class="mobile-nav-label">Chats</span>
      </button>

      <!-- 3. Sell (Central Elevated Gradient Ring Button) -->
      <div class="mobile-nav-sell-wrapper">
        <button type="button" class="mobile-nav-sell-btn ${isPostWizardOpen ? 'active' : ''}" id="mobile-nav-sell-btn" title="Sell Property / Add Listing">
          <div class="sell-btn-inner">
            ${renderIcon('plus', 24, '#ffffff', 'stroke-width: 3;')}
          </div>
        </button>
        <span class="mobile-nav-label sell-label">Sell</span>
      </div>

      <!-- 4. My Ads / Saved Listings -->
      <button type="button" class="mobile-nav-item ${isFavoritesOpen || (activeTab === 'dealer' && state.dealerTab === 'inventory') ? 'active' : ''}" id="mobile-nav-myads-btn" title="My Ads & Saved Properties">
        <div class="mobile-nav-icon">
          ${renderIcon('layers', 22)}
        </div>
        <span class="mobile-nav-label">My Ads</span>
      </button>

      <!-- 5. Account -->
      <button type="button" class="mobile-nav-item ${isProfileActive || state.showAuthModal ? 'active' : ''}" id="mobile-nav-account-btn" title="User Account & Settings">
        <div class="mobile-nav-icon">
          ${renderIcon('user', 22)}
        </div>
        <span class="mobile-nav-label">Account</span>
      </button>
    </nav>
  `;
}
