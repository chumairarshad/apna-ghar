import { CITIES_DATA, PROPERTY_TYPES } from '../data/cities.js';

export function renderPostPropertyModal(state) {
  const currentStep = state.wizardStep || 1;
  const isVisible = state.showPostWizard || false;

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="post-wizard-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title"><i data-lucide="plus-circle" style="width:22px; height:22px; color:var(--emerald-teal); vertical-align:middle;"></i> Post Property FREE on Apna Ghar</h3>
          <button class="close-modal-btn" id="close-wizard-btn">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Stepper -->
          <div class="wizard-stepper">
            <div class="step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}">
              <div class="step-circle">1</div>
              <span class="step-label">Purpose & Type</span>
            </div>
            <div class="step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}">
              <div class="step-circle">2</div>
              <span class="step-label">Location</span>
            </div>
            <div class="step-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}">
              <div class="step-circle">3</div>
              <span class="step-label">Price & Specs</span>
            </div>
            <div class="step-item ${currentStep === 4 ? 'active' : ''}">
              <div class="step-circle">4</div>
              <span class="step-label">Photos & Publish</span>
            </div>
          </div>

          <!-- Form Step Content -->
          <form id="post-property-form">
            ${currentStep === 1 ? renderWizardStep1() : ''}
            ${currentStep === 2 ? renderWizardStep2() : ''}
            ${currentStep === 3 ? renderWizardStep3() : ''}
            ${currentStep === 4 ? renderWizardStep4() : ''}
          </form>
        </div>

        <div class="modal-footer">
          ${currentStep > 1 ? `
            <button type="button" class="btn btn-secondary" id="wizard-prev-btn">Previous Step</button>
          ` : '<div></div>'}
          
          ${currentStep < 4 ? `
            <button type="button" class="btn btn-primary" id="wizard-next-btn">Next Step</button>
          ` : `
            <button type="button" class="btn btn-gold" id="wizard-submit-btn">Publish Property Live</button>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderWizardStep1() {
  return `
    <div class="form-group">
      <label>Property Purpose</label>
      <div style="display:flex; gap:1rem;">
        <label class="checkbox-label" style="background:var(--bg-main); padding:0.75rem 1.5rem; border-radius:8px; border:1px solid var(--border-light); width:100%;">
          <input type="radio" name="wiz_purpose" value="sale" checked /> For Sale
        </label>
        <label class="checkbox-label" style="background:var(--bg-main); padding:0.75rem 1.5rem; border-radius:8px; border:1px solid var(--border-light); width:100%;">
          <input type="radio" name="wiz_purpose" value="rent" /> For Rent
        </label>
      </div>
    </div>

    <div class="form-group">
      <label>Property Category</label>
      <select id="wiz_category" class="form-control">
        ${PROPERTY_TYPES.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
      </select>
    </div>
  `;
}

function renderWizardStep2() {
  return `
    <div class="form-grid-2">
      <div class="form-group">
        <label>City</label>
        <select id="wiz_city" class="form-control">
          ${CITIES_DATA.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label>Society / Phase</label>
        <input type="text" id="wiz_location" class="form-control" placeholder="e.g. DHA Phase 6, Sector MB" required />
      </div>
    </div>

    <div class="form-group">
      <label>Full Address / House Number</label>
      <input type="text" id="wiz_address" class="form-control" placeholder="e.g. House 142, Street 18..." required />
    </div>
  `;
}

function renderWizardStep3() {
  return `
    <div class="form-grid-2">
      <div class="form-group">
        <label>Asking Price (PKR)</label>
        <input type="number" id="wiz_price" class="form-control" placeholder="e.g. 35000000 (3.5 Crore)" required />
      </div>

      <div class="form-group">
        <label>Area Size (in Marla)</label>
        <input type="number" id="wiz_size" class="form-control" placeholder="e.g. 10" required />
      </div>
    </div>

    <div class="form-grid-2">
      <div class="form-group">
        <label>Bedrooms</label>
        <input type="number" id="wiz_beds" class="form-control" value="4" />
      </div>

      <div class="form-group">
        <label>Bathrooms</label>
        <input type="number" id="wiz_baths" class="form-control" value="5" />
      </div>
    </div>

    <div class="form-group">
      <label>Amenities & Features</label>
      <div class="checkbox-grid">
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_solar" checked /> Solar Power Backup</label>
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_servant" checked /> Servant Quarter</label>
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_corner" /> Corner Plot</label>
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_gas" checked /> Gas Connection</label>
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_park" /> Park Facing</label>
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_cctv" checked /> CCTV & Security</label>
      </div>
    </div>
  `;
}

function renderWizardStep4() {
  return `
    <div class="form-group">
      <label>Property Title</label>
      <input type="text" id="wiz_title" class="form-control" placeholder="e.g. 10 Marla Brand New Modern House for Sale..." required />
    </div>

    <div class="form-group">
      <label>Description</label>
      <textarea id="wiz_desc" class="form-control" rows="3" placeholder="Provide details about imported fittings, gas connection, solar backup, etc..."></textarea>
    </div>

    <div class="form-group">
      <label>Main Image URL</label>
      <input type="text" id="wiz_image" class="form-control" value="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" />
    </div>
  `;
}
