import { HOUSING_PROJECTS } from '../data/projects.js';
import { formatPKR } from '../utils/formatters.js';

export function renderHousingProjects() {
  return `
    <section class="housing-projects-section" style="padding:3.5rem 0; background-color:#F1F5F9;">
      <div class="container">
        <div class="section-head" style="margin-bottom:2.5rem;">
          <div>
            <span class="eyebrow">INSTALLMENT SCHEMES & PRE-LAUNCH</span>
            <h2 style="font-family:var(--font-display); font-size:clamp(1.6rem, 3.5vw, 2.4rem); color:var(--forest-dk); margin-top:0.4rem;">
              Pakistani Megaprojects & Payment Plans
            </h2>
          </div>
          <p style="color:var(--forest); opacity:0.85; max-width:650px;">
            Invest in top CDA, FDA, and LDA approved housing projects with easy 3.5 to 5 year installment plans.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:2.5rem;">
          ${HOUSING_PROJECTS.map(proj => `
            <div class="megaproject-card" style="box-shadow:var(--shadow-md); border:2px solid var(--forest-dk);">
              <div style="position:relative; min-height:240px; background:#131d0c;">
                <img src="${proj.image}" style="width:100%; height:100%; object-fit:cover; min-height:240px;" alt="${proj.name}" />
                <span class="badge badge-featured" style="position:absolute; top:1rem; left:1rem; background:var(--rani); color:white; font-weight:800; padding:6px 14px; border-radius:20px; box-shadow:0 4px 10px rgba(0,0,0,0.25);">
                  ${proj.status}
                </span>
              </div>
              
              <div style="padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between; background:#ffffff;">
                <div>
                  <div style="color:var(--rani-dk); font-weight:800; font-size:0.82rem; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.5px;">${proj.developer}</div>
                  <h3 style="font-family:var(--font-display); font-size:clamp(1.3rem, 2.5vw, 1.7rem); margin-bottom:0.4rem; color:var(--forest-dk); font-weight:800;">${proj.name}</h3>
                  <p style="color:#334155; font-size:0.9rem; margin-bottom:1.25rem; line-height:1.5; font-weight:500;">${proj.tagline}</p>
                  
                  <!-- Responsive Project Key Highlights Grid -->
                  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.85rem; margin-bottom:1.5rem; background:#F8FAFC; padding:1rem 1.25rem; border-radius:12px; border:2px solid #E2E8F0;">
                    <div>
                      <div style="font-size:0.68rem; color:#64748B; font-weight:800; font-family:var(--font-mono); text-transform:uppercase;">STARTING PRICE</div>
                      <div style="font-weight:800; color:var(--rani); font-size:1.1rem; font-family:var(--font-mono);">${formatPKR(proj.minPrice)}</div>
                    </div>
                    <div>
                      <div style="font-size:0.68rem; color:#64748B; font-weight:800; font-family:var(--font-mono); text-transform:uppercase;">DOWN PAYMENT</div>
                      <div style="font-weight:800; color:var(--forest-dk); font-size:1.1rem; font-family:var(--font-mono);">${proj.downPaymentPercent}%</div>
                    </div>
                    <div>
                      <div style="font-size:0.68rem; color:#64748B; font-weight:800; font-family:var(--font-mono); text-transform:uppercase;">INSTALLMENT PLAN</div>
                      <div style="font-weight:800; color:#0F172A; font-size:1.05rem; font-family:var(--font-mono);">${proj.installmentsPeriod}</div>
                    </div>
                  </div>

                  <!-- Payment Plan Breakdown Header & Table -->
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
                    <h4 style="font-size:0.88rem; color:var(--forest-dk); font-family:var(--font-mono); font-weight:800; letter-spacing:0.5px;">OFFICIAL PAYMENT BREAKDOWN</h4>
                    <span style="font-size:0.72rem; color:#64748B; font-family:var(--font-mono); font-weight:600;">← Scroll horizontally on mobile →</span>
                  </div>

                  <div class="table-responsive" style="border:2px solid #1E293B; border-radius:10px; overflow-x:auto; background:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.05); margin-bottom:1.25rem;">
                    <table class="dealer-table" style="width:100%; border-collapse:collapse; min-width:560px; font-size:0.85rem;">
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

                <div style="margin-top:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.85rem; padding-top:1rem; border-top:2px dashed #E2E8F0;">
                  <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                    ${(proj.features ?? []).map(f => `<span class="filter-chip" style="font-size:0.75rem; padding:4px 12px; font-weight:700; background:#F1F5F9; border:1px solid #CBD5E1; color:#1E293B; border-radius:20px;">${f}</span>`).join('')}
                  </div>

                  <a href="https://wa.me/923008472910?text=Hi%20Apna%20Ghar,%20please%20send%20me%20brochure%20and%20booking%20form%20for%20${encodeURIComponent(proj.name)}" target="_blank" class="btn btn-primary btn-sm" style="padding:10px 20px; font-size:0.88rem; font-weight:800; border-radius:8px; box-shadow:0 4px 12px rgba(209,38,110,0.3);">
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
