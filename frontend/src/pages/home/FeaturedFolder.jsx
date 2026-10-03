import { Link } from 'react-router-dom';
import { FiArrowLeft, FiStar } from 'react-icons/fi';
import SmartImage from '../../components/ui/SmartImage.jsx';
import Rating from '../../components/ui/Rating.jsx';
import { SkeletonBlock } from '../../components/ui/Skeleton.jsx';
import { finalPrice, toFa, toman } from '../../utils/format.js';

/**
 * «پوشه ویژه»: محصولات isFeatured داخل یک پوشه رنگی و پررنگ.
 * محصول اول مثل برگه‌ای که از پوشه بیرون زده، بزرگ نمایش داده می‌شود؛
 * چهار محصول بعدی فهرست شماره‌دار کنار آن هستند.
 */
function Price({ product }) {
  const price = finalPrice(product);
  return (
    <span className="num flex flex-wrap items-baseline gap-x-2">
      <span className="font-black text-ink-900">{toman(price)}</span>
      {product.discount > 0 && <s className="text-xs text-ink-500">{toman(product.price, { suffix: false })}</s>}
    </span>
  );
}

export default function FeaturedFolder({ products = [], loading }) {
  const inStock = products.filter((p) => p.stock > 0);
  const [lead, ...rest] = inStock.length ? inStock : products;
  const list = rest.slice(0, 4);

  if (!loading && !lead) return null;

  return (
    <section className="wrap pb-6 pt-14 sm:pt-20" aria-labelledby="featured-folder-title" data-reveal>
      <div className="featured-folder relative">
        <span className="featured-folder__paper" aria-hidden="true" />
        <div className="featured-folder__tab">
          <FiStar size={15} className="fill-ink-900" aria-hidden="true" />
          پوشه ویژه کالاوران
          {!loading && <span className="num rounded-full bg-ink-900 px-2 py-0.5 text-2xs text-saffron-200">{toFa(Math.min(inStock.length || products.length, 5))} قلم</span>}
        </div>

        <div className="featured-folder__body">
          <div className="featured-folder__lines" aria-hidden="true" />
          <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.08fr_1fr] lg:gap-12 lg:p-12">
            {/* ستون راست: عنوان + برگه محصول اول */}
            <div>
              <p className="text-2xs font-extrabold tracking-[.18em] text-saffron-800">دست‌چین این هفته</p>
              <h2 id="featured-folder-title" className="mt-3 text-3xl font-black leading-tight tracking-tight text-ink-900 sm:text-[2.6rem]">
                محصولات ویژه
              </h2>
              <p className="mt-3 max-w-[44ch] text-sm leading-7 text-ink-700">
                کیفیتشان را خودمان چشیدیم و بو کردیم. این‌ها چیزهایی‌اند که اگر فقط یک خرید بکنی، پیشنهادشان می‌کنیم.
              </p>

              {loading ? (
                <SkeletonBlock className="mt-7 h-[22rem] rounded-[1.6rem] opacity-60" />
              ) : (
                <Link to={`/products/${lead.slug}`} className="featured-folder__sheet group mt-7 grid gap-5 p-3 sm:grid-cols-[13rem_1fr] sm:p-4">
                  <div className="relative overflow-hidden rounded-[1.1rem] bg-bone-100">
                    <SmartImage
                      src={lead.images?.[0]?.url}
                      alt={lead.name}
                      loading="lazy"
                      width="500"
                      height="600"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105 sm:aspect-auto sm:h-full"
                      fallbackLabel=""
                    />
                    {lead.discount > 0 && <span className="num chip absolute right-2.5 top-2.5 bg-berry-600 text-bone-50">٪{toFa(lead.discount)} تخفیف</span>}
                  </div>
                  <div className="flex flex-col py-1 sm:py-3 sm:pl-3">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-saffron-100 px-2.5 py-1 text-2xs font-extrabold text-saffron-800">
                      <FiStar size={12} className="fill-saffron-700" aria-hidden="true" /> انتخاب اول
                    </span>
                    <span className="mt-3 text-xs font-medium text-moss-700">{lead.category?.name}</span>
                    <h3 className="mt-1 text-xl font-black leading-8 text-ink-900">{lead.name}</h3>
                    {lead.shortDescription && <p className="mt-2 line-clamp-3 text-sm leading-7 text-ink-500">{lead.shortDescription}</p>}
                    <div className="mt-3"><Rating value={lead.rating} count={lead.reviewsCount} /></div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                      <Price product={lead} />
                      <span className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-bold text-bone-50 transition-colors duration-200 group-hover:bg-moss-800">
                        مشاهده و خرید <FiArrowLeft size={16} className="transition-transform duration-300 ease-expo group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* ستون چپ: فهرست شماره‌دار */}
            <div className="flex flex-col">
              <ol className="flex flex-col gap-2.5 lg:mt-[7.4rem]">
                {(loading ? Array.from({ length: 4 }) : list).map((p, i) => (
                  <li key={p?._id || i}>
                    {p ? (
                      <Link to={`/products/${p.slug}`} className="featured-folder__row group flex items-center gap-4 p-2.5 pl-4">
                        <span className="num w-8 shrink-0 text-center text-2xl font-black text-saffron-700">{toFa(i + 2)}</span>
                        <SmartImage src={p.images?.[0]?.url} alt="" loading="lazy" width="120" height="120" className="size-16 shrink-0 rounded-xl object-cover sm:size-[4.5rem]" fallbackLabel="" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.95rem] font-extrabold text-ink-900">{p.name}</span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
                            <Price product={p} />
                            {p.rating > 0 && <span className="num inline-flex items-center gap-1"><FiStar size={12} className="fill-saffron-600 text-saffron-600" />{toFa(Number(p.rating).toFixed(1))}</span>}
                          </span>
                        </span>
                        <FiArrowLeft size={18} className="shrink-0 text-ink-700 transition-transform duration-300 ease-expo group-hover:-translate-x-1" aria-hidden="true" />
                      </Link>
                    ) : <SkeletonBlock className="h-[5.5rem] rounded-2xl opacity-60" />}
                  </li>
                ))}
              </ol>

              <Link
                to="/products?featured=true"
                className="mt-6 inline-flex w-fit items-center gap-2 self-end rounded-full border-2 border-ink-900 px-5 py-2.5 text-sm font-extrabold text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-saffron-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
              >
                باز کردن کل پوشه <FiArrowLeft size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
