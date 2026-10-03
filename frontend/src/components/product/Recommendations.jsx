import { useMemo, useState } from 'react';
import { FiAward, FiPercent, FiStar, FiTrendingUp } from 'react-icons/fi';
import ProductCard from './ProductCard.jsx';
import { ProductCardSkeleton } from '../ui/Skeleton.jsx';
import { RECOMMEND_FILTERS, applyFilter, scoreProducts } from '../../utils/recommend.js';

const NONE = [];
const REASON_ICON = { sold: FiTrendingUp, rating: FiStar, deal: FiPercent, pick: FiAward };
const REASON_TONE = {
  sold: 'bg-moss-100 text-moss-800',
  rating: 'bg-saffron-100 text-saffron-800',
  deal: 'bg-berry-100 text-berry-600',
  pick: 'bg-bone-200 text-ink-700',
};

/**
 * پیشنهاد هوشمند: محصولات ورودی را امتیازدهی می‌کند و بهترین‌ها را
 * همراه با دلیل پیشنهاد نشان می‌دهد. فیلترها روی همان داده کار می‌کنند و
 * درخواست تازه‌ای به سرور نمی‌زنند.
 */
export default function Recommendations({ sources = [], loading, exclude = NONE, limit = 4, filters = true, title, eyebrow, description }) {
  const [active, setActive] = useState('all');
  const scored = useMemo(() => scoreProducts(sources, { exclude }), [sources, exclude]);
  const visible = useMemo(() => applyFilter(scored, active).slice(0, limit), [scored, active, limit]);
  const available = useMemo(
    () => RECOMMEND_FILTERS.filter((f) => f.key === 'all' || applyFilter(scored, f.key).length > 0),
    [scored],
  );

  if (!loading && scored.length === 0) return null;

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div>
          {eyebrow && <p className="text-2xs font-bold tracking-[0.14em] text-moss-600">{eyebrow}</p>}
          {title && <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>}
          {description && <p className="mt-2 max-w-[52ch] text-sm leading-7 text-ink-500">{description}</p>}
        </div>
        {filters && available.length > 1 && (
          <div role="tablist" aria-label="نوع پیشنهاد" className="flex flex-wrap gap-1.5 rounded-full bg-bone-100 p-1">
            {available.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={active === f.key}
                onClick={() => setActive(f.key)}
                className={`min-h-9 rounded-full px-4 text-xs font-bold transition-colors duration-200 ${active === f.key ? 'bg-ink-900 text-bone-50' : 'text-ink-500 hover:text-ink-900'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-9 min-[390px]:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
        {loading
          ? Array.from({ length: limit }).map((_, i) => <ProductCardSkeleton key={i} />)
          : visible.map(({ product, reason }, i) => {
            const Icon = REASON_ICON[reason.key] || FiAward;
            return (
              <div key={product._id} className="flex flex-col gap-2.5">
                <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-extrabold ${REASON_TONE[reason.key]}`}>
                  <Icon size={12} aria-hidden="true" />
                  {i === 0 && active === 'all' ? 'بهترین پیشنهاد ما' : reason.label}
                </span>
                <ProductCard product={product} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
