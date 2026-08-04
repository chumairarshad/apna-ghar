import { renderIcon } from '../utils/icons.js';

export function renderAISmartFinder(state) {
  return `
    <section class="ai-finder-section" style="padding:4rem 0; background:linear-gradient(135deg, var(--forest-dk), var(--forest)); color:var(--paper); border-top:4px solid var(--marigold); border-bottom:4px solid var(--marigold); position:relative; overflow:hidden;">
      <div style="position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:radial-gradient(circle, rgba(242,167,27,0.15), transparent 70%); border-radius:50%;"></div>
      
      <div class="container" style="position:relative; z-index:2;">
        <div style="max-width:780px; margin:0 auto; text-align:center;">
          <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(242, 167, 27, 0.15); border:1.5px solid var(--marigold); color:var(--marigold); font-family:var(--font-mono); font-size:0.75rem; font-weight:700; padding:6px 16px; border-radius:30px; letter-spacing:1px; text-transform:uppercase; margin-bottom:1rem;">
            ${renderIcon('sparkles', 14, 'var(--marigold)')} NEXT-GEN AI SEARCH ENGINE
          </div>

          <h2 style="font-family:var(--font-display); font-size:clamp(1.8rem, 3vw, 2.6rem); color:var(--paper); margin-bottom:0.75rem;">
            Describe Your Ideal Home in <span style="color:var(--marigold);">Plain English</span>
          </h2>
          
          <p style="font-size:1rem; color:var(--cream); opacity:0.9; margin-bottom:2rem;">
            Our AI analyzes your specific lifestyle requirements, budget range, preferred city, and amenities to match you with top verified properties in seconds.
          </p>

          <!-- AI Natural Language Prompt Form -->
          <div style="background:var(--paper); border:3px solid var(--marigold); border-radius:14px; padding:1.25rem; box-shadow:var(--shadow-xl); text-align:left;">
            <div style="margin-bottom:0.75rem; font-family:var(--font-mono); font-size:0.75rem; font-weight:700; color:var(--forest-dk); text-transform:uppercase;">
              ${renderIcon('zap', 14, 'var(--rani)')} Tell AI what you need:
            </div>
            
            <textarea id="ai-prompt-input" rows="3" style="width:100%; border:2px solid var(--border-dk); border-radius:8px; padding:0.85rem 1rem; font-size:0.95rem; font-family:var(--font-body); background:var(--cream); color:var(--ink); font-weight:600; resize:none; margin-bottom:1rem;" placeholder="e.g. I want a 10 Marla modern designer house in DHA Lahore Phase 6 under 4.5 Crore with solar power backup and 4 bedrooms..."></textarea>

            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
              <!-- Quick Prompt Pills -->
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                <button type="button" class="ai-sample-prompt-btn" data-prompt="10 Marla Villa in DHA Lahore Phase 6 under 4.5 Crore" style="background:var(--cream); border:1px solid var(--border-dk); border-radius:20px; padding:4px 12px; font-size:0.75rem; font-weight:600; color:var(--forest-dk); cursor:pointer;">
                  📍 DHA Lahore Villa
                </button>
                <button type="button" class="ai-sample-prompt-btn" data-prompt="Luxury 3 Bed Apartment in Islamabad Gulberg Greens with easy installment plan" style="background:var(--cream); border:1px solid var(--border-dk); border-radius:20px; padding:4px 12px; font-size:0.75rem; font-weight:600; color:var(--forest-dk); cursor:pointer;">
                  🏢 Islamabad Apartment
                </button>
                <button type="button" class="ai-sample-prompt-btn" data-prompt="1 Kanal House in DHA Karachi Phase 8" style="background:var(--cream); border:1px solid var(--border-dk); border-radius:20px; padding:4px 12px; font-size:0.75rem; font-weight:600; color:var(--forest-dk); cursor:pointer;">
                  🌊 Karachi 1 Kanal
                </button>
              </div>

              <!-- Submit AI Finder Button -->
              <button type="button" class="btn btn-primary" id="execute-ai-search-btn" style="padding:10px 22px; font-size:0.9rem;">
                ${renderIcon('sparkles', 16, 'white')} Find Matching Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
