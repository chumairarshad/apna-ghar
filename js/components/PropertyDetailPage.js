import { formatPKR, formatArea } from '../utils/formatters.js';
import { normalizeProperty } from '../utils/normalizeProperty.js';
import { renderIcon } from '../utils/icons.js';
import { t, tText, tCity } from '../utils/i18n.js';

export function renderPropertyDetailPage(state) {
  const propId = state.selectedPropertyId || (state.selectedProperty ? state.selectedProperty.id : null);
  const rawProp = (state.properties || []).find(p => String(p.id) === String(propId)) || state.selectedProperty;

  if (!rawProp) {
    return `
      <div class="container" style="padding: 4rem 1rem; text-align: center; min-height: 60vh;">
        <div style="max-width: 500px; margin: 0 auto; background: var(--paper); padding: 2.5rem; border-radius: 16px; border: 2px solid var(--border-dk); box-shadow: var(--shadow-md);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🏠</div>
          <h2 style="color: var(--forest-dk); font-size: 1.5rem; margin-bottom: 0.5rem;">Property Listing Not Found</h2>
          <p style="color: var(--forest); opacity: 0.8; font-size: 0.9rem; margin-bottom: 1.5rem;">The property listing you are looking for may have been sold, removed, or is temporarily unavailable.</p>
          <a href="#buy" class="btn btn-dark" style="padding: 0.75rem 1.5rem; border-radius: 8px;">← Browse Available Properties</a>
        </div>
      </div>
    `;
  }

  const prop = normalizeProperty(rawProp);
  const avgMarlaPrice = prop.sizeMarla > 0 ? Math.round(prop.price / prop.sizeMarla) : 0;
  const isVirtualTourOpen = state.showVirtualTourSection || false;

  return `
    <div class="property-detail-page-wrapper" style="background: var(--cream); min-height: 90vh; padding-bottom: 4rem;">
      <div class="container" style="padding-top: 1.5rem;">
        
        <!-- Breadcrumb & Back Navigation -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <nav aria-label="breadcrumb" class="prop-breadcrumb-nav">
            <ol style="display: flex; align-items: center; gap: 8px; list-style: none; padding: 0; margin: 0; font-size: 0.85rem; font-weight: 700; color: var(--forest-dk);">
              <li><a href="#buy" style="color: var(--rani-dk); text-decoration: none;">Home</a></li>
              <li style="color: var(--forest); opacity: 0.5;">/</li>
              <li><a href="#buy" style="color: var(--rani-dk); text-decoration: none;">Properties</a></li>
              <li style="color: var(--forest); opacity: 0.5;">/</li>
              <li style="color: var(--forest); opacity: 0.5;">${tCity(prop.city)}</li>
              <li style="color: var(--forest); opacity: 0.5;">/</li>
              <li style="color: var(--forest-dk); text-overflow: ellipsis; max-width: 220px; overflow: hidden; white-space: nowrap;">${tText(prop.title)}</li>
            </ol>
          </nav>

          <div style="display: flex; align-items: center; gap: 8px;">
            <a href="#buy" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700; background: var(--paper); border: 2px solid var(--forest-dk); border-radius: 8px; padding: 6px 14px; text-decoration: none; color: var(--forest-dk);">
              ${renderIcon('arrow-left', 14)} Back to Search
            </a>
            <button type="button" class="btn btn-sm delete-property-btn" data-id="${prop.id}" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 800; background: #EF4444; color: #ffffff; border: 2px solid #DC2626; border-radius: 8px; padding: 6px 14px; cursor: pointer;">
              ${renderIcon('trash-2', 14)} Delete Listing
            </button>
          </div>
        </div>

        <div class="prop-detail-main-grid">
          
          <!-- MAIN CONTENT COLUMN -->
          <div>
            <!-- Image Gallery Grid with Watermark -->
            <div class="watermarked-image-container" style="position: relative; margin-bottom: 1.75rem; border-radius: 16px; overflow: hidden; border: 3px solid var(--forest-dk); box-shadow: var(--shadow-lg);">
              <div class="prop-gallery-grid">
                <img src="${prop.images[0]}" alt="${tText(prop.title)}" class="prop-gallery-main-img" />
                <div class="prop-gallery-sub-imgs">
                  <img src="${prop.images[1] || prop.images[0]}" alt="Property interior 1" class="prop-gallery-sub-img" />
                  <img src="${prop.images[2] || prop.images[0]}" alt="Property interior 2" class="prop-gallery-sub-img" />
                </div>
              </div>

              <!-- Interactive 3D Walkthrough Toggle Overlay -->
              <button type="button" id="toggle-3d-walkthrough-btn" class="btn btn-dark" style="position: absolute; bottom: 15px; left: 15px; background: rgba(19, 29, 12, 0.95); color: var(--marigold); border: 2px solid var(--marigold); font-size: 0.82rem; font-weight: 800; padding: 8px 16px; border-radius: 30px; box-shadow: 0 8px 25px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 6px; cursor: pointer;">
                ${renderIcon('sparkles', 16, 'var(--marigold)')} 🕶️ ${isVirtualTourOpen ? 'Hide 3D Tour' : '360° Virtual Walkthrough'}
              </button>
            </div>

            ${isVirtualTourOpen ? `
              <!-- Embedded 3D Virtual Tour Viewer -->
              <div style="background: #0F172A; color: white; border-radius: 16px; padding: 1.25rem; margin-bottom: 1.75rem; border: 3px solid var(--marigold); box-shadow: var(--shadow-lg);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <h4 style="color: var(--marigold); margin: 0; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
                    ${renderIcon('eye', 18, 'var(--marigold)')} Interactive 360° VR Virtual Floor Plan Tour
                  </h4>
                  <span class="badge" style="background: #059669; color: white; padding: 4px 10px;">LIVE 3D SIMULATION</span>
                </div>
                <div style="width: 100%; height: 320px; border-radius: 12px; overflow: hidden; background: #000; position: relative;">
                  <iframe src="https://my.matterport.com/show/?m=zE23h4k1aB2&play=1" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                </div>
              </div>
            ` : ''}

            <!-- Property Title & Price Header -->
            <div style="background: var(--paper); border-radius: 16px; padding: 1.5rem; border: 2px solid var(--border-dk); box-shadow: var(--shadow-md); margin-bottom: 1.75rem;">
              <div class="prop-header-flex">
                <div>
                  <div class="card-badges" style="position: static; margin-bottom: 0.65rem;">
                    ${prop.badges.map(b => `<span class="badge badge-verified" style="margin-right: 6px;">${tText(b)}</span>`).join('')}
                    <span class="badge" style="background: rgba(242,167,27,0.15); border: 1px solid var(--marigold); color: var(--forest-dk); font-size: 0.75rem; font-weight: 700;">
                      👁️ ${prop.views} Views
                    </span>
                  </div>
                  <h1 class="prop-title-text" style="font-size: 1.8rem; color: var(--forest-dk); line-height: 1.25; margin-bottom: 0.5rem; font-weight: 800;">
                    ${tText(prop.title)}
                  </h1>
                  <div style="color: var(--forest); font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                    ${renderIcon('map-pin', 18, 'var(--rani)')}
                    ${prop.address}
                  </div>
                </div>

                <div class="prop-price-box">
                  <div class="prop-price-val">
                    ${formatPKR(prop.price)}
                  </div>
                  <div style="font-size: 0.88rem; color: var(--forest); font-weight: 700; opacity: 0.85;">
                    Avg: ${formatPKR(avgMarlaPrice)} / Marla
                  </div>
                </div>
              </div>

              <!-- Key Specs Grid -->
              <div class="prop-specs-grid">
                <div>
                  <div style="font-size: 0.72rem; color: var(--forest); font-weight: 800; font-family: var(--font-mono); text-transform: uppercase;">${t('beds', 'BEDROOMS')}</div>
                  <div style="font-size: 1.3rem; font-weight: 800; color: var(--forest-dk);">${prop.bedrooms || 'N/A'}</div>
                </div>
                <div>
                  <div style="font-size: 0.72rem; color: var(--forest); font-weight: 800; font-family: var(--font-mono); text-transform: uppercase;">${t('baths', 'BATHROOMS')}</div>
                  <div style="font-size: 1.3rem; font-weight: 800; color: var(--forest-dk);">${prop.bathrooms || 'N/A'}</div>
                </div>
                <div>
                  <div style="font-size: 0.72rem; color: var(--forest); font-weight: 800; font-family: var(--font-mono); text-transform: uppercase;">${t('area', 'AREA SIZE')}</div>
                  <div style="font-size: 1.3rem; font-weight: 800; color: var(--forest-dk);">${formatArea(prop.sizeMarla, state.unit)}</div>
                </div>
                <div>
                  <div style="font-size: 0.72rem; color: var(--forest); font-weight: 800; font-family: var(--font-mono); text-transform: uppercase;">FACING</div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: var(--forest-dk);">${tText(prop.facing || 'Main Road')}</div>
                </div>
              </div>
            </div>

            <!-- Property Description -->
            <div style="background: var(--paper); border-radius: 16px; padding: 1.5rem; border: 2px solid var(--border-dk); box-shadow: var(--shadow-md); margin-bottom: 1.75rem;">
              <h3 style="margin-bottom: 1rem; color: var(--forest-dk); font-size: 1.2rem; font-weight: 800; border-bottom: 2px solid var(--cream); padding-bottom: 0.5rem;">
                ${t('property_overview', 'Property Overview & Detailed Specs')}
              </h3>
              <p style="color: var(--ink); font-size: 0.95rem; line-height: 1.8; margin-bottom: 1.5rem;">${tText(prop.description)}</p>

              <h4 style="margin-bottom: 1rem; color: var(--forest-dk); font-size: 1.05rem; font-weight: 800;">
                Key Features & Premium Amenities
              </h4>
              <div class="prop-features-grid">
                ${prop.features.map(f => `
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 700; color: var(--forest-dk); background: var(--cream); padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border-dk);">
                    ${renderIcon('check-circle', 16, 'var(--rani)')} ${tText(f)}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Embedded Schedule Site Visit Form Section -->
            <div style="background: var(--paper); border-radius: 16px; padding: 1.5rem; border: 2px solid var(--forest-dk); box-shadow: var(--shadow-md); margin-bottom: 1.75rem;">
              <h3 style="margin-bottom: 0.5rem; color: var(--forest-dk); font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                ${renderIcon('calendar', 20, 'var(--rani)')} Book a Physical Site Visit & Guided Tour
              </h3>
              <p style="color: var(--forest); opacity: 0.85; font-size: 0.85rem; margin-bottom: 1.25rem;">
                Schedule a convenient date and time to visit this property with an authorized Sarmayadar verification officer.
              </p>

              <form id="page-schedule-visit-form" data-id="${prop.id}">
                <div class="prop-form-grid">
                  <div class="form-group">
                    <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Your Full Name *</label>
                    <input type="text" id="visit-full-name" class="form-control" placeholder="e.g. Chaudhry Zafar" required />
                  </div>
                  <div class="form-group">
                    <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Mobile / WhatsApp Number *</label>
                    <input type="tel" id="visit-phone" class="form-control" placeholder="+92 300 1234567" required />
                  </div>
                </div>

                <div class="prop-form-grid">
                  <div class="form-group">
                    <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Preferred Visit Date *</label>
                    <input type="date" id="visit-date" class="form-control" required />
                  </div>
                  <div class="form-group">
                    <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Preferred Time Slot *</label>
                    <select id="visit-time" class="form-control" required>
                      <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                      <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                      <option value="Evening (5:00 PM - 7:00 PM)">Evening (5:00 PM - 7:00 PM)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; font-weight: 800; border-radius: 10px; box-shadow: var(--shadow-md);">
                  📅 Confirm Physical Site Visit Request
                </button>
              </form>
            </div>

          </div>

          <!-- SIDEBAR COLUMN -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Verified Agency Card -->
            <div style="background: var(--forest-dk); color: white; border-radius: 16px; padding: 1.5rem; border: 3px solid var(--forest); box-shadow: var(--shadow-lg);">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
                <img src="${prop.agency.avatar}" alt="${prop.agency.agentName}" style="width: 4rem; height: 4rem; border-radius: 50%; border: 3px solid var(--marigold); object-fit: cover; flex-shrink: 0;" />
                <div>
                  <h4 style="color: white; font-size: 1.15rem; margin: 0; font-weight: 800;">${prop.agency.agentName}</h4>
                  <p style="color: var(--meadow-lt); font-size: 0.85rem; margin: 3px 0; font-weight: 700;">${prop.agency.name}</p>
                  <span class="badge" style="background: var(--marigold); color: var(--forest-dk); font-weight: 800; font-size: 0.72rem;">${prop.agency.badge}</span>
                </div>
              </div>

              <div style="background: rgba(255,255,255,0.08); padding: 0.85rem; border-radius: 10px; font-size: 0.85rem; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="opacity: 0.7;">Phone:</span>
                  <strong style="color: var(--marigold);">${prop.agency.phone}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="opacity: 0.7;">Verification:</span>
                  <strong style="color: #34D399;">100% Cleared</strong>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="https://wa.me/${prop.agency.whatsapp}?text=Hi%20${encodeURIComponent(prop.agency.agentName)},%20I%20am%20interested%20in%20listing%20ID%20${prop.id}%20(${encodeURIComponent(prop.title)})" 
                   target="_blank" 
                   class="btn btn-whatsapp" 
                   style="width: 100%; padding: 0.85rem; font-size: 0.92rem; font-weight: 800; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;">
                  ${renderIcon('message-circle', 18)} Chat on WhatsApp
                </a>

                <a href="tel:${prop.agency.phone.replace(/\s+/g, '')}" 
                   class="btn btn-marigold" 
                   style="width: 100%; padding: 0.85rem; font-size: 0.92rem; font-weight: 800; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;">
                  ${renderIcon('phone-call', 18)} Call Agent Now
                </a>
              </div>
            </div>

            <!-- Estimated Monthly Mortgage Box -->
            <div style="background: var(--paper); border-radius: 16px; padding: 1.5rem; border: 2px solid var(--border-dk); box-shadow: var(--shadow-md);">
              <h4 style="color: var(--forest-dk); font-size: 1.05rem; font-weight: 800; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
                ${renderIcon('calculator', 18, 'var(--marigold)')} Bank Home Loan Calculator
              </h4>
              <p style="font-size: 0.82rem; color: var(--forest); opacity: 0.8; margin-bottom: 1rem;">
                Estimated monthly installment at 20% down payment for 20 years.
              </p>

              <div style="background: var(--cream); padding: 0.85rem; border-radius: 10px; text-align: center; border: 1px solid var(--border-dk); margin-bottom: 1rem;">
                <div style="font-size: 0.75rem; color: var(--forest); font-weight: 700; font-family: var(--font-mono);">ESTIMATED MONTHLY E-EMI</div>
                <div style="font-size: 1.4rem; font-weight: 800; color: var(--rani-dk); font-family: var(--font-mono);">
                  ${formatPKR(Math.round((prop.price * 0.8 * 0.01) / (1 - Math.pow(1 + 0.01, -240))))} / mo
                </div>
              </div>

              <a href="#tools" class="btn btn-outline btn-sm" style="width: 100%; text-align: center; font-weight: 700; display: block; text-decoration: none;">
                📊 Customize Loan Parameters
              </a>
            </div>

          </div>

        </div>

      </div>

      <!-- Mobile Floating Sticky Contact Bar (<768px) -->
      <div class="prop-mobile-contact-bar">
        <a href="https://wa.me/${prop.agency.whatsapp}?text=Hi%20${encodeURIComponent(prop.agency.agentName)},%20I%20am%20interested%20in%20listing%20ID%20${prop.id}%20(${encodeURIComponent(prop.title)})" 
           target="_blank" 
           class="btn btn-whatsapp" 
           style="flex: 1; padding: 0.75rem; font-size: 0.85rem; font-weight: 800; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; background: #25D366; color: white;">
          ${renderIcon('message-circle', 16)} WhatsApp Agent
        </a>
        <a href="tel:${prop.agency.phone.replace(/\s+/g, '')}" 
           class="btn btn-marigold" 
           style="flex: 1; padding: 0.75rem; font-size: 0.85rem; font-weight: 800; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; text-decoration: none; background: #F2A71B; color: #0F172A;">
          ${renderIcon('phone-call', 16)} Call Agent Now
        </a>
      </div>
    </div>
  `;
}
