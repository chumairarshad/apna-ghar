import { renderIcon } from '../utils/icons.js';
import { formatPKR, formatArea } from '../utils/formatters.js';

export function renderFeaturedPage(state, rawProperties = []) {
  // Filter for featured & hot deal properties
  const featuredProperties = (rawProperties || []).filter(p => 
    p.featured || p.isHot || p.isSuperHot || p.badge === 'PLATINUM' || p.badge === 'SUPER HOT'
  );

  // If fallback array empty, use initial featured set
  const displayProperties = featuredProperties.length > 0 ? featuredProperties : [
    {
      id: 'prop-1',
      title: '10 Marla Ultra-Modern Smart Automation Villa',
      location: 'DHA Lahore Phase 9 Prism',
      city: 'Lahore',
      price: 48000000,
      size: '10 Marla',
      beds: 5,
      baths: 6,
      type: 'House',
      badge: 'PLATINUM',
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'],
      agency: { name: 'Chaudhry Real Estate', logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' }
    },
    {
      id: 'prop-2',
      title: '1 Kanal Executive Lake View Plot — Overseas Prime II',
      location: 'Capital Smart City Islamabad',
      city: 'Islamabad',
      price: 18500000,
      size: '1 Kanal',
      type: 'Plot',
      badge: 'HOT DEAL',
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'],
      agency: { name: 'Capital Estate', logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' }
    },
    {
      id: 'prop-3',
      title: 'Luxury 3-Bedroom Penthouse with Private Terrace',
      location: 'Emaar Oceanfront, Phase 8 DHA',
      city: 'Karachi',
      price: 65000000,
      size: '2800 Sq. Ft.',
      beds: 3,
      baths: 4,
      type: 'Apartment',
      badge: 'SUPER HOT',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'],
      agency: { name: 'Oceanfront Realty', logo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }
    }
  ];

  return `
    <div class="featured-ads-page-wrapper" style="background:#F8FAFC; min-height:90vh; padding: 2.5rem 1rem 5rem 1rem;">
      <style>
        .featured-ads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .featured-ads-page-wrapper {
            padding: 1rem 0.5rem 3rem 0.5rem !important;
          }
          .featured-ads-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
      </style>

      <div class="container" style="max-width: 1400px; margin: 0 auto;">
        
        <!-- Page Header Banner -->
        <div style="background: linear-gradient(135deg, #04382B 0%, #064E3B 55%, #0B6E53 100%); border-radius:24px; padding: 2.5rem 2rem; color:#FFFFFF; margin-bottom: 2.5rem; position:relative; overflow:hidden; box-shadow: 0 15px 35px rgba(6,78,59,0.25);">
          <div style="position:relative; z-index:2; max-width:800px;">
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.3); color:#34D399; font-weight:800; font-size:0.78rem; padding:5px 16px; border-radius:50px; text-transform:uppercase; letter-spacing:1px; margin-bottom:1rem;">
              ⭐ PREMIUM SPONSORED PROPERTIES
            </div>
            <h1 style="font-family:var(--font-display); font-size:clamp(1.8rem, 3.5vw, 2.8rem); font-weight:800; color:#FFFFFF; line-height:1.2; margin:0 0 0.75rem 0;">
              Pakistan's Top Featured Real Estate Showcase
            </h1>
            <p style="font-size:1.05rem; color:rgba(255,255,255,0.9); line-height:1.6; margin:0 0 1.5rem 0;">
              Browse verified platinum villas, lake view plots, luxury penthouses, and commercial towers spotlighted by Pakistan's leading verified estate agencies.
            </p>
            <div style="display:flex; gap:1rem; flex-wrap:wrap;">
              <a href="/advertise" data-nav="advertise" class="btn" style="background:#F2A71B; color:#0F172A; font-weight:900; font-size:0.95rem; padding:12px 24px; border-radius:12px; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 15px rgba(242,167,27,0.4);">
                ⚡ Feature Your Property Listing
              </a>
            </div>
          </div>
        </div>

        <!-- Featured Listings Count Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.75rem;">
          <h2 style="font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:#0F172A; margin:0;">
            Active Featured Ads (${displayProperties.length})
          </h2>
          <span style="font-size:0.88rem; font-weight:700; color:#059669; background:#ECFDF5; padding:6px 14px; border-radius:20px; border:1px solid #A7F3D0;">
            ✅ 100% Verified Agency Listings
          </span>
        </div>

        <!-- Featured Listings Grid -->
        <div class="featured-ads-grid">
          ${displayProperties.map(prop => `
            <div style="background:#FFFFFF; border-radius:18px; border:2px solid #239C32; overflow:hidden; box-shadow:0 8px 25px rgba(0,0,0,0.06); display:flex; flex-direction:column; position:relative; transition:transform 0.25s ease;">
              
              <!-- Cover Image -->
              <div style="position:relative; height:220px; overflow:hidden; background:#0F172A;">
                <img src="${prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'}" alt="${prop.title}" style="width:100%; height:100%; object-fit:cover;" />
                
                <!-- Badge -->
                <div style="position:absolute; top:12px; right:12px; background:#F2A71B; color:#0F172A; font-family:var(--font-body); font-size:0.7rem; font-weight:900; padding:4px 12px; border-radius:20px; letter-spacing:0.5px; z-index:2; box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                  ⭐ ${prop.badge || 'PLATINUM'}
                </div>

                <!-- Price Tag Overlay -->
                <div style="position:absolute; bottom:12px; left:12px; background:linear-gradient(135deg, #239C32 0%, #1B7A30 100%); color:#FFFFFF; font-family:var(--font-body); font-size:1.15rem; font-weight:900; padding:5px 14px; border-radius:8px; box-shadow:0 4px 14px rgba(0,0,0,0.3);">
                  ${formatPKR(prop.price)}
                </div>
              </div>

              <!-- Content Body -->
              <div style="padding:1.4rem; display:flex; flex-direction:column; flex-grow:1; justify-content:space-between;">
                <div>
                  <div style="font-size:0.75rem; color:#059669; font-weight:800; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:0.35rem;">
                    📍 ${prop.location || prop.city}
                  </div>

                  <h3 style="font-size:1.15rem; font-weight:800; color:#0F172A; line-height:1.35; margin-bottom:0.5rem;">
                    ${prop.title}
                  </h3>

                  <div style="display:flex; gap:12px; font-size:0.85rem; font-weight:700; color:#475569; margin-bottom:1rem;">
                    ${prop.size ? `<span>📐 ${prop.size}</span>` : ''}
                    ${prop.beds ? `<span>🛏️ ${prop.beds} Beds</span>` : ''}
                    ${prop.baths ? `<span>🛁 ${prop.baths} Baths</span>` : ''}
                  </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1.5px dashed #E2E8F0; flex-wrap:wrap; gap:0.6rem;">
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <img src="${prop.agency?.logo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'}" style="width:34px; height:34px; border-radius:50%; border:2px solid #239C32; object-fit:cover;" />
                    <div>
                      <div style="font-size:0.8rem; font-weight:800; color:#0F172A;">${prop.agency?.name || 'Verified Agency'}</div>
                      <div style="font-size:0.7rem; color:#059669; font-weight:700;">Verified Dealer</div>
                    </div>
                  </div>

                  <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                    <a href="/property/${prop.id}" data-id="${prop.id}" class="btn btn-sm view-property-detail-btn" style="background:#064E3B; color:#FFFFFF; font-weight:800; padding:7px 14px; font-size:0.8rem; border-radius:8px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; box-shadow:0 3px 10px rgba(6,78,59,0.2);">
                      ${renderIcon('eye', 14, '#FFFFFF')} 👁️ View Details
                    </a>
                    <button type="button" class="fancy-360-btn open-tour-btn" data-id="${prop.id}">
                      ${renderIcon('sparkles', 12, '#F2A71B')} 360°
                    </button>
                  </div>
                </div>
              </div>

            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
}
