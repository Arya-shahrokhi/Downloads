# سیستم یکپارچه ایمیل

همه‌ی ایمیل‌های سایت از یک جا می‌روند: `backend/src/services/email/`.

```
controller  →  emailService (index.js)  →  templates.js (HTML + text)
                                       →  mailer.js (nodemailer SMTP, pool, retry)
```

کنترلرها فقط `emailService.*` را صدا می‌زنند. ارسال در پس‌زمینه است (`queueMail`)؛
خطای SMTP هرگز ثبت‌نام، ثبت سفارش یا تغییر وضعیت را نمی‌شکند، فقط لاگ می‌شود.
تنها استثنا فرم تماس است که منتظر ارسال می‌ماند تا پیام مشتری بی‌صدا گم نشود.

## ایمیل‌ها

| رویداد | گیرنده | قالب |
|---|---|---|
| ثبت‌نام / تغییر ایمیل پروفایل | کاربر | تأیید ایمیل (لینک ۲۴ ساعته) |
| فراموشی رمز | کاربر | بازیابی رمز (لینک یک‌بار مصرف، ۳۰ دقیقه) |
| تغییر / بازیابی رمز | کاربر | هشدار امنیتی «رمز شما تغییر کرد» |
| ثبت سفارش | کاربر | فاکتور سفارش (اقلام، جمع، آدرس، لینک پیگیری) |
| ثبت سفارش | ادمین (`MAIL_ADMIN_TO`) | هشدار سفارش جدید |
| تغییر وضعیت توسط ادمین (تأیید، آماده‌سازی، ارسال، تحویل، لغو) | کاربر | وضعیت سفارش |
| لغو سفارش توسط مشتری | کاربر + ادمین | وضعیت سفارش / هشدار لغو |
| فرم تماس با ما | ادمین (Reply-To = مشتری) + رسید به مشتری | پیام تماس |

## APIهای جدید

| Method | Endpoint | دسترسی | محدودیت |
|---|---|---|---|
| POST | `/api/auth/verify-email` `{ token }` | public | authLimiter |
| POST | `/api/auth/verify-email/resend` | user | ۵ در ۱۵ دقیقه |
| POST | `/api/auth/forgot-password` `{ email }` | public | ۵ در ۱۵ دقیقه |
| POST | `/api/auth/reset-password` `{ token, password }` | public | authLimiter |
| POST | `/api/contact` `{ name, email, phone?, subject, message }` | public | ۵ در ساعت |
| POST | `/api/contact/test-email` `{ to? }` | admin | ۵ در ۱۵ دقیقه |

صفحات فرانت: `/verify-email?token=…`، `/forgot-password`، `/reset-password?token=…`،
فرم در `/contact`، وضعیت تأیید + ارسال دوباره در `/account/security`.

## امنیت

- توکن‌ها ۳۲ بایت تصادفی‌اند و فقط **هش sha256** آن‌ها در DB ذخیره می‌شود (`select: false`).
- لینک بازیابی یک‌بار مصرف است و بعد از استفاده همه‌ی نشست‌ها را باطل می‌کند (`tokenVersion`).
- `forgot-password` برای ایمیل موجود و ناموجود پاسخ یکسان می‌دهد (شمارش کاربران ممکن نیست).
- همه‌ی مقادیر کاربر در قالب‌ها escape می‌شوند؛ خط جدید از موضوع حذف می‌شود (header injection).
- فرم تماس: honeypot + rate limit. رسید مشتری هیچ متن کاربری ندارد تا به ابزار اسپم تبدیل نشود.
- مسیرهای جدید در `shared/seo/urls.js` خصوصی‌اند: HTTP 200 + `noindex, nofollow`.

## راه‌اندازی

```bash
cd backend && npm install   # nodemailer اضافه شده
```

در `backend/.env` (و در Render → Environment):

| کلید | توضیح |
|---|---|
| `SMTP_HOST` | مثلاً `mail.kalavaran.ir` یا `smtp-relay.brevo.com`. خالی = بدون ارسال |
| `SMTP_PORT` | `587` (STARTTLS) یا `465` (SSL) |
| `SMTP_SECURE` | خالی = خودکار (`true` برای 465) |
| `SMTP_USER` / `SMTP_PASS` | اطلاعات ورود SMTP. برای Gmail فقط App Password |
| `MAIL_FROM` | `کالاوران <no-reply@kalavaran.ir>` |
| `MAIL_REPLY_TO` | مثلاً `info@kalavaran.ir` |
| `MAIL_ADMIN_TO` | گیرنده‌های هشدار سفارش و پیام تماس (کاماجدا). خالی = `ADMIN_EMAIL` |
| `SITE_URL` | لینک‌های داخل ایمیل از این ساخته می‌شوند؛ حتماً دامنه‌ی واقعی |

**تحویل‌پذیری (مهم):** برای دامنه‌ی `MAIL_FROM` رکوردهای **SPF**، **DKIM** و **DMARC** را در DNS
بگذارید؛ بدون این‌ها Gmail ایمیل‌ها را به اسپم می‌فرستد یا رد می‌کند.

**تست:** با حساب ادمین `POST /api/contact/test-email` را بزنید (اتصال SMTP را verify و یک ایمیل آزمایشی ارسال می‌کند).

**توسعه بدون SMTP:** اگر `SMTP_HOST` خالی باشد، متن هر ایمیل (با لینک تأیید/بازیابی) در ترمینال
بک‌اند با برچسب `[mail:preview]` چاپ می‌شود. در پرودکشن چیزی چاپ نمی‌شود.

## افزودن ایمیل جدید

1. یک تابع در `templates.js` که `{ subject, html, text }` برمی‌گرداند (از `layout()` و `esc()` استفاده کنید).
2. یک متد در `emailService` که `queueMail({ to, ...template })` را صدا بزند.
3. از کنترلر صدایش بزنید. تمام.

## نکته‌ی مهاجرت

کاربران موجود `emailVerified: false` می‌گیرند (مقدار پیش‌فرض). ورود و خرید مسدود نمی‌شود؛
فقط در صفحه‌ی امنیت حساب یک دکمه‌ی «ارسال دوباره‌ی لینک تأیید» می‌بینند.
