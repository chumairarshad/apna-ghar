import { renderIcon } from '../utils/icons.js';

export function renderFeaturedBannersSection() {
  return `
    <section style="padding:3.5rem 0; background:var(--paper); border-top:3px solid var(--forest-dk); border-bottom:3px solid var(--forest-dk);">
      <div class="container">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.75rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(242,167,27,0.18); border:1.5px solid var(--marigold); color:var(--forest-dk); font-family:var(--font-mono); font-size:0.72rem; font-weight:800; padding:4px 12px; border-radius:20px; text-transform:uppercase; margin-bottom:0.4rem;">
              ${renderIcon('sparkles', 14, 'var(--marigold-dk)')} SPONSORED REAL ESTATE SHOWCASE
            </div>
            <h2 style="font-family:var(--font-display); font-size:1.8rem; color:var(--forest-dk); margin:0;">
              Paid Featured Mega Spotlights
            </h2>
          </div>

          <button type="button" class="btn btn-marigold btn-sm" id="open-featured-modal-btn" style="font-size:0.82rem; padding:8px 16px;">
            ${renderIcon('plus-circle', 14)} Feature Your Property Here (From PKR 2,500/wk)
          </button>
        </div>

        <!-- 2 Paid Featured Banners Grid -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.75rem;" class="featured-banners-grid">
          
          <!-- Paid Banner #1 (DHA Lahore Phase 9 Prism) -->
          <div style="background:var(--forest-dk); color:var(--paper); border-radius:14px; border:3px solid var(--marigold); overflow:hidden; box-shadow:var(--shadow-xl); display:flex; flex-direction:column; position:relative;">
            
            <!-- High-Res Cover Image Header -->
            <div style="position:relative; height:220px; overflow:hidden;">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80" alt="DHA Lahore Phase 9 Villa" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" class="news-img-hover" />
              
              <!-- Paid Sponsor Badge -->
              <div style="position:absolute; top:12px; right:12px; background:var(--marigold); color:var(--forest-dk); font-family:var(--font-mono); font-size:0.68rem; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.5px; display:flex; align-items:center; gap:4px; z-index:2; box-shadow:0 4px 12px rgba(0,0,0,0.4);">
                ${renderIcon('shield-check', 12)} PAID SPONSOR • PLATINUM
              </div>

              <!-- Price Tag Overlay -->
              <div style="position:absolute; bottom:12px; left:12px; background:rgba(19,29,12,0.92); backdrop-filter:blur(4px); color:var(--marigold); font-family:var(--font-mono); font-size:1.35rem; font-weight:800; padding:6px 14px; border-radius:6px; border-left:4px solid var(--rani);">
                PKR 4.80 Crore
              </div>
            </div>

            <!-- Content Details -->
            <div style="padding:1.35rem; display:flex; flex-direction:column; flex-grow:1; justify-content:space-between; background:linear-gradient(135deg, var(--forest-dk), #1c2b14);">
              <div>
                <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--meadow-lt); font-weight:700; margin-bottom:0.4rem;">
                  DHA LAHORE PHASE 9 PRISM
                </div>

                <h3 style="font-family:var(--font-display); font-size:1.25rem; color:var(--paper); line-height:1.25; margin-bottom:0.6rem;">
                  10 Marla Ultra-Modern Smart Automation Villa
                </h3>

                <p style="font-size:0.85rem; color:var(--cream); opacity:0.9; line-height:1.5; margin-bottom:1rem;">
                  Brand new 5-bedroom luxury house with full solar grid backup, Italian fitted kitchen, Jacuzzi baths, and servant quarter.
                </p>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; pt:0.85rem; border-top:1.5px dashed rgba(255,255,255,0.15); flex-wrap:wrap; gap:0.75rem;">
                <div style="display:flex; align-items:center; gap:0.6rem;">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" style="width:36px; height:36px; border-radius:50%; border:1.5px solid var(--marigold); object-fit:cover;" />
                  <div>
                    <div style="font-size:0.8rem; font-weight:700; color:var(--paper);">Chaudhry Real Estate</div>
                    <div style="font-size:0.7rem; color:var(--meadow-lt);">Verified Agency</div>
                  </div>
                </div>

                <div style="display:flex; gap:0.5rem;">
                  <button type="button" class="btn btn-dark btn-sm open-tour-btn" data-id="prop-1" style="padding:6px 12px; font-size:0.78rem;">
                    ${renderIcon('sparkles', 12, 'var(--marigold)')} 360° Tour
                  </button>
                  <a href="https://wa.me/923008472910?text=Hi%20Chaudhry%20Real%20Estate,%20I%20saw%20your%20Paid%20Featured%20listing%20for%20DHA%20Phase%209." target="_blank" class="btn btn-whatsapp btn-sm" style="padding:6px 12px; font-size:0.78rem;">
                    ${renderIcon('message-circle', 12)} WhatsApp
                  </a>
                </div>
              </div>
            </div>

          </div>

          <!-- Paid Banner #2 (Capital Smart City Islamabad) -->
          <div style="background:#1c1126; color:var(--paper); border-radius:14px; border:3px solid var(--rani); overflow:hidden; box-shadow:var(--shadow-xl); display:flex; flex-direction:column; position:relative;">
            
            <!-- High-Res Cover Image Header -->
            <div style="position:relative; height:220px; overflow:hidden;">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80" alt="Capital Smart City Plot" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" class="news-img-hover" />
              
              <!-- Paid Sponsor Badge -->
              <div style="position:absolute; top:12px; right:12px; background:var(--rani); color:white; font-family:var(--font-mono); font-size:0.68rem; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.5px; display:flex; align-items:center; gap:4px; z-index:2; box-shadow:0 4px 12px rgba(0,0,0,0.4);">
                ${renderIcon('sparkles', 12)} PAID SPONSOR • HOT DEAL
              </div>

              <!-- Price Tag Overlay -->
              <div style="position:absolute; bottom:12px; left:12px; background:rgba(28,17,38,0.92); backdrop-filter:blur(4px); color:#FFE29F; font-family:var(--font-mono); font-size:1.35rem; font-weight:800; padding:6px 14px; border-radius:6px; border-left:4px solid var(--marigold);">
                PKR 1.85 Crore
              </div>
            </div>

            <!-- Content Details -->
            <div style="padding:1.35rem; display:flex; flex-direction:column; flex-grow:1; justify-content:space-between; background:linear-gradient(135deg, #1c1126, #2d163a);">
              <div>
                <div style="font-family:var(--font-mono); font-size:0.75rem; color:#f0a8d0; font-weight:700; margin-bottom:0.4rem;">
                  CAPITAL SMART CITY ISLAMABAD
                </div>

                <h3 style="font-family:var(--font-display); font-size:1.25rem; color:var(--paper); line-height:1.25; margin-bottom:0.6rem;">
                  1 Kanal Executive Lake View Plot — Overseas Prime II
                </h3>

                <p style="font-size:0.85rem; color:var(--cream); opacity:0.9; line-height:1.5; margin-bottom:1rem;">
                  Prime facing 45ft boulevard plot near 18-Hole Golf Course with instant possession and 3-Year quarterly installment option.
                </p>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; pt:0.85rem; border-top:1.5px dashed rgba(255,255,255,0.15); flex-wrap:wrap; gap:0.75rem;">
                <div style="display:flex; align-items:center; gap:0.6rem;">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" style="width:36px; height:36px; border-radius:50%; border:1.5px solid var(--rani); object-fit:cover;" />
                  <div>
                    <div style="font-size:0.8rem; font-weight:700; color:var(--paper);">Capital Estate Advisors</div>
                    <div style="font-size:0.7rem; color:#f0a8d0;">Verified Agency</div>
                  </div>
                </div>

                <div style="display:flex; gap:0.5rem;">
                  <button type="button" class="btn btn-dark btn-sm open-tour-btn" data-id="prop-2" style="padding:6px 12px; font-size:0.78rem;">
                    ${renderIcon('sparkles', 12, 'var(--marigold)')} 360° Tour
                  </button>
                  <a href="https://wa.me/923008472910?text=Hi%20Capital%20Estate,%20I%20saw%20your%20Paid%20Featured%20listing%20for%20Capital%20Smart%20City." target="_blank" class="btn btn-whatsapp btn-sm" style="padding:6px 12px; font-size:0.78rem;">
                    ${renderIcon('message-circle', 12)} WhatsApp
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  `;
}
