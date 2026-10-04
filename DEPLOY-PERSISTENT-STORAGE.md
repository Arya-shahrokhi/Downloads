# فعال‌سازی ذخیره‌سازی محصولات پنل برای Production

اگه روی Render یا سرویس ابری دیگری دپلویی می‌کنی و می‌خوای محصولات پنل ادمین ماندگار بمونند:

## Render

۱. **disk persistent اضافه کن**

`render.yaml` یا پنل Render:

```yaml
services:
  - type: web
    name: attari-backend
    # ...
    disk:
      - name: products
        path: /var/persistent/products
        sizeGB: 2
```

۲. **environment variables**

```bash
PRODUCT_SNIPPETS=true
PRODUCTS_PERSISTENT_DIR=/var/persistent/products
```

۳. **backend/.env** (اختیاری)

```bash
# این را تنها برای local testing استفاده کن
# PRODUCTS_PERSISTENT_DIR=/var/persistent/products
```

## چه اتفاقی می‌افتد

- `adminProducts.json` → `/var/persistent/products/backend/src/seed/adminProducts.json`
- عکس‌های آپلودی → `/var/persistent/products/frontend/public/images/products/admin/<slug>.webp`
- `adminProducts.js` هم روی persistent disk ساخته می‌شه

هر دپلویی بعدی فایل‌ها رو باز می‌کنه و همان داده‌ها رو استفاده می‌کنه.

## بدون persistent disk (Hobby plan یا لوکال)

```bash
PRODUCT_SNIPPETS=false  # خاموش کن
```

محصولات پنل رو لوکال ذخیره کن و commit کن:

```bash
cd backend
npm run dev
# ادمین محصولات رو اضافه کنه
# جاپا داخل repo مانده (adminProducts.js, images/products/admin/)
git add backend/src/seed/adminProducts.* frontend/public/images/products/admin/
git commit -m "chore: admin products"
git push

# بعد از deploy
# npm run seed:admin-products
```

## Git

اگه persistent disk داری: `.gitignore` میشه تا فایل‌های موقتی commit نشن.
اگه بدون persistent disk: `frontend/public/images/products/admin/` رو commit کن.
`backend/uploads` همیشه `.gitignore` ماندگار است.
