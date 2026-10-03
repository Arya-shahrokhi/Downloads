import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

/** رشته را به عدد امن تبدیل می‌کند، با مقدار پیش‌فرض در صورت نامعتبر بودن. */
const num = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
};

/** لیست دامنه‌های مجاز CORS از یک رشته کاماجدا. */
const list = (value, fallback = []) => {
  if (!value) return fallback;
  return String(value).split(',').map((s) => s.trim()).filter(Boolean);
};

/** Boolean env var: "true/1/yes" → true, "false/0/no" → false, anything else → fallback. */
const bool = (value, fallback) => {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
};

const clientOrigins = list(process.env.CLIENT_ORIGIN, ['http://localhost:5173', 'http://127.0.0.1:5173']);
// Public, canonical origin of the site (no trailing slash). Used for canonical
// URLs, sitemap.xml, robots.txt, Open Graph and JSON-LD.
const siteUrl = String(process.env.SITE_URL || clientOrigins[0] || 'http://localhost:5173').trim().replace(/\/+$/, '');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
const cloudKey = process.env.CLOUDINARY_API_KEY || '';
const cloudSecret = process.env.CLOUDINARY_API_SECRET || '';

export const env = {
  nodeEnv,
  isProd,
  isTest: nodeEnv === 'test',
  port: num(process.env.PORT, 5000),

  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attari',

  // آرایه است تا چند دامنه (لوکال + پرودکشن) با هم پشتیبانی شود
  clientOrigin: clientOrigins,

  seo: {
    siteUrl,
    // Staging/preview deployments must set SEO_ALLOW_INDEXING=false so Google
    // never indexes them. Defaults to true only in production.
    allowIndexing: bool(process.env.SEO_ALLOW_INDEXING, isProd),
    // 301 every request whose host differs from SITE_URL (www ↔ non-www, http → https).
    redirectToCanonicalHost: bool(process.env.SEO_REDIRECT_TO_CANONICAL_HOST, false),
    // Optional public profiles for Organization.sameAs (comma separated full URLs).
    sameAs: list(process.env.SEO_SAME_AS),
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || '',
    refreshSecret: process.env.JWT_REFRESH_SECRET || '',
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '30d',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@attari.local',
    password: process.env.ADMIN_PASSWORD || '',
    phone: process.env.ADMIN_PHONE || '09120000000',
  },

  cloudinary: {
    cloudName,
    apiKey: cloudKey,
    apiSecret: cloudSecret,
    // فقط وقتی هر سه مقدار موجود باشند فعال است، وگرنه آپلود محلی
    enabled: Boolean(cloudName && cloudKey && cloudSecret),
  },

  shipping: {
    flat: num(process.env.SHIPPING_FLAT, 49000),
    freeThreshold: num(process.env.FREE_SHIPPING_THRESHOLD, 1000000),
  },
};

/**
 * اعتبارسنجی زودهنگام: بهتر است سرور همان ابتدا با پیام روشن بالا نیاید
 * تا اینکه در اولین لاگین کاربر با خطای مبهم jwt بشکند.
 */
const problems = [];

if (!env.jwt.accessSecret) problems.push('JWT_ACCESS_SECRET تعریف نشده است');
if (!env.jwt.refreshSecret) problems.push('JWT_REFRESH_SECRET تعریف نشده است');
if (env.jwt.accessSecret && env.jwt.accessSecret === env.jwt.refreshSecret) {
  problems.push('JWT_ACCESS_SECRET و JWT_REFRESH_SECRET باید متفاوت باشند');
}
if (isProd && env.jwt.accessSecret.length < 32) {
  problems.push('JWT_ACCESS_SECRET در پرودکشن باید حداقل ۳۲ کاراکتر باشد');
}
if (isProd && env.jwt.refreshSecret.length < 32) {
  problems.push('JWT_REFRESH_SECRET در پرودکشن باید حداقل ۳۲ کاراکتر باشد');
}
if (!env.mongoUri) problems.push('MONGO_URI تعریف نشده است');
if (isProd && !process.env.SITE_URL) {
  // Not fatal: falls back to CLIENT_ORIGIN, but canonical URLs must be exact.
  console.warn(`[env] SITE_URL تعریف نشده است؛ آدرس canonical از CLIENT_ORIGIN گرفته شد: ${siteUrl}`);
}
if (isProd && /localhost|127\.0\.0\.1/.test(siteUrl)) {
  console.warn('[env] SITE_URL در پرودکشن به localhost اشاره می‌کند؛ sitemap و canonical اشتباه خواهند بود.');
}

if (problems.length) {
  const message = `[env] تنظیمات ناقص است:\n  - ${problems.join('\n  - ')}\n`
    + '  راهنما: فایل backend/.env.example را کپی کنید به backend/.env و مقادیر را پر کنید.\n'
    + '  ساخت کلید: openssl rand -hex 32';

  if (isProd) {
    console.error(message);
    process.exit(1);
  } else {
    // در توسعه فقط هشدار می‌دهیم تا کار seed و توسعه فرانت بلاک نشود
    console.warn(message);
  }
}

export default env;
