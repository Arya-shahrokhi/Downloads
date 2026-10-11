import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

/**
 * لایه‌ی انتقال ایمیل.
 *
 *  - یک transporter با pool: اتصال SMTP بین ایمیل‌ها باز می‌ماند و هر
 *    ایمیل handshake جدید TLS نمی‌خواهد.
 *  - خطای موقت (شبکه، 4xx) تا ۳ بار با تأخیر افزایشی تکرار می‌شود؛
 *    خطای دائمی (5xx مثل آدرس نامعتبر) بلافاصله رها می‌شود.
 *  - بدون SMTP_HOST چیزی ارسال نمی‌شود. در توسعه متن ایمیل در ترمینال
 *    چاپ می‌شود تا لینک تأیید/بازیابی را بشود مستقیم باز کرد.
 */

let transporter = null;

const getTransporter = () => {
  if (!env.mail.enabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.secure,
      auth: env.mail.user ? { user: env.mail.user, pass: env.mail.pass } : undefined,
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
};

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
const recipients = (to) => [].concat(to).filter(Boolean);

/** ارسال واقعی؛ در صورت شکست نهایی خطا پرتاب می‌کند. */
export async function sendMail({ to, subject, html, text, replyTo }) {
  const list = recipients(to);
  if (!list.length) return { skipped: true };

  const t = getTransporter();
  if (!t) {
    if (!env.isProd && !env.isTest) {
      console.info(`\n[mail:preview] به: ${list.join(', ')}\n  موضوع: ${subject}\n${(text || '').replace(/^/gm, '  ')}\n`);
    }
    return { preview: true };
  }

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await t.sendMail({
        from: env.mail.from,
        to: list,
        subject,
        html,
        text,
        replyTo: replyTo || env.mail.replyTo || undefined,
      });
    } catch (err) {
      lastError = err;
      const permanent = Number(err.responseCode) >= 500;
      if (permanent || attempt === 3) break;
      await sleep(attempt * 1500);
    }
  }
  throw lastError;
}

/**
 * ارسال در پس‌زمینه: پاسخ API منتظر SMTP نمی‌ماند و خطای ایمیل هرگز
 * ثبت سفارش یا ثبت‌نام را نمی‌شکند. فقط لاگ می‌شود.
 */
export function queueMail(message) {
  setImmediate(() => {
    sendMail(message).catch((err) => {
      console.error(`[mail] ارسال «${message.subject}» به ${recipients(message.to).join(', ')} ناموفق بود: ${err.message}`);
    });
  });
}

/** بررسی اتصال و احراز هویت SMTP (برای endpoint تست ادمین). */
export async function verifyMailer() {
  const t = getTransporter();
  if (!t) return { ok: false, reason: 'SMTP_HOST تنظیم نشده است' };
  try {
    await t.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}
