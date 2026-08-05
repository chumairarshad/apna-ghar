import { INITIAL_AGENTS } from '../data/agents.js';

export function renderAgentDirectory() {
  return `
    <section style="padding:4.5rem 0; background:var(--cream); border-top:3px solid var(--forest-dk);">
      <div class="container">
        <div class="section-head" style="margin-bottom:3rem;">
          <div>
            <span class="eyebrow">VERIFIED BROKERS & REAL ESTATE AGENCIES</span>
            <h2>Pakistani Agent Directory</h2>
          </div>
          <p>Connect with top certified real estate agents across DHA, Bahria Town, and major cities in Pakistan.</p>
        </div>

        <div class="agent-directory-grid">
          ${INITIAL_AGENTS.map(agent => renderProfessionalAgentCard(agent)).join('')}
        </div>

      </div>
    </section>
  `;
}

function renderProfessionalAgentCard(agent) {
  let badgeStyle = 'background:var(--forest-dk); color:var(--marigold);';
  if (agent.badge.includes('PLATINUM')) badgeStyle = 'background:var(--rani); color:var(--paper);';
  if (agent.badge.includes('GOLD')) badgeStyle = 'background:var(--marigold); color:var(--forest-dk);';

  return `
    <div style="background:var(--paper); border-radius:12px; border:2px solid var(--forest-dk); overflow:hidden; box-shadow:var(--shadow-soft); transition:transform 0.2s ease, box-shadow 0.2s ease; display:flex; flex-direction:column;" class="agent-card-hover">
      <!-- Card Top Accent Banner -->
      <div style="height:70px; background:linear-gradient(135deg, var(--forest-dk), var(--forest)); position:relative; padding:0.75rem 1rem; display:flex; justify-content:flex-end; align-items:flex-start;">
        <span class="badge" style="${badgeStyle} font-family:var(--font-mono); font-size:0.65rem; border:1px solid rgba(255,255,255,0.2);">
          <i data-lucide="shield-check" style="width:12px; height:12px; vertical-align:middle;"></i> ${agent.badge}
        </span>
      </div>

      <!-- Avatar Overlap -->
      <div style="padding:0 1.25rem 1.25rem; display:flex; flex-direction:column; align-items:center; text-align:center; flex-grow:1; margin-top:-38px;">
        <div style="position:relative; margin-bottom:0.75rem;">
          <img src="${agent.avatar}" style="width:5rem; height:5rem; border-radius:50%; object-fit:cover; border:3.5px solid var(--paper); box-shadow:var(--shadow-md); background:var(--forest-dk);" alt="${agent.name}" />
          <span style="position:absolute; bottom:2px; right:2px; background:#22C55E; border:2px solid var(--paper); width:14px; height:14px; border-radius:50%;" title="Online / Verified"></span>
        </div>

        <h3 style="font-family:var(--font-display); font-size:1.1rem; color:var(--forest-dk); line-height:1.25; margin-bottom:0.25rem; height:2.7rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
          ${agent.name}
        </h3>

        <div style="font-size:0.85rem; font-weight:700; color:var(--ink); margin-bottom:0.25rem;">
          Lead: ${agent.leadPerson}
        </div>

        <div style="font-family:var(--font-mono); font-size:0.78rem; color:var(--forest); opacity:0.85; margin-bottom:1rem; display:flex; align-items:center; gap:0.25rem;">
          <i data-lucide="map-pin" style="width:13px; height:13px; color:var(--rani);"></i> ${agent.city}
        </div>

        <!-- Meta Stats Box -->
        <div style="background:var(--cream); border:1.5px dashed var(--border-dk); border-radius:8px; padding:0.6rem 0.85rem; width:100%; font-family:var(--font-mono); font-size:0.78rem; font-weight:700; color:var(--forest-dk); margin-bottom:1rem; display:flex; justify-content:space-around; align-items:center;">
          <div>
            <span style="display:block; font-size:0.65rem; color:var(--forest); opacity:0.7; font-weight:600;">ACTIVE LISTINGS</span>
            <span style="color:var(--forest-dk); font-size:0.95rem;">${agent.activeListingsCount}</span>
          </div>
          <div style="width:1px; height:24px; background:var(--border-dk);"></div>
          <div>
            <span style="display:block; font-size:0.65rem; color:var(--forest); opacity:0.7; font-weight:600;">RATING</span>
            <span style="color:var(--marigold-dk); font-size:0.95rem;">★ ${agent.rating}</span>
          </div>
        </div>

        <!-- Specialities Chips -->
        <div style="display:flex; flex-wrap:wrap; gap:4px; justify-content:center; margin-bottom:1.25rem;">
          ${agent.specialities.map(s => `<span class="chip" style="font-size:0.62rem; padding:3px 8px;">${s}</span>`).join('')}
        </div>

        <!-- Action CTAs -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; width:100%; margin-top:auto;">
          <a href="tel:${agent.phone}" class="btn btn-dark btn-sm" style="padding:0.5rem 0.4rem; font-size:0.78rem;" title="Call ${agent.name}">
            <i data-lucide="phone" style="width:14px; height:14px;"></i> Call
          </a>
          <a href="https://wa.me/${agent.whatsapp}?text=Hi%20${encodeURIComponent(agent.name)},%20I%20found%20your%20agency%20on%20Apna%20Ghar." 
             target="_blank" 
             class="btn btn-whatsapp btn-sm" 
             style="padding:0.5rem 0.4rem; font-size:0.78rem;" 
             title="WhatsApp Chat">
            <i data-lucide="message-circle" style="width:14px; height:14px;"></i> WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;
}
