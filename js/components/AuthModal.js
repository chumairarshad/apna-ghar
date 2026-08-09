export function renderAuthModal(state) {
  const isVisible = state.showAuthModal || false;
  const authMode = state.authMode || (state.authIsSignup ? 'signup' : 'login'); // 'login' | 'signup' | 'forgot'
  const isSignup = authMode === 'signup';
  const isForgot = authMode === 'forgot';
  const selectedRole = state.authRole || 'DEALER'; // 'DEALER' | 'ADMIN'

  const roleIcon = selectedRole === 'ADMIN' ? 'shield-check' : 'briefcase';
  const roleBadgeBg = selectedRole === 'ADMIN' ? 'var(--rani)' : 'var(--forest-dk)';
  const roleBadgeColor = selectedRole === 'ADMIN' ? 'var(--paper)' : 'var(--marigold)';

  let titleText = 'Portal Sign In';
  if (isSignup) titleText = 'Register Portal Account';
  if (isForgot) titleText = 'Reset Account Password';

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="auth-modal-overlay">
      <div class="modal-container" style="max-width: 490px; border-radius: 16px; border: 3px solid var(--forest-dk); overflow: hidden;">
        
        <!-- Premium Modal Header -->
        <div class="modal-header" style="background: var(--forest-dk); color: var(--paper); padding: 1.25rem 1.5rem; border-bottom: 3px solid var(--marigold);">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge" style="background: ${roleBadgeBg}; color: ${roleBadgeColor}; font-size: 0.7rem; padding: 4px 10px;">
                <i data-lucide="${roleIcon}" style="width: 13px; height: 13px;"></i> ${selectedRole} ACCESS
              </span>
            </div>
            <h3 class="modal-title" style="color: var(--paper); font-size: 1.25rem; margin-top: 6px;">
              ${titleText}
            </h3>
          </div>
          <button class="close-modal-btn" id="close-auth-btn" style="color: var(--paper); background: rgba(255,255,255,0.1); width: 36px; height: 36px;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; background: var(--paper);">
          
          <!-- Role Selection Tabs (Dealer vs Admin ONLY) -->
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--font-mono); font-weight: 700; font-size: 0.75rem; color: var(--forest-dk); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem; display: block;">
              Select Access Portal
            </label>
            <div style="display: flex; gap: 0.5rem; background: var(--cream); padding: 5px; border-radius: 10px; border: 2px solid var(--border-dk);">
              <button type="button" class="btn btn-sm auth-role-select-btn ${selectedRole === 'DEALER' ? 'btn-dark active' : 'btn-ghost'}" data-role="DEALER" style="flex: 1; font-weight: 700; border-radius: 6px; font-size: 0.85rem;">
                <i data-lucide="building-2" style="width: 15px; height: 15px; color: var(--marigold);"></i> Dealer Login
              </button>
              <button type="button" class="btn btn-sm auth-role-select-btn ${selectedRole === 'ADMIN' ? 'btn-dark active' : 'btn-ghost'}" data-role="ADMIN" style="flex: 1; font-weight: 700; border-radius: 6px; font-size: 0.85rem;">
                <i data-lucide="shield-check" style="width: 15px; height: 15px; color: var(--rani);"></i> Admin Login
              </button>
            </div>
          </div>

          ${!isForgot ? `
            <!-- Auth Mode Toggle (Login vs Signup) -->
            <div style="display: flex; border-bottom: 2px solid var(--border-dk); margin-bottom: 1.25rem;">
              <button type="button" id="toggle-login-mode-btn" style="flex: 1; padding: 0.65rem; border: none; background: none; font-family: var(--font-body); font-weight: 700; font-size: 0.9rem; color: ${!isSignup ? 'var(--rani-dk)' : 'var(--forest)'}; border-bottom: 3px solid ${!isSignup ? 'var(--rani)' : 'transparent'}; cursor: pointer; transition: all 0.2s;">
                <i data-lucide="log-in" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i> Sign In
              </button>
              <button type="button" id="toggle-signup-mode-btn" style="flex: 1; padding: 0.65rem; border: none; background: none; font-family: var(--font-body); font-weight: 700; font-size: 0.9rem; color: ${isSignup ? 'var(--rani-dk)' : 'var(--forest)'}; border-bottom: 3px solid ${isSignup ? 'var(--rani)' : 'transparent'}; cursor: pointer; transition: all 0.2s;">
                <i data-lucide="user-plus" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i> Create Account
              </button>
            </div>
          ` : ''}

          ${isForgot ? `
            <!-- FORGOT PASSWORD FORM -->
            <form id="forgot-password-form">
              <div style="background: var(--cream); border-left: 4px solid var(--rani); padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; color: var(--forest-dk);">
                🔑 Enter your registered email address and your new password to reset your account credentials.
              </div>

              <div class="form-group" style="margin-bottom: 1rem;">
                <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">
                  Registered Email Address *
                </label>
                <input type="email" id="auth-forgot-email-input" class="form-control" placeholder="${selectedRole === 'ADMIN' ? 'admin@Sarmayadar.pk' : 'dealer@agency.com'}" value="${state.authPreFillEmail || ''}" required />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">New Password *</label>
                <input type="password" id="auth-forgot-password-input" class="form-control" placeholder="Minimum 6 characters" required />
              </div>

              <button type="submit" class="btn btn-primary" id="auth-forgot-submit-btn" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; font-weight: 800; border-radius: 8px; box-shadow: var(--shadow-md); margin-bottom: 1rem;">
                🔑 Reset Password & Save
              </button>

              <div style="text-align: center;">
                <button type="button" id="toggle-login-mode-btn" style="background: none; border: none; color: var(--rani-dk); font-weight: 700; font-size: 0.85rem; cursor: pointer; text-decoration: underline;">
                  ← Back to Sign In
                </button>
              </div>
            </form>
          ` : `
            <!-- LOGIN / SIGNUP FORM -->
            <form id="email-auth-form">
              ${isSignup ? `
                <div class="form-group" style="margin-bottom: 1rem;">
                  <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">Full Name / Agency Name *</label>
                  <input type="text" id="auth-full-name" class="form-control" placeholder="${selectedRole === 'ADMIN' ? 'e.g. System Administrator' : 'e.g. Apex Real Estate Agency'}" value="" required />
                </div>
                <div class="form-group" style="margin-bottom: 1rem;">
                  <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">Mobile Phone (+92) *</label>
                  <input type="text" id="auth-phone-num" class="form-control" placeholder="+92 300 1234567" value="" required />
                </div>
              ` : ''}

              <div class="form-group" style="margin-bottom: 1rem;">
                <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">
                  ${selectedRole === 'ADMIN' ? 'Admin Email Address' : 'Dealer / Agency Email'} *
                </label>
                <input type="email" id="auth-email-input" class="form-control" placeholder="${selectedRole === 'ADMIN' ? 'admin@Sarmayadar.pk' : 'dealer@agency.com'}" value="${state.authPreFillEmail || ''}" required />
              </div>

              <div class="form-group" style="margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <label style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--forest-dk); text-transform: uppercase;">Password *</label>
                  ${!isSignup ? `
                    <button type="button" id="toggle-forgot-mode-btn" style="background: none; border: none; color: var(--rani); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0;">
                      Forgot Password?
                    </button>
                  ` : ''}
                </div>
                <input type="password" id="auth-password-input" class="form-control" placeholder="••••••••" value="" required />
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                  <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--forest); opacity: 0.85;">
                    🔒 48-Hour Secure JWT Session
                  </span>
                </div>
              </div>

              <button type="submit" class="btn btn-primary" id="auth-submit-btn" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; font-weight: 800; border-radius: 8px; box-shadow: var(--shadow-md);">
                ${isSignup ? `🚀 Register as ${selectedRole}` : `🔓 Sign In as ${selectedRole}`}
              </button>
            </form>
          `}

        </div>
      </div>
    </div>
  `;
}
