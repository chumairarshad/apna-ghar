/**
 * Sarmayadar Real Estate — Official Optimized Brand Logo Component
 * Pixel-perfect SVG vector rendering across all viewports, light/dark themes & print layouts.
 */

export function renderLogoMark(size = 36, theme = 'light', extraClass = 'logo-mark') {
  const isDark = theme === 'dark' || theme === 'white';
  
  const roofStroke = isDark ? '#FFFFFF' : '#083818';
  const leftFill = isDark ? '#10B981' : '#083818';
  const rightFill = isDark ? '#34D399' : '#008A3C';
  const windowFill = '#F59E0B';

  return `
    <svg class="${extraClass}" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">
      <!-- Peaked House Contour -->
      <path d="M12 84V38L50 12L88 38V84" stroke="${roofStroke}" stroke-width="7" stroke-linecap="square" stroke-linejoin="miter"/>
      <!-- 4-Pane Golden Window -->
      <rect x="42.5" y="24" width="6" height="6" rx="0.5" fill="${windowFill}"/>
      <rect x="51.5" y="24" width="6" height="6" rx="0.5" fill="${windowFill}"/>
      <rect x="42.5" y="33" width="6" height="6" rx="0.5" fill="${windowFill}"/>
      <rect x="51.5" y="33" width="6" height="6" rx="0.5" fill="${windowFill}"/>
      <!-- Left Column (Dark Forest / Mint) -->
      <path d="M20 50L45 64V82L20 96V50Z" fill="${leftFill}"/>
      <!-- Right Column (Vibrant Pakistan Emerald) -->
      <path d="M55 64L80 50V96L55 82V64Z" fill="${rightFill}"/>
    </svg>
  `.trim();
}

export function renderFullBrandLogo({
  size = 36,
  theme = 'light',
  showTagline = true,
  tagline = 'Pakistan Real Estate',
  navTarget = 'buy',
  className = 'logo',
  fontSize = '1.25rem'
} = {}) {
  const isDark = theme === 'dark' || theme === 'white';
  const wordColor = isDark ? '#FFFFFF' : 'var(--forest-dk, #083818)';
  const spanColor = isDark ? '#34D399' : 'var(--emerald, #008A3C)';
  const tagColor = isDark ? 'rgba(255,255,255,0.7)' : 'var(--meadow, #16A34A)';

  return `
    <a href="#" class="${className}" ${navTarget ? `data-nav="${navTarget}"` : ''} style="display:flex; align-items:center; gap:8px; text-decoration:none;">
      ${renderLogoMark(size, theme)}
      <div>
        <div class="logo-word" style="font-family:var(--font-display, 'Plus Jakarta Sans', sans-serif); font-weight:800; font-size:${fontSize}; color:${wordColor}; line-height:1; letter-spacing:-0.02em;">
          SARMAYA<span style="color:${spanColor};">DAR</span>
        </div>
        ${showTagline ? `<div class="logo-tagline" style="font-family:var(--font-mono, 'JetBrains Mono', monospace); font-size:0.58rem; color:${tagColor}; text-transform:uppercase; letter-spacing:0.5px; margin-top:2px; font-weight:600;">${tagline}</div>` : ''}
      </div>
    </a>
  `.trim();
}
