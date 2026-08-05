import { renderIcon } from '../utils/icons.js';

export function renderOverseasPortal() {
  return `
    <section style="padding:3.5rem 0; background:var(--paper); border-top:3px solid var(--forest-dk);">
      <div class="container">
        <div style="background:linear-gradient(135deg, var(--forest-dk), var(--forest)); color:var(--paper); border-radius:16px; padding:2rem 1.5rem; border:3px solid var(--marigold); box-shadow:var(--shadow-xl); position:relative; overflow:hidden;">
          
          <div style="position:absolute; top:-30px; right:-30px; width:180px; height:180px; background:radial-gradient(circle, rgba(242,167,27,0.2), transparent 70%); border-radius:50%;"></div>

          <div class="overseas-grid">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(242,167,27,0.15); border:1px solid var(--marigold); color:var(--marigold); font-family:var(--font-mono); font-size:0.72rem; font-weight:700; padding:4px 12px; border-radius:20px; text-transform:uppercase; margin-bottom:0.85rem;">
                ROSHAN DIGITAL ACCOUNT & OVERSEAS DESK
              </div>


              <h2 style="font-family:var(--font-display); font-size:clamp(1.5rem, 3.5vw, 2.2rem); color:var(--paper); line-height:1.2; margin-bottom:0.85rem; word-wrap:break-word; overflow-wrap:break-word;">
                Invest in Pakistan Real Estate from <span style="color:var(--marigold);">Anywhere in the World</span>
              </h2>

              <p style="font-size:0.92rem; color:var(--cream); opacity:0.92; line-height:1.55; margin-bottom:1.25rem;">
                Tailored for Overseas Pakistanis in UK, UAE, USA & Europe. Get 100% legal title verification, guaranteed USD rental yield, and direct Roshan Digital Account (RDA) bank transfer integration.
              </p>

              <div class="overseas-stats" style="margin-bottom:1.5rem;">
                <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:0.75rem; text-align:center;">
                  <div style="font-family:var(--font-mono); font-weight:800; font-size:1.2rem; color:var(--marigold);">8.5% - 12%</div>
                  <div style="font-size:0.7rem; color:var(--cream); opacity:0.8;">USD Rental Yield</div>
                </div>
                <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:0.75rem; text-align:center;">
                  <div style="font-family:var(--font-mono); font-weight:800; font-size:1.2rem; color:#22C55E;">100% Verified</div>
                  <div style="font-size:0.7rem; color:var(--cream); opacity:0.8;">CDA / DHA Titles</div>
                </div>
                <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:0.75rem; text-align:center;">
                  <div style="font-family:var(--font-mono); font-weight:800; font-size:1.2rem; color:var(--paper);">24/7 Desk</div>
                  <div style="font-size:0.7rem; color:var(--cream); opacity:0.8;">Video Walkthroughs</div>
                </div>
              </div>

              <a href="https://wa.me/923008472910?text=Hi%20Apna%20Ghar,%20I%20am%20an%20Overseas%20Pakistani%20interested%20in%20property%20investment." 
                 target="_blank" 
                 class="btn btn-marigold" 
                 style="font-size:0.88rem; padding:10px 20px; max-width:100%; white-space:normal; text-align:center;">
                ${renderIcon('message-circle', 16)} Connect with Overseas Investment Specialist
              </a>
            </div>

            <!-- Overseas Hero Card -->
            <div style="background:var(--paper); border-radius:12px; border:2px solid var(--forest-dk); padding:1.25rem; color:var(--forest-dk); box-shadow:var(--shadow-lift);">
              <h3 style="font-family:var(--font-display); font-size:1.1rem; margin-bottom:0.85rem; color:var(--forest-dk);">
                Overseas Priority Services
              </h3>

              <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.65rem; font-size:0.85rem; font-weight:600;">
                <li style="display:flex; align-items:center; gap:0.5rem;">
                  ${renderIcon('shield-check', 16, 'var(--rani)')} FBR Filer Tax Exemption Advice
                </li>
                <li style="display:flex; align-items:center; gap:0.5rem;">
                  ${renderIcon('video', 16, 'var(--rani)')} Live HD Video Site Inspection
                </li>
                <li style="display:flex; align-items:center; gap:0.5rem;">
                  ${renderIcon('building-2', 16, 'var(--rani)')} High Yield Commercial Shops & Apartments
                </li>
                <li style="display:flex; align-items:center; gap:0.5rem;">
                  ${renderIcon('file-text', 16, 'var(--rani)')} Power of Attorney (POA) Legal Drafting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
