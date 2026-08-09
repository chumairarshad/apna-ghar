import { renderIcon } from '../utils/icons.js';

export function renderFooter() {
  return `
    <footer class="portal-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand & Social Column -->
          <div class="footer-brand">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:1rem;">
              <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="14" fill="#faf1de"/>
                <path d="M50 18L18 45V82H82V45L50 18Z" fill="#131d0c"/>
                <circle cx="50" cy="46" r="10" fill="#f2a71b"/>
                <path d="M42 76V58H58V76H42Z" fill="#d1266e"/>
              </svg>
              <h2 style="font-family:var(--font-display); font-size:1.4rem; color:var(--paper); margin:0;">SARMAYA<span style="color:var(--rani);">DAR</span></h2>
            </div>
            <p>Pakistan's most trusted real estate portal connecting home buyers, tenants, and verified real estate agencies across DHA, Bahria Town, and major cities.</p>
            
            <div class="footer-social-links" style="display:flex; gap:0.65rem; margin-top:1.25rem;">
              <a href="#" class="social-icon-btn" title="Facebook">${renderIcon('facebook', 16, 'var(--cream)')}</a>
              <a href="#" class="social-icon-btn" title="Instagram">${renderIcon('instagram', 16, 'var(--cream)')}</a>
              <a href="#" class="social-icon-btn" title="LinkedIn">${renderIcon('linkedin', 16, 'var(--cream)')}</a>
              <a href="#" class="social-icon-btn" title="YouTube">${renderIcon('youtube', 16, 'var(--cream)')}</a>
              <a href="https://wa.me/923327507866" target="_blank" class="social-icon-btn" title="WhatsApp Support">${renderIcon('message-circle', 16, 'var(--cream)')}</a>
            </div>
          </div>

          <!-- Quick Navigation Links -->
          <div class="footer-col">
            <h4>${renderIcon('compass', 16, 'var(--marigold)')} Quick Explore</h4>
            <ul>
              <li><a href="#" data-nav="buy">${renderIcon('chevron-right', 12)} Properties for Sale</a></li>
              <li><a href="#" data-nav="rent">${renderIcon('chevron-right', 12)} Rental Properties</a></li>
              <li><a href="#" data-nav="projects">${renderIcon('chevron-right', 12)} Housing Megaprojects</a></li>
              <li><a href="#" data-nav="agents">${renderIcon('chevron-right', 12)} Verified Broker Directory</a></li>
              <li><a href="#" data-nav="dealer">${renderIcon('chevron-right', 12)} Dealer Portal CRM</a></li>
            </ul>
          </div>

          <!-- Real Estate Tools Column -->
          <div class="footer-col">
            <h4>${renderIcon('calculator', 16, 'var(--marigold)')} Land & Finance Tools</h4>
            <ul>
              <li><a href="#" id="footer-link-converter">${renderIcon('ruler', 12)} Pakistani Land Unit Converter</a></li>
              <li><a href="#" id="footer-link-mortgage">${renderIcon('building-2', 12)} Bank Home Loan Calculator</a></li>
              <li><a href="#" id="footer-link-valuation">${renderIcon('trending-up', 12)} Property Price Valuation Engine</a></li>
              <li><a href="#" id="footer-link-post">${renderIcon('plus-circle', 12)} Post Free Property Listing</a></li>
            </ul>
          </div>

          <!-- Contact & Corporate Column -->
          <div class="footer-col">
            <h4>${renderIcon('map-pin', 16, 'var(--marigold)')} Head Office & Support</h4>
            <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:0.6rem; color:var(--cream); opacity:0.88;">
              <div style="display:flex; gap:0.5rem; align-items:flex-start;">
                ${renderIcon('building', 15, 'var(--marigold)', 'margin-top:2px;')}
                <span>Suite 402, MB Commercial Broadway, DHA Phase 6, Lahore, Pakistan</span>
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                ${renderIcon('phone-call', 15, 'var(--marigold)')}
                <span>+92 332 7507866</span>
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                ${renderIcon('mail', 15, 'var(--marigold)')}
                <span>contact@sarmayadar.com</span>
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                ${renderIcon('clock', 15, 'var(--marigold)')}
                <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Bottom Bar -->
        <div class="footer-bottom" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; padding-top:2rem; margin-top:2.5rem; border-top:1px solid rgba(255,255,255,0.12); font-size:0.8rem;">
          <div>
            &copy; 2026 <strong>Sarmayadar</strong>. All Rights Reserved.
          </div>
          <div style="font-weight:700; color:#FFFFFF; display:flex; align-items:center; gap:5px; font-size:0.85rem;">
            Made with <span style="color:#EF4444; font-size:0.95rem;">❤️</span> by <strong>Vujood</strong>
          </div>
          <div style="display:flex; gap:1.25rem;">
            <a href="#" id="footer-privacy-btn" style="color:var(--cream); opacity:0.9; font-weight:700;">Privacy Policy</a>
            <a href="#" id="footer-terms-btn" style="color:var(--cream); opacity:0.9; font-weight:700;">Terms of Service</a>
            <a href="#" id="footer-tax-guide-btn" style="color:var(--cream); opacity:0.9;">FBR Tax Guide</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
