import { renderIcon } from '../utils/icons.js';
import { formatPKR } from '../utils/formatters.js';

export function renderAdvertiseCheckout(state) {
  const pkg = state.selectedPackage || {
    name: 'Pro Gold Agency Package',
    price: 24999,
    period: 'Per Month',
    features: [
      '50 Verified Property Listings',
      '10 Hot/Featured Listing Boosts',
      'Verified Dealer Badge & Agency Profile Page',
      'Direct WhatsApp Leads & Daily Visitor Analytics',
      'Dedicated Sales Account Manager'
    ]
  };

  const user = state.user || {};

  return `
    <div class="advertise-checkout-wrapper" style="background:#F8FAFC; min-height:90vh; padding: 2.5rem 1rem 5rem 1rem;">
      <style>
        @media (max-width: 768px) {
          .advertise-checkout-wrapper {
            padding: 1rem 0.5rem 3rem 0.5rem !important;
          }
          .checkout-grid-container {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          .checkout-card {
            padding: 1.25rem !important;
            border-radius: 14px !important;
          }
          .checkout-form-row {
            grid-template-columns: 1fr !important;
            gap: 0.8rem !important;
          }
          .checkout-price-display {
            font-size: 1.75rem !important;
          }
          .checkout-top-nav {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .checkout-top-nav a {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      </style>

      <div class="container" style="max-width: 960px; margin: 0 auto;">
        
        <!-- Navigation Header & Breadcrumbs -->
        <div class="checkout-top-nav" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
          <nav aria-label="breadcrumb">
            <ol style="display:flex; align-items:center; gap:8px; list-style:none; padding:0; margin:0; font-size:0.88rem; font-weight:700; color:#0F172A;">
              <li><a href="/" data-nav="buy" style="color:#059669; text-decoration:none;">Home</a></li>
              <li style="color:#94A3B8;">/</li>
              <li><a href="/advertise" data-nav="advertise" style="color:#059669; text-decoration:none;">Advertise</a></li>
              <li style="color:#94A3B8;">/</li>
              <li style="color:#0F172A;">Package Checkout</li>
            </ol>
          </nav>

          <a href="/advertise" data-nav="advertise" class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:6px; font-weight:800; background:#FFFFFF; border:2px solid #064E3B; color:#064E3B; border-radius:10px; padding:7px 16px; text-decoration:none;">
            ${renderIcon('arrow-left', 14)} Back to Packages
          </a>
        </div>

        <!-- Checkout Grid -->
        <div class="checkout-grid-container" style="display:grid; grid-template-columns: 1fr 1.1fr; gap: 2rem;">
          
          <!-- LEFT COLUMN: Selected Package Summary Card -->
          <div class="checkout-card" style="background:#FFFFFF; border-radius:20px; border:2px solid #E2E8F0; padding:2rem; box-shadow:0 10px 30px rgba(0,0,0,0.05); align-self:start;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
              <span class="badge" style="background:#FEF3C7; color:#D97706; border:1px solid #FCD34D; font-weight:800; font-size:0.75rem; padding:4px 12px; border-radius:20px;">
                SELECTED ADVERTISING PACKAGE
              </span>
              <span style="font-size:0.8rem; font-weight:700; color:#059669; background:#ECFDF5; padding:3px 8px; border-radius:6px;">
                Instant Activation
              </span>
            </div>

            <h2 style="font-size:1.6rem; font-weight:800; color:#0F172A; margin:0 0 0.5rem 0;">
              ${pkg.name}
            </h2>
            
            <div style="font-size:2.2rem; font-weight:900; color:#064E3B; margin-bottom:1.5rem; display:flex; align-items:baseline; gap:6px;">
              ${formatPKR(pkg.price)}
              <span style="font-size:0.9rem; font-weight:600; color:#64748B;">/ ${pkg.period || 'month'}</span>
            </div>

            <hr style="border:none; border-top:1px solid #E2E8F0; margin:1.5rem 0;" />

            <h4 style="font-size:0.85rem; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:1rem;">
              Included Package Features:
            </h4>

            <ul style="list-style:none; padding:0; margin:0 0 1.5rem 0; display:flex; flex-direction:column; gap:0.75rem;">
              ${(pkg.features || [
                'Unlimited Property Uploads',
                'Featured Home Page Banner Spotlight',
                'Verified Agency Profile & Badge',
                'WhatsApp Lead Automation'
              ]).map(feat => `
                <li style="display:flex; align-items:flex-start; gap:10px; font-size:0.92rem; font-weight:700; color:#1E293B;">
                  <span style="color:#059669; margin-top:2px;">✓</span>
                  <span>${feat}</span>
                </li>
              `).join('')}
            </ul>

            <div style="background:#F1F5F9; border-radius:12px; padding:1rem; border:1px solid #CBD5E1;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.88rem; font-weight:700; color:#475569;">
                <span>Package Subtotal</span>
                <span>${formatPKR(pkg.price)}</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.88rem; font-weight:700; color:#475569;">
                <span>Government Taxes (GST)</span>
                <span style="color:#059669;">INCLUDED (0%)</span>
              </div>
              <hr style="border:none; border-top:1px dashed #CBD5E1; margin:8px 0;" />
              <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:900; color:#0F172A;">
                <span>Total Amount Payable</span>
                <span style="color:#064E3B;">${formatPKR(pkg.price)}</span>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Customer Details & Confirmation Form -->
          <div class="checkout-card" style="background:#FFFFFF; border-radius:20px; border:3px solid #064E3B; padding:2rem; box-shadow:0 12px 35px rgba(0,0,0,0.08);">
            <div style="margin-bottom:1.5rem;">
              <h3 class="checkout-title" style="font-size:1.4rem; font-weight:800; color:#064E3B; margin:0 0 6px 0;">
                Billing & Account Details
              </h3>
              <p style="font-size:0.88rem; color:#64748B; margin:0;">
                Please verify your details to generate your official payment invoice & bank transfer instructions.
              </p>
            </div>

            <form id="adv-checkout-form">
              <div class="form-group" style="margin-bottom:1.2rem;">
                <label style="display:block; font-size:0.8rem; font-weight:800; color:#0F172A; text-transform:uppercase; margin-bottom:6px;">
                  Full Name / Agency Owner *
                </label>
                <input type="text" id="chk_name" class="form-control" value="${user.name || ''}" placeholder="e.g. Umair Arshad" style="width:100%; padding:0.8rem; font-weight:700; border-radius:10px; border:2px solid #CBD5E1;" required />
              </div>

              <div class="checkout-form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.2rem;">
                <div class="form-group">
                  <label style="display:block; font-size:0.8rem; font-weight:800; color:#0F172A; text-transform:uppercase; margin-bottom:6px;">
                    WhatsApp Mobile No *
                  </label>
                  <input type="text" id="chk_phone" class="form-control" value="${user.phone || '+923297543852'}" placeholder="e.g. +923297543852" style="width:100%; padding:0.8rem; font-weight:700; border-radius:10px; border:2px solid #CBD5E1;" required />
                </div>
                <div class="form-group">
                  <label style="display:block; font-size:0.8rem; font-weight:800; color:#0F172A; text-transform:uppercase; margin-bottom:6px;">
                    City *
                  </label>
                  <select id="chk_city" class="form-control" style="width:100%; padding:0.8rem; font-weight:700; border-radius:10px; border:2px solid #CBD5E1;" required>
                    <option value="Lahore" selected>Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>
              </div>

              <div class="form-group" style="margin-bottom:1.2rem;">
                <label style="display:block; font-size:0.8rem; font-weight:800; color:#0F172A; text-transform:uppercase; margin-bottom:6px;">
                  Email Address *
                </label>
                <input type="email" id="chk_email" class="form-control" value="${user.email || 'advertiser@sarmayadar.com'}" placeholder="e.g. name@agency.com" style="width:100%; padding:0.8rem; font-weight:700; border-radius:10px; border:2px solid #CBD5E1;" required />
              </div>

              <div class="form-group" style="margin-bottom:1.5rem;">
                <label style="display:block; font-size:0.8rem; font-weight:800; color:#0F172A; text-transform:uppercase; margin-bottom:6px;">
                  Agency Name / Business Title (Optional)
                </label>
                <input type="text" id="chk_agency" class="form-control" value="${user.agencyName || ''}" placeholder="e.g. Al-Rehman Estate & Builders" style="width:100%; padding:0.8rem; font-weight:700; border-radius:10px; border:2px solid #CBD5E1;" />
              </div>

              <button type="submit" id="adv-confirm-checkout-btn" class="btn" style="width:100%; padding:1rem; font-size:1.05rem; font-weight:900; background:#F59E0B; color:#0F172A; border:none; border-radius:12px; box-shadow:0 8px 25px rgba(245,158,11,0.35); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                🚀 Confirm & Generate Payment Invoice
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  `;
}

export function renderAdvertiseInvoice(state) {
  const pkg = state.selectedPackage || {
    name: 'Pro Gold Agency Package',
    price: 24999,
    period: 'Per Month'
  };

  const invoice = state.generatedInvoice || {
    invoiceId: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    dueDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    customerName: state.user?.name || 'Valued Advertiser',
    customerPhone: state.user?.phone || '+923297543852',
    customerEmail: state.user?.email || 'advertiser@sarmayadar.com',
    customerCity: 'Lahore, Pakistan',
    agencyName: state.user?.agencyName || 'Estate Agency',
    package: pkg
  };

  return `
    <div class="advertise-invoice-wrapper" style="background:#E2E8F0; min-height:100vh; padding: 2.5rem 1rem 5rem 1rem;">
      <style>
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice-container, #printable-invoice-container * {
            visibility: visible !important;
          }
          #printable-invoice-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
          }
          .non-printable-actions {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .advertise-invoice-wrapper {
            padding: 1rem 0.5rem 3rem 0.5rem !important;
          }
          #printable-invoice-container {
            padding: 1.25rem 1rem !important;
            border-radius: 14px !important;
          }
          .invoice-header-meta {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .invoice-header-right {
            text-align: left !important;
            width: 100% !important;
          }
          .invoice-billed-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
            padding: 1rem !important;
          }
          .invoice-total-summary {
            justify-content: stretch !important;
          }
          .invoice-total-summary-box {
            width: 100% !important;
          }
          .bank-transfer-card {
            padding: 1rem !important;
          }
          .bank-details-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
          .invoice-top-actions {
            flex-direction: column !important;
            width: 100% !important;
          }
          .invoice-top-actions a,
          .invoice-top-actions button {
            width: 100% !important;
            justify-content: center !important;
          }
          .whatsapp-confirm-box {
            padding: 1.15rem 1rem !important;
          }
          .whatsapp-confirm-row {
            flex-direction: column !important;
          }
          .whatsapp-confirm-row input,
          .whatsapp-confirm-row button {
            width: 100% !important;
          }
        }
      </style>

      <div class="container" style="max-width: 860px; margin: 0 auto;">
        
        <!-- Non-printable top action banner -->
        <div class="non-printable-actions invoice-top-actions" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; background:#FFFFFF; padding:1rem 1.5rem; border-radius:16px; border:1px solid #CBD5E1; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <a href="/advertise" data-nav="advertise" style="display:inline-flex; align-items:center; gap:6px; color:#475569; font-weight:800; text-decoration:none; font-size:0.9rem;">
            ${renderIcon('arrow-left', 14)} Return to Advertise Page
          </a>

          <div style="display:flex; gap:10px;">
            <button type="button" id="btn-print-invoice" class="btn" style="background:#0F172A; color:#FFFFFF; font-weight:800; padding:8px 18px; border-radius:10px; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-size:0.88rem;">
              ${renderIcon('printer', 16)} 📥 Download / Print Invoice (PDF)
            </button>
          </div>
        </div>

        <!-- PRINTABLE INVOICE MAIN CONTAINER -->
        <div id="printable-invoice-container" style="background:#FFFFFF; border-radius:20px; border:1px solid #CBD5E1; box-shadow:0 15px 40px rgba(0,0,0,0.1); overflow:hidden; padding:2.5rem;">
          
          <!-- Header Branding & Invoice Meta -->
          <div class="invoice-header-meta" style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1.5rem; border-bottom:3px solid #064E3B; padding-bottom:1.5rem; margin-bottom:2rem;">
            <div>
              <!-- Sarmayadar Brand Logo -->
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <svg viewBox="0 0 100 100" fill="none" style="width:42px; height:42px;">
                  <rect width="100" height="100" rx="14" fill="#064E3B"/>
                  <path d="M50 18L18 45V82H82V45L50 18Z" fill="#FAF1DE"/>
                  <path d="M50 25L26 46V76H74V46L50 25Z" fill="#064E3B"/>
                  <circle cx="50" cy="46" r="10" fill="#F2A71B"/>
                  <path d="M42 76V58H58V76H42Z" fill="#D1266E"/>
                </svg>
                <div>
                  <div style="font-size:1.6rem; font-weight:900; color:#064E3B; letter-spacing:-0.02em;">SARMAYA<span style="color:#F59E0B;">DAR</span></div>
                  <div style="font-size:0.75rem; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.08em;">Pakistan Premier Real Estate Portal</div>
                </div>
              </div>
              <div style="font-size:0.82rem; color:#475569; line-height:1.4;">
                Sarmayadar Advertising Services Pakistan<br />
                Email: billing@sarmayadar.com | Helpline: +92 329 7543852
              </div>
            </div>

            <div class="invoice-header-right" style="text-align:right;">
              <span class="badge" style="background:#FEF3C7; color:#D97706; border:1px solid #FCD34D; font-weight:900; font-size:0.85rem; padding:6px 14px; border-radius:20px; display:inline-block; margin-bottom:8px;">
                ⏳ PENDING PAYMENT VERIFICATION
              </span>
              <h2 style="font-size:1.8rem; font-weight:900; color:#0F172A; margin:0 0 4px 0;">INVOICE</h2>
              <div style="font-family:monospace; font-size:1.1rem; font-weight:800; color:#059669;">${invoice.invoiceId}</div>
              <div style="font-size:0.82rem; color:#64748B; margin-top:4px;">
                Issue Date: <strong>${invoice.date}</strong><br />
                Due Date: <strong>${invoice.dueDate}</strong>
              </div>
            </div>
          </div>

          <!-- Customer & Billed To Information Grid -->
          <div class="invoice-billed-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; margin-bottom:2rem; background:#F8FAFC; padding:1.25rem 1.5rem; border-radius:14px; border:1px solid #E2E8F0;">
            <div>
              <div style="font-size:0.75rem; font-weight:800; color:#64748B; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">BILLED TO (ADVERTISER):</div>
              <div style="font-size:1.1rem; font-weight:900; color:#0F172A;">${invoice.customerName}</div>
              ${invoice.agencyName ? `<div style="font-size:0.9rem; font-weight:700; color:#059669;">${invoice.agencyName}</div>` : ''}
              <div style="font-size:0.85rem; color:#475569; margin-top:4px;">
                📞 ${invoice.customerPhone}<br />
                ✉️ ${invoice.customerEmail}<br />
                📍 ${invoice.customerCity}
              </div>
            </div>

            <div>
              <div style="font-size:0.75rem; font-weight:800; color:#64748B; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">PAYMENT METHOD:</div>
              <div style="font-size:0.95rem; font-weight:800; color:#064E3B;">Direct Bank Transfer / Mobile Wallet</div>
              <div style="font-size:0.85rem; color:#475569; margin-top:4px;">
                Currency: PKR (Pakistani Rupee)<br />
                Service: Listing Activation & Dealer Membership
              </div>
            </div>
          </div>

          <!-- Itemized Package Table -->
          <div style="overflow-x:auto;">
            <table style="width:100%; min-width:320px; border-collapse:collapse; margin-bottom:2rem; text-align:left;">
              <thead>
                <tr style="background:#064E3B; color:#FFFFFF; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em;">
                  <th style="padding:12px 16px; border-top-left-radius:10px;">Item Description</th>
                  <th style="padding:12px 16px; text-align:center;">Duration</th>
                  <th style="padding:12px 16px; text-align:right; border-top-right-radius:10px;">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:16px;">
                    <div style="font-weight:900; font-size:1.05rem; color:#0F172A;">${invoice.package.name}</div>
                    <div style="font-size:0.82rem; color:#64748B; margin-top:4px;">
                      Official Advertising Subscription with Unlimited Property Uploads, Verified Dealer Badge, and Lead Generation Boost.
                    </div>
                  </td>
                  <td style="padding:16px; text-align:center; font-weight:700; color:#475569;">
                    ${invoice.package.period || '30 Days'}
                  </td>
                  <td style="padding:16px; text-align:right; font-weight:900; font-size:1.1rem; color:#064E3B;">
                    ${formatPKR(invoice.package.price)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Calculation Summary -->
          <div class="invoice-total-summary" style="display:flex; justify-content:flex-end; margin-bottom:2rem;">
            <div class="invoice-total-summary-box" style="width:300px; background:#F8FAFC; padding:1.25rem; border-radius:12px; border:1px solid #E2E8F0;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.9rem; font-weight:700; color:#64748B;">
                <span>Subtotal:</span>
                <span>${formatPKR(invoice.package.price)}</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem; font-weight:700; color:#059669;">
                <span>Sales Tax (0% Promo):</span>
                <span>PKR 0</span>
              </div>
              <hr style="border:none; border-top:2px dashed #CBD5E1; margin:8px 0;" />
              <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:900; color:#0F172A;">
                <span>Total Amount:</span>
                <span style="color:#064E3B;">${formatPKR(invoice.package.price)}</span>
              </div>
            </div>
          </div>

          <!-- OFFICIAL BANK TRANSFER DETAILS CARD (HIGH VISIBILITY) -->
          <div class="bank-transfer-card" style="background:linear-gradient(135deg, #ECFDF5, #D1FAE5); border:2px solid #059669; border-radius:16px; padding:1.5rem; margin-bottom:2rem;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:1.5rem;">🏦</span>
                <h3 style="font-size:1.2rem; font-weight:900; color:#064E3B; margin:0;">
                  Official Bank Transfer Details
                </h3>
              </div>
              <span style="background:#064E3B; color:#FFFFFF; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:20px;">
                VERIFIED PAYMENT DESTINATION
              </span>
            </div>

            <p style="font-size:0.88rem; color:#047857; margin-bottom:1rem; font-weight:600;">
              Please transfer <strong>${formatPKR(invoice.package.price)}</strong> using any Mobile Banking App, JazzCash, EasyPaisa, or ATM:
            </p>

            <div class="bank-details-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; background:#FFFFFF; padding:1.25rem; border-radius:12px; border:1px solid #A7F3D0;">
              <div>
                <div style="font-size:0.72rem; font-weight:800; color:#64748B; text-transform:uppercase;">Bank / Mobile Wallet</div>
                <div style="font-size:1.1rem; font-weight:900; color:#0F172A;">Nayapay</div>
              </div>
              <div>
                <div style="font-size:0.72rem; font-weight:800; color:#64748B; text-transform:uppercase;">Account Title</div>
                <div style="font-size:1.1rem; font-weight:900; color:#0F172A;">Umair Arshad</div>
              </div>
              <div>
                <div style="font-size:0.72rem; font-weight:800; color:#64748B; text-transform:uppercase;">Account / Mobile No</div>
                <div style="font-size:1.2rem; font-weight:900; color:#059669; font-family:monospace;">+923297543852</div>
              </div>
            </div>

            <div style="margin-top:1rem; display:flex; gap:10px; flex-wrap:wrap;">
              <button type="button" id="btn-copy-bank-details" class="btn" style="background:#059669; color:#FFFFFF; font-weight:800; font-size:0.88rem; padding:8px 16px; border-radius:8px; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:6px; width:100%; justify-content:center;">
                ${renderIcon('copy', 15)} 📋 Copy Account Number (+923297543852)
              </button>
            </div>
          </div>

          <!-- TRANSACTION SUBMISSION & WHATSAPP REDIRECT (NON-PRINTABLE) -->
          <div class="non-printable-actions whatsapp-confirm-box" style="background:#FEF3C7; border:2px dashed #F59E0B; border-radius:16px; padding:1.5rem;">
            <h4 style="font-size:1.1rem; font-weight:900; color:#92400E; margin:0 0 6px 0; display:flex; align-items:center; gap:8px;">
              <span>💬</span> Step 2: Confirm Payment & Activate Package via WhatsApp
            </h4>
            <p style="font-size:0.88rem; color:#78350F; margin:0 0 1rem 0;">
              After transferring funds, enter your Transaction Reference ID below and click <strong>Confirm via WhatsApp</strong> to activate your package immediately.
            </p>

            <div class="whatsapp-confirm-row" style="display:flex; flex-wrap:wrap; gap:1rem; align-items:center;">
              <input type="text" id="invoice_trx_id" class="form-control" placeholder="Enter Transaction TRX ID (e.g. TRX-982341)" style="flex:1; min-width:240px; padding:0.8rem; font-weight:800; font-size:0.95rem; border-radius:10px; border:2px solid #FCD34D;" />

              <button type="button" id="btn-confirm-whatsapp-payment" class="btn" style="background:#25D366; color:#FFFFFF; font-weight:900; font-size:1rem; padding:0.8rem 1.5rem; border-radius:10px; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 15px rgba(37,211,102,0.35);">
                ${renderIcon('message-circle', 18)} 🚀 Confirm Payment via WhatsApp
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}
