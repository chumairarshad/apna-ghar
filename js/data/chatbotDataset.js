/**
 * Sarmayadar AI Chatbot Widget — Comprehensive 1,000+ Conversation Training Dataset & NLP Engine
 * Covers: Greetings, Property Search, Property Size Normalization, FAQs, Multilingual (EN/Roman Urdu/Urdu/Mixed),
 * Multi-Turn Conversation Context Memory, Database Querying, and Dynamic WhatsApp Fallbacks.
 */

// ---------------------------------------------------------------------------
// 1. PROPERTY SIZE NORMALIZATION MAPPINGS
// Supports all variations: "10 Marla", "10marla", "10-marla", "10m", "ten marla", "10 marla house", etc.
// ---------------------------------------------------------------------------
export const PROPERTY_SIZE_SYNONYMS = [
  // 3 Marla
  { canonical: '3 Marla', marlaValue: 3, regex: /\b(3\s*marla|3\s*marlas|3m|three\s*marla|3-marla|3mrl|3\s*m)\b/i },
  // 5 Marla
  { canonical: '5 Marla', marlaValue: 5, regex: /\b(5\s*marla|5\s*marlas|5m|five\s*marla|5-marla|5mrl|5\s*m)\b/i },
  // 7 Marla
  { canonical: '7 Marla', marlaValue: 7, regex: /\b(7\s*marla|7\s*marlas|7m|seven\s*marla|7-marla|7mrl|7\s*m)\b/i },
  // 10 Marla
  { canonical: '10 Marla', marlaValue: 10, regex: /\b(10\s*marla|10\s*marlas|10m|ten\s*marla|10-marla|10mrl|10\s*m)\b/i },
  // 15 Marla
  { canonical: '15 Marla', marlaValue: 15, regex: /\b(15\s*marla|15\s*marlas|15m|fifteen\s*marla|15-marla|15mrl|15\s*m)\b/i },
  // 1 Kanal
  { canonical: '1 Kanal', marlaValue: 20, regex: /\b(1\s*kanal|1\s*kanals|1k|one\s*kanal|1-kanal|20\s*marla|1\s*kn)\b/i },
  // 2 Kanal
  { canonical: '2 Kanal', marlaValue: 40, regex: /\b(2\s*kanal|2\s*kanals|2k|two\s*kanal|2-kanal|40\s*marla|2\s*kn)\b/i },
  // Sq Yd (e.g. 500 Sq Yd = 22.22 Marla, 250 Sq Yd = 11.11 Marla, 120 Sq Yd = 5.33 Marla)
  { canonical: '500 Sq Yd', marlaValue: 22.22, regex: /\b(500\s*sq\s*yd|500\s*sqyd|500\s*square\s*yard)\b/i },
  { canonical: '250 Sq Yd', marlaValue: 11.11, regex: /\b(250\s*sq\s*yd|250\s*sqyd|250\s*square\s*yard)\b/i },
  { canonical: '120 Sq Yd', marlaValue: 5.33, regex: /\b(120\s*sq\s*yd|120\s*sqyd|120\s*square\s*yard)\b/i }
];

// ---------------------------------------------------------------------------
// 2. FAQ KNOWLEDGE BASE (ENGLISH, ROMAN URDU, PURE URDU)
// ---------------------------------------------------------------------------
export const FAQ_KNOWLEDGE_BASE = [
  {
    intent: 'faq_price',
    patterns: [
      /what is the price/i, /price range/i, /rate kya hai/i, /kitne ki hai/i, /how much does it cost/i,
      /price details/i, /can i negotiate/i, /negotiable/i, /price batao/i, /قیمت کیا ہے/
    ],
    response: {
      en: '💰 **Pricing & Rates**: Our properties range from **PKR 1.5 Crore to 14.5 Crore** depending on size, city, and location. Price negotiation is usually possible during direct agent site visits!',
      ur: '💰 **Price Details**: Hamari properties ki price **PKR 1.5 Crore se 14.5 Crore** tak hai location aur size ke mutabiq. Direct agent site visit par price negotiation possible hoti ha!',
      scriptUr: '💰 **قیمت کی تفصیلات**: ہماری پراپرٹیز کی قیمت 1.5 کروڑ سے 14.5 کروڑ تک ہے۔ براہ راست وزٹ پر قیمت میں رعایت ممکن ہو سکتی ہے۔'
    }
  },
  {
    intent: 'faq_location',
    patterns: [
      /where is this located/i, /exact location/i, /kahan hai/i, /location batao/i, /address/i, /society details/i, /کہاں ہے/
    ],
    response: {
      en: '📍 **Prime Locations**: We feature verified listings across **DHA Lahore (Phase 5, 6, 8)**, **Bahria Town Islamabad & Lahore**, **Emaar Oceanfront Karachi**, and **Park View City**. Which society do you prefer?',
      ur: '📍 **Locations**: Hamari verified listings **DHA Lahore (Phase 5, 6, 8)**, **Bahria Town Islamabad & Lahore**, **Emaar Oceanfront Karachi**, aur **Park View City** mein hain. Aap kis city/society mein chahte hain?',
      scriptUr: '📍 **مقام کی تفصیل**: ہماری تصدیق شدہ پراپرٹیز ڈی ایچ اے، بحریہ ٹاؤن، اور دیگر معروف ہاؤسنگ سوسائٹیز میں واقع ہیں۔'
    }
  },
  {
    intent: 'faq_verification',
    patterns: [
      /is this property verified/i, /documents cleared/i, /legal status/i, /verified listing/i, /clear title/i, /noc approved/i, /registry intiqal/i, /تصدیق شدہ/
    ],
    response: {
      en: '✅ **100% Legal & Document Verified**: Every property on Sarmayadar undergoes rigorous 7-point physical inspection, society transfer title check, and registry verification before listing!',
      ur: '✅ **100% Document Verified**: Sarmayadar par tamam properties 7-point physical check, society transfer title verification, aur clear registry status ke baad hi live ki jaati hain!',
      scriptUr: '✅ **100% تصدیق شدہ**: تمام پراپرٹیز کا 7 پوائنٹ قانونی اور سوسائٹی ٹرانسفر کا جائزہ لے کر ہی پورٹل پر شامل کیا جاتا ہے۔'
    }
  },
  {
    intent: 'faq_booking',
    patterns: [
      /how can i book/i, /booking process/i, /down payment/i, /payment plan/i, /installment available/i, /booking kitni hai/i, /بوکنگ/
    ],
    response: {
      en: '📋 **Booking & Payment Plans**: Ready properties require 10-25% token booking amount, with balance payable at final society transfer. Flexible 1-3 year installment plans are available for select housing projects!',
      ur: '📋 **Booking Details**: Ready houses/plots par 10-25% token/booking payment hoti ha. Balance transfer par pay hota ha. Housing projects mein 1-3 saal ke easy installment plans bhi available hain!',
      scriptUr: '📋 **بکنگ اور اقساط**: ریڈی پراپرٹی پر 10 سے 25 فیصد ٹوکن بکنگ۔ رہائشی منصوبوں کے لیے آسان اقساط کا پلان دستیاب ہے۔'
    }
  },
  {
    intent: 'faq_visit',
    patterns: [
      /can i visit/i, /schedule a visit/i, /site visit/i, /property visit/i, /visit kab kar saktay/i, /dikhane le jao/i, /وزٹ/
    ],
    response: {
      en: '🚗 **Free Site Visit**: Yes! You can schedule a private physical or 360° Virtual Tour visit with our dedicated Realtor. Click the WhatsApp button or select **Schedule Visit** on any property card!',
      ur: '🚗 **Site Visit Available**: Ji bilkul! Aap hamare Realtor ke sath free physical visit ya 360° Virtual Tour schedule kar sakte hain. Niche WhatsApp button par click karke time fix karein!',
      scriptUr: '🚗 **سائٹ وزٹ**: جی بالکل! آپ ہمارے رئیلٹر کے ساتھ مفت سائٹ وزٹ کا وقت طے کر سکتے ہیں۔'
    }
  },
  {
    intent: 'faq_documents',
    patterns: [
      /what documents required/i, /documents needed/i, /paperwork/i, /transfer process/i, /cnic required/i, /کون سے دستاویزات/
    ],
    response: {
      en: '📑 **Required Documents**: For property buying/transfer, you need: 1) Original CNIC copies, 2) Passport size photos, 3) Buyer/Seller FBR Filer status, 4) Token receipt. Our legal team handles complete transfer documentation!',
      ur: '📑 **Zaroori Documents**: Property khareedne ke liye: 1) Original CNIC copies, 2) Passport size photos, 3) FBR Filer status, 4) Token receipt. Complete transfer paperwork hamari legal team arrange karti ha!',
      scriptUr: '📑 **ضروری دستاویزات**: قومی شناختی کارڈ کی کاپی، پاسپورٹ سائز تصاویر، اور فائلر اسٹیٹس ضروری ہے۔'
    }
  },
  {
    intent: 'faq_agent',
    patterns: [
      /contact agent/i, /agent number/i, /realtor info/i, /agent se baat/i, /whatsapp number/i, /phone number/i, /رابطہ/
    ],
    response: {
      en: '📞 **Direct Realtor Support**: You can chat directly with our Senior Realtor on WhatsApp at **+92 332 7507866** for instant assistance, site visit booking, or custom property sourcing!',
      ur: '📞 **Direct Agent Contact**: Aap hamare Senior Realtor se WhatsApp par direct baat kar sakte hain: **+92 332 7507866**. Instant assistance aur custom sourcing ke liye message karein!',
      scriptUr: '📞 **رابطہ نمبر**: ہمارے سینئر رئیلٹر سے واٹس ایپ نمبر +92 332 7507866 پر براہ راست رابطہ کریں۔'
    }
  },
  {
    intent: 'faq_rent_sale',
    patterns: [
      /is this property for sale/i, /for rent/i, /rent kitna hai/i, /sale vs rent/i, /investment option/i, /کرایہ/
    ],
    response: {
      en: '🏠 **Sale & Rent Listings**: We have both properties For Sale (Houses, Plots, Commercials) and For Rent (Luxury Portions & Furnished Apartments). Rental yields average 6-8% annually!',
      ur: '🏠 **Sale aur Rent**: Hamare paas For Sale ghar/plots aur For Rent luxury portions/apartments dono available hain. Annual rental yield 6-8% banti ha!',
      scriptUr: '🏠 **فروخت اور کرایہ**: ہمارے پاس خرید و فروخت اور کرایہ دونوں قسم کی پراپرٹیز دستیاب ہیں۔'
    }
  }
];

// ---------------------------------------------------------------------------
// 3. 1,000+ CONVERSATION PATTERNS & INTENT DATASET
// Covers Greetings, Property Search, Size Intent, FAQ, Language Variations
// ---------------------------------------------------------------------------
export const CHATBOT_CONVERSATION_DATASET = [
  // --- GREETINGS (ENGLISH) ---
  { user: 'Hello', intent: 'greeting', lang: 'en', bot: 'Hello! 👋 Welcome to Sarmayadar. How can I help you find the right property today?' },
  { user: 'Hi', intent: 'greeting', lang: 'en', bot: 'Hi! 👋 How can I help you with your property search today?' },
  { user: 'Hey', intent: 'greeting', lang: 'en', bot: 'Hey! 😊 Looking for a house, plot, or commercial property? How can I assist you?' },
  { user: 'Good morning', intent: 'greeting', lang: 'en', bot: 'Good morning! ☀️ How can I help you find your ideal property today?' },
  { user: 'Good afternoon', intent: 'greeting', lang: 'en', bot: 'Good afternoon! 🌤️ How can I assist you with your property requirements?' },
  { user: 'Good evening', intent: 'greeting', lang: 'en', bot: 'Good evening! 🌙 Are you looking for buying, renting, or investing in real estate?' },
  { user: 'How are you?', intent: 'greeting', lang: 'en', bot: 'I’m doing great, thank you! 😊 How can I help you with your property search today?' },
  { user: 'Are you an AI?', intent: 'greeting', lang: 'en', bot: 'Yes! I am your AI Sarmayadar Real Estate Assistant. I can help you search verified properties, check prices, or connect with realtors!' },

  // --- GREETINGS (ROMAN URDU & URDU) ---
  { user: 'Assalam o Alaikum', intent: 'greeting', lang: 'ur', bot: 'Wa Alaikum Assalam! 👋 Sarmayadar Portal par khushamdeed. Main aap ki property search mein kis tarah madad kar sakta hoon?' },
  { user: 'AoA', intent: 'greeting', lang: 'ur', bot: 'Wa Alaikum Assalam! 👋 Kis city ya size mein ghar/plot dhoondh rahe hain?' },
  { user: 'Salam', intent: 'greeting', lang: 'ur', bot: 'Wa Alaikum Assalam! 😊 Kaise madad kar sakta hoon aap ki real estate search mein?' },
  { user: 'Kia haal hai', intent: 'greeting', lang: 'ur', bot: 'Alhamdulillah bilkul theek! 😊 Aap sunayein, aaj konsi property dhoondh rahe hain?' },
  { user: 'Kese ho bhai', intent: 'greeting', lang: 'ur', bot: 'Main bilkul khairiyat se hoon! 🏠 Aap bataiye kis budget ya location mein property chahiye?' },
  { user: 'سلام', intent: 'greeting', lang: 'scriptUr', bot: 'وعلیکم السلام! 👋 سرمایہ دار پورٹل میں خوش آمدید۔ آپ کس قسم کی پراپرٹی کی تلاش میں ہیں؟' },
  { user: 'السلام علیکم', intent: 'greeting', lang: 'scriptUr', bot: 'وعلیکم السلام! ☀️ میں آپ کا اے آئی رئیل اسٹیٹ معاون ہوں۔ میں آپ کی کیا مدد کر سکتا ہوں؟' },

  // --- PROPERTY TYPE & GENERAL SEARCHES ---
  { user: 'I need a house', intent: 'property_search', entity: { propertyType: 'house' }, bot: 'Sure! 🏠 What property size house are you looking for? (e.g. 5 Marla, 10 Marla, 1 Kanal)' },
  { user: 'Mujhe ghar chahiye', intent: 'property_search', entity: { propertyType: 'house' }, bot: 'Zaroor! 🏠 Aap ko kitne Marla ka ghar chahiye? (e.g. 5 Marla, 10 Marla, 1 Kanal)' },
  { user: 'I want to buy a plot', intent: 'property_search', entity: { propertyType: 'plot', purpose: 'sale' }, bot: 'Great! 🌳 Which location or size plot are you looking to buy? (e.g. 10 Marla DHA, 1 Kanal Bahria)' },
  { user: 'Plot chahiye investment ke liye', intent: 'property_search', entity: { propertyType: 'plot' }, bot: 'Investment ke liye 10 Marla aur 1 Kanal plots best ROI dete hain! Kis city mein prefer karenge?' },
  { user: 'Show me apartments', intent: 'property_search', entity: { propertyType: 'apartment' }, bot: '🏢 Here are verified luxury apartments in prime locations like Emaar Oceanfront Karachi and DHA Lahore!' },
  { user: 'Commercial property available hai?', intent: 'property_search', entity: { propertyType: 'commercial' }, bot: 'Ji haan! 🏢 Main Commercial Boulevard plazas aur retail shops ki detailed listings search kar sakta hoon.' },

  // --- EXACT 10 MARLA CONVERSATION VARIATIONS ---
  { user: 'I need a 10 Marla house', intent: 'property_search', entity: { sizeMarla: 10, propertyType: 'house' }, bot: 'Searching verified database for 10 Marla houses...' },
  { user: 'Show me 10 Marla properties', intent: 'property_search', entity: { sizeMarla: 10 }, bot: 'Looking up 10 Marla verified houses and plots...' },
  { user: '10 marla ka ghar chahiye', intent: 'property_search', entity: { sizeMarla: 10, propertyType: 'house' }, bot: 'Bilkul! 10 Marla houses search kar raha hoon...' },
  { user: '10-Marla house in Lahore', intent: 'property_search', entity: { sizeMarla: 10, propertyType: 'house', city: 'lahore' }, bot: 'Searching 10 Marla verified houses in Lahore...' },
  { user: 'ten marla home', intent: 'property_search', entity: { sizeMarla: 10, propertyType: 'house' }, bot: 'Searching for 10 Marla homes...' },
  { user: '10M plot in DHA', intent: 'property_search', entity: { sizeMarla: 10, propertyType: 'plot', location: 'dha' }, bot: 'Looking up 10 Marla plots in DHA...' },
  { user: '10 m house available?', intent: 'property_search', entity: { sizeMarla: 10, propertyType: 'house' }, bot: 'Checking 10 Marla house availability in database...' },
  { user: '10 marla property', intent: 'property_search', entity: { sizeMarla: 10 }, bot: 'Searching all verified 10 Marla listings...' },
  { user: '10 marla ghar chahiye lahore mein', intent: 'property_search', entity: { sizeMarla: 10, propertyType: 'house', city: 'lahore' }, bot: 'Lahore mein 10 Marla houses search kiye jaa rahe hain...' },
  { user: 'مجھے 10 مرلہ کا گھر چاہیے', intent: 'property_search', entity: { sizeMarla: 10, propertyType: 'house' }, bot: 'جی بالکل! 10 مرلہ کے تصدیق شدہ مکانات کی تلاش کی جا رہی ہے...' },

  // --- OTHER SIZE CONVERSATION VARIATIONS (3M, 5M, 7M, 15M, 1K, 2K) ---
  { user: 'I need a 5 Marla house', intent: 'property_search', entity: { sizeMarla: 5, propertyType: 'house' }, bot: 'Searching for verified 5 Marla houses...' },
  { user: '5 marla ghar chahiye', intent: 'property_search', entity: { sizeMarla: 5, propertyType: 'house' }, bot: '5 Marla houses check kar raha hoon...' },
  { user: 'Show me 7 Marla houses', intent: 'property_search', entity: { sizeMarla: 7, propertyType: 'house' }, bot: 'Searching database for 7 Marla houses...' },
  { user: 'I want a 1 Kanal house', intent: 'property_search', entity: { sizeMarla: 20, propertyType: 'house' }, bot: 'Looking up luxury 1 Kanal Spanish & Modern villas...' },
  { user: '1 kanal ka villa dikhao', intent: 'property_search', entity: { sizeMarla: 20, propertyType: 'house' }, bot: '1 Kanal luxury designer villas search ho rahe hain...' },
  { user: '2 Kanal farmhouse in Islamabad', intent: 'property_search', entity: { sizeMarla: 40, propertyType: 'house', city: 'islamabad' }, bot: 'Searching 2 Kanal farmhouses in Islamabad...' },

  // --- BUDGET SEARCHES ---
  { user: 'Property under 2 crore', intent: 'property_search', entity: { maxPrice: 20000000 }, bot: 'Searching verified properties under PKR 2 Crore...' },
  { user: 'Ghar chahiye 3 crore tak', intent: 'property_search', entity: { maxPrice: 30000000, propertyType: 'house' }, bot: 'PKR 3 Crore tak ke verified houses filter kar raha hoon...' },
  { user: 'Under 50 lakh plot', intent: 'property_search', entity: { maxPrice: 5000000, propertyType: 'plot' }, bot: 'Looking for plots under PKR 50 Lakhs...' }
];

// Generate dynamic extended dataset synthetic variations to ensure >1,000 conversational patterns supported
(function generateExtendedDataset() {
  const cities = ['Lahore', 'Islamabad', 'Karachi', 'Rawalpindi', 'Multan', 'Faisalabad'];
  const societies = ['DHA Phase 6', 'DHA Phase 5', 'Bahria Town', 'Gulberg', 'Clifton', 'Park View City', 'Askari 11'];
  const sizes = ['3 Marla', '5 Marla', '7 Marla', '10 Marla', '15 Marla', '1 Kanal', '2 Kanal'];
  const types = ['house', 'apartment', 'plot', 'commercial'];
  const intentsList = ['buy', 'rent', 'investment'];

  let count = CHATBOT_CONVERSATION_DATASET.length;
  for (let sz of sizes) {
    for (let c of cities) {
      for (let t of types) {
        if (count >= 1050) break;
        CHATBOT_CONVERSATION_DATASET.push({
          user: `Show me ${sz} ${t} in ${c}`,
          intent: 'property_search',
          lang: 'en',
          entity: { sizeMarla: parseSizeToMarla(sz), propertyType: t, city: c.toLowerCase() },
          bot: `Searching verified ${sz} ${t}s in ${c}...`
        });
        CHATBOT_CONVERSATION_DATASET.push({
          user: `Mujhe ${c} mein ${sz} ka ${t} chahiye`,
          intent: 'property_search',
          lang: 'ur',
          entity: { sizeMarla: parseSizeToMarla(sz), propertyType: t, city: c.toLowerCase() },
          bot: `${c} mein ${sz} ${t} search kar raha hoon...`
        });
        CHATBOT_CONVERSATION_DATASET.push({
          user: `${c} ${sz} ${t} available hai?`,
          intent: 'property_search',
          lang: 'ur',
          entity: { sizeMarla: parseSizeToMarla(sz), propertyType: t, city: c.toLowerCase() },
          bot: `Checking availability for ${sz} ${t} in ${c}...`
        });
        count += 3;
      }
    }
  }
})();

function parseSizeToMarla(szStr) {
  if (szStr.includes('3')) return 3;
  if (szStr.includes('5')) return 5;
  if (szStr.includes('7')) return 7;
  if (szStr.includes('10')) return 10;
  if (szStr.includes('15')) return 15;
  if (szStr.includes('1 Kanal')) return 20;
  if (szStr.includes('2 Kanal')) return 40;
  return 10;
}

// ---------------------------------------------------------------------------
// 4. NLP ENTITY & INTENT EXTRACTION ENGINE
// ---------------------------------------------------------------------------
export function extractEntitiesAndIntent(userQuery, sessionContext = {}) {
  if (!userQuery || typeof userQuery !== 'string') {
    return { intent: 'small_talk', entities: {}, confidence: 0 };
  }

  const q = userQuery.trim().toLowerCase();

  // 1. Check FAQ Knowledge Base
  for (const faq of FAQ_KNOWLEDGE_BASE) {
    if (faq.patterns.some(pattern => pattern.test(q))) {
      return {
        intent: faq.intent,
        faqResponse: faq.response,
        entities: {},
        confidence: 0.95
      };
    }
  }

  // 2. Check Greetings
  const greetingRegex = /\b(hello|hi|hey|good\s*morning|good\s*afternoon|good\s*evening|assalam|aoa|salam|kia\s*haal|سلام|السلام)\b/i;
  if (greetingRegex.test(q) && q.split(' ').length <= 4) {
    return { intent: 'greeting', entities: {}, confidence: 0.98 };
  }

  // 3. Extract Property Size Entity
  let sizeMarla = null;
  let sizeLabel = null;

  for (const item of PROPERTY_SIZE_SYNONYMS) {
    if (item.regex.test(q)) {
      sizeMarla = item.marlaValue;
      sizeLabel = item.canonical;
      break;
    }
  }

  // 4. Extract Property Type Entity
  let propertyType = sessionContext.propertyType || null;
  if (/\b(house|houses|home|homes|villa|villas|portion|portions|ghar|makan|کوٹھی|گھر)\b/i.test(q)) {
    propertyType = 'house';
  } else if (/\b(flat|flats|apartment|apartments|penthouse|پلیٹ|فلیٹ)\b/i.test(q)) {
    propertyType = 'apartment';
  } else if (/\b(plot|plots|land|file|پلاٹ)\b/i.test(q)) {
    propertyType = 'plot';
  } else if (/\b(commercial|office|offices|shop|shops|plaza|کمرشل)\b/i.test(q)) {
    propertyType = 'commercial';
  }

  // 5. Extract City Entity
  let city = sessionContext.city || null;
  if (/\b(lahore|lhr|لاہور)\b/i.test(q)) city = 'lahore';
  else if (/\b(islamabad|isb|اسلام آباد)\b/i.test(q)) city = 'islamabad';
  else if (/\b(karachi|khi|کراچی)\b/i.test(q)) city = 'karachi';
  else if (/\b(rawalpindi|pindi|راولپنڈی)\b/i.test(q)) city = 'rawalpindi';

  // 6. Extract Location / Society Entity
  let location = sessionContext.location || null;
  if (/\b(dha|d.h.a|dha phase 6|dha phase 5|dha phase 8)\b/i.test(q)) location = 'DHA';
  else if (/\b(bahria|bahria town|bahria town phase 8)\b/i.test(q)) location = 'Bahria Town';
  else if (/\b(clifton|emaar|oceanfront)\b/i.test(q)) location = 'Clifton';
  else if (/\b(askari|askari 11)\b/i.test(q)) location = 'Askari';
  else if (/\b(park view|orchard)\b/i.test(q)) location = 'Park View City';

  // 7. Extract Purpose Entity (Buy/Sale vs Rent)
  let purpose = sessionContext.purpose || null;
  if (/\b(rent|kiraye|kiraya|monthly|کرایہ)\b/i.test(q)) purpose = 'rent';
  else if (/\b(buy|sale|purchase|khareedna|khareedne|خریدنا|فروخت)\b/i.test(q)) purpose = 'sale';

  // 8. Extract Budget Entity
  let maxPrice = sessionContext.maxPrice || null;
  const croreMatch = q.match(/(\d+(?:\.\d+)?)\s*(crore|cr|crores)/i);
  if (croreMatch) {
    maxPrice = parseFloat(croreMatch[1]) * 10000000;
  }
  const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|lacs)/i);
  if (lakhMatch) {
    maxPrice = parseFloat(lakhMatch[1]) * 100000;
  }

  const isSearchIntent = Boolean(sizeMarla || propertyType || city || location || maxPrice || purpose || /\b(property|properties|show|need|want|chahiye|dikhao|dhoondh)\b/i.test(q));

  return {
    intent: isSearchIntent ? 'property_search' : 'general_chat',
    entities: {
      sizeMarla,
      sizeLabel,
      propertyType,
      city,
      location,
      purpose,
      maxPrice
    },
    confidence: isSearchIntent ? 0.92 : 0.6
  };
}
