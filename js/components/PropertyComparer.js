import { formatPKR, formatArea } from '../utils/formatters.js';
import { renderIcon } from '../utils/icons.js';

export function renderPropertyComparerModal(state) {
  const isVisible = state.showComparerModal || false;
  const compareProps = state.compareProperties || state.properties.slice(0, 3);

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="comparer-modal-overlay">
      <div class="modal-container" style="max-width:1050px;">
        <div class="modal-header" style="background:var(--forest-dk); color:var(--paper);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            ${renderIcon('sparkles', 20, 'var(--marigold)')}
            <h3 class="modal-title" style="color:var(--paper); font-size:1.15rem;">Side-by-Side Property Comparison Matrix</h3>
          </div>
          <button class="close-modal-btn" id="close-comparer-btn" style="color:var(--paper);">&times;</button>
        </div>

        <div class="modal-body" style="padding:1.5rem;">
          <div class="table-responsive">
            <table class="dealer-table" style="min-width:750px;">
              <thead>
                <tr>
                  <th style="width:180px;">Feature</th>
                  ${compareProps.map(p => `
                    <th style="text-align:center;">
                      <img src="${p.images[0]}" style="width:100%; height:110px; object-fit:cover; border-radius:6px; margin-bottom:8px; border:1px solid var(--forest-dk);" />
                      <div style="font-family:var(--font-display); font-size:0.9rem; color:var(--forest-dk); line-height:1.2;">${p.title}</div>
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight:700; color:var(--forest-dk);">Price</td>
                  ${compareProps.map(p => `<td style="text-align:center; font-family:var(--font-mono); font-weight:800; color:var(--rani-dk); font-size:1.05rem;">${formatPKR(p.price)}</td>`).join('')}
                </tr>
                <tr>
                  <td style="font-weight:700; color:var(--forest-dk);">Area Size</td>
                  ${compareProps.map(p => `<td style="text-align:center; font-family:var(--font-mono); font-weight:700;">${formatArea(p.sizeMarla, 'Marla')}</td>`).join('')}
                </tr>
                <tr>
                  <td style="font-weight:700; color:var(--forest-dk);">City & Location</td>
                  ${compareProps.map(p => `<td style="text-align:center; font-size:0.85rem;">${p.location}, ${p.city}</td>`).join('')}
                </tr>
                <tr>
                  <td style="font-weight:700; color:var(--forest-dk);">Bedrooms & Baths</td>
                  ${compareProps.map(p => `<td style="text-align:center; font-family:var(--font-mono); font-size:0.85rem;">🛏️ ${p.bedrooms} Beds | 🛁 ${p.bathrooms} Baths</td>`).join('')}
                </tr>
                <tr>
                  <td style="font-weight:700; color:var(--forest-dk);">Built Year</td>
                  ${compareProps.map(p => `<td style="text-align:center; font-family:var(--font-mono);">${p.builtYear}</td>`).join('')}
                </tr>
                <tr>
                  <td style="font-weight:700; color:var(--forest-dk);">Verified Agency</td>
                  ${compareProps.map(p => `<td style="text-align:center; font-size:0.82rem; font-weight:700; color:var(--forest);">${p.agency.name}</td>`).join('')}
                </tr>
                <tr>
                  <td style="font-weight:700; color:var(--forest-dk);">Action</td>
                  ${compareProps.map(p => `
                    <td style="text-align:center;">
                      <a href="https://wa.me/${p.agency.whatsapp}" target="_blank" class="btn btn-whatsapp btn-sm" style="padding:4px 10px; font-size:0.75rem;">
                        ${renderIcon('message-circle', 12)} WhatsApp Dealer
                      </a>
                    </td>
                  `).join('')}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}
