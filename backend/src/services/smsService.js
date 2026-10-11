const TWILIO_API = 'https://api.twilio.com/2010-04-01/Accounts';

/** شماره ایرانی 09xxxxxxxxx را به فرمت E.164 (+989...) تبدیل می‌کند. */
export function toE164(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('98')) return `+${digits}`;
  if (digits.startsWith('0')) return `+98${digits.slice(1)}`;
  return `+${digits}`;
}

/**
 * ارسال پیامک از طریق Twilio REST API. اگر تنظیمات ناقص باشد، بی‌صدا رد می‌شود
 * تا ثبت سفارش هرگز به خاطر پیامک خراب نشود.
 */
export async function sendSms(to, body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const target = toE164(to);
  if (!sid || !token || !from || !target) return { skipped: true };

  const res = await fetch(`${TWILIO_API}/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: target, From: from, Body: body }),
  });
  if (!res.ok) throw new Error(`Twilio SMS failed with status ${res.status}`);
  return res.json();
}

/** متن پیامک سفارش جدید برای ادمین. شماره فاکتور همان orderNumber است. */
export function buildOrderSmsBody(order) {
  const items = order.items.map((i) => `${i.name} x${i.quantity}`).join('، ');
  const addr = order.shippingAddress;
  return [
    `سفارش جدید | فاکتور ${order.orderNumber}`,
    `مبلغ: ${Number(order.total).toLocaleString('fa-IR')} تومان`,
    `اقلام: ${items}`,
    `گیرنده: ${addr.receiver} (${addr.phone})`,
    `آدرس: ${addr.province}، ${addr.city}، ${addr.line}`,
  ].join('\n');
}

/** اطلاع‌رسانی سفارش جدید به ادمین. خطا را نگه می‌دارد و هرگز throw نمی‌کند. */
export function notifyAdminNewOrder(order) {
  return sendSms(process.env.ADMIN_PHONE, buildOrderSmsBody(order)).catch((err) => {
    console.error('[sms] admin notification failed:', err.message);
  });
}
