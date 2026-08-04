export function renderAuthModal(state) {
  const isVisible = state.showAuthModal || false;
  const authMethod = state.authMethod || 'google'; // google | phone | email
  const phoneStep = state.phoneStep || 1; // 1: enter number, 2: enter OTP
  const tempPhone = state.tempPhone || '+92 300 8472910';

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="auth-modal-overlay">
      <div class="modal-container" style="max-width:460px;">
        <div class="modal-header">
          <h3 class="modal-title">Sign In to Apna Ghar</h3>
          <button class="close-modal-btn" id="close-auth-btn">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Account Role Selector -->
          <div class="form-group" style="margin-bottom:1.25rem;">
            <label>Account Type</label>
            <div class="auth-role-container">
              <button type="button" class="btn btn-dark btn-sm auth-role-btn active" data-role="dealer" style="flex:1;">
                Verified Dealer / Agency
              </button>
              <button type="button" class="btn btn-ghost btn-sm auth-role-btn" data-role="buyer" style="flex:1;">
                Individual Buyer / Tenant
              </button>
            </div>
          </div>

          <!-- Auth Method Tabs -->
          <div style="display:flex; gap:0.35rem; background:var(--cream); padding:4px; border-radius:6px; border:1.5px solid var(--border-dk); margin-bottom:1.25rem;">
            <button type="button" class="auth-method-tab ${authMethod === 'google' ? 'active' : ''}" data-method="google" style="flex:1; padding:8px 4px; font-size:0.78rem; font-weight:700; border:none; border-radius:4px; cursor:pointer;">
              Google
            </button>
            <button type="button" class="auth-method-tab ${authMethod === 'phone' ? 'active' : ''}" data-method="phone" style="flex:1; padding:8px 4px; font-size:0.78rem; font-weight:700; border:none; border-radius:4px; cursor:pointer;">
              Phone OTP
            </button>
            <button type="button" class="auth-method-tab ${authMethod === 'email' ? 'active' : ''}" data-method="email" style="flex:1; padding:8px 4px; font-size:0.78rem; font-weight:700; border:none; border-radius:4px; cursor:pointer;">
              Email
            </button>
          </div>

          ${authMethod === 'google' ? renderGoogleSection() : ''}
          ${authMethod === 'phone' ? renderPhoneOTPSection(phoneStep, tempPhone) : ''}
          ${authMethod === 'email' ? renderEmailSection() : ''}
        </div>
      </div>
    </div>
  `;
}

function renderGoogleSection() {
  return `
    <button type="button" class="btn" id="google-signin-btn" style="width:100%; background:white; color:#374151; border:2px solid var(--border-dk); box-shadow:var(--shadow-sm); padding:0.85rem 1rem; margin-bottom:1rem; font-weight:700; font-size:0.92rem; display:flex; align-items:center; justify-content:center; gap:0.75rem;">
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
    <p style="font-size:0.75rem; color:var(--forest); opacity:0.75; text-align:center;">Instant 1-Click Authentication using your Google Account.</p>
  `;
}

function renderPhoneOTPSection(step, phone) {
  if (step === 1) {
    return `
      <div class="form-group">
        <label>Enter Mobile Phone Number (Pakistan)</label>
        <input type="text" id="phone-number-input" class="form-control" value="${phone}" placeholder="+92 300 1234567" required />
        <span style="font-size:0.73rem; color:var(--forest); opacity:0.75; margin-top:4px;">We will send a 6-digit verification code via SMS to this number.</span>
      </div>

      <button type="button" class="btn btn-primary" id="send-otp-btn" style="width:100%; margin-top:0.75rem;">
        <i data-lucide="message-square" style="width:18px; height:18px;"></i> Send Verification Code
      </button>
    `;
  }

  return `
    <div style="text-align:center; margin-bottom:1.25rem;">
      <div style="width:3.5rem; height:3.5rem; background:var(--cream); border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:0.75rem; border:2px solid var(--forest-dk);">
        <i data-lucide="shield-check" style="width:24px; height:24px; color:var(--rani);"></i>
      </div>
      <h4 style="font-size:1.05rem; margin-bottom:0.25rem;">Enter 6-Digit SMS Code</h4>
      <p style="font-size:0.8rem; color:var(--forest); opacity:0.8;">Verification code sent to <strong>${phone}</strong></p>
    </div>

    <!-- 6 Digit OTP Inputs Responsive -->
    <div style="display:flex; gap:0.35rem; justify-content:center; margin-bottom:1.25rem;">
      <input type="text" class="otp-digit" maxlength="1" value="4" style="width:38px; height:44px; text-align:center; font-family:var(--font-mono); font-size:1.1rem; font-weight:700; border:2px solid var(--forest-dk); border-radius:6px; background:var(--cream);" />
      <input type="text" class="otp-digit" maxlength="1" value="8" style="width:38px; height:44px; text-align:center; font-family:var(--font-mono); font-size:1.1rem; font-weight:700; border:2px solid var(--forest-dk); border-radius:6px; background:var(--cream);" />
      <input type="text" class="otp-digit" maxlength="1" value="2" style="width:38px; height:44px; text-align:center; font-family:var(--font-mono); font-size:1.1rem; font-weight:700; border:2px solid var(--forest-dk); border-radius:6px; background:var(--cream);" />
      <input type="text" class="otp-digit" maxlength="1" value="9" style="width:38px; height:44px; text-align:center; font-family:var(--font-mono); font-size:1.1rem; font-weight:700; border:2px solid var(--forest-dk); border-radius:6px; background:var(--cream);" />
      <input type="text" class="otp-digit" maxlength="1" value="1" style="width:38px; height:44px; text-align:center; font-family:var(--font-mono); font-size:1.1rem; font-weight:700; border:2px solid var(--forest-dk); border-radius:6px; background:var(--cream);" />
      <input type="text" class="otp-digit" maxlength="1" value="0" style="width:38px; height:44px; text-align:center; font-family:var(--font-mono); font-size:1.1rem; font-weight:700; border:2px solid var(--forest-dk); border-radius:6px; background:var(--cream);" />
    </div>

    <button type="button" class="btn btn-primary" id="verify-otp-btn" style="width:100%;">
      Verify Code & Sign In
    </button>

    <div style="text-align:center; margin-top:0.85rem;">
      <button type="button" id="change-phone-btn" style="background:none; border:none; color:var(--rani-dk); font-size:0.78rem; font-weight:700; text-decoration:underline;">
        Change phone number
      </button>
    </div>
  `;
}

function renderEmailSection() {
  return `
    <form id="auth-form">
      <div class="form-group">
        <label>Full Name / Agency Name</label>
        <input type="text" id="auth-name" class="form-control" placeholder="e.g. Chaudhry Kamran" value="Chaudhry Kamran" required />
      </div>

      <div class="form-group">
        <label>Email Address</label>
        <input type="email" id="auth-email" class="form-control" placeholder="dealer@apnaghar.pk" value="kamran@apnaghar.pk" required />
      </div>

      <button type="submit" class="btn btn-primary" style="width:100%; margin-top:0.5rem;">
        Sign In to Portal
      </button>
    </form>
  `;
}
