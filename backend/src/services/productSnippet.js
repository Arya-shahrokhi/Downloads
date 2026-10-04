/**
 * ساخت خودکار «قطعه کد» محصول برای محصولاتی که ادمین از پنل اضافه می‌کند.
 *
 * هر بار که ادمین محصولی می‌سازد (یا محصولی را که قبلاً از پنل ساخته ویرایش/حذف می‌کند):
 *   ۱. نام، مشخصات و مسیر عکس محصول به فرمت seed (مثل premiumRiceProducts.js) درمی‌آید؛
 *   ۲. در backend/src/seed/adminProducts.json ذخیره و فایل adminProducts.js از رویش بازسازی می‌شود؛
 *   ۳. عکس آپلودشده‌ی محلی (/uploads/products/...) به frontend/public/images/products/admin/
 *      با نام تمیز <slug>.<ext> کپی می‌شود تا مسیرش داخل ریپو ثابت بماند (uploads در git نیست).
 *
 * با `npm run seed:admin-products` این محصولات روی هر دیتابیسی دوباره ثبت می‌شوند.
 * روشن/خاموش: PRODUCT_SNIPPETS=true|false (پیش‌فرض: فقط بیرون از production روشن است،
 * چون دیسک سرورهای ابری مثل Render ماندگار نیست).
 */
import { copyFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Category } from '../models/index.js';
import { uploadsRoot } from '../config/cloudinary.js';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const repoRoot = path.resolve(backendRoot, '..');
const SEED_DIR = path.join(backendRoot, 'src', 'seed');
const STORE_FILE = path.join(SEED_DIR, 'adminProducts.json');
const CODE_FILE = path.join(SEED_DIR, 'adminProducts.js');
const PUBLIC_URL_DIR = '/images/products/admin/';
const PUBLIC_ABS_DIR = path.join(repoRoot, 'frontend', 'public', 'images', 'products', 'admin');

/** ترتیب کلیدها دقیقاً مثل فایل‌های seed فعلی. */
const FIELDS = [
  'productNumber', 'name', 'slug', 'category', 'price', 'discount', 'stock', 'weight', 'unit', 'origin',
  'shortDescription', 'description', 'ingredients', 'usage', 'benefits', 'images',
  'isFeatured', 'isPopular', 'isActive', 'seoTitle', 'seoDescription',
];

export const snippetsEnabled = () => {
  const flag = String(process.env.PRODUCT_SNIPPETS ?? '').trim().toLowerCase();
  if (!flag) return process.env.NODE_ENV !== 'production';
  return flag === 'true' || flag === '1';
};

const categoryName = async (category) => {
  if (!category) return null;
  if (typeof category === 'object' && category.name) return category.name;
  const doc = await Category.findById(category._id || category).select('name').lean();
  return doc?.name || null;
};

/** عکس محلی را با نام <slug>.<ext> به public کپی می‌کند و مسیر جدید را برمی‌گرداند. */
const persistImage = async (image, slug, index, { copyImages, alt }) => {
  const url = image?.url || '';
  if (!url) return null;
  const out = { url, alt: image.alt || alt };
  if (!url.startsWith('/uploads/products/')) return out; // Cloudinary یا عکس ثابت پروژه: همان آدرس

  const source = path.join(uploadsRoot, 'products', path.basename(decodeURI(url)));
  const ext = path.extname(source).toLowerCase() || '.jpg';
  const fileName = `${slug}${index ? `-${index + 1}` : ''}${ext}`;
  const target = PUBLIC_URL_DIR + fileName;
  if (!copyImages) return { ...out, url: target };
  try {
    await mkdir(PUBLIC_ABS_DIR, { recursive: true });
    await copyFile(source, path.join(PUBLIC_ABS_DIR, fileName));
    return { ...out, url: target };
  } catch (err) {
    console.warn(`[snippet] کپی عکس ${url} انجام نشد: ${err.message}`);
    return out;
  }
};

/** محصول (سند mongoose یا آبجکت ساده) ← آبجکت هم‌فرمت فایل‌های seed. */
export const toSeedEntry = async (product, { copyImages = true } = {}) => {
  const p = typeof product.toObject === 'function' ? product.toObject() : { ...product };
  const images = (await Promise.all((p.images || []).map((img, i) => persistImage(img, p.slug, i, { copyImages, alt: p.name }))))
    .filter(Boolean);
  const source = { ...p, category: await categoryName(p.category), images };

  const entry = {};
  for (const key of FIELDS) {
    const value = source[key];
    if (value === undefined || value === null || value === '') continue;
    entry[key] = value;
  }
  return entry;
};

/** آبجکت ← کد JS خوانا (کلیدهای بی‌کوتیشن، رشته‌ها تک‌کوتیشن). */
export const renderEntry = (entry, indent = 0) => {
  const pad = ' '.repeat(indent);
  const json = JSON.stringify(entry, null, 2)
    .replace(/^(\s*)"([A-Za-z_$][\w$]*)":/gm, '$1$2:')
    .replace(/"((?:[^"\\]|\\.)*)"/g, (_m, s) => `'${s.replace(/\\"/g, '"').replace(/'/g, "\\'")}'`);
  return json.split('\n').map((line) => pad + line).join('\n');
};

const renderFile = (list) => [
  '/**',
  ' * ⚠️ این فایل خودکار ساخته می‌شود (services/productSnippet.js). دستی ویرایش نکنید؛',
  ' * منبع اصلی adminProducts.json است. ثبت در دیتابیس: npm run seed:admin-products',
  ' */',
  `export const adminProducts = [${list.length ? '\n' : ''}${list.map((e) => `${renderEntry(e, 2)},`).join('\n')}${list.length ? '\n' : ''}];`,
  '',
].join('\n');

const readStore = async () => {
  try {
    const list = JSON.parse(await readFile(STORE_FILE, 'utf8'));
    return Array.isArray(list) ? list : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
};

const writeAtomic = async (file, data) => {
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, data, 'utf8');
  await rename(tmp, file);
};

const writeStore = async (list) => {
  list.sort((a, b) => ((a.productNumber ?? Infinity) - (b.productNumber ?? Infinity)) || String(a.name).localeCompare(String(b.name), 'fa'));
  await writeAtomic(STORE_FILE, `${JSON.stringify(list, null, 2)}\n`);
  await writeAtomic(CODE_FILE, renderFile(list));
};

// درخواست‌های هم‌زمان پشت سر هم روی فایل نوشته شوند، نه روی هم.
let queue = Promise.resolve();
const serial = (fn) => {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
};

/**
 * ثبت/به‌روزرسانی قطعه کد محصول.
 * createIfMissing=false یعنی فقط محصولاتی که قبلاً از پنل ساخته شده‌اند به‌روز شوند
 * (ویرایش محصولات کاتالوگ اصلی data.js به این فایل اضافه نمی‌شود).
 */
export const syncProductSnippet = (product, { previousSlug, createIfMissing = true } = {}) => serial(async () => {
  if (!snippetsEnabled()) return null;
  const list = await readStore();
  const keys = new Set([product.slug, previousSlug].filter(Boolean));
  const tracked = list.some((e) => keys.has(e.slug));
  if (!tracked && !createIfMissing) return null;

  const entry = await toSeedEntry(product);
  await writeStore([...list.filter((e) => !keys.has(e.slug)), entry]);
  return entry;
});

export const removeProductSnippet = (slug) => serial(async () => {
  if (!snippetsEnabled() || !slug) return;
  const list = await readStore();
  const next = list.filter((e) => e.slug !== slug);
  if (next.length !== list.length) await writeStore(next);
});

/** خطای ساخت قطعه کد هیچ‌وقت نباید ذخیره‌ی محصول را خراب کند. */
export const safely = (promise) => promise.catch((err) => {
  console.warn('[snippet] ساخت قطعه کد محصول انجام نشد:', err.message);
  return null;
});
