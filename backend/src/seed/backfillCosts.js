/**
 * مقداردهی اولیه‌ی قیمت روز (costPerKg) از روی قیمت فعلی هر محصول.
 * بعد از اجرا، قیمت‌ها تقریباً همان می‌مانند (فقط گرد شدن)، ولی از این به بعد
 * با تغییر قیمت روز، بسته‌بندی یا سود، خودکار به‌روز می‌شوند.
 *
 *   npm run pricing:backfill -- --dry   ← فقط گزارش
 *   npm run pricing:backfill            ← ذخیره
 */
import { connectDB, disconnectDB } from '../config/db.js';
import { PricingSettings, Product } from '../models/index.js';
import { inferCostPerKg } from '../services/pricingService.js';

const dryRun = process.argv.includes('--dry');

const run = async () => {
  await connectDB();
  const settings = await PricingSettings.current();
  const products = await Product.find({ costPerKg: null, costPerUnit: null })
    .select('name price unit weight packagingCost').lean();

  const ops = [];
  const unitBased = [];
  for (const p of products) {
    const costPerKg = inferCostPerKg(p, settings);
    if (costPerKg === null) { unitBased.push(p.name); continue; }
    ops.push({ updateOne: { filter: { _id: p._id }, update: { $set: { costPerKg, costUpdatedAt: new Date() } } } });
  }

  if (!dryRun && ops.length) await Product.bulkWrite(ops, { ordered: false });
  console.log(`[pricing] ${ops.length} محصول ${dryRun ? 'قابل مقداردهی است' : 'مقداردهی شد'}`);
  if (unitBased.length) {
    console.log(`[pricing] ${unitBased.length} محصول واحد وزنی ندارند یا قیمتشان کمتر از بسته‌بندی است؛ costPerUnit را دستی بدهید:`);
    unitBased.forEach((n) => console.log(`  - ${n}`));
  }
};

run()
  .catch((error) => { console.error('[pricing] خطا:', error.message); process.exitCode = 1; })
  .finally(disconnectDB);
