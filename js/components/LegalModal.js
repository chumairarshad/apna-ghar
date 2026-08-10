import { renderIcon } from '../utils/icons.js';

export function renderLegalModal(activeTab) {
  if (!activeTab) return '';

  const isPrivacy = activeTab === 'privacy';

  return `
    <div class="modal-overlay active" id="legal-modal-overlay" style="
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.25s ease-out;
    ">
      <div class="modal-card" style="
        background: #FFFFFF;
        border-radius: 16px;
        max-width: 860px;
        width: 100%;
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
        border: 1px solid #E2E8F0;
        overflow: hidden;
      ">
        <!-- Modal Header -->
        <div style="
          padding: 1.25rem 1.75rem;
          background: #239C32;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #1B7A30;
        ">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            ${renderIcon(isPrivacy ? 'shield-check' : 'file-text', 22, '#FFFFFF')}
            <div>
              <h2 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin: 0; color: #FFFFFF;">
                ${isPrivacy ? 'Privacy Policy & Data Security' : 'Terms of Service & Platform Guidelines'}
              </h2>
              <p style="font-size: 0.75rem; opacity: 0.9; margin: 2px 0 0; font-family: var(--font-mono);">
                Sarmayadar Real Estate Exchange • Effective Date: January 2026
              </p>
            </div>
          </div>

          <button type="button" id="close-legal-modal-btn" style="
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: #FFFFFF;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          " title="Close Modal">
            ${renderIcon('x', 18)}
          </button>
        </div>

        <!-- Modal Body Content -->
        <div style="
          padding: 1.75rem;
          overflow-y: auto;
          font-size: 0.9rem;
          line-height: 1.65;
          color: #334155;
        ">
          ${isPrivacy ? `
            <div class="legal-content">
              <h3 style="color:#0F172A; font-family:var(--font-display); font-size:1.1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;">
                ${renderIcon('lock', 16, '#239C32')} 1. Information We Collect
              </h3>
              <p style="margin-bottom:1rem;">
                At <strong>Sarmayadar</strong> (Sarmayadar.com), we prioritize the privacy and confidentiality of our clients, property buyers, tenants, and registered real estate agents. We collect essential information necessary to provide verified property exchange services, including name, phone number, WhatsApp contact, email address, property preferences, and FBR tax status (where applicable).
              </p>

              <h3 style="color:#0F172A; font-family:var(--font-display); font-size:1.1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;">
                ${renderIcon('check-circle', 16, '#239C32')} 2. Property Listings & Verification
              </h3>
              <p style="margin-bottom:1rem;">
                All listing details, registry documents, society allotment letters, and media uploaded by dealers or owners are stored securely using encrypted cloud infrastructure. Property location coordinates and price data are processed to generate market trend analytics while protecting private owner identity.
              </p>

              <h3 style="color:#0F172A; font-family:var(--font-display); font-size:1.1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;">
                ${renderIcon('message-square', 16, '#239C32')} 3. Communication & WhatsApp Integration
              </h3>
              <p style="margin-bottom:1rem;">
                By using Sarmayadar property inquiry features or WhatsApp buttons, you consent to receive direct property details, verification reports, and investment alerts from our official helpline (<strong>+92 332 7507866</strong>) or verified agency representatives. We do not sell your personal data to third-party telemarketers.
              </p>

              <h3 style="color:#0F172A; font-family:var(--font-display); font-size:1.1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;">
                ${renderIcon('shield', 16, '#239C32')} 4. FBR & Tax Compliance Security
              </h3>
              <p style="margin-bottom:1rem;">
                Our land tax calculator tools and FBR filer guides operate strictly on client-side parameters. Sarmayadar does not store your CNIC or tax return filings unless explicitly submitted for official legal property drafting or Power of Attorney (POA) documentation.
              </p>

              <div style="background:#F0FDF4; border-left:4px solid #239C32; padding:1rem; border-radius:8px; margin-top:1.5rem;">
                <strong>Questions or Data Requests?</strong><br/>
                Email our Privacy Officer at <a href="mailto:contact@sarmayadar.com" style="color:#239C32; font-weight:700;">contact@sarmayadar.com</a> or call Helpline: <strong>+92 332 7507866</strong>.
              </div>
            </div>
          ` : `
            <div class="legal-content">
              <h3 style="color:#0F172A; font-family:var(--font-display); font-size:1.1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;">
                ${renderIcon('globe', 16, '#239C32')} 1. Acceptance of Terms
              </h3>
              <p style="margin-bottom:1rem;">
                Welcome to <strong>Sarmayadar</strong>. By accessing or using our website (Sarmayadar.com), mobile interfaces, dealer CRM portal, or property valuation calculators, you agree to be bound by these Terms of Service and all applicable Pakistani real estate regulations.
              </p>

              <h3 style="color:#0F172A; font-family:var(--font-display); font-size:1.1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;">
                ${renderIcon('building-2', 16, '#239C32')} 2. Dealer & Agency Listing Responsibilities
              </h3>
              <p style="margin-bottom:1rem;">
                Realtors, developers, and private property owners listing houses, plots, or commercial spaces on Sarmayadar must ensure all details (Marla/Kanal area, demand price, allotment status, DHA/Bahria NOC) are accurate and non-misleading. Sarmayadar reserves the right to suspend or remove fake listings or fraudulent dealer accounts.
              </p>

              <h3 style="color:#0F172A; font-family:var(--font-display); font-size:1.1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;">
                ${renderIcon('dollar-sign', 16, '#239C32')} 3. Valuation & Financial Tools Disclaimer
              </h3>
              <p style="margin-bottom:1rem;">
                Land unit conversions, bank home mortgage calculators, and property valuation estimates provided on Sarmayadar are for informational purposes only. Official transactions require verification with relevant society offices (e.g. DHA, CDA, LDA, KDA) and legal conveyancing counsel.
              </p>

              <h3 style="color:#0F172A; font-family:var(--font-display); font-size:1.1rem; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px;">
                ${renderIcon('copyright', 16, '#239C32')} 4. Intellectual Property
              </h3>
              <p style="margin-bottom:1rem;">
                All brand logos, proprietary AI search algorithms, design tokens, and media content on Sarmayadar are copyrighted. Unauthorized scraping or replication of property database listings is prohibited.
              </p>

              <div style="background:#F0FDF4; border-left:4px solid #239C32; padding:1rem; border-radius:8px; margin-top:1.5rem;">
                <strong>Legal Inquiries & Corporate Contact</strong><br/>
                Head office 99 Westwood colony, Thoker, Lahore.<br/>
                Email: <a href="mailto:contact@sarmayadar.com" style="color:#239C32; font-weight:700;">contact@sarmayadar.com</a> | Phone: <strong>+92 332 7507866</strong>.
              </div>
            </div>
          `}
        </div>

        <!-- Modal Footer -->
        <div style="
          padding: 1rem 1.75rem;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
          display: flex;
          justify-content: flex-end;
        ">
          <button type="button" id="close-legal-modal-btn-bottom" class="btn" style="
            background: #239C32;
            color: #FFFFFF;
            font-weight: 700;
            padding: 8px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
          ">
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  `;
}
