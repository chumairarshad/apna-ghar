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

          <!-- Integrated AI Natural Language Search Prompt Bar (High Contrast & Prominent Size) -->
          <div class="ai-search-container-box" style="background:linear-gradient(135deg, var(--forest-dk), #1c2b14); color:var(--paper); border-radius:14px; padding:1.5rem 1.75rem; margin-bottom:1.5rem; border:3px solid var(--marigold); box-shadow:0 10px 30px rgba(19,29,12,0.3);">
            <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.75rem;">
              <div style="width:28px; height:28px; background:var(--marigold); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--forest-dk); flex-shrink:0;">
                ${renderIcon('sparkles', 16, 'var(--forest-dk)')}
              </div>
              <label style="font-family:var(--font-display); font-size:0.95rem; font-weight:800; color:var(--marigold); text-transform:uppercase; letter-spacing:0.8px; margin:0;">
                🤖 AI Smart Property Search Engine — Type in Plain English or Urdu
              </label>
            </div>

            <div style="display:flex; gap:0.75rem;" class="ai-main-input-wrap">
              <input type="text" 
                     id="ai-prompt-input" 
                     placeholder="e.g. 10 Marla house in DHA Phase 6 Lahore under 4.5 Crore with solar grid..." 
                     style="flex:1; height:56px; background:#ffffff; color:#0F172A; border:3px solid #1E293B; border-radius:10px; padding:0 1.25rem; font-size:1.05rem; font-weight:700; box-shadow:0 3px 10px rgba(0,0,0,0.1);" />

              <button type="button" class="btn btn-primary" id="execute-ai-search-btn" style="height:56px; padding:0 1.75rem; font-size:1rem; font-weight:800; border-radius:10px; box-shadow:0 6px 20px rgba(209,38,110,0.45); flex-shrink:0;">
                ${renderIcon('sparkles', 20)} AI Match
              </button>
            </div>

            <!-- Quick AI Prompt Chips -->
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.85rem; align-items:center;">
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--meadow-lt); font-weight:700;">Sample Prompts:</span>
              <button type="button" class="ai-sample-prompt-btn" data-prompt="10 Marla house in DHA Phase 6 Lahore under 5 Crore" style="background:rgba(255,255,255,0.12); border:1.5px solid rgba(242,167,27,0.5); color:var(--paper); font-size:0.78rem; font-weight:700; padding:4px 12px; border-radius:16px;">
                📍 10 Marla DHA Phase 6
              </button>
              <button type="button" class="ai-sample-prompt-btn" data-prompt="1 Kanal plot in Bahria Town Islamabad with lake view" style="background:rgba(255,255,255,0.12); border:1.5px solid rgba(242,167,27,0.5); color:var(--paper); font-size:0.78rem; font-weight:700; padding:4px 12px; border-radius:16px;">
                🌲 1 Kanal Bahria Town
              </button>
              <button type="button" class="ai-sample-prompt-btn" data-prompt="3 bedroom luxury apartment in Clifton Karachi for rent" style="background:rgba(255,255,255,0.12); border:1.5px solid rgba(242,167,27,0.5); color:var(--paper); font-size:0.78rem; font-weight:700; padding:4px 12px; border-radius:16px;">
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

            <!-- Society / Location Selector -->
            <div class="filter-group">
              <label>${renderIcon('building-2', 13, 'var(--rani)')} Society / Sector</label>
              <select id="filter-society" class="filter-select">
                <option value="all">All Societies & Locations</option>
                ${societiesList.map(s => `
                  <option value="${s}" ${state.searchFilters.society === s ? 'selected' : ''}>${s}</option>
                `).join('')}
              </select>
            </div>

            <!-- Property Type Selector -->
            <div class="filter-group">
              <label>${renderIcon('home', 13, 'var(--rani)')} Property Type</label>
              <select id="filter-type" class="filter-select">
                <option value="all">All Property Types</option>
                ${PROPERTY_TYPES.map(t => `
                  <option value="${t.id}" ${state.searchFilters.category === t.id ? 'selected' : ''}>${t.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Budget Range Selector -->
            <div class="filter-group">
              <label>${renderIcon('dollar-sign', 13, 'var(--rani)')} Max Price Range</label>
              <select id="filter-price" class="filter-select">
                <option value="all">Any Price</option>
                <option value="5000000" ${state.searchFilters.maxPrice === '5000000' ? 'selected' : ''}>Under 50 Lakhs (PKR 5M)</option>
                <option value="15000000" ${state.searchFilters.maxPrice === '15000000' ? 'selected' : ''}>Under 1.5 Crore (PKR 15M)</option>
                <option value="35000000" ${state.searchFilters.maxPrice === '35000000' ? 'selected' : ''}>Under 3.5 Crore (PKR 35M)</option>
                <option value="60000000" ${state.searchFilters.maxPrice === '60000000' ? 'selected' : ''}>Under 6.0 Crore (PKR 60M)</option>
                <option value="100000000" ${state.searchFilters.maxPrice === '100000000' ? 'selected' : ''}>Under 10.0 Crore (PKR 100M)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
