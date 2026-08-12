import { renderIcon } from '../utils/icons.js';
import { checkPushSupport } from '../utils/pushClient.js';
import { t, SUPPORTED_LANGUAGES, getLanguage } from '../utils/i18n.js';

export function renderHeader(state, onStateChange) {
  const activeTab = state.activeTab || 'buy';
  const userName = state.user?.name || '';
  const isMobileDrawerOpen = state.showMobileNav || false;
  const currentLang = state.language || getLanguage();
  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
  const isRtl = currentLang === 'ur' || currentLang === 'ar';

  const pushSupport = checkPushSupport();
  const pushStatusLabel = pushSupport.isSubscribed 
    ? '🟢 Mobile Push Alerts (ON)' 
    : '🔔 Enable Mobile Push Alerts';

  return `
    <!-- Top Utility Bar (Desktop Only) -->
    <div class="top-bar">
      <div class="container">
        <div class="top-bar-content">
          <!-- Center Secondary Navigation Links Group -->
          <div class="top-bar-center">
            <a href="#" class="top-bar-nav-link ${activeTab === 'blogs' ? 'active' : ''}" data-nav="blogs">
              ${renderIcon('book-open', 14)}
              <span>${t('nav_blogs', 'Blogs & Insights')}</span>
            </a>
            <a href="#" class="top-bar-nav-link ${activeTab === 'tools' ? 'active' : ''}" data-nav="tools">
              ${renderIcon('calculator', 14)}
              <span>${t('nav_tools', 'Calculators & Tools')}</span>
            </a>
            <a href="#" class="top-bar-nav-link ${activeTab === 'agents' ? 'active' : ''}" data-nav="agents">
              ${renderIcon('users', 14)}
              <span>${t('nav_agents', 'Agents Directory')}</span>
            </a>
            <button type="button" class="top-bar-post-free-btn" id="top-bar-post-free-btn">
              ${renderIcon('plus-circle', 14, '#064E3B')}
              <span>${t('btn_post_property', '+ Post Free Listing')}</span>
            </button>
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
              <div class="logo-word">SARMAYA<span>DAR</span></div>
              <div class="logo-tagline">Pakistan Real Estate</div>
            </div>
          </a>

          <!-- Desktop Navigation Bar (Centered) -->
          <nav class="main-nav">
            <ul>
              <li><a href="/buy" class="${activeTab === 'buy' ? 'active' : ''}" data-nav="buy">${t('nav_sale', 'Properties for Sale')}</a></li>
              <li><a href="/rent" class="${activeTab === 'rent' ? 'active' : ''}" data-nav="rent">${t('nav_rent', 'Rental Properties')}</a></li>
              <li><a href="/projects" class="${activeTab === 'projects' ? 'active' : ''}" data-nav="projects">${t('nav_projects', 'Housing Megaprojects')}</a></li>
              <li><a href="/featured" class="${activeTab === 'featured' ? 'active' : ''}" data-nav="featured" style="color:#059669; font-weight:800;">⭐ Featured Ads</a></li>
              <li>
                <a href="/advertise" class="nav-advertise-highlight ${activeTab === 'advertise' ? 'active' : ''}" data-nav="advertise" title="Promote Your Listings & Agencies">
                  ${t('nav_advertise', '📢 Advertise')} <span class="nav-adv-badge">HOT 🔥</span>
                </a>
              </li>
              ${state.user?.role === 'ADMIN' ? `
                <li>
                  <a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">
                    ${t('nav_admin', 'Admin Portal')} <span class="dealer-nav-badge" style="background:#EF4444; color:#FFF;">SUPERVISOR</span>
                  </a>
                </li>
              ` : (state.user?.role === 'DEALER' ? `
                <li>
                  <a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">
                    ${t('nav_dealer', 'Dealer Portal')} <span class="dealer-nav-badge">DEALER</span>
                  </a>
                </li>
              ` : `
                <li>
                  <a href="#" id="header-dealer-join-btn" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">
                    ${t('nav_become_dealer', 'Become a Dealer')}
                  </a>
                </li>
              `)}
            </ul>
          </nav>

          <!-- Header Actions (Translator Alongside Navigation Bar) -->
          <div class="header-actions" style="display:flex; align-items:center; gap:0.4rem;">
            <!-- Optimized Language Translator Button alongside Navigation Bar -->
            <div class="header-lang-wrapper" style="position:relative; display:inline-block;">
              <button type="button" class="btn-header-lang" id="lang-selector-btn-main" title="Change Website Language" style="display:flex; align-items:center; gap:4px; padding:5px 10px; border-radius:20px; background:#ECFDF5; border:1px solid #A7F3D0; color:#064E3B; font-weight:800; font-size:0.78rem; cursor:pointer; transition:all 0.2s;">
                <span>🌐</span>
                <span>${currentLangInfo.flag}</span>
                <span class="lang-code-text">${currentLangInfo.code.toUpperCase()}</span>
                ${renderIcon('chevron-down', 12, '#059669')}
              </button>

              ${state.showLangDropdown ? `
                <div class="lang-dropdown-menu" style="position:absolute; top:calc(100% + 6px); ${isRtl ? 'left:0;' : 'right:0;'} background:#ffffff; border-radius:12px; border:1px solid #E2E8F0; box-shadow:0 10px 25px rgba(0,0,0,0.15); padding:6px; z-index:1200; min-width:135px;">
                  ${SUPPORTED_LANGUAGES.map(lang => `
                    <button type="button" class="lang-dropdown-item ${currentLang === lang.code ? 'active' : ''}" data-lang-select="${lang.code}" style="width:100%; display:flex; align-items:center; gap:8px; padding:6px 10px; border-radius:8px; background:${currentLang === lang.code ? '#ECFDF5' : 'transparent'}; color:${currentLang === lang.code ? '#059669' : '#0F172A'}; border:none; font-weight:${currentLang === lang.code ? '800' : '600'}; font-size:0.8rem; cursor:pointer; text-align:left;">
                      <span>${lang.flag}</span>
                      <span>${lang.name}</span>
                    </button>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            ${state.user ? `
              <!-- Logged-in Profile Icon Button & Dropdown Menu -->
              <div style="position:relative; display:inline-block;">
                <button type="button" class="btn-header-profile" id="header-user-profile-icon-btn" title="Open My Account Menu" style="display:flex; align-items:center; gap:6px; padding:5px 12px; border-radius:20px; background:#F1F5F9; border:1px solid #CBD5E1; color:#0F172A; font-weight:800; cursor:pointer;">
                  <img src="${state.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" style="width:22px; height:22px; border-radius:50%; object-fit:cover;" alt="${userName}" />
                  <span class="user-header-name-text">${userName}</span>
                  <span class="badge" style="font-size:0.65rem; background:${state.user.role === 'ADMIN' ? '#EF4444' : state.user.role === 'DEALER' ? '#059669' : '#3B82F6'}; color:#ffffff; padding:2px 6px; border-radius:4px;">
                    ${state.user.role}
                  </span>
                  ${renderIcon('chevron-down', 13, '#475569')}
                </button>

                ${state.showProfileDropdown ? `
                  <div class="user-profile-dropdown" style="position:absolute; top:calc(100% + 8px); ${isRtl ? 'left:0;' : 'right:0;'} width:220px; background:#ffffff; border-radius:12px; border:1px solid #E2E8F0; box-shadow:0 10px 25px rgba(0,0,0,0.15); padding:8px; z-index:1100;">
                    <div style="padding:8px; border-bottom:1px solid #E2E8F0; margin-bottom:4px;">
                      <div style="font-weight:800; font-size:0.88rem; color:#0F172A;">${userName}</div>
                      <div style="font-size:0.75rem; color:#64748B;">${state.user.email}</div>
                    </div>
                    <a href="#dashboard" class="dropdown-item" id="dropdown-dashboard-btn" style="display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:6px; color:#0F172A; font-weight:700; text-decoration:none; font-size:0.85rem; transition:background 0.2s;">
                      ${renderIcon('layout-dashboard', 16, '#059669')} ${t('nav_dashboard', 'My Dashboard')}
                    </a>
                    <a href="#dashboard" class="dropdown-item" id="dropdown-settings-btn" style="display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:6px; color:#0F172A; font-weight:700; text-decoration:none; font-size:0.85rem; transition:background 0.2s;">
                      ${renderIcon('settings', 16, '#64748B')} ${t('nav_settings', 'Account Settings')}
                    </a>
                    <div style="border-top:1px solid #E2E8F0; margin:4px 0;"></div>
                    <button type="button" id="header-dropdown-logout-btn" style="width:100%; display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:6px; background:#FEF2F2; color:#DC2626; font-weight:800; border:none; font-size:0.85rem; cursor:pointer; text-align:${isRtl ? 'right' : 'left'};">
                      ${renderIcon('log-out', 16, '#DC2626')} ${t('nav_logout', 'Logout')} (${userName})
                    </button>
                  </div>
                ` : ''}
              </div>
            ` : `
              <button type="button" class="btn btn-sm" id="header-user-profile-icon-btn" style="width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:#ECFDF5; border:1.5px solid #059669; color:#059669; cursor:pointer; transition:all 0.2s;" title="${t('nav_login', 'Sign In / Register')}">
                ${renderIcon('user', 18, '#059669')}
              </button>
            `}

            <!-- Mobile Hamburger Menu Toggle -->
            <button type="button" class="mobile-hamburger-btn" id="toggle-mobile-menu-btn" title="Toggle Navigation Menu" style="margin-left:2px;">
              ${renderIcon('menu', 20)}
            </button>
          </div>
        </div>

        <!-- Scrollable Mobile Navigation Drawer with ALL Menus -->
        <div class="mobile-nav-drawer ${isMobileDrawerOpen ? 'open' : ''}" id="mobile-drawer">
          <!-- Language Translator Selector Bar inside Mobile Navigation Menu -->
          <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:#ECFDF5; border-radius:10px; border:1px solid #A7F3D0; margin-bottom:10px;">
            <span style="font-weight:800; font-size:0.85rem; color:#064E3B; display:flex; align-items:center; gap:6px;">
              🌐 ${t('language', 'Select Language')}
            </span>
            <div style="display:flex; gap:5px;">
              ${SUPPORTED_LANGUAGES.map(lang => `
                <button type="button" class="btn btn-sm" data-lang-select="${lang.code}" style="padding:4px 10px; font-size:0.75rem; border-radius:14px; font-weight:800; background:${currentLang === lang.code ? '#059669' : '#FFFFFF'}; color:${currentLang === lang.code ? '#FFFFFF' : '#0F172A'}; border:1px solid #A7F3D0; cursor:pointer;">
                  ${lang.flag} ${lang.code.toUpperCase()}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- All Main Navigation Section Items -->
          <div class="mobile-nav-group-title" style="font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#64748B; padding:4px 0 2px;">
            Properties & Housing
          </div>
          <a href="#" class="${activeTab === 'buy' ? 'active' : ''}" data-nav="buy">
            ${renderIcon('home', 16)} <span>${t('nav_sale', 'Properties for Sale')}</span>
          </a>
          <a href="#" class="${activeTab === 'rent' ? 'active' : ''}" data-nav="rent">
            ${renderIcon('key', 16)} <span>${t('nav_rent', 'Rental Properties')}</span>
          </a>
          <a href="/projects" class="${activeTab === 'projects' ? 'active' : ''}" data-nav="projects">
            ${renderIcon('building-2', 16)} <span>${t('nav_projects', 'Housing Megaprojects')}</span>
          </a>
          <a href="/featured" class="${activeTab === 'featured' ? 'active' : ''}" data-nav="featured" style="color:#059669 !important; font-weight:800;">
            ${renderIcon('sparkles', 16, '#059669')} <span>⭐ Featured Ads & Spotlights</span>
          </a>

          <div class="mobile-nav-group-title" style="font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#64748B; padding:10px 0 2px;">
            Insights & Tools
          </div>
          <a href="#" class="${activeTab === 'blogs' ? 'active' : ''}" data-nav="blogs">
            ${renderIcon('book-open', 16)} <span>${t('nav_blogs', 'Blogs & Insights')}</span>
          </a>
          <a href="#" class="${activeTab === 'tools' ? 'active' : ''}" data-nav="tools">
            ${renderIcon('calculator', 16)} <span>${t('nav_tools', 'Calculators & Tools')}</span>
          </a>
          <a href="#" class="${activeTab === 'agents' ? 'active' : ''}" data-nav="agents">
            ${renderIcon('users', 16)} <span>${t('nav_agents', 'Agents Directory')}</span>
          </a>
          <a href="#" class="mobile-nav-adv-link ${activeTab === 'advertise' ? 'active' : ''}" data-nav="advertise" style="color:#D97706 !important; font-weight:800; background:#FEF3C7; padding:9px 14px; border-radius:10px; border:1px solid #FCD34D; margin:4px 0; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:8px;">
              ${renderIcon('megaphone', 16, '#D97706')} <span>${t('nav_advertise', '📢 Advertise With Us')}</span>
            </div>
            <span style="font-size:0.65rem; background:#F59E0B; color:#FFFFFF; padding:2px 6px; border-radius:4px; font-weight:800;">HOT 🔥</span>
          </a>
          <a href="#" id="mobile-drawer-post-free-btn" style="color:#047857 !important; font-weight:800; background:#ECFDF5; padding:9px 14px; border-radius:10px; border:1px solid #A7F3D0; margin:4px 0; display:flex; align-items:center; gap:8px;">
            ${renderIcon('plus-circle', 16, '#059669')} <span>${t('btn_post_property', '+ Post Free Listing')}</span>
          </a>

          <div class="mobile-nav-group-title" style="font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:#64748B; padding:10px 0 2px;">
            Account & Portals
          </div>
          ${state.user?.role === 'DEALER' ? `
            <a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">
              ${renderIcon('shield-check', 16)} <span>${t('nav_dealer', 'Dealer Portal')}</span>
            </a>
          ` : ''}
          ${state.user?.role === 'ADMIN' ? `
            <a href="#" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">
              ${renderIcon('shield-check', 16)} <span>${t('nav_admin', 'Admin Portal')}</span>
            </a>
          ` : `
            <a href="#" id="mobile-dealer-join-btn" class="${activeTab === 'dealer' ? 'active' : ''}" data-nav="dealer">
              ${renderIcon('shield', 16)} <span>${t('nav_become_dealer', 'Become a Dealer')}</span>
            </a>
          `}

          ${state.user ? `
            <a href="#dashboard" id="mobile-user-profile-btn" style="color:#047857 !important; font-weight:800; display:flex; align-items:center; gap:8px;">
              ${renderIcon('layout-dashboard', 16, '#059669')} <span>${t('nav_dashboard', 'My Dashboard')} (${userName})</span>
            </a>
            <a href="#" id="mobile-logout-btn" style="color:#EF4444 !important; font-weight:800; display:flex; align-items:center; gap:8px;">
              ${renderIcon('log-out', 16, '#EF4444')} <span>${t('nav_logout', 'Logout')}</span>
            </a>
          ` : `
            <a href="#" id="mobile-auth-login-link-btn" style="color:#047857 !important; font-weight:800; display:flex; align-items:center; gap:8px;">
              ${renderIcon('user', 18, '#059669')} <span>${t('nav_login', 'Sign In / Register')}</span>
            </a>
          `}
        </div>

      </div>
    </header>
  `;
}
