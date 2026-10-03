import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiChevronLeft } from 'react-icons/fi';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Seo from '../components/common/Seo.jsx';
import { productApi } from '../services/endpoints.js';
import { toFa } from '../utils/format.js';

export default function PremiumProducts() {
  const [state, setState] = useState({ products: [], meta: null, loading: true, error: null });
  useEffect(() => {
    let alive = true;
    productApi.list({ premium: 'true', sort: 'popular', limit: 12 })
      .then(({ data }) => alive && setState({ products: data.products, meta: data.meta, loading: false, error: null }))
      .catch((err) => alive && setState((s) => ({ ...s, loading: false, error: err.message })));
    return () => { alive = false; };
  }, []);

  return (
    <>
      <Seo title="برنج و ادویه‌های ویژه" description="برنج ایرانی و ادویه‌های ارگانیک و پرمصرف، انتخاب‌شده برای آشپزی روزمره." />
      <header className="featured-editorial__intro">
        <div className="wrap">
          <Link to="/" className="featured-editorial__back"><FiChevronLeft size={15} /> خانه</Link>
          <div className="featured-editorial__intro-grid">
            <div>
              <p>قفسه منتخب کالاوران</p>
              <h1>محصولات ویژه، بدون شلوغ‌کاری</h1>
            </div>
            <p>برنج و ادویه‌هایی که از نظر عطر، تازگی و کاربرد روزمره انتخاب شده‌اند. هر محصول مشخصات خودش را دارد، نه یک توضیح تکراری.</p>
          </div>
        </div>
      </header>

      <main>
        {state.loading && <ProductGrid products={[]} loading skeletonCount={4} />}
        {state.error && <p className="wrap my-10 rounded-2xl bg-berry-100 p-5 text-sm text-berry-600">{state.error}</p>}
        {!state.loading && !state.error && state.products.length > 0 && (
          <div className="wrap py-10 sm:py-14"><ProductGrid products={state.products.slice(0, 4)} loading={false} /></div>
        )}
        {!state.loading && !state.error && state.products.length === 0 && (
          <div className="wrap py-16">
            <ProductGrid products={[]} loading={false} emptyAction={{ action: 'بازگشت به محصولات', to: '/products' }} />
          </div>
        )}

        {!state.loading && !state.error && state.products.length > 4 && (
          <section className="wrap py-14 sm:py-20" data-below-fold>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-2xs font-bold tracking-[.14em] text-moss-600">ادامه قفسه منتخب</p>
                <h2 className="mt-2 text-2xl font-extrabold">انتخاب‌های بیشتر</h2>
              </div>
              <p className="num text-sm text-ink-400">{toFa(state.meta?.total || state.products.length)} محصول</p>
            </div>
            <ProductGrid products={state.products.slice(4)} loading={false} />
          </section>
        )}

        <div className="wrap pb-14">
          <Link to="/products" className="group inline-flex min-h-11 items-center gap-2 text-sm font-bold text-moss-700 hover:text-moss-900">
            مشاهده همه محصولات <FiArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </main>
    </>
  );
}
