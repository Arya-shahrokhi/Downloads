import { env } from '../../config/env.js';

/**
 * قالب‌های ایمیل: HTML جدولی و inline-style (تنها چیزی که Gmail/Outlook
 * درست رندر می‌کنند)، راست‌به‌چپ، به‌همراه نسخه‌ی متنی برای کلاینت‌های
 * بدون HTML و کاهش امتیاز اسپم.
 *
 * هر مقداری که از کاربر یا DB می‌آید با esc() وارد HTML می‌شود.
 */

const BRAND = 'کالاوران';
const GREEN = '#3f5d3a';

export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const fa = (n) => Number(n || 0).toLocaleString('fa-IR');
const toman = (n) => `${fa(n)} تومان`;

export const siteLink = (path = '/') => `${env.seo.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

export const STATUS_LABEL = {
  PENDING: 'در انتظار تأیید',
  CONFIRMED: 'تأیید شد',
  PROCESSING: 'در حال آماده‌سازی',
  SHIPPED: 'ارسال شد',
  DELIVERED: 'تحویل داده شد',
  CANCELLED: 'لغو شد',
};

const STATUS_NOTE = {
  CONFIRMED: 'سفارش شما تأیید شد و به‌زودی آماده‌سازی آن شروع می‌شود.',
  PROCESSING: 'سفارش شما در انبار در حال بسته‌بندی است.',
  SHIPPED: 'سفارش شما تحویل پست شد و در راه است.',
  DELIVERED: 'سفارش شما تحویل داده شد. امیدواریم از خریدتان راضی باشید.',
  CANCELLED: 'سفارش شما لغو شد. اگر مبلغی پرداخت کرده‌اید، طبق قوانین سایت بازگردانده می‌شود.',
};

const PAYMENT_LABEL = { COD: 'پرداخت در محل', GATEWAY: 'پرداخت اینترنتی' };

const button = (href, label) => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:26px auto">
  <tr><td style="border-radius:10px;background:${GREEN}">
    <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:13px 30px;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none">${esc(label)}</a>
  </td></tr>
</table>`;

const p = (html) => `<p style="margin:0 0 14px">${html}</p>`;
const muted = (html) => `<p style="margin:14px 0 0;color:#8a8a8a;font-size:12px;line-height:1.9">${html}</p>`;

const layout = ({ title, preheader = '', body }) => `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;direction:rtl;font-family:Vazirmatn,Tahoma,'Segoe UI',Arial,sans-serif">
<span style="display:none!important;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f1ea;padding:28px 12px">
  <tr><td align="center">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" dir="rtl" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;text-align:right">
      <tr><td style="background:${GREEN};padding:20px 28px;color:#ffffff;font-size:21px;font-weight:800">${BRAND}</td></tr>
      <tr><td style="padding:30px 28px 26px;color:#2b2b2b;font-size:14px;line-height:2.1">
        <h1 style="margin:0 0 18px;font-size:18px;font-weight:800;color:#1f1f1f">${esc(title)}</h1>
        ${body}
      </td></tr>
      <tr><td style="padding:18px 28px;background:#faf8f3;color:#8a8a8a;font-size:12px;line-height:2">
        این ایمیل به‌صورت خودکار از <a href="${esc(siteLink('/'))}" style="color:${GREEN}">${BRAND}</a> ارسال شده است.
        سؤالی دارید؟ <a href="${esc(siteLink('/contact'))}" style="color:${GREEN}">تماس با ما</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

const textFooter = `\n\n--\n${BRAND}\n${siteLink('/')}`;

const itemsTable = (order) => {
  const row = (label, value, strong = false) => `
  <tr>
    <td style="padding:7px 0;${strong ? 'font-weight:800;' : ''}">${label}</td>
    <td style="padding:7px 0;text-align:left;white-space:nowrap;${strong ? 'font-weight:800;' : ''}">${value}</td>
  </tr>`;
  const items = order.items.map((i) => `
  <tr>
    <td style="padding:9px 0;border-bottom:1px solid #eeeae0">${esc(i.name)} <span style="color:#8a8a8a">× ${fa(i.quantity)}</span></td>
    <td style="padding:9px 0;border-bottom:1px solid #eeeae0;text-align:left;white-space:nowrap">${toman(i.lineTotal)}</td>
  </tr>`).join('');
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;margin:18px 0;font-size:13px">
  ${items}
  ${row('جمع کالاها', toman(order.subtotal))}
  ${order.discount ? row('تخفیف', `− ${toman(order.discount)}`) : ''}
  ${row('هزینه ارسال', order.shippingCost ? toman(order.shippingCost) : 'رایگان')}
  ${row('مبلغ کل', toman(order.total), true)}
</table>`;
};

const itemsText = (order) => [
  ...order.items.map((i) => `- ${i.name} × ${fa(i.quantity)}: ${toman(i.lineTotal)}`),
  `مبلغ کل: ${toman(order.total)}`,
].join('\n');

const addressHtml = (a = {}) => esc([a.province, a.city, a.line].filter(Boolean).join('، '))
  + (a.postalCode ? `<br>کد پستی: ${esc(a.postalCode)}` : '')
  + (a.receiver ? `<br>گیرنده: ${esc(a.receiver)} (${esc(a.phone)})` : '');

// ---------------------------------------------------------------------------
// حساب کاربری
// ---------------------------------------------------------------------------

export const verifyEmail = ({ name, url, hours = 24 }) => {
  const title = 'تأیید آدرس ایمیل';
  return {
    subject: `${title} | ${BRAND}`,
    html: layout({
      title,
      preheader: 'برای فعال شدن اعلان‌های سفارش، ایمیل خود را تأیید کنید.',
      body: p(`${esc(name)} عزیز، به ${BRAND} خوش آمدید.`)
        + p('برای تأیید آدرس ایمیل و دریافت اعلان‌های سفارش، روی دکمه زیر بزنید:')
        + button(url, 'تأیید ایمیل')
        + muted(`این لینک تا ${fa(hours)} ساعت معتبر است. اگر شما در ${BRAND} ثبت‌نام نکرده‌اید، این ایمیل را نادیده بگیرید.`),
    }),
    text: `${name} عزیز، به ${BRAND} خوش آمدید.\nبرای تأیید ایمیل این لینک را باز کنید (تا ${hours} ساعت معتبر است):\n${url}${textFooter}`,
  };
};

export const passwordReset = ({ name, url, minutes = 30 }) => {
  const title = 'بازیابی رمز عبور';
  return {
    subject: `${title} | ${BRAND}`,
    html: layout({
      title,
      preheader: 'لینک تعیین رمز عبور جدید',
      body: p(`${esc(name)} عزیز،`)
        + p('درخواست تعیین رمز عبور جدید برای حساب شما ثبت شد. برای ادامه روی دکمه زیر بزنید:')
        + button(url, 'تعیین رمز جدید')
        + muted(`این لینک فقط یک بار و تا ${fa(minutes)} دقیقه معتبر است. اگر شما این درخواست را نداده‌اید، کاری لازم نیست؛ رمز فعلی شما تغییری نمی‌کند.`),
    }),
    text: `${name} عزیز،\nبرای تعیین رمز عبور جدید این لینک را باز کنید (یک‌بار مصرف، ${minutes} دقیقه):\n${url}\nاگر شما درخواست نداده‌اید، این ایمیل را نادیده بگیرید.${textFooter}`,
  };
};

export const passwordChanged = ({ name }) => {
  const title = 'رمز عبور شما تغییر کرد';
  const url = siteLink('/forgot-password');
  return {
    subject: `${title} | ${BRAND}`,
    html: layout({
      title,
      preheader: 'اگر این کار شما نبوده، همین حالا اقدام کنید.',
      body: p(`${esc(name)} عزیز، رمز عبور حساب شما در ${BRAND} همین حالا تغییر کرد و نشست‌های دیگر بسته شدند.`)
        + p('اگر این کار شما نبوده، فوراً رمز را بازیابی کنید:')
        + button(url, 'بازیابی رمز عبور'),
    }),
    text: `${name} عزیز، رمز عبور حساب شما تغییر کرد.\nاگر این کار شما نبوده، فوراً از این لینک رمز را بازیابی کنید:\n${url}${textFooter}`,
  };
};

// ---------------------------------------------------------------------------
// سفارش
// ---------------------------------------------------------------------------

export const orderConfirmation = ({ order, name }) => {
  const title = 'سفارش شما ثبت شد';
  const url = siteLink(`/account/orders/${order._id}`);
  return {
    subject: `سفارش ${order.orderNumber} ثبت شد | ${BRAND}`,
    html: layout({
      title,
      preheader: `شماره سفارش: ${order.orderNumber}، مبلغ: ${toman(order.total)}`,
      body: p(`${esc(name)} عزیز، از خرید شما ممنونیم. سفارش شما با شماره <b dir="ltr">${esc(order.orderNumber)}</b> ثبت شد.`)
        + itemsTable(order)
        + p(`<b>روش پرداخت:</b> ${esc(PAYMENT_LABEL[order.paymentMethod] || order.paymentMethod)}`)
        + p(`<b>آدرس ارسال:</b><br>${addressHtml(order.shippingAddress)}`)
        + button(url, 'پیگیری سفارش'),
    }),
    text: `${name} عزیز، سفارش ${order.orderNumber} ثبت شد.\n\n${itemsText(order)}\n\nپیگیری سفارش: ${url}${textFooter}`,
  };
};

export const orderStatus = ({ order, name }) => {
  const label = STATUS_LABEL[order.orderStatus] || order.orderStatus;
  const title = `سفارش ${order.orderNumber}: ${label}`;
  const url = siteLink(`/account/orders/${order._id}`);
  const note = STATUS_NOTE[order.orderStatus] || `وضعیت سفارش شما به «${label}» تغییر کرد.`;
  return {
    subject: `${title} | ${BRAND}`,
    html: layout({
      title,
      preheader: note,
      body: p(`${esc(name)} عزیز،`)
        + p(esc(note))
        + p(`<b>وضعیت فعلی:</b> ${esc(label)}`)
        + button(url, 'مشاهده سفارش'),
    }),
    text: `${name} عزیز،\n${note}\nوضعیت فعلی: ${label}\n\nمشاهده سفارش: ${url}${textFooter}`,
  };
};

export const adminNewOrder = ({ order, customer }) => {
  const title = `سفارش جدید: ${order.orderNumber}`;
  const url = siteLink(`/admin/orders/${order._id}`);
  return {
    subject: `🛒 ${title} (${toman(order.total)})`,
    html: layout({
      title,
      preheader: `${customer?.name || ''} | ${toman(order.total)}`,
      body: p(`<b>مشتری:</b> ${esc(customer?.name)} | ${esc(customer?.phone)} | <span dir="ltr">${esc(customer?.email)}</span>`)
        + p(`<b>روش پرداخت:</b> ${esc(PAYMENT_LABEL[order.paymentMethod] || order.paymentMethod)}`)
        + itemsTable(order)
        + p(`<b>آدرس:</b><br>${addressHtml(order.shippingAddress)}`)
        + button(url, 'باز کردن در پنل مدیریت'),
    }),
    text: `سفارش جدید ${order.orderNumber}\nمشتری: ${customer?.name} | ${customer?.phone}\n\n${itemsText(order)}\n\n${url}`,
  };
};

export const adminOrderCancelled = ({ order, customer }) => {
  const title = `سفارش ${order.orderNumber} توسط مشتری لغو شد`;
  const url = siteLink(`/admin/orders/${order._id}`);
  return {
    subject: title,
    html: layout({
      title,
      body: p(`<b>مشتری:</b> ${esc(customer?.name)} | ${esc(customer?.phone)}`)
        + p(`<b>مبلغ:</b> ${toman(order.total)}`)
        + muted('موجودی اقلام به انبار برگردانده شد.')
        + button(url, 'مشاهده سفارش'),
    }),
    text: `${title}\nمشتری: ${customer?.name} | ${customer?.phone}\nمبلغ: ${toman(order.total)}\n${url}`,
  };
};

// ---------------------------------------------------------------------------
// تماس با ما
// ---------------------------------------------------------------------------

export const contactToAdmin = ({ name, email, phone, subject, message }) => {
  const title = `پیام تماس: ${subject}`;
  return {
    subject: `✉️ ${title}`,
    html: layout({
      title,
      body: p(`<b>از:</b> ${esc(name)} | <span dir="ltr">${esc(email)}</span>${phone ? ` | ${esc(phone)}` : ''}`)
        + `<div style="margin:16px 0;padding:16px;background:#faf8f3;border-radius:10px;white-space:pre-wrap">${esc(message)}</div>`
        + muted('برای پاسخ، همین ایمیل را Reply کنید؛ پاسخ مستقیم به فرستنده می‌رسد.'),
    }),
    text: `از: ${name} <${email}>${phone ? ` | ${phone}` : ''}\nموضوع: ${subject}\n\n${message}`,
  };
};

export const contactAck = () => {
  const title = 'پیام شما رسید';
  return {
    subject: `${title} | ${BRAND}`,
    html: layout({
      title,
      body: p('سلام، پیام شما به دست ما رسید و در اولین فرصت (معمولاً کمتر از یک روز کاری) پاسخ می‌دهیم.')
        + muted('ساعت پاسخگویی: شنبه تا پنجشنبه، ۹ تا ۱۸.'),
    }),
    text: `سلام، پیام شما به دست ما رسید و در اولین فرصت پاسخ می‌دهیم.${textFooter}`,
  };
};

export const testEmail = () => {
  const title = 'ایمیل آزمایشی';
  return {
    subject: `${title} | ${BRAND}`,
    html: layout({ title, body: p('اگر این ایمیل را می‌بینید، تنظیمات SMTP سایت درست کار می‌کند. ✅') }),
    text: 'اگر این ایمیل را می‌بینید، تنظیمات SMTP سایت درست کار می‌کند.',
  };
};
