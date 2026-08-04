import { formatPKR } from '../utils/formatters.js';
import { renderIcon } from '../utils/icons.js';

export function calculateFBRTaxes(propertyPrice, isFiler = true, isSellerFiler = true) {
  const price = Number(propertyPrice) || 0;
  
  // Section 236K Buyer Withholding Tax
  const buyerTaxRate = isFiler ? 0.03 : 0.105; // 3% for Filer, 10.5% for Non-Filer
  const buyerTax = price * buyerTaxRate;

  // Section 236C Seller Withholding Tax
  const sellerTaxRate = isSellerFiler ? 0.03 : 0.10; // 3% for Filer, 10% for Non-Filer
  const sellerTax = price * sellerTaxRate;

  // Stamp Duty (2%)
  const stampDuty = price * 0.02;

  // Town Committee Fee (1%)
  const townFee = price * 0.01;

  // CVT (Capital Value Tax 2%)
  const cvt = price * 0.02;

  const totalBuyerCost = price + buyerTax + stampDuty + townFee + cvt;

  return {
    price,
    buyerTaxRate: (buyerTaxRate * 100).toFixed(1),
    buyerTax,
    sellerTaxRate: (sellerTaxRate * 100).toFixed(1),
    sellerTax,
    stampDuty,
    townFee,
    cvt,
    totalGovernmentTaxes: buyerTax + stampDuty + townFee + cvt,
    totalBuyerCost
  };
}

export function renderFBRTaxCalculatorSection() {
  const res = calculateFBRTaxes(35000000, true, true);

  return `
    <div class="calc-grid">
      <div class="calc-inputs">
        <h3>${renderIcon('calculator', 20, 'var(--rani)')} FBR Property Tax Calculator</h3>
        <p style="font-size:0.85rem; color:var(--forest); opacity:0.85;">
          Calculate FBR Income Tax (Section 236C & 236K), Stamp Duty, Town Fee, and CVT for Filer vs Non-Filer transactions in Pakistan.
        </p>

        <div class="calc-group">
          <label>Declared FBR Property Value (PKR)</label>
          <input type="number" id="fbr-price-input" value="35000000" step="500000" />
        </div>

        <div class="calc-group">
          <label>Buyer Tax Filer Status</label>
          <select id="fbr-buyer-filer">
            <option value="filer" selected>Active Income Tax Filer (3% Tax Rate)</option>
            <option value="nonfiler">Non-Filer / Late Filer (10.5% Tax Rate)</option>
          </select>
        </div>

        <div class="calc-group">
          <label>Seller Tax Filer Status</label>
          <select id="fbr-seller-filer">
            <option value="filer" selected>Active Filer Seller (3% Tax Rate)</option>
            <option value="nonfiler">Non-Filer Seller (10% Tax Rate)</option>
          </select>
        </div>
      </div>

      <!-- Right Result Card -->
      <div class="calc-result-box">
        <h3>FBR Tax & Transfer Fee Summary</h3>
        <div class="result-item">
          <span>Buyer Tax (Sec 236K):</span>
          <span class="val" id="fbr-res-buyer-tax">${formatPKR(res.buyerTax)} (${res.buyerTaxRate}%)</span>
        </div>
        <div class="result-item">
          <span>Seller Tax (Sec 236C):</span>
          <span class="val" id="fbr-res-seller-tax">${formatPKR(res.sellerTax)} (${res.sellerTaxRate}%)</span>
        </div>
        <div class="result-item">
          <span>Stamp Duty (2%):</span>
          <span class="val" id="fbr-res-stamp">${formatPKR(res.stampDuty)}</span>
        </div>
        <div class="result-item">
          <span>Town Committee & CVT (3%):</span>
          <span class="val" id="fbr-res-cvt">${formatPKR(res.townFee + res.cvt)}</span>
        </div>
        <div class="result-item" style="border-top:2px solid var(--marigold); margin-top:0.5rem; padding-top:0.75rem;">
          <span>Total Govt Transfer Fees:</span>
          <span class="val highlight-val" id="fbr-res-total-govt">${formatPKR(res.totalGovernmentTaxes)}</span>
        </div>
      </div>
    </div>
  `;
}
