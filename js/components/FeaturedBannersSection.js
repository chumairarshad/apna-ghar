import { renderIcon } from '../utils/icons.js';

export function renderFeaturedBannersSection() {
  return `
    <section style="padding:3.5rem 0; background:#F8FAFC; border-top:1.5px solid #E2E8F0; border-bottom:1.5px solid #E2E8F0;">
      <div class="container">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.75rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:#F0FDF4; border:1.5px solid #86EFAC; color:#15803D; font-family:var(--font-body); font-size:0.75rem; font-weight:800; padding:4px 14px; border-radius:20px; text-transform:uppercase; margin-bottom:0.4rem;">
              ${renderIcon('sparkles', 14, '#239C32')} SPONSORED REAL ESTATE SHOWCASE
            </div>
            <h2 style="font-family:var(--font-display); font-size:clamp(1.4rem, 3vw, 1.85rem); color:#0F172A; font-weight:800; margin:0;">
              Featured Mega Spotlights
            </h2>
          </div>

          <button type="button" class="btn btn-primary btn-sm" id="open-featured-modal-btn" style="font-size:0.85rem; padding:9px 18px; border-radius:8px;">
            ${renderIcon('plus-circle', 14)} Feature Your Property Here
          </button>
        </div>

        <!-- 2 Paid Featured Banners Grid (1 Green 1 White Theme) -->
        <div class="featured-banners-grid">
          
          <!-- BANNER #1: GREEN THEME CARD (DHA Lahore Phase 9 Prism) -->
          <div style="background:linear-gradient(135deg, #14521F 0%, #1E6D2B 100%); color:#FFFFFF; border-radius:16px; border:2.5px solid #239C32; overflow:hidden; box-shadow:0 12px 30px rgba(20, 82, 31, 0.25); display:flex; flex-direction:column; position:relative;">
            
            <!-- Cover Image -->
            <div style="position:relative; height:210px; overflow:hidden;">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80" alt="DHA Lahore Phase 9 Villa" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" class="news-img-hover" />
              
              <!-- Platinum Badge -->
              <div style="position:absolute; top:12px; right:12px; background:#F2A71B; color:#0F172A; font-family:var(--font-body); font-size:0.68rem; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.5px; display:flex; align-items:center; gap:4px; z-index:2; box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                ${renderIcon('shield-check', 13, '#0F172A')} PLATINUM
              </div>

              <!-- Price Tag Overlay -->
              <div style="position:absolute; bottom:12px; left:12px; background:linear-gradient(135deg, #239C32 0%, #1B7A30 100%); color:#FFFFFF; font-family:var(--font-body); font-size:1.15rem; font-weight:800; padding:5px 14px; border-radius:8px; box-shadow:0 4px 14px rgba(0,0,0,0.3);">
                PKR 4.80 Crore
              </div>
            </div>

            <!-- Card Body Details -->
            <div style="padding:1.35rem; display:flex; flex-direction:column; flex-grow:1; justify-content:space-between;">
              <div>
                <div style="font-family:var(--font-body); font-size:0.75rem; color:#86EFAC; font-weight:800; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:0.35rem;">
                  DHA LAHORE PHASE 9 PRISM
                </div>

                <h3 style="font-family:var(--font-body); font-size:1.2rem; font-weight:700; color:#FFFFFF; line-height:1.3; margin-bottom:0.5rem; word-wrap:break-word;">
                  10 Marla Ultra-Modern Smart Automation Villa
                </h3>

                <p style="font-size:0.85rem; color:rgba(255,255,255,0.9); line-height:1.45; margin-bottom:1rem;">
                  Brand new 5-bedroom luxury house with full solar grid backup, Italian fitted kitchen, Jacuzzi baths, and servant quarter.
                </p>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.85rem; border-top:1.5px dashed rgba(255,255,255,0.2); flex-wrap:wrap; gap:0.6rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" style="width:34px; height:34px; border-radius:50%; border:2px solid #86EFAC; object-fit:cover;" alt="Chaudhry Real Estate" />
                  <div>
                    <div style="font-size:0.8rem; font-weight:700; color:#FFFFFF;">Chaudhry Real Estate</div>
                    <div style="font-size:0.7rem; color:#86EFAC; font-weight:600;">Verified Agency</div>
                  </div>
                </div>

                <div style="display:flex; gap:0.4rem;">
                  <button type="button" class="fancy-360-btn open-tour-btn" data-id="prop-1" title="360° Tour">
                    ${renderIcon('sparkles', 12, '#F2A71B')} 360° Tour
                  </button>
                  <a href="https://wa.me/923327507866?text=Hi%20Chaudhry%20Real%20Estate,%20I%20saw%20your%20Featured%20Villa%20in%20DHA%20Phase%209." target="_blank" class="btn btn-whatsapp btn-sm" style="padding:6px 12px; font-size:0.78rem;">
                    ${renderIcon('message-circle', 14)} WhatsApp
                  </a>
                </div>
              </div>
            </div>

          </div>

          <!-- BANNER #2: CRISP WHITE THEME CARD (Capital Smart City Islamabad) -->
          <div style="background:#FFFFFF; color:#0F172A; border-radius:16px; border:2.5px solid #239C32; overflow:hidden; box-shadow:0 10px 30px rgba(0, 0, 0, 0.08); display:flex; flex-direction:column; position:relative;">
            
            <!-- Cover Image -->
            <div style="position:relative; height:210px; overflow:hidden;">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80" alt="Capital Smart City Plot" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" class="news-img-hover" />
              
              <!-- Hot Deal Badge -->
              <div style="position:absolute; top:12px; right:12px; background:#239C32; color:#FFFFFF; font-family:var(--font-body); font-size:0.68rem; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.5px; display:flex; align-items:center; gap:4px; z-index:2; box-shadow:0 4px 12px rgba(35, 156, 50, 0.3);">
                ${renderIcon('sparkles', 13, '#FFFFFF')} HOT DEAL
              </div>

              <!-- Price Tag Overlay -->
              <div style="position:absolute; bottom:12px; left:12px; background:linear-gradient(135deg, #239C32 0%, #1B7A30 100%); color:#FFFFFF; font-family:var(--font-body); font-size:1.15rem; font-weight:800; padding:5px 14px; border-radius:8px; box-shadow:0 4px 14px rgba(0,0,0,0.2);">
                PKR 1.85 Crore
              </div>
            </div>

            <!-- Card Body Details -->
            <div style="padding:1.35rem; display:flex; flex-direction:column; flex-grow:1; justify-content:space-between;">
              <div>
                <div style="font-family:var(--font-body); font-size:0.75rem; color:#15803D; font-weight:800; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:0.35rem;">
                  CAPITAL SMART CITY ISLAMABAD
                </div>

                <h3 style="font-family:var(--font-body); font-size:1.2rem; font-weight:700; color:#0F172A; line-height:1.3; margin-bottom:0.5rem; word-wrap:break-word;">
                  1 Kanal Executive Lake View Plot — Overseas Prime II
                </h3>

                <p style="font-size:0.85rem; color:#475569; line-height:1.45; margin-bottom:1rem;">
                  Prime facing 45ft boulevard plot near 18-Hole Golf Course with instant possession and 3-Year quarterly installment option.
                </p>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.85rem; border-top:1.5px dashed #E2E8F0; flex-wrap:wrap; gap:0.6rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" style="width:34px; height:34px; border-radius:50%; border:2px solid #239C32; object-fit:cover;" alt="Capital Estate Advisors" />
                  <div>
                    <div style="font-size:0.8rem; font-weight:700; color:#0F172A;">Capital Estate</div>
                    <div style="font-size:0.7rem; color:#15803D; font-weight:600;">Verified Agency</div>
                  </div>
                </div>

                <div style="display:flex; gap:0.4rem;">
                  <button type="button" class="fancy-360-btn open-tour-btn" data-id="prop-2" title="360° Tour">
                    ${renderIcon('sparkles', 12, '#F2A71B')} 360° Tour
                  </button>
                  <a href="https://wa.me/923327507866?text=Hi%20Capital%20Estate,%20I%20saw%20your%20Featured%20Plot%20in%20Capital%20Smart%20City." target="_blank" class="btn btn-whatsapp btn-sm" style="padding:6px 12px; font-size:0.78rem;">
                    ${renderIcon('message-circle', 14)} WhatsApp
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
