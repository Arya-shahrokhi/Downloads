/**
 * موتور پیشنهاد سبک و بدون سرور.
 * از داده‌هایی که همین حالا در لیست محصولات برمی‌گردد (امتیاز، تعداد نظر،
 * فروش، تخفیف، ویژه بودن، موجودی) یک امتیاز ترکیبی می‌سازد و برای هر محصول
 * یک «دلیل پیشنهاد» خوانا انتخاب می‌کند.
 */
import { toFa } from './format.js';

const uniqueById = (lists) => {
  const seen = new Map();
  lists.flat().filter(Boolean).forEach((p) => { if (p?._id && !seen.has(p._id)) seen.set(p._id, p); });
  return [...seen.values()];
};

export function scoreProducts(lists, { exclude = [] } = {}) {
  const skip = new Set(exclude.map(String));
  const pool = uniqueById(lists).filter((p) => p.stock > 0 && !skip.has(String(p._id)));
  if (!pool.length) return [];

  const maxSold = Math.max(1, ...pool.map((p) => p.soldCount || 0));
  const maxDiscount = Math.max(1, ...pool.map((p) => p.discount || 0));

  return pool
    .map((p) => {
      const rating = (p.rating || 0) / 5;
      // وزن امتیاز با تعداد نظر تعدیل می‌شود تا یک نظر ۵ ستاره همه را جا نزند
      const trust = Math.min(1, (p.reviewsCount || 0) / 12);
      const sold = Math.log1p(p.soldCount || 0) / Math.log1p(maxSold);
      const deal = (p.discount || 0) / maxDiscount;
      const parts = {
        rating: rating * (0.55 + 0.45 * trust) * 0.38,
        sold: sold * 0.32,
        deal: deal * 0.14,
        pick: (p.isFeatured ? 1 : 0) * 0.1 + (p.isPopular ? 1 : 0) * 0.06,
      };
      const score = parts.rating + parts.sold + parts.deal + parts.pick;
      return { product: p, score, parts, reason: reasonFor(p, parts) };
    })
    .sort((a, b) => b.score - a.score);
}

function reasonFor(p, parts) {
  const rate = `امتیاز ${toFa(Number(p.rating || 0).toFixed(1))} از ۵`;
  const qualifies = {
    sold: p.soldCount > 0 && { key: 'sold', label: 'پرفروش کالاوران' },
    deal: p.discount >= 10 && { key: 'deal', label: `٪${toFa(p.discount)} تخفیف` },
    rating: p.rating >= 4 && { key: 'rating', label: rate },
    pick: p.isFeatured && { key: 'pick', label: 'انتخاب عطار' },
  };
  // قوی‌ترین عاملی که واقعاً قابل گفتن است
  const ordered = Object.entries(parts).sort((a, b) => b[1] - a[1]);
  for (const [key] of ordered) if (qualifies[key]) return qualifies[key];
  return { key: 'pick', label: 'پیشنهاد کالاوران' };
}

export const RECOMMEND_FILTERS = [
  { key: 'all', label: 'بهترین‌ها' },
  { key: 'sold', label: 'پرفروش' },
  { key: 'rating', label: 'محبوب مشتری‌ها' },
  { key: 'deal', label: 'به‌صرفه' },
];

export function applyFilter(scored, key) {
  if (key === 'sold') return [...scored].sort((a, b) => (b.product.soldCount || 0) - (a.product.soldCount || 0));
  if (key === 'rating') return scored.filter((s) => s.product.rating >= 4).sort((a, b) => b.product.rating - a.product.rating || (b.product.reviewsCount || 0) - (a.product.reviewsCount || 0));
  if (key === 'deal') return scored.filter((s) => s.product.discount > 0).sort((a, b) => b.product.discount - a.product.discount);
  return scored;
}
