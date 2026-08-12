import { renderIcon } from '../utils/icons.js';

export function renderAuthPage(type, state) {
  const isRegister = type === 'register';

  return `
    <div class="auth-page-wrapper" style="min-height: 85vh; background: linear-gradient(135deg, var(--forest-dk) 0%, #1A2E12 50%, var(--forest) 100%); display: flex; align-items: center; justify-content: center; padding: 2.5rem 1rem;">
      <div style="width: 100%; max-width: 480px; background: var(--paper); border-radius: 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.5); overflow: hidden; border: 3px solid var(--marigold);">
        
        <!-- Header -->
        <div style="background: var(--forest-dk); color: var(--paper); padding: 2rem 1.75rem; text-align: center; border-bottom: 4px solid var(--marigold);">
          <div style="width: 60px; height: 60px; background: var(--cream); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem; border: 2px solid var(--marigold);">
            ${renderIcon(isRegister ? 'user-plus' : 'log-in', 30, 'var(--forest-dk)')}
          </div>

          <span style="display: block; font-family: var(--font-mono); font-size: 0.72rem; font-weight: 800; color: var(--marigold); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
            🔑 SARMAYADAR PORTAL ACCESS
          </span>
          <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--paper); margin: 0;">
            ${isRegister ? 'Register Agency Account' : 'Dealer & Client Sign In'}
          </h2>
          <p style="color: var(--cream); opacity: 0.88; font-size: 0.85rem; margin-top: 6px; margin-bottom: 0;">
            ${isRegister ? 'Create your free portal account to post and manage listings.' : 'Sign in to access dealer CRM, lead inbox, and saved properties.'}
          </p>
        </div>

        <!-- Body Form -->
        <div style="padding: 2rem 1.75rem; background: var(--paper);">
          
          <!-- Mode Switcher -->
          <div style="display: flex; border-bottom: 2px solid var(--border-dk); margin-bottom: 1.5rem;">
            <button type="button" id="toggle-login-mode-btn" style="flex: 1; padding: 0.65rem; background: none; border: none; font-family: var(--font-body); font-weight: 800; font-size: 0.9rem; color: ${!isRegister ? 'var(--rani-dk)' : 'var(--forest)'}; border-bottom: 3px solid ${!isRegister ? 'var(--rani)' : 'transparent'}; cursor: pointer; transition: all 0.2s;">
              ${renderIcon('log-in', 14)} Sign In
            </button>
            <button type="button" id="toggle-signup-mode-btn" style="flex: 1; padding: 0.65rem; background: none; border: none; font-family: var(--font-body); font-weight: 800; font-size: 0.9rem; color: ${isRegister ? 'var(--rani-dk)' : 'var(--forest)'}; border-bottom: 3px solid ${isRegister ? 'var(--rani)' : 'transparent'}; cursor: pointer; transition: all 0.2s;">
              ${renderIcon('user-plus', 14)} Register Account
            </button>
          </div>

          <form id="auth-page-native-form">
            ${isRegister ? `
              <div class="form-group" style="margin-bottom: 1.1rem;">
                <label style="display: block; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase; margin-bottom: 0.4rem;">
                  Full Name / Agency Name *
                </label>
                <input type="text" id="auth-page-fullname" class="form-control" placeholder="e.g. Apex Real Estate Agency" style="padding: 0.75rem; font-weight: 700;" required />
              </div>

              <div class="form-group" style="margin-bottom: 1.1rem;">
                <label style="display: block; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase; margin-bottom: 0.4rem;">
                  Mobile / WhatsApp Number *
                </label>
                <input type="tel" id="auth-page-phone" class="form-control" placeholder="+92 300 1234567" style="padding: 0.75rem; font-weight: 700;" required />
              </div>
            ` : ''}

            <div class="form-group" style="margin-bottom: 1.1rem;">
              <label style="display: block; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase; margin-bottom: 0.4rem;">
                Registered Email Address *
              </label>
              <input type="email" id="auth-page-email" class="form-control" placeholder="e.g. dealer@agency.com" value="${state.authPreFillEmail || ''}" style="padding: 0.75rem; font-weight: 700;" required />
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="display: block; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase; margin-bottom: 0.4rem;">
                Password *
              </label>
              <div class="password-field-wrapper" style="position: relative; display: flex; align-items: center;">
                <input type="password" id="auth-page-password" class="form-control" placeholder="Enter password" style="padding: 0.75rem; padding-right: 44px; font-weight: 700; width: 100%;" required />
                <button type="button" class="pwd-toggle-btn" title="Show/Hide Password" style="position: absolute; right: 8px; background: none; border: none; color: var(--forest-dk); opacity: 0.75; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, opacity 0.2s ease;">
                  ${renderIcon('eye', 18, 'var(--forest-dk)')}
                </button>
              </div>
            </div>

            <button type="submit" id="auth-page-submit-btn" class="btn btn-primary" style="width: 100%; padding: 0.9rem; font-weight: 800; font-size: 1rem; border-radius: 10px; box-shadow: var(--shadow-md);">
              ${isRegister ? '📝 Create Free Portal Account' : '🔓 Sign In to Dashboard'}
            </button>
          </form>

          <div style="margin-top: 1.5rem; text-align: center; pt-3; border-top: 1px solid var(--border-dk);">
            <a href="#buy" style="color: var(--forest-dk); font-weight: 700; font-size: 0.85rem; text-decoration: none;">
              ← Return to Home Page
            </a>
          </div>

        </div>

      </div>
    </div>
  `;
}
