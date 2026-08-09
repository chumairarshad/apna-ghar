export function renderSplashScreen() {
  return `
    <div id="splash-screen" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #0d2a12 0%, #155021 100%);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-family: var(--font-display);
      transition: opacity 0.4s ease, visibility 0.4s ease;
    ">
      <!-- Animated Emblem Wrapper with Rotating Green Spinner Ring -->
      <div style="position:relative; width:110px; height:110px; margin-bottom:1.5rem; display:flex; align-items:center; justify-content:center;">
        <!-- Outer Spinner Ring -->
        <div class="preloader-spinner-ring" style="
          position: absolute;
          inset: 0;
          border: 4px solid rgba(255, 255, 255, 0.15);
          border-top: 4px solid #239C32;
          border-right: 4px solid #F2A71B;
          border-radius: 50%;
          animation: spinPreloader 1.2s linear infinite;
        "></div>

        <!-- House Emblem SVG -->
        <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 16px rgba(35, 156, 50, 0.6)); position:relative; z-index:2;">
          <rect width="100" height="100" rx="18" fill="#FFFFFF"/>
          <path d="M50 14L16 42V84H84V42L50 14Z" fill="#14521F"/>
          
          <!-- Eyes -->
          <circle cx="38" cy="46" r="11" fill="#FFF"/>
          <circle cx="62" cy="46" r="11" fill="#FFF"/>

          <!-- Moving Pupils -->
          <g class="animated-pupils-group">
            <circle cx="38" cy="46" r="5.5" fill="#14521F"/>
            <circle cx="39.5" cy="44.5" r="2" fill="#FFF"/>
            
            <circle cx="62" cy="46" r="5.5" fill="#14521F"/>
            <circle cx="63.5" cy="44.5" r="2" fill="#FFF"/>
          </g>

          <path d="M42 84V64H58V84H42Z" fill="#239C32"/>
        </svg>
      </div>

      <!-- Brand Title -->
      <h1 style="font-size:2.2rem; font-weight:800; color:#FFFFFF; letter-spacing:-0.03em; margin-bottom:0.25rem;">
        SARMAYA<span style="color:#239C32;">DAR</span>
      </h1>

      <p style="font-family:var(--font-mono); font-size:0.78rem; color:#F2A71B; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:2rem; text-align:center; font-weight:600;">
        Pakistan Real Estate & Verified Investment Exchange
      </p>

      <!-- Progress Shimmer Bar -->
      <div style="width:240px; height:5px; background:rgba(255,255,255,0.15); border-radius:10px; overflow:hidden; position:relative;">
        <div class="splash-bar-progress" style="height:100%; width:0%; background:linear-gradient(90deg, #F2A71B, #239C32); border-radius:10px; transition:width 1s cubic-bezier(0.4, 0, 0.2, 1);"></div>
      </div>

      <!-- Keyframe Animation Styles -->
      <style>
        @keyframes spinPreloader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;
}

export function triggerSplashAnimation() {
  setTimeout(() => {
    const bar = document.querySelector('.splash-bar-progress');
    if (bar) bar.style.width = '100%';
  }, 50);

  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      splash.style.visibility = 'hidden';
      setTimeout(() => splash.remove(), 400);
    }
  }, 1100);
}

export function triggerQuickPagePreloader(callback) {
  let existing = document.getElementById('quick-page-preloader');
  if (existing) existing.remove();

  const preloaderHTML = `
    <div id="quick-page-preloader" style="
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(6px);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      animation: fadeIn 0.15s ease-out;
    ">
      <div style="
        width: 54px;
        height: 54px;
        border: 4px solid rgba(255,255,255,0.2);
        border-top: 4px solid #239C32;
        border-radius: 50%;
        animation: spinPreloader 0.8s linear infinite;
        margin-bottom: 0.75rem;
      "></div>
      <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">
        Fetching Verified Listings...
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', preloaderHTML);

  setTimeout(() => {
    const el = document.getElementById('quick-page-preloader');
    if (el) el.remove();
    if (typeof callback === 'function') callback();
  }, 400);
}
