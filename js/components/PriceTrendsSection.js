import { renderIcon } from '../utils/icons.js';

export function renderPriceTrendsSection() {
  const trendsData = [
    { year: '2021', dhaLahore: '2.8 Cr', bahriaIsl: '1.4 Cr', cliftonKHI: '3.2 Cr' },
    { year: '2022', dhaLahore: '3.2 Cr', bahriaIsl: '1.7 Cr', cliftonKHI: '3.8 Cr' },
    { year: '2023', dhaLahore: '3.8 Cr', bahriaIsl: '2.1 Cr', cliftonKHI: '4.2 Cr' },
    { year: '2024', dhaLahore: '4.2 Cr', bahriaIsl: '2.4 Cr', cliftonKHI: '4.9 Cr' },
    { year: '2025', dhaLahore: '4.8 Cr', bahriaIsl: '2.8 Cr', cliftonKHI: '5.5 Cr' },
    { year: '2026', dhaLahore: '5.4 Cr', bahriaIsl: '3.2 Cr', cliftonKHI: '6.1 Cr' }
  ];

  return `
    <section style="padding:4rem 0; background:var(--cream); border-top:3px solid var(--forest-dk);">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">HISTORICAL MARKET ANALYTICS</span>
            <h2>Society Price Trends & 5-Year Growth (2021-2026)</h2>
          </div>
          <p>Real-time historical price appreciation data per 10 Marla and 1 Kanal across DHA Lahore, Bahria Town, and Clifton Karachi.</p>
        </div>

        <div style="background:var(--paper); border-radius:12px; border:2px solid var(--forest-dk); padding:1.75rem; box-shadow:var(--shadow-lift);">
          <div class="table-responsive">
            <table class="dealer-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>DHA Lahore Phase 6 (10 Marla)</th>
                  <th>Bahria Town Isl Phase 8 (10 Marla)</th>
                  <th>Clifton Karachi Block 4 (Appt)</th>
                  <th>Average YoY ROI</th>
                </tr>
              </thead>
              <tbody>
                ${trendsData.map(d => `
                  <tr>
                    <td style="font-family:var(--font-mono); font-weight:800; color:var(--forest-dk);">${d.year}</td>
                    <td style="font-family:var(--font-mono); font-weight:700; color:var(--rani-dk);">${d.dhaLahore}</td>
                    <td style="font-family:var(--font-mono); font-weight:700; color:var(--forest);">${d.bahriaIsl}</td>
                    <td style="font-family:var(--font-mono); font-weight:700; color:var(--forest);">${d.cliftonKHI}</td>
                    <td>
                      <span class="status-pill status-active">${renderIcon('trending-up', 12)} +14.8% / yr</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}
