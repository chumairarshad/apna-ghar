import { renderIcon } from '../utils/icons.js';

export function renderScheduleVisitModal(state) {
  const isVisible = state.showScheduleVisitModal || false;
  const prop = state.selectedVisitProperty || state.properties[0];

  if (!prop) return `<div id="schedule-visit-overlay"></div>`;

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="schedule-visit-overlay">
      <div class="modal-container" style="max-width:540px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            ${renderIcon('calendar', 20, 'var(--rani)')}
            <h3 class="modal-title">Book Site Visit / Video Walkthrough</h3>
          </div>
          <button class="close-modal-btn" id="close-schedule-btn">&times;</button>
        </div>

        <form id="schedule-visit-form">
          <div class="modal-body" style="padding:1.25rem;">
            <div style="background:var(--cream); border:1.5px solid var(--border-dk); border-radius:8px; padding:0.85rem; margin-bottom:1.25rem; display:flex; gap:0.75rem; align-items:center;">
              <img src="${prop.images[0]}" style="width:60px; height:50px; object-fit:cover; border-radius:4px; border:1px solid var(--forest-dk);" />
              <div>
                <div style="font-family:var(--font-display); font-size:0.88rem; font-weight:700; color:var(--forest-dk);">${prop.title}</div>
                <div style="font-size:0.78rem; color:var(--forest); opacity:0.8;">${prop.location}, ${prop.city}</div>
              </div>
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label>Select Inspection Type</label>
              <select id="visit-type-select" required style="width:100%; height:44px; padding:0 0.85rem; border:2px solid var(--border-dk); border-radius:6px; font-weight:600;">
                <option value="physical" selected>📍 In-Person Physical Site Visit</option>
                <option value="video">📹 Live WhatsApp HD Video Walkthrough</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label>Preferred Visit Date</label>
              <input type="date" id="visit-date-input" required style="width:100%; height:44px; padding:0 0.85rem; border:2px solid var(--border-dk); border-radius:6px; font-weight:600;" />
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label>Preferred Time Slot</label>
              <select id="visit-time-select" required style="width:100%; height:44px; padding:0 0.85rem; border:2px solid var(--border-dk); border-radius:6px; font-weight:600;">
                <option value="morning">Morning (10:00 AM - 1:00 PM)</option>
                <option value="afternoon" selected>Afternoon (2:00 PM - 5:00 PM)</option>
                <option value="evening">Evening (5:00 PM - 7:30 PM)</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label>Your Phone / WhatsApp Number</label>
              <input type="tel" id="visit-phone-input" placeholder="+92 300 1234567" required style="width:100%; height:44px; padding:0 0.85rem; border:2px solid var(--border-dk); border-radius:6px; font-weight:600;" />
            </div>
          </div>

          <div class="modal-footer" style="padding:1rem 1.25rem;">
            <button type="button" class="btn btn-ghost btn-sm" id="cancel-schedule-btn">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm">
              ${renderIcon('check-circle', 16)} Confirm Appointment Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
