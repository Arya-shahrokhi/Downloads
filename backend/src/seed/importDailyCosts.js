/**
 * وارد کردن قیمت روز از CSV و بازمحاسبه‌ی قیمت‌ها.
 * ستون‌ها (سطر اول عنوان): productNumber,costPerKg[,costPerUnit,packagingCost]
 * به‌جای productNumber می‌توانید slug بگذارید.
 *
 *   npm run pricing:import -- prices.csv --dry
 *   npm run pricing:import -- prices.csv
 */
import { readFile } from 'node:fs/promises';
import { connectDB, disconnectDB } from '../config/db.js';
import { applyDailyCosts } from '../services/pricingService.js';

const file = process.argv.slice(2).find((a) => !a.startsWith('--'));
const dryRun = process.argv.includes('--dry');

// ارقام فارسی/عربی و جداکننده‌ی هزارگان را تمیز کن
const toNumber = (v) => {
  if (v === undefined || v.trim() === '') return undefined;
  const latin = v.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const n = Number(latin.replace(/[,،٬\s]/g, ''));
  return Number.isFinite(n) ? n : undefined;
};

const run = async () => {
  if (!file) throw new Error('مسیر فایل CSV را بدهید: npm run pricing:import -- prices.csv');
  const lines = (await readFile(file, 'utf8')).replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim());
  const header = lines.shift().split(',').map((h) => h.trim());
  const items = lines.map((line) => {
    const cells = line.split(',');
    const row = Object.fromEntries(header.map((h, i) => [h, cells[i]?.trim()]));
    const item = {};
    if (row.productNumber) item.productNumber = toNumber(row.productNumber);
    else if (row.slug) item.slug = row.slug;
    ['costPerKg', 'costPerUnit', 'packagingCost'].forEach((k) => {
      const n = toNumber(row[k] ?? '');
      if (n !== undefined) item[k] = n;
    });
    return item;
  }).filter((i) => i.productNumber || i.slug);

  await connectDB();
  const report = await applyDailyCosts(items, { dryRun });
  console.log(`[pricing] ${report.matched} ردیف پیدا شد، ${report.changed} قیمت ${dryRun ? 'عوض می‌شود' : 'عوض شد'}`);
  report.changes.slice(0, 50).forEach((c) => console.log(`  #${c.productNumber ?? '-'} ${c.name}: ${c.from.toLocaleString()} → ${c.to.toLocaleString()}`));
  if (report.notFound.length) console.log(`[pricing] پیدا نشد: ${report.notFound.join(', ')}`);
};

run()
  .catch((error) => { console.error('[pricing] خطا:', error.message); process.exitCode = 1; })
  .finally(disconnectDB);
