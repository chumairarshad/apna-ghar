import { renderIcon } from '../utils/icons.js';
import { t } from '../utils/i18n.js';

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
            <p>${t('footer_tagline', "Pakistan's most trusted digital real estate portal & dealer network.")}</p>
            
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
            <h4>${renderIcon('compass', 16, 'var(--marigold)')} ${t('footer_quick_links', 'Quick Links')}</h4>
            <ul>
              <li><a href="#" data-nav="buy">${renderIcon('chevron-right', 12)} ${t('nav_sale', 'Properties for Sale')}</a></li>
              <li><a href="#" data-nav="rent">${renderIcon('chevron-right', 12)} ${t('nav_rent', 'Rental Properties')}</a></li>
              <li><a href="#" data-nav="projects">${renderIcon('chevron-right', 12)} ${t('nav_projects', 'Housing Megaprojects')}</a></li>
              <li><a href="#" data-nav="advertise">${renderIcon('chevron-right', 12)} ${t('nav_advertise', '📢 Advertise')}</a></li>
              <li><a href="#" data-nav="dealer">${renderIcon('chevron-right', 12)} ${t('nav_dealer', 'Dealer Portal')}</a></li>
            </ul>
          </div>

          <!-- Real Estate Tools Column -->
          <div class="footer-col">
            <h4>${renderIcon('calculator', 16, 'var(--marigold)')} ${t('nav_tools', 'Calculators & Tools')}</h4>
            <ul>
              <li><a href="#" id="footer-link-converter">${renderIcon('ruler', 12)} ${t('tab_converter', 'Area Unit Converter')}</a></li>
              <li><a href="#" id="footer-link-mortgage">${renderIcon('building-2', 12)} ${t('tab_mortgage', 'Mortgage Loan Calculator')}</a></li>
              <li><a href="#" id="footer-link-valuation">${renderIcon('trending-up', 12)} ${t('tab_valuation', 'Property Valuation')}</a></li>
              <li><a href="#" id="footer-link-post">${renderIcon('plus-circle', 12)} ${t('btn_post_free', 'Post Property FREE')}</a></li>
            </ul>
          </div>

          <!-- Contact & Corporate Column -->
          <div class="footer-col">
            <h4>${renderIcon('map-pin', 16, 'var(--marigold)')} Head Office & Support</h4>
            <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:0.6rem; color:var(--cream); opacity:0.88;">
              <div style="display:flex; gap:0.5rem; align-items:flex-start;">
                ${renderIcon('building', 15, 'var(--marigold)', 'margin-top:2px;')}
                <span>Head office 99 Westwood colony, Thoker, Lahore.</span>
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
                <span>Monday to Saturday 9am to 6 pm</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Bottom Bar -->
        <div class="footer-bottom" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; padding-top:2rem; margin-top:2.5rem; border-top:1px solid rgba(255,255,255,0.12); font-size:0.8rem;">
          <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
            <span>&copy; 2026 <strong>Sarmayadar</strong>. ${t('footer_rights', 'All Rights Reserved.')}</span>
            <span style="opacity:0.5;">•</span>
            <span style="font-weight:700; color:#FFFFFF; display:inline-flex; align-items:center; gap:4px;">
              Made with <span style="color:#EF4444; font-size:0.9rem;">❤️</span> by <strong>Vujood</strong>
            </span>
          </div>
          <div style="display:flex; gap:1.25rem;">
            <a href="#" id="footer-privacy-btn" style="color:var(--cream); opacity:0.9; font-weight:700;">Privacy Policy</a>
            <a href="#" id="footer-terms-btn" style="color:var(--cream); opacity:0.9; font-weight:700;">Terms of Service</a>
            <a href="#" id="footer-tax-guide-btn" style="color:var(--cream); opacity:0.9;">FBR Tax Guide</a>
            <a href="#admin-login" id="footer-admin-btn" style="color:var(--marigold); opacity:0.95; font-weight:800;">🛡️ ${t('nav_admin', 'Admin Portal')}</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
