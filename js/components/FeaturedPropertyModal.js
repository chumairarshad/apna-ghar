import { renderIcon } from '../utils/icons.js';

export function renderFeaturedPropertyModal(state) {
  const isVisible = state.showFeaturedModal || false;

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="featured-modal-overlay" style="z-index:99995;">
      <div class="modal-container" style="max-width:520px; border-radius:18px; overflow:hidden; padding:0; border:2.5px solid #239C32; box-shadow:0 25px 50px rgba(0,0,0,0.35);">
        
        <!-- Modal Header Header Cover Banner -->
        <div style="position:relative; height:210px; overflow:hidden; background:#0F172A;">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" alt="Featured Property Ad" style="width:100%; height:100%; object-fit:cover;" />
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(0,0,0,0.2) 60%);"></div>

          <!-- Featured Sponsor Badge -->
          <div style="position:absolute; top:12px; left:12px; background:#239C32; color:#FFFFFF; font-family:var(--font-body); font-size:0.68rem; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.5px; display:flex; align-items:center; gap:4px; z-index:2; box-shadow:0 4px 12px rgba(35, 156, 50, 0.4);">
            ${renderIcon('sparkles', 13, '#FFFFFF')} FEATURED SPOTLIGHT AD
          </div>

          <!-- Close Modal Button -->
          <button class="close-modal-btn" id="close-featured-btn" style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.6); color:#FFFFFF; width:34px; height:34px; border-radius:50%; border:none; font-size:1.5rem; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:3;" title="Close Ad">&times;</button>

          <!-- Price Overlay -->
          <div style="position:absolute; bottom:12px; left:14px; background:linear-gradient(135deg, #239C32 0%, #1B7A30 100%); color:#FFFFFF; font-family:var(--font-body); font-size:1.25rem; font-weight:800; padding:5px 14px; border-radius:8px; box-shadow:0 4px 14px rgba(0,0,0,0.3);">
            PKR 4.80 Crore
          </div>
        </div>

        <!-- Modal Body Content -->
        <div style="padding:1.4rem; background:#FFFFFF;">
          <div style="font-family:var(--font-body); font-size:0.75rem; color:#15803D; font-weight:800; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:0.25rem;">
            DHA LAHORE PHASE 9 PRISM
          </div>

          <h3 style="font-family:var(--font-body); font-size:1.25rem; font-weight:800; color:#0F172A; line-height:1.25; margin-bottom:0.5rem;">
            10 Marla Ultra-Modern Smart Automation Villa
          </h3>

          <p style="font-size:0.85rem; color:#475569; line-height:1.45; margin-bottom:1.1rem;">
            Brand new 5-bedroom luxury house with full solar grid backup, Italian fitted kitchen, Jacuzzi baths, and servant quarter.
          </p>

          <!-- Specs Badges -->
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.25rem; background:#F0FDF4; padding:0.65rem 0.85rem; border-radius:8px; border:1px solid #BBF7D0; justify-content:space-between; font-size:0.82rem; font-weight:700; color:#166534;">
            <span>🛏️ 5 Beds</span>
            <span>🚿 6 Baths</span>
            <span>📐 10 Marla</span>
            <span>⚡ Solar Grid</span>
          </div>

          <!-- CTAs -->
          <div style="display:flex; gap:0.65rem; flex-wrap:wrap;">
            <a href="https://wa.me/923327507866?text=Hi%20Sarmayadar,%20I%20am%20interested%20in%20the%20Featured%20DHA%20Phase%209%20Villa%20Ad." 
               target="_blank" 
               class="btn btn-whatsapp" 
               style="flex:1; justify-content:center; padding:11px 16px; font-size:0.9rem; border-radius:8px; font-weight:800;">
              ${renderIcon('message-circle', 16)} Contact Agent on WhatsApp
            </a>

            <button type="button" class="btn btn-primary view-details-btn" data-id="prop-1" id="close-ad-view-prop-btn" style="padding:11px 18px; font-size:0.9rem; border-radius:8px; font-weight:800;">
              View Deal
            </button>
          </div>

        </div>

      </div>
    </div>
  `;
}
