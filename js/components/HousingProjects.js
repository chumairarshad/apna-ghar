import { HOUSING_PROJECTS } from '../data/projects.js';
import { formatPKR } from '../utils/formatters.js';

export function renderHousingProjects() {
  return `
    <section class="housing-projects-section" style="padding:4rem 0; background-color:#F1F5F9;">
      <div class="container">
        <div class="section-header">
          <span class="section-subtitle">INSTALLMENT SCHEMES & PRE-LAUNCH</span>
          <h2 class="section-title">Pakistani Megaprojects & Payment Plans</h2>
          <p class="section-desc">Invest in top government and CDA/FDA/LDA approved housing projects with flexible 3.5 year installment plans.</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:3rem;">
          ${HOUSING_PROJECTS.map(proj => `
            <div style="background:white; border-radius:16px; overflow:hidden; box-shadow:var(--shadow-md); border:1px solid var(--border-light); display:grid; grid-template-columns: 400px 1fr; gap:0;">
              <div style="position:relative;">
                <img src="${proj.image}" style="width:100%; height:100%; object-fit:cover; min-height:300px;" />
                <span class="badge badge-featured" style="position:absolute; top:1rem; left:1rem;">${proj.status}</span>
              </div>
              <div style="padding:2rem; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="color:var(--emerald-teal); font-weight:700; font-size:0.85rem;">${proj.developer}</div>
                  <h3 style="font-size:1.6rem; margin-bottom:0.35rem;">${proj.name}</h3>
                  <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">${proj.tagline}</p>
                  
                  <div style="display:flex; gap:1.5rem; margin-bottom:1.5rem; background:var(--bg-main); padding:0.85rem 1.25rem; border-radius:10px;">
                    <div>
                      <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">STARTING PRICE</div>
                      <div style="font-weight:800; color:var(--primary-emerald); font-size:1.1rem;">${formatPKR(proj.minPrice)}</div>
                    </div>
                    <div>
                      <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">DOWN PAYMENT</div>
                      <div style="font-weight:800; color:var(--emerald-teal); font-size:1.1rem;">${proj.downPaymentPercent}%</div>
                    </div>
                    <div>
                      <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">INSTALLMENT PLAN</div>
                      <div style="font-weight:700; font-size:0.95rem;">${proj.installmentsPeriod}</div>
                    </div>
                  </div>

                  <!-- Payment Plan Breakdown Table -->
                  <h4 style="font-size:0.95rem; margin-bottom:0.75rem; color:var(--text-main);">Official Payment Breakdown</h4>
                  <div class="table-responsive">
                    <table class="dealer-table" style="font-size:0.82rem;">
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
                            <td><span style="color:var(--emerald-teal); font-weight:700;">${row.downPayment}</span></td>
                            <td>${row.quarterly}</td>
                            <td>${row.possession}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style="margin-top:1.5rem; display:flex; justify-content:space-between; align-items:center;">
                  <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    ${proj.features.map(f => `<span class="filter-chip" style="font-size:0.75rem;">${f}</span>`).join('')}
                  </div>
                  <a href="https://wa.me/923008472910?text=Hi%20Apna%20Ghar,%20please%20send%20me%20brochure%20and%20booking%20form%20for%20${encodeURIComponent(proj.name)}" target="_blank" class="btn btn-primary btn-sm">
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
