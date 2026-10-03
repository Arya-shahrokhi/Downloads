import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { FiChevronDown, FiPlus, FiX } from 'react-icons/fi';
import ProductGrid from '../components/product/ProductGrid.jsx';
import FilterSidebar from '../components/product/FilterSidebar.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Seo, { siteUrl } from '../components/common/Seo.jsx';
import NotFound from './NotFound.jsx';
import { buildCategorySeo, buildStaticSeo, fullTitle } from '@shared/seo/index.js';
import { productApi } from '../services/endpoints.js';

const SORTS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'cheapest', label: 'ارزان‌ترین' },
  { value: 'expensive', label: 'گران‌ترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'discount', label: 'بیشترین تخفیف' },
  { value: 'rating', label: 'بهترین امتیاز' },
];

const PER_PAGE = 12; // must match PER_PAGE in backend/src/seo/pageResolver.js

const FILTER_KEYS = ['search', 'category', 'minPrice', 'maxPrice', 'minRating', 'inStock', 'discounted', 'popular', 'featured', 'sort', 'page'];

export default function Products() {
  const { slug } = useParams();
  const { pathname, search: rawSearch } = useLocation();
  const { categories = [] } = useOutletContext() || {};
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const filters = useMemo(() => {
    const obj = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || '']));
    if (slug) obj.category = slug;
    return obj;
  }, [params, slug]);

  const [state, setState] = useState({ products: [], meta: null, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    const query = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== null));
    productApi.list({ ...query, limit: PER_PAGE })
      .then(({ data }) => alive && setState({ products: data.products, meta: data.meta, loading: false, error: null }))
      .catch((err) => alive && setState({ products: [], meta: null, loading: false, error: err.message }));
    return () => { alive = false; };
  }, [filters]);

  const apply = useCallback((next) => {
    const clean = Object.entries(next).reduce((acc, [k, v]) => {
      if (k !== 'category' && v !== '' && v !== null && v !== undefined) acc[k] = String(v);
      return acc;
    }, {});
    const nextCategory = next.category ? String(next.category) : '';

    if (slug) {
      if (nextCategory !== slug) {
        delete clean.page;
        const qs = new URLSearchParams(clean).toString();
        const base = nextCategory ? `/category/${encodeURIComponent(nextCategory)}` : '/products';
        navigate(qs ? `${base}?${qs}` : base);
        return;
      }
      setParams(clean, { replace: false });
      return;
    }

    if (nextCategory) clean.category = nextCategory;
    setParams(clean, { replace: false });
  }, [setParams, navigate, slug]);

  const reset = () => setParams(filters.search ? { search: filters.search } : {});

  const activeCategory = categories.find((c) => c.slug === filters.category);
  const activeCount = ['minPrice', 'maxPrice', 'minRating', 'inStock', 'discounted', 'popular']
    .filter((k) => filters[k]).length + (filters.category && !slug ? 1 : 0);

  const title = activeCategory?.name || (filters.search ? `جست‌وجوی «${filters.search}»` : 'فروشگاه کالاوران');
  const page = Math.max(1, Number.parseInt(filters.page || '1', 10) || 1);

  const seo = useMemo(() => {
    const base = siteUrl();
    if (slug && activeCategory) {
      const built = buildCategorySeo(activeCategory, { siteUrl: base, search: rawSearch, products: state.products, perPage: PER_PAGE });
      if (!state.loading && !state.error && (state.meta?.total ?? 0) === 0) built.robots = 'noindex, follow';
      return built;
    }
    const built = buildStaticSeo(pathname, { siteUrl: base, search: rawSearch });
    if (built && filters.search) built.title = fullTitle(title);
    return built;
  }, [slug, activeCategory, rawSearch, pathname, state.products, state.loading, state.error, state.meta, filters.search, title]);

  const content = seo?.content;
  const intro = page === 1 ? (content?.intro || []) : [];
  const faqs = page === 1 ? (content?.faqs || []) : [];

  const pageHref = useCallback((p) => {
    const next = new URLSearchParams(params);
    if (p > 1) next.set('page', String(p)); else next.delete('page');
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [params, pathname]);

  if (slug && categories.length > 0 && !activeCategory && !state.loading && (state.meta?.total ?? 0) === 0) {
    return <NotFound />;
  }

  return (
    <>
      {seo
        ? <Seo seo={seo} />
        : <Seo title={title} description={activeCategory?.description || 'محصول مورد نظرت را با فیلترهای دقیق پیدا کن و جزئیات کاملش را ببین.'} />}

      <div className="border-b hairline bg-bone-100">
        <div className="wrap py-9 sm:py-12">
          <nav className="mb-3 flex items-center gap-2 text-2xs text-ink-400" aria-label="مسیر">
            <Link to="/" className="hover:text-moss-700">خانه</Link>
            <span>/</span>
            {slug ? (
              <>
                <Link to="/products" className="hover:text-moss-700">محصولات</Link>
                <span>/</span>
              </>
            ) : null}
            <span className="text-ink-700">{title}</span>
          </nav>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
          {intro.length > 0 ? (
            <div className="mt-3 max-w-[70ch] space-y-3 text-sm leading-8 text-ink-500">
              {intro.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          ) : (
            activeCategory?.description && <p className="mt-2 max-w-[56ch] text-sm leading-7 text-ink-500">{activeCategory.description}</p>
          )}
        </div>
      </div>

      <div className="wrap flex gap-10 py-9">
        <FilterSidebar filters={filters} categories={categories} onChange={apply} onReset={reset} activeCount={activeCount} />

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
            <div className="relative">
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => apply({ ...filters, sort: e.target.value, page: 1 })}
                aria-label="مرتب‌سازی"
                className="h-10 appearance-none rounded-xl border border-bone-300 bg-bone-50 pl-9 pr-3.5 text-sm font-medium focus:border-moss-500 focus:outline-none"
              >
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <FiChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={15} />
            </div>
          </div>

          {activeCount > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {['minPrice', 'maxPrice', 'minRating', 'inStock', 'discounted', 'popular'].filter((k) => filters[k]).map((k) => (
                <button
                  key={k}
                  onClick={() => apply({ ...filters, [k]: '', page: 1 })}
                  className="chip bg-moss-50 text-moss-900 hover:bg-moss-100"
                >
                  {{ minPrice: 'حداقل قیمت', maxPrice: 'حداکثر قیمت', minRating: 'امتیاز', inStock: 'موجود', discounted: 'تخفیف‌دار', popular: 'پرفروش' }[k]}
                  <FiX size={12} />
                </button>
              ))}
              <button onClick={reset} className="text-xs text-ink-400 underline hover:text-berry-600">پاک کردن همه</button>
            </div>
          )}

          {state.error ? (
            <ErrorState message={state.error} onRetry={() => apply(filters)} />
          ) : (
            <>
              <ProductGrid
                products={state.products}
                loading={state.loading}
                skeletonCount={12}
                emptyAction={activeCount ? { action: 'حذف فیلترها', onAction: reset } : { action: 'مشاهده فروشگاه کالاوران', to: '/products' }}
              />
              <Pagination
                page={state.meta?.page || 1}
                pages={state.meta?.pages || 1}
                hrefFor={pageHref}
                onChange={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
              />
            </>
          )}
        </div>
      </div>

      {faqs.length > 0 && (
        <section className="wrap pb-6" aria-labelledby="category-faq-title">
          <div className="rounded-3xl border hairline bg-bone-50 p-5 sm:p-8">
            <h2 id="category-faq-title" className="text-lg font-extrabold tracking-tight sm:text-xl">
              پرسش‌های رایج درباره {activeCategory?.name}
            </h2>
            <div className="mt-5 divide-y divide-bone-200">
              {faqs.map((f) => (
                <details key={f.question} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-bold leading-7 text-ink-800 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-bold">{f.question}</h3>
                    <FiPlus size={16} className="mt-1.5 shrink-0 text-moss-600 transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 max-w-[75ch] text-sm leading-8 text-ink-500">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
