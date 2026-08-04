import { getFavorites } from '../utils/storage.js';
import { renderIcon } from '../utils/icons.js';

export function renderHeader(state, onStateChange) {
  const favoritesCount = getFavorites().length;
  const activeTab = state.activeTab || 'buy';
  const userName = state.user?.name || 'Chaudhry Kamran';
  const isMobileDrawerOpen = state.showMobileNav || false;

  return `
    <!-- Top Announcement & Currency Utility Bar -->
    <div class="top-bar">
      <div class="container">
        <div class="top-bar-content">
          <!-- Left Badges -->
          <div class="top-bar-left">
            <div class="top-bar-pill">
              <span style="width:7px; height:7px; background-color:#22C55E; border-radius:50%; box-shadow:0 0 8px #22C55E;"></span>
              <span>24/7 Helpline: <strong>+92 300 8472910</strong></span>
            </div>

            <div class="top-bar-pill">
              ${renderIcon('shield-check', 13, 'var(--marigold)')}
              <span>Pakistan's #1 Verified Exchange</span>
            </div>

            <div class="top-bar-ticker">
              ${renderIcon('trending-up', 13, 'var(--marigold)')}
              <span>DHA Lahore Phase 6: <strong>+4.2% Growth</strong></span>
            </div>
          </div>

          <!-- Right Pill Selectors -->
          <div class="top-bar-right">
            <select id="unit-select" class="unit-selector" title="Area Unit Display">
              <option value="Marla" ${state.unit === 'Marla' ? 'selected' : ''}>Unit: Marla</option>
              <option value="Kanal" ${state.unit === 'Kanal' ? 'selected' : ''}>Unit: Kanal</option>
              <option value="Sq.Ft" ${state.unit === 'Sq.Ft' ? 'selected' : ''}>Unit: Sq.Ft</option>
              <option value="Sq.Yd" ${state.unit === 'Sq.Yd' ? 'selected' : ''}>Unit: Sq.Yd</option>
            </select>

            <select id="currency-select" class="currency-selector" title="Currency Display">
              <option value="PKR" ${state.currency === 'PKR' ? 'selected' : ''}>₨ PKR</option>
              <option value="USD" ${state.currency === 'USD' ? 'selected' : ''}>$ USD</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="site-header">
      <div class="container">
        <div class="header-inner">
          <!-- Brand Logo -->
          <a href="#" class="logo" data-nav="buy">
            <svg class="logo-mark" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="14" fill="#131d0c"/>
              <path d="M50 18L18 45V82H82V45L50 18Z" fill="#faf1de"/>
              <path d="M50 25L26 46V76H74V46L50 25Z" fill="#131d0c"/>
              <circle cx="50" cy="46" r="10" fill="#f2a71b"/>
              <path d="M42 76V58H58V76H42Z" fill="#d1266e"/>
            </svg>
            <div>
              <div class="logo-word">APNA<span>GHAR</span></div>
              <div class="logo-tagline">Pakistan Real Estate</div>
            </div>
          </a>

          <!-- Desktop Navigation Bar -->
          <nav class="main-nav">
            <ul>
              <li><a href="#" class="${activeTab === 'buy' ? 'active' : ''}" data-nav="buy">Properties for Sale</a></li>
              <li><a href="#" class="${activeTab === 'rent' ? 'active' : ''}" data-nav="rent">Rentals</a></li>
              <li><a href="#" class="${activeTab === 'projects' ? 'active' : ''}" data-nav="projects">Megaprojects</a></li>
              <li><a href="#" class="${activeTab === 'tools' ? 'active' : ''}" data-nav="tools">Calculators & Tools</a></li>
              <li><a href="#" class="${activeTab === 'agents' ? 'active' : ''}" data-nav="agents">Agents Directory</a></li>
              ${state.user?.role === 'ADMIN' ? `
                <li>
                  <a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">
                    🛡️ Admin Portal <span class="dealer-nav-badge" style="background:#EF4444;">SUPERVISOR</span>
                  </a>
                </li>
              ` : (state.user?.role === 'DEALER' ? `
                <li>
                  <a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">
                    Dealer Portal CRM <span class="dealer-nav-badge">DEALER</span>
                  </a>
                </li>
              ` : `
                <li>
                  <a href="#" id="header-dealer-join-btn" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">
                    Become a Dealer
                  </a>
                </li>
              `)}
            </ul>
          </nav>

          <!-- Header Actions -->
          <div class="header-actions">
            <!-- Saved Favorites Trigger -->
            <button class="icon-btn" id="open-favorites-btn" title="Saved Favorites Drawer">
              ${renderIcon('heart', 18)}
              ${favoritesCount > 0 ? `<span class="badge-count">${favoritesCount}</span>` : ''}
            </button>

            <!-- User Auth Trigger -->
            <button class="btn btn-ghost btn-sm btn-hide-mobile" id="open-auth-btn" style="padding:7px 14px; font-size:0.8rem;">
              ${renderIcon('user', 14)} ${userName} (${state.user?.role || 'GUEST'})
            </button>

            <!-- Mobile Hamburger Toggle -->
            <button class="mobile-hamburger-btn" id="toggle-mobile-menu-btn" title="Toggle Navigation Menu">
              ${renderIcon('menu', 20)}
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Slide-down Drawer -->
        <div class="mobile-nav-drawer ${isMobileDrawerOpen ? 'open' : ''}" id="mobile-drawer">
          <a href="#" class="${activeTab === 'buy' ? 'active' : ''}" data-nav="buy">🏡 Properties for Sale</a>
          <a href="#" class="${activeTab === 'rent' ? 'active' : ''}" data-nav="rent">🔑 Rental Properties</a>
          <a href="#" class="${activeTab === 'projects' ? 'active' : ''}" data-nav="projects">🏗️ Housing Megaprojects</a>
          <a href="#" class="${activeTab === 'tools' ? 'active' : ''}" data-nav="tools">🧮 Calculators & Land Tools</a>
          <a href="#" class="${activeTab === 'agents' ? 'active' : ''}" data-nav="agents">🤝 Agents Directory</a>
          ${state.user?.role === 'DEALER' ? `<a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">📊 Dealer Portal CRM</a>` : ''}
          ${state.user?.role === 'ADMIN' ? `<a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">🛡️ Admin Portal</a>` : ''}
          <a href="#" id="mobile-open-auth-btn">👤 ${userName} (${state.user?.role || 'GUEST'})</a>
        </div>
      </div>
    </header>
  `;
}
