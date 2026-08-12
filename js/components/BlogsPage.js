import { renderIcon } from '../utils/icons.js';
import { t } from '../utils/i18n.js';

export function renderBlogsPage(state) {
  const blogs = state.blogsList || [];
  const activeCategory = state.selectedBlogCategory || 'ALL';
  const searchQuery = (state.blogSearchQuery || '').toLowerCase().trim();
  const isAdmin = state.user?.role === 'ADMIN';

  // Categories list
  const categories = [
    { id: 'ALL', label: t('all_categories', 'All Articles') },
    { id: 'FBR TAXES', label: 'FBR Tax & Legal' },
    { id: 'INVESTMENT', label: 'High ROI Investment' },
    { id: 'MEGAPROJECTS', label: 'Society & Megaprojects' },
    { id: 'ADVICE', label: 'Buying & Selling Advice' }
  ];

  // Filtered blogs
  let filtered = blogs.filter(b => b.status !== 'DRAFT');

  if (activeCategory !== 'ALL') {
    filtered = filtered.filter(b => (b.badge || '').toUpperCase().includes(activeCategory) || (b.category || '').toUpperCase().includes(activeCategory));
  }

  if (searchQuery) {
    filtered = filtered.filter(b =>
      (b.title || '').toLowerCase().includes(searchQuery) ||
      (b.snippet || '').toLowerCase().includes(searchQuery) ||
      (b.fullText || b.content || '').toLowerCase().includes(searchQuery)
    );
  }

  const featuredBlog = filtered.length > 0 ? filtered[0] : null;
  const regularBlogs = filtered.length > 1 ? filtered.slice(1) : (filtered.length === 1 ? filtered : []);

  return `
    <div class="blogs-page-wrapper" style="padding: 2.5rem 0 5rem; background: var(--cream); min-height: 80vh;">
      <div class="container">
        
        <!-- Hero Header -->
        <div style="background: linear-gradient(135deg, var(--forest-dk) 0%, #0d3814 100%); border-radius: 16px; padding: 2.5rem 2rem; color: var(--paper); margin-bottom: 2.5rem; border-bottom: 4px solid var(--marigold); box-shadow: var(--shadow-lift); position: relative; overflow: hidden;">
          <div style="position: absolute; right: -30px; bottom: -30px; opacity: 0.08; pointer-events: none;">
            ${renderIcon('book-open', 260, '#ffffff')}
          </div>
          
          <div style="max-width: 680px; position: relative; z-index: 2;">
            <span class="badge" style="background: var(--marigold); color: var(--ink); font-weight: 800; font-size: 0.75rem; letter-spacing: 0.5px; padding: 4px 12px; margin-bottom: 0.75rem; display: inline-block;">
              📰 SARMAYADAR REAL ESTATE JOURNAL
            </span>
            <h1 style="font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-family: var(--font-display); font-weight: 800; color: var(--paper); line-height: 1.2; margin-bottom: 0.75rem;">
              ${t('blogs_header_title', 'Real Estate News, Taxes & Market Trends')}
            </h1>
            <p style="font-size: 1rem; color: rgba(255,255,255,0.9); line-height: 1.6; margin-bottom: 1.5rem;">
              Stay informed with expert analysis on property valuations, capital gains tax rules, housing society updates, and verified investment opportunities across Pakistan.
            </p>

            ${isAdmin ? `
              <button type="button" id="go-to-admin-blogs-btn" class="btn btn-primary" style="background: var(--marigold); color: var(--ink); font-weight: 800; border: none; padding: 11px 22px; border-radius: 8px; box-shadow: var(--shadow-md); font-size: 0.95rem; cursor: pointer;">
                ✍️ Open Admin Blog Writer Studio (+ Write New Article) →
              </button>
            ` : `
              <button type="button" id="open-admin-login-for-blog-btn" class="btn btn-secondary" style="background: rgba(255,255,255,0.15); color: var(--paper); font-weight: 700; border: 1.5px solid var(--marigold); padding: 10px 20px; border-radius: 8px; backdrop-filter: blur(4px); font-size: 0.88rem; cursor: pointer;">
                ${renderIcon('shield-check', 16, 'var(--marigold)')} Admin Login to Write & Publish Articles →
              </button>
            `}
          </div>
        </div>

        <!-- Filter & Search Control Bar -->
        <div style="display: flex; gap: 1rem; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 2rem; background: var(--paper); padding: 1rem 1.25rem; border-radius: 12px; border: 1.5px solid var(--border-dk); box-shadow: var(--shadow-sm);">
          
          <!-- Category Pills -->
          <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 4px; flex: 1;">
            ${categories.map(cat => `
              <button type="button" class="btn btn-sm blog-cat-btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-ghost'}" data-cat="${cat.id}" style="border-radius: 20px; font-weight: 700; font-size: 0.8rem; white-space: nowrap; ${activeCategory === cat.id ? 'background: var(--forest-dk); color: var(--paper);' : 'color: var(--forest-dk);'}">
                ${cat.label}
              </button>
            `).join('')}
          </div>

          <!-- Search Input -->
          <div style="position: relative; width: 280px; min-width: 200px;">
            <input type="text" id="blog-search-input" class="form-control" placeholder="Search blogs & tax guides..." value="${state.blogSearchQuery || ''}" style="padding-left: 2.2rem; border-radius: 20px; font-size: 0.85rem;" />
            <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); opacity: 0.6;">
              ${renderIcon('search', 14, 'var(--forest-dk)')}
            </span>
          </div>

        </div>

        ${filtered.length === 0 ? `
          <div style="text-align: center; padding: 4rem 1rem; background: var(--paper); border-radius: 12px; border: 2px dashed var(--border-dk);">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔍</div>
            <h3 style="font-family: var(--font-display); color: var(--forest-dk);">No Articles Found</h3>
            <p style="color: var(--forest); opacity: 0.8; font-size: 0.9rem; margin-top: 0.25rem;">Try resetting your search query or choosing another category.</p>
          </div>
        ` : `
          <!-- Featured Story (If available) -->
          ${featuredBlog ? `
            <div class="featured-blog-card" style="background: var(--paper); border-radius: 14px; overflow: hidden; border: 2px solid var(--forest-dk); box-shadow: var(--shadow-md); margin-bottom: 2.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
              <div style="position: relative; min-height: 280px; overflow: hidden;">
                <img src="${featuredBlog.img || featuredBlog.image}" alt="${featuredBlog.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                <span class="badge" style="position: absolute; top: 14px; left: 14px; background: var(--marigold); color: var(--ink); font-weight: 800; font-size: 0.72rem; padding: 4px 10px; border-radius: 4px; box-shadow: var(--shadow-sm);">
                  🌟 FEATURED ARTICLE • ${featuredBlog.badge || 'INSIGHTS'}
                </span>
              </div>
              <div style="padding: 2rem; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--forest); margin-bottom: 0.5rem; font-weight: 600;">
                  📅 ${featuredBlog.date} • ⏱️ ${featuredBlog.readTime || '5 min read'} • ✍️ ${featuredBlog.author || 'Sarmayadar Editorial'}
                </div>
                <h2 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--forest-dk); margin-bottom: 0.75rem; line-height: 1.3;">
                  ${featuredBlog.title}
                </h2>
                <p style="font-size: 0.92rem; color: var(--ink); opacity: 0.85; line-height: 1.6; margin-bottom: 1.25rem;">
                  ${featuredBlog.snippet || featuredBlog.fullText?.substring(0, 180) + '...'}
                </p>
                <button type="button" class="btn btn-primary read-article-btn" data-id="${featuredBlog.id}" style="align-self: flex-start; padding: 8px 20px; font-weight: 700; border-radius: 8px; background: var(--forest-dk); color: var(--paper);">
                  Read Full Featured Guide &rarr;
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Regular Blogs Grid -->
          <div class="blog-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 1.5rem;">
            ${(regularBlogs.length > 0 ? regularBlogs : (featuredBlog ? [featuredBlog] : [])).map(art => `
              <div class="news-card" style="background: var(--paper); border-radius: 12px; overflow: hidden; border: 1.5px solid var(--border-dk); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                
                <div class="news-card-media" style="position: relative; height: 190px; overflow: hidden;">
                  <img src="${art.img || art.image}" alt="${art.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
                  <span class="badge news-badge" style="position: absolute; top: 10px; left: 10px; background: var(--forest-dk); color: var(--marigold); font-size: 0.68rem; font-weight: 800; padding: 3px 8px; border-radius: 4px;">
                    ${art.badge || 'BLOG'}
                  </span>
                </div>

                <div class="news-card-body" style="padding: 1.25rem; display: flex; flex-direction: column; flex: 1;">
                  <div class="news-meta" style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--forest); opacity: 0.85; margin-bottom: 0.5rem; display: flex; gap: 6px; align-items: center;">
                    <span>📅 ${art.date}</span>
                    <span>•</span>
                    <span>⏱️ ${art.readTime || '4 min read'}</span>
                  </div>

                  <h3 class="news-title" style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: var(--forest-dk); line-height: 1.35; margin-bottom: 0.6rem;">
                    ${art.title}
                  </h3>

                  <p class="news-snippet" style="font-size: 0.85rem; color: var(--ink); opacity: 0.8; line-height: 1.55; margin-bottom: 1.25rem; flex: 1;">
                    ${art.snippet || (art.fullText ? art.fullText.substring(0, 120) + '...' : '')}
                  </p>

                  <button type="button" class="btn btn-ghost btn-sm read-article-btn" data-id="${art.id}" style="align-self: flex-start; padding: 6px 14px; font-size: 0.82rem; font-weight: 700; color: var(--forest-dk); border: 1.5px solid var(--forest-dk); border-radius: 6px;">
                    <span>Read Article</span> &rarr;
                  </button>
                </div>

              </div>
            `).join('')}
          </div>
        `}

      </div>
    </div>
  `;
}
