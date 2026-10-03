# انتشار آنلاین کالاوران

## مسیر پیشنهادی: Docker + Render

1. این پروژه را در GitHub قرار دهید.
2. در Render یک **Blueprint** از فایل `render.yaml` بسازید.
3. این متغیرها را در داشبورد Render مقداردهی کنید:
   - `MONGO_URI`: اتصال MongoDB Atlas
   - `CLIENT_ORIGIN`: دامنه نهایی سایت، مثل `https://shop.example.com`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_PHONE`
   - سه مقدار Cloudinary برای آپلود ماندگار تصاویر مدیریت
4. بعد از اولین Deploy، سرویس با `/api/health` بررسی می‌شود.
5. برای ساخت ادمین/محصولات نمونه، یک‌بار دستور seed را جداگانه اجرا کنید:
   `npm run seed --workspace backend`

## نکات مهم

- عکس‌های محصول داخل پروژه و محلی‌اند و با Build روی سایت آنلاین سرو می‌شوند؛ CDN خارجی لازم نیست.
- برای عکس‌هایی که از پنل مدیریت بعداً آپلود می‌شوند، Cloudinary را فعال کنید. دیسک سرویس‌های ابری بدون آن ماندگار نیست.
- مقدار `CLIENT_ORIGIN` باید دقیقاً دامنه فرانت باشد و اسلش پایانی نداشته باشد.
- هرگز فایل‌های `.env` یا رمز ادمین را commit نکنید.

## اجرای محلی کانتینر

```bash
docker build -t kalavaran .
docker run --env-file backend/.env -p 5000:5000 kalavaran
```

سپس `http://localhost:5000` و `http://localhost:5000/api/health` را باز کنید.
