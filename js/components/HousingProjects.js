import { HOUSING_PROJECTS } from '../data/projects.js';
import { formatPKR } from '../utils/formatters.js';
import { t, tText } from '../utils/i18n.js';

export function renderHousingProjects() {
  return `
    <section class="housing-projects-section" style="padding:3rem 0; background-color:#F1F5F9;">
      <div class="container">
        <div class="section-head" style="margin-bottom:2rem;">
          <div>
            <span class="eyebrow">${t('badge_exclusive', 'EXCLUSIVE')}</span>
            <h2 style="font-family:var(--font-display); font-size:clamp(1.5rem, 3.5vw, 2.4rem); color:var(--forest-dk); margin-top:0.4rem;">
              ${t('featured_projects_title', "Pakistan's Premier Housing Megaprojects")}
            </h2>
          </div>
          <p style="color:var(--forest); opacity:0.85; max-width:650px;">
            Invest in top CDA, FDA, and LDA approved housing projects with easy 3.5 to 5 year installment plans.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:2rem;">
          ${HOUSING_PROJECTS.map(proj => `
            <div class="megaproject-card" style="box-shadow:var(--shadow-md); border:2px solid var(--forest-dk); border-radius:16px; overflow:hidden; background:#ffffff;">
              <div style="position:relative; min-height:220px; background:#131d0c;">
                <img src="${proj.image}" style="width:100%; height:100%; object-fit:cover; min-height:220px;" alt="${tText(proj.name)}" />
                <span class="badge badge-featured" style="position:absolute; top:1rem; left:1rem; background:var(--rani); color:white; font-weight:800; padding:6px 14px; border-radius:20px; box-shadow:0 4px 10px rgba(0,0,0,0.25);">
                  ${tText(proj.status)}
                </span>
              </div>
              
              <div class="megaproject-card-body" style="display:flex; flex-direction:column; justify-content:space-between; background:#ffffff;">
                <div>
                  <div style="color:var(--rani-dk); font-weight:800; font-size:0.8rem; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.5px;">${proj.developer}</div>
                  <h3 style="font-family:var(--font-display); font-size:clamp(1.25rem, 2.5vw, 1.65rem); margin-bottom:0.4rem; color:var(--forest-dk); font-weight:800; line-height:1.25;">${tText(proj.name)}</h3>
                  <p style="color:#334155; font-size:0.88rem; margin-bottom:1.15rem; line-height:1.45; font-weight:500;">${tText(proj.tagline)}</p>
                  
                  <!-- Responsive Key Highlights Bar -->
                  <div class="project-stats-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:0.6rem; margin-bottom:1.25rem; background:#F8FAFC; padding:0.85rem 1rem; border-radius:12px; border:2px solid #E2E8F0;">
                    <div>
                      <div style="font-size:0.65rem; color:#64748B; font-weight:800; font-family:var(--font-mono); text-transform:uppercase;">${t('starting_from', 'STARTING PRICE')}</div>
                      <div style="font-weight:800; color:var(--rani); font-size:1.05rem; font-family:var(--font-mono);">${formatPKR(proj.minPrice)}</div>
                    </div>
                    <div>
                      <div style="font-size:0.68rem; color:#64748B; font-weight:800; font-family:var(--font-mono); text-transform:uppercase;">DOWN PAYMENT</div>
                      <div style="font-weight:800; color:var(--forest-dk); font-size:1.05rem; font-family:var(--font-mono);">${proj.downPaymentPercent}%</div>
                    </div>
                    <div>
                      <div style="font-size:0.68rem; color:#64748B; font-weight:800; font-family:var(--font-mono); text-transform:uppercase;">TENURE PLAN</div>
                      <div style="font-weight:800; color:#0F172A; font-size:1rem; font-family:var(--font-mono);">${proj.installmentsPeriod}</div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap; margin-top:0.75rem;">
                  <button class="btn btn-primary open-project-modal-btn" data-id="${proj.id}" style="padding:10px 22px; font-size:0.9rem; font-weight:800;">
                    ${t('explore_project', 'Explore Project')}
                  </button>

                  <!-- 1. MOBILE CARDS VIEW (Full Width Stacked Rows - Displays on <= 640px) -->
                  <div class="mobile-payment-cards-list" style="margin-bottom:1.25rem;">
                    ${(proj.paymentPlan ?? []).map(row => `
                      <div style="background:#F8FAFC; border:2px solid #1E293B; border-radius:12px; padding:0.85rem 1rem; margin-bottom:0.75rem; box-shadow:0 2px 6px rgba(0,0,0,0.04);">
                        
                        <!-- Header Row: Plot Size & Total Price -->
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #E2E8F0; padding-bottom:0.45rem; margin-bottom:0.6rem; flex-wrap:wrap; gap:0.35rem;">
                          <span style="font-weight:800; color:#0F172A; font-size:1rem;">${tText(row.size)}</span>
                          <span style="font-weight:800; color:var(--forest-dk); font-family:var(--font-mono); font-size:0.92rem; background:#E2E8F0; padding:2px 8px; border-radius:6px;">Total: ${row.total}</span>
                        </div>

                        <!-- Data Rows (Stacked 100% Full Width) -->
                        <div style="display:flex; flex-direction:column; gap:0.45rem; font-size:0.84rem;">
                          <div style="display:flex; justify-content:space-between; align-items:center; background:#FFF1F2; padding:5px 10px; border-radius:6px; border:1px solid #FECDD3;">
                            <span style="color:#9F1239; font-weight:800; font-family:var(--font-mono); font-size:0.72rem; text-transform:uppercase;">Down Payment</span>
                            <span style="color:var(--rani); font-weight:800; font-family:var(--font-mono); font-size:0.92rem;">${row.downPayment}</span>
                          </div>

                          <div style="display:flex; justify-content:space-between; align-items:center; background:#ffffff; padding:5px 10px; border-radius:6px; border:1px solid #E2E8F0;">
                            <span style="color:#64748B; font-weight:700; font-family:var(--font-mono); font-size:0.72rem; text-transform:uppercase;">Quarterly Installment</span>
                            <span style="color:#0F172A; font-weight:800; font-family:var(--font-mono); font-size:0.88rem;">${row.quarterly}</span>
                          </div>

                          <div style="display:flex; justify-content:space-between; align-items:center; background:#ffffff; padding:5px 10px; border-radius:6px; border:1px solid #E2E8F0;">
                            <span style="color:#64748B; font-weight:700; font-family:var(--font-mono); font-size:0.72rem; text-transform:uppercase;">On Possession</span>
                            <span style="color:#0F172A; font-weight:800; font-family:var(--font-mono); font-size:0.88rem;">${row.possession}</span>
                          </div>
                        </div>

                      </div>
                    `).join('')}
                  </div>

                  <!-- 2. DESKTOP TABLE VIEW (Displays on > 640px) -->
                  <div class="desktop-payment-table-wrap" style="border:2px solid #1E293B; border-radius:10px; overflow-x:auto; background:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.05); margin-bottom:1.25rem;">
                    <table class="dealer-table" style="width:100%; border-collapse:collapse; min-width:540px; font-size:0.85rem;">
                      <thead>
                        <tr style="background:#131d0c; color:#ffffff; font-family:var(--font-mono); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;">
                          <th style="padding:10px 14px; text-align:left; border-bottom:2px solid var(--marigold);">Plot Size</th>
                          <th style="padding:10px 14px; text-align:left; border-bottom:2px solid var(--marigold);">Total Cost</th>
                          <th style="padding:10px 14px; text-align:left; border-bottom:2px solid var(--marigold);">Down Payment</th>
                          <th style="padding:10px 14px; text-align:left; border-bottom:2px solid var(--marigold);">Quarterly</th>
                          <th style="padding:10px 14px; text-align:left; border-bottom:2px solid var(--marigold);">Possession</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${(proj.paymentPlan ?? []).map((row, idx) => `
                          <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#F8FAFC'}; border-bottom:1px solid #E2E8F0;">
                            <td style="padding:10px 14px; font-weight:800; color:#0F172A;">${row.size}</td>
                            <td style="padding:10px 14px; font-weight:700; color:#334155;">${row.total}</td>
                            <td style="padding:10px 14px;"><span style="color:var(--rani); font-weight:800; background:#FFF1F2; padding:3px 8px; border-radius:4px; border:1px solid #FECDD3;">${row.downPayment}</span></td>
                            <td style="padding:10px 14px; color:#475569; font-weight:600;">${row.quarterly}</td>
                            <td style="padding:10px 14px; color:#475569; font-weight:600;">${row.possession}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style="margin-top:0.85rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; padding-top:0.85rem; border-top:2px dashed #E2E8F0;">
                  <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                    ${(proj.features ?? []).map(f => `<span class="filter-chip" style="font-size:0.72rem; padding:3px 10px; font-weight:700; background:#F1F5F9; border:1px solid #CBD5E1; color:#1E293B; border-radius:20px;">${f}</span>`).join('')}
                  </div>

                  <a href="https://wa.me/923327507866?text=Hi%20Sarmayadar,%20please%20send%20me%20brochure%20and%20booking%20form%20for%20${encodeURIComponent(proj.name)}" target="_blank" class="btn btn-primary btn-sm" style="padding:10px 18px; font-size:0.88rem; font-weight:800; border-radius:8px; box-shadow:0 4px 12px rgba(35,156,50,0.35);">
                    💬 Book On Installments
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
