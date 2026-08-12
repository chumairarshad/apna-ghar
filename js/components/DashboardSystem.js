import { formatPKR, formatArea } from '../utils/formatters.js';
import { normalizeProperties, normalizeProperty } from '../utils/normalizeProperty.js';
import { renderIcon } from '../utils/icons.js';
import { getStoredFavorites, getStoredRecentViews, getDealerLeads, getAgencyProfile, saveAgencyProfile, getStoredUsers, saveStoredUsers, getStoredAppointments, getStoredNotifications } from '../utils/storage.js';
import { INITIAL_DEALER_LEADS } from '../data/leads.js';
import { INITIAL_AGENTS } from '../data/agents.js';
import { t, tText, tCity } from '../utils/i18n.js';
import { hasFeatureAccess, renderFeatureLockOverlay, getUserPlanConfig } from '../utils/planAccess.js';

import { renderImagePreviewsList } from './PostPropertyWizard.js';

export function renderDashboardSystem(rawProperties, state) {
  const properties = normalizeProperties(rawProperties || []);
  const user = state.user || {
    name: 'Sarmayadar User',
    email: 'user@sarmayadar.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  };

  const role = (user.role || 'USER').toUpperCase();
  const isAdmin = role === 'ADMIN';
  const isDealer = role === 'DEALER';
  const isUser = role === 'USER';

  // Sub-tab selection with RBAC enforcement
  let activeTab = state.dashboardTab || 'dashboard';

  // Enforce Role Security: If a user attempts to access restricted tabs, revert to dashboard
  if (isUser && ['dealers', 'approvals', 'users', 'blogs'].includes(activeTab)) {
    activeTab = 'dashboard';
  } else if (isDealer && ['users', 'approvals', 'blogs'].includes(activeTab)) {
    activeTab = 'dashboard';
  }

  const favorites = getStoredFavorites();
  const recentViews = getStoredRecentViews();
  const leads = getDealerLeads() || INITIAL_DEALER_LEADS;
  const users = getStoredUsers();
  const appointments = getStoredAppointments() || [];
  const notifications = getStoredNotifications() || [];

  return `
    <div class="profolio-dashboard-wrapper">
      <!-- ProFolio Topbar Navigation -->
      <header class="profolio-topbar">
        <div class="profolio-topbar-left">
          <button type="button" class="btn-icon" id="dash-toggle-sidebar" title="Toggle Sidebar Navigation" style="background:none; border:none; cursor:pointer; color:#064E3B; flex-shrink:0;">
            ${renderIcon('menu', 22)}
          </button>

          <a href="#" class="profolio-brand-logo" id="dash-brand-logo">
            <svg class="logo-mark" viewBox="0 0 100 100" fill="none" style="width:32px; height:32px; flex-shrink:0;">
              <rect width="100" height="100" rx="14" fill="#064E3B"/>
              <path d="M50 18L18 45V82H82V45L50 18Z" fill="#FAF1DE"/>
              <path d="M50 25L26 46V76H74V46L50 25Z" fill="#064E3B"/>
              <circle cx="50" cy="46" r="10" fill="#F2A71B"/>
              <path d="M42 76V58H58V76H42Z" fill="#D1266E"/>
            </svg>
            <span class="profolio-brand-text">SARMAYA<span>DAR</span></span>
          </a>

          <a href="#" class="profolio-portal-link" id="dash-go-portal" data-nav="buy" title="Return to Website Homepage">
            ${renderIcon('home', 15)} <span class="portal-link-text">${t('go_to_home', 'Go Back to Home')}</span>
          </a>
        </div>

        <div class="profolio-topbar-right">
          <button type="button" class="profolio-btn-post" id="dash-post-listing-btn">
            ${renderIcon('plus-circle', 16, '#FFFFFF')} <span class="btn-post-text">${isUser ? t('btn_post_free', '+ Post Property FREE') : t('dash_add_property', '+ Post Listing')}</span>
          </button>

          <!-- User Profile Dropdown Pill -->
          <div class="profolio-user-pill" id="dash-user-profile-menu-btn" title="Click for profile options">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" class="profolio-user-avatar" alt="${user.name}" />
            <span class="profolio-user-name">${user.name}</span>
            <span class="badge" style="font-size:0.65rem; background:${isAdmin ? '#EF4444' : isDealer ? '#059669' : '#3B82F6'}; color:#ffffff; padding:2px 6px; border-radius:4px;">
              ${role}
            </span>
          </div>
        </div>
      </header>

      <!-- Main Layout: Icon/Expanded Sidebar + Content Panel -->
      <div class="profolio-main-layout">
        <!-- Interactive Mobile Backdrop Overlay -->
        <div class="profolio-sidebar-backdrop ${state.isSidebarExpanded ? 'active' : ''}" id="dash-sidebar-backdrop"></div>

        <!-- ProFolio Left Sidebar (Desktop Sidebar / Mobile Drawer) -->
        <aside class="profolio-sidebar ${state.isSidebarExpanded ? 'expanded' : ''}" id="profolio-main-sidebar">
          <!-- Mobile Drawer Top Header -->
          <div class="profolio-sidebar-header-mobile">
            <div class="sidebar-mobile-brand">
              <svg class="logo-mark" viewBox="0 0 100 100" fill="none" style="width:28px; height:28px;">
                <rect width="100" height="100" rx="14" fill="#064E3B"/>
                <path d="M50 18L18 45V82H82V45L50 18Z" fill="#FAF1DE"/>
                <path d="M50 25L26 46V76H74V46L50 25Z" fill="#064E3B"/>
                <circle cx="50" cy="46" r="10" fill="#F2A71B"/>
                <path d="M42 76V58H58V76H42Z" fill="#D1266E"/>
              </svg>
              <span class="profolio-brand-text-sm">SARMAYA<span>DAR</span></span>
            </div>
            <button type="button" class="profolio-sidebar-close-btn" id="dash-close-sidebar" title="Close Navigation Drawer">
              ${renderIcon('x', 20)}
            </button>
          </div>

          <!-- User Quick Profile Banner inside Mobile Drawer -->
          <div class="profolio-sidebar-user-card">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" class="user-card-avatar" alt="${user.name}" />
            <div class="user-card-info">
              <span class="user-card-name">${user.name}</span>
              <span class="user-card-role-badge" style="background:${isAdmin ? '#EF4444' : isDealer ? '#059669' : '#3B82F6'}; color:#ffffff;">
                ${role}
              </span>
            </div>
          </div>

          <div class="profolio-sidebar-menu-list">
            <!-- Go Back to Home Button (Visible in Mobile Drawer & Desktop Sidebar) -->
            <button type="button" class="profolio-nav-item dash-back-home-btn" data-nav="buy" title="Return to Homepage" style="background:#ECFDF5; color:#047857; font-weight:800; border:1px solid #A7F3D0; margin-bottom:8px;">
              ${renderIcon('home', 20, '#047857')}
              <span class="profolio-nav-label">Go Back to Home</span>
            </button>

            <button type="button" class="profolio-nav-item ${activeTab === 'dashboard' ? 'active' : ''}" data-dash-tab="dashboard" title="${t('dash_overview', 'Dashboard Overview')}">
              ${renderIcon('layout-dashboard', 20)}
              <span class="profolio-nav-label">${t('dash_overview', 'Dashboard Overview')}</span>
            </button>

            <button type="button" class="profolio-nav-item ${activeTab === 'add-property' ? 'active' : ''}" data-dash-tab="add-property" title="${isUser ? t('btn_post_free', 'Post Property FREE') : t('dash_add_property', 'Add Property')}">
              ${renderIcon('plus-circle', 20)}
              <span class="profolio-nav-label">${isUser ? t('btn_post_free', 'Post Property FREE') : t('dash_add_property', 'Add Property')}</span>
            </button>

            <button type="button" class="profolio-nav-item ${activeTab === 'listings' ? 'active' : ''}" data-dash-tab="listings" title="${t('dash_my_listings', 'My Property Listings')}">
              ${renderIcon('building-2', 20)}
              <span class="profolio-nav-label">${t('dash_my_listings', 'My Property Listings')}</span>
            </button>

            <button type="button" class="profolio-nav-item ${activeTab === 'saved-properties' ? 'active' : ''}" data-dash-tab="saved-properties" title="${t('dash_favorites', 'Saved Properties')}">
              ${renderIcon('heart', 20)}
              <span class="profolio-nav-label">${t('dash_favorites', 'Saved Properties')}</span>
            </button>

            <button type="button" class="profolio-nav-item ${activeTab === 'inquiries' ? 'active' : ''}" data-dash-tab="inquiries" title="${t('dash_inquiries', 'Inquiries & Leads')}">
              ${renderIcon('mail', 20)}
              <span class="profolio-nav-label">${t('dash_inquiries', 'Inquiries & Leads')}</span>
            <button type="button" class="profolio-nav-item ${activeTab === 'invoices' ? 'active' : ''}" data-dash-tab="invoices" title="Pay Invoices & Bank Transfer Details">
              ${renderIcon('credit-card', 20)}
              <span class="profolio-nav-label">Invoices & Payments</span>
            </button>

            ${isDealer || isAdmin ? `
              <button type="button" class="profolio-nav-item ${activeTab === 'mega-projects' ? 'active' : ''}" data-dash-tab="mega-projects" title="${t('dash_mega_projects', 'Mega Projects Studio')}">
                ${renderIcon('layers', 20)}
                <span class="profolio-nav-label">${t('dash_mega_projects', 'Mega Projects Studio')}</span>
              </button>
              <button type="button" class="profolio-nav-item ${activeTab === 'subscriptions' ? 'active' : ''}" data-dash-tab="subscriptions" title="${t('dash_subscriptions', 'Subscriptions & Limits')}">
                ${renderIcon('award', 20)}
                <span class="profolio-nav-label">${t('dash_subscriptions', 'Subscriptions & Limits')}</span>
              </button>
            ` : ''}

            ${isAdmin ? `
              <button type="button" class="profolio-nav-item ${activeTab === 'users' ? 'active' : ''}" data-dash-tab="users" title="${t('dash_users', 'Users')}">
                ${renderIcon('users', 20)}
                <span class="profolio-nav-label">${t('dash_users', 'Users')}</span>
              </button>

              <button type="button" class="profolio-nav-item ${activeTab === 'dealers' ? 'active' : ''}" data-dash-tab="dealers" title="${t('dash_dealers', 'Dealers')}">
                ${renderIcon('shield-check', 20)}
                <span class="profolio-nav-label">${t('dash_dealers', 'Dealers')}</span>
              </button>

              <button type="button" class="profolio-nav-item ${activeTab === 'approvals' ? 'active' : ''}" data-dash-tab="approvals" title="${t('dash_approvals', 'Approvals')}">
                ${renderIcon('check-square', 20)}
                <span class="profolio-nav-label">${t('dash_approvals', 'Approvals')}</span>
              </button>
            ` : ''}

            <button type="button" class="profolio-nav-item ${activeTab === 'profile' ? 'active' : ''}" data-dash-tab="profile" title="${t('dash_settings', 'Settings')}">
              ${renderIcon('settings', 20)}
              <span class="profolio-nav-label">${t('dash_settings', 'Settings')}</span>
            </button>

            <button type="button" class="profolio-nav-item" id="dash-logout-btn" title="${t('dash_logout', 'Logout')}" style="margin-top:auto; color:#EF4444;">
              ${renderIcon('log-out', 20)}
              <span class="profolio-nav-label">${t('dash_logout', 'Logout')}</span>
            </button>
          </div>
        </aside>

        <!-- ProFolio Content Area -->
        <main class="profolio-content-panel">
          ${renderRoleTabContent(activeTab, properties, state, user, { favorites, recentViews, leads, users, appointments, notifications })}
        </main>
      </div>
    </div>
  `;
}

function renderRoleTabContent(activeTab, properties, state, user, data) {
  const role = (user.role || 'USER').toUpperCase();

  switch (activeTab) {
    case 'dashboard':
      return renderProFolioDashboardOverview(properties, user, data, state);
    case 'add-property':
      return renderProFolioAddPropertyForm(state);
    case 'listings':
      return renderProFolioListingsManager(properties, user, state);
    case 'mega-projects':
      return renderProFolioMegaProjectsStudio(user, state);
    case 'subscriptions':
      return renderProFolioSubscriptionsManager(user, properties);
    case 'saved-properties':
      return renderProFolioSavedProperties(properties, data.favorites);
    case 'inquiries':
      return renderProFolioInquiriesInbox(data.leads);
    case 'invoices':
      return renderProFolioInvoicesManager(state, user);
    case 'users':
      return renderProFolioUsersManager(data.users);
    case 'dealers':
      return renderProFolioDealersManager();
    case 'approvals':
      return renderProFolioApprovalsQueue(properties);
    case 'profile':
      return renderProFolioSettingsView(user, state);
    default:
      return renderProFolioDashboardOverview(properties, user, data);
  }
}

/* ==========================================================================
   1. PROFOLIO DASHBOARD OVERVIEW (As Shown in Screenshot #1)
   ========================================================================== */
function renderProFolioDashboardOverview(properties, user, data, state = {}) {
  const isDealer = user.role === 'DEALER';
  const isAdmin = user.role === 'ADMIN';

  const userProps = isDealer ? properties.filter(p => p.agency?.email === user.email || p.agency?.agentName === user.name) : properties;
  const activeCount = userProps.filter(p => p.status !== 'pending' && p.status !== 'sold').length;
  const forSaleCount = userProps.filter(p => p.purpose?.toLowerCase() === 'sale' || p.purpose?.toLowerCase() === 'for sale').length;
  const forRentCount = userProps.filter(p => p.purpose?.toLowerCase() === 'rent' || p.purpose?.toLowerCase() === 'for rent').length;
  const hotCount = userProps.filter(p => (p.badges || []).includes('HOT')).length;
  const superHotCount = userProps.filter(p => (p.badges || []).includes('VERIFIED')).length;

  const totalViews = userProps.reduce((sum, p) => sum + (p.views || 0), 0);

  return `
    <!-- Card 1: Listings Overview & Quota/Credits -->
    <div class="profolio-overview-grid">
      <!-- Listings Card -->
      <div class="profolio-card" style="margin-bottom:0;">
        <div class="profolio-card-header">
          <h3 class="profolio-card-title">Listings</h3>
          <a href="#" class="profolio-link-action" data-dash-tab="listings">View all Listings →</a>
        </div>

        <div class="profolio-stat-triplet">
          <div style="background:#ECFDF5; border-radius:12px; padding:0.85rem 0.5rem; text-align:center; border:1px solid #A7F3D0;">
            <div class="stat-num" style="color:#059669; font-size:1.5rem; font-weight:800; line-height:1;">${activeCount}</div>
            <div class="stat-label" style="font-size:0.75rem; font-weight:700; color:#064E3B; margin-top:4px;">🟢 Active</div>
          </div>
          <div style="background:#F8FAFC; border-radius:12px; padding:0.85rem 0.5rem; text-align:center; border:1px solid #E2E8F0;">
            <div class="stat-num" style="color:#0F172A; font-size:1.3rem; font-weight:800; line-height:1;">${forSaleCount}</div>
            <div class="stat-label" style="font-size:0.73rem; font-weight:700; color:#64748B; margin-top:4px;">For Sale</div>
          </div>
          <div style="background:#F8FAFC; border-radius:12px; padding:0.85rem 0.5rem; text-align:center; border:1px solid #E2E8F0;">
            <div class="stat-num" style="color:#0F172A; font-size:1.3rem; font-weight:800; line-height:1;">${forRentCount}</div>
            <div class="stat-label" style="font-size:0.73rem; font-weight:700; color:#64748B; margin-top:4px;">For Rent</div>
          </div>
        </div>

        <div class="profolio-credits-footer" style="display:flex; justify-content:space-between; margin-top:1rem; padding-top:0.75rem; border-top:1px dashed #E2E8F0; font-size:0.82rem; font-weight:700; color:#64748B; flex-wrap:wrap; gap:0.5rem;">
          <span>🔥 Super Hot: <strong style="color:#D1266E;">${superHotCount}</strong></span>
          <span>⚡ Hot Credits: <strong style="color:#F59E0B;">${hotCount}</strong></span>
        </div>
      </div>

      <!-- Quota and Credits Card -->
      <div class="profolio-card" style="margin-bottom:0;">
        <div class="profolio-card-header">
          <h3 class="profolio-card-title">Quota and Credits</h3>
        </div>

        <div class="profolio-tab-labels" style="display:flex; gap:0.75rem; border-bottom:2px solid #E2E8F0; margin-bottom:1rem; padding-bottom:4px; font-size:0.82rem; font-weight:700; color:#059669; flex-wrap:wrap;">
          <span style="border-bottom:3px solid #059669; padding-bottom:4px; white-space:nowrap;">Listing Quota (Unlimited)</span>
          <span style="color:#64748B; white-space:nowrap;">Refresh Credits (50)</span>
        </div>

        <div class="profolio-stat-triplet">
          <div>
            <div style="font-size:0.73rem; color:#64748B; font-weight:700;">Available Quota</div>
            <div style="font-size:1.4rem; font-weight:800; color:#059669;">∞</div>
          </div>
          <div>
            <div style="font-size:0.73rem; color:#64748B; font-weight:700;">Used</div>
            <div style="font-size:1.4rem; font-weight:800; color:#0F172A;">${userProps.length}</div>
          </div>
          <div>
            <div style="font-size:0.73rem; color:#64748B; font-weight:700;">Current Plan</div>
            <div style="font-size:0.82rem; font-weight:800; color:#F59E0B; margin-top:4px; white-space:nowrap;">PRO DEALER</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 2: Analytics & Insights Box -->
    <div class="profolio-card">
      <div class="profolio-card-header profolio-analytics-header">
        <h3 class="profolio-card-title">Analytics</h3>
        <div class="profolio-analytics-filters">
          <button class="btn btn-sm" style="background:#059669; color:#fff; font-weight:700; border-radius:6px; font-size:0.78rem;">All</button>
          <button class="btn btn-sm" style="background:#F1F5F9; color:#64748B; font-weight:700; border-radius:6px; font-size:0.78rem;">For Sale</button>
          <button class="btn btn-sm" style="background:#F1F5F9; color:#64748B; font-weight:700; border-radius:6px; font-size:0.78rem;">For Rent</button>
          <select style="padding:4px 8px; border-radius:6px; border:1px solid #CBD5E1; font-size:0.78rem; font-weight:700;">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
          </select>
        </div>
      </div>

      <!-- Analytics Metric Bar -->
      <div class="profolio-analytics-bar">
        <div class="profolio-analytics-item active">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B;">👁️ Views</div>
          <div style="font-size:1.3rem; font-weight:800; color:#059669;">${totalViews}</div>
        </div>
        <div class="profolio-analytics-item">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B;">👆 Clicks</div>
          <div style="font-size:1.3rem; font-weight:800; color:#0F172A;">${Math.round(totalViews * 0.45)}</div>
        </div>
        <div class="profolio-analytics-item">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B;">🎯 Leads</div>
          <div style="font-size:1.3rem; font-weight:800; color:#0F172A;">${data.leads.length}</div>
        </div>
        <div class="profolio-analytics-item">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B;">📞 Calls</div>
          <div style="font-size:1.3rem; font-weight:800; color:#0F172A;">${Math.round(data.leads.length * 0.6)}</div>
        </div>
        <div class="profolio-analytics-item">
          <div style="font-size:0.75rem; font-weight:700; color:#64748B;">💬 WhatsApp</div>
          <div style="font-size:1.3rem; font-weight:800; color:#25D366;">${Math.round(data.leads.length * 0.8)}</div>
        </div>
      </div>
    </div>

    <!-- Recent Listings Table Section -->
    <div class="profolio-card">
      <div class="profolio-card-header">
        <h3 class="profolio-card-title">Recent Property Listings</h3>
        <a href="#" class="profolio-link-action" data-dash-tab="listings">View All Listings ↗</a>
      </div>

      <div class="profolio-table-wrapper" style="overflow-x:auto; -webkit-overflow-scrolling:touch; width:100%; border-radius:10px; border:1px solid #E2E8F0;">
        <table class="profolio-table" style="width:100%; min-width:580px; border-collapse:collapse; text-align:left; font-size:0.85rem;">
          <thead>
            <tr style="background:#F8FAFC; border-bottom:2px solid #E2E8F0; color:#64748B;">
              <th style="padding:10px;">Property</th>
              <th style="padding:10px;">Location</th>
              <th style="padding:10px;">Price</th>
              <th style="padding:10px;">Size</th>
              <th style="padding:10px;">Status</th>
              <th style="padding:10px; text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${userProps.slice(0, 5).map(p => `
              <tr style="border-bottom:1px solid #E2E8F0;">
                <td style="padding:10px; display:flex; align-items:center; gap:10px;">
                  <img src="${p.images[0]}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;" />
                  <span style="font-weight:700; color:#0F172A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px;">${p.title}</span>
                </td>
                <td style="padding:10px; color:#64748B; white-space:nowrap;">${p.location}, ${p.city}</td>
                <td style="padding:10px; font-weight:800; color:#059669; white-space:nowrap;">${formatPKR(p.price)}</td>
                <td style="padding:10px; font-weight:700; white-space:nowrap;">${formatArea(p.sizeMarla, state?.unit)}</td>
                <td style="padding:10px; white-space:nowrap;">
                  <span class="badge" style="background:#ECFDF5; color:#059669; font-weight:800; font-size:0.7rem;">VERIFIED</span>
                </td>
                <td style="padding:10px; text-align:right; white-space:nowrap;">
                  <button class="btn btn-sm dash-view-prop-btn" data-id="${p.id}" style="background:#F1F5F9; color:#0F172A; border:none; padding:4px 10px; border-radius:6px; cursor:pointer;">View Page</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ==========================================================================
   2. PROFOLIO SECTIONED ADD PROPERTY FORM (As Shown in Screenshot #2)
   ========================================================================== */
function renderProFolioAddPropertyForm(state) {
  return `
    <div style="max-width:1150px; margin:0 auto; padding-bottom:2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
        <div>
          <h2 style="font-size:1.4rem; font-weight:800; color:#0F172A; margin:0;">Post Property Listing</h2>
          <p style="font-size:0.85rem; color:#64748B; margin-top:3px;">Publish your property live on Pakistan's #1 Sarmayadar Portal.</p>
        </div>
        <span class="badge" style="background:#ECFDF5; color:#059669; font-weight:800; padding:6px 14px; border-radius:20px; font-size:0.78rem;">
          ⚡ Instant AI Verified
        </span>
      </div>

      <!-- Main Form Grid (2 Columns on Desktop) -->
      <div class="profolio-form-main-grid" style="display:grid; grid-template-columns: 1.2fr 1fr; gap:1.25rem;">
        
        <!-- Left Column: Details & Description -->
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <!-- Card 1: Purpose, Type & Location -->
          <div class="profolio-form-section" style="padding:1.25rem; margin-bottom:0;">
            <div class="profolio-form-section-header" style="margin-bottom:1rem;">
              <div class="profolio-section-icon" style="width:36px; height:36px; font-size:0.9rem;">${renderIcon('map-pin', 18)}</div>
              <div>
                <div class="profolio-section-title" style="font-size:1rem;">Location & Purpose</div>
                <div class="profolio-section-desc" style="font-size:0.78rem;">Property purpose, type, city and exact society address.</div>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.9rem;">
              <div>
                <label style="font-weight:700; font-size:0.8rem; display:block; margin-bottom:5px; color:#1E293B;">Select Purpose</label>
                <div style="display:flex; gap:8px;">
                  <label style="flex:1; text-align:center; background:#ECFDF5; border:2px solid #059669; padding:8px 12px; border-radius:8px; font-weight:700; color:#059669; cursor:pointer; font-size:0.85rem;">
                    <input type="radio" name="wiz_purpose" value="Sale" checked /> For Sale
                  </label>
                  <label style="flex:1; text-align:center; background:#F8FAFC; border:1px solid #CBD5E1; padding:8px 12px; border-radius:8px; font-weight:700; color:#64748B; cursor:pointer; font-size:0.85rem;">
                    <input type="radio" name="wiz_purpose" value="Rent" /> For Rent
                  </label>
                </div>
              </div>

              <div class="profolio-form-sub-grid" style="display:grid; grid-template-columns:1fr 1.2fr; gap:0.75rem;">
                <div>
                  <label style="font-weight:700; font-size:0.8rem; display:block; margin-bottom:5px; color:#1E293B;">Property Type</label>
                  <select id="wiz_type" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700; font-size:0.85rem;">
                    <option value="house">House / Villa</option>
                    <option value="plot">Residential Plot</option>
                    <option value="commercial">Commercial Shop / Office</option>
                    <option value="apartment">Luxury Apartment</option>
                  </select>
                </div>
                <div>
                  <label style="font-weight:700; font-size:0.8rem; display:block; margin-bottom:5px; color:#1E293B;">City</label>
                  <select id="wiz_city" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700; font-size:0.85rem;">
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                  </select>
                </div>
              </div>

              <div>
                <label style="font-weight:700; font-size:0.8rem; display:block; margin-bottom:5px; color:#1E293B;">Society / Area Location <span style="color:#EF4444;">*</span></label>
                <input type="text" id="wiz_location" placeholder="e.g. Phase 6, DHA Lahore" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1; font-size:0.88rem;" />
              </div>
            </div>
          </div>

          <!-- Card 2: Price, Size & Specs -->
          <div class="profolio-form-section" style="padding:1.25rem; margin-bottom:0;">
            <div class="profolio-form-section-header" style="margin-bottom:1rem;">
              <div class="profolio-section-icon" style="width:36px; height:36px; font-size:0.9rem;">${renderIcon('dollar-sign', 18)}</div>
              <div>
                <div class="profolio-section-title" style="font-size:1rem;">Price, Size & Features</div>
                <div class="profolio-section-desc" style="font-size:0.78rem;">Demand price, land size and specs.</div>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.9rem;">
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                <div>
                  <label style="font-weight:700; font-size:0.8rem; display:block; margin-bottom:5px; color:#1E293B;">Area Size (Marla) <span style="color:#EF4444;">*</span></label>
                  <input type="number" id="wiz_size" placeholder="e.g. 10" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1; font-size:0.88rem;" />
                </div>
                <div>
                  <label style="font-weight:700; font-size:0.8rem; display:block; margin-bottom:5px; color:#1E293B;">Asking Price (PKR) <span style="color:#EF4444;">*</span></label>
                  <input type="number" id="wiz_price" placeholder="e.g. 35000000" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1; font-size:0.88rem;" />
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                <div>
                  <label style="font-weight:700; font-size:0.8rem; display:block; margin-bottom:5px; color:#1E293B;">Bedrooms</label>
                  <select id="wiz_beds" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1; font-size:0.85rem;">
                    <option value="3">3 Bedrooms</option>
                    <option value="4" selected>4 Bedrooms</option>
                    <option value="5">5 Bedrooms</option>
                    <option value="6">6+ Bedrooms</option>
                  </select>
                </div>
                <div>
                  <label style="font-weight:700; font-size:0.8rem; display:block; margin-bottom:5px; color:#1E293B;">Bathrooms</label>
                  <select id="wiz_baths" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1; font-size:0.85rem;">
                    <option value="3">3 Bathrooms</option>
                    <option value="4">4 Bathrooms</option>
                    <option value="5" selected>5 Bathrooms</option>
                    <option value="6">6+ Bathrooms</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Photos, Title & Submit -->
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <!-- Card 3: Title, Description & Photos -->
          <div class="profolio-form-section" style="padding:1.25rem; margin-bottom:0;">
            <div class="profolio-form-section-header" style="margin-bottom:1rem;">
              <div class="profolio-section-icon" style="width:36px; height:36px; font-size:0.9rem;">${renderIcon('camera', 18)}</div>
              <div>
                <div class="profolio-section-title" style="font-size:1rem;">Listing Title, Description & Photos</div>
                <div class="profolio-section-desc" style="font-size:0.78rem;">Attract buyers with photos and detailed highlights.</div>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.9rem;">
              <div>
                <label style="font-weight:700; font-size:0.8rem; display:block; margin-bottom:5px; color:#1E293B;">Property Title <span style="color:#EF4444;">*</span></label>
                <input type="text" id="wiz_title" placeholder="e.g. Brand New 10 Marla Modern Designer House For Sale" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1; font-size:0.88rem;" />
              </div>

              <div>
                <label style="font-weight:700; font-size:0.8rem; display:block; margin-bottom:5px; color:#1E293B;">Detailed Description</label>
                <textarea id="wiz_desc" rows="3" placeholder="Describe key woodwork, fittings, solar system, park facing, nearby schools..." style="width:100%; padding:10px 12px; border-radius:8px; border:1px solid #CBD5E1; font-family:inherit; font-size:0.85rem; line-height:1.4; resize:vertical;"></textarea>
              </div>

              <!-- Compact Drag and Dropzone -->
              <div style="border:2px dashed #059669; background:#ECFDF5; padding:1.25rem 1rem; border-radius:10px; text-align:center; cursor:pointer; transition:background 0.2s;" id="image-drag-drop-zone">
                <div style="color:#059669; font-weight:800; font-size:0.9rem;">📷 Drag & Drop or Click to Upload Photos</div>
                <div style="font-size:0.75rem; color:#64748B; margin-top:3px;">PNG, JPG up to 10MB (Watermark Applied Automatically)</div>
                <input type="file" id="wiz-file-input" multiple accept="image/*" style="display:none;" />
              </div>

              <!-- Image Previews Container -->
              <div id="wiz-image-previews" style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.5rem;">
                ${renderImagePreviewsList(state.uploadedImages || [])}
              </div>
            </div>
          </div>

          <!-- Sticky / Prominent Action Bar -->
          <div style="background:#ffffff; border-radius:14px; border:1px solid #E2E8F0; padding:1.25rem; display:flex; flex-direction:column; gap:0.75rem; box-shadow:0 4px 12px rgba(0,0,0,0.04);">
            <button class="profolio-btn-post" id="publish-property-submit-btn" style="width:100%; justify-content:center; padding:12px 24px; font-size:1rem; border-radius:10px;">
              🚀 Publish Property Live
            </button>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:#64748B;">
              <span>🔒 256-bit Encrypted Transmission</span>
              <span>✅ Instant Public Directory View</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

/* ==========================================================================
   3. PROFOLIO LISTINGS MANAGER (As Shown in Screenshot #3)
   ========================================================================== */
function renderProFolioListingsManager(properties, user, state) {
  const isDealer = user.role === 'DEALER';
  const userProps = isDealer ? properties.filter(p => p.agency?.email === user.email || p.agency?.agentName === user.name) : properties;

  return `
    <div class="profolio-card">
      <div class="profolio-card-header">
        <h3 class="profolio-card-title">Manage Property Listings</h3>
        <button class="profolio-btn-post" id="dash-post-listing-btn">+ Post New Listing</button>
      </div>

      <!-- Status Tabs Bar -->
      <div class="profolio-status-tabs">
        <button class="profolio-status-tab active">Active (${userProps.length})</button>
        <button class="profolio-status-tab">Pending (0)</button>
        <button class="profolio-status-tab">Rejected (0)</button>
        <button class="profolio-status-tab">Expired (0)</button>
      </div>

      <div class="profolio-table-wrapper" style="overflow-x:auto; -webkit-overflow-scrolling:touch; width:100%; border-radius:10px; border:1px solid #E2E8F0;">
        <table class="profolio-table" style="width:100%; min-width:580px; border-collapse:collapse; text-align:left; font-size:0.85rem;">
          <thead>
            <tr style="background:#F8FAFC; border-bottom:2px solid #E2E8F0; color:#64748B;">
              <th style="padding:12px;">ID</th>
              <th style="padding:12px;">Property Details</th>
              <th style="padding:12px;">Purpose</th>
              <th style="padding:12px;">Price</th>
              <th style="padding:12px;">Status</th>
              <th style="padding:12px; text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${userProps.map(p => `
              <tr style="border-bottom:1px solid #E2E8F0;">
                <td style="padding:12px; font-weight:800; color:#64748B;">#${p.id}</td>
                <td style="padding:12px; display:flex; align-items:center; gap:10px;">
                  <img src="${p.images[0]}" style="width:48px; height:48px; border-radius:8px; object-fit:cover;" />
                  <div>
                    <div style="font-weight:700; color:#0F172A;">${p.title}</div>
                    <div style="font-size:0.75rem; color:#64748B;">${p.location}, ${p.city}</div>
                  </div>
                </td>
                <td style="padding:12px; font-weight:700;">${p.purpose}</td>
                <td style="padding:12px; font-weight:800; color:#059669;">${formatPKR(p.price)}</td>
                <td style="padding:12px;"><span class="badge" style="background:#ECFDF5; color:#059669; font-weight:800;">ACTIVE</span></td>
                <td style="padding:12px; text-align:right;">
                  <button class="btn btn-sm dash-view-prop-btn" data-id="${p.id}" style="background:#059669; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">View Page</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderProFolioSavedProperties(properties, favIds) {
  const savedProps = properties.filter(p => (favIds || []).includes(p.id));

  return `
    <div class="profolio-card">
      <div class="profolio-card-header">
        <h3 class="profolio-card-title">Saved & Favorite Properties</h3>
      </div>

      ${savedProps.length === 0 ? `
        <div style="text-align:center; padding:3rem 1rem;">
          <div style="font-size:2.5rem; margin-bottom:1rem;">❤️</div>
          <h4 style="font-weight:800; color:#0F172A;">No Saved Properties Yet</h4>
          <p style="color:#64748B; font-size:0.85rem; margin-top:4px;">Click the heart icon on any property card to save it here for quick access.</p>
        </div>
      ` : `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
          ${savedProps.map(p => `
            <div style="border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#ffffff;">
              <img src="${p.images[0]}" style="width:100%; height:160px; object-fit:cover;" />
              <div style="padding:1rem;">
                <h4 style="font-weight:800; font-size:0.95rem; color:#0F172A;">${p.title}</h4>
                <div style="color:#059669; font-weight:800; font-size:1.1rem; margin-top:4px;">${formatPKR(p.price)}</div>
                <button class="btn btn-sm dash-view-prop-btn" data-id="${p.id}" style="width:100%; margin-top:10px; background:#059669; color:#fff; border-radius:6px;">View Details</button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function renderProFolioInquiriesInbox(leads) {
  return `
    <div class="profolio-card">
      <div class="profolio-card-header">
        <h3 class="profolio-card-title">Inquiries & Customer Leads Inbox</h3>
      </div>

      <div class="profolio-table-wrapper" style="overflow-x:auto; -webkit-overflow-scrolling:touch; width:100%; border-radius:10px; border:1px solid #E2E8F0;">
        <table class="profolio-table" style="width:100%; min-width:580px; border-collapse:collapse; text-align:left; font-size:0.85rem;">
          <thead>
            <tr style="background:#F8FAFC; border-bottom:2px solid #E2E8F0; color:#64748B;">
              <th style="padding:10px;">Client Name</th>
              <th style="padding:10px;">Phone / Contact</th>
              <th style="padding:10px;">Property Interest</th>
              <th style="padding:10px;">Message</th>
              <th style="padding:10px;">Stage</th>
            </tr>
          </thead>
          <tbody>
            ${leads.map(l => `
              <tr style="border-bottom:1px solid #E2E8F0;">
                <td style="padding:10px; font-weight:700; color:#0F172A;">${l.clientName || 'Inquirer'}</td>
                <td style="padding:10px; color:#059669; font-weight:700;">${l.phone || '+92 300 0000000'}</td>
                <td style="padding:10px; font-weight:700;">${l.propertyTitle || 'General Inquiry'}</td>
                <td style="padding:10px; color:#64748B;">${l.notes || 'Is this property still available?'}</td>
                <td style="padding:10px;"><span class="badge" style="background:#DBEAFE; color:#1E40AF; font-weight:800;">${l.stage || 'New'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderProFolioUsersManager(users) {
  return `
    <div class="profolio-card">
      <div class="profolio-card-header">
        <h3 class="profolio-card-title">Master User Accounts Manager</h3>
      </div>

      <div class="profolio-table-wrapper" style="overflow-x:auto; -webkit-overflow-scrolling:touch; width:100%; border-radius:10px; border:1px solid #E2E8F0;">
        <table class="profolio-table" style="width:100%; min-width:520px; border-collapse:collapse; text-align:left; font-size:0.85rem;">
          <thead>
            <tr style="background:#F8FAFC; border-bottom:2px solid #E2E8F0; color:#64748B;">
              <th style="padding:10px;">User Name</th>
              <th style="padding:10px;">Email</th>
              <th style="padding:10px;">Role</th>
              <th style="padding:10px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr style="border-bottom:1px solid #E2E8F0;">
                <td style="padding:10px; font-weight:700;">${u.name}</td>
                <td style="padding:10px; color:#64748B;">${u.email}</td>
                <td style="padding:10px;"><span class="badge" style="background:#059669; color:#fff;">${u.role}</span></td>
                <td style="padding:10px; color:#059669; font-weight:800;">Active</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderProFolioDealersManager() {
  return `
    <div class="profolio-card">
      <div class="profolio-card-header">
        <h3 class="profolio-card-title">Verified Dealers & Agency Directory</h3>
      </div>
      <p style="font-size:0.85rem; color:#64748B;">Manage verified dealer badges, agency contacts, and platform commissions.</p>
    </div>
  `;
}

function renderProFolioApprovalsQueue(properties, state = {}) {
  const pendingInvoice = state.generatedInvoice || {
    invoiceId: 'INV-2026-89124',
    customerName: 'Umair Arshad (Verified Dealer)',
    customerPhone: '+923297543852',
    customerEmail: 'umair@sarmayadar.com',
    agencyName: 'Al-Rehman Estate & Builders',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    package: {
      name: 'Pro Gold Agency Package',
      price: 24999,
      period: 'Per Month'
    }
  };

  return `
    <!-- ADVERTISER PACKAGE ACTIVATION QUEUE (FOR ADMIN) -->
    <div class="profolio-card" style="border: 2px solid #059669; background: #F0FDF4; margin-bottom: 1.5rem;">
      <div class="profolio-card-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 class="profolio-card-title" style="color:#064E3B; display:flex; align-items:center; gap:8px;">
            <span>⚡</span> Advertiser Package Activation Queue (Admin Approval)
          </h3>
          <p style="font-size:0.85rem; color:#047857; margin-top:4px; font-weight:600;">
            Review pending payment invoices transferred via Nayapay (+923297543852) and click approve to activate package quotas & features for advertisers.
          </p>
        </div>
        <span class="badge" style="background:#064E3B; color:#FFFFFF; font-size:0.75rem; font-weight:800; padding:6px 12px; border-radius:20px;">
          ADMIN CONTROL CENTER
        </span>
      </div>

      <div style="background:#FFFFFF; border:1px solid #A7F3D0; border-radius:12px; padding:1.25rem; margin-top:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; border-bottom:1px solid #E2E8F0; padding-bottom:1rem; margin-bottom:1rem;">
          <div>
            <span style="font-family:monospace; font-weight:900; color:#059669; font-size:1.05rem;">${pendingInvoice.invoiceId}</span>
            <div style="font-weight:900; font-size:1.15rem; color:#0F172A; margin-top:2px;">${pendingInvoice.package.name}</div>
            <div style="font-size:0.85rem; color:#475569;">Customer: <strong>${pendingInvoice.customerName}</strong> (${pendingInvoice.customerPhone})</div>
            <div style="font-size:0.82rem; color:#64748B;">Agency: ${pendingInvoice.agencyName || 'Estate Agency'}</div>
          </div>

          <div style="text-align:right;">
            <div style="font-size:1.3rem; font-weight:900; color:#064E3B;">PKR ${(pendingInvoice.package.price || 24999).toLocaleString()}</div>
            <span class="badge" style="background:#FEF3C7; color:#D97706; border:1px solid #FCD34D; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:12px; margin-top:4px; display:inline-block;">
              ⏳ PENDING VERIFICATION
            </span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="font-size:0.85rem; color:#047857; font-weight:700;">
            💳 Payment Destination: <strong>Nayapay (+923297543852) - Umair Arshad</strong>
          </div>
          
          <button type="button" id="btn-admin-activate-package" class="btn" style="background:#059669; color:#FFFFFF; font-weight:900; font-size:0.92rem; padding:10px 20px; border-radius:10px; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(5,150,105,0.3);">
            ${renderIcon('check-circle', 18)} ✅ Verify & Activate Package
          </button>
        </div>
      </div>
    </div>

    <div class="profolio-card">
      <div class="profolio-card-header">
        <h3 class="profolio-card-title">Platform Property Approvals Queue</h3>
      </div>
      <p style="font-size:0.85rem; color:#059669; font-weight:700;">✅ All current listings are verified and approved for live display.</p>
    </div>
  `;
}

/* ==========================================================================
   4. PROFOLIO SETTINGS VIEW (As Shown in Screenshot #5)
   ========================================================================== */
function renderProFolioSettingsView(user, state = {}) {
  const subTab = state.settingsSubTab || 'info';

  return `
    <div class="profolio-settings-layout">
      <!-- Left Sub-Sidebar -->
      <div class="profolio-sub-nav">
        <button type="button" class="profolio-sub-link ${subTab === 'info' ? 'active' : ''}" data-settings-tab="info">
          ${renderIcon('user', 16)} User Settings
        </button>
        <button type="button" class="profolio-sub-link ${subTab === 'preferences' ? 'active' : ''}" data-settings-tab="preferences">
          ${renderIcon('sliders', 16)} Preferences
        </button>
        <button type="button" class="profolio-sub-link ${subTab === 'password' ? 'active' : ''}" data-settings-tab="password">
          ${renderIcon('key', 16)} Change Password
        </button>
      </div>

      <!-- Right Form Card -->
      <div class="profolio-card" style="margin-bottom:0;">
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #E2E8F0;">
          <div style="position:relative;">
            <img src="${user.avatar || user.logo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" style="width:65px; height:65px; border-radius:50%; object-fit:cover; border:2.5px solid #059669;" />
          </div>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div>
                <h3 style="font-size:1.1rem; font-weight:800; color:#0F172A; margin:0;">${user.name} <span class="badge" style="background:#ECFDF5; color:#059669; font-size:0.7rem; vertical-align:middle;">${user.role || 'USER'}</span></h3>
                <div style="font-size:0.82rem; color:#64748B;">${user.email}</div>
              </div>
              <div>
                <button type="button" id="user-profile-change-photo-btn" class="profolio-btn-action" style="padding:6px 14px; border-radius:20px; background:#ECFDF5; border:1px solid #A7F3D0; color:#059669; font-weight:800; font-size:0.82rem; cursor:pointer;">
                  📷 Change Profile Photo
                </button>
                <input type="file" id="user-profile-photo-input" accept="image/*" style="display:none;" />
              </div>
            </div>
          </div>
        </div>

        ${subTab === 'preferences' ? `
          <h4 style="font-size:1rem; font-weight:800; color:#0F172A; margin-bottom:1.25rem;">Account & Portal Preferences</h4>
          <form id="dash-preferences-form">
            <div style="margin-bottom:1.25rem;">
              <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:6px;">Default Property Size Unit</label>
              <select id="pref_unit" style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;">
                <option value="marla" ${state.unit === 'marla' ? 'selected' : ''}>Marla & Kanal (Pakistan Standard)</option>
                <option value="sqft" ${state.unit === 'sqft' ? 'selected' : ''}>Square Feet (Sq. Ft.)</option>
              </select>
            </div>
            <div style="margin-bottom:1.25rem;">
              <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:6px;">Notification Preferences</label>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; font-weight:700;">
                  <input type="checkbox" checked /> Email alerts for new customer inquiries
                </label>
                <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; font-weight:700;">
                  <input type="checkbox" checked /> WhatsApp instant updates for lead contacts
                </label>
              </div>
            </div>
            <div style="text-align:right; margin-top:1.5rem;">
              <button type="submit" id="save-preferences-btn" class="profolio-btn-post" style="padding:10px 24px;">Save Preferences</button>
            </div>
          </form>
        ` : subTab === 'password' ? `
          <h4 style="font-size:1rem; font-weight:800; color:#0F172A; margin-bottom:1.25rem;">Change Account Password</h4>
          <form id="dash-password-form">
            <div style="margin-bottom:1rem;">
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px;">Current Password</label>
              <input type="password" id="pass_current" placeholder="Enter Current Password" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
            </div>
            <div style="margin-bottom:1rem;">
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px;">New Password</label>
              <input type="password" id="pass_new" placeholder="Enter Minimum 6 Characters" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
            </div>
            <div style="margin-bottom:1.5rem;">
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px;">Confirm New Password</label>
              <input type="password" id="pass_confirm" placeholder="Re-enter New Password" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
            </div>
            <div style="text-align:right;">
              <button type="submit" id="save-password-btn" class="profolio-btn-post" style="padding:10px 24px; background:#059669;">Update Password</button>
            </div>
          </form>
        ` : `
          <h4 style="font-size:1rem; font-weight:800; color:#0F172A; margin-bottom:1.25rem;">Additional Information & Profile Picture</h4>

          <form id="dash-settings-form">
            <div style="margin-bottom:1rem;">
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px;">Profile Avatar / Logo Photo URL</label>
              <input type="text" id="set_avatar" value="${user.avatar || user.logo || ''}" placeholder="Paste image URL or use Change Photo button above" style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1rem;">
              <div>
                <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px;">Name</label>
                <input type="text" id="set_name" value="${user.name || ''}" style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
              </div>
              <div>
                <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px;">Email</label>
                <input type="email" id="set_email" value="${user.email || ''}" disabled style="width:100%; padding:10px; border-radius:8px; border:1px solid #E2E8F0; background:#F8FAFC; color:#64748B;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1rem;">
              <div>
                <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px;">Mobile</label>
                <div style="display:flex;">
                  <span style="padding:10px 12px; background:#F1F5F9; border:1px solid #CBD5E1; border-right:none; border-radius:8px 0 0 8px; font-weight:700; color:#0F172A;">🇵🇰 +92</span>
                  <input type="text" id="set_phone" value="${(user.phone || '').replace('+92', '').trim()}" style="width:100%; padding:10px; border-radius:0 8px 8px 0; border:1px solid #CBD5E1;" />
                </div>
              </div>
              <div>
                <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px;">WhatsApp</label>
                <div style="display:flex;">
                  <span style="padding:10px 12px; background:#F1F5F9; border:1px solid #CBD5E1; border-right:none; border-radius:8px 0 0 8px; font-weight:700; color:#0F172A;">🇵🇰 +92</span>
                  <input type="text" id="set_whatsapp" value="${(user.whatsapp || user.phone || '').replace('+92', '').trim()}" style="width:100%; padding:10px; border-radius:0 8px 8px 0; border:1px solid #CBD5E1;" />
                </div>
              </div>
            </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1rem;">
            <div>
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px;">City</label>
              <select id="set_city" style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;">
                <option value="Lahore" ${user.city === 'Lahore' ? 'selected' : ''}>Lahore</option>
                <option value="Karachi" ${user.city === 'Karachi' ? 'selected' : ''}>Karachi</option>
                <option value="Islamabad" ${user.city === 'Islamabad' ? 'selected' : ''}>Islamabad</option>
              </select>
            </div>
            <div>
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px;">Address</label>
              <input type="text" id="set_address" value="${user.address || ''}" placeholder="Enter Address" style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
            </div>
          </div>

          <div style="text-align:right; margin-top:1.5rem;">
            <button type="submit" id="save-user-settings-btn" class="profolio-btn-post" style="padding:10px 24px;">
              Save Changes
            </button>
          </div>
        </form>
        `}
      </div>
    </div>
  `;
}

function renderProFolioMegaProjectsStudio(user, state) {
  const isUnlocked = hasFeatureAccess(user, 'mega-projects');
  const megaProjects = state.megaProjects || [
    {
      id: 'mp-1',
      projectName: 'Pearl One Courtyard (Towers 1, 2 & 3)',
      developerName: 'ABS Developers',
      location: 'Bahria Town',
      city: 'Lahore',
      minPrice: 8500000,
      maxPrice: 38000000,
      totalUnits: 450,
      status: 'approved',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80']
    },
    {
      id: 'mp-2',
      projectName: 'ABS Mall & Residency',
      developerName: 'ABS Developers',
      location: 'Main Ring Road Interchange',
      city: 'Lahore',
      minPrice: 6500000,
      maxPrice: 29000000,
      totalUnits: 180,
      status: 'approved',
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80']
    },
    {
      id: 'mp-3',
      projectName: 'Burj Quaid',
      developerName: 'ABS Developers',
      location: 'DHA City',
      city: 'Karachi',
      minPrice: 25000000,
      maxPrice: 120000000,
      totalUnits: 250,
      status: 'approved',
      images: ['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80']
    }
  ];

  return `
    ${!isUnlocked ? renderFeatureLockOverlay('Mega Projects Studio', 'Pro Gold Agency') : ''}
    <div class="profolio-card" style="${!isUnlocked ? 'opacity: 0.6; pointer-events: none; filter: grayscale(0.2);' : ''}">
      <div class="profolio-card-header">
        <div>
          <h3 class="profolio-card-title">Mega Projects Studio</h3>
          <p style="font-size:0.82rem; color:#64748B; margin-top:4px;">Manage developer megaprojects, commercial towers, housing societies, and payment plans.</p>
        </div>
        <button type="button" class="profolio-btn-post" id="add-mega-project-modal-btn" ${!isUnlocked ? 'disabled' : ''}>
          ${renderIcon('plus-circle', 16, '#FFF')} + Create Mega Project
        </button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
        ${megaProjects.map(mp => `
          <div style="border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFF; box-shadow:0 2px 4px rgba(0,0,0,0.04);">
            <img src="${mp.images[0]}" style="width:100%; height:160px; object-fit:cover;" />
            <div style="padding:1rem;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <h4 style="font-weight:800; font-size:1rem; color:#0F172A;">${mp.projectName}</h4>
                <span class="badge" style="background:#ECFDF5; color:#059669; font-size:0.68rem;">${mp.status.toUpperCase()}</span>
              </div>
              <div style="font-size:0.8rem; color:#059669; font-weight:700; margin-top:2px;">🏗️ ${mp.developerName}</div>
              <div style="font-size:0.8rem; color:#64748B; margin-top:4px;">📍 ${mp.location}, ${mp.city}</div>
              <div style="margin-top:10px; font-weight:800; color:#064E3B; font-size:0.95rem;">
                ${formatPKR(mp.minPrice)} - ${formatPKR(mp.maxPrice)}
              </div>
              <div style="display:flex; gap:8px; margin-top:12px;">
                <button type="button" class="btn btn-sm dash-edit-mega-project-btn" data-id="${mp.id}" style="flex:1; background:#F1F5F9; color:#0F172A; font-weight:700; border-radius:6px; display:flex; align-items:center; justify-content:center; gap:4px;">
                  ${renderIcon('edit-3', 14)} Edit
                </button>
                <button type="button" class="btn btn-sm dash-delete-mega-project-btn" data-id="${mp.id}" style="background:#FEF2F2; color:#DC2626; font-weight:700; border-radius:6px; display:flex; align-items:center; justify-content:center; gap:4px; padding:6px 12px;">
                  ${renderIcon('trash-2', 14)} Delete
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    ${state.showMegaProjectModal ? `
      <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:9999;">
        <div style="background:#FFF; border-radius:16px; width:90%; max-width:600px; max-height:90vh; overflow-y:auto; padding:1.5rem; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-bottom:0.75rem; border-bottom:1px solid #E2E8F0;">
            <h3 style="font-size:1.1rem; font-weight:800; color:#0F172A;">${state.editingMegaProject ? 'Edit Mega Project' : 'Create New Mega Project'}</h3>
            <button type="button" id="close-mega-project-modal-btn" style="background:none; border:none; font-size:1.4rem; cursor:pointer; color:#64748B;">✕</button>
          </div>
          <form id="save-mega-project-form">
            <input type="hidden" id="mp_id" value="${state.editingMegaProject?.id || ''}" />
            <div style="margin-bottom:1rem;">
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:4px;">Project Name</label>
              <input type="text" id="mp_name" value="${state.editingMegaProject?.projectName || ''}" required placeholder="e.g. Bahria Town Commercial Heights" style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
            </div>
            <div style="margin-bottom:1rem;">
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:4px;">Developer Name</label>
              <input type="text" id="mp_dev" value="${state.editingMegaProject?.developerName || ''}" required placeholder="e.g. Bahria Town Pvt Ltd" style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
              <div>
                <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:4px;">City</label>
                <select id="mp_city" style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;">
                  <option value="Lahore" ${state.editingMegaProject?.city === 'Lahore' ? 'selected' : ''}>Lahore</option>
                  <option value="Karachi" ${state.editingMegaProject?.city === 'Karachi' ? 'selected' : ''}>Karachi</option>
                  <option value="Islamabad" ${state.editingMegaProject?.city === 'Islamabad' ? 'selected' : ''}>Islamabad</option>
                </select>
              </div>
              <div>
                <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:4px;">Location / Sector</label>
                <input type="text" id="mp_location" value="${state.editingMegaProject?.location || ''}" required placeholder="e.g. Sector F, DHA Phase 6" style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
              <div>
                <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:4px;">Min Price (PKR)</label>
                <input type="number" id="mp_min_price" value="${state.editingMegaProject?.minPrice || 5000000}" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
              </div>
              <div>
                <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:4px;">Max Price (PKR)</label>
                <input type="number" id="mp_max_price" value="${state.editingMegaProject?.maxPrice || 35000000}" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;" />
              </div>
            </div>
            <div style="margin-bottom:1rem;">
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:4px;">Project Description</label>
              <textarea id="mp_desc" rows="3" required placeholder="Describe amenities, installment plans and available units" style="width:100%; padding:10px; border-radius:8px; border:1px solid #CBD5E1;">${state.editingMegaProject?.description || 'Modern commercial heights featuring luxury shops and executive suites with 3 year easy installment plans.'}</textarea>
            </div>
            
            <!-- Mega Project Photo Upload Section -->
            <div style="margin-bottom:1.25rem;">
              <label style="font-weight:700; font-size:0.82rem; display:block; margin-bottom:6px; color:#0F172A;">
                📷 Upload Project Photos <span style="color:#059669; font-weight:700;">(Required / High Quality Renderings)</span>
              </label>
              <div id="mp-image-drag-drop-zone" style="border:2px dashed #059669; border-radius:10px; padding:1.25rem 1rem; text-align:center; background:#F0FDF4; cursor:pointer; transition:all 0.2s ease;">
                <div style="width:38px; height:38px; border-radius:50%; background:#DCFCE7; display:inline-flex; align-items:center; justify-content:center; margin:0 auto 0.5rem auto;">
                  ${renderIcon('upload-cloud', 20, '#059669')}
                </div>
                <p style="font-weight:800; color:#064E3B; margin-bottom:0.25rem; font-size:0.88rem;">
                  Click to Browse Computer Gallery or Drag & Drop Photos
                </p>
                <span style="font-size:0.75rem; color:#64748B; display:block;">Select JPG, PNG or WebP images from your device</span>
                <input type="file" id="mp_file_input" accept="image/*" multiple style="display:none;" />
              </div>

              <div style="margin-top:8px; display:flex; gap:8px;">
                <input type="text" id="mp_image_url" placeholder="Or paste Photo URL (e.g. https://images.unsplash.com/photo...)" style="flex:1; padding:8px 12px; border-radius:8px; border:1px solid #CBD5E1; font-size:0.82rem;" />
                <button type="button" id="add-mp-url-photo-btn" style="padding:6px 14px; background:#ECFDF5; border:1px solid #A7F3D0; color:#059669; font-weight:800; font-size:0.8rem; border-radius:8px; cursor:pointer;">+ Add URL Photo</button>
              </div>

              <div id="mp-image-previews" style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.75rem;">
                ${renderMpImagePreviewsList(state.mpUploadedImages || state.editingMegaProject?.images || [])}
              </div>
            </div>

            <div style="text-align:right;">
              <button type="submit" id="save-mega-project-btn" class="profolio-btn-post" style="padding:10px 24px;">${state.editingMegaProject ? 'Save Changes' : 'Create Mega Project'}</button>
            </div>
          </form>
        </div>
      </div>
    ` : ''}
  `;
}

function renderMpImagePreviewsList(images = []) {
  if (!images || images.length === 0) {
    return `<div style="font-size:0.8rem; color:#64748B; font-style:italic;">No project images added yet. Click above to select photos from your device gallery.</div>`;
  }
  return images.map((imgUrl, index) => `
    <div style="position:relative; width:80px; height:80px; border-radius:8px; overflow:hidden; border:1.5px solid #CBD5E1; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
      <img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Mega Project photo ${index + 1}" />
      <button type="button" class="remove-mp-img-btn" data-index="${index}" style="position:absolute; top:3px; right:3px; background:rgba(220,38,38,0.9); color:white; border:none; border-radius:50%; width:18px; height:18px; font-size:11px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Remove photo">&times;</button>
    </div>
  `).join('');
}

function renderProFolioSubscriptionsManager(user, properties) {
  const activeCount = properties.filter(p => p.status === 'active').length;
  const isLimitReached = activeCount >= 25;

  return `
    <div class="profolio-card">
      <div class="profolio-card-header">
        <div>
          <h3 class="profolio-card-title">Dealer Subscription & Quota Limits</h3>
          <p style="font-size:0.82rem; color:#64748B; margin-top:4px;">Track your active plan limits, property quota usage, and upgrade options.</p>
        </div>
        <span class="badge" style="background:#FEF3C7; color:#D97706; font-size:0.85rem; font-weight:800; padding:6px 12px; border-radius:20px;">
          PRO DEALER PLAN
        </span>
      </div>

      <!-- Real-Time Quota Progress Bar -->
      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:1.25rem; margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-weight:800; color:#0F172A; font-size:0.95rem;">Property Listing Quota Usage</div>
          <div style="font-weight:800; color:${isLimitReached ? '#DC2626' : '#059669'}; font-size:0.95rem;">
            ${activeCount} / 25 Listings Used
          </div>
        </div>
        <div style="width:100%; height:10px; background:#E2E8F0; border-radius:5px; overflow:hidden;">
          <div style="width:${Math.min(100, Math.round((activeCount / 25) * 100))}%; height:100%; background:${isLimitReached ? '#DC2626' : '#059669'}; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.78rem; color:#64748B; margin-top:8px;">
          ${isLimitReached ? '⚠️ Subscription listing limit reached! Please upgrade your plan to publish more listings.' : '🟢 You have available quota remaining for new property listings.'}
        </div>
      </div>

      <!-- Subscription Tier Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:1.25rem;">
        <!-- Basic -->
        <div style="border:1px solid #E2E8F0; border-radius:12px; padding:1.25rem; background:#FFF;">
          <div style="font-weight:800; font-size:1.1rem; color:#0F172A;">BASIC PLAN</div>
          <div style="font-size:1.5rem; font-weight:800; color:#059669; margin:6px 0;">PKR 0 <span style="font-size:0.8rem; color:#64748B;">/ free</span></div>
          <ul style="font-size:0.82rem; color:#64748B; margin:1rem 0; padding-left:1.2rem; line-height:1.6;">
            <li>Up to 5 Free Property Listings</li>
            <li>0 Mega Projects</li>
            <li>Basic Portal Support</li>
          </ul>
          <button class="btn btn-sm" disabled style="width:100%; background:#F1F5F9; color:#94A3B8; border-radius:8px; font-weight:700;">Default Plan</button>
        </div>

        <!-- Pro Dealer -->
        <div style="border:2px solid #059669; border-radius:12px; padding:1.25rem; background:#ECFDF5; position:relative;">
          <span style="position:absolute; top:-12px; right:16px; background:#059669; color:#FFF; font-size:0.68rem; font-weight:800; padding:2px 8px; border-radius:10px;">ACTIVE PLAN</span>
          <div style="font-weight:800; font-size:1.1rem; color:#064E3B;">PRO DEALER</div>
          <div style="font-size:1.5rem; font-weight:800; color:#059669; margin:6px 0;">PKR 15,000 <span style="font-size:0.8rem; color:#064E3B;">/ month</span></div>
          <ul style="font-size:0.82rem; color:#064E3B; margin:1rem 0; padding-left:1.2rem; line-height:1.6;">
            <li>Up to 25 Property Listings</li>
            <li>2 Mega Projects Studio</li>
            <li>5 Featured Super Hot Boosts</li>
            <li>Verified Dealer Badge</li>
          </ul>
          <button class="btn btn-sm" style="width:100%; background:#059669; color:#FFF; border-radius:8px; font-weight:800;">Active Plan</button>
        </div>

        <!-- Agency Elite -->
        <div style="border:1px solid #E2E8F0; border-radius:12px; padding:1.25rem; background:#FFF;">
          <div style="font-weight:800; font-size:1.1rem; color:#0F172A;">AGENCY ELITE</div>
          <div style="font-size:1.5rem; font-weight:800; color:#D97706; margin:6px 0;">PKR 45,000 <span style="font-size:0.8rem; color:#64748B;">/ month</span></div>
          <ul style="font-size:0.82rem; color:#64748B; margin:1rem 0; padding-left:1.2rem; line-height:1.6;">
            <li>Up to 100 Property Listings</li>
            <li>10 Mega Projects Studio</li>
            <li>25 Featured Super Hot Boosts</li>
            <li>Dedicated Account Manager</li>
          </ul>
          <button class="btn btn-sm" style="width:100%; background:#D97706; color:#FFF; border-radius:8px; font-weight:800;">Upgrade to Elite</button>
        </div>
      </div>
    </div>
  `;
}

function renderProFolioInvoicesManager(state, user) {
  const activeInvoice = state.generatedInvoice || {
    invoiceId: 'INV-2026-89124',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    dueDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    customerName: user?.name || 'Valued Advertiser',
    customerPhone: user?.phone || '+923297543852',
    customerEmail: user?.email || 'advertiser@sarmayadar.com',
    agencyName: user?.agencyName || 'Verified Agency',
    package: {
      name: 'Pro Gold Agency Package',
      price: 24999,
      period: 'Per Month'
    }
  };

  return `
    <div class="profolio-card">
      <div class="profolio-card-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 class="profolio-card-title">💳 My Invoices & Payment Center</h3>
          <p style="font-size:0.85rem; color:#64748B; margin-top:4px;">
            Pay pending advertising invoices, copy official Nayapay bank transfer details, and activate package subscriptions.
          </p>
        </div>

        <a href="#advertise" data-nav="advertise" class="btn btn-sm" style="background:#F59E0B; color:#0F172A; font-weight:800; padding:8px 16px; border-radius:10px; text-decoration:none;">
          + Buy New Advertising Package
        </a>
      </div>

      <!-- HIGH VISIBILITY BANK TRANSFER CARD -->
      <div style="background:linear-gradient(135deg, #ECFDF5, #D1FAE5); border:2px solid #059669; border-radius:16px; padding:1.5rem; margin-bottom:1.5rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.5rem;">🏦</span>
            <h4 style="font-size:1.1rem; font-weight:900; color:#064E3B; margin:0;">
              Official Nayapay Bank Transfer Details
            </h4>
          </div>
          <span style="background:#064E3B; color:#FFFFFF; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:20px;">
            VERIFIED PAYMENT DESTINATION
          </span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; background:#FFFFFF; padding:1rem 1.25rem; border-radius:12px; border:1px solid #A7F3D0;">
          <div>
            <div style="font-size:0.72rem; font-weight:800; color:#64748B; text-transform:uppercase;">Bank / Mobile Wallet</div>
            <div style="font-size:1.1rem; font-weight:900; color:#0F172A;">Nayapay</div>
          </div>
          <div>
            <div style="font-size:0.72rem; font-weight:800; color:#64748B; text-transform:uppercase;">Account Title</div>
            <div style="font-size:1.1rem; font-weight:900; color:#0F172A;">Umair Arshad</div>
          </div>
          <div>
            <div style="font-size:0.72rem; font-weight:800; color:#64748B; text-transform:uppercase;">Account / Mobile No</div>
            <div style="font-size:1.2rem; font-weight:900; color:#059669; font-family:monospace;">+923297543852</div>
          </div>
        </div>

        <div style="margin-top:1rem; display:flex; gap:10px;">
          <button type="button" id="btn-copy-bank-details" class="btn" style="background:#059669; color:#FFFFFF; font-weight:800; font-size:0.85rem; padding:8px 16px; border-radius:8px; border:none; cursor:pointer;">
            ${renderIcon('copy', 15)} 📋 Copy Account Number (+923297543852)
          </button>
        </div>
      </div>

      <!-- INVOICES TABLE -->
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; overflow:hidden;">
        <div style="padding:1rem 1.25rem; background:#F8FAFC; border-bottom:1px solid #E2E8F0; font-weight:800; color:#0F172A; font-size:0.95rem;">
          Recent Invoices (${state.generatedInvoice ? 1 : 1})
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; text-align:left;">
            <thead>
              <tr style="background:#F1F5F9; font-size:0.78rem; text-transform:uppercase; color:#475569;">
                <th style="padding:12px 16px;">Invoice ID</th>
                <th style="padding:12px 16px;">Package Description</th>
                <th style="padding:12px 16px;">Issue Date</th>
                <th style="padding:12px 16px;">Amount</th>
                <th style="padding:12px 16px;">Status</th>
                <th style="padding:12px 16px; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid #F1F5F9;">
                <td style="padding:16px; font-weight:900; font-family:monospace; color:#059669;">
                  ${activeInvoice.invoiceId}
                </td>
                <td style="padding:16px;">
                  <div style="font-weight:800; color:#0F172A;">${activeInvoice.package.name}</div>
                  <div style="font-size:0.78rem; color:#64748B;">${activeInvoice.package.period || 'Per Month'} Advertising Subscription</div>
                </td>
                <td style="padding:16px; font-size:0.88rem; font-weight:700; color:#475569;">
                  ${activeInvoice.date}
                </td>
                <td style="padding:16px; font-weight:900; color:#064E3B; font-size:1.05rem;">
                  PKR ${activeInvoice.package.price.toLocaleString()}
                </td>
                <td style="padding:16px;">
                  <span class="badge" style="background:#FEF3C7; color:#D97706; border:1px solid #FCD34D; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:12px;">
                    ⏳ PENDING PAYMENT
                  </span>
                </td>
                <td style="padding:16px; text-align:right;">
                  <div style="display:flex; justify-content:flex-end; gap:6px;">
                    <a href="#advertise-invoice" data-nav="advertise-invoice" class="btn btn-sm" style="background:#064E3B; color:#FFFFFF; font-weight:800; padding:6px 12px; border-radius:8px; text-decoration:none; font-size:0.8rem;">
                      🚀 Pay / View Invoice
                    </a>
                    <button type="button" id="btn-confirm-whatsapp-payment" class="btn btn-sm" style="background:#25D366; color:#FFFFFF; font-weight:800; padding:6px 12px; border-radius:8px; border:none; cursor:pointer; font-size:0.8rem;">
                      💬 WhatsApp
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

