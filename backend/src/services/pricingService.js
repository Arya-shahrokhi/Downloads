import { PricingSettings, Product } from '../models/index.js';

/**
 * قیمت فروش = (قیمت روز × مقدار + بسته‌بندی) × (۱ + سود٪)، گرد به بالا.
 * هزینه ارسال عمداً اینجا نیست: موقع پرداخت جدا حساب می‌شود (SHIPPING_FLAT).
 */

const UNIT_TO_GRAMS = {
  'گرم': 1, 'گ': 1, g: 1, gr: 1,
  'کیلوگرم': 1000, 'کیلو': 1000, kg: 1000,
  'میلی‌لیتر': 1, 'میلی لیتر': 1, 'میلیلیتر': 1, ml: 1,
  'لیتر': 1000, l: 1000,
  'سی‌سی': 1, 'سی سی': 1, cc: 1,
};

/** مقدار محصول به گرم (یا میلی‌لیتر). برای «عدد»/«بسته» null برمی‌گرداند. */
export function gramsOf(product) {
  const factor = UNIT_TO_GRAMS[String(product?.unit ?? '').trim().toLowerCase()]
    ?? UNIT_TO_GRAMS[String(product?.unit ?? '').trim()];
  const amount = Number(product?.weight);
  return factor && amount > 0 ? amount * factor : null;
}

export function packagingFor(grams, settings, override) {
  if (override !== null && override !== undefined && override !== '') return Number(override);
  const tiers = [...(settings.packagingTiers || [])].sort((a, b) => a.maxGrams - b.maxGrams);
  if (!tiers.length) return 0;
  const tier = tiers.find((t) => (grams ?? 0) <= t.maxGrams) || tiers[tiers.length - 1];
  return tier.cost;
}

export const roundUp = (value, step = 1000) => Math.ceil(value / step) * step;

const has = (v) => v !== null && v !== undefined && Number.isFinite(Number(v));

/** قیمت کالا (بدون بسته‌بندی) از روی قیمت روز. */
function goodsCost(product, grams) {
  if (grams && has(product.costPerKg)) return (Number(product.costPerKg) * grams) / 1000;
  if (has(product.costPerUnit)) return Number(product.costPerUnit);
  return null;
}

/** محاسبه‌ی قیمت یک محصول؛ اگر قیمت روز نداشته باشد null. */
export function computePrice(product, settings) {
  const grams = gramsOf(product);
  const goods = goodsCost(product, grams);
  if (goods === null) return null;
  const packaging = packagingFor(grams, settings, product.packagingCost);
  const margin = Number(settings.marginPercent) || 0;
  const raw = (goods + packaging) * (1 + margin / 100);
  return {
    price: roundUp(raw, settings.roundTo || 1000),
    breakdown: { grams, goods: Math.round(goods), packaging, marginPercent: margin },
  };
}

/** عکس فرمول: از قیمت فعلی، قیمت روز هر کیلو را تخمین می‌زند (برای مقداردهی اولیه). */
export function inferCostPerKg(product, settings) {
  const grams = gramsOf(product);
  if (!grams) return null;
  const margin = Number(settings.marginPercent) || 0;
  const packaging = packagingFor(grams, settings, product.packagingCost);
  const goods = Number(product.price) / (1 + margin / 100) - packaging;
  if (!(goods > 0)) return null;
  return Math.round((goods * 1000) / grams);
}

/**
 * بازمحاسبه‌ی قیمت محصولات. با dryRun فقط گزارش تغییرات برمی‌گردد.
 * محصولاتی که autoPrice=false دارند یا قیمت روز ندارند دست نمی‌خورند.
 */
export async function recalculatePrices({ filter = {}, dryRun = false, settings } = {}) {
  const cfg = settings || (await PricingSettings.current());
  const products = await Product.find({ ...filter, autoPrice: { $ne: false } })
    .select('name productNumber price discount unit weight costPerKg costPerUnit packagingCost')
    .lean();

  const changes = [];
  const ops = [];
  let skipped = 0;

  for (const p of products) {
    const result = computePrice(p, cfg);
    if (!result) { skipped += 1; continue; }
    if (result.price === p.price) continue;
    changes.push({ id: p._id, productNumber: p.productNumber, name: p.name, from: p.price, to: result.price, ...result.breakdown });
    // bulkWrite از pre('save') رد می‌شود، پس oldPrice را همین‌جا هم‌گام می‌کنیم
    const set = { price: result.price, oldPrice: p.discount > 0 ? result.price : null };
    ops.push({ updateOne: { filter: { _id: p._id }, update: { $set: set } } });
  }

  if (!dryRun && ops.length) await Product.bulkWrite(ops, { ordered: false });

  return { dryRun, scanned: products.length, changed: changes.length, skipped, changes };
}

/**
 * ثبت قیمت روز. هر آیتم با productNumber یا slug یا id پیدا می‌شود.
 * items: [{ productNumber|slug|id, costPerKg?, costPerUnit?, packagingCost?, autoPrice? }]
 */
export async function applyDailyCosts(items, { dryRun = false } = {}) {
  const now = new Date();
  const notFound = [];
  const ids = [];
  const ops = [];

  for (const item of items) {
    const query = item.id ? { _id: item.id }
      : item.slug ? { slug: String(item.slug).toLowerCase() }
        : { productNumber: Number(item.productNumber) };
    const doc = await Product.findOne(query).select('_id').lean();
    if (!doc) { notFound.push(item.productNumber ?? item.slug ?? item.id); continue; }
    const set = { costUpdatedAt: now };
    ['costPerKg', 'costPerUnit', 'packagingCost'].forEach((k) => {
      if (item[k] !== undefined) set[k] = item[k] === null ? null : Number(item[k]);
    });
    if (typeof item.autoPrice === 'boolean') set.autoPrice = item.autoPrice;
    ids.push(doc._id);
    ops.push({ updateOne: { filter: { _id: doc._id }, update: { $set: set } } });
  }

  if (dryRun) {
    // پیش‌نمایش بدون نوشتن: قیمت‌ها را با هزینه‌های جدید در حافظه حساب کن
    const cfg = await PricingSettings.current();
    const byId = new Map(ops.map((o) => [String(o.updateOne.filter._id), o.updateOne.update.$set]));
    const products = await Product.find({ _id: { $in: ids }, autoPrice: { $ne: false } })
      .select('name productNumber price unit weight costPerKg costPerUnit packagingCost').lean();
    const changes = products.map((p) => {
      const result = computePrice({ ...p, ...byId.get(String(p._id)) }, cfg);
      return result && result.price !== p.price
        ? { id: p._id, productNumber: p.productNumber, name: p.name, from: p.price, to: result.price, ...result.breakdown }
        : null;
    }).filter(Boolean);
    return { dryRun: true, matched: ids.length, notFound, changed: changes.length, changes };
  }

  if (ops.length) await Product.bulkWrite(ops, { ordered: false });
  const report = await recalculatePrices({ filter: { _id: { $in: ids } } });
  return { ...report, matched: ids.length, notFound };
}
