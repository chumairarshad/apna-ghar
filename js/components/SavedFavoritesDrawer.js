import { getFavorites } from '../utils/storage.js';
import { formatPKR } from '../utils/formatters.js';

export function renderSavedFavoritesDrawer(allProperties, state) {
  const isVisible = state.showFavoritesDrawer || false;
  const favIds = getFavorites();
  const favProperties = allProperties.filter(p => favIds.includes(p.id));

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="fav-drawer-overlay">
      <div class="modal-container" style="max-width:550px; margin-left:auto; height:100vh; max-height:100vh; border-radius:0;">
        <div class="modal-header">
          <h3 class="modal-title"><i data-lucide="heart" style="width:20px; height:20px; color:#EF4444; vertical-align:middle; fill:#EF4444;"></i> Saved Wishlist (${favProperties.length})</h3>
          <button class="close-modal-btn" id="close-fav-drawer-btn">&times;</button>
        </div>

        <div class="modal-body" style="overflow-y:auto; height:calc(100vh - 130px);">
          ${favProperties.length === 0 ? `
            <div style="text-align:center; padding:3rem 1rem;">
              <i data-lucide="heart-off" style="width:48px; height:48px; color:var(--text-muted); margin-bottom:1rem;"></i>
              <h3>No saved properties yet</h3>
              <p style="color:var(--text-muted); font-size:0.9rem;">Click the heart icon on any property card to bookmark it here.</p>
            </div>
          ` : `
            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${favProperties.map(p => `
                <div style="display:flex; gap:1rem; background:var(--bg-main); padding:0.85rem; border-radius:12px; border:1px solid var(--border-light); align-items:center;">
                  <img src="${p.images && p.images[0] ? p.images[0] : ''}" style="width:80px; height:70px; border-radius:8px; object-fit:cover;" />
                  <div style="flex:1;">
                    <strong style="font-size:0.92rem; display:block; color:var(--text-main); line-height:1.2; margin-bottom:0.25rem;">${p.title}</strong>
                    <div style="font-weight:800; color:var(--primary-emerald); font-size:0.95rem;">${formatPKR(p.price)}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${p.location}, ${p.city}</div>
                  </div>
                  <button class="btn btn-secondary btn-sm remove-fav-item-btn" data-id="${p.id}" style="padding:0.35rem 0.5rem; font-size:0.75rem; color:#EF4444;">
                    Remove
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
