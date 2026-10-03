/**
 * عکس‌های پوشه‌ی images/products/fixed را روی دیتابیس فعلی اعمال می‌کند،
 * بدون پاک کردن سفارش‌ها، کاربران یا بقیه‌ی داده‌ها (برخلاف seed).
 *
 * اجرا:  npm run images:fixed   (داخل پوشه‌ی backend)
 */
import '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { Product } from '../models/index.js';
import { fixedImageUrl } from './fixedImages.js';

const run = async () => {
  await connectDB();
  const products = await Product.find({}, { name: 1 }).lean();
  let updated = 0;
  const missing = [];

  for (const p of products) {
    const url = fixedImageUrl(p.name);
    if (!url) {
      missing.push(p.name);
      continue;
    }
    await Product.updateOne({ _id: p._id }, { $set: { images: [{ url, alt: p.name }] } });
    updated++;
  }

  console.log(`[images:fixed] ${updated} محصول به عکس جدید وصل شد`);
  if (missing.length) console.log(`[images:fixed] بدون عکس در fixed/ (${missing.length}): ${missing.join('، ')}`);
};

run()
  .catch((err) => {
    console.error('[images:fixed] خطا:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
