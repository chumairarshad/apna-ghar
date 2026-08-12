// Centralized i18n Localization Engine for Sarmayadar (English 🇬🇧, Urdu 🇵🇰, Arabic 🇸🇦)

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
];

export const TRANSLATIONS = {
  en: {
    // Navigation & Header
    nav_sale: 'Properties for Sale',
    nav_rent: 'Rental Properties',
    nav_projects: 'Housing Megaprojects',
    nav_blogs: 'Blogs & Insights',
    nav_tools: 'Calculators & Tools',
    nav_agents: 'Agents Directory',
    nav_advertise: '📢 Advertise',
    nav_dealer: 'Dealer Portal',
    nav_admin: 'Admin Portal',
    nav_dashboard: 'My Dashboard',
    nav_settings: 'Account Settings',
    nav_logout: 'Logout',
    nav_login: 'Sign In / Register',
    nav_become_dealer: 'Become a Dealer',
    language: 'Language',
    go_to_portal: 'Go to sarmayadar.com',

    // Hero & Search Engine
    hero_title: 'Find Your Dream <span class="gradient-text">Property</span> in Pakistan',
    hero_subtitle: 'Find authentic houses, plots, and commercial projects verified directly by top licensed dealers & developers.',
    ai_search_title: 'AI Smart Search Engine',
    ai_search_subtitle: 'Type in Plain English or Urdu',
    ai_search_placeholder: 'e.g. 10 Marla house in DHA Phase 6 Lahore under 4.5 Crore...',
    ai_search_btn: 'AI Search',
    quick_prompts: 'Quick Prompts:',

    // Filters
    purpose_buy: 'Buy Property',
    purpose_rent: 'Rent Property',
    purpose_projects: 'Megaprojects',
    city_label: 'City',
    society_label: 'Society / Sector',
    type_label: 'Property Type',
    size_label: 'Property Size',
    price_label: 'Max Price',
    city_all: 'All Cities in Pakistan',
    society_all: 'All Societies & Locations',
    type_all: 'All Property Types',
    size_any: 'Any Size',
    price_any: 'Any Price',
    btn_search: '🔍 Search Properties',
    btn_reset_filters: '🔄 Clear Filters',

    // Property Cards & Catalog
    verified_properties: 'Verified Properties in Pakistan',
    properties_found: 'properties found',
    sort_by: 'Sort By:',
    sort_featured: 'Featured First',
    sort_price_low: 'Price: Low to High',
    sort_price_high: 'Price: High to Low',
    sort_newest: 'Newest Listings',
    view_grid: 'Grid View',
    view_map: 'Map View',
    beds: 'Beds',
    baths: 'Baths',
    area: 'Area',
    marla: 'Marla',
    kanal: 'Kanal',
    sqft: 'Sq.Ft',
    for_sale: 'For Sale',
    for_rent: 'For Rent',
    megaproject: 'Megaproject',
    call_now: 'Call Now',
    btn_view_details: 'View Details',
    btn_contact: 'Contact Dealer',
    btn_whatsapp: 'WhatsApp',
    btn_call: 'Call Agent',
    btn_save: 'Save Property',
    btn_saved: 'Saved ❤️',
    btn_compare: 'Compare',
    btn_post_free: 'Post Property FREE',
    badge_verified: 'VERIFIED',
    badge_featured: 'FEATURED',
    badge_exclusive: 'EXCLUSIVE',

    // Property Details Modal & Page
    property_overview: 'Property Overview & Description',
    amenities_features: 'Amenities & Features',
    location_map: 'Location & Map',
    posted_by: 'Posted By',
    schedule_tour: 'Schedule a Visit',
    virtual_tour: 'Virtual 3D Tour',
    calculate_mortgage: 'Mortgage Estimator',
    fbr_tax_estimate: 'FBR Tax Estimator',
    inquire_whatsapp: 'Inquire on WhatsApp',

    // Housing Megaprojects
    featured_projects_title: "Pakistan's Premier Housing Megaprojects",
    starting_from: 'Starting from',
    total_units: 'Total Units',
    developer: 'Developer',
    explore_project: 'Explore Project',

    // Blogs & Insights
    blogs_header_title: 'Real Estate News, Taxes & Market Trends',
    all_categories: 'All Articles',
    read_full_article: 'Read Full Article',

    // Calculators & Land Tools
    tools_title: 'Financial Calculators & Land Measurement Tools',
    tab_converter: 'Area Unit Converter',
    tab_mortgage: 'Mortgage Loan Calculator',
    tab_valuation: 'Property Valuation',
    tab_fbr: 'FBR Tax Guide 2026',

    // Agents Directory
    agents_title: 'Verified Real Estate Agencies & Brokers',
    verified_agency: 'Verified Agency',
    listings_count: 'Active Listings',
    contact_agency: 'Contact Agency',

    // Post Property Wizard
    post_property_title: 'Post Property Listing',
    step_basic_info: '1. Basic Details',
    step_location_price: '2. Location & Price',
    step_features: '3. Features & Amenities',
    step_photos: '4. Photos & Publishing',
    next_step: 'Next Step',
    prev_step: 'Previous Step',
    submit_property: 'Publish Listing',

    // Dashboard & ProFolio Studio
    dash_welcome: 'Welcome back,',
    dash_overview: 'Dashboard Overview',
    dash_add_property: 'Add Property',
    dash_my_listings: 'My Property Listings',
    dash_favorites: 'Saved Properties',
    dash_inquiries: 'Inquiries & Leads',
    dash_analytics: 'Performance Analytics',
    dash_mega_projects: 'Mega Projects Studio',
    dash_subscriptions: 'Subscriptions & Limits',
    dash_users: 'Manage Platform Users',
    dash_dealers: 'Verified Dealers Directory',
    dash_approvals: 'Property Approvals Queue',
    dash_profile: 'Profile Settings',
    dash_preferences: 'Portal Preferences',
    dash_password: 'Change Password',
    overview_stats: 'Quick Overview Statistics',
    active_properties: 'Active Properties',
    total_leads: 'Total Inquiries',
    profile_views: 'Total Views',
    add_new_property: 'Add New Listing',
    manage_listings: 'Manage Listings',
    save_changes: 'Save Changes',
    edit_profile: 'Edit Agency Profile',
    change_password_title: 'Change Account Password',
    current_password: 'Current Password',
    new_password: 'New Password',
    confirm_password: 'Confirm New Password',
    update_password_btn: 'Update Password',

    // Auth
    auth_login_title: 'Sign In to Your Sarmayadar Account',
    auth_register_title: 'Create New Sarmayadar Account',
    email_label: 'Email Address',
    password_label: 'Password',
    phone_label: 'Mobile Phone Number',
    full_name_label: 'Full Name',
    role_user: 'Normal User (Buy / Rent)',
    role_dealer: 'Real Estate Dealer / Agency',
    btn_submit_login: 'Sign In Now',
    btn_submit_register: 'Create Account',

    // Chatbot
    bot_greeting: 'Hello! 👋 I am your Sarmayadar Assistant. How can I help you find properties today?',
    type_message: 'Type your question...',

    // Footer
    footer_tagline: "Pakistan's most trusted digital real estate portal & dealer network.",
    footer_quick_links: 'Quick Links',
    footer_popular_cities: 'Popular Cities',
    footer_rights: 'All Rights Reserved.'
  },

  ur: {
    // Navigation & Header
    nav_sale: 'برائے فروخت جائیدادیں',
    nav_rent: 'برائے کرایہ جائیدادیں',
    nav_projects: 'میگا ہاؤسنگ پروجیکٹس',
    nav_blogs: 'بلاگز اور مارکیٹ تجزیہ',
    nav_tools: 'کیلکولیٹر اور ٹولز',
    nav_agents: 'ڈیلرز ڈائریکٹری',
    nav_advertise: '📢 اشتہار دیں',
    nav_dealer: 'ڈیلر پورٹل',
    nav_admin: 'ایڈمن پورٹل',
    nav_dashboard: 'میرا ڈیش بورڈ',
    nav_settings: 'اکاؤنٹ ترتیبات',
    nav_logout: 'لاگ آؤٹ',
    nav_login: 'سائن ان / رجسٹر',
    nav_become_dealer: 'ڈیلر بنیں',
    language: 'زبان',
    go_to_portal: 'سرمایہ دار ہوم پیج پر جائیں',

    // Hero & Search Engine
    hero_title: 'پاکستان میں اپنے خوابوں کی <span class="gradient-text">جائیداد</span> تلاش کریں',
    hero_subtitle: 'سرمایہ دار پر تصدیق شدہ مکانات، پلاٹس اور تجارتی منصوبے براہ راست سرفہرست ڈیلرز سے حاصل کریں۔',
    ai_search_title: 'اے آئی سمارٹ سرچ انجن',
    ai_search_subtitle: 'سادہ انگریزی یا اردو میں ٹائپ کریں',
    ai_search_placeholder: 'مثلاً: ڈی ایچ اے فیز 6 لاہور میں 10 مرلہ مکان 4.5 کروڑ سے کم...',
    ai_search_btn: 'اے آئی سرچ',
    quick_prompts: 'فوری سوالات:',

    // Filters
    purpose_buy: 'جائیداد خریدیں',
    purpose_rent: 'کرایہ پر لیں',
    purpose_projects: 'میگا پروجیکٹس',
    city_label: 'شہر',
    society_label: 'سوسائٹی / سیکٹر',
    type_label: 'جائیداد کی قسم',
    size_label: 'رقبہ / سائز',
    price_label: 'زیادہ سے زیادہ قیمت',
    city_all: 'پاکستان کے تمام شہر',
    society_all: 'تمام سوسائٹیاں اور مقامات',
    type_all: 'تمام اقسام',
    size_any: 'کوئی بھی سائز',
    price_any: 'کوئی بھی قیمت',
    btn_search: '🔍 جائیدادیں تلاش کریں',
    btn_reset_filters: '🔄 فلٹرز صاف کریں',

    // Property Cards & Catalog
    verified_properties: 'پاکستان میں تصدیق شدہ جائیدادیں',
    properties_found: 'جائیدادیں مل گئیں',
    sort_by: 'ترتیب دیں:',
    sort_featured: 'خصوصی پہلے',
    sort_price_low: 'قیمت: کم سے زیادہ',
    sort_price_high: 'قیمت: زیادہ سے کم',
    sort_newest: 'تازہ ترین',
    view_grid: 'گرڈ ویو',
    view_map: 'نقشہ ویو',
    beds: 'کمرے',
    baths: 'باتھ روم',
    area: 'رقبہ',
    marla: 'مرلہ',
    kanal: 'کنال',
    sqft: 'مربع فٹ',
    for_sale: 'برائے فروخت',
    for_rent: 'برائے کرایہ',
    megaproject: 'میگا پروجیکٹ',
    call_now: 'ابھی کال کریں',
    btn_view_details: 'تفصیلات دیکھیں',
    btn_contact: 'ڈیلر سے رابطہ کریں',
    btn_whatsapp: 'واٹس ایپ',
    btn_call: 'کال کریں',
    btn_save: 'محفوظ کریں',
    btn_saved: 'محفوظ شدہ ❤️',
    btn_compare: 'موازنہ کریں',
    btn_post_free: 'مفت اشتہار لگائیں',
    badge_verified: 'تصدیق شدہ',
    badge_featured: 'خصوصی',
    badge_exclusive: 'ممتاز',

    // Property Details Modal & Page
    property_overview: 'جائیداد کا جائزہ اور تفصیلات',
    amenities_features: 'سہولیات اور خصوصیات',
    location_map: 'مقام اور نقشہ',
    posted_by: 'پوسٹ کنندہ',
    schedule_tour: 'دورے کا وقت طے کریں',
    virtual_tour: 'ورچوئل 3D ٹور',
    calculate_mortgage: 'رہن کیلکولیٹر',
    fbr_tax_estimate: 'FBR ٹیکس تخمینہ',
    inquire_whatsapp: 'واٹس ایپ پر رابطہ کریں',

    // Housing Megaprojects
    featured_projects_title: 'پاکستان کے معروف میگا ہاؤسنگ پروجیکٹس',
    starting_from: 'ابتدائی قیمت',
    total_units: 'کل یونٹس',
    developer: 'ڈویلپر',
    explore_project: 'پروجیکٹ کی تفصیلات',

    // Blogs & Insights
    blogs_header_title: 'رئیل اسٹیٹ خبریں، ٹیکس اور مارکیٹ تجزیہ',
    all_categories: 'تمام مضامین',
    read_full_article: 'مکمل مضمون پڑھیں',

    // Calculators & Land Tools
    tools_title: 'مالیاتی کیلکولیٹر اور زمین کی پیمائش کے ٹولز',
    tab_converter: 'رقبہ کنورٹر',
    tab_mortgage: 'ہوم لون کیلکولیٹر',
    tab_valuation: 'جائیداد کی تخمینی قیمت',
    tab_fbr: 'FBR ٹیکس گائیڈ 2026',

    // Agents Directory
    agents_title: 'تصدیق شدہ رئیل اسٹیٹ ایجنسیاں اور ڈیلرز',
    verified_agency: 'تصدیق شدہ ایجنسی',
    listings_count: 'فعال جائیدادیں',
    contact_agency: 'ایجنسی سے رابطہ کریں',

    // Post Property Wizard
    post_property_title: 'جائیداد کا اشتہار لگائیں',
    step_basic_info: '1. بنیادی تفصیلات',
    step_location_price: '2. مقام اور قیمت',
    step_features: '3. خصوصیات اور سہولیات',
    step_photos: '4. تصاویر اور اشاعت',
    next_step: 'اگلا قدم',
    prev_step: 'پچھلا قدم',
    submit_property: 'اشتہار شائع کریں',

    // Dashboard & ProFolio Studio
    dash_welcome: 'خوش آمدید،',
    dash_overview: 'ڈیش بورڈ جائزہ',
    dash_add_property: 'جائیداد شامل کریں',
    dash_my_listings: 'میری جائیدادیں',
    dash_favorites: 'محفوظ شدہ جائیدادیں',
    dash_inquiries: 'انکوائریز اور پیغامات',
    dash_analytics: 'کارکردگی کی رپورٹ',
    dash_mega_projects: 'میگا پروجیکٹس اسٹوڈیو',
    dash_subscriptions: 'سبسکرپشن اور پیکیجز',
    dash_users: 'صارفین کی فہرست',
    dash_dealers: 'تصدیق شدہ ڈیلرز',
    dash_approvals: 'منظوری کے انتظار میں اشتہارات',
    dash_profile: 'پروفائل ترتیبات',
    dash_preferences: 'پورٹل ترجیحات',
    dash_password: 'پاس ورڈ تبدیل کریں',
    overview_stats: 'کوئیک ڈیش بورڈ اعداد و شمار',
    active_properties: 'فعال اشتہارات',
    total_leads: 'کل انکوائریز',
    profile_views: 'کل ویوز',
    add_new_property: 'نیا اشتہار شامل کریں',
    manage_listings: 'اشتہارات کا انتظام',
    save_changes: 'تبدیلیاں محفوظ کریں',
    edit_profile: 'پروفائل میں ترمیم کریں',
    change_password_title: 'پاس ورڈ تبدیل کریں',
    current_password: 'موجودہ پاس ورڈ',
    new_password: 'نیا پاس ورڈ',
    confirm_password: 'نئے پاس ورڈ کی تصدیق کریں',
    update_password_btn: 'پاس ورڈ تبدیل کریں',

    // Auth
    auth_login_title: 'اپنے سرمایہ دار اکاؤنٹ میں سائن ان کریں',
    auth_register_title: 'نیا سرمایہ دار اکاؤنٹ بنائیں',
    email_label: 'ای میل ایڈریس',
    password_label: 'پاس ورڈ',
    phone_label: 'موبائل فون نمبر',
    full_name_label: 'پورا نام',
    role_user: 'عام صارف (خریداری / کرایہ)',
    role_dealer: 'رئیل اسٹیٹ ڈیلر / ایجنسی',
    btn_submit_login: 'سائن ان کریں',
    btn_submit_register: 'اکاؤنٹ بنائیں',

    // Chatbot
    bot_greeting: 'السلام علیکم! 👋 میں آپ کا سرمایہ دار AI اسسٹنٹ ہوں۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟',
    type_message: 'اپنا پیغام ٹائپ کریں...',

    // Footer
    footer_tagline: 'پاکستان کا سب سے قابل اعتماد ڈیجیٹل رئیل اسٹیٹ نیٹ ورک۔',
    footer_quick_links: 'اہم لنکس',
    footer_popular_cities: 'مشہور شہر',
    footer_rights: 'جملہ حقوق محفوظ ہیں۔'
  },

  ar: {
    // Navigation & Header
    nav_sale: 'عقارات للبيع',
    nav_rent: 'عقارات للإيجار',
    nav_projects: 'المشاريع العقارية الكبرى',
    nav_blogs: 'المدونات والرؤى',
    nav_tools: 'الحاسبات والأدوات',
    nav_agents: 'دليل الوكلاء',
    nav_advertise: '📢 الإعلان',
    nav_dealer: 'بوابة الوكيل',
    nav_admin: 'بوابة المشرف',
    nav_dashboard: 'لوحة التحكم',
    nav_settings: 'إعدادات الحساب',
    nav_logout: 'تسجيل الخروج',
    nav_login: 'تسجيل الدخول / التسجيل',
    nav_become_dealer: 'کن وكيلاً',
    language: 'اللغة',
    go_to_portal: 'العودة إلى الصفحة الرئيسية',

    // Hero & Search Engine
    hero_title: 'ابحث عن <span class="gradient-text">عقار</span> أحلامك في باكستان',
    hero_subtitle: 'ابحث عن منازل وأراضٍ ومشاريع تجارية موثوقة ومفحوصة مباشرة من كبار الوكلاء.',
    ai_search_title: 'محرك البحث الذكي',
    ai_search_subtitle: 'اكتب باللغة الإنجليزية أو الأردية',
    ai_search_placeholder: 'مثال: منزل 10 مارلا في دي إتش إيه لاهور أقل من 4.5 كرور...',
    ai_search_btn: 'بحث ذكي',
    quick_prompts: 'مطالبات سريعة:',

    // Filters
    purpose_buy: 'شراء عقار',
    purpose_rent: 'استئجار عقار',
    purpose_projects: 'مشاريع كبرى',
    city_label: 'المدينة',
    society_label: 'المجمع / القطاع',
    type_label: 'نوع العقار',
    size_label: 'حجم العقار',
    price_label: 'الحد الأقصى للسعر',
    city_all: 'جميع مدن باكستان',
    society_all: 'جميع المجتمعات والمواقع',
    type_all: 'جميع الأنواع',
    size_any: 'أي حجم',
    price_any: 'أي سعر',
    btn_search: '🔍 البحث عن العقارات',
    btn_reset_filters: '🔄 إعادة ضبط الفلاتر',

    // Property Cards & Catalog
    verified_properties: 'العقارات الموثقة في باكستان',
    properties_found: 'عقارات تم العثور عليها',
    sort_by: 'فرز حسب:',
    sort_featured: 'المميزة أولاً',
    sort_price_low: 'السعر: من الأقل للأعلى',
    sort_price_high: 'السعر: من الأعلى للأقل',
    sort_newest: 'الأحدث',
    view_grid: 'عرض شبكي',
    view_map: 'عرض الخريطة',
    beds: 'غرف',
    baths: 'حمامات',
    area: 'المساحة',
    marla: 'مارلا',
    kanal: 'كانال',
    sqft: 'قدم مربع',
    for_sale: 'للبيع',
    for_rent: 'للإيجار',
    megaproject: 'مشروع كبير',
    call_now: 'اتصل الآن',
    btn_view_details: 'عرض التفاصيل',
    btn_contact: 'الاتصال بالوكيل',
    btn_whatsapp: 'واتساب',
    btn_call: 'اتصال',
    btn_save: 'حفظ العقار',
    btn_saved: 'محفوظ ❤️',
    btn_compare: 'مقارنة',
    btn_post_free: 'أضف عقارك مجاناً',
    badge_verified: 'موثق',
    badge_featured: 'مميز',
    badge_exclusive: 'حصري',

    // Property Details Modal & Page
    property_overview: 'نظرة عامة على العقار والتفاصيل',
    amenities_features: 'المرافق والميزات',
    location_map: 'الموقع والخريطة',
    posted_by: 'تم النشر بواسطة',
    schedule_tour: 'جدولة زيارة',
    virtual_tour: 'جولة افتراضية 3D',
    calculate_mortgage: 'حاسبة التمويل العقاري',
    fbr_tax_estimate: 'تقدير ضريبة FBR',
    inquire_whatsapp: 'استفسر عبر واتساب',

    // Housing Megaprojects
    featured_projects_title: 'المشاريع العقارية الكبرى الرئيسية في باكستان',
    starting_from: 'تبدأ من',
    total_units: 'إجمالي الوحدات',
    developer: 'المطور',
    explore_project: 'استكشاف المشروع',

    // Blogs & Insights
    blogs_header_title: 'أخبار العقارات والضرائب وتوجهات السوق',
    all_categories: 'جميع المقالات',
    read_full_article: 'قراءة المقال كاملاً',

    // Calculators & Land Tools
    tools_title: 'الحاسبات المالية وأدوات قياس الأراضي',
    tab_converter: 'محول وحدات المساحة',
    tab_mortgage: 'حاسبة القروض العقارية',
    tab_valuation: 'تقييم العقارات',
    tab_fbr: 'دليل ضريبة FBR 2026',

    // Agents Directory
    agents_title: 'وكالات العقارات والوسطاء المعتمدون',
    verified_agency: 'وكالة معتمدة',
    listings_count: 'العروض النشطة',
    contact_agency: 'الاتصال بالوكالة',

    // Post Property Wizard
    post_property_title: 'إضافة عرض عقاري',
    step_basic_info: '1. التفاصيل الأساسية',
    step_location_price: '2. الموقع والسعر',
    step_features: '3. الميزات والمرافق',
    step_photos: '4. الصور والنشر',
    next_step: 'الخطوة التالية',
    prev_step: 'الخطوة السابقة',
    submit_property: 'نشر العرض',

    // Dashboard & ProFolio Studio
    dash_welcome: 'مرحباً بك،',
    dash_overview: 'نظرة عامة على لوحة التحكم',
    dash_add_property: 'إضافة عقار',
    dash_my_listings: 'عروض عقاراتي',
    dash_favorites: 'المفضلة',
    dash_inquiries: 'الاستفسارات والرسائل',
    dash_analytics: 'تحليلات الأداء',
    dash_mega_projects: 'المشاريع العقارية الكبرى',
    dash_subscriptions: 'الاشتراكات والباقات',
    dash_users: 'إدارة المستخدمين',
    dash_dealers: 'الوكلاء المعتمدون',
    dash_approvals: 'قائمة الموافقات',
    dash_profile: 'إعدادات الملف الشخصي',
    dash_preferences: 'تفضيلات المنصة',
    dash_password: 'تغيير كلمة المرور',
    overview_stats: 'إحصائيات سريعة',
    active_properties: 'العقارات النشطة',
    total_leads: 'إجمالي الاستفسارات',
    profile_views: 'إجمالي المشاهدات',
    add_new_property: 'إضافة عرض جديد',
    manage_listings: 'إدارة العروض',
    save_changes: 'حفظ التغييرات',
    edit_profile: 'تعديل الملف الشخصي',
    change_password_title: 'تغيير كلمة المرور',
    current_password: 'كلمة المرور الحالية',
    new_password: 'كلمة المرور الجديدة',
    confirm_password: 'تأكيد كلمة المرور الجديدة',
    update_password_btn: 'تحديث كلمة المرور',

    // Auth
    auth_login_title: 'تسجيل الدخول إلى حسابك في سرمايه دار',
    auth_register_title: 'إنشاء حساب جديد في سرمايه دار',
    email_label: 'البريد الإلكتروني',
    password_label: 'كلمة المرور',
    phone_label: 'رقم الهاتف المحمول',
    full_name_label: 'الاسم الكامل',
    role_user: 'مستخدم عادي (شراء / إيجار)',
    role_dealer: 'وكيل عقارات / وكالة',
    btn_submit_login: 'تسجيل الدخول الآن',
    btn_submit_register: 'إنشاء حساب',

    // Chatbot
    bot_greeting: 'مرحباً! 👋 أنا مساعدك الذكي في منصة سرمايه دار. كيف يمكنني مساعدتك في العثور على العقارات اليوم؟',
    type_message: 'اكتب رسالتك...',

    // Footer
    footer_tagline: 'شبكة العقارات الرقمية الأكثر ثقة في باكستان.',
    footer_quick_links: 'روابط سريعة',
    footer_popular_cities: 'المدن الشهيرة',
    footer_rights: 'جميع الحقوق محفوظة.'
  }
};

const CITY_TRANSLATIONS = {
  Lahore: { ur: 'لاہور', ar: 'لاهور' },
  Karachi: { ur: 'کراچی', ar: 'كراتشي' },
  Islamabad: { ur: 'اسلام آباد', ar: 'إسلام آباد' },
  Rawalpindi: { ur: 'راولپنڈی', ar: 'راولبندي' },
  Peshawar: { ur: 'پشاور', ar: 'بيشاور' },
  Multan: { ur: 'ملتان', ar: 'ملتان' },
  Faisalabad: { ur: 'فیصل آباد', ar: 'فيصل آباد' },
  Quetta: { ur: 'کوئٹہ', ar: 'كويتا' },
  Sialkot: { ur: 'سیالکوٹ', ar: 'سيالكوت' },
  Gujranwala: { ur: 'گجرانوالہ', ar: 'جوجرانوالا' }
};

const CATEGORY_TRANSLATIONS = {
  'Residential Plot': { ur: 'رہائشی پلاٹ', ar: 'قطعة أرض سكنية' },
  'House': { ur: 'مکان', ar: 'منزل' },
  'Flat / Apartment': { ur: 'فلیٹ / اپارٹمنٹ', ar: 'شقة' },
  'Commercial Area': { ur: 'تجارتی ایریا', ar: 'منطقة تجارية' },
  'Shop': { ur: 'دکان', ar: 'محل' },
  'Office': { ur: 'دفتر', ar: 'مكتب' },
  'Plot File': { ur: 'پلاٹ فائل', ar: 'ملف أرض' },
  'house': { ur: 'مکان', ar: 'منزل' },
  'apartment': { ur: 'اپارٹمنٹ', ar: 'شقة' },
  'plot': { ur: 'پلاٹ', ar: 'أرض' },
  'commercial': { ur: 'تجارتی', ar: 'تجاري' }
};

const DYNAMIC_TEXT_MAP = {
  ur: {
    // Property Titles
    '1 Kanal Ultra Modern Spanish Designer Villa': '1 کنال الٹرا ماڈرن اسپینی ڈیزائنر ولا',
    'Luxury 3 Bedroom Sea Facing Penthouse Suite': 'کلفٹن سمندر کنارے 3 بیڈ روم لگژری پینٹ ہاؤس سوٹ',
    '10 Marla Brand New Modern Corner Residence': '10 مرلہ برانڈ نیو ماڈرن کارنر رہائش گاہ',
    'Prime Commercial Plaza Plot on Main Boulevard': 'مین بلیوارڈ پر پرائم کمرشل پلازہ پلاٹ',
    '2 Kanal Executive Farmhouse Villa with Private Pool': 'پرائیویٹ پول کے ساتھ 2 کنال ایگزیکٹو فارم ہاؤس ولا',
    '10 Marla Fully Furnished Rental Upper Portion': '10 مرلہ مکمل فرنشڈ کرایہ پر اپر پورشن',
    '10 Marla Prime Residential Plot in Bahria Town': 'بحریا ٹاؤن میں 10 مرلہ پرائم رہائشی پلاٹ',
    '5 Marla Brand New Modern House in Bahria Town': 'بحریا ٹاؤن میں 5 مرلہ برانڈ نیو ماڈرن مکان',

    // Statuses & Badges
    'approved': 'منظور شدہ',
    'pending': 'زیر التواء',
    'rejected': 'مسترد شدہ',
    'Under Construction / Rapid Execution': 'زیر تعمیر / تیز رفتار ترقی',
    'Near Completion / Booking Open': 'تکمیل کے قریب / بکنگ جاری',
    'Pre-Launch Booking Open': 'قبل از وقت بکنگ کا آغاز',
    'Under Construction': 'زیر تعمیر',
    'Official Mega Launch / Booking Open': 'باقاعدہ میگا لانچ / بکنگ کھلی ہے',
    'Booking Open': 'بکنگ جاری ہے',
    'Shariah Compliant': 'شرعی اصولوں کے مطابق',
    '45 Stories Punjab Peak': 'پنجاب کا 45 منزلہ شاہکار',
    '50+ Luxury Amenities': '50 سے زائد پرتعیش سہولیات',
    'Rooftop Infinity Pool': 'روف ٹاپ انفینٹی پول',
    'Private Cinema & Spa': 'پرائیویٹ سینما اور سپا',
    'Ring Road Interchange Access': 'رنگ روڈ انٹرچینج تک رسائی',
    '9-Storey Mall & Residences': '9 منزلہ مال اور رہائش گاہیں',
    'High Footfall Commercial Outlets': 'کمرشل شاپنگ آؤٹ لیٹس',
    '24/7 Security & Power': '24/7 سیکورٹی اور سولر پاور',
    'High-Yield Commercial': 'زیادہ منافع بخش کمرشل',
    'Biometric Access Control': 'بائیومیٹرک سیکورٹی ایکسس',
    'Corporate Valet Parking': 'کارپوریٹ ویلے پارکنگ',
    'High Speed Passenger Elevators': 'تیز رفتار لفٹس',
    'Fully Managed Rental Service': 'مکمل مینجڈ رینٹل سروس',
    'Infinity Pool & Fitness Club': 'انفینٹی پول اور فٹنس کلب',
    'Sector C Prime Location': 'سیکٹر سی کی مرکزی لوکیشن',
    '24/7 Housekeeping Service': '24/7 ہاؤس کیپنگ سروس',
    '82 Stories Tower Peak': '82 منزلہ الترا بلند ٹاور',
    'Helipad & Revolving Dining': 'ہیلی پیڈ اور ریوالونگ ریستوراں',
    'DHA City Karachi Landmark': 'ڈی ایچ اے سٹی کراچی کا نیا تاریخی سنگ میل',
    'Smart Automation Sky Villas': 'سمارٹ آٹومیشن اسکائی ولاز',
    'Main Boulevard Prime Frontage': 'مین بلیوارڈ فرنٹج',
    'Guaranteed Rental Yield Option': 'ضمانت شدہ کرایہ آمدن',
    'Shariah Compliant Contracts': 'شرعی معاہدے',
    'High Capital Appreciation': 'سرمائے میں تیزی سے اضافہ',

    // Features & Amenities
    'Basement Cinema': 'بیسمنٹ سینما',
    'Swimming Pool': 'سوئمنگ پول',
    'Imported Kitchen': 'امپورٹڈ کچن',
    'Smart Home Automation': 'سمارٹ ہوم آٹومیشن',
    'Lush Lawn': 'سرسبز لان',
    'Solar System Installed': 'سولر سسٹم نصب',
    'Panoramic Sea View': 'سمندر کا خوبصورت منظر',
    'High-Speed Elevators': 'تیز رفتار لفٹس',
    'Infinity Pool Access': 'انفینٹی پول سہولت',
    'Private Terrace Balcony': 'پرائیویٹ ٹیرس بالکونی',
    '24/7 Gated Security': '24/7 محفوظ سیکورٹی',
    'Gym & Spa': 'جِم اور سپا',
    'Corner Plot': 'کارنر پلاٹ',
    'Double Kitchen': 'ڈبل کچن',
    'Servant Quarter': 'سرونٹ کوارٹر',
    'Grohe Fitting': 'گروہے فٹنگز',
    'Solid Teak Woodwork': 'سالیڈ ٹیک ووڈ ورک',
    '3 Car Parking': '3 گاڑیوں کی پارکنگ',
    'Main Boulevard Facing': 'مین بلیوارڈ فیسنگ',
    'Approved High-Rise Plan': 'منظور شدہ ہائی رائز نقشہ',
    'Basement Parking': 'بیسمنٹ پارکنگ',
    'Heavy Footfall': 'کمرشل رونق',
    'High Rental Yield': 'زیادہ کرایہ آمدن',
    'Margalla Mountain View': 'مرگلہ پہاڑوں کا منظر',
    'Private Swimming Pool': 'پرائیویٹ سوئمنگ پول',
    'Organic Fruit Orchard': 'پھلوں کا باقچہ',
    'Jacuzzi Suite': 'جکوزی سوٹ',
    'Separate Guest House': 'علیحدہ گیسٹ ہاؤس',
    'Fully Furnished': 'مکمل فرنشڈ',
    'Inverter AC Installed': 'انورٹر اے سی نصب',
    'Dedicated Parking': 'مخصوص پارکنگ',
    'Gated Security': 'گیٹڈ سیکورٹی',
    'UPS & Solar Backup': 'یو پی ایس اور سولر بیک اپ',
    '40ft Road': '40 فٹ کشادہ سڑک',
    'Park Facing': 'پارک فیسنگ',
    'Possession Paid': 'پزیشن پیڈ',
    'Underground Electricity': 'انڈر گراؤنڈ بجلی',
    'Solid Woodwork': 'سالیڈ ووڈ ورک',
    'Car Porch': 'کار پورچ',
    'Terrace': 'ٹیرس'
  },
  ar: {
    // Property Titles
    '1 Kanal Ultra Modern Spanish Designer Villa': 'فيلا إسبانية فاخرة 1 كانال حديثة للغاية',
    'Luxury 3 Bedroom Sea Facing Penthouse Suite': 'جناح بنتهاوس فاخر 3 غرف نوم مطل على البحر',
    '10 Marla Brand New Modern Corner Residence': 'منزل زاوية حديث 10 مارلا جديد تماماً',
    'Prime Commercial Plaza Plot on Main Boulevard': 'قطعة أرض تجارية ممتازة على شارع رئيسي',
    '2 Kanal Executive Farmhouse Villa with Private Pool': 'فيلا مزرعة تنفيذي 2 كانال مع حمام سباحة خاص',
    '10 Marla Fully Furnished Rental Upper Portion': 'جزء علوي مفروش بالكامل للإيجار 10 مارلا',
    '10 Marla Prime Residential Plot in Bahria Town': 'قطعة أرض سكنية ممتازة 10 مارلا في بحرية تاون',
    '5 Marla Brand New Modern House in Bahria Town': 'منزل حديث 5 مارلا جديد تماماً في بحرية تاون',

    // Statuses & Badges
    'approved': 'معتمد',
    'pending': 'قيد الانتظار',
    'rejected': 'مرفوض',
    'Under Construction / Rapid Execution': 'قيد الإنشاء / تطوير سريع',
    'Near Completion / Booking Open': 'قرب الانتهاء / الحجز مفتوح',
    'Pre-Launch Booking Open': 'الحجز الإفتتاحي مفتوح',
    'Under Construction': 'قيد الإنشاء',
    'Official Mega Launch / Booking Open': 'الإطلاق الرسمي الكبير / الحجز مفتوح',
    'Booking Open': 'الحجز مفتوح',
    'Shariah Compliant': 'متوافق مع الشريعة الإسلامية',
    '45 Stories Punjab Peak': 'برج شاهق 45 طابقاً',
    '50+ Luxury Amenities': 'أكثر من 50 ميزة فاخرة',
    'Rooftop Infinity Pool': 'حمام سباحة إنفينيتي على السطح',
    'Private Cinema & Spa': 'سينما خاصة وسبا',
    'Ring Road Interchange Access': 'وصول مباشر للطريق الدائري',
    '9-Storey Mall & Residences': 'مول ومجمع سكني من 9 طوابق',
    'High Footfall Commercial Outlets': 'محلات تجارية ذات حركة عالية',
    '24/7 Security & Power': 'حراسة وطاقة مستمرة',
    'High-Yield Commercial': 'عقارات تجارية عالية العائد',
    'Biometric Access Control': 'تحكم بالدخول بالبصمة',
    'Corporate Valet Parking': 'خدمة صف السيارات للشركات',
    'High Speed Passenger Elevators': 'مصاعد ركاب سريعة',
    'Fully Managed Rental Service': 'خدمة تأجير مدارة بالكامل',
    'Infinity Pool & Fitness Club': 'مسبح إنفينيتي ونادي لياقة',
    'Sector C Prime Location': 'موقع متميز في القطاع C',
    '24/7 Housekeeping Service': 'خدمة تدبير منزلي على مدار الساعة',
    '82 Stories Tower Peak': 'برج شاهق 82 طابقاً',
    'Helipad & Revolving Dining': 'مهبط مروحيات ومطعم دوار',
    'DHA City Karachi Landmark': 'معلم بارز في مدينة دي إتش إيه كراتشي',
    'Smart Automation Sky Villas': 'فيلات معلقة ذكية',
    'Main Boulevard Prime Frontage': 'واجهة متميزة على الشارع الرئيسي',
    'Guaranteed Rental Yield Option': 'خيار عائد إيجاري مضمون',
    'Shariah Compliant Contracts': 'عقود شرعية',
    'High Capital Appreciation': 'نمو رأسمالي مرتفع',

    // Features & Amenities
    'Basement Cinema': 'سينما في القبو',
    'Swimming Pool': 'حمام سباحة',
    'Imported Kitchen': 'مطبخ مستورد',
    'Smart Home Automation': 'أتمتة المنزل الذكي',
    'Lush Lawn': 'حديقة خضراء',
    'Solar System Installed': 'نظام طاقة شمسية مثبت',
    'Panoramic Sea View': 'إطلالة بانورامية على البحر',
    'High-Speed Elevators': 'مصاعد سريعة',
    'Infinity Pool Access': 'مسبح إنفينيتي',
    'Private Terrace Balcony': 'شرفة خاصة',
    '24/7 Gated Security': 'حراسة وأمن على مدار الساعة',
    'Gym & Spa': 'نادي صحي وسبا',
    'Corner Plot': 'قطعة أرض زاوية',
    'Double Kitchen': 'مطبخ مزدوج',
    'Servant Quarter': 'غرفة خادمة',
    'Grohe Fitting': 'تجهيزات جروهي',
    'Solid Teak Woodwork': 'أعمال خشبية فاخرة',
    '3 Car Parking': 'موقف لـ 3 سيارات',
    'Main Boulevard Facing': 'مواجه للشارع الرئيسي',
    'Approved High-Rise Plan': 'مخطط معتمد للأبراج',
    'Basement Parking': 'موقف سيارات سفلي',
    'Heavy Footfall': 'منطقة تجارية نشطة',
    'High Rental Yield': 'عائد إيجاري مرتفع',
    'Margalla Mountain View': 'إطلالة على جبال مرگلہ',
    'Private Swimming Pool': 'حمام سباحة خاص',
    'Organic Fruit Orchard': 'بستان فواكه عضوي',
    'Jacuzzi Suite': 'جناح جاكوزي',
    'Separate Guest House': 'منزل ضيوف منفصل',
    'Fully Furnished': 'مفروش بالكامل',
    'Inverter AC Installed': 'مكيفات إنفرتر مثبتة',
    'Dedicated Parking': 'موقف سيارات مخصص',
    'Gated Security': 'مجمع سكني مغلق ومحمي',
    'UPS & Solar Backup': 'طاقة شمسية بديلة',
    '40ft Road': 'شارع بعرض 40 قدم',
    'Park Facing': 'مطل على الحديقة',
    'Possession Paid': 'تم دفع رسوم الحيازة',
    'Underground Electricity': 'كهرباء تحت الأرض',
    'Solid Woodwork': 'أعمال خشبية متينة',
    'Car Porch': 'مظلة سيارة',
    'Terrace': 'تراس'
  }
};

export function getLanguage() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('Sarmayadar_language');
    if (saved && ['en', 'ur', 'ar'].includes(saved)) {
      return saved;
    }
  }
  return 'en';
}

export function getDirection(langCode = getLanguage()) {
  return (langCode === 'ur' || langCode === 'ar') ? 'rtl' : 'ltr';
}

export function applyLanguageSettings(langCode) {
  if (typeof document === 'undefined') return;
  const dir = getDirection(langCode);
  if (document.documentElement) {
    document.documentElement.lang = langCode;
    document.documentElement.dir = dir;
  }
  
  if (dir === 'rtl') {
    if (document.documentElement && document.documentElement.classList) document.documentElement.classList.add('rtl-mode');
    if (document.body && document.body.classList) document.body.classList.add('rtl-mode');
  } else {
    if (document.documentElement && document.documentElement.classList) document.documentElement.classList.remove('rtl-mode');
    if (document.body && document.body.classList) document.body.classList.remove('rtl-mode');
  }
}

export function initI18n(state) {
  const lang = getLanguage();
  state.language = lang;
  applyLanguageSettings(lang);
  return lang;
}

export function setLanguage(langCode, state, renderAppFn) {
  if (!['en', 'ur', 'ar'].includes(langCode)) return;
  state.language = langCode;
  localStorage.setItem('Sarmayadar_language', langCode);
  applyLanguageSettings(langCode);
  if (typeof renderAppFn === 'function') {
    renderAppFn();
  }
}

export function t(key, fallback = '') {
  const lang = getLanguage();
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
    return TRANSLATIONS[lang][key];
  }
  if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
    return TRANSLATIONS.en[key];
  }
  return fallback || key;
}

export function tCity(cityName) {
  const lang = getLanguage();
  if (lang === 'en' || !cityName) return cityName;
  if (CITY_TRANSLATIONS[cityName] && CITY_TRANSLATIONS[cityName][lang]) {
    return CITY_TRANSLATIONS[cityName][lang];
  }
  return cityName;
}

export function tCategory(catName) {
  const lang = getLanguage();
  if (lang === 'en' || !catName) return catName;
  if (CATEGORY_TRANSLATIONS[catName] && CATEGORY_TRANSLATIONS[catName][lang]) {
    return CATEGORY_TRANSLATIONS[catName][lang];
  }
  return catName;
}

export function tPurpose(purpose) {
  if (purpose === 'sale') return t('for_sale', 'For Sale');
  if (purpose === 'rent') return t('for_rent', 'For Rent');
  if (purpose === 'projects') return t('megaproject', 'Megaproject');
  return purpose;
}

export function tText(text) {
  if (!text) return '';
  const lang = getLanguage();
  if (lang === 'en') return text;

  if (DYNAMIC_TEXT_MAP[lang] && DYNAMIC_TEXT_MAP[lang][text]) {
    return DYNAMIC_TEXT_MAP[lang][text];
  }

  // Smart keyword translation fallback for dynamic titles
  let str = String(text);
  if (lang === 'ur') {
    str = str.replace(/1 Kanal/gi, '1 کنال')
             .replace(/2 Kanal/gi, '2 کنال')
             .replace(/10 Marla/gi, '10 مرلہ')
             .replace(/5 Marla/gi, '5 مرلہ')
             .replace(/7 Marla/gi, '7 مرلہ')
             .replace(/for Sale/gi, 'برائے فروخت')
             .replace(/for Rent/gi, 'برائے کرایہ')
             .replace(/Brand New/gi, 'برانڈ نیو')
             .replace(/Modern House/gi, 'جدید مکان')
             .replace(/Villa/gi, 'ولا')
             .replace(/Apartment/gi, 'اپارٹمنٹ')
             .replace(/Commercial/gi, 'تجارتی')
             .replace(/Residential Plot/gi, 'رہائشی پلاٹ');
  } else if (lang === 'ar') {
    str = str.replace(/1 Kanal/gi, '1 كانال')
             .replace(/2 Kanal/gi, '2 كانال')
             .replace(/10 Marla/gi, '10 مارلا')
             .replace(/5 Marla/gi, '5 مارلا')
             .replace(/7 Marla/gi, '7 مارلا')
             .replace(/for Sale/gi, 'للبيع')
             .replace(/for Rent/gi, 'للإيجار')
             .replace(/Brand New/gi, 'جديد تماماً')
             .replace(/Modern House/gi, 'منزل حديث')
             .replace(/Villa/gi, 'فيلا')
             .replace(/Apartment/gi, 'شقة')
             .replace(/Commercial/gi, 'تجاري')
             .replace(/Residential Plot/gi, 'أرض سكنية');
  }
  return str;
}
