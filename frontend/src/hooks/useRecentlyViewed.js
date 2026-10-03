import { useCallback, useEffect, useState } from 'react';

/**
 * «اخیراً دیده‌اید»: آخرین محصولاتی که کاربر باز کرده، در localStorage.
 * فقط فیلدهایی که ProductCard لازم دارد ذخیره می‌شود تا حافظه سبک بماند.
 * بین تب‌ها و کامپوننت‌ها با رویداد storage / رویداد سفارشی همگام می‌شود.
 */
const KEY = 'kalavaran_recently_viewed';
const EVENT = 'kalavaran:recently-viewed';
const MAX = 12;

const read = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch { return []; }
};

const snapshot = (p) => ({
  _id: p._id,
  slug: p.slug,
  name: p.name,
  price: p.price,
  discount: p.discount,
  stock: p.stock,
  rating: p.rating,
  reviewsCount: p.reviewsCount,
  isFeatured: p.isFeatured,
  productNumber: p.productNumber,
  images: p.images?.length ? [p.images[0]] : [],
  category: p.category ? { name: p.category.name, slug: p.category.slug } : undefined,
  viewedAt: Date.now(),
});

export function useRecentlyViewed() {
  const [items, setItems] = useState(read);

  useEffect(() => {
    const sync = () => setItems(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const record = useCallback((product) => {
    if (!product?._id) return;
    const next = [snapshot(product), ...read().filter((p) => p._id !== product._id)].slice(0, MAX);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* حالت خصوصی */ }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const clear = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { items, record, clear };
}
