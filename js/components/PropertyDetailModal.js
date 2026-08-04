import { formatPKR, formatArea } from '../utils/formatters.js';
import { renderIcon } from '../utils/icons.js';

export function renderPropertyDetailModal(state) {
  const prop = state.selectedProperty;

  if (!prop) return `<div id="prop-detail-modal-overlay"></div>`;

  return `
    <div class="modal-overlay active" id="prop-detail-modal-overlay">
      <div class="modal-container" style="max-width:920px;">
        <div class="modal-header">
          <h3 class="modal-title">${prop.title}</h3>
          <button class="close-modal-btn" id="close-prop-detail-btn">&times;</button>
        </div>

        <div class="modal-body" style="padding-top:1rem;">
          <!-- Image Gallery Grid with 360° Overlay -->
          <div style="position:relative; margin-bottom:1.5rem; border-radius:12px; overflow:hidden; border:2px solid var(--forest-dk);">
            <div style="display:grid; grid-template-columns: 2fr 1fr; gap:0.5rem;">
              <img src="${prop.images[0]}" style="width:100%; height:320px; object-fit:cover;" />
              <div style="display:flex; flex-direction:column; gap:0.5rem;">
                <img src="${prop.images[1] || prop.images[0]}" style="width:100%; height:156px; object-fit:cover;" />
                <img src="${prop.images[2] || prop.images[0]}" style="width:100%; height:156px; object-fit:cover;" />
              </div>
            </div>

            <!-- Launch 360 Virtual Tour Button Overlay -->
            <button type="button" class="btn btn-dark open-tour-btn" data-id="${prop.id}" style="position:absolute; bottom:15px; left:15px; background:rgba(19, 29, 12, 0.95); color:var(--marigold); border:2px solid var(--marigold); font-size:0.88rem; font-weight:700; padding:10px 20px; border-radius:30px; box-shadow:0 8px 25px rgba(0,0,0,0.6); display:flex; align-items:center; gap:8px;">
              ${renderIcon('sparkles', 16, 'var(--marigold)')} 🕶️ Launch 360° Virtual Walkthrough & Floor Plan
            </button>
          </div>

          <!-- Header & Price -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
            <div>
              <div class="card-badges" style="position:static; margin-bottom:0.5rem;">
                ${prop.badges.map(b => `<span class="badge badge-verified" style="margin-right:4px;">${b}</span>`).join('')}
              </div>
              <h2 style="font-size:1.6rem; color:var(--forest-dk); line-height:1.2; margin-bottom:0.35rem;">${prop.title}</h2>
              <div style="color:var(--forest); font-size:0.95rem; opacity:0.85; display:flex; align-items:center; gap:4px;">
                ${renderIcon('map-pin', 16, 'var(--rani)')}
                ${prop.address}
              </div>
            </div>

            <div style="text-align:right;">
              <div style="font-family:var(--font-mono); font-size:2.2rem; font-weight:800; color:var(--rani-dk);">
                ${formatPKR(prop.price)}
              </div>
              <div style="font-size:0.85rem; color:var(--forest); font-weight:600; opacity:0.8;">
                Avg: ${formatPKR(Math.round(prop.price / prop.sizeMarla))} / Marla
              </div>
            </div>
          </div>

          <!-- Overview Key Metrics Grid -->
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem; background:var(--cream); padding:1.25rem; border-radius:12px; margin-bottom:1.5rem; text-align:center; border:2px solid var(--border-dk);">
            <div>
              <div style="font-size:0.75rem; color:var(--forest); font-weight:700;">BEDROOMS</div>
              <div style="font-size:1.15rem; font-weight:800; color:var(--forest-dk);">${prop.bedrooms || 'N/A'}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:var(--forest); font-weight:700;">BATHROOMS</div>
              <div style="font-size:1.15rem; font-weight:800; color:var(--forest-dk);">${prop.bathrooms || 'N/A'}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:var(--forest); font-weight:700;">AREA SIZE</div>
              <div style="font-size:1.15rem; font-weight:800; color:var(--forest-dk);">${formatArea(prop.sizeMarla, state.unit)}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:var(--forest); font-weight:700;">FACING</div>
              <div style="font-size:1.05rem; font-weight:700; color:var(--forest-dk);">${prop.facing || 'Main Boulevard'}</div>
            </div>
          </div>

          <!-- Description & Features -->
          <div style="margin-bottom:1.75rem;">
            <h3 style="margin-bottom:0.75rem; color:var(--forest-dk);">Property Overview & Description</h3>
            <p style="color:var(--ink); font-size:0.95rem; line-height:1.7;">${prop.description}</p>
          </div>

          <div style="margin-bottom:1.75rem;">
            <h3 style="margin-bottom:0.75rem; color:var(--forest-dk);">Features & Amenities</h3>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.75rem;">
              ${prop.features.map(f => `
                <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.9rem; font-weight:600; color:var(--forest-dk);">
                  ${renderIcon('check-circle', 16, 'var(--rani)')} ${f}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Agent Contact & Inquiry Form Card -->
          <div style="background:var(--forest-dk); color:white; border-radius:16px; padding:1.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.5rem; border:2px solid var(--forest);">
            <div style="display:flex; align-items:center; gap:1rem;">
              <img src="${prop.agency.avatar}" style="width:4rem; height:4rem; border-radius:50%; border:2px solid var(--marigold); object-fit:cover;" />
              <div>
                <h4 style="color:white; font-size:1.2rem; margin:0;">${prop.agency.agentName}</h4>
                <p style="color:var(--meadow-lt); font-size:0.88rem; margin:2px 0;">${prop.agency.name} • <span style="color:var(--marigold);">${prop.agency.badge}</span></p>
                <p style="color:var(--cream); opacity:0.8; font-size:0.8rem; margin:0;">Phone: ${prop.agency.phone}</p>
              </div>
            </div>

            <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
              ${(state.user?.role === 'DEALER' || state.user?.role === 'ADMIN') ? `
                <button type="button" class="btn btn-secondary btn-sm modal-edit-prop-btn" data-id="${prop.id}" style="padding:10px 18px; font-size:0.88rem; background:var(--emerald-teal); color:white; border:none; cursor:pointer;">
                  ✏️ Edit Listing
                </button>
                <button type="button" class="btn btn-danger btn-sm modal-delete-prop-btn" data-id="${prop.id}" style="padding:10px 18px; font-size:0.88rem; background:#EF4444; color:white; border:none; cursor:pointer;">
                  🗑️ Delete Listing
                </button>
              ` : ''}
              <button type="button" class="btn btn-marigold btn-sm schedule-btn" data-id="${prop.id}" style="padding:10px 18px; font-size:0.88rem;">
                ${renderIcon('calendar', 16)} Book Visit
              </button>
              <a href="https://wa.me/${prop.agency.whatsapp}?text=Hi%20${encodeURIComponent(prop.agency.agentName)},%20I%20am%20interested%20in%20listing%20ID%20${prop.id}%20(${encodeURIComponent(prop.title)})" 
                 target="_blank" 
                 class="btn btn-whatsapp btn-sm" 
                 style="padding:10px 18px; font-size:0.88rem;">
                ${renderIcon('message-circle', 16)} WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
