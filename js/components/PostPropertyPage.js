import { renderIcon } from '../utils/icons.js';
import { renderImagePreviewsList } from './PostPropertyWizard.js';

export function renderPostPropertyPage(state) {
  const currentStep = state.wizardStep || 1;
  const images = state.uploadedImages || [];
  const formData = state.postPropertyFormData || {};

  const purpose = formData.purpose || 'sale';
  const category = formData.category || 'house';
  const city = formData.city || 'Lahore';
  const size = formData.size !== undefined && formData.size !== null ? formData.size : '';
  const location = formData.location || '';
  const address = formData.address || '';
  const title = formData.title || '';
  const price = formData.price !== undefined && formData.price !== null ? formData.price : '';
  const beds = formData.beds !== undefined && formData.beds !== null ? formData.beds : '';
  const baths = formData.baths !== undefined && formData.baths !== null ? formData.baths : '';
  const desc = formData.desc || '';

  return `
    <div class="post-property-page-wrapper" style="background: var(--cream); min-height: 90vh; padding: 2rem 0 4rem 0;">
      <div class="container" style="max-width: 860px;">
        
        <!-- Navigation Header & Breadcrumbs -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <nav aria-label="breadcrumb">
            <ol style="display: flex; align-items: center; gap: 8px; list-style: none; padding: 0; margin: 0; font-size: 0.85rem; font-weight: 700; color: var(--forest-dk);">
              <li><a href="#buy" style="color: var(--rani-dk); text-decoration: none;">Home</a></li>
              <li style="color: var(--forest); opacity: 0.5;">/</li>
              <li style="color: var(--forest-dk);">Post Free Property Listing</li>
            </ol>
          </nav>

          <a href="#buy" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700; background: var(--paper); border: 2px solid var(--forest-dk); border-radius: 8px; padding: 6px 14px; text-decoration: none; color: var(--forest-dk);">
            ${renderIcon('arrow-left', 14)} Cancel & Return
          </a>
        </div>

        <!-- Wizard Main Container -->
        <div style="background: var(--paper); border-radius: 20px; border: 3px solid var(--forest-dk); box-shadow: var(--shadow-lg); overflow: hidden;">
          
          <!-- Page Header Banner -->
          <div style="background: var(--forest-dk); color: var(--paper); padding: 2rem; border-bottom: 4px solid var(--marigold);">
            <span class="badge" style="background: var(--marigold); color: var(--forest-dk); font-weight: 800; font-size: 0.75rem; padding: 4px 12px; margin-bottom: 8px; display: inline-block;">
              FREE UNLIMITED LISTING
            </span>
            <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--paper); margin: 0;">
              Post Property for Sale or Rent
            </h1>
            <p style="color: var(--cream); opacity: 0.88; font-size: 0.92rem; margin-top: 6px; margin-bottom: 0;">
              Reach over 500,000+ verified buyers across Lahore, Islamabad, Karachi, and major Pakistani cities.
            </p>
          </div>

          <!-- Wizard Progress Steps Bar -->
          <div style="background: var(--cream); padding: 1.25rem 2rem; border-bottom: 2px solid var(--border-dk);">
            <div style="display: flex; justify-content: space-between; align-items: center; position: relative;">
              
              <div style="display: flex; flex-direction: column; align-items: center; z-index: 2;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: ${currentStep >= 1 ? 'var(--forest-dk)' : 'var(--border-dk)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
                  1
                </div>
                <span style="font-size: 0.75rem; font-weight: 700; margin-top: 4px; color: ${currentStep >= 1 ? 'var(--forest-dk)' : 'var(--forest)'};">Property Type</span>
              </div>

              <div style="display: flex; flex-direction: column; align-items: center; z-index: 2;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: ${currentStep >= 2 ? 'var(--forest-dk)' : 'var(--border-dk)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
                  2
                </div>
                <span style="font-size: 0.75rem; font-weight: 700; margin-top: 4px; color: ${currentStep >= 2 ? 'var(--forest-dk)' : 'var(--forest)'};">Location</span>
              </div>

              <div style="display: flex; flex-direction: column; align-items: center; z-index: 2;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: ${currentStep >= 3 ? 'var(--forest-dk)' : 'var(--border-dk)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
                  3
                </div>
                <span style="font-size: 0.75rem; font-weight: 700; margin-top: 4px; color: ${currentStep >= 3 ? 'var(--forest-dk)' : 'var(--forest)'};">Price & Specs</span>
              </div>

              <div style="display: flex; flex-direction: column; align-items: center; z-index: 2;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: ${currentStep >= 4 ? 'var(--forest-dk)' : 'var(--border-dk)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
                  4
                </div>
                <span style="font-size: 0.75rem; font-weight: 700; margin-top: 4px; color: ${currentStep >= 4 ? 'var(--forest-dk)' : 'var(--forest)'};">Photos & Watermark</span>
              </div>

            </div>
          </div>

          <!-- Wizard Body Form -->
          <div style="padding: 2.25rem;">
            <form id="post-property-page-form">
              
              ${currentStep === 1 ? `
                <!-- STEP 1: PURPOSE & CATEGORY -->
                <div>
                  <h3 style="font-size: 1.25rem; color: var(--forest-dk); font-weight: 800; margin-bottom: 1.25rem;">
                    Step 1: Select Purpose & Property Category
                  </h3>

                  <div class="form-group" style="margin-bottom: 1.5rem;">
                    <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Listing Purpose *</label>
                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                      <label style="flex: 1; border: 2px solid var(--border-dk); padding: 1rem; border-radius: 12px; cursor: pointer; text-align: center; font-weight: 800; background: var(--cream);">
                        <input type="radio" name="wiz_purpose" value="sale" ${purpose === 'sale' ? 'checked' : ''} style="margin-right: 6px;" /> Sell Property
                      </label>
                      <label style="flex: 1; border: 2px solid var(--border-dk); padding: 1rem; border-radius: 12px; cursor: pointer; text-align: center; font-weight: 800; background: var(--cream);">
                        <input type="radio" name="wiz_purpose" value="rent" ${purpose === 'rent' ? 'checked' : ''} style="margin-right: 6px;" /> Rent Property
                      </label>
                    </div>
                  </div>

                  <div class="form-group" style="margin-bottom: 1.5rem;">
                    <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Property Category *</label>
                    <select id="wiz_category" class="form-control" style="padding: 0.85rem; font-weight: 700;" required>
                      <option value="house" ${category === 'house' ? 'selected' : ''}>House / Villa / Townhouse</option>
                      <option value="plot" ${category === 'plot' ? 'selected' : ''}>Residential / Commercial Plot</option>
                      <option value="apartment" ${category === 'apartment' ? 'selected' : ''}>Apartment / Penthouse</option>
                      <option value="commercial" ${category === 'commercial' ? 'selected' : ''}>Commercial Plaza / Shop / Office</option>
                    </select>
                  </div>
                </div>
              ` : ''}

              ${currentStep === 2 ? `
                <!-- STEP 2: LOCATION & ADDRESS -->
                <div>
                  <h3 style="font-size: 1.25rem; color: var(--forest-dk); font-weight: 800; margin-bottom: 1.25rem;">
                    Step 2: Property Location & Address
                  </h3>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;">
                    <div class="form-group">
                      <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">City *</label>
                      <select id="wiz_city" class="form-control" style="padding: 0.85rem; font-weight: 700;" required>
                        <option value="Lahore" ${city === 'Lahore' ? 'selected' : ''}>Lahore</option>
                        <option value="Islamabad" ${city === 'Islamabad' ? 'selected' : ''}>Islamabad</option>
                        <option value="Karachi" ${city === 'Karachi' ? 'selected' : ''}>Karachi</option>
                        <option value="Rawalpindi" ${city === 'Rawalpindi' ? 'selected' : ''}>Rawalpindi</option>
                        <option value="Peshawar" ${city === 'Peshawar' ? 'selected' : ''}>Peshawar</option>
                        <option value="Faisalabad" ${city === 'Faisalabad' ? 'selected' : ''}>Faisalabad</option>
                        <option value="Multan" ${city === 'Multan' ? 'selected' : ''}>Multan</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Area Size (in Marla) *</label>
                      <input type="number" id="wiz_size" class="form-control" placeholder="e.g. 5 or 10 or 20 (1 Kanal)" value="${size}" style="padding: 0.85rem; font-weight: 700;" required />
                    </div>
                  </div>

                  <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Society / Sector Name *</label>
                    <input type="text" id="wiz_location" class="form-control" placeholder="e.g. DHA Phase 6, Sector J or Bahria Town Sector C" value="${location}" style="padding: 0.85rem; font-weight: 700;" required />
                  </div>

                  <div class="form-group">
                    <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Complete Address / Plot Number *</label>
                    <input type="text" id="wiz_address" class="form-control" placeholder="e.g. Plot 142, Street 8, Sector J, DHA Phase 6, Lahore" value="${address}" style="padding: 0.85rem; font-weight: 700;" required />
                  </div>
                </div>
              ` : ''}

              ${currentStep === 3 ? `
                <!-- STEP 3: PRICE, SPECS & DESCRIPTION -->
                <div>
                  <h3 style="font-size: 1.25rem; color: var(--forest-dk); font-weight: 800; margin-bottom: 1.25rem;">
                    Step 3: Demanded Price, Specifications & Features
                  </h3>

                  <div class="form-group" style="margin-bottom: 1.25rem;">
                    <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Property Title *</label>
                    <input type="text" id="wiz_title" class="form-control" placeholder="e.g. 10 Marla Brand New Corner Villa in DHA Phase 5" value="${title}" style="padding: 0.85rem; font-weight: 700;" required />
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
                    <div class="form-group">
                      <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Demand Price (PKR) *</label>
                      <input type="number" id="wiz_price" class="form-control" placeholder="e.g. 35000000" value="${price}" style="padding: 0.85rem; font-weight: 700;" required />
                    </div>
                    <div class="form-group">
                      <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Bedrooms</label>
                      <input type="number" id="wiz_beds" class="form-control" placeholder="e.g. 4" value="${beds}" style="padding: 0.85rem; font-weight: 700;" />
                    </div>
                    <div class="form-group">
                      <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Bathrooms</label>
                      <input type="number" id="wiz_baths" class="form-control" placeholder="e.g. 5" value="${baths}" style="padding: 0.85rem; font-weight: 700;" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--forest-dk); text-transform: uppercase;">Detailed Property Description *</label>
                    <textarea id="wiz_desc" class="form-control" rows="4" placeholder="Describe key highlights, woodwork, sanitary fittings, solar system, facing direction, etc." style="padding: 0.85rem; font-weight: 600;" required>${desc}</textarea>
                  </div>
                </div>
              ` : ''}

              ${currentStep === 4 ? `
                <!-- STEP 4: PHOTOS & AUTO WATERMARKING -->
                <div>
                  <h3 style="font-size: 1.25rem; color: var(--forest-dk); font-weight: 800; margin-bottom: 1.25rem;">
                    Step 4: Upload Property Photos & Auto-Watermark
                  </h3>

                  <div id="image-drag-drop-zone" style="border: 3px dashed var(--forest); background: var(--cream); border-radius: 16px; padding: 2.5rem 1.5rem; text-align: center; cursor: pointer; margin-bottom: 1.5rem; transition: all 0.2s;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">📸</div>
                    <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--forest-dk); margin-bottom: 0.25rem;">
                      Drag & Drop High-Res Property Photos Here
                    </h4>
                    <p style="font-size: 0.85rem; color: var(--forest); opacity: 0.8; margin-bottom: 1rem;">
                      JPG, PNG files supported. Photos will automatically receive the official <strong>SARMAYADAR VERIFIED</strong> watermark stamp!
                    </p>
                    <label class="btn btn-dark btn-sm" style="display: inline-block; cursor: pointer; padding: 10px 20px; font-weight: 800; border-radius: 8px;">
                      Choose Photos from Device / Gallery
                      <input type="file" id="wiz_file_input" multiple accept="image/*" style="display: none;" />
                    </label>
                  </div>

                  <div id="wiz-image-previews">
                    ${renderImagePreviewsList(images)}
                  </div>
                </div>
              ` : ''}

              <!-- Navigation Footer Buttons -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; pt-3; border-top: 2px solid var(--border-dk);">
                ${currentStep > 1 ? `
                  <button type="button" id="wiz-prev-step-btn" class="btn btn-outline" style="padding: 0.8rem 1.5rem; font-weight: 800; border-radius: 10px;">
                    ← Previous Step
                  </button>
                ` : `<div></div>`}

                ${currentStep < 4 ? `
                  <button type="button" id="wiz-next-step-btn" class="btn btn-primary" style="padding: 0.8rem 1.75rem; font-weight: 800; border-radius: 10px; box-shadow: var(--shadow-md);">
                    Next Step →
                  </button>
                ` : `
                  <button type="submit" id="wiz-submit-listing-btn" class="btn btn-marigold" style="padding: 0.85rem 2rem; font-size: 1rem; font-weight: 800; border-radius: 10px; box-shadow: var(--shadow-md);">
                    🚀 Publish Property Listing Live
                  </button>
                `}
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  `;
}
