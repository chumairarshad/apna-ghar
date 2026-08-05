import { formatPKR, formatArea } from '../utils/formatters.js';
import { normalizeProperty, normalizeProperties } from '../utils/normalizeProperty.js';
import { getFavorites } from '../utils/storage.js';
import { renderIcon } from '../utils/icons.js';


export function renderCatalog(rawProperties, state) {
  const properties = normalizeProperties(rawProperties);
  const favorites = getFavorites();

  const currentView = state.viewMode || 'grid'; // grid | map

  return `
    <section class="catalog-section">
      <div class="container">
        <!-- Catalog Header Controls -->
        <div class="catalog-header-bar">
          <div class="results-count">
            Found <span>${properties.length}</span> Verified Properties
          </div>

          <div class="catalog-controls">
            <!-- Grid vs Map View Toggle -->
            <div class="view-toggle">
              <button class="view-btn ${currentView === 'grid' ? 'active' : ''}" data-view="grid">
                ${renderIcon('grid', 16)} Grid
              </button>
              <button class="view-btn ${currentView === 'map' ? 'active' : ''}" data-view="map">
                ${renderIcon('map', 16)} Interactive Map
              </button>
            </div>

            <!-- Sorting Dropdown -->
            <select id="sort-properties" class="sort-select">
              <option value="featured" ${state.sortBy === 'featured' ? 'selected' : ''}>Sort: Featured First</option>
              <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="newest" ${state.sortBy === 'newest' ? 'selected' : ''}>Newest Listed</option>
            </select>
          </div>
        </div>

        <!-- Main Layout (Grid + Map Split View) -->
        <div class="catalog-main-layout ${currentView === 'map' ? 'with-map' : ''}">
          <!-- Properties Grid -->
          <div class="properties-grid">
            ${properties.length === 0 ? `
              <div style="grid-column: 1 / -1; text-align:center; padding: 4rem 1rem; background:white; border-radius:16px;">
                ${renderIcon('search', 48, 'var(--forest)')}
                <h3 style="margin-bottom:0.5rem; margin-top:1rem;">No properties matched your criteria</h3>
                <p style="color:var(--forest); opacity:0.8;">Try adjusting your city, budget range, or society filter.</p>
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
        <button type="button" class="open-tour-btn" data-id="${prop.id}" style="position:absolute; top:10px; left:10px; background:rgba(19, 29, 12, 0.9); color:var(--marigold); border:1.5px solid var(--marigold); padding:4px 10px; border-radius:20px; font-family:var(--font-mono); font-size:0.68rem; font-weight:700; display:flex; align-items:center; gap:4px; z-index:3; cursor:pointer;" title="Launch 360 Virtual Tour">
          ${renderIcon('sparkles', 12, 'var(--marigold)')} 360° Tour
        </button>

        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${prop.id}" title="Save to Favorites">
          ${renderIcon('heart', 16, isFav ? 'var(--rani)' : 'var(--forest)')}
        </button>

        <div class="price-tag-overlay">
          ${formatPKR(prop.price)}
          ${prop.purpose === 'rent' ? '<span style="font-size:0.75rem; font-weight:400;">/ mo</span>' : ''}
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <div class="card-category">${prop.purpose === 'sale' ? 'For Sale' : 'For Rent'} • ${prop.category.replace('_', ' ').toUpperCase()}</div>
        <h3 class="card-title" title="${prop.title}">${prop.title}</h3>
        
        <div class="card-location">
          ${renderIcon('map-pin', 14, 'var(--rani)')}
          <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${prop.location}, ${prop.city}</span>
        </div>

        <!-- Metrics -->
        <div class="card-metrics">
          <div class="metric-item" title="Bedrooms">
            ${renderIcon('building', 15, 'var(--forest-dk)')}
            <span>${prop.bedrooms > 0 ? prop.bedrooms + ' Beds' : 'N/A'}</span>
          </div>
          <div class="metric-item" title="Bathrooms">
            ${renderIcon('building-2', 15, 'var(--forest-dk)')}
            <span>${prop.bathrooms > 0 ? prop.bathrooms + ' Baths' : 'N/A'}</span>
          </div>
          <div class="metric-item" title="Area Size">
            ${renderIcon('maximize', 15, 'var(--forest-dk)')}
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
            <button type="button" class="btn btn-dark open-tour-btn" data-id="${prop.id}" style="padding:0.4rem 0.5rem; font-size:0.75rem;" title="360 Tour">
              360°
            </button>

            <a href="https://wa.me/${prop.agency.whatsapp}?text=Hi%20Apna%20Ghar%20Agent,%20I%20am%20interested%20in%20listing%20${encodeURIComponent(prop.title)}%20(ID:%20${prop.id})" 
               target="_blank" 
               class="btn btn-whatsapp" 
               style="padding:0.4rem 0.65rem; font-size:0.8rem;" 
               title="Chat on WhatsApp">
              ${renderIcon('message-circle', 16)}
            </a>

            <button class="btn btn-primary view-details-btn" data-id="${prop.id}" style="padding:0.4rem 0.75rem; font-size:0.8rem;">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
