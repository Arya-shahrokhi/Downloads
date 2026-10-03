import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { sanitizeRequest } from './middleware/sanitizeInput.js';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import { uploadsRoot } from './config/cloudinary.js';
import { seoRouter, spaHandler } from './seo/router.js';
import { canonicalHost } from './middleware/seo.js';

export const app = express();
const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const frontendDist = path.resolve(backendRoot, '../frontend/dist');

app.set('trust proxy', 1);
app.disable('x-powered-by');
// ETag قوی: پاسخ‌های تکراری با 304 بسته می‌شوند، بدون انتقال بدنه
app.set('etag', 'strong');

/**
 * compression اول صف: قبلاً بعد از body parser و sanitizer نشسته بود، یعنی
 * پاسخ‌های خطا و استاتیک از مسیرهای بالاتر بی‌فشرده رد می‌شدند.
 * حالا هر چیزی که از اپ بیرون می‌رود gzip/br می‌شود.
 */
// SEO: www/non-www and http/https duplicates → one canonical host (opt-in via env)
app.use(canonicalHost);

app.use(compression({
  threshold: 1024,
  // اگر کلاینت صریحاً نخواهد، فشرده نکن
  filter: (req, res) => (req.headers['x-no-compression'] ? false : compression.filter(req, res)),
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  /**
   * CSP: در پرودکشن همین Express فرانت را سرو می‌کند، پس CSP باید همین‌جا باشد.
   *  - script-src فقط 'self'؛ هیچ اسکریپت inline مجاز نیست.
   *  - script-src-attr فقط هندلر onload فونت در index.html (this.media='all') با هش.
   *    اگر آن هندلر تغییر کند، هش را دوباره بسازید:
   *    printf "%s" "this.media='all'" | openssl dgst -sha256 -binary | base64
   *  - JSON-LD (type=application/ld+json) اجرا نمی‌شود و نیازی به مجوز ندارد.
   *  - style-src 'unsafe-inline' برای style های inline ری‌اکت لازم است.
   */
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'unsafe-hashes'", "'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc='"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'"],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'", 'blob:'],
      ...(env.isProd ? { upgradeInsecureRequests: [] } : {}),
    },
  },
}));

app.use(cors({
  origin(origin, cb) {
    if (!origin || env.clientOrigin.includes(origin)) return cb(null, true);
    return cb(new Error('این دامنه اجازه دسترسی ندارد'));
  },
  credentials: true,
  exposedHeaders: ['X-Guest-Id'],
  maxAge: 86400, // preflight یک روز کش می‌شود، نه هر درخواست
}));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());
app.use(mongoSanitize());   // حذف $ و . از ورودی: NoSQL injection
app.use(sanitizeRequest);   // پاکسازی ورودی‌های متنی بدون وابستگی منسوخ

if (!env.isProd) app.use(morgan('dev'));
// در پرودکشن لاگ درخواست‌های موفق استاتیک نویز است و I/O می‌سوزاند
else app.use(morgan('combined', { skip: (req, res) => res.statusCode < 400 }));

app.use('/uploads', express.static(uploadsRoot, {
  maxAge: '30d',
  immutable: true,
  etag: true,
  lastModified: true,
}));

// API responses are data, not pages: keep raw JSON out of search results.
app.use('/api', (_req, res, next) => { res.set('X-Robots-Tag', 'noindex'); next(); });
app.use('/api', apiLimiter, routes);

// robots.txt + dynamic sitemap.xml (before static files so they always win)
app.use(seoRouter);

if (env.isProd) {
  /**
   * Cache policy:
   *  - /assets/* are content-hashed by Vite → cache forever (immutable).
   *  - everything else in /public (images, icons, manifest) is NOT hashed, so a
   *    1-year immutable cache would pin stale files after a replacement.
   *    One week + revalidation is the safe middle ground.
   */
  app.use('/assets', express.static(path.join(frontendDist, 'assets'), {
    maxAge: '1y',
    immutable: true,
    index: false,
    fallthrough: false, // a missing hashed chunk is a real 404, never index.html
  }));
  app.use(express.static(frontendDist, {
    maxAge: '7d',
    index: false,
    redirect: false,
  }));
  // Every page URL: index.html + page-specific meta tags + correct HTTP status.
  app.get('*', spaHandler());
}

app.use(notFound);
app.use(errorHandler);
