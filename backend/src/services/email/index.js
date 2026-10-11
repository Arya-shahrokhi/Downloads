import crypto from 'node:crypto';
import { env } from '../../config/env.js';
import { queueMail, sendMail, verifyMailer } from './mailer.js';
import * as t from './templates.js';

/**
 * نقطه‌ی ورود سیستم ایمیل برای بقیه‌ی بک‌اند.
 * کنترلرها فقط این توابع را صدا می‌زنند و از SMTP یا قالب خبر ندارند.
 */

export const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // ۲۴ ساعت
export const RESET_TTL_MS = 30 * 60 * 1000; // ۳۰ دقیقه

/** فقط هش توکن در DB ذخیره می‌شود؛ نشت DB لینک معتبر لو نمی‌دهد. */
export const hashToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');

export const createToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return { token, hash: hashToken(token) };
};

const cleanHeader = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim();

export const emailService = {
  verification(user, token) {
    const url = t.siteLink(`/verify-email?token=${token}`);
    queueMail({ to: user.email, ...t.verifyEmail({ name: user.name, url, hours: VERIFY_TTL_MS / 3_600_000 }) });
  },

  passwordReset(user, token) {
    const url = t.siteLink(`/reset-password?token=${token}`);
    queueMail({ to: user.email, ...t.passwordReset({ name: user.name, url, minutes: RESET_TTL_MS / 60_000 }) });
  },

  passwordChanged(user) {
    queueMail({ to: user.email, ...t.passwordChanged({ name: user.name }) });
  },

  orderPlaced(order, customer) {
    if (customer?.email) queueMail({ to: customer.email, ...t.orderConfirmation({ order, name: customer.name }) });
    if (env.mail.adminTo.length) queueMail({ to: env.mail.adminTo, ...t.adminNewOrder({ order, customer }) });
  },

  orderStatusChanged(order, customer) {
    if (!customer?.email || order.orderStatus === 'PENDING') return;
    queueMail({ to: customer.email, ...t.orderStatus({ order, name: customer.name }) });
  },

  orderCancelledByCustomer(order, customer) {
    if (env.mail.adminTo.length) queueMail({ to: env.mail.adminTo, ...t.adminOrderCancelled({ order, customer }) });
  },

  /**
   * پیام تماس با ما: ارسال به ادمین منتظر می‌ماند (await) تا اگر نرسید
   * کاربر خطا ببیند و پیامش گم نشود. رسید به فرستنده در پس‌زمینه می‌رود.
   */
  async contact(payload) {
    const data = { ...payload, subject: cleanHeader(payload.subject), name: cleanHeader(payload.name) };
    await sendMail({ to: env.mail.adminTo, replyTo: data.email, ...t.contactToAdmin(data) });
    queueMail({ to: data.email, ...t.contactAck() });
  },

  async test(to) {
    const check = await verifyMailer();
    if (!check.ok) return check;
    await sendMail({ to, ...t.testEmail() });
    return { ok: true };
  },
};

export default emailService;
