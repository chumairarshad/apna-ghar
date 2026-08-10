import { renderIcon } from '../utils/icons.js';
import { formatPKR } from '../utils/formatters.js';

/**
 * Format markdown bolding syntax (**text** or *text*) into clean <strong> HTML tags.
 * Strips raw asterisks (*) from being displayed in chatbot conversation bubbles.
 */
function formatChatMessageHtml(text) {
  if (!text) return '';
  // 1. Replace double asterisks **text** with <strong>text</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // 2. Replace single asterisk *text* with <strong>text</strong>
  html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  // 3. Remove any stray remaining single asterisks
  html = html.replace(/\*/g, '');
  // 4. Convert linebreaks \n into <br/>
  html = html.replace(/\n/g, '<br/>');
  return html;
}

export function renderAIChatbotWidget(state) {
  const isOpen = state.showAIChatbot || false;
  const chatLang = state.chatLanguage || 'en'; // 'en' | 'ur'

  const defaultEnText = 'Hello! 👋 I am your **Sarmayadar Assistant**. Type any city, society, budget, or plot size to find matching properties, or chat directly with our Realtor on WhatsApp!';
  const defaultUrText = 'Assalam-o-Alaikum! 👋 Main aap ka **Sarmayadar Assistant** hoon. Kis location, budget, ya plot size me property chahiye? Likh kar search karein!';

  const messages = state.aiChatMessages && state.aiChatMessages.length > 0
    ? state.aiChatMessages
    : [{ sender: 'bot', text: chatLang === 'en' ? defaultEnText : defaultUrText }];

  return `
    <!-- Floating AI Chatbot Launcher Button -->
    <div id="ai-chatbot-widget-container" style="position:fixed; bottom:25px; right:25px; z-index:99990;">
      <!-- Expandable Chatbot Drawer -->
      <div id="ai-chatbot-drawer" class="${isOpen ? 'open' : ''}" style="
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 390px;
        max-width: 92vw;
        height: 570px;
        max-height: 85vh;
        background: #ffffff;
        border: 3px solid var(--forest-dk);
        border-radius: 18px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.35);
        display: ${isOpen ? 'flex' : 'none'};
        flex-direction: column;
        overflow: hidden;
        animation: chatSlideUp 0.25s ease-out forwards;
      ">
        <!-- Chat Header -->
        <div style="background:linear-gradient(135deg, var(--forest-dk), #1c2b14); color:#ffffff; padding:1.1rem 1.25rem; display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid var(--marigold);">
          <div style="display:flex; align-items:center; gap:0.65rem;">
            <div style="width:36px; height:36px; background:var(--marigold); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--forest-dk); box-shadow:0 0 10px rgba(242,167,27,0.5);">
              ${renderIcon('sparkles', 20, 'var(--forest-dk)')}
            </div>
            <div>
              <div style="font-family:var(--font-display); font-size:1.05rem; font-weight:800; color:#ffffff;">Sarmayadar Assistant</div>
              <div style="font-family:var(--font-mono); font-size:0.68rem; color:var(--marigold); font-weight:700;">Online • AI Real Estate Advisor</div>
            </div>
          </div>
          <button id="close-ai-chat-btn" style="background:rgba(255,255,255,0.15); border:none; color:#ffffff; width:30px; height:30px; border-radius:50%; font-size:1.4rem; cursor:pointer; display:flex; align-items:center; justify-content:center;">&times;</button>
        </div>

        <!-- Language Selector Bar (English vs Roman Urdu) -->
        <div style="display:flex; background:#F8FAFC; border-bottom:2px solid #E2E8F0; padding:6px 1rem; align-items:center; justify-content:space-between;">
          <span style="font-size:0.72rem; font-family:var(--font-mono); font-weight:800; color:#475569; text-transform:uppercase;">
            🗣️ Language / زبان:
          </span>
          <div style="display:flex; gap:4px; background:#E2E8F0; padding:3px; border-radius:20px;">
            <button type="button" class="chat-lang-btn ${chatLang === 'en' ? 'active' : ''}" data-lang="en" style="border:none; padding:4px 11px; border-radius:16px; font-size:0.75rem; font-weight:800; cursor:pointer; transition:all 0.2s; ${chatLang === 'en' ? 'background:var(--forest-dk); color:white; box-shadow:0 2px 6px rgba(0,0,0,0.15);' : 'background:transparent; color:#334155;'}">
              🇬🇧 English
            </button>
            <button type="button" class="chat-lang-btn ${chatLang === 'ur' ? 'active' : ''}" data-lang="ur" style="border:none; padding:4px 11px; border-radius:16px; font-size:0.75rem; font-weight:800; cursor:pointer; transition:all 0.2s; ${chatLang === 'ur' ? 'background:var(--forest-dk); color:white; box-shadow:0 2px 6px rgba(0,0,0,0.15);' : 'background:transparent; color:#334155;'}">
              🇵🇰 Roman Urdu
            </button>
          </div>
        </div>

        <!-- Chat Messages Container -->
        <div id="ai-chat-messages" style="flex:1; padding:1rem; overflow-y:auto; display:flex; flex-direction:column; gap:0.85rem; background:#F8FAFC;">
          ${messages.map(msg => `
            <div style="display:flex; flex-direction:column; align-items:${msg.sender === 'user' ? 'flex-end' : 'flex-start'};">
              <div style="
                max-width: 88%;
                padding: 0.75rem 1rem;
                border-radius: 14px;
                font-size: 0.88rem;
                line-height: 1.5;
                font-weight: 500;
                ${msg.sender === 'user'
      ? 'background:var(--rani); color:#ffffff; border-bottom-right-radius:2px; font-weight:600; box-shadow:0 3px 10px rgba(209,38,110,0.25);'
      : 'background:#ffffff; color:#0F172A; border:2px solid #E2E8F0; border-bottom-left-radius:2px; box-shadow:0 3px 10px rgba(0,0,0,0.06);'}
              ">
                ${formatChatMessageHtml(msg.text)}
              </div>

              <!-- Render Matched Property Card Boxes -->
              ${msg.matchedProperties && msg.matchedProperties.length > 0 ? `
                <div style="width:100%; margin-top:0.65rem; display:flex; flex-direction:column; gap:0.65rem;">
                  <div style="font-family:var(--font-mono); font-size:0.72rem; font-weight:800; color:var(--forest-dk); text-transform:uppercase; letter-spacing:0.5px;">
                    🎯 AI Matched & Recommended Listings:
                  </div>
                  ${msg.matchedProperties.map(p => `
                    <div class="chat-property-card" style="background:#ffffff; border:2px solid #1E293B; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                      <div style="display:flex; gap:0.75rem; padding:0.65rem;">
                        <img src="${p.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'}" style="width:80px; height:80px; border-radius:8px; object-fit:cover; flex-shrink:0; border:1px solid #CBD5E1;" alt="${p.title}" />
                        
                        <div style="flex:1; min-width:0; display:flex; flex-direction:column; justify-content:space-between;">
                          <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                              <span style="background:var(--rani); color:white; font-family:var(--font-mono); font-size:0.62rem; font-weight:800; padding:2px 7px; border-radius:10px;">
                                ${p.matchScore}% MATCH
                              </span>
                              <span style="font-size:0.68rem; color:#64748B; font-weight:700;">${p.city}</span>
                            </div>
                            <h5 style="font-size:0.82rem; font-weight:800; color:#0F172A; margin:0 0 3px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                              ${p.title}
                            </h5>
                            <div style="font-family:var(--font-mono); font-size:0.85rem; font-weight:800; color:var(--forest-dk);">
                              ${formatPKR(p.price)}
                            </div>
                          </div>

                          <button type="button" class="btn btn-primary btn-sm chat-view-prop-btn" data-id="${p.id}" style="padding:4px 10px; font-size:0.72rem; font-weight:800; border-radius:6px; margin-top:4px; align-self:flex-start;">
                            👁️ View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Direct Agent WhatsApp Consultation Button -->
              ${msg.sender === 'bot' && msg.userQuery ? `
                <a href="https://wa.me/923327507866?text=${encodeURIComponent(`Assalam-o-Alaikum Sarmayadar Team! I searched for: "${msg.userQuery}". Please help me find or source a property matching my requirements.`)}" 
                   target="_blank" 
                   class="btn-whatsapp-premium" 
                   style="margin-top: 0.65rem;">
                  ${renderIcon('message-circle', 18, '#ffffff')}
                  <span>${chatLang === 'en' ? '💬 WhatsApp Agent Consultation' : '💬 WhatsApp Chat (Agent Se Baat Karein)'}</span>
                </a>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Quick Question Chips -->
        <div style="padding:0.6rem 0.85rem; background:#ffffff; border-top:2px solid #E2E8F0; display:flex; gap:0.45rem; overflow-x:auto; white-space:nowrap;">
          <button type="button" class="ai-quick-chip" data-q="Show me 10 Marla house in DHA Lahore for sale" style="background:#F1F5F9; border:1.5px solid #CBD5E1; border-radius:16px; padding:4px 10px; font-size:0.72rem; font-weight:700; color:#0F172A; cursor:pointer;">
            📍 DHA Lahore 10 Marla
          </button>
          <button type="button" class="ai-quick-chip" data-q="3 bedroom apartment in Clifton Karachi" style="background:#F1F5F9; border:1.5px solid #CBD5E1; border-radius:16px; padding:4px 10px; font-size:0.72rem; font-weight:700; color:#0F172A; cursor:pointer;">
            🌊 3 Bed Flat Clifton
          </button>
          <button type="button" class="ai-quick-chip" data-q="1 Kanal plot in Islamabad under 2 Crore" style="background:#F1F5F9; border:1.5px solid #CBD5E1; border-radius:16px; padding:4px 10px; font-size:0.72rem; font-weight:700; color:#0F172A; cursor:pointer;">
            🌲 1 Kanal Islamabad
          </button>
        </div>

        <!-- Chat Input Form -->
        <form id="ai-chat-form" style="padding:0.85rem 1rem; background:#ffffff; border-top:2px solid var(--forest-dk); display:flex; gap:0.5rem;">
          <input type="text" id="ai-chat-input" placeholder="${chatLang === 'en' ? 'Ask Sarmayadar Assistant location or budget...' : 'Location, budget, ya size likhein...'}" style="flex:1; padding:0.7rem 0.95rem; border:2px solid #1E293B; border-radius:8px; font-size:0.88rem; background:#ffffff; color:#0F172A; font-weight:700;" required />
          <button type="submit" class="btn btn-primary btn-sm" style="padding:0 1rem; font-weight:800;">
            ${renderIcon('sparkles', 16, 'white')} Search
          </button>
        </form>
      </div>

      <!-- Floating Trigger Button -->
      <button id="toggle-ai-chat-btn" style="
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--rani), var(--rani-dk));
        color: #ffffff;
        border: 3px solid #ffffff;
        box-shadow: 0 10px 25px rgba(209, 38, 110, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        position: relative;
      " title="Ask Sarmayadar Assistant">
        ${renderIcon('sparkles', 26, '#ffffff')}
        <span style="position:absolute; top:-4px; right:-4px; background:var(--marigold); color:var(--forest-dk); font-family:var(--font-mono); font-size:0.65rem; font-weight:800; padding:2px 6px; border-radius:10px; border:1.5px solid var(--forest-dk);">AI</span>
      </button>
    </div>
  `;
}
