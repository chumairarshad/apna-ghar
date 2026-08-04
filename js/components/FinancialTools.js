import { convertArea, calculateMortgage, formatPKR } from '../utils/formatters.js';
import { renderFBRTaxCalculatorSection } from './FBRTaxCalculator.js';

export function renderFinancialTools(state) {
  const activeTool = state.activeTool || 'converter'; // converter | mortgage | valuate | fbr

  return `
    <section class="tools-section">
      <div class="container">
        <div class="section-header">
          <span class="section-subtitle">PAKISTANI REAL ESTATE SUITE</span>
          <h2 class="section-title">Calculators & Property Valuation</h2>
          <p class="section-desc">Accurately calculate land area conversions, bank home loans, FBR property tax, and instant property valuation estimates.</p>
        </div>

        <div class="tools-nav-tabs">
          <button class="tools-tab-btn ${activeTool === 'converter' ? 'active' : ''}" data-tool="converter">
            <i data-lucide="scale" style="width:20px; height:20px;"></i> Area Unit Converter
          </button>
          <button class="tools-tab-btn ${activeTool === 'mortgage' ? 'active' : ''}" data-tool="mortgage">
            <i data-lucide="calculator" style="width:20px; height:20px;"></i> Home Loan Calculator
          </button>
          <button class="tools-tab-btn ${activeTool === 'fbr' ? 'active' : ''}" data-tool="fbr">
            <i data-lucide="file-text" style="width:20px; height:20px;"></i> FBR Tax & Transfer Fee
          </button>
          <button class="tools-tab-btn ${activeTool === 'valuate' ? 'active' : ''}" data-tool="valuate">
            <i data-lucide="trending-up" style="width:20px; height:20px;"></i> Valuation Estimator
          </button>
        </div>

        <div class="tool-card-container">
          ${activeTool === 'converter' ? renderAreaConverter() : ''}
          ${activeTool === 'mortgage' ? renderMortgageCalculator() : ''}
          ${activeTool === 'fbr' ? renderFBRTaxCalculatorSection() : ''}
          ${activeTool === 'valuate' ? renderValuationEstimator() : ''}
        </div>
      </div>
    </section>
  `;
}

function renderAreaConverter() {
  return `
    <div class="calc-grid">
      <div class="calc-inputs">
        <h3>Pakistani Land Unit Converter</h3>
        <p style="color:var(--text-muted); font-size:0.88rem;">Convert seamlessly between Marla, Kanal, Sq Ft, Sq Yds, and Acres (Standard 1 Marla = 225 Sq Ft in modern societies).</p>
        
        <div class="calc-group">
          <label>Enter Value</label>
          <input type="number" id="convert-input-val" class="form-control" value="10" placeholder="e.g. 10" />
        </div>

        <div class="form-grid-2">
          <div class="calc-group">
            <label>From Unit</label>
            <select id="convert-from-unit" class="form-control">
              <option value="Marla" selected>Marla</option>
              <option value="Kanal">Kanal</option>
              <option value="Sq Ft">Sq Ft</option>
              <option value="Sq Yds">Sq Yds</option>
              <option value="Acre">Acre</option>
            </select>
          </div>
          <div class="calc-group">
            <label>To Unit</label>
            <select id="convert-to-unit" class="form-control">
              <option value="Sq Ft" selected>Sq Ft</option>
              <option value="Marla">Marla</option>
              <option value="Kanal">Kanal</option>
              <option value="Sq Yds">Sq Yds</option>
              <option value="Acre">Acre</option>
            </select>
          </div>
        </div>
      </div>

      <div class="calc-result-box" id="converter-result-box">
        <h3>Converted Area Result</h3>
        <div class="result-item">
          <span>Converted Output:</span>
          <span class="val highlight-val" id="conv-output-val">2,250 Sq Ft</span>
        </div>
        <div class="result-item">
          <span>Equivalent in Marla:</span>
          <span class="val" id="conv-marla-val">10 Marla</span>
        </div>
        <div class="result-item">
          <span>Equivalent in Kanal:</span>
          <span class="val" id="conv-kanal-val">0.50 Kanal</span>
        </div>
      </div>
    </div>
  `;
}

function renderMortgageCalculator() {
  return `
    <div class="calc-grid">
      <div class="calc-inputs">
        <h3>Bank Home Financing Calculator</h3>
        <p style="color:var(--text-muted); font-size:0.88rem;">Based on Pakistani bank Islamic & conventional financing guidelines (Meezan, HBL, Bank Alfalah KIBOR rates).</p>

        <div class="calc-group">
          <label>Property Price (PKR)</label>
          <input type="number" id="mort-price" class="form-control" value="35000000" step="500000" />
        </div>

        <div class="form-grid-2">
          <div class="calc-group">
            <label>Down Payment (%)</label>
            <input type="number" id="mort-down-percent" class="form-control" value="25" min="10" max="80" />
          </div>
          <div class="calc-group">
            <label>Loan Tenure (Years)</label>
            <select id="mort-tenure" class="form-control">
              <option value="5">5 Years</option>
              <option value="10">10 Years</option>
              <option value="15" selected>15 Years</option>
              <option value="20">20 Years</option>
            </select>
          </div>
        </div>

        <div class="calc-group">
          <label>Annual Bank Profit / Interest Rate (%)</label>
          <input type="number" id="mort-rate" class="form-control" value="14.5" step="0.1" />
        </div>
      </div>

      <div class="calc-result-box" id="mortgage-result-box">
        <h3>Monthly Installment Summary</h3>
        <div class="result-item">
          <span>Estimated Monthly EMI:</span>
          <span class="val highlight-val" id="mort-output-emi">PKR 358,400 / mo</span>
        </div>
        <div class="result-item">
          <span>Required Down Payment:</span>
          <span class="val" id="mort-output-down">PKR 8,750,000</span>
        </div>
        <div class="result-item">
          <span>Total Loan Financed:</span>
          <span class="val" id="mort-output-loan">PKR 26,250,000</span>
        </div>
      </div>
    </div>
  `;
}

function renderValuationEstimator() {
  return `
    <div class="calc-grid">
      <div class="calc-inputs">
        <h3>Instant Property Valuation Estimator</h3>
        <p style="color:var(--text-muted); font-size:0.88rem;">Select location and size to estimate current market value based on real transaction data in Pakistan.</p>

        <div class="calc-group">
          <label>Select City & Society</label>
          <select id="val-society" class="form-control">
            <option value="3500000">DHA Phase 6 Lahore (Avg 3.5 Cr / 10 Marla)</option>
            <option value="2800000" selected>Bahria Town Phase 8 Islamabad (Avg 2.8 Cr / 10 Marla)</option>
            <option value="1800000">Gulberg Greens Islamabad (Avg 1.8 Cr / 5 Marla)</option>
            <option value="6000000">DHA Phase 5 Karachi (Avg 6.0 Cr / 1 Kanal)</option>
          </select>
        </div>

        <div class="form-grid-2">
          <div class="calc-group">
            <label>Property Size (Marla)</label>
            <input type="number" id="val-marla" class="form-control" value="10" />
          </div>
          <div class="calc-group">
            <label>Construction Condition</label>
            <select id="val-condition" class="form-control">
              <option value="1.2">Brand New / Modern Luxury</option>
              <option value="1.0" selected>Good Condition (1-5 Yrs)</option>
              <option value="0.8">Old Structure / Plot Only</option>
            </select>
          </div>
        </div>
      </div>

      <div class="calc-result-box">
        <h3>Valuation Estimate</h3>
        <div class="result-item">
          <span>Estimated Market Range:</span>
          <span class="val highlight-val" id="val-output-price">PKR 2.80 Crore - 3.36 Crore</span>
        </div>
        <div class="result-item">
          <span>Avg Price per Marla:</span>
          <span class="val">PKR 30.8 Lakh / Marla</span>
        </div>
        <p style="font-size:0.75rem; color:rgba(255,255,255,0.7); margin-top:1rem;">*Estimated market values are based on standard 225 sq ft Marla plots in approved societies.</p>
      </div>
    </div>
  `;
}
