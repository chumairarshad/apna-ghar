export function renderSplashScreen() {
  return `
    <div id="splash-screen" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: var(--forest-dk);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--paper);
      font-family: var(--font-display);
      transition: opacity 0.5s ease, visibility 0.5s ease;
    ">
      <!-- Animated House Emblem with Looking Eyes -->
      <div style="position:relative; margin-bottom:1.5rem;" class="splash-logo-pulse">
        <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 20px rgba(242, 167, 27, 0.5));">
          <rect width="100" height="100" rx="18" fill="#faf1de"/>
          <path d="M50 14L16 42V84H84V42L50 14Z" fill="#131d0c"/>
          
          <!-- Animated Eyes Background Circles -->
          <circle cx="38" cy="46" r="11" fill="#FFF"/>
          <circle cx="62" cy="46" r="11" fill="#FFF"/>

          <!-- Animated Moving Pupils -->
          <g class="animated-pupils-group">
            <circle cx="38" cy="46" r="5.5" fill="#131d0c"/>
            <circle cx="39.5" cy="44.5" r="2" fill="#FFF"/>
            
            <circle cx="62" cy="46" r="5.5" fill="#131d0c"/>
            <circle cx="63.5" cy="44.5" r="2" fill="#FFF"/>
          </g>

          <path d="M42 84V64H58V84H42Z" fill="#d1266e"/>
        </svg>
      </div>

      <!-- Brand Title -->
      <h1 style="font-size:2.4rem; color:var(--paper); letter-spacing:-0.03em; margin-bottom:0.25rem;">
        APNA<span style="color:var(--rani);">GHAR</span>
      </h1>

      <p style="font-family:var(--font-mono); font-size:0.8rem; color:var(--marigold); text-transform:uppercase; letter-spacing:0.15em; margin-bottom:2rem; text-align:center;">
        Pakistan Real Estate & Verified Dealer Exchange
      </p>

      <!-- Progress Shimmer Bar -->
      <div style="width:240px; height:4px; background:rgba(255,255,255,0.15); border-radius:10px; overflow:hidden; position:relative;">
        <div class="splash-bar-progress" style="height:100%; width:0%; background:linear-gradient(90deg, var(--marigold), var(--rani)); border-radius:10px; transition:width 1.2s cubic-bezier(0.4, 0, 0.2, 1);"></div>
      </div>
    </div>
  `;
}

export function triggerSplashAnimation() {
  setTimeout(() => {
    const bar = document.querySelector('.splash-bar-progress');
    if (bar) bar.style.width = '100%';
  }, 100);

  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      splash.style.visibility = 'hidden';
      setTimeout(() => splash.remove(), 500);
    }
  }, 1400);
}
