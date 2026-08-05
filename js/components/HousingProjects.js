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
          <p style="color:var(--forest); opacity:0.85;">
            Invest in top government and CDA/FDA/LDA approved housing projects with flexible 3.5 year installment plans.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:2.5rem;">
          ${HOUSING_PROJECTS.map(proj => `
            <div class="megaproject-card">
              <div style="position:relative; min-height:240px;">
                <img src="${proj.image}" style="width:100%; height:100%; object-fit:cover; min-height:240px;" alt="${proj.name}" />
                <span class="badge badge-featured" style="position:absolute; top:1rem; left:1rem;">${proj.status}</span>
              </div>
              
              <div style="padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="color:var(--rani-dk); font-weight:700; font-size:0.82rem; font-family:var(--font-mono); text-transform:uppercase;">${proj.developer}</div>
                  <h3 style="font-family:var(--font-display); font-size:clamp(1.2rem, 2.5vw, 1.6rem); margin-bottom:0.35rem; color:var(--forest-dk);">${proj.name}</h3>
                  <p style="color:var(--ink); opacity:0.85; font-size:0.88rem; margin-bottom:1rem; line-height:1.5;">${proj.tagline}</p>
                  
                  <div style="display:flex; gap:1.25rem; flex-wrap:wrap; margin-bottom:1.25rem; background:var(--cream); padding:0.85rem 1.15rem; border-radius:10px; border:1px solid var(--border-dk);">
                    <div>
                      <div style="font-size:0.7rem; color:var(--forest); opacity:0.8; font-weight:700; font-family:var(--font-mono);">STARTING PRICE</div>
                      <div style="font-weight:800; color:var(--rani); font-size:1.05rem; font-family:var(--font-mono);">${formatPKR(proj.minPrice)}</div>
                    </div>
                    <div>
                      <div style="font-size:0.7rem; color:var(--forest); opacity:0.8; font-weight:700; font-family:var(--font-mono);">DOWN PAYMENT</div>
                      <div style="font-weight:800; color:var(--forest-dk); font-size:1.05rem; font-family:var(--font-mono);">${proj.downPaymentPercent}%</div>
                    </div>
                    <div>
                      <div style="font-size:0.7rem; color:var(--forest); opacity:0.8; font-weight:700; font-family:var(--font-mono);">INSTALLMENT PLAN</div>
                      <div style="font-weight:700; font-size:0.9rem; font-family:var(--font-mono);">${proj.installmentsPeriod}</div>
                    </div>
                  </div>

                  <!-- Payment Plan Breakdown Table -->
                  <h4 style="font-size:0.88rem; margin-bottom:0.6rem; color:var(--forest-dk); font-family:var(--font-mono); font-weight:700;">OFFICIAL PAYMENT BREAKDOWN</h4>
                  <div class="table-responsive">
                    <table class="dealer-table" style="font-size:0.8rem;">
                      <thead>
                        <tr>
                          <th>Plot Size</th>
                          <th>Total Cost</th>
                          <th>Down Payment</th>
                          <th>Quarterly Installment</th>
                          <th>On Possession</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${proj.paymentPlan.map(row => `
                          <tr>
                            <td><strong>${row.size}</strong></td>
                            <td>${row.total}</td>
                            <td><span style="color:var(--rani-dk); font-weight:700;">${row.downPayment}</span></td>
                            <td>${row.quarterly}</td>
                            <td>${row.possession}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style="margin-top:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.85rem; pt:0.85rem; border-top:1px dashed var(--border-dk);">
                  <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                    ${proj.features.map(f => `<span class="filter-chip" style="font-size:0.72rem; padding:3px 10px;">${f}</span>`).join('')}
                  </div>
                  <a href="https://wa.me/923008472910?text=Hi%20Apna%20Ghar,%20please%20send%20me%20brochure%20and%20booking%20form%20for%20${encodeURIComponent(proj.name)}" target="_blank" class="btn btn-primary btn-sm" style="padding:8px 16px;">
                    Book On Installments
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
