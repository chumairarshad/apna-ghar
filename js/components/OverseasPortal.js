import { renderIcon } from '../utils/icons.js';

export function renderOverseasPortal() {
  return `
    <section style="padding:3.5rem 0; background:#F8FAFC; border-top:1.5px solid #E2E8F0;">
      <div class="container">
        <div style="background:linear-gradient(135deg, #0d2a12 0%, #155021 50%, #1e6d2b 100%); color:#FFFFFF; border-radius:20px; padding:2.25rem 1.75rem; border:2.5px solid #239C32; box-shadow:0 20px 45px rgba(13, 42, 18, 0.25); position:relative; overflow:hidden;">
          
          <!-- Ambient Radial Lighting Effect -->
          <div style="position:absolute; top:-40px; right:-40px; width:220px; height:220px; background:radial-gradient(circle, rgba(35,156,50,0.35), transparent 70%); border-radius:50%; pointer-events:none;"></div>
          <div style="position:absolute; bottom:-40px; left:-40px; width:200px; height:200px; background:radial-gradient(circle, rgba(242,167,27,0.2), transparent 70%); border-radius:50%; pointer-events:none;"></div>

          <div class="overseas-grid" style="position:relative; z-index:2;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(242,167,27,0.15); border:1.5px solid #F2A71B; color:#F2A71B; font-family:var(--font-body); font-size:0.75rem; font-weight:800; padding:4px 14px; border-radius:20px; text-transform:uppercase; margin-bottom:0.85rem;">
                ${renderIcon('sparkles', 13, '#F2A71B')} ROSHAN DIGITAL ACCOUNT & OVERSEAS DESK
              </div>

              <h2 style="font-family:var(--font-display); font-size:clamp(1.55rem, 3.5vw, 2.25rem); color:#FFFFFF; font-weight:800; line-height:1.2; margin-bottom:0.85rem; word-wrap:break-word;">
                Invest in Pakistan Real Estate from <span style="color:#F2A71B;">Anywhere in the World</span>
              </h2>

              <p style="font-size:0.92rem; color:rgba(255,255,255,0.92); line-height:1.6; margin-bottom:1.35rem;">
                Tailored for Overseas Pakistanis in UK, UAE, USA & Europe. Get 100% legal title verification, guaranteed USD rental yield, and direct Roshan Digital Account (RDA) bank transfer integration.
              </p>

              <!-- Stats Grid -->
              <div class="overseas-stats" style="margin-bottom:1.5rem;">
                <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:12px; padding:0.85rem; text-align:center;">
                  <div style="font-family:var(--font-body); font-weight:800; font-size:1.25rem; color:#F2A71B;">8.5% - 12%</div>
                  <div style="font-size:0.72rem; color:rgba(255,255,255,0.8); font-weight:600;">USD Rental Yield</div>
                </div>
                <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:12px; padding:0.85rem; text-align:center;">
                  <div style="font-family:var(--font-body); font-weight:800; font-size:1.25rem; color:#86EFAC;">100% Verified</div>
                  <div style="font-size:0.72rem; color:rgba(255,255,255,0.8); font-weight:600;">CDA / DHA Titles</div>
                </div>
                <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:12px; padding:0.85rem; text-align:center;">
                  <div style="font-family:var(--font-body); font-weight:800; font-size:1.25rem; color:#FFFFFF;">24/7 Desk</div>
                  <div style="font-size:0.72rem; color:rgba(255,255,255,0.8); font-weight:600;">Video Walkthroughs</div>
                </div>
              </div>

              <!-- CTA Button -->
              <a href="https://wa.me/923327507866?text=Hi%20Sarmayadar,%20I%20am%20an%20Overseas%20Pakistani%20interested%20in%20property%20investment." 
                 target="_blank" 
                 class="btn btn-primary" 
                 style="font-size:0.92rem; padding:12px 22px; max-width:100%; white-space:normal; text-align:center; border-radius:10px; font-weight:800; background:linear-gradient(135deg, #239C32 0%, #1B7A30 100%); box-shadow:0 4px 16px rgba(0,0,0,0.3);">
                ${renderIcon('message-circle', 18)} Connect with Overseas Investment Specialist
              </a>
            </div>

            <!-- Overseas Priority Services Card -->
            <div style="background:#FFFFFF; border-radius:16px; border:2.5px solid #239C32; padding:1.5rem; color:#0F172A; box-shadow:0 15px 35px rgba(0, 0, 0, 0.15);">
              <h3 style="font-family:var(--font-body); font-size:1.15rem; font-weight:800; margin-bottom:1rem; color:#0F172A;">
                Overseas Priority Services
              </h3>

              <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.85rem; font-size:0.88rem; font-weight:700;">
                <li style="display:flex; align-items:center; gap:0.6rem; color:#1E293B;">
                  ${renderIcon('shield-check', 18, '#239C32')} FBR Filer Tax Exemption Advice
                </li>
                <li style="display:flex; align-items:center; gap:0.6rem; color:#1E293B;">
                  ${renderIcon('video', 18, '#239C32')} Live HD Video Site Inspection
                </li>
                <li style="display:flex; align-items:center; gap:0.6rem; color:#1E293B;">
                  ${renderIcon('building-2', 18, '#239C32')} High Yield Commercial Shops & Apartments
                </li>
                <li style="display:flex; align-items:center; gap:0.6rem; color:#1E293B;">
                  ${renderIcon('file-text', 18, '#239C32')} Power of Attorney (POA) Legal Drafting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
