import { renderIcon } from '../utils/icons.js';

export function renderArticleReaderModal(state) {
  const isVisible = state.showArticleModal || false;
  const article = state.selectedArticle;

  if (!article) return `<div id="article-modal-overlay"></div>`;

  const coverImg = article.img || article.image || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80';
  const fullTextContent = article.fullText || article.content || article.snippet || '';

  return `
    <div class="modal-overlay ${isVisible ? 'active' : ''}" id="article-modal-overlay">
      <div class="modal-container" style="max-width: 780px; border-radius: 16px; border: 3px solid var(--forest-dk); overflow: hidden;">
        
        <!-- Header -->
        <div class="modal-header" style="background: var(--forest-dk); color: var(--paper); padding: 1.25rem 1.5rem; border-bottom: 3px solid var(--marigold);">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${renderIcon('book-open', 20, 'var(--marigold)')}
            <h3 class="modal-title" style="color: var(--paper); font-size: 1.1rem; font-family: var(--font-display);">
              ${article.badge || 'MARKET INSIGHT'}
            </h3>
          </div>
          <button class="close-modal-btn" id="close-article-btn" style="color: var(--paper); background: rgba(255,255,255,0.1); width: 36px; height: 36px;">&times;</button>
        </div>

        <!-- Body -->
        <div class="modal-body" style="padding: 1.75rem; background: var(--paper); max-height: 80vh; overflow-y: auto;">
          
          <div style="position: relative; margin-bottom: 1.5rem;">
            <img src="${coverImg}" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 12px; border: 2px solid var(--border-dk); box-shadow: var(--shadow-sm);" alt="${article.title}" />
            <span class="badge" style="position: absolute; bottom: 12px; right: 12px; background: rgba(19, 29, 12, 0.88); color: var(--marigold); border: 1.5px solid var(--marigold); font-size: 0.72rem; padding: 4px 10px; border-radius: 6px;">
              🛡️ SARMAYADAR VERIFIED
            </span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.78rem; color: var(--forest); opacity: 0.9; margin-bottom: 0.75rem; background: var(--cream); padding: 8px 14px; border-radius: 8px;">
            <div>
              📅 ${article.date} • ⏱️ ${article.readTime || '5 min read'} • ✍️ ${article.author || 'Sarmayadar Editorial Board'}
            </div>
            <div>
              <button type="button" class="btn btn-ghost btn-sm share-article-btn" data-title="${article.title}" style="padding: 2px 8px; font-weight: 700; color: var(--forest-dk); font-size: 0.75rem;">
                🔗 Share Article
              </button>
            </div>
          </div>

          <h2 style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--forest-dk); line-height: 1.3; margin-bottom: 1.25rem;">
            ${article.title}
          </h2>

          <div style="font-size: 0.98rem; color: var(--ink); line-height: 1.8; white-space: pre-line; margin-bottom: 2rem;">
            ${fullTextContent}
          </div>

          <!-- Bottom CTA Banner -->
          <div style="background: linear-gradient(135deg, var(--forest-dk) 0%, #0d3814 100%); border-radius: 12px; padding: 1.25rem 1.5rem; color: var(--paper); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-left: 4px solid var(--marigold); box-shadow: var(--shadow-md);">
            <div>
              <h4 style="font-family: var(--font-display); font-size: 1.05rem; margin-bottom: 2px; color: var(--paper);">
                Have Questions About Pakistani Property Laws?
              </h4>
              <p style="font-size: 0.85rem; color: rgba(255,255,255,0.85); margin: 0;">
                Connect directly with certified property advisors on WhatsApp.
              </p>
            </div>
            <a href="https://wa.me/923327507866?text=Hi%20Sarmayadar,%20I%20read%20your%20article:%20${encodeURIComponent(article.title)}" target="_blank" class="btn btn-whatsapp btn-sm" style="padding: 10px 18px; font-weight: 800; font-size: 0.88rem; border-radius: 8px;">
              ${renderIcon('message-circle', 16)} Ask Real Estate Consultant
            </a>
          </div>

        </div>
      </div>
    </div>
  `;
}
