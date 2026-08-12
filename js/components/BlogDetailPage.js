import { renderIcon } from '../utils/icons.js';

export function renderBlogDetailPage(state) {
  const articleId = state.selectedArticleId || (state.selectedArticle ? state.selectedArticle.id : null);
  const blogs = state.blogsList || [];
  const article = blogs.find(b => String(b.id) === String(articleId)) || state.selectedArticle;

  if (!article) {
    return `
      <div class="container" style="padding: 4rem 1rem; text-align: center; min-height: 60vh;">
        <div style="max-width: 500px; margin: 0 auto; background: var(--paper); padding: 2.5rem; border-radius: 16px; border: 2px solid var(--border-dk); box-shadow: var(--shadow-md);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📰</div>
          <h2 style="color: var(--forest-dk); font-size: 1.5rem; margin-bottom: 0.5rem;">Article Not Found</h2>
          <p style="color: var(--forest); opacity: 0.8; font-size: 0.9rem; margin-bottom: 1.5rem;">The article you are looking for may have been moved or removed.</p>
          <a href="#blogs" class="btn btn-dark" style="padding: 0.75rem 1.5rem; border-radius: 8px;">← Back to Real Estate News</a>
        </div>
      </div>
    `;
  }

  const category = article.badge || article.category || 'MARKET ANALYSIS';
  const readTime = article.readTime || '5 min read';
  const author = article.author || 'Sarmayadar Editorial Board';
  const fullText = article.fullText || article.content || article.snippet || 'Full article text...';
  const image = article.images?.[0] || article.image || article.img || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80';

  const relatedArticles = blogs.filter(b => String(b.id) !== String(article.id)).slice(0, 3);

  return `
    <div class="blog-detail-page-wrapper" style="background: var(--cream); min-height: 90vh; padding: 2rem 0 4rem 0;">
      <div class="container" style="max-width: 860px;">
        
        <!-- Breadcrumbs & Back Navigation -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.75rem;">
          <nav aria-label="breadcrumb">
            <ol style="display: flex; align-items: center; gap: 8px; list-style: none; padding: 0; margin: 0; font-size: 0.85rem; font-weight: 700; color: var(--forest-dk);">
              <li><a href="#buy" style="color: var(--rani-dk); text-decoration: none;">Home</a></li>
              <li style="color: var(--forest); opacity: 0.5;">/</li>
              <li><a href="#blogs" style="color: var(--rani-dk); text-decoration: none;">Real Estate News</a></li>
              <li style="color: var(--forest); opacity: 0.5;">/</li>
              <li style="color: var(--forest-dk); text-overflow: ellipsis; max-width: 220px; overflow: hidden; white-space: nowrap;">${article.title}</li>
            </ol>
          </nav>

          <a href="#blogs" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700; background: var(--paper); border: 2px solid var(--forest-dk); border-radius: 8px; padding: 6px 14px; text-decoration: none; color: var(--forest-dk);">
            ${renderIcon('arrow-left', 14)} Back to All Articles
          </a>
        </div>

        <!-- Main Article Container Card -->
        <article style="background: var(--paper); border-radius: 20px; border: 3px solid var(--forest-dk); box-shadow: var(--shadow-lg); overflow: hidden; margin-bottom: 3rem;">
          
          <!-- Article Header -->
          <div style="padding: 2.25rem 2.25rem 1.5rem 2.25rem; border-bottom: 2px solid var(--border-dk);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; flex-wrap: wrap;">
              <span class="badge" style="background: var(--rani); color: white; font-weight: 800; font-size: 0.75rem; padding: 4px 12px; border-radius: 6px;">
                ${category}
              </span>
              <span style="font-size: 0.82rem; color: var(--forest); font-weight: 700; opacity: 0.85; display: flex; align-items: center; gap: 4px;">
                ${renderIcon('clock', 14)} ${readTime}
              </span>
              <span style="font-size: 0.82rem; color: var(--forest); font-weight: 700; opacity: 0.85;">
                • ${article.date || 'Aug 2026'}
              </span>
            </div>

            <h1 style="font-size: 2.2rem; color: var(--forest-dk); line-height: 1.25; font-weight: 800; margin-bottom: 1rem;">
              ${article.title}
            </h1>

            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; pt-2;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--forest-dk); color: var(--marigold); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; border: 2px solid var(--marigold);">
                  ✍️
                </div>
                <div>
                  <div style="font-weight: 800; color: var(--forest-dk); font-size: 0.95rem;">${author}</div>
                  <div style="font-size: 0.78rem; color: var(--forest); opacity: 0.8;">Sarmayadar Real Estate Advisory Board</div>
                </div>
              </div>

              <!-- Social Share Bar -->
              <div style="display: flex; gap: 8px;">
                <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + window.location.href)}" target="_blank" class="social-icon-btn" title="Share on WhatsApp" style="background: #25D366; color: white;">
                  ${renderIcon('message-circle', 16)}
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="social-icon-btn" title="Share on Facebook" style="background: #1877F2; color: white;">
                  ${renderIcon('facebook', 16)}
                </a>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="social-icon-btn" title="Share on Twitter" style="background: #1DA1F2; color: white;">
                  ${renderIcon('twitter', 16)}
                </a>
              </div>
            </div>
          </div>

          <!-- Featured Cover Image -->
          <div style="position: relative;">
            <img src="${image}" alt="${article.title}" style="width: 100%; height: 420px; object-fit: cover;" />
          </div>

          <!-- Formatted Article Content Body -->
          <div style="padding: 2.5rem 2.25rem; font-size: 1.05rem; line-height: 1.85; color: var(--ink);">
            <div style="background: var(--cream); border-left: 4px solid var(--marigold); padding: 1.25rem; border-radius: 8px; font-weight: 700; color: var(--forest-dk); margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.6;">
              💡 <strong>Key Summary:</strong> ${article.snippet || article.description || 'Essential market insights for Pakistani property buyers, sellers, and real estate investors.'}
            </div>

            <div>
              ${fullText.includes('<p>') ? fullText : `<p>${fullText.replace(/\n\n/g, '</p><p>')}</p>`}
            </div>
          </div>

        </article>

        <!-- Related Articles Grid Section -->
        ${relatedArticles.length > 0 ? `
          <div style="margin-top: 3rem;">
            <h3 style="font-size: 1.5rem; color: var(--forest-dk); font-weight: 800; margin-bottom: 1.5rem;">
              Related Real Estate News & Insights
            </h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
              ${relatedArticles.map(rel => `
                <div class="blog-card" style="background: var(--paper); border-radius: 14px; border: 2px solid var(--border-dk); overflow: hidden; box-shadow: var(--shadow-sm); cursor: pointer;" data-id="${rel.id}">
                  <img src="${rel.images?.[0] || rel.img || rel.image}" alt="${rel.title}" style="width: 100%; height: 160px; object-fit: cover;" />
                  <div style="padding: 1.25rem;">
                    <span class="badge" style="background: rgba(209,38,110,0.1); color: var(--rani-dk); font-weight: 800; font-size: 0.7rem; margin-bottom: 6px; display: inline-block;">
                      ${rel.badge || 'NEWS'}
                    </span>
                    <h4 style="font-size: 1rem; color: var(--forest-dk); font-weight: 800; line-height: 1.3; margin-bottom: 0.5rem;">
                      ${rel.title}
                    </h4>
                    <p style="font-size: 0.82rem; color: var(--forest); opacity: 0.8; line-height: 1.5; margin: 0;">
                      ${rel.snippet ? rel.snippet.substring(0, 85) + '...' : ''}
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}
