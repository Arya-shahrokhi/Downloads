# محصولات ویژه برنج

این برنچ پنج محصول جدید برنج ایرانی را با توضیحات فروشگاهی، عنوان و توضیحات SEO اضافه می‌کند:

- طارم هاشمی معطر ممتاز
- دم‌سیاه آستانه اشرفیه ممتاز
- طارم کشت دوم ممتاز
- طارم هاشمی کهنه یک‌ساله
- پک هدیه برنج‌های خاص شمال

## اجرا

بعد از قرار دادن عکس‌ها در مسیر `frontend/public/images/products/premium/`، از ریشه پروژه اجرا کنید:

```bash
node backend/src/seed/seedPremiumRice.js
```

این اسکریپت فقط همین پنج محصول را با slug به‌روزرسانی می‌کند و دیتابیس را پاک نمی‌کند.

## نام فایل عکس‌ها

- `184-tarom-hashemi-aromatic.webp`
- `185-domsiah-astaneh.webp`
- `186-tarom-second-crop.webp`
- `187-aged-tarom-hashemi.webp`
- `188-northern-rice-gift-set.webp`
