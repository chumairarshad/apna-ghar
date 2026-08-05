import { formatPKR, formatArea, normalizeProperties } from '../utils/formatters.js';
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
          ` : ''}

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
        ${activeTab === 'inventory' ? renderInventoryTab(properties, state) : ''}
        ${activeTab === 'leads' ? renderLeadsCRMTab(leads) : ''}
        ${activeTab === 'analytics' ? renderAnalyticsTab(properties) : ''}
        ${activeTab === 'profile' ? renderProfileSettingsTab(agencyProfile, isAdmin) : ''}
      </div>
    </section>
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
                  <a href="https://wa.me/${d.whatsapp}?text=Hi%20${encodeURIComponent(d.leadPerson)},%20this%20is%20Apna%20Ghar%20Admin." target="_blank" style="font-size:0.75rem; color:var(--emerald-teal); font-weight:700;">WhatsApp</a>
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
                  <a href="https://wa.me/${lead.whatsapp}?text=Hi%20${encodeURIComponent(lead.clientName)},%20thank%20you%20for%20contacting%20Apna%20Ghar%20Realtors." 
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
