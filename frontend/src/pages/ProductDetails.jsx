import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiCheck, FiChevronLeft, FiChevronRight, FiHeart, FiRefreshCw, FiShare2, FiShield, FiShoppingBag, FiTruck,
} from 'react-icons/fi';
import Rating from '../components/ui/Rating.jsx';
import Button from '../components/ui/Button.jsx';
import QuantityStepper from '../components/ui/QuantityStepper.jsx';
import Badge from '../components/ui/Badge.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { SkeletonBlock } from '../components/ui/Skeleton.jsx';
import ProductCarousel from '../components/product/ProductCarousel.jsx';
import Reviews from '../components/product/Reviews.jsx';
import SectionHeader from './home/SectionHeader.jsx';
import Seo from '../components/common/Seo.jsx';
import { productApi } from '../services/endpoints.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { finalPrice, toFa, toman } from '../utils/format.js';
import SmartImage from '../components/ui/SmartImage.jsx';
import NotFound from './NotFound.jsx';
import RecentlyViewed from '../components/product/RecentlyViewed.jsx';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed.js';
import { useToast } from '../context/ToastContext.jsx';

async function shareProduct(product, toast) {
  const url = window.location.href;
  const payload = { title: product.name, text: `${product.name} در کالاوران`, url };
  try {
    if (navigator.share) { await navigator.share(payload); return; }
    await navigator.clipboard.writeText(url);
    toast?.success('لینک محصول کپی شد');
  } catch (err) {
    if (err?.name !== 'AbortError') toast?.error('اشتراک‌گذاری انجام نشد');
  }
}

const TABS = [
  { key: 'description', label: 'توضیحات' },
  { key: 'specs', label: 'مشخصات' },
  { key: 'usage', label: 'نحوه مصرف' },
];

export default function ProductDetails() {
  const { slug } = useParams();
  const { addItem, pendingId } = useCart();
  const { has, toggle } = useWishlist();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState('description');

  const navigate = useNavigate();
  const { record } = useRecentlyViewed();
  const toast = useToast();

  const buyBoxRef = useRef(null);
  const [showBuyBar, setShowBuyBar] = useState(false);
  const touchX = useRef(null);

  const load = () => {
    setData(null); setError(null); setQty(1); setActiveImage(0);
    productApi.get(slug)
      .then(({ data: d }) => {
        if (d.redirect && d.redirect !== `/products/${slug}`) { navigate(d.redirect, { replace: true }); return; }
        setData(d);
      })
      .catch((err) => setError(err));
  };

  useEffect(load, [slug]);
  useEffect(() => { if (data?.product) record(data.product); }, [data, record]);

  useEffect(() => {
    const el = buyBoxRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => {
      setShowBuyBar(!e.isIntersecting && e.boundingClientRect.top < 0);
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [data]);

  useEffect(() => {
    document.body.classList.toggle('has-buy-bar', showBuyBar);
    return () => document.body.classList.remove('has-buy-bar');
  }, [showBuyBar]);

  if (error?.status === 404 || error?.status === 410) return <NotFound gone={error.status === 410} />;
  if (error) return <div className="wrap py-20"><ErrorState message={error.message} onRetry={load} /></div>;

  if (!data) {
    return (
      <div className="wrap grid gap-10 py-10 lg:grid-cols-2">
        <SkeletonBlock className="aspect-square rounded-3xl" />
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-8 w-3/4" />
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-24 w-full rounded-2xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const { product, related } = data;
  const price = finalPrice(product);
  const out = product.stock <= 0;
  const liked = has(product._id);
  const images = product.images?.length ? product.images : [{ url: '' }];

  const specs = [
    ['وزن', `${toFa(product.weight)} ${product.unit}`],
    ['دسته‌بندی', product.category?.name],
    product.origin && ['خاستگاه', product.origin],
    product.ingredients?.length && ['ترکیبات', product.ingredients.join('، ')],
    ['موجودی', out ? 'ناموجود' : `${toFa(product.stock)} عدد`],
  ].filter(Boolean);

  return (
    <>
      <Seo seo={data.seo} title={product.name} description={product.shortDescription || product.description.slice(0, 155)} image={images[0].url} />

      <div className="wrap pt-6">
        <nav className="flex min-w-0 items-center gap-2 overflow-hidden text-2xs text-ink-400" aria-label="مسیر">
          <Link to="/" className="hover:text-moss-700">خانه</Link>
          <FiChevronLeft size={12} />
          <Link to="/products" className="hover:text-moss-700">محصولات</Link>
          <FiChevronLeft size={12} />
          <Link to={`/category/${product.category?.slug}`} className="hover:text-moss-700">{product.category?.name}</Link>
          <FiChevronLeft size={12} />
          <span className="truncate text-ink-700">{product.name}</span>
        </nav>
      </div>

      <section className="wrap grid gap-10 py-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-12">
        <div>
          <div
            className="relative touch-pan-y overflow-hidden rounded-3xl bg-bone-100"
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current === null || images.length < 2) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) < 40) return;
              setActiveImage((i) => (dx > 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length));
            }}
          >
            <SmartImage
              src={images[activeImage].url}
              alt={images[activeImage].alt && images[activeImage].alt !== product.name ? images[activeImage].alt : `${product.name}، ${product.category?.name || ''} کالاوران`}
              width="900" height="900"
              fetchpriority="high"
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="aspect-square w-full object-cover"
            />
            {product.discount > 0 && (
              <span className="num chip absolute right-4 top-4 bg-berry-600 text-bone-50">٪{toFa(product.discount)} تخفیف</span>
            )}

            <button type="button" onClick={() => shareProduct(product, toast)} aria-label="اشتراک‌گذاری محصول" className="absolute left-4 top-4 grid size-11 place-items-center rounded-full bg-bone-50/95 text-ink-700 shadow-card transition-transform hover:text-moss-700 active:scale-90">
              <FiShare2 size={17} />
            </button>

            {images.length > 1 && (
              <>
                <div className="absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-between px-3 sm:flex">
                  <button type="button" aria-label="تصویر قبلی" onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)} className="grid size-10 place-items-center rounded-full bg-bone-50/90 text-ink-700 shadow-card hover:bg-bone-50">
                    <FiChevronRight size={18} />
                  </button>
                  <button type="button" aria-label="تصویر بعدی" onClick={() => setActiveImage((i) => (i + 1) % images.length)} className="grid size-10 place-items-center rounded-full bg-bone-50/90 text-ink-700 shadow-card hover:bg-bone-50">
                    <FiChevronLeft size={18} />
                  </button>
                </div>
                <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
                  {images.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImage ? 'w-5 bg-moss-700' : 'w-1.5 bg-bone-50/80'}`} />)}
                </div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} aria-label={`تصویر ${toFa(i + 1)}`} className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${i === activeImage ? 'border-moss-600' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <SmartImage src={img.url} alt="" loading="lazy" className="size-full object-cover" fallbackLabel="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-2xs font-bold uppercase tracking-[0.14em] text-moss-600">{product.category?.name}</p>
          <h1 className="mt-3 text-[clamp(1.55rem,4vw,2.35rem)] font-extrabold leading-tight tracking-tight">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Rating value={product.rating} count={product.reviewsCount} size={16} />
            <span className="h-4 w-px bg-bone-300" />
            {out ? <Badge tone="berry">ناموجود</Badge> : product.stock <= 10
              ? <Badge tone="saffron">تنها {toFa(product.stock)} عدد مانده</Badge>
              : <Badge tone="moss">موجود در انبار</Badge>}
          </div>

          {product.shortDescription && <p className="mt-5 max-w-[52ch] text-[0.95rem] leading-8 text-ink-500">{product.shortDescription}</p>}

          {product.benefits?.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {product.benefits.map((b) => <li key={b} className="chip bg-moss-50 text-moss-900"><FiCheck size={12} /> {b}</li>)}
            </ul>
          )}

          <div ref={buyBoxRef} className="mt-8 rounded-2xl border hairline bg-bone-100 p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2"><span className="num text-[clamp(1.6rem,6vw,1.875rem)] font-extrabold">{toman(price, { suffix: false })}</span><span className="text-sm text-ink-400">تومان</span></div>
                {product.discount > 0 && <p className="num mt-1.5 flex items-center gap-2 text-sm"><span className="text-ink-300 line-through">{toman(product.price, { suffix: false })}</span><span className="text-berry-600">{toman(product.price - price)} سود شما</span></p>}
              </div>
              <QuantityStepper value={qty} onChange={setQty} max={Math.min(50, product.stock || 1)} disabled={out} />
            </div>

            <div className="mt-5 flex gap-2.5">
              <Button size="lg" className="flex-1" icon={FiShoppingBag} disabled={out} loading={pendingId === product._id} onClick={() => addItem(product._id, qty)}>{out ? 'ناموجود' : 'افزودن به سبد خرید'}</Button>
              <button onClick={() => toggle(product._id)} aria-label="علاقه‌مندی" aria-pressed={liked} className={`grid aspect-square h-[3.25rem] place-items-center rounded-xl border transition-colors ${liked ? 'border-berry-600 bg-berry-100 text-berry-600' : 'border-bone-300 bg-bone-50 text-ink-500 hover:border-berry-600 hover:text-berry-600'}`}><FiHeart size={20} className={liked ? 'fill-berry-600' : ''} /></button>
            </div>

            <ul className="mt-5 grid gap-3 border-t hairline pt-5 text-xs text-ink-500 sm:grid-cols-3">
              <li className="flex items-center gap-2"><FiTruck size={15} className="text-moss-600" /> ارسال ۲۴ ساعته</li>
              <li className="flex items-center gap-2"><FiShield size={15} className="text-moss-600" /> تضمین اصالت</li>
              <li className="flex items-center gap-2"><FiRefreshCw size={15} className="text-moss-600" /> بازگشت ۷ روزه</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap py-6">
        <div className="flex max-w-full gap-1 overflow-x-auto border-b hairline" role="tablist">
          {TABS.map((t) => <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} className={`-mb-px shrink-0 border-b-2 px-3 py-3 text-sm font-semibold sm:px-4 transition-colors ${tab === t.key ? 'border-moss-700 text-moss-900' : 'border-transparent text-ink-400 hover:text-ink-700'}`}>{t.label}</button>)}
        </div>

        <div className="py-7" role="tabpanel">
          {tab === 'description' && <p className="max-w-[70ch] text-[0.95rem] leading-9 text-ink-500">{product.description}</p>}
          {tab === 'specs' && <dl className="max-w-2xl divide-y hairline">{specs.map(([k, v]) => <div key={k} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 py-3.5 text-sm min-[400px]:grid-cols-[8rem_minmax(0,1fr)] min-[400px]:gap-4"><dt className="text-ink-400">{k}</dt><dd className="num break-words font-medium">{v}</dd></div>)}</dl>}
          {tab === 'usage' && <p className="max-w-[70ch] text-[0.95rem] leading-9 text-ink-500">{product.usage || 'برای این محصول روش مصرف خاصی ثبت نشده است. در صورت تردید با پشتیبانی تماس بگیرید.'}</p>}
        </div>
      </section>

      <section className="border-y hairline bg-bone-100 py-14"><div className="wrap"><Reviews productId={product._id} onRatingChange={load} /></div></section>

      {related?.length > 0 && <section className="wrap py-16"><SectionHeader eyebrow="در همین قفسه" title="محصولات مرتبط" to={`/category/${product.category?.slug}`} /><ProductCarousel products={related} /></section>}

      <RecentlyViewed excludeId={product._id} className="wrap pb-16" />

      <div className={`mobile-buy-bar lg:hidden ${showBuyBar ? 'is-visible' : ''}`} aria-hidden={!showBuyBar}>
        <div className="flex min-w-0 flex-1 items-center gap-3"><SmartImage src={images[0].url} alt="" loading="lazy" className="size-11 shrink-0 rounded-lg object-cover" fallbackLabel="" /><div className="min-w-0"><p className="truncate text-xs font-semibold text-ink-900">{product.name}</p><p className="num text-sm font-extrabold text-moss-900">{toman(price)}</p></div></div>
        <Button size="md" icon={FiShoppingBag} disabled={out} tabIndex={showBuyBar ? 0 : -1} loading={pendingId === product._id} onClick={() => addItem(product._id, qty)} className="shrink-0">{out ? 'ناموجود' : 'افزودن'}</Button>
      </div>
    </>
  );
}
