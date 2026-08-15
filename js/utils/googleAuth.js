/**
 * Sarmayadar Google Identity Services (GIS) Client Handler
 * Seamless, secure Google OAuth authentication integration.
 */

let cachedGoogleClientId = null;
let isGoogleInitialized = false;

/**
 * Fetch Google Client ID from backend public config safely
 */
export async function getGoogleClientId() {
  if (cachedGoogleClientId) return cachedGoogleClientId;
  try {
    const res = await fetch('/api/auth/config');
    if (res.ok) {
      const data = await res.json();
      if (data.googleClientId) {
        cachedGoogleClientId = data.googleClientId;
        return cachedGoogleClientId;
      }
    }
  } catch (err) {
    console.warn('Notice: Could not load auth config from server:', err.message);
  }
  return null;
}

/**
 * Initialize Google Identity Services (GIS) library
 * @param {Function} onCredentialCallback Callback receiving Google ID token credential
 */
export async function initGoogleIdentityServices(onCredentialCallback) {
  const clientId = await getGoogleClientId();
  if (!clientId) {
    return { initialized: false, error: 'NO_CLIENT_ID' };
  }

  if (typeof window.google === 'undefined' || !window.google.accounts || !window.google.accounts.id) {
    return { initialized: false, error: 'GSI_NOT_LOADED' };
  }

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response && response.credential) {
          if (typeof onCredentialCallback === 'function') {
            onCredentialCallback(response.credential);
          }
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin'
    });

    isGoogleInitialized = true;
    return { initialized: true, clientId };
  } catch (err) {
    console.error('Google Identity Services init error:', err);
    return { initialized: false, error: err.message };
  }
}

/**
 * Trigger the Google OAuth Prompt / Login flow
 * @param {Function} onCredentialCallback 
 * @param {Function} onErrorCallback
 */
export async function triggerGooglePrompt(onCredentialCallback, onErrorCallback) {
  const clientId = await getGoogleClientId();
  if (!clientId) {
    if (typeof onErrorCallback === 'function') {
      onErrorCallback('Google Sign-In is not configured yet. Please set GOOGLE_CLIENT_ID in the .env file.');
    }
    return;
  }

  if (typeof window.google === 'undefined' || !window.google.accounts || !window.google.accounts.id) {
    if (typeof onErrorCallback === 'function') {
      onErrorCallback('Google Identity Services is loading. Please check your internet connection and try again.');
    }
    return;
  }

  try {
    // Re-initialize to ensure active callback is wired up
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response && response.credential) {
          if (typeof onCredentialCallback === 'function') {
            onCredentialCallback(response.credential);
          }
        } else {
          if (typeof onErrorCallback === 'function') {
            onErrorCallback('Google login was cancelled or did not return credentials.');
          }
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Render an invisible button and trigger click to reliably invoke Google popup account chooser
    const hiddenContainer = document.getElementById('g_id_signin_hidden') || document.body;
    const tempBtnHolder = document.createElement('div');
    tempBtnHolder.style.position = 'fixed';
    tempBtnHolder.style.left = '-9999px';
    tempBtnHolder.style.opacity = '0';
    hiddenContainer.appendChild(tempBtnHolder);

    window.google.accounts.id.renderButton(tempBtnHolder, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: 250
    });

    // Also display the prompt
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        // If prompt not displayed (e.g., third-party cookies suppressed), click the rendered button
        const innerBtn = tempBtnHolder.querySelector('div[role="button"]') || tempBtnHolder.querySelector('button');
        if (innerBtn) {
          innerBtn.click();
        }
      } else if (notification.isSkippedMoment() || notification.isDismissedMoment()) {
        const reason = notification.getDismissedReason?.() || notification.getSkippedReason?.() || '';
        if (reason && reason !== 'tap_outside' && reason !== 'user_cancel') {
          console.warn('Google prompt dismiss notice:', reason);
        }
      }
    });

    // Trigger click on rendered button for direct interaction
    setTimeout(() => {
      const innerBtn = tempBtnHolder.querySelector('div[role="button"]') || tempBtnHolder.querySelector('button');
      if (innerBtn) {
        innerBtn.click();
      }
      setTimeout(() => {
        if (tempBtnHolder.parentNode) {
          tempBtnHolder.parentNode.removeChild(tempBtnHolder);
        }
      }, 5000);
    }, 100);

  } catch (err) {
    console.error('Trigger Google prompt failed:', err);
    if (typeof onErrorCallback === 'function') {
      onErrorCallback(err.message || 'Unable to open Google Sign-In.');
    }
  }
}

/**
 * Render standard "Continue with Google" button and "OR" divider
 * @param {string} buttonText Default 'Continue with Google'
 * @param {string} customId Optional button element ID
 */
export function renderGoogleAuthButton(buttonText = 'Continue with Google', customId = 'google-auth-trigger-btn') {
  return `
    <div class="google-auth-wrapper" style="width: 100%; margin-bottom: 1.25rem;">
      <button type="button" 
              class="btn-google-auth" 
              id="${customId}" 
              style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 0.85rem 1rem; background: #FFFFFF; color: #1F2937; border: 2px solid #E5E7EB; border-radius: 10px; font-family: var(--font-body, inherit); font-size: 0.95rem; font-weight: 700; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.08); transition: all 0.2s ease;">
        <svg class="google-logo-svg" style="width: 20px; height: 20px; flex-shrink: 0;" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        <span>${buttonText}</span>
      </button>

      <div id="g_id_signin_hidden" style="display: none;"></div>

      <div class="auth-divider" style="display: flex; align-items: center; text-align: center; margin: 1.25rem 0 1rem 0;">
        <span style="flex: 1; border-bottom: 1px solid var(--border-dk, #E2E8F0);"></span>
        <span style="padding: 0 12px; color: #64748B; font-family: var(--font-mono, monospace); font-size: 0.72rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
          OR
        </span>
        <span style="flex: 1; border-bottom: 1px solid var(--border-dk, #E2E8F0);"></span>
      </div>
    </div>
  `;
}
