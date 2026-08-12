import { CITIES_DATA, PROPERTY_TYPES } from '../data/cities.js';
import { renderIcon } from '../utils/icons.js';
import { t, tCity, tCategory } from '../utils/i18n.js';

export function renderHeroSearch(state) {
  const activeTab = state.searchFilters.purpose || 'sale'; // sale | rent | commercial | projects
  const selectedCity = state.searchFilters.city || 'all';

  const currentCityObj = CITIES_DATA.find(c => c.id === selectedCity);
  const societiesList = currentCityObj ? currentCityObj.societies : [];

  return `
    <section class="hero-section">
      <div class="container hero-content">
        <!-- Hero Text Header -->
        <div class="hero-text-wrapper" style="margin-bottom:0.75rem;">
          <h1 class="hero-title" style="margin-bottom:0.25rem;">
            ${t('hero_title', 'Find Your Dream <span class="gradient-text">Property</span> in Pakistan')}
          </h1>
        </div>

        <!-- Search Engine Box Container (Positioned Above the Fold) -->
        <div class="search-engine-box">
          <!-- Purpose Tabs -->
          <div class="search-tabs-container">
            <button class="search-tab ${activeTab === 'sale' ? 'active' : ''}" data-purpose="sale">
              ${renderIcon('home', 16)} ${t('purpose_buy', 'Buy Property')}
            </button>
            <button class="search-tab ${activeTab === 'rent' ? 'active' : ''}" data-purpose="rent">
              ${renderIcon('key', 16)} ${t('purpose_rent', 'Rent Property')}
            </button>
            <button class="search-tab ${activeTab === 'projects' ? 'active' : ''}" data-purpose="projects">
              ${renderIcon('building-2', 16)} ${t('purpose_projects', 'Megaprojects')}
            </button>
          </div>

          <!-- Integrated AI Natural Language Search Prompt Bar -->
          <div class="ai-search-container-box">
            <div class="ai-header-label">
              <div class="ai-icon-badge">
                ${renderIcon('sparkles', 15, '#FFFFFF')}
              </div>
              <label class="ai-title">
                ${t('ai_search_title', 'AI Smart Search Engine')} <span class="ai-subtitle-tag">${t('ai_search_subtitle', 'Type in Plain English or Urdu')}</span>
              </label>
            </div>

            <div class="ai-main-input-wrap">
              <div class="ai-input-inner-wrapper">
                <span class="ai-search-input-icon">${renderIcon('search', 16, '#239C32')}</span>
                <input type="text" 
                       id="ai-prompt-input" 
                       placeholder="${t('ai_search_placeholder', 'e.g. 10 Marla house in DHA Phase 6 Lahore under 4.5 Crore...')}" />
              </div>

              <button type="button" class="btn btn-ai-search" id="execute-ai-search-btn">
                ${renderIcon('sparkles', 18)} <span>${t('ai_search_btn', 'AI Search')}</span>
              </button>
            </div>

            <!-- Quick AI Prompt Chips -->
            <div class="ai-quick-prompts">
              <span class="prompt-chip-label">${t('quick_prompts', 'Quick Prompts:')}</span>
              <button type="button" class="ai-sample-prompt-btn" data-prompt="10 Marla house in DHA Phase 6 Lahore under 5 Crore">
                📍 10 Marla DHA Phase 6
              </button>
              <button type="button" class="ai-sample-prompt-btn" data-prompt="1 Kanal plot in Bahria Town Islamabad with lake view">
                🌲 1 Kanal Bahria Town
              </button>
              <button type="button" class="ai-sample-prompt-btn" data-prompt="3 bedroom luxury apartment in Clifton Karachi for rent">
                🌊 3 Bed Flat Clifton
              </button>
            </div>
          </div>

          <!-- Standard Filter Dropdowns Grid Form -->
          <div class="search-filters-grid">
            <!-- City Selector -->
            <div class="filter-group">
              <label>${renderIcon('map-pin', 14, '#239C32')} ${t('city_label', 'City')}</label>
              <select id="filter-city" class="filter-select">
                <option value="all">${t('city_all', 'All Cities in Pakistan')}</option>
                ${CITIES_DATA.map(c => `
                  <option value="${c.id}" ${selectedCity === c.id ? 'selected' : ''}>${tCity(c.name)}</option>
                `).join('')}
              </select>
            </div>

            <!-- Society / Location Selector -->
            <div class="filter-group">
              <label>${renderIcon('building-2', 14, '#239C32')} ${t('society_label', 'Society / Sector')}</label>
              <select id="filter-society" class="filter-select">
                <option value="all">${t('society_all', 'All Societies & Locations')}</option>
                ${societiesList.map(s => `
                  <option value="${s}" ${state.searchFilters.society === s ? 'selected' : ''}>${s}</option>
                `).join('')}
              </select>
            </div>

            <!-- Property Type Selector -->
            <div class="filter-group">
              <label>${renderIcon('home', 14, '#239C32')} ${t('type_label', 'Property Type')}</label>
              <select id="filter-type" class="filter-select">
                <option value="all">${t('type_all', 'All Property Types')}</option>
                ${PROPERTY_TYPES.map(pt => `
                  <option value="${pt.id}" ${state.searchFilters.category === pt.id ? 'selected' : ''}>${tCategory(pt.name)}</option>
                `).join('')}
              </select>
            </div>

            <!-- Property Size Selector -->
            <div class="filter-group">
              <label>${renderIcon('ruler', 14, '#239C32')} ${t('size_label', 'Property Size')}</label>
              <select id="filter-size" class="filter-select">
                <option value="all">${t('size_any', 'Any Size')}</option>
                <option value="5" ${state.searchFilters.exactSizeMarla === 5 ? 'selected' : ''}>5 ${t('marla', 'Marla')}</option>
                <option value="7" ${state.searchFilters.exactSizeMarla === 7 ? 'selected' : ''}>7 ${t('marla', 'Marla')}</option>
                <option value="10" ${state.searchFilters.exactSizeMarla === 10 ? 'selected' : ''}>10 ${t('marla', 'Marla')}</option>
                <option value="20" ${state.searchFilters.exactSizeMarla === 20 ? 'selected' : ''}>1 ${t('kanal', 'Kanal')}</option>
                <option value="40" ${state.searchFilters.exactSizeMarla === 40 ? 'selected' : ''}>2 ${t('kanal', 'Kanal')}</option>
              </select>
            </div>

            <!-- Budget Range Selector -->
            <div class="filter-group">
              <label>${renderIcon('dollar-sign', 14, '#239C32')} ${t('price_label', 'Max Price')}</label>
              <select id="filter-price" class="filter-select">
                <option value="all">${t('price_any', 'Any Price')}</option>
                <option value="5000000" ${state.searchFilters.maxPrice === '5000000' ? 'selected' : ''}>Under 50 Lakhs (PKR 5M)</option>
                <option value="15000000" ${state.searchFilters.maxPrice === '15000000' ? 'selected' : ''}>Under 1.5 Crore (PKR 15M)</option>
                <option value="35000000" ${state.searchFilters.maxPrice === '35000000' ? 'selected' : ''}>Under 3.5 Crore (PKR 35M)</option>
                <option value="60000000" ${state.searchFilters.maxPrice === '60000000' ? 'selected' : ''}>Under 6.0 Crore (PKR 60M)</option>
                <option value="100000000" ${state.searchFilters.maxPrice === '100000000' ? 'selected' : ''}>Under 10.0 Crore (PKR 100M)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Secondary CTA Actions below Search Engine -->
        <div class="hero-actions" style="margin-top:1.25rem;">
          <button type="button" class="btn btn-hero-primary" id="open-post-property-btn">
            ${renderIcon('plus-circle', 18)} <span>${t('btn_post_free', 'Post Property FREE')}</span>
            <small class="cta-badge">3x Leads</small>
          </button>

          <button type="button" class="btn btn-hero-secondary" id="open-featured-modal-btn">
            ${renderIcon('sparkles', 16)} <span>${t('badge_featured', 'FEATURED')} Spot</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

