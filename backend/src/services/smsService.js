import { env } from '../config/env.js';

const baseUrl = 'https://api.kavenegar.com/v1';

const normalizeIranPhone = (value) => {
  const digits = String(value || '').replace(/[^\d+]/g, '').replace(/^\+/, '');
  if (/^09\d{9}$/.test(digits)) return `98${digits.slice(1)}`;
  if (/^989\d{9}$/.test(digits)) return digits;
  if (/^9\d{9}$/.test(digits)) return `98${digits}`;
  throw new Error('شماره موبایل ایران معتبر نیست');
};

const requestKavenegar = async (method, params) => {
  if (!env.sms.kavenegarApiKey) throw new Error('KAVENEGAR_API_KEY تنظیم نشده است');
  const url = new URL(`${baseUrl}/${env.sms.kavenegarApiKey}/${method}.json`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  });
  const response = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Kavenegar HTTP ${response.status}`);
  const payload = await response.json();
  const entry = payload?.entries?.[0];
  if (payload?.return?.status !== 200 || (entry?.status !== undefined && ![1, 4].includes(entry.status))) {
    throw new Error(`Kavenegar error: ${payload?.return?.message || entry?.statustext || 'unknown error'}`);
  }
  return payload;
};

export const smsEnabled = () => Boolean(env.sms.enabled && env.sms.kavenegarApiKey);

export const sendSms = async (to, message) => {
  if (!env.sms.enabled) return { skipped: true, reason: 'SMS_DISABLED' };
  const receptor = normalizeIranPhone(to);
  await requestKavenegar('sms/send', { receptor, message, sender: env.sms.sender });
  return { sent: true };
};

/** Kavenegar Verify Lookup needs a template approved in the provider panel. */
export const sendOtpSms = async (to, code) => {
  if (!env.sms.enabled) throw new Error('سرویس پیامک غیرفعال است');
  const receptor = normalizeIranPhone(to);
  if (env.sms.otpTemplate) {
    await requestKavenegar('verify/lookup', {
      receptor,
      token: code,
      template: env.sms.otpTemplate,
      type: 'sms',
    });
  } else {
    // Use this only if the provider account permits ordinary SMS for OTP.
    await requestKavenegar('sms/send', {
      receptor,
      message: `کد تایید کالاوران: ${code}\nاین کد را در اختیار دیگران قرار ندهید.`,
      sender: env.sms.sender,
    });
  }
  return { sent: true };
};

export const normalizeIranPhoneNumber = normalizeIranPhone;
