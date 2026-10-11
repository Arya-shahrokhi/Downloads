import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/response.js';
import ApiError from '../utils/ApiError.js';
import { emailService } from '../services/email/index.js';
import { env } from '../config/env.js';

const SUCCESS = 'پیام شما ارسال شد؛ به‌زودی پاسخ می‌دهیم';

export const sendContact = asyncHandler(async (req, res) => {
  const { website, ...payload } = req.body;
  // ربات فیلد مخفی را پر می‌کند: وانمود به موفقیت، بدون ارسال
  if (website) return ok(res, {}, SUCCESS);

  try {
    await emailService.contact(payload);
  } catch (err) {
    console.error(`[mail] پیام تماس از ${payload.email} ارسال نشد: ${err.message}`);
    throw new ApiError(503, 'ارسال پیام فعلاً ممکن نیست، لطفاً تلفنی تماس بگیرید یا کمی بعد تلاش کنید');
  }
  return ok(res, {}, SUCCESS);
});

/** ادمین: تست تنظیمات SMTP با ارسال یک ایمیل آزمایشی. */
export const sendTestEmail = asyncHandler(async (req, res) => {
  if (!env.mail.enabled) throw ApiError.badRequest('SMTP تنظیم نشده است؛ متغیرهای SMTP_* را در محیط سرور پر کنید');
  const to = req.body?.to || req.user.email;
  let result;
  try {
    result = await emailService.test(to);
  } catch (err) {
    result = { ok: false, reason: err.message };
  }
  if (!result.ok) throw ApiError.badRequest(`اتصال SMTP ناموفق بود: ${result.reason}`);
  return ok(res, { to }, `ایمیل آزمایشی به ${to} ارسال شد`);
});
