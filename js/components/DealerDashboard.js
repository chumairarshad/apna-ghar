import { formatPKR, formatArea } from '../utils/formatters.js';
import { normalizeProperty, normalizeProperties } from '../utils/normalizeProperty.js';
import { getDealerLeads, saveDealerLeads, getAgencyProfile, saveAgencyProfile } from '../utils/storage.js';
import { INITIAL_DEALER_LEADS } from '../data/leads.js';


import { INITIAL_AGENTS } from '../data/agents.js';
import { getDealersFromStorage } from '../utils/storage.js';

export function renderDealerDashboard(rawProperties, state) {
  const properties = normalizeProperties(rawProperties);
  let leads = getDealerLeads();

  if (!leads) {
    leads = INITIAL_DEALER_LEADS;
    saveDealerLeads(leads);
  }

  let agencyProfile = getAgencyProfile(state.user?.email);
  if (!agencyProfile || (state.user?.email && agencyProfile.email !== state.user.email)) {
    agencyProfile = {
      name: state.user?.agencyName || state.user?.name || "My Real Estate Agency",
      leadPerson: state.user?.name || "Verified User",
      city: state.user?.city || "Lahore",
      address: state.user?.address || "Main Office, Pakistan",
      phone: state.user?.phone || "+92 300 0000000",
      whatsapp: state.user?.whatsapp || (state.user?.phone ? state.user.phone.replace(/[^0-9]/g, '') : "923000000000"),
      badge: state.user?.role === 'ADMIN' ? "SUPERVISOR ADMIN" : "VERIFIED DEALER",
      logo: state.user?.avatar || state.user?.logo || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
      bio: state.user?.bio || "",
      email: state.user?.email || ""
    };
    saveAgencyProfile(agencyProfile, state.user?.email);
  }


  const isAdmin = state.user?.role === 'ADMIN';
  const defaultTab = isAdmin ? 'dealers' : 'inventory';
  const activeTab = state.dealerTab || defaultTab;
  
  const dealersList = getDealersFromStorage(INITIAL_AGENTS);
  const totalListings = properties.length;
  const activeLeadsCount = leads.filter(l => l.stage !== 'Closed').length;
  const totalViewsSum = properties.reduce((acc, p) => acc + (p.views || 0), 0);

  return `
    <section class="dealer-portal-section">
      <div class="container">
        <!-- Agency / Admin Banner Header -->
        <div class="dealer-header">
          <div class="agency-brand-info">
            <img src="${agencyProfile.logo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'}" class="agency-logo-large" alt="${agencyProfile.name}" />
            <div class="agency-meta">
              <h2>${agencyProfile.name} 
                <span class="badge badge-verified" style="font-size:0.7rem; vertical-align:middle; background:${isAdmin ? '#EF4444' : 'var(--emerald-teal)'};">
                  ${isAdmin ? 'SUPERVISOR ADMIN' : agencyProfile.badge}
                </span>
              </h2>
              <p><i data-lucide="map-pin" style="width:14px; height:14px; display:inline-block;"></i> ${agencyProfile.address || 'Pakistan Office'}, ${agencyProfile.city}</p>
            </div>
          </div>

          <div>
            ${!isAdmin ? `
              <button class="btn btn-gold" id="dealer-post-btn">
                <i data-lucide="plus-circle" style="width:18px; height:18px;"></i>
                Post New Dealer Listing
              </button>
            ` : `
              <div style="background:var(--marigold); color:var(--forest-dk) !important; padding:0.5rem 1rem; border-radius:8px; border:2px solid var(--marigold-dk); font-weight:800; font-size:0.85rem; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
                Master Administration Mode
              </div>


            `}
          </div>
        </div>

        <!-- KPI Metric Cards -->
        <div class="dealer-kpi-grid">
          ${isAdmin ? `
            <div class="kpi-card">
              <div class="kpi-icon" style="background-color:#FEE2E2; color:#DC2626;"><i data-lucide="shield-check" style="width:24px; height:24px;"></i></div>
              <div class="kpi-data">
                <span class="kpi-value">${dealersList.length}</span>
                <span class="kpi-label">Registered Agencies / Dealers</span>
              </div>
            </div>
          ` : ''}

          <div class="kpi-card">
            <div class="kpi-icon"><i data-lucide="home" style="width:24px; height:24px;"></i></div>
            <div class="kpi-data">
              <span class="kpi-value">${totalListings}</span>
              <span class="kpi-label">Active Listings</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon" style="background-color:#DBEAFE; color:#1E40AF;"><i data-lucide="users" style="width:24px; height:24px;"></i></div>
            <div class="kpi-data">
              <span class="kpi-value">${activeLeadsCount}</span>
              <span class="kpi-label">Client Leads / Inquiries</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon" style="background-color:#FEF3C7; color:#B45309;"><i data-lucide="eye" style="width:24px; height:24px;"></i></div>
            <div class="kpi-data">
              <span class="kpi-value">${totalViewsSum.toLocaleString()}</span>
              <span class="kpi-label">Listing Views</span>
            </div>
          </div>
        </div>

        <!-- Dashboard Navigation Tabs -->
        <div class="dealer-tabs">
          ${isAdmin ? `
            <button class="dealer-tab ${activeTab === 'dealers' ? 'active' : ''}" data-dtab="dealers">
              <i data-lucide="shield-check" style="width:18px; height:18px;"></i> Manage Dealers (${dealersList.length})
            </button>
            <button class="dealer-tab ${activeTab === 'blogs' ? 'active' : ''}" data-dtab="blogs">
              <i data-lucide="book-open" style="width:18px; height:18px;"></i> Blog & Article Studio (${(state.blogsList || []).length})
            </button>
          ` : ''}

          <button class="dealer-tab ${activeTab === 'push' ? 'active' : ''}" data-dtab="push">
            <i data-lucide="smartphone" style="width:18px; height:18px;"></i> Mobile Push Broadcast
          </button>
          <button class="dealer-tab ${activeTab === 'inventory' ? 'active' : ''}" data-dtab="inventory">
            <i data-lucide="layers" style="width:18px; height:18px;"></i> Listing Inventory (${totalListings})
          </button>
          <button class="dealer-tab ${activeTab === 'leads' ? 'active' : ''}" data-dtab="leads">
            <i data-lucide="message-square" style="width:18px; height:18px;"></i> Client Leads CRM (${leads.length})
          </button>
          <button class="dealer-tab ${activeTab === 'analytics' ? 'active' : ''}" data-dtab="analytics">
            <i data-lucide="line-chart" style="width:18px; height:18px;"></i> Performance Analytics
          </button>
          
          <button class="dealer-tab ${activeTab === 'profile' ? 'active' : ''}" data-dtab="profile">
            <i data-lucide="settings" style="width:18px; height:18px;"></i> Profile & Account Settings
          </button>
        </div>

        <!-- Tab Content Views -->
        ${activeTab === 'dealers' && isAdmin ? renderDealersManagementTab(dealersList) : ''}
        ${activeTab === 'blogs' && isAdmin ? renderAdminBlogsTab(state.blogsList || [], state) : ''}
        ${activeTab === 'push' ? renderPushBroadcastTab(state) : ''}
        ${activeTab === 'inventory' ? renderInventoryTab(properties, state) : ''}
        ${activeTab === 'leads' ? renderLeadsCRMTab(leads) : ''}
        ${activeTab === 'analytics' ? renderAnalyticsTab(properties) : ''}
        ${activeTab === 'profile' ? renderProfileSettingsTab(agencyProfile, isAdmin) : ''}
      </div>
    </section>
  `;
}

function renderPushBroadcastTab(state) {
  setTimeout(() => {
    fetch('/api/push/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          const mobEl = document.getElementById('push-stat-mobile');
          const deskEl = document.getElementById('push-stat-desktop');
          const totEl = document.getElementById('push-stat-total');
          if (mobEl) mobEl.innerText = `${data.stats.mobile_count || 0} Phones`;
          if (deskEl) deskEl.innerText = `${data.stats.desktop_count || 0} Devices`;
          if (totEl) totEl.innerText = `${data.stats.total || 0} Total`;
        }
      })
      .catch(err => console.warn('Push stats fetch notice:', err));
  }, 100);

  return `
    <div class="dashboard-card" style="background:#ffffff; border-radius:14px; padding:24px; box-shadow:var(--shadow-md);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px; border-bottom:1px solid #e2e8f0; padding-bottom:16px;">
        <div>
          <h3 style="margin:0 0 4px 0; color:var(--forest-dk); font-size:1.25rem; font-weight:800; display:flex; align-items:center; gap:8px;">
            <i data-lucide="smartphone" style="color:#10b981;"></i> Mobile & Web Push Broadcast Studio
          </h3>
          <p style="margin:0; color:var(--text-muted); font-size:0.88rem;">Send instant notifications to mobile phone subscribers & desktop visitors across Pakistan.</p>
        </div>

        <div style="display:flex; gap:10px;">
          <div style="background:#ECFDF5; border:1px solid #10B981; padding:8px 16px; border-radius:10px; text-align:center;">
            <div style="font-size:0.7rem; color:#059669; font-weight:800; text-transform:uppercase;">Mobile Phone Subs</div>
            <div style="font-size:1.25rem; color:#065F46; font-weight:900;" id="push-stat-mobile">Syncing...</div>
          </div>
          <div style="background:#EFF6FF; border:1px solid #3B82F6; padding:8px 16px; border-radius:10px; text-align:center;">
            <div style="font-size:0.7rem; color:#1D4ED8; font-weight:800; text-transform:uppercase;">Desktop Subs</div>
            <div style="font-size:1.25rem; color:#1E40AF; font-weight:900;" id="push-stat-desktop">Syncing...</div>
          </div>
          <div style="background:#FEF3C7; border:1px solid #F59E0B; padding:8px 16px; border-radius:10px; text-align:center;">
            <div style="font-size:0.7rem; color:#B45309; font-weight:800; text-transform:uppercase;">Total Active</div>
            <div style="font-size:1.25rem; color:#78350F; font-weight:900;" id="push-stat-total">Syncing...</div>
          </div>
        </div>
      </div>

      <form id="admin-broadcast-push-form" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:24px;">
        <h4 style="margin:0 0 16px 0; font-size:1.05rem; color:#0f172a; font-weight:800;">📢 Compose & Dispatch Mobile Push Notification</h4>
        
        <div class="form-group" style="margin-bottom:16px;">
          <label style="font-weight:700; font-size:0.88rem; color:#1e293b; display:block; margin-bottom:6px;">Notification Title *</label>
          <input type="text" id="push-title-input" class="form-control" placeholder="e.g. 🏠 Hot Listing Alert: 1 Kanal House in DHA Lahore Phase 6" required style="width:100%; padding:11px; border-radius:8px; border:1px solid #cbd5e1; font-weight:600;" />
        </div>

        <div class="form-group" style="margin-bottom:16px;">
          <label style="font-weight:700; font-size:0.88rem; color:#1e293b; display:block; margin-bottom:6px;">Message Body *</label>
          <textarea id="push-body-input" class="form-control" rows="3" placeholder="Write compelling notification message to pop up on user phone screens..." required style="width:100%; padding:11px; border-radius:8px; border:1px solid #cbd5e1;"></textarea>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
          <div>
            <label style="font-weight:700; font-size:0.88rem; color:#1e293b; display:block; margin-bottom:6px;">Target Device Audience</label>
            <select id="push-target-select" class="form-control" style="width:100%; padding:11px; border-radius:8px; border:1px solid #cbd5e1; font-weight:600;">
              <option value="all">📱 Mobile Phones & 💻 Desktops (All Active Subscribers)</option>
              <option value="mobile">📱 Mobile Devices Only (Android & iOS PWA)</option>
              <option value="desktop">💻 Desktop Browsers Only</option>
            </select>
          </div>
          <div>
            <label style="font-weight:700; font-size:0.88rem; color:#1e293b; display:block; margin-bottom:6px;">Target URL / Link Path</label>
            <input type="text" id="push-url-input" class="form-control" placeholder="/" value="/" style="width:100%; padding:11px; border-radius:8px; border:1px solid #cbd5e1; font-weight:600;" />
          </div>
        </div>

        <button type="submit" id="btn-send-push-broadcast" style="background:linear-gradient(135deg, #10b981 0%, #059669 100%); color:#ffffff; border:none; padding:12px 28px; border-radius:10px; font-weight:800; font-size:0.95rem; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 14px rgba(16,185,129,0.35); transition:all 0.2s ease;">
          <i data-lucide="send" style="width:18px; height:18px;"></i> Dispatch Mobile Push Alert
        </button>
      </form>
    </div>
  `;
}

function renderDealersManagementTab(dealers) {
  return `
    <div class="dashboard-card">
      <div class="table-header-controls">
        <h3>Registered Dealers & Agencies Management</h3>
        <span style="color:var(--text-muted); font-size:0.85rem;">Approve, verify, badge, or suspend real estate agencies</span>
      </div>

      <div class="table-responsive">
        <table class="dealer-table">
          <thead>
            <tr>
              <th>Agency / Realtor</th>
              <th>Lead Person</th>
              <th>City / Office</th>
              <th>Contact</th>
              <th>Active Listings</th>
              <th>Status Badge</th>
              <th>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            ${dealers.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No registered dealers or agencies found. Users who sign up will appear here.</td>
              </tr>
            ` : dealers.map(d => `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <img src="${d.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid var(--gold-accent);" alt="${d.name}" />
                    <div>
                      <strong style="display:block; font-size:0.92rem; color:var(--text-main);">${d.name}</strong>
                      <span style="font-size:0.75rem; color:var(--text-muted);">${d.email}</span>
                    </div>
                  </div>
                </td>
                <td><strong>${d.leadPerson || d.name}</strong></td>
                <td>${d.city}<br/><span style="font-size:0.73rem; color:var(--text-muted);">${d.office || ''}</span></td>
                <td>
                  <div>${d.phone}</div>
                  <a href="https://wa.me/${d.whatsapp}?text=Hi%20${encodeURIComponent(d.leadPerson)},%20this%20is%20Sarmayadar%20Admin." target="_blank" style="font-size:0.75rem; color:var(--emerald-teal); font-weight:700;">WhatsApp</a>
                </td>
                <td><span class="badge badge-verified">${d.activeListingsCount || 0} Listings</span></td>
                <td>
                  <span class="status-pill ${d.isSuspended ? 'status-sold' : 'status-active'}" style="background:${d.isSuspended ? '#FEE2E2' : ((d.badge ?? '').includes('PLATINUM') ? '#FEF3C7' : '#DCFCE7')}; color:${d.isSuspended ? '#DC2626' : ((d.badge ?? '').includes('PLATINUM') ? '#B45309' : '#166534')}; font-weight:800;">
                    ${d.isSuspended ? 'SUSPENDED' : (d.badge || 'VERIFIED')}
                  </span>
                </td>

                <td>
                  <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                    <button class="btn btn-gold btn-sm toggle-dealer-badge-btn" data-id="${d.id}" style="padding:0.25rem 0.5rem; font-size:0.72rem;">
                      Upgrade Badge
                    </button>
                    ${d.isSuspended ? `
                      <button class="btn btn-primary btn-sm unsuspend-dealer-acc-btn" data-id="${d.id}" style="padding:0.25rem 0.5rem; font-size:0.72rem; background:#10B981; color:white; border:none; cursor:pointer;">
                        Unsuspend
                      </button>
                    ` : `
                      <button class="btn btn-danger btn-sm delete-dealer-acc-btn" data-id="${d.id}" style="padding:0.25rem 0.5rem; font-size:0.72rem; background:#EF4444; color:white; border:none; cursor:pointer;">
                        Suspend
                      </button>
                    `}
                  </div>
                </td>

              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderInventoryTab(properties, state) {
  return `
    <div class="dashboard-card">
      <div class="table-header-controls">
        <h3>Property Inventory Management</h3>
        <input type="text" id="dealer-search-inventory" placeholder="Search by title or society..." class="form-control" style="max-width:300px; padding:0.5rem 0.85rem;" />
      </div>

      <div class="table-responsive">
        <table class="dealer-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type / Purpose</th>
              <th>Price (PKR)</th>
              <th>Location</th>
              <th>Views</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${properties.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align:center; padding:3rem 1rem; color:var(--forest); opacity:0.85;">
                  <div style="font-size:1.1rem; font-weight:700; margin-bottom:0.5rem;">No property listings posted yet</div>
                  <div>Click <strong>"Post New Dealer Listing"</strong> above to publish your first property live!</div>
                </td>
              </tr>
            ` : properties.map(p => `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <img src="${p.images && p.images[0] ? p.images[0] : ''}" style="width:50px; height:40px; border-radius:6px; object-fit:cover;" alt="${p.title}" />
                    <div>
                      <strong style="display:block; font-size:0.9rem; color:var(--text-main);">${p.title}</strong>
                      <span style="font-size:0.75rem; color:var(--text-muted);">ID: ${p.id}</span>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-verified">${(p.purpose ?? 'sale').toUpperCase()}</span> ${p.category || ''}</td>
                <td><strong>${formatPKR(p.price || 0)}</strong></td>
                <td>${p.location || ''}, ${p.city || ''}</td>
                <td>${p.views || 0}</td>
                <td>
                  <span class="status-pill ${p.status === 'sold' ? 'status-sold' : 'status-active'}">
                    ${(p.status ?? 'active').toUpperCase()}
                  </span>
                </td>

                <td>
                  <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                    <button class="btn btn-secondary btn-sm toggle-sold-btn" data-id="${p.id}" style="padding:0.25rem 0.45rem; font-size:0.72rem;">
                      ${p.status === 'sold' ? 'Mark Active' : 'Mark Sold'}
                    </button>
                    <button class="btn btn-primary btn-sm edit-prop-btn" data-id="${p.id}" style="padding:0.25rem 0.45rem; font-size:0.72rem; background:var(--emerald-teal); border:none;">
                      Edit
                    </button>
                    <button class="btn btn-secondary btn-sm view-prop-btn" data-id="${p.id}" style="padding:0.25rem 0.45rem; font-size:0.72rem;">
                      View
                    </button>
                    <button class="btn btn-danger btn-sm delete-prop-btn" data-id="${p.id}" style="padding:0.25rem 0.45rem; font-size:0.72rem; background:#EF4444; color:white; border:none;">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}

          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderLeadsCRMTab(leads) {
  return `
    <div class="dashboard-card">
      <div class="table-header-controls">
        <h3>Client Leads & Inquiries CRM</h3>
        <span style="color:var(--text-muted); font-size:0.88rem;">Track client leads from WhatsApp & Web Forms</span>
      </div>

      <div class="table-responsive">
        <table class="dealer-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact / WhatsApp</th>
              <th>Property Inquired</th>
              <th>Budget Range</th>
              <th>Stage Pipeline</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${leads.length === 0 ? `
              <tr>
                <td colspan="6" style="text-align:center; padding:2.5rem 1rem; color:var(--forest); opacity:0.85;">No active client leads yet. Client inquiries from buyers will appear here.</td>
              </tr>
            ` : leads.map(lead => `
              <tr>
                <td>
                  <strong>${lead.clientName}</strong>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${new Date(lead.inquiryDate).toLocaleDateString()}</div>
                </td>
                <td>
                  <div>${lead.phone}</div>
                  <a href="https://wa.me/${lead.whatsapp}?text=Hi%20${encodeURIComponent(lead.clientName)},%20thank%20you%20for%20contacting%20Sarmayadar%20Realtors." 
                     target="_blank" 
                     class="btn btn-whatsapp" 
                     style="padding:0.2rem 0.5rem; font-size:0.73rem; margin-top:0.2rem; display:inline-flex;">
                    <i data-lucide="message-circle" style="width:12px; height:12px;"></i> WhatsApp
                  </a>
                </td>
                <td style="max-width:220px;">
                  <span style="font-size:0.85rem; font-weight:600; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                    ${lead.propertyTitle}
                  </span>
                </td>
                <td><strong>${lead.budget}</strong></td>
                <td>
                  <select class="stage-select lead-stage-change" data-id="${lead.id}">
                    <option value="New" ${lead.stage === 'New' ? 'selected' : ''}>New Lead</option>
                    <option value="Contacted" ${lead.stage === 'Contacted' ? 'selected' : ''}>Contacted</option>
                    <option value="Site Visit Scheduled" ${lead.stage === 'Site Visit Scheduled' ? 'selected' : ''}>Site Visit Scheduled</option>
                    <option value="In Negotiation" ${lead.stage === 'In Negotiation' ? 'selected' : ''}>In Negotiation</option>
                    <option value="Closed" ${lead.stage === 'Closed' ? 'selected' : ''}>Closed / Deal Done</option>
                  </select>
                </td>
                <td>
                  <button class="btn btn-outline btn-sm view-lead-notes-btn" data-notes="${encodeURIComponent(lead.notes || '')}" style="padding:0.25rem 0.5rem; font-size:0.75rem;">
                    Notes
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAnalyticsTab(properties) {
  return `
    <div class="dashboard-card">
      <h3 style="margin-bottom:1.5rem;">Listing Performance & Market Analytics</h3>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem;">
        <div style="background:var(--bg-main); padding:1.5rem; border-radius:12px; border:1px solid var(--border-light);">
          <h4 style="margin-bottom:1rem;">Top Viewed Societies</h4>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.88rem; font-weight:600; margin-bottom:0.25rem;">
                <span>DHA Phase 6 Lahore</span> <span>640 Views (42%)</span>
              </div>
              <div style="background:#CBD5E1; height:8px; border-radius:4px; overflow:hidden;">
                <div style="background:var(--primary-emerald); width:42%; height:100%;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.88rem; font-weight:600; margin-bottom:0.25rem;">
                <span>Bahria Town Phase 8 Islamabad</span> <span>482 Views (31%)</span>
              </div>
              <div style="background:#CBD5E1; height:8px; border-radius:4px; overflow:hidden;">
                <div style="background:var(--emerald-teal); width:31%; height:100%;"></div>
              </div>
            </div>
          </div>
        </div>

        <div style="background:var(--bg-main); padding:1.5rem; border-radius:12px; border:1px solid var(--border-light);">
          <h4 style="margin-bottom:1rem;">Client Inquiry Conversion Rate</h4>
          <div style="text-align:center; padding:1.5rem 0;">
            <div style="font-family:'Outfit',sans-serif; font-size:3rem; font-weight:800; color:var(--primary-emerald);">18.4%</div>
            <p style="color:var(--text-muted); font-size:0.9rem;">Higher lead conversion than average Pakistani portals</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProfileSettingsTab(profile, isAdmin = false) {
  return `
    <div class="dashboard-card" style="max-width:750px; margin:0 auto;">
      <div style="display:flex; align-items:center; gap:1.25rem; margin-bottom:1.75rem; padding-bottom:1.25rem; border-bottom:2px solid var(--border-dk);">
        <img id="agency-logo-preview" src="${profile.logo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'}" style="width:80px; height:80px; border-radius:50%; object-fit:cover; border:3px solid var(--marigold); box-shadow:var(--shadow-md);" alt="${profile.name}" />
        <div>
          <h3 style="margin:0; font-family:var(--font-display); color:var(--forest-dk); font-size:1.3rem;">
            ${isAdmin ? 'Administrator Account Settings' : 'Agency Profile & Branding Settings'}
          </h3>
          <p style="margin-top:4px; font-size:0.85rem; color:var(--forest); opacity:0.85;">
            Manage and update your profile picture, agency name, contact details, city, address, and bio.
          </p>
        </div>
      </div>

      <form id="agency-profile-form">
        <!-- Profile Picture Upload -->
        <div class="form-group" style="margin-bottom:1.5rem;">
          <label style="font-weight:700;">Profile Picture / Agency Logo *</label>
          <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
            <input type="text" id="agency-logo-url-input" class="form-control" value="${profile.logo || ''}" placeholder="Enter photo URL or browse PC gallery →" style="flex:1;" />
            <button type="button" class="btn btn-ghost btn-sm" id="agency-upload-photo-btn" style="padding:10px 16px; font-weight:700;">
              Browse PC Gallery
            </button>
            <input type="file" id="agency-photo-file-input" accept="image/*" style="display:none;" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label style="font-weight:700;">Agency / Full Name *</label>
            <input type="text" id="agency-name-input" class="form-control" value="${profile.name || ''}" placeholder="e.g. Apex Real Estate & Builders" required />
          </div>
          <div class="form-group">
            <label style="font-weight:700;">Lead Representative Name *</label>
            <input type="text" id="agency-person-input" class="form-control" value="${profile.leadPerson || ''}" placeholder="e.g. Chaudhry Kamran" required />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label style="font-weight:700;">Phone Number (+92) *</label>
            <input type="text" id="agency-phone-input" class="form-control" value="${profile.phone || ''}" placeholder="+92 300 1234567" required />
          </div>
          <div class="form-group">
            <label style="font-weight:700;">WhatsApp Number *</label>
            <input type="text" id="agency-wa-input" class="form-control" value="${profile.whatsapp || ''}" placeholder="923001234567" required />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label style="font-weight:700;">City *</label>
            <input type="text" id="agency-city-input" class="form-control" value="${profile.city || 'Lahore'}" placeholder="e.g. Lahore, Islamabad, Karachi" required />
          </div>
          <div class="form-group">
            <label style="font-weight:700;">Office Address / Location *</label>
            <input type="text" id="agency-address-input" class="form-control" value="${profile.address || ''}" placeholder="e.g. Office 402, Main Boulevard, DHA Phase 6" required />
          </div>
        </div>

        <div class="form-group">
          <label style="font-weight:700;">Profile Bio & Overview</label>
          <textarea id="agency-bio-input" class="form-control" rows="3" placeholder="Write a short bio or description about your real estate experience and specialities...">${profile.bio || ''}</textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%; padding:12px; font-weight:800; font-size:0.95rem; margin-top:0.5rem; box-shadow:var(--shadow-md);">
          Save Profile & Branding Changes
        </button>

      </form>
    </div>
  `;
}

function renderAdminBlogsTab(blogs, state) {
  const isCreatingNew = state?.showBlogCreateModal || false;
  const editingBlog = state?.editingBlog || null;

  return `
    <div style="background:var(--paper); border-radius:12px; border:2px solid var(--forest-dk); padding:1.5rem; box-shadow:var(--shadow-sm);">
      
      <!-- Top Action Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; border-bottom:2px solid var(--border-dk); padding-bottom:1rem;">
        <div>
          <h3 style="font-family:var(--font-display); color:var(--forest-dk); font-size:1.3rem; font-weight:800; margin:0;">
            📰 Master Blog & Article Studio
          </h3>
          <p style="font-size:0.85rem; color:var(--forest); opacity:0.85; margin-top:4px;">
            Exclusively for Portal Supervisors: Write, publish, edit, and manage market insights & FBR tax guides for public users.
          </p>
        </div>

        <button type="button" class="btn btn-primary" id="open-create-blog-modal-btn" style="padding:10px 18px; font-weight:800; font-size:0.88rem; border-radius:8px; background:var(--forest-dk); color:var(--paper);">
          <i data-lucide="plus-circle" style="width:16px; height:16px; vertical-align:middle;"></i> Write New Blog Article
        </button>
      </div>

      <!-- Blogs Data Table -->
      <div style="overflow-x:auto;">
        <table class="inventory-table" style="width:100%; border-collapse:collapse; text-align:left;">
          <thead>
            <tr style="background:var(--cream); border-bottom:2px solid var(--border-dk); font-family:var(--font-mono); font-size:0.75rem; text-transform:uppercase; color:var(--forest-dk);">
              <th style="padding:12px;">Cover</th>
              <th style="padding:12px;">Title & Category</th>
              <th style="padding:12px;">Author</th>
              <th style="padding:12px;">Date & Read Time</th>
              <th style="padding:12px;">Status</th>
              <th style="padding:12px; text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${blogs.length === 0 ? `
              <tr>
                <td colspan="6" style="padding:2rem; text-align:center; color:var(--forest); opacity:0.75;">
                  No blogs published yet. Click "Write New Blog Article" to publish your first post!
                </td>
              </tr>
            ` : blogs.map(b => `
              <tr style="border-bottom:1px solid var(--border-dk); font-size:0.88rem;">
                <td style="padding:10px;">
                  <img src="${b.img || b.image}" style="width:60px; height:45px; object-fit:cover; border-radius:6px; border:1px solid var(--border-dk);" alt="${b.title}" />
                </td>
                <td style="padding:10px;">
                  <strong style="color:var(--forest-dk); display:block;">${b.title}</strong>
                  <span class="badge" style="font-size:0.68rem; background:var(--forest); color:var(--paper); padding:2px 6px;">${b.badge || 'INSIGHTS'}</span>
                </td>
                <td style="padding:10px; color:var(--ink); font-weight:600;">
                  ${b.author || 'Sarmayadar Editorial'}
                </td>
                <td style="padding:10px; font-family:var(--font-mono); font-size:0.78rem;">
                  📅 ${b.date}<br/>⏱️ ${b.readTime || '5 min read'}
                </td>
                <td style="padding:10px;">
                  <span class="badge" style="background:${b.status === 'DRAFT' ? '#F59E0B' : '#10B981'}; color:white; font-size:0.72rem; padding:4px 8px; border-radius:4px;">
                    ${b.status === 'DRAFT' ? '📝 DRAFT' : 'LIVE PUBLISHED'}
                  </span>
                </td>
                <td style="padding:10px; text-align:right; white-space:nowrap;">
                  <button type="button" class="btn btn-sm btn-ghost edit-blog-btn" data-id="${b.id}" style="padding:4px 8px; font-size:0.78rem; font-weight:700; color:var(--forest-dk);" title="Edit Blog">
                    ✏️ Edit
                  </button>
                  <button type="button" class="btn btn-sm btn-danger delete-blog-btn" data-id="${b.id}" style="padding:4px 8px; font-size:0.78rem; font-weight:700; background:#EF4444; color:white; border:none; border-radius:4px; margin-left:4px;" title="Delete Blog">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>

    <!-- Admin Blog Editor Modal -->
    <div class="modal-overlay ${isCreatingNew || editingBlog ? 'active' : ''}" id="admin-blog-modal-overlay">
      <div class="modal-container" style="max-width:680px; border-radius:16px; border:3px solid var(--forest-dk); overflow:hidden;">
        
        <div class="modal-header" style="background:var(--forest-dk); color:var(--paper); padding:1.25rem 1.5rem; border-bottom:3px solid var(--marigold);">
          <h3 class="modal-title" style="color:var(--paper); font-size:1.2rem;">
            ${editingBlog ? '✏️ Edit Blog Post Article' : '🚀 Publish New Real Estate Blog Article'}
          </h3>
          <button type="button" class="close-modal-btn" id="close-blog-modal-btn" style="color:var(--paper); background:rgba(255,255,255,0.1); width:36px; height:36px;">&times;</button>
        </div>

        <div class="modal-body" style="padding:1.5rem; background:var(--paper);">
          <form id="admin-blog-editor-form">
            <input type="hidden" id="blog-edit-id-input" value="${editingBlog ? editingBlog.id : ''}" />

            <div class="form-group" style="margin-bottom:1rem;">
              <label style="font-weight:700; font-size:0.85rem; color:var(--forest-dk);">Article Title *</label>
              <input type="text" id="blog-title-input" class="form-control" placeholder="e.g. FBR Property Tax Rules 2026: Filer vs Non-Filer Rates" value="${editingBlog ? editingBlog.title : ''}" required />
            </div>

            <div class="form-grid-2" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
              <div class="form-group">
                <label style="font-weight:700; font-size:0.85rem; color:var(--forest-dk);">Category Tag *</label>
                <select id="blog-category-select" class="form-control" required>
                  <option value="FBR TAXES 2026" ${editingBlog?.badge === 'FBR TAXES 2026' ? 'selected' : ''}>FBR TAXES 2026</option>
                  <option value="INVESTMENT ANALYSIS" ${editingBlog?.badge === 'INVESTMENT ANALYSIS' ? 'selected' : ''}>INVESTMENT ANALYSIS</option>
                  <option value="DEVELOPMENT UPDATE" ${editingBlog?.badge === 'DEVELOPMENT UPDATE' ? 'selected' : ''}>DEVELOPMENT UPDATE</option>
                  <option value="LEGAL & SOCIETY" ${editingBlog?.badge === 'LEGAL & SOCIETY' ? 'selected' : ''}>LEGAL & SOCIETY</option>
                  <option value="BUYING ADVICE" ${editingBlog?.badge === 'BUYING ADVICE' ? 'selected' : ''}>BUYING ADVICE</option>
                </select>
              </div>

              <div class="form-group">
                <label style="font-weight:700; font-size:0.85rem; color:var(--forest-dk);">Reading Time *</label>
                <input type="text" id="blog-readtime-input" class="form-control" placeholder="e.g. 5 min read" value="${editingBlog ? (editingBlog.readTime || '5 min read') : '5 min read'}" required />
              </div>
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label style="font-weight:700; font-size:0.85rem; color:var(--forest-dk);">Author Name</label>
              <input type="text" id="blog-author-input" class="form-control" placeholder="e.g. Sarmayadar Editorial Board" value="${editingBlog ? (editingBlog.author || 'Sarmayadar Editorial Board') : 'Sarmayadar Editorial Board'}" />
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label style="font-weight:700; font-size:0.85rem; color:var(--forest-dk);">
                Cover Photo (Auto Watermarked) *
              </label>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                <input type="text" id="blog-img-url-input" class="form-control" placeholder="Enter image URL or browse gallery →" value="${editingBlog ? (editingBlog.img || editingBlog.image || '') : ''}" required style="flex:1;" />
                <button type="button" class="btn btn-ghost btn-sm" id="blog-upload-photo-btn" style="padding:10px 14px; font-weight:700;">
                  Browse Gallery
                </button>
                <input type="file" id="blog-cover-file-input" accept="image/*" style="display:none;" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label style="font-weight:700; font-size:0.85rem; color:var(--forest-dk);">Short Summary / Snippet *</label>
              <textarea id="blog-snippet-input" class="form-control" rows="2" placeholder="Brief summary displayed on blog cards..." required>${editingBlog ? (editingBlog.snippet || '') : ''}</textarea>
            </div>

            <div class="form-group" style="margin-bottom:1.25rem;">
              <label style="font-weight:700; font-size:0.85rem; color:var(--forest-dk);">Full Article Content *</label>
              <textarea id="blog-fulltext-input" class="form-control" rows="6" placeholder="Write full article body text, detailed legal breakdowns, investment takeaways..." required>${editingBlog ? (editingBlog.fullText || editingBlog.content || '') : ''}</textarea>
            </div>

            <button type="submit" class="btn btn-primary" id="save-blog-post-btn" style="width:100%; padding:12px; font-size:0.95rem; font-weight:800; border-radius:8px; background:var(--forest-dk); color:var(--paper); box-shadow:var(--shadow-md);">
              ${editingBlog ? '💾 Update & Save Changes' : '🚀 Publish Article Live'}
            </button>
          </form>
        </div>

      </div>
    </div>
  `;
}

