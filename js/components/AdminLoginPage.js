import { renderIcon } from '../utils/icons.js';

export function renderAdminLoginPage(state) {
  const isLoggedIn = state.user && state.user.role === 'ADMIN';

  return `
    <div class="admin-login-page-wrapper" style="min-height: 85vh; background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #064E3B 100%); display: flex; align-items: center; justify-content: center; padding: 2.5rem 1rem;">
      <div style="width: 100%; max-width: 480px; background: #ffffff; border-radius: 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.5); overflow: hidden; border: 3px solid #059669;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #064E3B, #022C22); color: #ffffff; padding: 2rem 1.75rem; text-align: center; border-bottom: 4px solid #F59E0B; position: relative;">
          <div style="width: 64px; height: 64px; background: #F59E0B; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);">
            ${renderIcon('shield-check', 36, '#064E3B')}
          </div>

          <span style="display: block; font-family: var(--font-mono, monospace); font-size: 0.72rem; font-weight: 800; color: #F59E0B; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
            🛡️ EXECUTIVE SECURITY GATEWAY
          </span>
          <h2 style="font-family: var(--font-heading, sans-serif); font-size: 1.5rem; font-weight: 800; color: #ffffff; margin: 0;">
            Sarmayadar Admin Portal
          </h2>
          <p style="color: #A7F3D0; font-size: 0.85rem; margin-top: 6px; margin-bottom: 0; opacity: 0.9;">
            Authorized Administrator Access Only
          </p>
        </div>

        <!-- Form Body -->
        <div style="padding: 2rem 1.75rem; background: #ffffff;">
          ${isLoggedIn ? `
            <div style="text-align: center; padding: 1.5rem 0;">
              <div style="width: 56px; height: 56px; background: #D1FAE5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                ${renderIcon('check-circle', 32, '#059669')}
              </div>
              <h4 style="font-size: 1.2rem; font-weight: 800; color: #0F172A; margin-bottom: 0.5rem;">
                Welcome, ${state.user.name}!
              </h4>
              <p style="color: #475569; font-size: 0.9rem; margin-bottom: 1.5rem;">
                You are currently authenticated as <strong>System Administrator</strong>.
              </p>

              <button type="button" id="launch-admin-dashboard-btn" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; font-weight: 800; border-radius: 10px; background: #059669; border: none; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4); cursor: pointer;">
                🚀 Open Admin Control Center
              </button>
            </div>
          ` : `
            <form id="admin-page-login-form">
              <div style="background: #ECFDF5; border-left: 4px solid #059669; padding: 0.85rem 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.85rem; color: #064E3B; line-height: 1.5;">
                🔒 Please enter your registered <strong>System Administrator</strong> email address and security password to manage dealers, verify listings, and access CRM controls.
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display: block; font-family: var(--font-mono, monospace); font-size: 0.75rem; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
                  Admin Email Address *
                </label>
                <div style="position: relative;">
                  <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #64748B;">
                    ${renderIcon('mail', 16, '#64748B')}
                  </span>
                  <input type="email" 
                         id="admin-page-email" 
                         class="form-control" 
                         placeholder="e.g. admin@sarmayadar.com" 
                         value="${state.authPreFillEmail || ''}"
                         style="width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.4rem; border: 2px solid #CBD5E1; border-radius: 10px; font-weight: 700; font-size: 0.92rem;" 
                         required />
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 1.75rem;">
                <label style="display: block; font-family: var(--font-mono, monospace); font-size: 0.75rem; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
                  Security Password *
                </label>
                <div class="password-field-wrapper" style="position: relative; display: flex; align-items: center;">
                  <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #64748B; z-index: 2;">
                    ${renderIcon('lock', 16, '#64748B')}
                  </span>
                  <input type="password" 
                         id="admin-page-password" 
                         class="form-control" 
                         placeholder="Enter admin password" 
                         style="width: 100%; padding: 0.75rem 44px 0.75rem 2.4rem; border: 2px solid #CBD5E1; border-radius: 10px; font-weight: 700; font-size: 0.92rem;" 
                         required />
                  <button type="button" class="pwd-toggle-btn" title="Show/Hide Password" style="position: absolute; right: 8px; background: none; border: none; color: #64748B; opacity: 0.85; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; z-index: 2; transition: transform 0.2s ease, opacity 0.2s ease;">
                    ${renderIcon('eye', 18, '#64748B')}
                  </button>
                </div>
              </div>

              <button type="submit" 
                      id="admin-page-submit-btn" 
                      style="width: 100%; padding: 0.95rem; background: linear-gradient(135deg, #059669, #047857); color: #ffffff; font-weight: 800; font-size: 1rem; border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease;">
                ${renderIcon('shield-check', 18, '#ffffff')}
                <span>Authorize & Launch Admin Portal</span>
              </button>
            </form>
          `}

          <div style="margin-top: 1.75rem; pt-3; border-top: 1px solid #E2E8F0; text-align: center;">
            <p style="font-family: var(--font-mono, monospace); font-size: 0.72rem; color: #64748B; margin-bottom: 0.5rem;">
              🔐 256-Bit SSL Encrypted Admin Portal • IP Monitored
            </p>
            <a href="#buy" style="color: #059669; font-weight: 700; font-size: 0.82rem; text-decoration: none;">
              ← Return to Main Portal
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
}
