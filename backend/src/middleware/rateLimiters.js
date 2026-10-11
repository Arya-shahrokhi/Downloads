import rateLimit from 'express-rate-limit';
import { fail } from '../utils/response.js';

const handler = (_req, res) => fail(res, 429, 'تعداد درخواست‌ها بیش از حد مجاز است، چند دقیقه بعد تلاش کنید');

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/** سخت‌گیرانه روی auth تا brute-force گران شود. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/**
 * /auth/refresh: کلاینت هر ~۱۵ دقیقه (و با چند تب، چند بار) refresh می‌کند،
 * پس سقف باید از authLimiter بازتر باشد، ولی جلوی کوبیدن endpoint و
 * امتحان انبوه توکن‌های دزدیده را بگیرد.
 */
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

export const writeLimiter = rateLimit({ windowMs: 60 * 1000, max: 40, handler });

/**
 * هر درخواستی که ایمیل می‌فرستد (بازیابی رمز، ارسال دوباره‌ی تأیید):
 * درخواست موفق هم شمرده می‌شود، وگرنه می‌شد صندوق یک نفر را با ایمیل پر کرد
 * یا اعتبار SMTP را سوزاند.
 */
export const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/** فرم تماس با ما: ۵ پیام در ساعت برای هر IP. */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});
