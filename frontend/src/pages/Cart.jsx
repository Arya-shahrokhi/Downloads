import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import { RowsSkeleton } from '../components/ui/Skeleton.jsx';
import Seo from '../components/common/Seo.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useMemo, useState } from 'react';
import Recommendations from '../components/product/Recommendations.jsx';
import { productApi } from '../services/endpoints.js';
import { toFa } from '../utils/format.js';

export default function Cart() {
  const { cart, loading, clear } = useCart();
  const { isAuthenticated } = useAuth();
  const [confirm, setConfirm] = useState(false);
  const [suggest, setSuggest] = useState({ sources: [], loading: true });

  useEffect(() => {
    let alive = true;
    Promise.all([
      productApi.list({ popular: 'true', sort: 'popular', limit: 12 }),
      productApi.list({ sort: 'rating', inStock: 'true', limit: 12 }),
    ])
      .then(([p, r]) => alive && setSuggest({ sources: [p.data.products, r.data.products], loading: false }))
      .catch(() => alive && setSuggest({ sources: [], loading: false }));
    return () => { alive = false; };
  }, []);

  // کالاهای داخل سبد دوباره پیشنهاد نمی‌شوند
  const inCart = useMemo(() => cart.items.map((i) => i.product?._id || i.product).filter(Boolean), [cart.items]);

  return (
    <>
      <Seo title="سبد خرید" description="بازبینی سبد خرید و ادامه فرآیند پرداخت." />

      <div className="wrap py-9 sm:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">سبد خرید</h1>

        {loading ? (
          <div className="mt-8 max-w-2xl"><RowsSkeleton rows={3} /></div>
        ) : cart.items.length === 0 ? (
          <div className="mt-6 rounded-3xl border hairline bg-bone-100">
            <EmptyState
              icon={FiShoppingBag}
              title="سبد خرید شما خالی است"
              description="از میان گیاهان دارویی، ادویه‌ها و دمنوش‌ها شروع کنید. پیشنهاد ما: دمنوش آرامش شب."
              action="شروع خرید"
              to="/products"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_23rem]">
            <div>
              <div className="flex items-center justify-between border-b hairline pb-3">
                <p className="num text-sm text-ink-500">{toFa(cart.itemsCount)} کالا در سبد</p>
                <button onClick={() => setConfirm(true)} className="flex items-center gap-1.5 text-xs text-ink-400 transition-colors hover:text-berry-600">
                  <FiTrash2 size={14} /> خالی کردن سبد
                </button>
              </div>

              <div className="divide-y hairline">
                {cart.items.map((item) => <CartItem key={item._id} item={item} />)}
              </div>

              <Link to="/products" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-moss-700 hover:text-moss-900">
                <FiArrowLeft size={16} /> ادامه خرید
              </Link>
            </div>

            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
              <CartSummary cart={cart}>
                <Button to={isAuthenticated ? '/checkout' : '/login?redirect=/checkout'} size="lg" className="w-full">
                  {isAuthenticated ? 'ادامه و ثبت سفارش' : 'ورود و ثبت سفارش'}
                </Button>
                <p className="text-center text-2xs leading-6 text-ink-400">
                  با ثبت سفارش، <Link to="/terms" className="text-moss-700 underline">قوانین فروشگاه</Link> را می‌پذیرید.
                </p>
              </CartSummary>
            </div>
          </div>
        )}

        {!loading && (
          <section className="mt-16 border-t hairline pt-12" aria-label="پیشنهاد برای سبد شما">
            <Recommendations
              sources={suggest.sources}
              loading={suggest.loading}
              exclude={inCart}
              filters={false}
              eyebrow={cart.items.length ? 'کنار سبدت' : 'برای شروع'}
              title={cart.items.length ? 'این‌ها هم کنارش خوب است' : 'از پرطرفدارها شروع کن'}
            />
          </section>
        )}
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={async () => { await clear(); setConfirm(false); }}
        title="خالی کردن سبد خرید"
        description="همه کالاهای سبد حذف می‌شوند. علاقه‌مندی‌های شما دست‌نخورده می‌ماند."
        confirmText="خالی کن"
      />
    </>
  );
}
