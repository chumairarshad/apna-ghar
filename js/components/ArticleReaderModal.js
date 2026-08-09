import { renderIcon } from '../utils/icons.js';

export function renderArticleReaderModal(state) {
  const isVisible = state.showArticleModal || false;
  const article = state.selectedArticle;

  if (!article) return `<div id="article-modal-overlay"></div>`;

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="article-modal-overlay">
      <div class="modal-container" style="max-width:760px;">
        <div class="modal-header" style="background:var(--forest-dk); color:var(--paper);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            ${renderIcon('book-open', 20, 'var(--marigold)')}
            <h3 class="modal-title" style="color:var(--paper); font-size:1.1rem;">${article.badge}</h3>
          </div>
          <button class="close-modal-btn" id="close-article-btn" style="color:var(--paper);">&times;</button>
        </div>

        <div class="modal-body" style="padding:1.5rem;">
          <img src="${article.img}" style="width:100%; height:260px; object-fit:cover; border-radius:10px; margin-bottom:1.25rem; border:2px solid var(--forest-dk);" />

          <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--forest); opacity:0.8; margin-bottom:0.5rem;">
            📅 Published ${article.date} • ${article.readTime}
          </div>

          <h2 style="font-family:var(--font-display); font-size:1.5rem; color:var(--forest-dk); line-height:1.25; margin-bottom:1rem;">
            ${article.title}
          </h2>

          <p style="font-size:0.95rem; color:var(--ink); line-height:1.7; margin-bottom:1.5rem;">
            ${article.fullText}
          </p>

          <div style="background:var(--cream); border:1.5px solid var(--border-dk); border-radius:8px; padding:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--forest-dk);">
              Need expert tax advice or society investment guidance?
            </div>
            <a href="https://wa.me/923008472910?text=Hi%20Sarmayadar,%20I%20read%20your%20article:%20${encodeURIComponent(article.title)}" target="_blank" class="btn btn-whatsapp btn-sm">
              ${renderIcon('message-circle', 14)} Ask Real Estate Legal Consultant
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}
