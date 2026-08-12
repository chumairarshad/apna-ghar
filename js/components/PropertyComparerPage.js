import { renderIcon } from '../utils/icons.js';
import { formatPKR, formatArea } from '../utils/formatters.js';

export function renderPropertyComparerPage(state) {
  const compareList = state.compareProperties || [];

  return `
    <div class="property-comparer-page-wrapper" style="background: var(--cream); min-height: 90vh; padding: 2rem 0 4rem 0;">
      <div class="container">
        
        <!-- Breadcrumbs -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.75rem;">
          <nav aria-label="breadcrumb">
            <ol style="display: flex; align-items: center; gap: 8px; list-style: none; padding: 0; margin: 0; font-size: 0.85rem; font-weight: 700; color: var(--forest-dk);">
              <li><a href="#buy" style="color: var(--rani-dk); text-decoration: none;">Home</a></li>
              <li style="color: var(--forest); opacity: 0.5;">/</li>
              <li style="color: var(--forest-dk);">Property Comparison</li>
            </ol>
          </nav>

          <a href="#buy" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700; background: var(--paper); border: 2px solid var(--forest-dk); border-radius: 8px; padding: 6px 14px; text-decoration: none; color: var(--forest-dk);">
            ${renderIcon('arrow-left', 14)} Back to Property Search
          </a>
        </div>

        <!-- Main Card -->
        <div style="background: var(--paper); border-radius: 20px; border: 3px solid var(--forest-dk); box-shadow: var(--shadow-lg); overflow: hidden;">
          
          <div style="background: var(--forest-dk); color: white; padding: 2rem; border-bottom: 4px solid var(--marigold); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge" style="background: var(--marigold); color: var(--forest-dk); font-weight: 800; font-size: 0.75rem; padding: 4px 12px; margin-bottom: 6px; display: inline-block;">
                DECISION ENGINE
              </span>
              <h1 style="font-size: 1.8rem; font-weight: 800; color: white; margin: 0;">
                Side-by-Side Property Comparison Matrix
              </h1>
              <p style="color: var(--cream); opacity: 0.85; font-size: 0.88rem; margin-top: 4px; margin-bottom: 0;">
                Compare prices, marla sizes, bedroom stats, and location advantages of up to 4 properties.
              </p>
            </div>

            ${compareList.length > 0 ? `
              <button type="button" id="clear-compare-list-btn" class="btn btn-danger btn-sm" style="font-weight: 800; padding: 8px 16px;">
                🗑️ Clear All Selected
              </button>
            ` : ''}
          </div>

          <div style="padding: 2rem; overflow-x: auto;">
            ${compareList.length === 0 ? `
              <div style="text-align: center; padding: 3rem 1rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                <h3 style="color: var(--forest-dk); font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: 800;">
                  No Properties Added for Comparison
                </h3>
                <p style="color: var(--forest); opacity: 0.8; font-size: 0.9rem; margin-bottom: 1.5rem;">
                  Click the <strong>"⚖️ Compare"</strong> button on any property card to compare them side-by-side.
                </p>
                <a href="#buy" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-weight: 800; border-radius: 8px;">
                  🔍 Browse & Select Properties
                </a>
              </div>
            ` : `
              <table class="table" style="width: 100%; border-collapse: collapse; min-width: 650px;">
                <thead>
                  <tr style="background: var(--cream); border-bottom: 3px solid var(--border-dk);">
                    <th style="padding: 1rem; text-align: left; font-family: var(--font-mono); font-size: 0.8rem; color: var(--forest-dk); width: 180px;">METRIC / SPEC</th>
                    ${compareList.map(p => `
                      <th style="padding: 1rem; text-align: center; font-size: 0.95rem; color: var(--forest-dk); font-weight: 800;">
                        <img src="${p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80'}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px; margin-bottom: 8px; border: 2px solid var(--border-dk);" />
                        <div>${p.title}</div>
                        <button type="button" class="btn btn-outline btn-sm remove-compare-item-btn" data-id="${p.id}" style="margin-top: 6px; font-size: 0.72rem; padding: 2px 8px; color: #EF4444; border-color: #EF4444;">Remove</button>
                      </th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid var(--border-dk);">
                    <td style="padding: 0.85rem; font-weight: 800; color: var(--forest-dk); background: var(--cream);">Price Demand</td>
                    ${compareList.map(p => `<td style="padding: 0.85rem; text-align: center; font-family: var(--font-mono); font-weight: 800; font-size: 1.1rem; color: var(--rani-dk);">${formatPKR(p.price)}</td>`).join('')}
                  </tr>
                  <tr style="border-bottom: 1px solid var(--border-dk);">
                    <td style="padding: 0.85rem; font-weight: 800; color: var(--forest-dk); background: var(--cream);">City & Society</td>
                    ${compareList.map(p => `<td style="padding: 0.85rem; text-align: center; font-weight: 700; color: var(--forest-dk);">${p.city} • ${p.location}</td>`).join('')}
                  </tr>
                  <tr style="border-bottom: 1px solid var(--border-dk);">
                    <td style="padding: 0.85rem; font-weight: 800; color: var(--forest-dk); background: var(--cream);">Area Size</td>
                    ${compareList.map(p => `<td style="padding: 0.85rem; text-align: center; font-weight: 800; color: var(--forest-dk);">${formatArea(p.sizeMarla, state.unit)}</td>`).join('')}
                  </tr>
                  <tr style="border-bottom: 1px solid var(--border-dk);">
                    <td style="padding: 0.85rem; font-weight: 800; color: var(--forest-dk); background: var(--cream);">Bedrooms / Baths</td>
                    ${compareList.map(p => `<td style="padding: 0.85rem; text-align: center; font-weight: 700; color: var(--forest-dk);">${p.bedrooms || 'N/A'} Bed / ${p.bathrooms || 'N/A'} Bath</td>`).join('')}
                  </tr>
                  <tr style="border-bottom: 1px solid var(--border-dk);">
                    <td style="padding: 0.85rem; font-weight: 800; color: var(--forest-dk); background: var(--cream);">Action / Detail</td>
                    ${compareList.map(p => `
                      <td style="padding: 0.85rem; text-align: center;">
                        <a href="#property/${p.id}" class="btn btn-primary btn-sm view-prop-detail-btn" data-id="${p.id}" style="font-weight: 800; text-decoration: none; padding: 6px 14px;">
                          View Dedicated Page
                        </a>
                      </td>
                    `).join('')}
                  </tr>
                </tbody>
              </table>
            `}
          </div>

        </div>

      </div>
    </div>
  `;
}
