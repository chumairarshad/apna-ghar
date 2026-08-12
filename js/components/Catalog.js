import { formatPKR, formatArea } from '../utils/formatters.js';
import { normalizeProperty, normalizeProperties } from '../utils/normalizeProperty.js';
import { getFavorites } from '../utils/storage.js';
import { renderIcon } from '../utils/icons.js';
import { parsePropertySizeFromQuery, formatWhatsAppSizeMessage } from '../utils/sizeParser.js';
import { t, tCity, tCategory, tPurpose, tText } from '../utils/i18n.js';


export function renderCatalog(rawProperties, state) {
  const properties = normalizeProperties(rawProperties);
  const favorites = getFavorites();

  const currentView = state.viewMode || 'grid'; // grid | map

  const exactSizeLabel = state.searchFilters?.exactSizeLabel;
  const cityFilter = state.searchFilters?.city;

  let emptyTitle = "No properties matched your criteria";
  let waMessage = "Hi, I'm looking for a property. Can you help me find one?";

  if (exactSizeLabel) {
    emptyTitle = `No ${exactSizeLabel} properties are currently available.`;
    waMessage = formatWhatsAppSizeMessage(exactSizeLabel, cityFilter);
  } else if (state.searchQuery) {
    emptyTitle = `No properties available for "${state.searchQuery}"`;
    waMessage = `Hi, I'm looking for a property matching "${state.searchQuery}". Can you help me find one?`;
  }

  const waUrl = `https://wa.me/923327507866?text=${encodeURIComponent(waMessage)}`;

  return `
    <section class="catalog-section">
      <div class="container">
        <!-- Catalog Header Controls -->
        <div class="catalog-header-bar">
          <div class="results-count">
            Found <span>${properties.length}</span> ${t('verified_properties', 'Verified Properties in Pakistan')}
            ${exactSizeLabel ? `<span style="font-size:0.82rem; font-weight:600; color:var(--forest); background:#E6F4EA; padding:3px 10px; border-radius:20px; margin-left:8px; border:1px solid #A7F3D0;">Filter: ${exactSizeLabel} Only</span>` : ''}
          </div>

          <div class="catalog-controls">
            <!-- Grid vs Map View Toggle -->
            <div class="view-toggle">
              <button class="view-btn ${currentView === 'grid' ? 'active' : ''}" data-view="grid">
                ${renderIcon('grid', 16)} ${t('view_grid', 'Grid View')}
              </button>
              <button class="view-btn ${currentView === 'map' ? 'active' : ''}" data-view="map">
                ${renderIcon('map', 16)} ${t('view_map', 'Map View')}
              </button>
            </div>

            <!-- Sorting Dropdown -->
            <select id="sort-properties" class="sort-select">
              <option value="featured" ${state.sortBy === 'featured' ? 'selected' : ''}>${t('sort_featured', 'Featured First')}</option>
              <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>${t('sort_price_low', 'Price: Low to High')}</option>
              <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>${t('sort_price_high', 'Price: High to Low')}</option>
              <option value="newest" ${state.sortBy === 'newest' ? 'selected' : ''}>${t('sort_newest', 'Newest Listings')}</option>
            </select>
          </div>
        </div>

        <!-- Main Layout (Grid + Map Split View) -->
        <div class="catalog-main-layout ${currentView === 'map' ? 'with-map' : ''}">
          <!-- Properties Grid -->
          <div class="properties-grid">
            ${properties.length === 0 ? `
              <div style="grid-column: 1 / -1; text-align:center; padding: 3.5rem 1.5rem; background:#ffffff; border: 2px dashed #CBD5E1; border-radius:18px; max-width:680px; margin: 1.5rem auto; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
                <div style="width:72px; height:72px; background: #ECFDF5; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:1.25rem; border: 1px solid #A7F3D0;">
                  ${renderIcon('search', 34, '#059669')}
                </div>

                <h3 style="font-family:var(--font-heading, sans-serif); font-size:1.35rem; font-weight:800; color:#0F172A; margin-bottom:0.75rem; line-height:1.3;">
                  ${emptyTitle}
                </h3>

                <p style="color:#475569; font-size:0.98rem; line-height:1.6; max-width:520px; margin:0 auto 1.75rem auto;">
                  Can’t find what you’re looking for? Chat with our support team on WhatsApp and we’ll help you find it.
                </p>

                <div style="display:flex; justify-content:center; align-items:center; gap:1rem; flex-wrap:wrap;">
                  <a href="${waUrl}" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     class="btn-whatsapp-empty" 
                     style="display:inline-flex; align-items:center; gap:10px; background:#25D366; color:#ffffff; font-weight:700; font-size:0.98rem; padding:13px 26px; border-radius:10px; text-decoration:none; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4); transition:all 0.2s ease;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>Chat on WhatsApp</span>
                  </a>

                  ${(exactSizeLabel || (state.searchFilters?.city && state.searchFilters?.city !== 'all') || (state.searchFilters?.category && state.searchFilters?.category !== 'all') || state.searchQuery) ? `
                    <button type="button" 
                            id="reset-search-filters-btn" 
                            class="btn-reset-filters" 
                            style="display:inline-flex; align-items:center; gap:8px; background:#F1F5F9; color:#334155; font-weight:700; font-size:0.9rem; padding:13px 22px; border-radius:10px; border:1px solid #CBD5E1; cursor:pointer;">
                      ${renderIcon('rotate-ccw', 16, '#334155')} Clear All Filters
                    </button>
                  ` : ''}
                </div>
              </div>
            ` : properties.map(prop => renderPropertyCard(prop, favorites, state.unit)).join('')}
          </div>

          <!-- Map Container Sidebar -->
          ${currentView === 'map' ? `
            <div class="map-view-container">
              <div id="leaflet-map"></div>
            </div>
          ` : ''}
        </div>
      </div>
    </section>
  `;
}

function renderPropertyCard(rawProp, favorites, unit) {
  const prop = normalizeProperty(rawProp);
  const isFav = favorites.includes(prop.id);
  const mainImg = prop.images[0];


  return `
    <div class="property-card" data-id="${prop.id}">
      <!-- Card Image Media -->
      <div class="card-media">
        <img src="${mainImg}" alt="${prop.title}" loading="lazy" />
        
        <!-- 360 Virtual Tour Direct Badge Trigger -->
        <button type="button" class="fancy-360-badge open-tour-btn" data-id="${prop.id}" title="Launch 360° Virtual Tour">
          ${renderIcon('sparkles', 13, '#F2A71B')} 360° Tour
        </button>

        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${prop.id}" title="Save to Favorites">
          ${renderIcon('heart', 16, isFav ? '#239C32' : '#475569')}
        </button>

        <div class="price-tag-overlay">
          ${formatPKR(prop.price)}
          ${prop.purpose === 'rent' ? '<span style="font-size:0.75rem; font-weight:400;">/ mo</span>' : ''}
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <div class="card-category">${tPurpose(prop.purpose)} • ${tCategory(prop.category.replace('_', ' '))}</div>
        <h3 class="card-title" title="${tText(prop.title)}">${tText(prop.title)}</h3>
        
        <div class="card-location">
          ${renderIcon('map-pin', 14, '#239C32')}
          <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${prop.location}, ${tCity(prop.city)}</span>
        </div>

        <!-- Metrics -->
        <div class="card-metrics">
          <div class="metric-item" title="Bedrooms">
            ${renderIcon('building', 15, '#166534')}
            <span>${prop.bedrooms > 0 ? prop.bedrooms + ' ' + t('beds', 'Beds') : 'N/A'}</span>
          </div>
          <div class="metric-item" title="Bathrooms">
            ${renderIcon('building-2', 15, '#166534')}
            <span>${prop.bathrooms > 0 ? prop.bathrooms + ' ' + t('baths', 'Baths') : 'N/A'}</span>
          </div>
          <div class="metric-item" title="Area Size">
            ${renderIcon('maximize', 15, '#166534')}
            <span>${formatArea(prop.sizeMarla, unit)}</span>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
          <div class="agent-mini">
            <img src="${prop.agency.avatar}" class="agent-avatar" alt="${prop.agency.agentName}" />
            <div>
              <div class="agent-name">${prop.agency.agentName}</div>
              <div class="agency-name">${prop.agency.name}</div>
            </div>
          </div>

          <div class="card-actions">
            <button type="button" class="fancy-360-btn open-tour-btn" data-id="${prop.id}" title="Launch 360° VR Tour">
              ${renderIcon('sparkles', 13, '#F2A71B')} 360°
            </button>

            <a href="https://wa.me/${prop.agency.whatsapp}?text=Hi%20Sarmayadar%20Agent,%20I%20am%20interested%20in%20listing%20${encodeURIComponent(prop.title)}%20(ID:%20${prop.id})" 
               target="_blank" 
               class="btn btn-whatsapp" 
               style="padding:0.4rem 0.65rem; font-size:0.8rem;" 
               title="${t('btn_whatsapp', 'WhatsApp')}">
              ${renderIcon('message-circle', 16)}
            </a>

            <button class="btn btn-primary view-details-btn" data-id="${prop.id}" style="padding:0.4rem 0.75rem; font-size:0.8rem;">
              ${t('btn_view_details', 'Details')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
