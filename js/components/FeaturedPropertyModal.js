export function renderFeaturedPropertyModal(state) {
  const isVisible = state.showFeaturedModal || false;

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="featured-modal-overlay">
      <div class="modal-container" style="max-width:540px;">
        <div class="modal-header" style="background:linear-gradient(135deg, var(--forest-dk), var(--forest)); color:var(--paper);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="sparkles" style="width:20px; height:20px; color:var(--marigold);"></i>
            <h3 class="modal-title" style="color:var(--paper); font-size:1.15rem;">Get Featured Listing Boost</h3>
          </div>
          <button class="close-modal-btn" id="close-featured-btn" style="color:var(--paper);">&times;</button>
        </div>

        <div class="modal-body">
          <p style="font-size:0.9rem; color:var(--forest); margin-bottom:1.25rem;">
            Boost your property visibility by up to <strong>300%</strong> with top homepage placement and verified badges on Sarmayadar.
          </p>

          <!-- Featured Benefits -->
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.65rem; margin-bottom:1.5rem;">
            <div style="background:var(--cream); border:1.5px solid var(--border-dk); border-radius:8px; padding:0.75rem 0.5rem; text-align:center;">
              <i data-lucide="trending-up" style="width:20px; height:20px; color:var(--rani); margin-bottom:4px;"></i>
              <div style="font-size:0.75rem; font-weight:700; color:var(--forest-dk);">3x More Leads</div>
            </div>
            <div style="background:var(--cream); border:1.5px solid var(--border-dk); border-radius:8px; padding:0.75rem 0.5rem; text-align:center;">
              <i data-lucide="award" style="width:20px; height:20px; color:var(--marigold-dk); margin-bottom:4px;"></i>
              <div style="font-size:0.75rem; font-weight:700; color:var(--forest-dk);">Gold Badge</div>
            </div>
            <div style="background:var(--cream); border:1.5px solid var(--border-dk); border-radius:8px; padding:0.75rem 0.5rem; text-align:center;">
              <i data-lucide="zap" style="width:20px; height:20px; color:#22C55E; margin-bottom:4px;"></i>
              <div style="font-size:0.75rem; font-weight:700; color:var(--forest-dk);">Top Search</div>
            </div>
          </div>

          <!-- Featured Packages List -->
          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
            <!-- Package 1 -->
            <label style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1rem; border:2px solid var(--border-dk); border-radius:8px; background:var(--cream); cursor:pointer;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <input type="radio" name="featured_package" value="hot" checked style="accent-color:var(--rani);" />
                <div>
                  <div style="font-weight:700; font-size:0.9rem; color:var(--forest-dk);">Hot Deal Highlight</div>
                  <div style="font-size:0.75rem; color:var(--forest); opacity:0.8;">7 Days Top Banner & Hot Badge</div>
                </div>
              </div>
              <div style="font-family:var(--font-mono); font-weight:700; color:var(--rani); font-size:0.9rem;">PKR 2,500</div>
            </label>

            <!-- Package 2 Recommended -->
            <label style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1rem; border:2px solid var(--rani); border-radius:8px; background:var(--paper); box-shadow:var(--shadow-sm); cursor:pointer; position:relative;">
              <span style="position:absolute; top:-10px; right:12px; background:var(--rani); color:white; font-family:var(--font-mono); font-size:0.62rem; font-weight:700; padding:2px 8px; border-radius:10px;">MOST POPULAR</span>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <input type="radio" name="featured_package" value="super" style="accent-color:var(--rani);" />
                <div>
                  <div style="font-weight:700; font-size:0.9rem; color:var(--forest-dk);">Super Featured Listing</div>
                  <div style="font-size:0.75rem; color:var(--forest); opacity:0.8;">30 Days Priority Position + WhatsApp Pin</div>
                </div>
              </div>
              <div style="font-family:var(--font-mono); font-weight:700; color:var(--rani); font-size:0.9rem;">PKR 5,000</div>
            </label>

            <!-- Package 3 -->
            <label style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1rem; border:2px solid var(--border-dk); border-radius:8px; background:var(--cream); cursor:pointer;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <input type="radio" name="featured_package" value="vip" style="accent-color:var(--rani);" />
                <div>
                  <div style="font-weight:700; font-size:0.9rem; color:var(--forest-dk);">VIP Agency Homepage Banner</div>
                  <div style="font-size:0.75rem; color:var(--forest); opacity:0.8;">Hero Slider Spotlight + Social Media Blast</div>
                </div>
              </div>
              <div style="font-family:var(--font-mono); font-weight:700; color:var(--rani); font-size:0.9rem;">PKR 12,000</div>
            </label>
          </div>

          <a href="https://wa.me/923327507866?text=Hi%20Sarmayadar,%20I%20want%20to%20Feature%20my%20property%20listing." 
             target="_blank" 
             class="btn btn-whatsapp" 
             id="submit-featured-request-btn"
             style="width:100%; justify-content:center;">
            <i data-lucide="message-circle" style="width:18px; height:18px;"></i> Request Feature on WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;
}
