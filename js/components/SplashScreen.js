export function renderSplashScreen() {
  return `
    <div id="bismillah-preloader" style="
      position: fixed;
      inset: 0;
      z-index: 9999999;
      background: linear-gradient(135deg, #064E3B 0%, #0B2014 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      opacity: 1;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    ">
      <div class="bismillah-preloader-box" style="
        text-align: center;
        padding: 2.5rem 1.5rem;
        max-width: 90vw;
        animation: bismillahZoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      ">
        <!-- Main Bismillah Calligraphy Text -->
        <div class="bismillah-text" style="
          font-family: 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', 'Traditional Arabic', serif;
          font-size: clamp(2.2rem, 5.5vw, 3.6rem);
          font-weight: 700;
          color: #F2A71B;
          line-height: 1.4;
          margin-bottom: 1rem;
          text-shadow: 0 0 25px rgba(242, 167, 27, 0.45), 0 4px 15px rgba(0, 0, 0, 0.6);
          direction: rtl;
        ">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>

        <!-- Subtitle Branding Tag -->
        <div style="
          font-family: var(--font-body), sans-serif;
          font-size: 0.82rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 1.75rem;
        ">
          SARMAYADAR <span style="color:#F2A71B;">•</span> REAL ESTATE
        </div>

        <!-- Elegant Loading Progress Bar -->
        <div style="
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
        ">
          <div class="bismillah-progress-fill" style="
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #F2A71B, #10B981);
            border-radius: 10px;
            transition: width 0.9s cubic-bezier(0.4, 0, 0.2, 1);
          "></div>
        </div>
      </div>

      <style>
        @keyframes bismillahZoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      </style>
    </div>
  `;
}

export function triggerSplashAnimation() {
  const bar = document.querySelector('.bismillah-progress-fill');
  if (bar) bar.style.width = '100%';

  setTimeout(() => {
    const splash = document.getElementById('bismillah-preloader') || document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      splash.style.visibility = 'hidden';
      setTimeout(() => {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 500);
    }
  }, 1000);
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
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255,255,255,0.2);
        border-top: 4px solid #239C32;
        border-radius: 50%;
        animation: spinPreloader 0.8s linear infinite;
        margin-bottom: 0.75rem;
      "></div>
      <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">
        Loading Verified Properties...
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', preloaderHTML);

  setTimeout(() => {
    const el = document.getElementById('quick-page-preloader');
    if (el) el.remove();
    if (typeof callback === 'function') callback();
  }, 350);
}
