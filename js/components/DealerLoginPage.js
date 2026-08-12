import { renderIcon } from '../utils/icons.js';

export function renderDealerLoginPage(state) {
  const isLoggedInDealer = state.user && state.user.role === 'DEALER';

  return `
    <div class="dealer-login-page-wrapper" style="min-height: 85vh; background: linear-gradient(135deg, #064E3B 0%, #0F172A 100%); display: flex; align-items: center; justify-content: center; padding: 2.5rem 1rem;">
      <div style="width: 100%; max-width: 480px; background: #ffffff; border-radius: 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.4); overflow: hidden; border: 2px solid #A7F3D0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669, #047857); color: #ffffff; padding: 2rem 1.75rem; text-align: center; position: relative;">
          <div style="width: 64px; height: 64px; background: #ffffff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
            ${renderIcon('building-2', 34, '#059669')}
          </div>

          <span style="display: block; font-family: var(--font-mono, monospace); font-size: 0.72rem; font-weight: 800; color: #FDE047; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
            🏢 VERIFIED DEALER PORTAL
          </span>
          <h2 style="font-family: var(--font-heading, sans-serif); font-size: 1.5rem; font-weight: 800; color: #ffffff; margin: 0;">
            Dealer Login
          </h2>
          <p style="color: #ECFDF5; font-size: 0.85rem; margin-top: 6px; margin-bottom: 0; opacity: 0.95;">
            Access your ProFolio Agency Dashboard & Property Management
          </p>
        </div>

        <!-- Form Body -->
        <div style="padding: 2rem 1.75rem; background: #ffffff;">
          ${isLoggedInDealer ? `
            <div style="text-align: center; padding: 1.5rem 0;">
              <div style="width: 56px; height: 56px; background: #D1FAE5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                ${renderIcon('check-circle', 32, '#059669')}
              </div>
              <h4 style="font-size: 1.2rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">
                Welcome Back, ${state.user.name}!
              </h4>
              <p style="color: #475569; font-size: 0.9rem; margin-bottom: 1.5rem;">
                Agency: <strong>${state.user.agencyName || state.user.name}</strong>
              </p>

              <button type="button" id="launch-dealer-dashboard-btn" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; font-weight: 800; border-radius: 10px; background: #059669; border: none; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4); cursor: pointer;">
                📊 Open Dealer Dashboard
              </button>
            </div>
          ` : `
            <form id="dealer-page-login-form">
              <div style="background: #ECFDF5; border-left: 4px solid #059669; padding: 0.85rem 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.85rem; color: #064E3B; line-height: 1.5;">
                💼 Welcome! Sign in with your registered <strong>Dealer Account</strong> credentials to manage property listings, lead inquiries, and subscription quotas.
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-family: var(--font-mono, monospace); font-size: 0.75rem; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
                  Dealer Email Address *
                </label>
                <div style="position: relative;">
                  <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #64748B;">
                    ${renderIcon('mail', 16, '#64748B')}
                  </span>
                  <input type="email" 
                         id="dealer-page-email" 
                         class="form-control" 
                         placeholder="e.g. dealer@agency.com" 
                         value="${state.authPreFillEmail || ''}"
                         style="width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.4rem; border: 2px solid #CBD5E1; border-radius: 10px; font-weight: 700; font-size: 0.92rem;" 
                         required />
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 1.75rem;">
                <label style="display: block; font-family: var(--font-mono, monospace); font-size: 0.75rem; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
                  Password *
                </label>
                <div class="password-field-wrapper" style="position: relative; display: flex; align-items: center;">
                  <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #64748B; z-index: 2;">
                    ${renderIcon('lock', 16, '#64748B')}
                  </span>
                  <input type="password" 
                         id="dealer-page-password" 
                         class="form-control" 
                         placeholder="Enter your password" 
                         style="width: 100%; padding: 0.75rem 44px 0.75rem 2.4rem; border: 2px solid #CBD5E1; border-radius: 10px; font-weight: 700; font-size: 0.92rem;" 
                         required />
                  <button type="button" class="pwd-toggle-btn" title="Show/Hide Password" style="position: absolute; right: 8px; background: none; border: none; color: #64748B; opacity: 0.85; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; z-index: 2; transition: transform 0.2s ease, opacity 0.2s ease;">
                    ${renderIcon('eye', 18, '#64748B')}
                  </button>
                </div>
              </div>

              <button type="submit" 
                      id="dealer-page-submit-btn" 
                      style="width: 100%; padding: 0.95rem; background: linear-gradient(135deg, #059669, #047857); color: #ffffff; font-weight: 800; font-size: 1rem; border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease;">
                ${renderIcon('log-in', 18, '#ffffff')}
                <span>Sign In to Dealer Portal</span>
              </button>
            </form>
          `}

          <div style="margin-top: 1.75rem; pt-3; border-top: 1px solid #E2E8F0; text-align: center; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
            <a href="#register" style="color: #059669; font-weight: 700; text-decoration: none;">
              Register New Agency →
            </a>
            <a href="#admin-login" style="color: #64748B; font-weight: 700; text-decoration: none;">
              🛡️ Admin Access
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
}
