import { renderIcon } from '../utils/icons.js';

export function renderHeader(state, onStateChange) {
  const activeTab = state.activeTab || 'buy';
  const userName = state.user?.name || '';
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
              <li><a href="#" class="${activeTab === 'rent' ? 'active' : ''}" data-nav="rent">Rental Properties</a></li>
              <li><a href="#" class="${activeTab === 'projects' ? 'active' : ''}" data-nav="projects">Housing Megaprojects</a></li>
              <li><a href="#" class="${activeTab === 'tools' ? 'active' : ''}" data-nav="tools">Calculators & Tools</a></li>
              <li><a href="#" class="${activeTab === 'agents' ? 'active' : ''}" data-nav="agents">Agents Directory</a></li>
              ${state.user?.role === 'ADMIN' ? `
                <li>
                  <a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">
                    Admin Portal <span class="dealer-nav-badge" style="background:#EF4444;">SUPERVISOR</span>
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
          <div class="header-actions" style="display:flex; align-items:center; gap:0.85rem;">
            ${state.user ? `
              <!-- Logged-in Profile Button (Navigates directly to Profile Settings) -->
              <button type="button" class="btn-header-profile" id="header-user-profile-btn" title="Open My Profile & Settings">
                ${renderIcon('user', 14, 'var(--marigold)')} ${userName} (${state.user.role})
              </button>
              <button type="button" class="btn btn-danger btn-sm" id="logout-btn" style="padding:6px 12px; font-size:0.75rem; background:#EF4444; color:white; border:none; border-radius:6px; cursor:pointer;" title="Sign Out">
                Logout
              </button>
            ` : `
              <!-- Guest Sign In Button -->
              <button type="button" class="btn btn-primary btn-sm" id="open-auth-btn" style="padding:7px 16px; font-size:0.82rem; border-radius:20px; font-weight:700; box-shadow:var(--shadow-sm);">
                ${renderIcon('user', 14)} Sign In / Join
              </button>
            `}

            <!-- Mobile Hamburger Menu Toggle -->
            <button type="button" class="mobile-hamburger-btn" id="toggle-mobile-menu-btn" title="Toggle Navigation Menu" style="margin-left:4px;">
              ${renderIcon('menu', 20)}
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Slide-down Drawer -->
        <div class="mobile-nav-drawer ${isMobileDrawerOpen ? 'open' : ''}" id="mobile-drawer">
          <a href="#" class="${activeTab === 'buy' ? 'active' : ''}" data-nav="buy">Properties for Sale</a>
          <a href="#" class="${activeTab === 'rent' ? 'active' : ''}" data-nav="rent">Rental Properties</a>
          <a href="#" class="${activeTab === 'projects' ? 'active' : ''}" data-nav="projects">Housing Megaprojects</a>
          <a href="#" class="${activeTab === 'tools' ? 'active' : ''}" data-nav="tools">Calculators & Land Tools</a>
          <a href="#" class="${activeTab === 'agents' ? 'active' : ''}" data-nav="agents">Agents Directory</a>
          ${state.user?.role === 'DEALER' ? `<a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">Dealer Portal CRM</a>` : ''}
          ${state.user?.role === 'ADMIN' ? `<a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">Admin Portal</a>` : ''}
          ${state.user ? `
            <a href="#" id="mobile-user-profile-btn" style="color:var(--forest-dk) !important; font-weight:700;">👤 My Profile & Account Settings (${userName})</a>
            <a href="#" id="mobile-logout-btn" style="color:#EF4444 !important; font-weight:700;">Logout (${userName})</a>
          ` : `
            <a href="#" id="mobile-open-auth-btn">Sign In / Create Account</a>
          `}
        </div>

      </div>
    </header>
  `;
}
