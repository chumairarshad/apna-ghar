import { checkPushSupport, subscribeToPushNotifications, dismissPushPrompt } from '../utils/pushClient.js';

/**
 * Render the Web Push Notification Opt-in UI Banner
 */
export function renderPushNotificationBanner(state) {
  const support = checkPushSupport();

  // Do not show banner if already subscribed, denied, dismissed, or unsupported
  if (!support.supported || support.isSubscribed || support.permission === 'denied' || support.isDismissed || state.hidePushBanner) {
    return '';
  }

  return `
    <div id="push-notification-banner" class="push-banner-container" style="
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      max-width: 420px;
      width: calc(100% - 32px);
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      border: 1px solid rgba(16, 185, 129, 0.3);
      box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.4), 0 0 15px rgba(16, 185, 129, 0.15);
      border-radius: 16px;
      padding: 20px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      animation: pushSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    ">
      <style>
        @keyframes pushSlideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .push-banner-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .push-banner-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }
        .push-dismiss-btn {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 9px 14px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .push-dismiss-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }
        .push-close-x {
          position: absolute;
          top: 12px;
          right: 14px;
          background: none;
          border: none;
          color: #64748b;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        }
        .push-close-x:hover { color: #f1f5f9; }
      </style>

      <button class="push-close-x" id="btn-dismiss-push-x" title="Dismiss">&times;</button>

      <div style="display: flex; gap: 14px; align-items: flex-start;">
        <div style="
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #10b981;
        ">
          <i data-lucide="bell-ring" style="width:24px; height:24px;"></i>
        </div>

        <div style="flex: 1; padding-right: 12px;">
          <h4 style="margin: 0 0 4px 0; font-size: 1.05rem; font-weight: 700; color: #f8fafc; display: flex; align-items: center; gap: 6px;">
            Get New Property Alerts
          </h4>
          <p style="margin: 0 0 16px 0; font-size: 0.85rem; color: #94a3b8; line-height: 1.45;">
            Be the first to know when new verified houses, plots, and apartments are published across Pakistan.
          </p>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="push-banner-btn" id="btn-enable-push">
              <i data-lucide="bell" style="width:16px; height:16px;"></i> Enable Notifications
            </button>
            <button class="push-dismiss-btn" id="btn-dismiss-push">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Attach Event Handlers for Push Notification Banner UI
 */
export function initPushBannerEvents(state, renderApp, showToast) {
  const container = document.getElementById('push-notification-banner');
  if (!container) return;

  const enableBtn = document.getElementById('btn-enable-push');
  const dismissBtn = document.getElementById('btn-dismiss-push');
  const closeXBtn = document.getElementById('btn-dismiss-push-x');

  const handleDismiss = () => {
    dismissPushPrompt();
    state.hidePushBanner = true;
    if (container) {
      container.style.opacity = '0';
      container.style.transform = 'translateY(20px)';
      container.style.transition = 'all 0.3s ease';
      setTimeout(() => container.remove(), 300);
    }
  };

  if (dismissBtn) dismissBtn.addEventListener('click', handleDismiss);
  if (closeXBtn) closeXBtn.addEventListener('click', handleDismiss);

  if (enableBtn) {
    enableBtn.addEventListener('click', async () => {
      enableBtn.disabled = true;
      enableBtn.innerHTML = `<i data-lucide="loader" class="spin" style="width:16px; height:16px;"></i> Enabling...`;
      if (window.lucide) window.lucide.createIcons();

      const result = await subscribeToPushNotifications();

      if (result.success) {
        if (showToast) showToast(`🎉 ${result.message}`);
        state.hidePushBanner = true;
        handleDismiss();
      } else {
        if (showToast) {
          if (result.reason === 'denied') {
            showToast(`⚠️ Notifications are currently disabled. You can enable them from your browser settings.`);
          } else {
            showToast(`⚠️ ${result.message}`);
          }
        }
        enableBtn.disabled = false;
        enableBtn.innerHTML = `<i data-lucide="bell" style="width:16px; height:16px;"></i> Enable Notifications`;
        if (window.lucide) window.lucide.createIcons();
        if (result.reason === 'denied') {
          handleDismiss();
        }
      }
    });
  }
}
