import { useMemo } from 'react';
import ProductCarousel from './ProductCarousel.jsx';
import SectionHeader from '../../pages/home/SectionHeader.jsx';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed.js';

/** نوار «اخیراً دیده‌اید». اگر چیزی برای نمایش نباشد، اصلاً رندر نمی‌شود. */
export default function RecentlyViewed({ excludeId, className = 'wrap py-14', min = 2 }) {
  const { items, clear } = useRecentlyViewed();
  const list = useMemo(() => items.filter((p) => p._id !== excludeId), [items, excludeId]);

  if (list.length < min) return null;

  return (
    <section className={className} aria-label="محصولاتی که اخیراً دیده‌اید">
      <SectionHeader eyebrow="ادامه‌ی گشت‌وگذار" title="اخیراً دیده‌اید" description="از همان‌جایی که بودی ادامه بده." />
      <ProductCarousel products={list} />
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={clear} className="min-h-11 rounded-xl px-4 text-xs font-medium text-ink-400 underline-offset-4 transition-colors hover:text-berry-600 hover:underline">
          پاک کردن تاریخچه‌ی بازدید
        </button>
      </div>
    </section>
  );
}
