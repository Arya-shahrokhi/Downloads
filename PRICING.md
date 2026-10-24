# قیمت‌گذاری بر اساس قیمت روز

```
قیمت فروش = (قیمت روز هر کیلو × وزن + هزینه بسته‌بندی) × (۱ + سود٪)  → گرد به بالا (پیش‌فرض ۱۰۰۰ تومان)
```

هزینه ارسال **داخل قیمت نیست** و مثل قبل موقع پرداخت حساب می‌شود (`SHIPPING_FLAT` و `FREE_SHIPPING_THRESHOLD`).
تخفیف هم مثل قبل روی همین قیمت اعمال می‌شود.

## راه‌اندازی (یک بار)

1. اعداد واقعی سود و بسته‌بندی را ثبت کنید (پیش‌فرض‌ها فقط نمونه‌اند: سود ۳۰٪، بسته‌بندی ۸ تا ۴۰ هزار تومان):
   ```http
   PUT /api/admin/pricing
   { "marginPercent": 30, "roundTo": 1000, "dryRun": true,
     "packagingTiers": [{"maxGrams":100,"cost":8000},{"maxGrams":250,"cost":12000},{"maxGrams":500,"cost":18000},{"maxGrams":1000,"cost":25000}] }
   ```
   با `dryRun: true` فقط گزارش می‌گیرید؛ بعد بدون آن بفرستید.
2. قیمت روز اولیه را از روی قیمت‌های فعلی بسازید تا چیزی یک‌دفعه عوض نشود:
   ```bash
   cd backend && npm run pricing:backfill -- --dry && npm run pricing:backfill
   ```
   محصولات «عدد»/«بسته» در خروجی لیست می‌شوند؛ برای آن‌ها `costPerUnit` بدهید.

## به‌روزرسانی روزانه

از CSV:
```csv
productNumber,costPerKg
12,850000
13,1200000
```
```bash
npm run pricing:import -- prices.csv --dry   # پیش‌نمایش
npm run pricing:import -- prices.csv         # اعمال
```

یا از API:
```http
PUT /api/admin/pricing/costs
{ "items": [{ "productNumber": 12, "costPerKg": 850000 }], "dryRun": true }
```

| فیلد محصول | معنی |
|---|---|
| `costPerKg` | قیمت روز خرید هر کیلو / لیتر |
| `costPerUnit` | برای محصولات عددی |
| `packagingCost` | بسته‌بندی خاص همین محصول (جایگزین پله‌ی سراسری) |
| `autoPrice: false` | قیمت دستی بماند؛ بازمحاسبه دستش نمی‌زند |

سایر endpointها: `GET /api/admin/pricing` (تنظیمات + تعداد محصولات بدون قیمت روز)، `POST /api/admin/pricing/recalculate`.
