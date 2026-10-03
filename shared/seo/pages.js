/**
 * Meta data for fixed routes. Used by the server (meta injection + sitemap)
 * and by the React pages, so both always output the same title/description.
 *
 * `sitemap: false` keeps utility pages out of sitemap.xml.
 * Private pages also get `noindex` automatically via urls.js → robotsFor().
 */
export const STATIC_PAGES = {
  '/': {
    title: 'عطاری آنلاین کالاوران | خرید گیاهان دارویی، دمنوش و ادویه',
    absoluteTitle: true,
    description: 'عطاری آنلاین کالاوران: خرید گیاهان دارویی، دمنوش گیاهی، عرقیات سنتی، روغن‌های گیاهی پرس سرد، ادویه و محصولات طبیعی ایرانی با معرفی شفاف و ارسال سریع.',
    changefreq: 'daily',
    priority: 1.0,
  },
  '/products': {
    title: 'فروشگاه محصولات گیاهی و عطاری',
    description: 'همه‌ی محصولات گیاهی کالاوران در یک جا: گیاهان دارویی، دمنوش، عرقیات، روغن گیاهی، ادویه، خشکبار و عسل طبیعی. با فیلتر قیمت، امتیاز و موجودی.',
    changefreq: 'daily',
    priority: 0.9,
  },
  '/premium-products': {
    title: 'برنج ایرانی و ادویه‌های ممتاز',
    description: 'برنج ایرانی و ادویه‌های ارگانیک و پرمصرف، انتخاب‌شده برای آشپزی روزمره؛ منتخب کالاوران با کیفیت یکدست و بسته‌بندی مطمئن.',
    changefreq: 'weekly',
    priority: 0.7,
  },
  '/journal': {
    title: 'مجله گیاهان؛ راهنمای خرید و مصرف درست',
    description: 'نوشته‌های کوتاه و کاربردی درباره‌ی مصرف درست گیاهان دارویی، انتخاب دمنوش، تشخیص ادویه‌ی اصل، نگهداری گیاه خشک، عرقیات و روغن پرس سرد.',
    changefreq: 'weekly',
    priority: 0.6,
  },
  '/health-facts': {
    title: 'فکت‌های سلامت درباره گیاهان و دمنوش‌ها',
    description: 'فکت‌های کوتاه و منبع‌دار درباره‌ی گیاهان، دمنوش‌ها و مصرف مسئولانه؛ بدون ادعای درمان و با ارجاع به منابع معتبر.',
    changefreq: 'monthly',
    priority: 0.4,
  },
  '/about': {
    title: 'درباره کالاوران',
    description: 'کالاوران از یک دکان عطاری در بازار تهران شروع شد؛ خرید مستقیم از کشاورز، سرند و بسته‌بندی در انبار خودمان و معرفی صادقانه‌ی هر گیاه.',
    changefreq: 'yearly',
    priority: 0.4,
  },
  '/contact': {
    title: 'تماس با کالاوران',
    description: 'تماس با عطاری آنلاین کالاوران: تلفن ۰۹۰۲۷۴۰۳۳۳۱، ایمیل info@kalavaran.ir، نشانی تهران، ونک. شنبه تا پنجشنبه ۹ تا ۱۸ پاسخگو هستیم.',
    changefreq: 'yearly',
    priority: 0.4,
  },
  '/terms': {
    title: 'قوانین و مقررات خرید',
    description: 'قوانین خرید از کالاوران: قیمت‌ها، زمان ارسال سفارش، شرایط بازگشت کالا تا ۷ روز و رسیدگی به اختلاف وزن یا کیفیت.',
    changefreq: 'yearly',
    priority: 0.2,
  },
  '/privacy': {
    title: 'حریم خصوصی',
    description: 'سیاست حریم خصوصی کالاوران: چه اطلاعاتی می‌گیریم، چطور نگهداری می‌کنیم و چطور می‌توانید حذف داده‌های خود را درخواست کنید.',
    changefreq: 'yearly',
    priority: 0.2,
  },
  // Utility pages: still get proper titles, but noindex + not in sitemap.
  '/cart': { title: 'سبد خرید', description: 'بازبینی سبد خرید و ادامه‌ی فرآیند پرداخت در کالاوران.', sitemap: false },
  '/checkout': { title: 'تکمیل خرید', description: 'ثبت آدرس و نهایی کردن سفارش در کالاوران.', sitemap: false },
  '/login': { title: 'ورود به حساب', description: 'ورود به حساب کاربری کالاوران برای پیگیری سفارش‌ها و علاقه‌مندی‌ها.', sitemap: false },
  '/register': { title: 'ساخت حساب', description: 'ثبت‌نام در کالاوران برای خرید سریع‌تر و پیگیری سفارش‌ها.', sitemap: false },
};

export const NOT_FOUND_PAGE = {
  title: 'صفحه پیدا نشد',
  description: 'صفحه‌ای که دنبالش بودید پیدا نشد. از فهرست محصولات یا صفحه‌ی اصلی کالاوران شروع کنید.',
};

export const GONE_PRODUCT_PAGE = {
  title: 'این محصول دیگر عرضه نمی‌شود',
  description: 'این محصول از فروشگاه کالاوران حذف شده است. محصولات مشابه را در دسته‌بندی‌های فروشگاه ببینید.',
};
