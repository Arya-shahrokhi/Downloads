import { Link } from 'react-router-dom';
import { FiArrowLeft, FiStar } from 'react-icons/fi';
import SmartImage from '../../components/ui/SmartImage.jsx';
import { toFa } from '../../utils/format.js';

const fallback = [
  { name: 'برنج‌های اصیل ایرانی', image: '/images/products/catalog/25-berenj-hashemi-organic.webp' },
  { name: 'ادویه‌های منتخب', image: '/images/products/catalog/10-zaferan-sargol.webp' },
  { name: 'روغن و عرقیات طبیعی', image: '/images/products/catalog/17-roghan-siah-daneh.webp' },
];

export default function PremiumOpening({ products = [], loading }) {
  const panels = fallback.map((item, i) => ({ ...item, product: products[i] }));

  return (
    <section className="premium-opening" aria-labelledby="premium-opening-title">
      <div className="premium-opening__texture absolute inset-0" aria-hidden="true" />
      <div className="wrap relative py-5 sm:py-7">
        <div className="premium-opening__top flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-saffron-500 text-ink-900"><FiStar size={16} /></span>
            <div>
              <p className="text-2xs font-bold tracking-[.18em] text-saffron-700">ویترین ویژه کالاوران</p>
              <h2 id="premium-opening-title" className="mt-0.5 text-lg font-black text-ink-900 sm:text-xl">منتخب‌هایی برای سفره خاص</h2>
            </div>
          </div>
          <Link to="/premium-products" className="group inline-flex items-center gap-2 text-sm font-extrabold text-moss-800 hover:text-moss-950">
            دیدن همه محصولات ویژه <FiArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1.25fr_.9fr_.9fr]">
          {panels.map(({ name, image, product }, index) => (
            <Link
              key={name}
              to={product?.slug ? `/products/${product.slug}` : '/premium-products'}
              className={`premium-opening__panel group relative min-h-[12rem] overflow-hidden rounded-2xl ${index === 0 ? 'md:min-h-[16rem]' : ''}`}
            >
              <SmartImage src={product?.images?.[0]?.url || image} alt={product?.name || name} loading={index === 0 ? 'eager' : 'lazy'} fetchpriority={index === 0 ? 'high' : 'auto'} width="800" height="500" className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105" fallbackLabel="" />
              <span className="premium-opening__veil absolute inset-0" />
              <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-bone-50">
                <span>
                  <span className="block text-2xs font-bold tracking-[.14em] text-saffron-200">{toFa(`۰${index + 1}`)} / ویترین</span>
                  <span className="mt-1 block text-lg font-black">{product?.name || name}</span>
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-bone-50/15 backdrop-blur-sm transition-transform group-hover:-translate-x-1"><FiArrowLeft size={16} /></span>
              </span>
            </Link>
          ))}
        </div>
        {loading && <span className="sr-only">ویترین ویژه در حال بارگذاری است</span>}
      </div>
    </section>
  );
}
