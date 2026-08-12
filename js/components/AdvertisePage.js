import { renderIcon } from '../utils/icons.js';
import { formatPKR } from '../utils/formatters.js';

// Interactive state & handlers setup for window scope
if (typeof window !== 'undefined') {
  window.advAddonActive = 'header';
  
  window.scrollToAdvSection = function(secId) {
    const el = document.getElementById(`adv-sec-${secId}`);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    document.querySelectorAll('.adv-audience-tab').forEach(tab => tab.classList.remove('active'));
    const tabEl = document.getElementById(`tab-btn-${secId}`);
    if (tabEl) tabEl.classList.add('active');
  };

  // Scroll spy to highlight sticky category tab automatically on scroll
  if (!window.advScrollSpyBound) {
    window.advScrollSpyBound = true;
    window.addEventListener('scroll', function() {
      const sections = ['individual', 'agency', 'developer'];
      let currentSec = '';
      sections.forEach(secId => {
        const el = document.getElementById(`adv-sec-${secId}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 150) {
            currentSec = secId;
          }
        }
      });
      if (currentSec) {
        document.querySelectorAll('.adv-audience-tab').forEach(tab => tab.classList.remove('active'));
        const activeTab = document.getElementById(`tab-btn-${currentSec}`);
        if (activeTab) activeTab.classList.add('active');
      }
    });
  }

  window.toggleAdvFaq = function(el) {
    const item = el.closest('.adv-faq-item');
    if (item) {
      item.classList.toggle('open');
    }
  };

  window.handleAdvBuy = function(planName, price) {
    if (planName.includes('Registration') || price === 0) {
      if (window.openAuthRegisterModal) {
        window.openAuthRegisterModal('DEALER');
        return;
      }
    }
    if (window.showToast) {
      window.showToast(`Selected Package: ${planName} (${formatPKR(price)}). Our team will contact you shortly!`);
    } else {
      alert(`Thank you for choosing ${planName}! Our advertising specialist will contact you.`);
    }
  };

  window.selectAdvAddon = function(addonKey) {
    window.advAddonActive = addonKey;
    document.querySelectorAll('.addon-menu-item').forEach(item => item.classList.remove('active'));
    const selectedItem = document.getElementById(`addon-item-${addonKey}`);
    if (selectedItem) selectedItem.classList.add('active');
    
    // Update Addon Content
    const detailsBox = document.getElementById('addon-details-box');
    if (!detailsBox) return;

    const addonsData = {
      header: {
        title: 'Top Header Banner',
        tag: 'Recommended for High Visibility',
        desc: 'Positioned right at the top of Sarmayadar homepage and main search pages. Reaches over 15 million monthly property seekers.',
        ctr: '4.8% Average CTR',
        dims: '728 x 90 px (Desktop) | 320 x 100 px (Mobile)',
        cities: 'Available in Lahore, Karachi, Islamabad, Peshawar & Multan',
        bgGradient: 'linear-gradient(135deg, #1e6d2b, #131d0c)',
        mockupText: 'Sarmayadar Top Header Banner Ad'
      },
      search: {
        title: 'Search Results Banner',
        tag: 'Targeted Locality Reach',
        desc: 'Displays prominently within search result listings when users filter by specific cities (e.g. DHA Lahore, Bahria Town, Gulberg).',
        ctr: '6.2% High Intent CTR',
        dims: '970 x 250 px Billboard Banner',
        cities: 'Hyper-targeted by City & Society',
        bgGradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
        mockupText: 'Targeted Search Results Banner'
      },
      property: {
        title: 'Property Details Sidebar Banner',
        tag: 'Maximum Buyer Engagement',
        desc: 'Appears directly on property detail view pages right next to agent contact details when serious buyers inspect properties.',
        ctr: '5.5% Direct Inquiry CTR',
        dims: '300 x 600 px Half-Page Banner',
        cities: 'Nationwide Placement',
        bgGradient: 'linear-gradient(135deg, #7e22ce, #581c87)',
        mockupText: 'Property Detail Page Sidebar Ad'
      },
      mobile: {
        title: 'Mobile App & Browser Sticky Ad',
        tag: 'Mobile Dominance',
        desc: 'Sticky bottom banner optimized for mobile users on iOS, Android, and mobile web browsers with instant one-tap WhatsApp action.',
        ctr: '7.4% High Mobile CTR',
        dims: '320 x 50 px Mobile Sticky Banner',
        cities: 'All Mobile Devices Across Pakistan',
        bgGradient: 'linear-gradient(135deg, #d97706, #b45309)',
        mockupText: 'Mobile Sticky Bottom Banner'
      },
      developer: {
        title: 'Developer Megaproject Showcase',
        tag: 'Exclusive Developer Placement',
        desc: 'Dedicated full-width hero spotlight banner with 3D floorplan embedding, video trailer, and direct lead generation form.',
        ctr: '8.9% High Lead Rate',
        dims: 'Full-Width Hero Interactive Widget',
        cities: 'Featured Homepage Spotlight',
        bgGradient: 'linear-gradient(135deg, #0f766e, #115e59)',
        mockupText: 'Developer Megaproject Showcase'
      },
      homepage: {
        title: 'Homepage Takeover',
        tag: 'Exclusive Brand Dominance',
        desc: '100% exclusive 24-hour total site takeover with background skin branding, top banner, and pop-up video announcement.',
        ctr: '12.5% Maximum Exposure',
        dims: 'Full Screen Site Skin & Header',
        cities: 'Nationwide & Overseas Visitors',
        bgGradient: 'linear-gradient(135deg, #be123c, #9f1239)',
        mockupText: '24-Hour Exclusive Site Takeover'
      }
    };

    const data = addonsData[addonKey] || addonsData.header;

    detailsBox.innerHTML = `
      <div class="addon-detail-card">
        <div class="addon-badge">${data.tag}</div>
        <h3 class="addon-title">${data.title}</h3>
        <p class="addon-desc">${data.desc}</p>
        
        <ul class="addon-specs-list">
          <li>${renderIcon('trending-up', 16)} <strong>CTR:</strong> ${data.ctr}</li>
          <li>${renderIcon('maximize', 16)} <strong>Banner Dimensions:</strong> ${data.dims}</li>
          <li>${renderIcon('map-pin', 16)} <strong>Location:</strong> ${data.cities}</li>
        </ul>

        <div class="addon-preview-mockup" style="background:${data.bgGradient}">
          <div class="mockup-content">
            <span class="mockup-tag">ADVERTISING PREVIEW</span>
            <h4>${data.mockupText}</h4>
            <p>Interactive Banner Slot Placement</p>
          </div>
        </div>

        <button class="adv-btn-buy" style="margin-top:1.5rem;" onclick="window.handleAdvBuy('${data.title}', 45000)">
          Inquire Now ${renderIcon('chevron-right', 14, '#ffffff')}
        </button>
      </div>
    `;
  };

  window.currentTestimonialIdx = 0;
  window.testimonialsList = [
    {
      quote: "I had been struggling to sell my agency properties before I started advertising on Sarmayadar. The platform's user-friendly interface and targeted advertising options helped us find the right buyers quickly. Highly recommended to anyone looking to sell or rent out property.",
      author: "Hassan Iqbal",
      role: "Managing Director, Premier Real Estate",
      agency: "Premier Real Estate Lahore"
    },
    {
      quote: "Sarmayadar's Agency Premium Plus package gave our agency 10x more leads within 30 days. The CRM Profolio tools and verified buyer inquiries on WhatsApp allowed us to close 14 major plot sales in DHA Phase 6.",
      author: "Chaudhry Kamran",
      role: "CEO, Al-Haram Estate",
      agency: "Al-Haram Estate & Builders"
    },
    {
      quote: "As a megaproject developer in Islamabad, the Grand Launchpad package on Sarmayadar helped us sell 85% of our commercial towers inventory before construction completion. Extraordinary reach among overseas Pakistanis!",
      author: "Major (R) Tariq Mahmood",
      role: "Head of Marketing, Sky Gardens Towers",
      agency: "Sky Developers Islamabad"
    }
  ];

  window.navigateAdvTestimonial = function(dir) {
    if (dir === 'next') {
      window.currentTestimonialIdx = (window.currentTestimonialIdx + 1) % window.testimonialsList.length;
    } else {
      window.currentTestimonialIdx = (window.currentTestimonialIdx - 1 + window.testimonialsList.length) % window.testimonialsList.length;
    }
    const item = window.testimonialsList[window.currentTestimonialIdx];
    const textEl = document.getElementById('adv-testimonial-text');
    const authorEl = document.getElementById('adv-testimonial-author');
    const roleEl = document.getElementById('adv-testimonial-role');
    
    if (textEl) textEl.innerHTML = `"${item.quote}"`;
    if (authorEl) authorEl.innerText = item.author;
    if (roleEl) roleEl.innerText = `${item.role} • ${item.agency}`;
  };
}

export function renderAdvertisePage(state) {
  return `
    <div class="advertise-page-zameen">
      
      <!-- 1. Hero Section (Light Mint Pastel Banner like Zameen) -->
      <section class="adv-hero-banner">
        <div class="container">
          <div class="breadcrumb-nav">
            <a href="#" onclick="window.onStateChange && window.onStateChange({activeTab:'buy'})">Home</a>
            <span class="bc-sep">/</span>
            <span class="bc-current">Advertise</span>
          </div>

          <div class="hero-center-content">
            <h1 class="hero-headline">
              Let <span class="highlight-brand">Sarmayadar</span> Build Your Business
            </h1>
            <p class="hero-subheadline">
              Choose the package that suits your budget. Upgrade or downgrade at any time. Focus on growing your business while we bring you clients and buyers.
            </p>
          </div>

          <!-- 3 Audience Navigation Switcher Cards -->
          <div class="adv-tabs-wrapper">
            <div class="adv-audience-tab active" id="tab-btn-individual" onclick="window.scrollToAdvSection('individual')">
              <div class="tab-badge-icon" style="background:#e8f5e9; color:#1e6d2b;">
                ${renderIcon('user-check', 22)}
              </div>
              <span class="tab-label">For Individuals</span>
            </div>

            <div class="adv-audience-tab" id="tab-btn-agency" onclick="window.scrollToAdvSection('agency')">
              <div class="tab-badge-icon" style="background:#fff3e0; color:#e65100;">
                ${renderIcon('megaphone', 22)}
              </div>
              <span class="tab-label">For Agencies</span>
            </div>

            <div class="adv-audience-tab" id="tab-btn-developer" onclick="window.scrollToAdvSection('developer')">
              <div class="tab-badge-icon" style="background:#e3f2fd; color:#1565c0;">
                ${renderIcon('briefcase', 22)}
              </div>
              <span class="tab-label">For Developers</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Section: For Individuals -->
      <section id="adv-sec-individual" class="adv-main-section">
        <div class="container">
          <h2 class="section-heading-zameen">For Individuals</h2>

          <div class="individual-cards-grid">
            
            <!-- Card 1: Starter Pack -->
            <div class="ind-card">
              <div class="ind-card-top">
                <div class="ind-card-icon" style="background:#e8f5e9; color:#1e6d2b;">
                  ${renderIcon('star', 22)}
                </div>
                <h3 class="ind-card-title">Starter Pack</h3>
                <p class="ind-card-desc">Designed for individual sellers looking to list property on a budget</p>
              </div>
              <div class="ind-card-bottom">
                <div class="ind-card-price">
                  PKR 5,000 <span class="ind-unit">/ month</span>
                </div>
                <button class="ind-btn-buy" onclick="window.handleAdvBuy('Starter Pack', 5000)">
                  Buy Now
                </button>
              </div>
            </div>

            <!-- Card 2: Basic Package -->
            <div class="ind-card">
              <div class="ind-card-top">
                <div class="ind-card-icon" style="background:#fff3e0; color:#f57c00;">
                  ${renderIcon('star', 22)}
                </div>
                <h3 class="ind-card-title">Basic Package</h3>
                <p class="ind-card-desc">For individual sellers seeking higher visibility and priority search</p>
              </div>
              <div class="ind-card-bottom">
                <div class="ind-card-price">
                  PKR 7,500 <span class="ind-unit">/ month</span>
                </div>
                <button class="ind-btn-buy" onclick="window.handleAdvBuy('Basic Package', 7500)">
                  Buy Now
                </button>
              </div>
            </div>

            <!-- Card 3: Standard Package -->
            <div class="ind-card">
              <div class="ind-card-top">
                <div class="ind-card-icon" style="background:#fce4ec; color:#c2185b;">
                  ${renderIcon('star', 22)}
                </div>
                <h3 class="ind-card-title">Standard Package</h3>
                <p class="ind-card-desc">Maximum exposure for individual property owners looking for fast deals</p>
              </div>
              <div class="ind-card-bottom">
                <div class="ind-card-price">
                  PKR 12,000 <span class="ind-unit">/ month</span>
                </div>
                <button class="ind-btn-buy" onclick="window.handleAdvBuy('Standard Package', 12000)">
                  Buy Now
                </button>
              </div>
            </div>

            <!-- Card 4: Hot Listing -->
            <div class="ind-card">
              <div class="ind-card-top">
                <div class="ind-card-icon" style="background:#e1f5fe; color:#0288d1;">
                  ${renderIcon('flame', 22)}
                </div>
                <h3 class="ind-card-title">Featured Quality</h3>
                <p class="ind-card-desc">Offers superior search placement and featured tag for maximum leads</p>
              </div>
              <div class="ind-card-bottom">
                <div class="ind-card-price">
                  PKR 24,000 <span class="ind-unit">/ month</span>
                </div>
                <button class="ind-btn-buy" onclick="window.handleAdvBuy('Featured Quality', 24000)">
                  Buy Now
                </button>
              </div>
            </div>

            <!-- Card 5: Super Hot Listing -->
            <div class="ind-card">
              <div class="ind-card-top">
                <div class="ind-card-icon" style="background:#e0f2f1; color:#00796b;">
                  ${renderIcon('sparkles', 22)}
                </div>
                <h3 class="ind-card-title">Top Tier Quality</h3>
                <p class="ind-card-desc">Redefine property selling with top homepage slot and social promotion</p>
              </div>
              <div class="ind-card-bottom">
                <div class="ind-card-price">
                  PKR 35,000 <span class="ind-unit">/ month</span>
                </div>
                <button class="ind-btn-buy" onclick="window.handleAdvBuy('Top Tier Quality', 35000)">
                  Buy Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 3. Section: Advertise for Agencies -->
      <section id="adv-sec-agency" class="adv-main-section bg-alt-light">
        <div class="container">
          <h2 class="section-heading-zameen">Advertise for Agencies</h2>

          <div class="agency-cards-grid">
            
            <!-- Agency Card 1: Starter Package -->
            <div class="agency-card">
              <div class="agency-card-header">
                <div class="agency-icon-circle" style="background:#e8f5e9; color:#1e6d2b;">
                  ${renderIcon('rocket', 24)}
                </div>
                <h3 class="agency-title">Starter Package</h3>
                <div class="agency-price-block">
                  <div class="subtext">Per Month</div>
                  <div class="price-val">PKR 18,000</div>
                  <div class="billing-note">(Billed Annually)</div>
                </div>
              </div>

              <div class="agency-features-wrapper">
                <div class="features-label">What's Included</div>
                <ul class="agency-checklist">
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 15 Standard Listings</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 3 Hot Listings</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Agency Directory Profile</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Basic Lead Dashboard</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Email & Phone Support</li>
                </ul>
              </div>

              <div class="agency-card-footer">
                <button class="agency-btn-buy" onclick="window.handleAdvBuy('Agency Starter Package', 18000)">
                  Buy Package
                </button>
                <a href="#" class="view-details-link" onclick="event.preventDefault(); window.handleAdvBuy('Agency Starter Package Details', 18000)">
                  View Plan Details ${renderIcon('chevron-right', 12)}
                </a>
              </div>
            </div>

            <!-- Agency Card 2: Agency Standard -->
            <div class="agency-card">
              <div class="agency-card-header">
                <div class="agency-icon-circle" style="background:#ffebee; color:#c62828;">
                  ${renderIcon('shopping-bag', 24)}
                </div>
                <h3 class="agency-title">Agency Standard</h3>
                <div class="agency-price-block">
                  <div class="subtext">Per Month</div>
                  <div class="price-val">PKR 98,000</div>
                  <div class="billing-note">(Billed Annually)</div>
                </div>
              </div>

              <div class="agency-features-wrapper">
                <div class="features-label">What's Included</div>
                <ul class="agency-checklist">
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 50 Standard Listings</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 10 Hot Listings + 2 Super Hot</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Priority Search Placement</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Advanced Analytics & Reports</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 5 Team Member Logins</li>
                </ul>
              </div>

              <div class="agency-card-footer">
                <button class="agency-btn-buy" onclick="window.handleAdvBuy('Agency Standard', 98000)">
                  Buy Package
                </button>
                <a href="#" class="view-details-link" onclick="event.preventDefault(); window.handleAdvBuy('Agency Standard Details', 98000)">
                  View Plan Details ${renderIcon('chevron-right', 12)}
                </a>
              </div>
            </div>

            <!-- Agency Card 3: Premium Plus (POPULAR HIGHLIGHT) -->
            <div class="agency-card highlighted">
              <div class="popular-top-badge">MOST POPULAR</div>
              <div class="agency-card-header">
                <div class="agency-icon-circle" style="background:#fff8e1; color:#f57f17;">
                  ${renderIcon('award', 24)}
                </div>
                <h3 class="agency-title">Premium Plus</h3>
                <div class="agency-price-block">
                  <div class="subtext">Per Month</div>
                  <div class="price-val">PKR 220,000</div>
                  <div class="billing-note">(Billed Annually)</div>
                </div>
              </div>

              <div class="agency-features-wrapper">
                <div class="features-label">What's Included</div>
                <ul class="agency-checklist">
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 150 Standard Listings</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 30 Hot Listings + 10 Super Hot</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Top Agency Profile Badge</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Featured Agency Banner</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Dedicated Account Manager</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Priority Lead Notification</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Full CRM Profolio Access</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Unlimited Staff Accounts</li>
                </ul>
              </div>

              <div class="agency-card-footer">
                <button class="agency-btn-buy solid-green" onclick="window.handleAdvBuy('Premium Plus Agency', 220000)">
                  Buy Package
                </button>
                <a href="#" class="view-details-link" onclick="event.preventDefault(); window.handleAdvBuy('Premium Plus Details', 220000)">
                  View Plan Details ${renderIcon('chevron-right', 12)}
                </a>
              </div>
            </div>

            <!-- Agency Card 4: Titanium -->
            <div class="agency-card">
              <div class="agency-card-header">
                <div class="agency-icon-circle" style="background:#e0f7fa; color:#00838f;">
                  ${renderIcon('shield', 24)}
                </div>
                <h3 class="agency-title">Titanium</h3>
                <div class="agency-price-block">
                  <div class="subtext">Per Month</div>
                  <div class="price-val">PKR 360,000</div>
                  <div class="billing-note">(Billed Annually)</div>
                </div>
              </div>

              <div class="agency-features-wrapper">
                <div class="features-label">What's Included</div>
                <ul class="agency-checklist">
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Unlimited Standard Listings</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Top Search Guarantee</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Custom Branding & Banners</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 24/7 VIP Phone Support</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Weekly Executive Reports</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Full API Integration Access</li>
                </ul>
              </div>

              <div class="agency-card-footer">
                <button class="agency-btn-buy" onclick="window.handleAdvBuy('Titanium Agency', 360000)">
                  Buy Package
                </button>
                <a href="#" class="view-details-link" onclick="event.preventDefault(); window.handleAdvBuy('Titanium Details', 360000)">
                  View Plan Details ${renderIcon('chevron-right', 12)}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 4. Section: Why Advertise With Sarmayadar? (Connected Graph Layout) -->
      <section class="adv-main-section">
        <div class="container">
          <div class="why-sarmayadar-split">
            
            <!-- Left Info -->
            <div class="why-left-content">
              <h2 class="why-title">Why Advertise With Sarmayadar?</h2>
              <p class="why-desc">
                The premier real estate portal across Pakistan. Connect directly with serious buyers, verified tenant seekers, and high-net-worth property investors looking for their next venture.
              </p>
              <p class="why-desc">
                As Sarmayadar expands, our dedicated marketing and support team ensures instant campaign optimization, real-time WhatsApp lead delivery, and maximum return on investment for your agency.
              </p>
              <button class="why-btn-action" onclick="window.scrollToAdvSection('agency')">
                Get Started
              </button>
            </div>

            <!-- Right Connected Nodes Graph -->
            <div class="why-graph-container">
              <div class="graph-node node-1">
                <div class="node-icon-wrap" style="background:#fff3e0; color:#e65100;">
                  ${renderIcon('target', 24)}
                </div>
                <div class="node-text">
                  <h4>Targeted Reach</h4>
                  <p>Connect with active property seekers searching in your exact society.</p>
                </div>
              </div>

              <!-- Dotted Green Connection Arc -->
              <svg class="graph-dotted-arc" viewBox="0 0 200 200" fill="none">
                <path d="M 40,50 A 70,70 0 0,1 160,50" stroke="#81c784" stroke-width="2" stroke-dasharray="4,4"/>
                <path d="M 160,70 A 70,70 0 0,1 100,160" stroke="#81c784" stroke-width="2" stroke-dasharray="4,4"/>
              </svg>

              <div class="graph-node node-2">
                <div class="node-icon-wrap" style="background:#e8f5e9; color:#2e7d32;">
                  ${renderIcon('users', 24)}
                </div>
                <div class="node-text">
                  <h4>Buyer & Tenant Leads</h4>
                  <p>Receive direct calls and verified WhatsApp leads instantly.</p>
                </div>
              </div>

              <div class="graph-node node-3">
                <div class="node-icon-wrap" style="background:#e3f2fd; color:#1565c0;">
                  ${renderIcon('award', 24)}
                </div>
                <div class="node-text">
                  <h4>Leverage Brand</h4>
                  <p>Enhance agency reputation with Sarmayadar's trusted verification mark.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 5. Section: Advertise for Developers -->
      <section id="adv-sec-developer" class="adv-main-section bg-alt-light">
        <div class="container">
          <h2 class="section-heading-zameen">Advertise for Developers</h2>

          <div class="agency-cards-grid">
            
            <!-- Dev Card 1: Starter Project -->
            <div class="agency-card">
              <div class="agency-card-header">
                <div class="agency-icon-circle" style="background:#e8f5e9; color:#1e6d2b;">
                  ${renderIcon('building', 24)}
                </div>
                <h3 class="agency-title">Starter Project</h3>
                <div class="agency-price-block">
                  <div class="subtext">Per Month</div>
                  <div class="price-val">PKR 75,000</div>
                  <div class="billing-note">(Billed Annually)</div>
                </div>
              </div>

              <div class="agency-features-wrapper">
                <div class="features-label">What's Included</div>
                <ul class="agency-checklist">
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Dedicated Project Showcase Page</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Up to 20 Floorplan Layouts</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Direct Lead Capture Form</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 10 Project Updates Posts</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} City Directory Banner</li>
                </ul>
              </div>

              <div class="agency-card-footer">
                <button class="agency-btn-buy" onclick="window.handleAdvBuy('Starter Project', 75000)">
                  Buy Package
                </button>
                <a href="#" class="view-details-link" onclick="event.preventDefault(); window.handleAdvBuy('Starter Project Details', 75000)">
                  View Plan Details ${renderIcon('chevron-right', 12)}
                </a>
              </div>
            </div>

            <!-- Dev Card 2: Value Booster -->
            <div class="agency-card">
              <div class="agency-card-header">
                <div class="agency-icon-circle" style="background:#e1f5fe; color:#0288d1;">
                  ${renderIcon('layers', 24)}
                </div>
                <h3 class="agency-title">Value Booster</h3>
                <div class="agency-price-block">
                  <div class="subtext">Per Month</div>
                  <div class="price-val">PKR 175,000</div>
                  <div class="billing-note">(Billed Annually)</div>
                </div>
              </div>

              <div class="agency-features-wrapper">
                <div class="features-label">What's Included</div>
                <ul class="agency-checklist">
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Everything in Starter Project</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Homepage Carousel Showcase</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 3D Virtual Model Integration</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 50,000 Investor Email Blasts</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Priority Lead Call Center</li>
                </ul>
              </div>

              <div class="agency-card-footer">
                <button class="agency-btn-buy" onclick="window.handleAdvBuy('Value Booster Project', 175000)">
                  Buy Package
                </button>
                <a href="#" class="view-details-link" onclick="event.preventDefault(); window.handleAdvBuy('Value Booster Details', 175000)">
                  View Plan Details ${renderIcon('chevron-right', 12)}
                </a>
              </div>
            </div>

            <!-- Dev Card 3: Grand Launchpad (POPULAR) -->
            <div class="agency-card highlighted">
              <div class="popular-top-badge">POPULAR</div>
              <div class="agency-card-header">
                <div class="agency-icon-circle" style="background:#fff3e0; color:#e65100;">
                  ${renderIcon('zap', 24)}
                </div>
                <h3 class="agency-title">Grand Launchpad</h3>
                <div class="agency-price-block">
                  <div class="subtext">Per Month</div>
                  <div class="price-val">PKR 300,000</div>
                  <div class="billing-note">(Billed Annually)</div>
                </div>
              </div>

              <div class="agency-features-wrapper">
                <div class="features-label">What's Included</div>
                <ul class="agency-checklist">
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Nationwide Launch Blitz</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Top Header Banner & Popup</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 200,000 Overseas Investor SMS</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Social Media Video Campaign</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Dedicated Sales Desk</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} VIP Event Booking Portal</li>
                </ul>
              </div>

              <div class="agency-card-footer">
                <button class="agency-btn-buy solid-green" onclick="window.handleAdvBuy('Grand Launchpad', 300000)">
                  Buy Package
                </button>
                <a href="#" class="view-details-link" onclick="event.preventDefault(); window.handleAdvBuy('Grand Launchpad Details', 300000)">
                  View Plan Details ${renderIcon('chevron-right', 12)}
                </a>
              </div>
            </div>

            <!-- Dev Card 4: Premium Enterprise -->
            <div class="agency-card">
              <div class="agency-card-header">
                <div class="agency-icon-circle" style="background:#f3e5f5; color:#7b1fa2;">
                  ${renderIcon('globe', 24)}
                </div>
                <h3 class="agency-title">Premium Enterprise</h3>
                <div class="agency-price-block">
                  <div class="subtext">Per Month</div>
                  <div class="price-val">PKR 475,000</div>
                  <div class="billing-note">(Billed Annually)</div>
                </div>
              </div>

              <div class="agency-features-wrapper">
                <div class="features-label">What's Included</div>
                <ul class="agency-checklist">
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Unlimited Project Units</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Exclusive 24-Hour Site Takeover</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Overseas Expo Promotion (UAE/UK)</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Full API & Inventory Sync</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} Dedicated PR & News Article</li>
                  <li>${renderIcon('check-circle', 16, '#1e6d2b')} 24/7 VIP Account Manager</li>
                </ul>
              </div>

              <div class="agency-card-footer">
                <button class="agency-btn-buy" onclick="window.handleAdvBuy('Premium Enterprise Project', 475000)">
                  Buy Package
                </button>
                <a href="#" class="view-details-link" onclick="event.preventDefault(); window.handleAdvBuy('Premium Enterprise Details', 475000)">
                  View Plan Details ${renderIcon('chevron-right', 12)}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 6. Section: Add-Ons -->
      <section class="adv-main-section">
        <div class="container">
          <h2 class="section-heading-zameen">Add-Ons</h2>

          <!-- Subtabs Header -->
          <div class="addons-subtabs">
            <button class="addon-subtab active">Banner Advertising</button>
            <button class="addon-subtab">Pop-Up Advertising</button>
          </div>

          <div class="addons-layout-grid">
            
            <!-- Left Vertical Navigation Menu -->
            <div class="addons-nav-menu">
              <div class="addon-menu-item active" id="addon-item-header" onclick="window.selectAdvAddon('header')">
                <div class="menu-icon">${renderIcon('check', 14, '#1e6d2b')}</div>
                <span>Top Header Banner</span>
              </div>

              <div class="addon-menu-item" id="addon-item-search" onclick="window.selectAdvAddon('search')">
                <div class="menu-icon">${renderIcon('search', 14)}</div>
                <span>Search Banner</span>
              </div>

              <div class="addon-menu-item" id="addon-item-property" onclick="window.selectAdvAddon('property')">
                <div class="menu-icon">${renderIcon('file-text', 14)}</div>
                <span>Property Details Banner</span>
              </div>

              <div class="addon-menu-item" id="addon-item-mobile" onclick="window.selectAdvAddon('mobile')">
                <div class="menu-icon">${renderIcon('smartphone', 14)}</div>
                <span>Mobile Banner Special</span>
              </div>

              <div class="addon-menu-item" id="addon-item-developer" onclick="window.selectAdvAddon('developer')">
                <div class="menu-icon">${renderIcon('layout', 14)}</div>
                <span>Developer Showcase</span>
              </div>

              <div class="addon-menu-item" id="addon-item-homepage" onclick="window.selectAdvAddon('homepage')">
                <div class="menu-icon">${renderIcon('grid', 14)}</div>
                <span>Homepage Takeover</span>
              </div>

              <div class="addon-nav-arrows">
                <button class="arrow-btn">${renderIcon('chevron-left', 16)}</button>
                <button class="arrow-btn active">${renderIcon('chevron-right', 16)}</button>
              </div>
            </div>

            <!-- Right Detail Container -->
            <div id="addon-details-box" class="addon-details-container">
              <div class="addon-detail-card">
                <div class="addon-badge">Recommended for High Visibility</div>
                <h3 class="addon-title">Top Header Banner</h3>
                <p class="addon-desc">
                  Positioned right at the top of Sarmayadar homepage and main search pages. Reaches over 15 million monthly property seekers.
                </p>
                
                <ul class="addon-specs-list">
                  <li>${renderIcon('trending-up', 16)} <strong>CTR:</strong> 4.8% Average CTR</li>
                  <li>${renderIcon('maximize', 16)} <strong>Banner Dimensions:</strong> 728 x 90 px (Desktop) | 320 x 100 px (Mobile)</li>
                  <li>${renderIcon('map-pin', 16)} <strong>Location:</strong> Available in Lahore, Karachi, Islamabad, Peshawar & Multan</li>
                </ul>

                <div class="addon-preview-mockup" style="background:linear-gradient(135deg, #1e6d2b, #131d0c)">
                  <div class="mockup-content">
                    <span class="mockup-tag">ADVERTISING PREVIEW</span>
                    <h4>Sarmayadar Top Header Banner Ad</h4>
                    <p>Interactive Banner Slot Placement</p>
                  </div>
                </div>

                <button class="adv-btn-buy" style="margin-top:1.5rem;" onclick="window.handleAdvBuy('Top Header Banner', 45000)">
                  Inquire Now ${renderIcon('chevron-right', 14, '#ffffff')}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 7. Section: Frequently Asked Questions -->
      <section class="adv-main-section bg-alt-light">
        <div class="container">
          <h2 class="section-heading-zameen">Frequently Asked Questions</h2>

          <div class="adv-faq-accordion-list">
            
            <div class="adv-faq-item">
              <div class="adv-faq-q" onclick="window.toggleAdvFaq(this)">
                <span>Why should I advertise my property on Sarmayadar?</span>
                <span class="adv-faq-icon-arrow">${renderIcon('chevron-down', 18)}</span>
              </div>
              <div class="adv-faq-answer">
                Sarmayadar connects your property directly with over 15 million verified active buyers and tenant seekers across Pakistan and overseas hubs like UAE, UK, and USA. Our listings offer verified phone & WhatsApp inquiry delivery for 10x faster property transactions.
              </div>
            </div>

            <div class="adv-faq-item">
              <div class="adv-faq-q" onclick="window.toggleAdvFaq(this)">
                <span>How do I purchase a package on Sarmayadar?</span>
                <span class="adv-faq-icon-arrow">${renderIcon('chevron-down', 18)}</span>
              </div>
              <div class="adv-faq-answer">
                You can simply click the "Buy Now" or "Buy Package" button on your preferred tier, or submit an inquiry through our contact form. Our advertising specialist will assist you with activation within 15 minutes.
              </div>
            </div>

            <div class="adv-faq-item">
              <div class="adv-faq-q" onclick="window.toggleAdvFaq(this)">
                <span>Can I customize a package for my agency or project?</span>
                <span class="adv-faq-icon-arrow">${renderIcon('chevron-down', 18)}</span>
              </div>
              <div class="adv-faq-answer">
                Yes! We offer tailored agency solutions and project launchpads designed around your specific inventory size, target cities, and marketing budget.
              </div>
            </div>

            <div class="adv-faq-item">
              <div class="adv-faq-q" onclick="window.toggleAdvFaq(this)">
                <span>How long does my ad stay active after purchase?</span>
                <span class="adv-faq-icon-arrow">${renderIcon('chevron-down', 18)}</span>
              </div>
              <div class="adv-faq-answer">
                Standard individual listings remain active for 30 days. Agency and Developer packages operate on monthly subscriptions billed annually or quarterly.
              </div>
            </div>

            <div class="adv-faq-item">
              <div class="adv-faq-q" onclick="window.toggleAdvFaq(this)">
                <span>What payment methods are supported on Sarmayadar?</span>
                <span class="adv-faq-icon-arrow">${renderIcon('chevron-down', 18)}</span>
              </div>
              <div class="adv-faq-answer">
                We accept major payment channels in Pakistan including JazzCash, EasyPaisa, Visa / Mastercard Credit & Debit cards, and Direct Bank Wire Transfer.
              </div>
            </div>

            <div class="adv-faq-item">
              <div class="adv-faq-q" onclick="window.toggleAdvFaq(this)">
                <span>What is the difference between Hot & Super Hot listing?</span>
                <span class="adv-faq-icon-arrow">${renderIcon('chevron-down', 18)}</span>
              </div>
              <div class="adv-faq-answer">
                Hot Listings feature highlighted borders and appear above basic listings in search results. Super Hot Listings get top homepage carousel placement, priority push notifications, and maximum buyer lead volume.
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 8. Section: Testimonials -->
      <section class="adv-main-section">
        <div class="container">
          <div class="testimonials-block">
            
            <div class="testi-header-col">
              <div class="testi-subbadge">Testimonials</div>
              <h2 class="testi-title">What our clients say about <span class="brand-text">Sarmayadar.com</span></h2>
              <p class="testi-desc">
                Trusted by thousands of real estate agency leaders, property developers, and private landlords across Pakistan.
              </p>
            </div>

            <div class="testi-quote-card">
              <div class="quote-mark-icon">“</div>
              <p class="quote-text" id="adv-testimonial-text">
                "I had been struggling to sell my agency properties before I started advertising on Sarmayadar. The platform's user-friendly interface and targeted advertising options helped us find the right buyers quickly. Highly recommended to anyone looking to sell or rent out property."
              </p>

              <div class="quote-author-row">
                <div class="author-avatar" style="background:#1e6d2b; color:#ffffff;">
                  HI
                </div>
                <div class="author-info">
                  <h4 class="author-name" id="adv-testimonial-author">Hassan Iqbal</h4>
                  <p class="author-role" id="adv-testimonial-role">Managing Director, Premier Real Estate • Premier Real Estate Lahore</p>
                </div>

                <div class="quote-nav-btns">
                  <button class="q-nav-btn" onclick="window.navigateAdvTestimonial('prev')">${renderIcon('chevron-left', 16)}</button>
                  <button class="q-nav-btn active" onclick="window.navigateAdvTestimonial('next')">${renderIcon('chevron-right', 16)}</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 9. Section: Become a member of Sarmayadar.com today -->
      <section class="adv-main-section bg-alt-light">
        <div class="container">
          <h2 class="section-heading-center">Become a member of Sarmayadar.com today</h2>

          <div class="member-cards-row">
            
            <!-- Card 1: Are you a Developer? -->
            <div class="member-banner-card developer-banner">
              <div class="member-card-content">
                <h3>Are you a Developer?</h3>
                <p>Create a developer account to showcase your residential or commercial project to millions of real estate buyers.</p>
                <button class="member-btn-white" onclick="window.handleAdvBuy('Developer Registration', 0)">
                  Register Now
                </button>
              </div>
              <div class="member-card-graphic">
                <div class="graphic-icon-box" style="background:rgba(255,255,255,0.15); color:#ffffff;">
                  ${renderIcon('building-2', 48)}
                </div>
              </div>
            </div>

            <!-- Card 2: Are you an Agent? -->
            <div class="member-banner-card agent-banner">
              <div class="member-card-content">
                <h3>Are you an Agent?</h3>
                <p>Create an agency profile and start listing your properties with Sarmayadar to generate verified buyer leads.</p>
                <button class="member-btn-white" onclick="window.handleAdvBuy('Agency Registration', 0)">
                  Register Now
                </button>
              </div>
              <div class="member-card-graphic">
                <div class="graphic-icon-box" style="background:rgba(255,255,255,0.15); color:#ffffff;">
                  ${renderIcon('users', 48)}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 10. Section: Get the Sarmayadar App -->
      <section class="container" style="margin: 3.5rem auto;">
        <div class="app-download-banner">
          <div class="app-banner-left">
            <h2 class="app-title">
              Get the Sarmayadar App
              <span class="app-coming-soon-badge">COMING SOON</span>
            </h2>
            <p class="app-subtitle">Search for properties anytime, anywhere in Pakistan with instant lead notifications. Launching soon on iOS & Android!</p>
            
            <div class="store-badges-row">
              <button type="button" class="store-badge-btn disabled" onclick="window.showToast && window.showToast('🚀 Sarmayadar Mobile App is coming soon to Google Play!')">
                ${renderIcon('play-store', 20)} Google Play (Coming Soon)
              </button>
              <button type="button" class="store-badge-btn disabled" onclick="window.showToast && window.showToast('🚀 Sarmayadar Mobile App is coming soon to Apple App Store!')">
                ${renderIcon('apple', 20)} App Store (Coming Soon)
              </button>
            </div>
          </div>

          <div class="app-banner-right">
            <div class="qr-code-box">
              <div class="qr-placeholder">
                <div class="qr-matrix"></div>
                <div class="qr-coming-overlay">COMING SOON</div>
              </div>
              <p class="qr-text">Scan to get early access when launched</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 11. Section: Our Brand Partners -->
      <section class="adv-main-section">
        <div class="container">
          <h3 class="partners-heading">Our Brand Partners</h3>
          <div class="brand-partners-slider">
            <div class="partner-logo-pill">
              <span class="partner-name">PARAGON</span>
            </div>
            <div class="partner-logo-pill">
              <span class="partner-name">DHA LAHORE</span>
            </div>
            <div class="partner-logo-pill">
              <span class="partner-name">BAHRIA TOWN</span>
            </div>
            <div class="partner-logo-pill">
              <span class="partner-name">CAPITAL SMART CITY</span>
            </div>
            <div class="partner-logo-pill">
              <span class="partner-name">GULBERG GREEN</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  `;
}
