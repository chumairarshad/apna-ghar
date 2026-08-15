import { renderIcon } from '../utils/icons.js';
import { t } from '../utils/i18n.js';
import { renderGoogleAuthButton } from '../utils/googleAuth.js';

export function renderAuthModal(state) {
  const isVisible = state.showAuthModal || false;
  const authMode = state.authMode || 'login';
  const isForgot = authMode === 'forgot';
  const isRegister = (authMode === 'signup' || authMode === 'register') && !isForgot;
  const selectedRole = state.authRole || 'DEALER'; // 'DEALER' | 'ADMIN'

  const roleIcon = selectedRole === 'ADMIN' ? 'shield-check' : 'briefcase';
  const roleBadgeBg = selectedRole === 'ADMIN' ? 'var(--rani)' : 'var(--forest-dk)';
  const roleBadgeColor = selectedRole === 'ADMIN' ? 'var(--paper)' : 'var(--marigold)';

  let titleText = t('auth_login_title', 'Portal Sign In');
  if (isRegister) titleText = t('auth_register_title', 'Register Portal Account');
  if (isForgot) titleText = t('dash_password', 'Reset Account Password');

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="auth-modal-overlay">
      <div class="modal-container" style="max-width: 490px; border-radius: 16px; border: 3px solid var(--forest-dk); overflow: hidden;">
        
        <!-- Premium Modal Header -->
        <div class="modal-header" style="background: var(--forest-dk); color: var(--paper); padding: 1.25rem 1.5rem; border-bottom: 3px solid var(--marigold);">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge" style="background: ${roleBadgeBg}; color: ${roleBadgeColor}; font-size: 0.7rem; padding: 4px 10px;">
                ${renderIcon(roleIcon, 13, roleBadgeColor)} ${selectedRole} ACCESS
              </span>
            </div>
            <h3 class="modal-title" style="color: var(--paper); font-size: 1.25rem; margin-top: 6px;">
              ${titleText}
            </h3>
          </div>
          <button class="close-modal-btn" id="close-auth-btn" style="color: var(--paper); background: rgba(255,255,255,0.1); width: 36px; height: 36px;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; background: var(--paper);">

          ${!isForgot ? `
            <!-- Auth Mode Toggle (Login vs Register) -->
            <div style="display: flex; border-bottom: 2px solid var(--border-dk); margin-bottom: 1.25rem;">
              <button type="button" id="toggle-login-mode-btn" style="flex: 1; padding: 0.65rem; border: none; background: none; font-family: var(--font-body); font-weight: 700; font-size: 0.9rem; color: ${!isRegister ? 'var(--rani-dk)' : 'var(--forest)'}; border-bottom: 3px solid ${!isRegister ? 'var(--rani)' : 'transparent'}; cursor: pointer; transition: all 0.2s;">
                ${renderIcon('log-in', 14)} ${t('nav_login', 'Sign In')}
              </button>
              <button type="button" id="toggle-signup-mode-btn" style="flex: 1; padding: 0.65rem; border: none; background: none; font-family: var(--font-body); font-weight: 700; font-size: 0.9rem; color: ${isRegister ? 'var(--rani-dk)' : 'var(--forest)'}; border-bottom: 3px solid ${isRegister ? 'var(--rani)' : 'transparent'}; cursor: pointer; transition: all 0.2s;">
                ${renderIcon('user-plus', 14)} ${t('btn_submit_register', 'Register')}
              </button>
            </div>

            <!-- Modern Google Sign-In Integration -->
            ${renderGoogleAuthButton(isRegister ? 'Sign up with Google' : 'Continue with Google', 'modal-google-auth-btn')}
          ` : ''}

          ${isForgot ? `
            <!-- FORGOT PASSWORD FORM -->
            <form id="forgot-password-form">
              <div style="background: var(--cream); border-left: 4px solid var(--rani); padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; color: var(--forest-dk);">
                🔑 Enter your registered email address and your new password to reset your account credentials.
              </div>

              <div class="form-group" style="margin-bottom: 1rem;">
                <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">
                  ${t('email_label', 'Registered Email Address')} *
                </label>
                <input type="email" id="auth-forgot-email-input" class="form-control" placeholder="${selectedRole === 'ADMIN' ? 'admin@sarmayadar.com' : 'dealer@agency.com'}" value="${state.authPreFillEmail || ''}" required />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">${t('new_password', 'New Password')} *</label>
                <div class="password-field-wrapper" style="position: relative; display: flex; align-items: center;">
                  <input type="password" id="auth-forgot-password-input" class="form-control" placeholder="Minimum 6 characters" style="padding-right: 44px; width: 100%;" required />
                  <button type="button" class="pwd-toggle-btn" title="Show/Hide Password" style="position: absolute; right: 8px; background: none; border: none; color: var(--forest-dk); opacity: 0.75; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, opacity 0.2s ease;">
                    ${renderIcon('eye', 18, 'var(--forest-dk)')}
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary" id="auth-forgot-submit-btn" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; font-weight: 800; border-radius: 8px; box-shadow: var(--shadow-md); margin-bottom: 1rem;">
                🔑 ${t('update_password_btn', 'Reset Password & Save')}
              </button>

              <div style="text-align: center;">
                <button type="button" id="toggle-login-mode-btn" style="background: none; border: none; color: var(--rani-dk); font-weight: 700; font-size: 0.85rem; cursor: pointer; text-decoration: underline;">
                  ← ${t('nav_login', 'Back to Sign In')}
                </button>
              </div>
            </form>
          ` : `
            <!-- LOGIN / REGISTER FORM -->
            <form id="email-auth-form">
              ${isRegister ? `
                <div class="form-group" style="margin-bottom: 1rem;">
                  <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">${t('full_name_label', 'Full Name / Agency Name')} *</label>
                  <input type="text" id="auth-full-name" class="form-control" placeholder="${selectedRole === 'ADMIN' ? 'e.g. System Administrator' : 'e.g. Apex Real Estate Agency'}" value="${state.authPreFillName || ''}" required />
                </div>
                <div class="form-group" style="margin-bottom: 1rem;">
                  <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">${t('phone_label', 'Mobile Phone (+92)')} *</label>
                  <input type="tel" id="auth-phone-num" class="form-control" placeholder="+92 300 1234567" value="${state.authPreFillPhone || ''}" required />
                </div>
              ` : ''}

              <div class="form-group" style="margin-bottom: 1rem;">
                <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">
                  ${t('email_label', 'Email Address')} *
                </label>
                <input type="email" id="auth-email-input" class="form-control" placeholder="${selectedRole === 'ADMIN' ? 'admin@sarmayadar.com' : 'dealer@agency.com'}" value="${state.authPreFillEmail || ''}" required />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">${t('password_label', 'Password')} *</label>
                  ${!isRegister ? `
                    <button type="button" id="toggle-forgot-mode-btn" style="background: none; border: none; color: var(--rani); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0;">
                      ${t('dash_password', 'Forgot Password?')}
                    </button>
                  ` : ''}
                </div>
                <div class="password-field-wrapper" style="position: relative; display: flex; align-items: center;">
                  <input type="password" id="auth-password-input" class="form-control" placeholder="••••••••" value="" style="padding-right: 44px; width: 100%;" required />
                  <button type="button" class="pwd-toggle-btn" title="Show/Hide Password" style="position: absolute; right: 8px; background: none; border: none; color: var(--forest-dk); opacity: 0.75; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, opacity 0.2s ease;">
                    ${renderIcon('eye', 18, 'var(--forest-dk)')}
                  </button>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                  <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--forest); opacity: 0.85;">
                    🔒 48-Hour Secure JWT Session
                  </span>
                </div>
              </div>

              <button type="submit" class="btn btn-primary" id="auth-submit-btn" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; font-weight: 800; border-radius: 8px; box-shadow: var(--shadow-md);">
                ${isRegister ? `🚀 ${t('btn_submit_register', 'Register')} as ${selectedRole}` : `🔓 ${t('btn_submit_login', 'Sign In')} as ${selectedRole}`}
              </button>
            </form>
          `}

        </div>
      </div>
    </div>
  `;
}
