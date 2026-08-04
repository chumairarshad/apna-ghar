import { renderIcon } from '../utils/icons.js';

export function renderAIChatbotWidget(state) {
  const isOpen = state.showAIChatbot || false;
  const messages = state.aiChatMessages || [
    { sender: 'bot', text: 'Assalam-o-Alaikum! 👋 I am your **Apna Ghar AI Property Assistant**. How can I help you find your dream property or calculate loan EMIs today?' }
  ];

  return `
    <!-- Floating AI Chatbot Launcher Button -->
    <div id="ai-chatbot-widget-container" style="position:fixed; bottom:25px; right:25px; z-index:99990;">
      <!-- Expandable Chatbot Drawer -->
      <div id="ai-chatbot-drawer" class="${isOpen ? 'open' : ''}" style="
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 360px;
        max-width: 90vw;
        height: 520px;
        max-height: 80vh;
        background: var(--paper);
        border: 3px solid var(--forest-dk);
        border-radius: 16px;
        box-shadow: var(--shadow-xl);
        display: ${isOpen ? 'flex' : 'none'};
        flex-direction: column;
        overflow: hidden;
        animation: chatSlideUp 0.25s ease-out forwards;
      ">
        <!-- Chat Header -->
        <div style="background:linear-gradient(135deg, var(--forest-dk), var(--forest)); color:var(--paper); padding:1rem 1.25rem; display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--marigold);">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <div style="width:34px; height:34px; background:var(--marigold); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--forest-dk);">
              ${renderIcon('sparkles', 18, 'var(--forest-dk)')}
            </div>
            <div>
              <div style="font-family:var(--font-display); font-size:0.95rem; font-weight:700;">Apna Ghar AI Assistant</div>
              <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--marigold);">Online • 24/7 Advisor</div>
            </div>
          </div>
          <button id="close-ai-chat-btn" style="background:none; border:none; color:var(--paper); font-size:1.4rem; cursor:pointer;">&times;</button>
        </div>

        <!-- Chat Messages Container -->
        <div id="ai-chat-messages" style="flex:1; padding:1rem; overflow-y:auto; display:flex; flex-direction:column; gap:0.75rem; background:var(--cream);">
          ${messages.map(msg => `
            <div style="display:flex; justify-content:${msg.sender === 'user' ? 'flex-end' : 'flex-start'};">
              <div style="
                max-width: 82%;
                padding: 0.7rem 0.95rem;
                border-radius: 12px;
                font-size: 0.85rem;
                line-height: 1.4;
                ${msg.sender === 'user' 
                  ? 'background:var(--rani); color:var(--paper); border-bottom-right-radius:2px;' 
                  : 'background:var(--paper); color:var(--forest-dk); border:1.5px solid var(--border-dk); border-bottom-left-radius:2px; box-shadow:var(--shadow-sm);'}
              ">
                ${msg.text}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Quick Question Chips -->
        <div style="padding:0.5rem 0.85rem; background:var(--paper); border-top:1px solid var(--border-dk); display:flex; gap:0.4rem; overflow-x:auto; white-space:nowrap;">
          <button type="button" class="ai-quick-chip" data-q="What is 10 Marla price in DHA Phase 6?" style="background:var(--cream); border:1px solid var(--border-dk); border-radius:14px; padding:3px 8px; font-size:0.7rem; font-weight:600; color:var(--forest-dk); cursor:pointer;">
            📍 DHA 10 Marla Price
          </button>
          <button type="button" class="ai-quick-chip" data-q="Calculate Home Loan EMI for 3 Crore" style="background:var(--cream); border:1px solid var(--border-dk); border-radius:14px; padding:3px 8px; font-size:0.7rem; font-weight:600; color:var(--forest-dk); cursor:pointer;">
            🧮 Loan EMI Calculator
          </button>
          <button type="button" class="ai-quick-chip" data-q="Show me Hot Deals in Islamabad" style="background:var(--cream); border:1px solid var(--border-dk); border-radius:14px; padding:3px 8px; font-size:0.7rem; font-weight:600; color:var(--forest-dk); cursor:pointer;">
            🔥 Islamabad Hot Deals
          </button>
        </div>

        <!-- Chat Input Form -->
        <form id="ai-chat-form" style="padding:0.75rem 1rem; background:var(--paper); border-top:2px solid var(--forest-dk); display:flex; gap:0.5rem;">
          <input type="text" id="ai-chat-input" placeholder="Ask AI anything about properties..." style="flex:1; padding:0.6rem 0.85rem; border:2px solid var(--border-dk); border-radius:8px; font-size:0.85rem; background:var(--cream); color:var(--ink); font-weight:600;" required />
          <button type="submit" class="btn btn-primary btn-sm" style="padding:0 0.85rem;">
            ${renderIcon('sparkles', 16, 'white')}
          </button>
        </form>
      </div>

      <!-- Floating Trigger Button -->
      <button id="toggle-ai-chat-btn" style="
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--rani), var(--rani-dk));
        color: var(--paper);
        border: 3px solid var(--paper);
        box-shadow: 0 10px 25px rgba(209, 38, 110, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        position: relative;
      " title="Ask Apna Ghar AI Assistant">
        ${renderIcon('sparkles', 26, 'var(--paper)')}
        <span style="position:absolute; top:-4px; right:-4px; background:var(--marigold); color:var(--forest-dk); font-family:var(--font-mono); font-size:0.6rem; font-weight:800; padding:2px 5px; border-radius:10px; border:1px solid var(--forest-dk);">AI</span>
      </button>
    </div>
  `;
}
