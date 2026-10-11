const MELIPAYAMAK_URL = 'https://rest.payamak-panel.com/api/SendSMS/SendSMS';

/** شماره را به فرمت محلی 09xxxxxxxxx تبدیل می‌کند (ملی‌پیامک همین فرمت را می‌خواهد). */
export function normalizeIranPhone(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('0098')) digits = digits.slice(4);
  else if (digits.startsWith('98') && digits.length > 10) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('9')) digits = `0${digits}`;
  return digits || null;
}

/**
 * ارسال پیامک از طریق ملی‌پیامک. اگر تنظیمات ناقص باشد، بی‌صدا رد می‌شود
 * تا ثبت سفارش هرگز به خاطر پیامک خراب نشود.
 */
export async function sendSms(to, text) {
  const username = process.env.MELIPAYAMAK_USERNAME;
  const password = process.env.MELIPAYAMAK_PASSWORD;
  const from = process.env.MELIPAYAMAK_FROM;
  const target = normalizeIranPhone(to);
  if (!username || !password || !from || !target) return { skipped: true };

  const res = await fetch(MELIPAYAMAK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, to: target, from, text, isflash: false }),
  });
  if (!res.ok) throw new Error(`Melipayamak SMS failed with status ${res.status}`);
  const data = await res.json();
  if (data.RetStatus !== 1) throw new Error(`Melipayamak error: ${data.StrRetStatus || data.RetStatus}`);
  return data;
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
