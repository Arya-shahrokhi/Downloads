import { createHash, randomInt } from 'node:crypto';
import { SmsOtp, User } from '../models/index.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { ok } from '../utils/response.js';
import { normalizeIranPhoneNumber, sendOtpSms } from '../services/smsService.js';

export const getSmsStatus = asyncHandler(async (_req, res) => ok(res, {
  enabled: Boolean(env.sms.enabled && env.sms.kavenegarApiKey),
  otpRequired: env.sms.otpRequired,
}, 'وضعیت پیامک'));

const hashCode = (phone, code) => createHash('sha256')
  .update(`${env.sms.otpSecret}:${phone}:${code}`)
  .digest('hex');

export const requestRegistrationOtp = asyncHandler(async (req, res) => {
  if (!env.sms.enabled || !env.sms.kavenegarApiKey) {
    throw ApiError.badRequest('سرویس پیامک هنوز پیکربندی نشده است');
  }

  let phone;
  try { phone = normalizeIranPhoneNumber(req.body.phone); }
  catch { throw ApiError.badRequest('شماره موبایل ایران معتبر نیست'); }

  const localPhone = phone.startsWith('98') ? `0${phone.slice(2)}` : phone;
  if (await User.exists({ phone: localPhone })) {
    throw ApiError.conflict('این شماره موبایل قبلاً ثبت شده است');
  }

  const recent = await SmsOtp.findOne({
    phone, purpose: 'REGISTER', createdAt: { $gte: new Date(Date.now() - 60_000) },
  }).sort({ createdAt: -1 });
  if (recent) throw ApiError.tooMany('برای دریافت کد جدید، یک دقیقه صبر کنید');

  const code = String(randomInt(100000, 1000000));
  const otp = await SmsOtp.create({
    phone,
    purpose: 'REGISTER',
    codeHash: hashCode(phone, code),
    expiresAt: new Date(Date.now() + 5 * 60_000),
  });

  try {
    await sendOtpSms(phone, code);
  } catch (error) {
    await SmsOtp.deleteOne({ _id: otp._id });
    console.error('[sms] ارسال کد تایید ناموفق بود:', error.message);
    throw ApiError.badRequest('ارسال پیامک ناموفق بود؛ تنظیمات سرویس پیامک را بررسی کنید');
  }

  return ok(res, { phone, expiresInSeconds: 300 }, 'کد تایید ارسال شد');
});

export const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  let phone;
  try { phone = normalizeIranPhoneNumber(req.body.phone); }
  catch { throw ApiError.badRequest('شماره موبایل ایران معتبر نیست'); }

  const code = String(req.body.code || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(code)) throw ApiError.badRequest('کد تایید باید ۶ رقم باشد');

  const otp = await SmsOtp.findOne({ phone, purpose: 'REGISTER', expiresAt: { $gt: new Date() }, verifiedAt: null })
    .select('+codeHash')
    .sort({ createdAt: -1 });
  if (!otp) throw ApiError.badRequest('کد تایید منقضی شده یا وجود ندارد');
  if (otp.attempts >= 5) {
    await otp.deleteOne();
    throw ApiError.tooMany('تعداد تلاش‌ها بیش از حد مجاز است؛ کد جدید بگیرید');
  }

  if (otp.codeHash !== hashCode(phone, code)) {
    otp.attempts += 1;
    if (otp.attempts >= 5) await otp.deleteOne();
    else await otp.save();
    throw ApiError.badRequest('کد تایید اشتباه است');
  }

  otp.verifiedAt = new Date();
  await otp.save();
  return ok(res, { phone, verified: true }, 'شماره موبایل تایید شد');
});

/** Used by registration when SMS_OTP_REQUIRED=true. */
export const isPhoneVerifiedForRegistration = async (phone) => {
  let normalized;
  try { normalized = normalizeIranPhoneNumber(phone); } catch { return false; }
  const verified = await SmsOtp.findOne({
    phone: normalized,
    purpose: 'REGISTER',
    verifiedAt: { $gte: new Date(Date.now() - 15 * 60_000) },
    expiresAt: { $gt: new Date() },
  }).sort({ verifiedAt: -1 });
  return Boolean(verified);
};
