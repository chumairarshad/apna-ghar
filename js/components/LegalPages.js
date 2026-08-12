import { renderIcon } from '../utils/icons.js';
import { renderFBRTaxCalculatorSection } from './FBRTaxCalculator.js';

export function renderLegalPage(type) {
  let title = 'Privacy Policy';
  let badgeText = 'LEGAL COMPLIANCE';
  let bodyContent = '';

  if (type === 'terms') {
    title = 'Terms of Service & Portal User Agreement';
    badgeText = 'USER AGREEMENT';
    bodyContent = `
      <h3>1. Agreement to Terms</h3>
      <p>By accessing or using the Sarmayadar Real Estate Portal (sarmayadar.com), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.</p>

      <h3>2. Property Listings & Verification Disclaimer</h3>
      <p>While Sarmayadar performs rigorous physical document verification ("PLATINUM VERIFIED" badges) for listings published on our portal, property buyers and investors are advised to perform independent legal title checks before making financial commitments.</p>

      <h3>3. Dealer & Agency Code of Conduct</h3>
      <p>Real estate agencies and independent dealers listing properties on Sarmayadar must maintain accurate property details, transparent pricing, and active WhatsApp/phone communication credentials. Fraudulent, duplicate, or mispriced listings will result in permanent account suspension.</p>

      <h3>4. Intellectual Property Rights</h3>
      <p>All content, logo assets, automated watermarks, software code, UI design tokens, and database compilations are the exclusive property of Sarmayadar Portal and Vujood.</p>
    `;
  } else if (type === 'fbr-tax-guide') {
    title = 'FBR Property Tax & Withholding Tax Guide 2026';
    badgeText = 'PAKISTAN TAX LAWS';
    bodyContent = `
      <h3>Understanding Pakistan FBR Property Taxes (Filer vs Non-Filer)</h3>
      <p>Under the Federal Board of Revenue (FBR) Finance Act 2026, real estate transactions in Pakistan attract Withholding Tax under Section 236C (Advance Tax on Sellers) and Section 236K (Advance Tax on Buyers).</p>

      <div style="background: var(--cream); border-left: 4px solid var(--marigold); padding: 1.25rem; border-radius: 10px; margin: 1.5rem 0;">
        <h4 style="margin: 0 0 0.5rem 0; color: var(--forest-dk);">📌 Key Tax Rates Summary for 2026:</h4>
        <ul style="margin: 0; padding-left: 1.25rem; font-weight: 700; color: var(--forest-dk);">
          <li>Active Tax Filer (Buying Property): <strong>3%</strong> of FBR Value</li>
          <li>Non-Filer (Buying Property): <strong>12%</strong> of FBR Value</li>
          <li>Active Tax Filer (Selling Property): <strong>3%</strong> of Sale Price</li>
          <li>Non-Filer (Selling Property): <strong>10%</strong> of Sale Price</li>
        </ul>
      </div>

      <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Interactive FBR Tax Calculator</h3>
      ${renderFBRTaxCalculatorSection()}
    `;
  } else {
    // Default Privacy Policy
    title = 'Privacy Policy & Data Security Standards';
    badgeText = 'DATA PROTECTION';
    bodyContent = `
      <h3>1. Information We Collect</h3>
      <p>Sarmayadar collects user contact details (name, email address, mobile phone number) when you register an account, schedule a property visit, or post a property listing. We also collect browser cookies and device IP data for fraud prevention and security monitoring.</p>

      <h3>2. How We Protect Your Data</h3>
      <p>All data transmitted through Sarmayadar is protected with 256-bit SSL encryption. We adhere to the Secure AI Framework (SAIF) standards and strictly protect dealer customer CRM data against unauthorized third-party disclosure.</p>

      <h3>3. Web Push & Notification Subscriptions</h3>
      <p>If you subscribe to property alert notifications, your device push token is stored securely and used exclusively to inform you about price drops, new verified listings, and market trends.</p>
    `;
  }

  return `
    <div class="legal-page-wrapper" style="background: var(--cream); min-height: 90vh; padding: 2rem 0 4rem 0;">
      <div class="container" style="max-width: 860px;">
        
        <!-- Breadcrumbs -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.75rem;">
          <nav aria-label="breadcrumb">
            <ol style="display: flex; align-items: center; gap: 8px; list-style: none; padding: 0; margin: 0; font-size: 0.85rem; font-weight: 700; color: var(--forest-dk);">
              <li><a href="#buy" style="color: var(--rani-dk); text-decoration: none;">Home</a></li>
              <li style="color: var(--forest); opacity: 0.5;">/</li>
              <li style="color: var(--forest-dk);">${title}</li>
            </ol>
          </nav>

          <a href="#buy" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700; background: var(--paper); border: 2px solid var(--forest-dk); border-radius: 8px; padding: 6px 14px; text-decoration: none; color: var(--forest-dk);">
            ${renderIcon('arrow-left', 14)} Back to Main Portal
          </a>
        </div>

        <!-- Main Document Card -->
        <div style="background: var(--paper); border-radius: 20px; border: 3px solid var(--forest-dk); box-shadow: var(--shadow-lg); overflow: hidden;">
          
          <div style="background: var(--forest-dk); color: white; padding: 2.25rem; border-bottom: 4px solid var(--marigold);">
            <span class="badge" style="background: var(--marigold); color: var(--forest-dk); font-weight: 800; font-size: 0.75rem; padding: 4px 12px; margin-bottom: 8px; display: inline-block;">
              ${badgeText}
            </span>
            <h1 style="font-size: 1.8rem; font-weight: 800; color: white; margin: 0;">
              ${title}
            </h1>
            <p style="color: var(--cream); opacity: 0.85; font-size: 0.88rem; margin-top: 6px; margin-bottom: 0;">
              Last Updated & Effective: August 2026 • Sarmayadar Legal Compliance Office
            </p>
          </div>

          <div style="padding: 2.5rem; font-size: 1.02rem; line-height: 1.8; color: var(--ink);">
            ${bodyContent}
          </div>

        </div>

      </div>
    </div>
  `;
}
