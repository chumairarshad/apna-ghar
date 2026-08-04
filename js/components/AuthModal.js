export function renderAuthModal(state) {
  const isVisible = state.showAuthModal || false;
  const isSignup = state.authIsSignup || false;
  const selectedRole = state.authRole || 'DEALER'; // 'USER' | 'DEALER' | 'ADMIN'

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="auth-modal-overlay">
      <div class="modal-container" style="max-width:480px;">
        <div class="modal-header">
          <h3 class="modal-title">${isSignup ? 'Create Account' : 'Sign In'} — Apna Ghar</h3>
          <button class="close-modal-btn" id="close-auth-btn">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Role Selection Pills -->
          <div class="form-group" style="margin-bottom:1.25rem;">
            <label style="font-weight:700; font-size:0.85rem; display:block; margin-bottom:0.5rem;">Select Role</label>
            <div style="display:flex; gap:0.4rem; background:var(--cream); padding:4px; border-radius:8px; border:1.5px solid var(--border-dk);">
              <button type="button" class="btn btn-sm auth-role-select-btn ${selectedRole === 'USER' ? 'btn-primary active' : 'btn-ghost'}" data-role="USER" style="flex:1; font-weight:700;">
                🏠 User (Buyer/Tenant)
              </button>
              <button type="button" class="btn btn-sm auth-role-select-btn ${selectedRole === 'DEALER' ? 'btn-primary active' : 'btn-ghost'}" data-role="DEALER" style="flex:1; font-weight:700;">
                📊 Dealer Portal
              </button>
              <button type="button" class="btn btn-sm auth-role-select-btn ${selectedRole === 'ADMIN' ? 'btn-primary active' : 'btn-ghost'}" data-role="ADMIN" style="flex:1; font-weight:700;">
                🛡️ Admin
              </button>
            </div>
          </div>

          <!-- Auth Mode Toggle (Login vs Signup) -->
          <div style="display:flex; border-bottom:2px solid var(--border-light); margin-bottom:1.25rem;">
            <button type="button" id="toggle-login-mode-btn" style="flex:1; padding:0.6rem; border:none; background:none; font-weight:700; font-size:0.9rem; color:${!isSignup ? 'var(--primary-emerald)' : 'var(--text-muted)'}; border-bottom:3px solid ${!isSignup ? 'var(--primary-emerald)' : 'transparent'}; cursor:pointer;">
              Sign In (Login)
            </button>
            <button type="button" id="toggle-signup-mode-btn" style="flex:1; padding:0.6rem; border:none; background:none; font-weight:700; font-size:0.9rem; color:${isSignup ? 'var(--primary-emerald)' : 'var(--text-muted)'}; border-bottom:3px solid ${isSignup ? 'var(--primary-emerald)' : 'transparent'}; cursor:pointer;">
              Create New Account
            </button>
          </div>

          <!-- Email & Password Form -->
          <form id="email-auth-form">
            ${isSignup ? `
              <div class="form-group" style="margin-bottom:1rem;">
                <label>Full Name / Agency Name</label>
                <input type="text" id="auth-full-name" class="form-control" placeholder="e.g. Chaudhry Kamran" value="${selectedRole === 'DEALER' ? 'Chaudhry Kamran' : 'Usman Malik'}" required />
              </div>
              <div class="form-group" style="margin-bottom:1rem;">
                <label>Mobile Phone (+92)</label>
                <input type="text" id="auth-phone-num" class="form-control" placeholder="+92 300 8472910" value="+92 300 8472910" required />
              </div>
            ` : ''}

            <div class="form-group" style="margin-bottom:1rem;">
              <label>Email Address</label>
              <input type="email" id="auth-email-input" class="form-control" placeholder="email@apnaghar.pk" value="${selectedRole === 'DEALER' ? 'kamran@apnaghar.pk' : (selectedRole === 'ADMIN' ? 'admin@apnaghar.pk' : 'buyer@apnaghar.pk')}" required />
            </div>

            <div class="form-group" style="margin-bottom:1.25rem;">
              <label>Password</label>
              <input type="password" id="auth-password-input" class="form-control" placeholder="••••••••" value="Password123!" required />
              <span style="font-size:0.72rem; color:var(--text-muted); display:block; margin-top:4px;">JWT Security Token will be issued with <strong>48-Hour</strong> session duration.</span>
            </div>

            <button type="submit" class="btn btn-gold" id="auth-submit-btn" style="width:100%; padding:0.85rem; font-size:0.95rem; font-weight:800;">
              ${isSignup ? `🚀 Register as ${selectedRole}` : `🔓 Sign In as ${selectedRole}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}
