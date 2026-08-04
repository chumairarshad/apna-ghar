import { renderIcon } from '../utils/icons.js';

export function renderVirtualTourModal(state) {
  const isVisible = state.showVirtualTourModal || false;
  const prop = state.virtualTourProperty || state.properties[0];

  if (!prop) return `<div id="virtual-tour-overlay"></div>`;

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="virtual-tour-overlay">
      <div class="modal-container" style="max-width:960px;">
        <div class="modal-header" style="background:var(--forest-dk); color:var(--paper);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            ${renderIcon('sparkles', 20, 'var(--marigold)')}
            <h3 class="modal-title" style="color:var(--paper); font-size:1.15rem;">360° Virtual Tour & 3D Floor Plan</h3>
          </div>
          <button class="close-modal-btn" id="close-tour-btn" style="color:var(--paper);">&times;</button>
        </div>

        <div class="modal-body" style="padding:1.25rem;">
          <div style="margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h4 style="font-family:var(--font-display); font-size:1.1rem; color:var(--forest-dk);">${prop.title}</h4>
              <p style="font-size:0.82rem; color:var(--forest); opacity:0.85;">${prop.location}, ${prop.city}</p>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn btn-dark btn-sm tour-tab-btn active" data-ttab="360">
                ${renderIcon('maximize', 14)} 360° Panorama
              </button>
              <button type="button" class="btn btn-ghost btn-sm tour-tab-btn" data-ttab="floor">
                ${renderIcon('building', 14)} 3D Floor Plan
              </button>
            </div>
          </div>

          <!-- Interactive 360 Viewport Showcase -->
          <div style="position:relative; height:440px; border-radius:10px; overflow:hidden; border:2px solid var(--forest-dk); background:#000;">
            <img src="${prop.images[0]}" style="width:100%; height:100%; object-fit:cover; filter:brightness(0.9);" alt="360 Tour View" />

            <!-- Floating 360 Hotspot Badges -->
            <div style="position:absolute; top:35%; left:45%; background:rgba(209, 38, 110, 0.9); color:white; font-family:var(--font-mono); font-size:0.75rem; font-weight:700; padding:6px 14px; border-radius:20px; box-shadow:0 0 15px rgba(209, 38, 110, 0.6); cursor:pointer; display:flex; align-items:center; gap:6px;">
              <span class="pulse-dot"></span> Main Drawing Lounge 360°
            </div>

            <div style="position:absolute; bottom:25%; right:20%; background:rgba(19, 29, 12, 0.9); color:var(--marigold); font-family:var(--font-mono); font-size:0.75rem; font-weight:700; padding:6px 14px; border-radius:20px; border:1px solid var(--marigold); cursor:pointer; display:flex; align-items:center; gap:6px;">
              ${renderIcon('sparkles', 12, 'var(--marigold)')} Italian Fitted Kitchen
            </div>

            <div style="position:absolute; bottom:15px; left:15px; background:rgba(0,0,0,0.75); color:white; padding:6px 14px; border-radius:6px; font-family:var(--font-mono); font-size:0.75rem;">
              👈 Drag mouse to look around 360°
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
