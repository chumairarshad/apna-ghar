import { renderIcon } from '../utils/icons.js';

export function renderNewsSection() {
  const articles = [
    {
      id: 'news-1',
      badge: 'FBR TAXES 2026',
      badgeClass: 'badge-featured',
      title: 'FBR Property Tax & Capital Gains Guide (Filer vs Non-Filer)',
      date: 'Aug 2026',
      readTime: '4 min read',
      img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      snippet: 'Complete breakdown of Filer (3%) vs Non-Filer (10.5%) withholding tax rates, Section 7E wealth tax, and Stamp Duty on buying & selling properties in Pakistan.',
      fullText: `FBR has updated income tax withholding rates under Sections 236C (Seller) and 236K (Buyer) for FY 2025-26. Active Tax Filers pay a reduced 3% tax rate on property transactions, whereas Non-Filers face 10.5% advance tax. Additionally, Section 7E imposes a 1% tax on deemed rental income of un-utilized properties valued above PKR 2.5 Crore.`
    },
    {
      id: 'news-2',
      badge: 'INVESTMENT ANALYSIS',
      badgeClass: 'badge-hot',
      title: 'DHA vs Bahria Town: Where Should You Invest in 2026?',
      date: 'Jul 2026',
      readTime: '6 min read',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      snippet: 'Comparative analysis of ROI, rental yields, possession timelines, and resale velocity between DHA Lahore Phase 6/8 and Bahria Town Sector F.',
      fullText: `DHA continues to lead capital appreciation with 14.8% annual ROI driven by overseas Pakistani demand and corporate leases. Bahria Town offers superior commercial rental yields (up to 9.2%) and immediate possession for end-users seeking ready infrastructure.`
    },
    {
      id: 'news-3',
      badge: 'DEVELOPMENT UPDATE',
      badgeClass: 'badge-new',
      title: 'Rawalpindi Ring Road & Motorway Interchange Impact',
      date: 'Jul 2026',
      readTime: '5 min read',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      snippet: 'How the new Rawalpindi Ring Road interchange is driving massive appreciation for housing societies near M-2 Motorway and Airport corridor.',
      fullText: `The inauguration of the 38km Rawalpindi Ring Road economic corridor has slashed heavy transport travel time between N-5 and M-2 Motorway, triggering a 28% surge in land valuation for adjacent housing projects in Rawalpindi and Islamabad West.`
    }
  ];

  return `
    <section style="padding:4rem 0; background-color:var(--paper); border-top:3px solid var(--forest-dk);">
      <div class="container">
        <!-- Section Header -->
        <div class="section-head" style="margin-bottom:2rem;">
          <div>
            <span class="eyebrow">${renderIcon('book-open', 14, 'var(--rani-dk)')} MARKET INSIGHTS & FBR TAX GUIDE</span>
            <h2 style="font-size:clamp(1.7rem, 3vw, 2.5rem); margin-top:0.4rem; color:var(--forest-dk);">
              Pakistani Real Estate News & Advice
            </h2>
          </div>
          <p style="font-size:0.95rem; color:var(--forest); opacity:0.85; max-width:480px;">
            Stay updated on property tax laws, transfer fees, society approvals, and high-yield investment options across Pakistan.
          </p>
        </div>

        <!-- 3 Mobile-Optimized Blog Cards Grid -->
        <div class="blog-cards-grid">
          ${articles.map(art => `
            <div class="news-card">
              <!-- Card Cover Image Media -->
              <div class="news-card-media">
                <img src="${art.img}" alt="${art.title}" class="news-img-hover" loading="lazy" />
                
                <span class="badge ${art.badgeClass} news-badge">
                  ${art.badge}
                </span>
              </div>

              <!-- Card Body Content -->
              <div class="news-card-body">
                <div class="news-meta">
                  <span>📅 ${art.date}</span>
                  <span>•</span>
                  <span>⏱️ ${art.readTime}</span>
                </div>

                <h3 class="news-title">
                  ${art.title}
                </h3>

                <p class="news-snippet">
                  ${art.snippet}
                </p>

                <!-- Action Button -->
                <button type="button" class="btn btn-ghost btn-sm read-article-btn" data-id="${art.id}">
                  <span>Read Full Article</span>
                  <span>&rarr;</span>
                </button>
              </div>

            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
