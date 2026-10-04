# ساخت خودکار قطعه کد محصولات پنل ادمین

وقتی ادمین از پنل محصولی اضافه می‌کند، قطعه کد seed آن (نام، مشخصات و مسیر عکس) خودکار ساخته می‌شود؛
دقیقاً هم‌فرمت `premiumRiceProducts.js`.

## چه اتفاقی می‌افتد

| عملیات در پنل | نتیجه |
|---|---|
| افزودن محصول | یک ورودی در `backend/src/seed/adminProducts.js` (و `adminProducts.json`) ساخته می‌شود |
| ویرایش محصولی که از پنل ساخته شده | همان ورودی به‌روز می‌شود (تغییر slug هم پشتیبانی می‌شود) |
| حذف محصول | ورودی‌اش حذف می‌شود |
| ویرایش محصولات کاتالوگ اصلی (`data.js`) | تغییری در این فایل‌ها ایجاد نمی‌شود |

عکس آپلودشده‌ی محلی (`/uploads/products/...`) با نام تمیز `<slug>.<ext>` در
`frontend/public/images/products/admin/` کپی می‌شود و مسیر داخل قطعه کد همین مسیر است،
پس بعد از commit همه‌چیز داخل ریپو ماندگار است (`backend/uploads` در git نیست).
آدرس‌های Cloudinary و عکس‌های ثابت پروژه همان‌طور که هستند می‌مانند.

## نمونه خروجی

```js
{
  productNumber: 189,
  name: 'گل گاوزبان ممتاز',
  slug: 'gol-gavzaban-momtaz',
  category: 'دمنوش‌ها',
  price: 250000,
  stock: 20,
  weight: 100,
  unit: 'گرم',
  description: '...',
  images: [{ url: '/images/products/admin/gol-gavzaban-momtaz.webp', alt: 'گل گاوزبان ممتاز' }],
  isFeatured: false,
},
```

## API

`GET /api/products/:id/snippet` (فقط ادمین): قطعه کد هر محصول را برای کپی برمی‌گرداند
(`{ entry, code }`)، بدون نوشتن روی دیسک.

## ثبت دوباره در دیتابیس

```bash
cd backend
npm run seed                  # کاتالوگ اصلی
npm run seed:admin-products   # محصولات پنل ادمین (upsert بر اساس slug)
```

## تنظیمات

`PRODUCT_SNIPPETS=true|false` در `.env`. پیش‌فرض: بیرون از production روشن، در production خاموش
(دیسک سرورهای ابری مثل Render ماندگار نیست؛ محصولات را روی سیستم لوکال اضافه و commit کنید).
فایل‌های تولیدشده در `nodemonConfig.ignore` هستند تا سرور dev با هر ذخیره ری‌استارت نشود.
