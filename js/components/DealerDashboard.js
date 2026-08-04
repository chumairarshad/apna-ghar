import { formatPKR, formatArea } from '../utils/formatters.js';
import { getDealerLeads, saveDealerLeads, getAgencyProfile, saveAgencyProfile } from '../utils/storage.js';
import { INITIAL_DEALER_LEADS } from '../data/leads.js';

export function renderDealerDashboard(properties, state) {
  let leads = getDealerLeads();
  if (!leads) {
    leads = INITIAL_DEALER_LEADS;
    saveDealerLeads(leads);
  }

  let agencyProfile = getAgencyProfile();
  if (!agencyProfile) {
    agencyProfile = {
      name: "Apna Ghar Prime Realtors",
      leadPerson: "Chaudhry Kamran",
      city: "Lahore",
      address: "Office 402, MB Commercial Broadway, DHA Phase 6, Lahore",
      phone: "+92 300 8472910",
      whatsapp: "923008472910",
      badge: "PLATINUM VERIFIED",
      logo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
      creditsLeft: 12
    };
    saveAgencyProfile(agencyProfile);
  }

  const activeTab = state.dealerTab || 'inventory'; // inventory | leads | analytics | profile
  const totalListings = properties.length;
  const activeLeadsCount = leads.filter(l => l.stage !== 'Closed').length;
  const totalViewsSum = properties.reduce((acc, p) => acc + (p.views || 0), 0);

  return `
    <section class="dealer-portal-section">
      <div class="container">
        <!-- Agency Banner Header -->
        <div class="dealer-header">
          <div class="agency-brand-info">
            <img src="${agencyProfile.logo}" class="agency-logo-large" alt="${agencyProfile.name}" />
            <div class="agency-meta">
              <h2>${agencyProfile.name} <span class="badge badge-verified" style="font-size:0.7rem; vertical-align:middle;">${agencyProfile.badge}</span></h2>
              <p><i data-lucide="map-pin" style="width:14px; height:14px; display:inline-block;"></i> ${agencyProfile.address}</p>
            </div>
          </div>

          <div>
            <button class="btn btn-gold" id="dealer-post-btn">
              <i data-lucide="plus-circle" style="width:18px; height:18px;"></i>
              Post New Dealer Listing
            </button>
          </div>
        </div>

        <!-- KPI Metric Cards -->
        <div class="dealer-kpi-grid">
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

          <div class="kpi-card">
            <div class="kpi-icon" style="background-color:#FCE7F3; color:#9D174D;"><i data-lucide="award" style="width:24px; height:24px;"></i></div>
            <div class="kpi-data">
              <span class="kpi-value">${agencyProfile.creditsLeft}</span>
              <span class="kpi-label">Featured Credits Left</span>
            </div>
          </div>
        </div>

        <!-- Dashboard Navigation Tabs -->
        <div class="dealer-tabs">
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
            <i data-lucide="settings" style="width:18px; height:18px;"></i> Agency Settings
          </button>
        </div>

        <!-- Tab Content Views -->
        ${activeTab === 'inventory' ? renderInventoryTab(properties, state) : ''}
        ${activeTab === 'leads' ? renderLeadsCRMTab(leads) : ''}
        ${activeTab === 'analytics' ? renderAnalyticsTab(properties) : ''}
        ${activeTab === 'profile' ? renderProfileSettingsTab(agencyProfile) : ''}
      </div>
    </section>
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
            ${properties.map(p => `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <img src="${p.images && p.images[0] ? p.images[0] : ''}" style="width:50px; height:40px; border-radius:6px; object-fit:cover;" />
                    <div>
                      <strong style="display:block; font-size:0.9rem; color:var(--text-main);">${p.title}</strong>
                      <span style="font-size:0.75rem; color:var(--text-muted);">ID: ${p.id}</span>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-verified">${p.purpose.toUpperCase()}</span> ${p.category}</td>
                <td><strong>${formatPKR(p.price)}</strong></td>
                <td>${p.location}, ${p.city}</td>
                <td>${p.views || 0}</td>
                <td>
                  <span class="status-pill ${p.status === 'sold' ? 'status-sold' : 'status-active'}">
                    ${p.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style="display:flex; gap:0.35rem;">
                    <button class="btn btn-secondary btn-sm toggle-sold-btn" data-id="${p.id}" style="padding:0.25rem 0.5rem; font-size:0.75rem;">
                      ${p.status === 'sold' ? 'Mark Active' : 'Mark Sold'}
                    </button>
                    <button class="btn btn-primary btn-sm edit-prop-btn" data-id="${p.id}" style="padding:0.25rem 0.5rem; font-size:0.75rem;">
                      View
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
            ${leads.map(lead => `
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
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.88rem; font-weight:600; margin-bottom:0.25rem;">
                <span>Sector E-11 Islamabad</span> <span>319 Views (27%)</span>
              </div>
              <div style="background:#CBD5E1; height:8px; border-radius:4px; overflow:hidden;">
                <div style="background:var(--gold-accent); width:27%; height:100%;"></div>
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

function renderProfileSettingsTab(profile) {
  return `
    <div class="dashboard-card" style="max-width:700px;">
      <h3 style="margin-bottom:1.5rem;">Agency Profile & Branding</h3>
      <form id="agency-profile-form">
        <div class="form-group">
          <label>Agency Name</label>
          <input type="text" id="agency-name-input" class="form-control" value="${profile.name}" required />
        </div>
        <div class="form-group">
          <label>Lead Agent / Manager</label>
          <input type="text" id="agency-person-input" class="form-control" value="${profile.leadPerson}" required />
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Phone Number</label>
            <input type="text" id="agency-phone-input" class="form-control" value="${profile.phone}" required />
          </div>
          <div class="form-group">
            <label>WhatsApp Number (without +)</label>
            <input type="text" id="agency-wa-input" class="form-control" value="${profile.whatsapp}" required />
          </div>
        </div>
        <div class="form-group">
          <label>Office Address</label>
          <input type="text" id="agency-address-input" class="form-control" value="${profile.address}" required />
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top:1rem;">Save Profile Changes</button>
      </form>
    </div>
  `;
}
