import { CITIES_DATA, PROPERTY_TYPES } from '../data/cities.js';
import { renderIcon } from '../utils/icons.js';

export function renderHeroSearch(state) {
  const activeTab = state.searchFilters.purpose || 'sale'; // sale | rent | commercial | projects
  const selectedCity = state.searchFilters.city || 'all';

  const currentCityObj = CITIES_DATA.find(c => c.id === selectedCity);
  const societiesList = currentCityObj ? currentCityObj.societies : [];

  return `
    <section class="hero-section">
      <div class="container hero-content">
        <!-- Hero Text Header -->
        <div class="hero-text-wrapper">
          <div class="hero-badge">
            <span class="pulse-dot"></span>
            PAKISTAN'S #1 VERIFIED PROPERTY PORTAL
          </div>
          <h1 class="hero-title">
            Find Your Dream <span>Property</span> in Pakistan
          </h1>
          <p class="hero-subtitle">
            Buy, Rent & Invest in Verified Luxury Houses, Apartments, Commercial Plots & Megaprojects across Lahore, Islamabad, Karachi, and major cities.
          </p>

          <!-- Dual Action CTA Buttons (List Property & Feature Property) -->
          <div style="margin-top:1.5rem; display:flex; gap:0.85rem; justify-content:center; flex-wrap:wrap;">
            <button type="button" class="btn btn-primary" id="open-post-property-btn" style="border-radius:30px; box-shadow:var(--shadow-lift); padding:12px 28px; font-size:0.95rem;">
              ${renderIcon('plus-circle', 18)} List Free Property (3x Direct Leads)
            </button>

            <button type="button" class="btn btn-marigold" id="open-featured-modal-btn" style="border-radius:30px; box-shadow:var(--shadow-md); padding:12px 24px; font-size:0.92rem;">
              ${renderIcon('sparkles', 16)} Get Featured Spot
            </button>
          </div>
        </div>

        <!-- Search Engine Box Container -->
        <div class="search-engine-box">
          <!-- Purpose Tabs -->
          <div class="search-tabs-container">
            <button class="search-tab ${activeTab === 'sale' ? 'active' : ''}" data-purpose="sale">
              ${renderIcon('home', 16)} Buy
            </button>
            <button class="search-tab ${activeTab === 'rent' ? 'active' : ''}" data-purpose="rent">
              ${renderIcon('key', 16)} Rent
            </button>
            <button class="search-tab ${activeTab === 'projects' ? 'active' : ''}" data-purpose="projects">
              ${renderIcon('building-2', 16)} Megaprojects
            </button>
          </div>

          <!-- Integrated AI Natural Language Search Prompt Bar -->
          <div style="background:var(--forest-dk); color:var(--paper); border-radius:12px; padding:1.15rem; margin-bottom:1.5rem; border:2px solid var(--marigold); box-shadow:var(--shadow-md);">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.6rem;">
              ${renderIcon('sparkles', 16, 'var(--marigold)')}
              <label style="font-family:var(--font-mono); font-size:0.78rem; font-weight:700; color:var(--marigold); text-transform:uppercase; letter-spacing:0.5px;">
                🤖 AI Smart Property Search — Type in Plain English or Urdu
              </label>
            </div>

            <div style="display:flex; gap:0.65rem;" class="ai-main-input-wrap">
              <input type="text" 
                     id="ai-prompt-input" 
                     placeholder="e.g. 10 Marla house in DHA Phase 6 Lahore under 4.5 Crore with solar grid..." 
                     style="flex:1; height:46px; background:var(--paper); color:var(--ink); border:2px solid var(--border-dk); border-radius:6px; padding:0 1rem; font-size:0.92rem; font-weight:600;" />

              <button type="button" class="btn btn-primary" id="execute-ai-search-btn" style="height:46px; padding:0 1.25rem; font-size:0.88rem;">
                ${renderIcon('sparkles', 16)} AI Match
              </button>
            </div>

            <!-- Quick AI Prompt Chips -->
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.75rem; align-items:center;">
              <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--meadow-lt); font-weight:600;">Sample Prompts:</span>
              <button type="button" class="ai-sample-prompt-btn" data-prompt="10 Marla house in DHA Phase 6 Lahore under 5 Crore" style="background:rgba(255,255,255,0.1); border:1px solid rgba(242,167,27,0.4); color:var(--paper); font-size:0.72rem; padding:3px 10px; border-radius:15px;">
                📍 10 Marla DHA Phase 6
              </button>
              <button type="button" class="ai-sample-prompt-btn" data-prompt="1 Kanal plot in Bahria Town Islamabad with lake view" style="background:rgba(255,255,255,0.1); border:1px solid rgba(242,167,27,0.4); color:var(--paper); font-size:0.72rem; padding:3px 10px; border-radius:15px;">
                🌲 1 Kanal Bahria Town
              </button>
              <button type="button" class="ai-sample-prompt-btn" data-prompt="3 bedroom luxury apartment in Clifton Karachi for rent" style="background:rgba(255,255,255,0.1); border:1px solid rgba(242,167,27,0.4); color:var(--paper); font-size:0.72rem; padding:3px 10px; border-radius:15px;">
                🌊 3 Bed Flat Clifton
              </button>
            </div>
          </div>

          <!-- Standard Filter Dropdowns Grid Form -->
          <div class="search-filters-grid">
            <!-- City Selector -->
            <div class="filter-group">
              <label>${renderIcon('map-pin', 13, 'var(--rani)')} Select City</label>
              <select id="filter-city" class="filter-select">
                <option value="all">All Cities in Pakistan</option>
                ${CITIES_DATA.map(c => `
                  <option value="${c.id}" ${selectedCity === c.id ? 'selected' : ''}>${c.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Society / Location -->
            <div class="filter-group">
              <label>${renderIcon('navigation', 13, 'var(--rani)')} Society / Area</label>
              <select id="filter-society" class="filter-select">
                <option value="all">All Societies & Sectors</option>
                ${societiesList.map(s => `
                  <option value="${s}">${s}</option>
                `).join('')}
              </select>
            </div>

            <!-- Property Type -->
            <div class="filter-group">
              <label>${renderIcon('building', 13, 'var(--rani)')} Property Type</label>
              <select id="filter-type" class="filter-select">
                <option value="all">All Property Types</option>
                ${PROPERTY_TYPES.map(t => `
                  <option value="${t.id}">${t.label}</option>
                `).join('')}
              </select>
            </div>

            <!-- Action Button -->
            <div class="filter-group search-btn-group">
              <button class="btn btn-primary btn-search" id="execute-search-btn">
                ${renderIcon('search', 18, 'white')} Search Properties
              </button>
            </div>
          </div>

          <!-- Quick Filter Chips -->
          <div class="quick-chips">
            <span class="chip-label">Popular Filters:</span>
            <button class="filter-chip" data-badge="VERIFIED">
              ${renderIcon('shield-check', 12)} Verified DHA
            </button>
            <button class="filter-chip" data-size="10">
              ${renderIcon('maximize', 12)} 10 Marla Modern
            </button>
            <button class="filter-chip" data-size="20">
              ${renderIcon('home', 12)} 1 Kanal Luxury Villa
            </button>
            <button class="filter-chip" data-badge="HOT DEAL">
              ${renderIcon('flame', 12, 'var(--rani)')} Hot Deals
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}
