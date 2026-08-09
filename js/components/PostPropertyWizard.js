import { CITIES_DATA, PROPERTY_TYPES } from '../data/cities.js';

export function renderPostPropertyModal(state) {
  const currentStep = state.wizardStep || 1;
  const isVisible = state.showPostWizard || false;
  const editingProp = state.editingProperty || null;
  const uploadedImages = state.uploadedImages || (editingProp?.images ? [...editingProp.images] : []);

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="post-wizard-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">
            ${editingProp
      ? `<i data-lucide="edit" style="width:22px; height:22px; color:var(--emerald-teal); vertical-align:middle;"></i> Edit Property Listing`
      : `<i data-lucide="plus-circle" style="width:22px; height:22px; color:var(--emerald-teal); vertical-align:middle;"></i> Post Property FREE on Sarmayadar`}
          </h3>
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
              <span class="step-label">${editingProp ? 'Review & Save' : 'Photos & Publish'}</span>
            </div>
          </div>

          <!-- Form Step Content (all steps stay in DOM to preserve filled values) -->
          <form id="post-property-form" onsubmit="return false;">
            <div id="wiz-step-1" style="display: ${currentStep === 1 ? 'block' : 'none'};">
              ${renderWizardStep1(editingProp)}
            </div>
            <div id="wiz-step-2" style="display: ${currentStep === 2 ? 'block' : 'none'};">
              ${renderWizardStep2(editingProp)}
            </div>
            <div id="wiz-step-3" style="display: ${currentStep === 3 ? 'block' : 'none'};">
              ${renderWizardStep3(editingProp)}
            </div>
            <div id="wiz-step-4" style="display: ${currentStep === 4 ? 'block' : 'none'};">
              ${renderWizardStep4(editingProp, uploadedImages)}
            </div>
          </form>
        </div>

        <div class="modal-footer">
          ${currentStep > 1 ? `
            <button type="button" class="btn btn-secondary" id="wizard-prev-btn">Previous Step</button>
          ` : '<div></div>'}
          
          ${currentStep < 4 ? `
            <button type="button" class="btn btn-primary" id="wizard-next-btn">Next Step →</button>
          ` : `
            <button type="button" class="btn btn-gold" id="wizard-submit-btn">
              ${editingProp ? '💾 Save Changes' : '🚀 Publish Property Live'}
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderWizardStep1(prop) {
  const purpose = prop ? prop.purpose : 'sale';
  const category = prop ? prop.category : (PROPERTY_TYPES[0] ? PROPERTY_TYPES[0].id : 'house');

  return `
    <div class="form-group">
      <label style="font-weight: 700;">Property Purpose <span style="color:red;">* Required</span></label>
      <div style="display:flex; gap:1rem;">
        <label class="checkbox-label" style="flex:1;">
          <input type="radio" name="wiz_purpose" value="sale" ${purpose === 'sale' ? 'checked' : ''} required /> For Sale
        </label>
        <label class="checkbox-label" style="flex:1;">
          <input type="radio" name="wiz_purpose" value="rent" ${purpose === 'rent' ? 'checked' : ''} required /> For Rent
        </label>

      </div>
    </div>

    <div class="form-group">
      <label style="font-weight: 700;">Property Category <span style="color:red;">* Required</span></label>
      <select id="wiz_category" class="form-control" required>
        ${PROPERTY_TYPES.map(t => `<option value="${t.id}" ${category.toLowerCase() === t.id.toLowerCase() || category.toLowerCase() === t.name.toLowerCase() ? 'selected' : ''}>${t.name}</option>`).join('')}
      </select>
    </div>
  `;
}

function renderWizardStep2(prop) {
  const city = prop ? prop.city : 'Lahore';
  const location = prop ? prop.location : '';
  const address = prop ? (prop.address || prop.location) : '';

  return `
    <div class="form-grid-2">
      <div class="form-group">
        <label style="font-weight: 700;">City <span style="color:red;">* Required</span></label>
        <select id="wiz_city" class="form-control" required>
          ${CITIES_DATA.map(c => `<option value="${c.name}" ${city === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label style="font-weight: 700;">Society / Phase / Location <span style="color:red;">* Required</span></label>
        <input type="text" id="wiz_location" class="form-control" value="${location}" placeholder="e.g. Bahria Town Phase 8, Sector C" required />
      </div>
    </div>

    <div class="form-group">
      <label style="font-weight: 700;">Full Address / House Number <span style="color:red;">* Required</span></label>
      <input type="text" id="wiz_address" class="form-control" value="${address}" placeholder="e.g. House 142, Street 18, Block B" required />
    </div>
  `;
}

function renderWizardStep3(prop) {
  const price = prop ? prop.price : '';
  const size = prop ? (prop.areaSize || prop.size || prop.sizeMarla || '') : '';
  const beds = prop ? (prop.bedrooms !== undefined ? prop.bedrooms : 4) : 4;
  const baths = prop ? (prop.bathrooms !== undefined ? prop.bathrooms : 5) : 5;
  const features = prop && prop.features ? prop.features : ['Solar Power Backup', 'Servant Quarter', 'Gas Connection', 'CCTV & Security'];

  return `
    <div class="form-grid-2">
      <div class="form-group">
        <label style="font-weight: 700;">Asking Price (PKR) <span style="color:red;">* Required</span></label>
        <input type="number" id="wiz_price" class="form-control" value="${price}" placeholder="e.g. 50000000 (5 Crore)" min="1" required />
      </div>

      <div class="form-group">
        <label style="font-weight: 700;">Area Size (in Marla) <span style="color:red;">* Required</span></label>
        <input type="number" id="wiz_size" class="form-control" value="${size}" placeholder="e.g. 10" min="0.1" step="0.1" required />
      </div>
    </div>

    <div class="form-grid-2">
      <div class="form-group">
        <label style="font-weight: 700;">Bedrooms <span style="color:red;">* Required</span></label>
        <input type="number" id="wiz_beds" class="form-control" value="${beds}" min="0" required />
      </div>

      <div class="form-group">
        <label style="font-weight: 700;">Bathrooms <span style="color:red;">* Required</span></label>
        <input type="number" id="wiz_baths" class="form-control" value="${baths}" min="0" required />
      </div>
    </div>

    <div class="form-group">
      <label style="font-weight: 700;">Amenities & Features</label>
      <div class="checkbox-grid">
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_solar" ${features.some(f => f.toLowerCase().includes('solar')) ? 'checked' : ''} /> Solar Power Backup</label>
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_servant" ${features.some(f => f.toLowerCase().includes('servant')) ? 'checked' : ''} /> Servant Quarter</label>
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_corner" ${features.some(f => f.toLowerCase().includes('corner')) ? 'checked' : ''} /> Corner Plot</label>
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_gas" ${features.some(f => f.toLowerCase().includes('gas')) ? 'checked' : ''} /> Gas Connection</label>
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_park" ${features.some(f => f.toLowerCase().includes('park')) ? 'checked' : ''} /> Park Facing</label>
        <label class="checkbox-label"><input type="checkbox" id="wiz_feat_cctv" ${features.some(f => f.toLowerCase().includes('cctv') || f.toLowerCase().includes('security')) ? 'checked' : ''} /> CCTV & Security</label>
      </div>
    </div>
  `;
}

function renderWizardStep4(prop, uploadedImages = []) {
  const title = prop ? prop.title : '';
  const desc = prop ? prop.description : '';

  return `
    <div class="form-group">
      <label style="font-weight: 700;">Property Title <span style="color:red;">* Required</span></label>
      <input type="text" id="wiz_title" class="form-control" value="${title}" placeholder="e.g. 10 Marla Brand New Modern House for Sale in Bahria Town" required />
    </div>

    <div class="form-group">
      <label style="font-weight: 700;">Description <span style="color:red;">* Required</span></label>
      <textarea id="wiz_desc" class="form-control" rows="3" placeholder="Provide details about fittings, gas connection, solar backup, possession state, etc..." required>${desc}</textarea>
    </div>

    <div class="form-group">
      <label style="font-weight:700; color:var(--ink); font-size:0.9rem; margin-bottom:0.5rem; display:block;">
        <i data-lucide="image" style="width:16px; height:16px; vertical-align:middle; color:var(--emerald-teal);"></i> Upload Property Photos <span style="color:red;">* Required (At least 1 photo)</span>
      </label>

      <div id="image-drag-drop-zone" style="border:2px dashed var(--emerald-teal); border-radius:12px; padding:2rem 1.5rem; text-align:center; background:var(--cream); cursor:pointer; transition:all 0.2s ease;">
        <div style="width:48px; height:48px; border-radius:50%; background:rgba(30,123,89,0.12); display:inline-flex; align-items:center; justify-content:center; margin-bottom:0.75rem;">
          <i data-lucide="upload-cloud" style="width:24px; height:24px; color:var(--emerald-teal);"></i>
        </div>
        <p style="font-weight:700; color:var(--ink); margin-bottom:0.25rem; font-size:0.95rem;">
          Drag & drop images here, or <span style="color:var(--emerald-teal); text-decoration:underline;">Browse PC Gallery</span>
        </p>
        <span style="font-size:0.8rem; color:var(--text-muted); display:block;">Select photos from your device gallery (JPG, PNG, WebP)</span>
        <input type="file" id="wiz_file_input" accept="image/*" multiple style="display:none;" />
      </div>

      <div id="wiz-image-previews" style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:1rem;">
        ${renderImagePreviewsList(uploadedImages)}
      </div>
    </div>
  `;
}

export function renderImagePreviewsList(images = []) {
  if (!images || images.length === 0) {
    return `<div style="font-size:0.82rem; color:var(--text-muted); font-style:italic;">No images uploaded yet. Drag & drop or click above to add photos from your computer gallery.</div>`;
  }
  return images.map((imgUrl, index) => `
    <div style="position:relative; width:90px; height:90px; border-radius:8px; overflow:hidden; border:2px solid var(--border-dk); box-shadow:var(--shadow-sm);">
      <img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Property photo ${index + 1}" />
      <button type="button" class="remove-wiz-img-btn" data-index="${index}" style="position:absolute; top:3px; right:3px; background:rgba(220,38,38,0.9); color:white; border:none; border-radius:50%; width:20px; height:20px; font-size:12px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Remove image">&times;</button>
    </div>
  `).join('');
}
