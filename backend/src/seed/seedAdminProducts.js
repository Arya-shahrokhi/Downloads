/**
 * محصولاتی که ادمین از پنل اضافه کرده (adminProducts.js) را روی دیتابیس فعلی ثبت/به‌روز می‌کند،
 * بدون پاک کردن بقیه‌ی داده‌ها. بعد از `npm run seed` اجرا کنید تا محصولات پنل برگردند.
 *
 * اجرا:  npm run seed:admin-products   (داخل پوشه‌ی backend)
 */
import '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { Category, Product } from '../models/index.js';
import { adminProducts } from './adminProducts.js';

const run = async () => {
  await connectDB();
  if (!adminProducts.length) {
    console.log('[admin-products] محصولی برای ثبت نیست');
    return;
  }

  const names = [...new Set(adminProducts.map((p) => p.category).filter(Boolean))];
  const categories = await Category.find({ name: { $in: names } }).select('_id name').lean();
  const catMap = new Map(categories.map((c) => [c.name, c._id]));

  let done = 0;
  const failed = [];
  for (const item of adminProducts) {
    const category = catMap.get(item.category);
    if (!category) {
      failed.push(`${item.name} (دسته «${item.category}» پیدا نشد)`);
      continue;
    }
    try {
      await Product.findOneAndUpdate(
        { slug: item.slug },
        // findOneAndUpdate هوک pre('save') را اجرا نمی‌کند؛ oldPrice را همین‌جا هم‌گام می‌کنیم
        { ...item, category, oldPrice: item.discount > 0 ? item.price : null },
        { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
      );
      done++;
    } catch (err) {
      failed.push(`${item.name} (${err.message})`);
    }
  }

  console.log(`[admin-products] ${done} محصول ساخته یا به‌روزرسانی شد`);
  if (failed.length) console.log(`[admin-products] ناموفق (${failed.length}): ${failed.join('، ')}`);
};

run()
  .catch((err) => {
    console.error('[admin-products] خطا:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
