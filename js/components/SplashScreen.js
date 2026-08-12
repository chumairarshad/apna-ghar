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
  const splash = document.getElementById('bismillah-preloader') || document.getElementById('splash-screen');
  if (splash) {
    splash.style.opacity = '0';
    splash.style.visibility = 'hidden';
    if (splash.parentNode) splash.parentNode.removeChild(splash);
  }
}

export function triggerQuickPagePreloader(callback) {
  if (typeof callback === 'function') callback();
}
