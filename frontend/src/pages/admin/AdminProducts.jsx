import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FiCheck, FiDownload, FiEdit2, FiEye, FiEyeOff, FiImage, FiMinus, FiPercent, FiPlus, FiRefreshCw,
  FiSearch, FiStar, FiTrash2, FiX,
} from 'react-icons/fi';
import Button from '../../components/ui/Button.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { RowsSkeleton } from '../../components/ui/Skeleton.jsx';
import Seo from '../../components/common/Seo.jsx';
import { adminApi, categoryApi, productApi } from '../../services/endpoints.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useDebounced, useHotkey } from '../../hooks/index.js';
import { finalPrice, toEn, toFa, toman } from '../../utils/format.js';
import SmartImage from '../../components/ui/SmartImage.jsx';

/**
 * مدیریت تعاملی محصولات.
 *
 * - ویرایش درجا: روی قیمت / تخفیف / موجودی کلیک کن، Enter ذخیره، Esc انصراف
 * - دکمه‌های +/− موجودی، ستاره‌ی «ویژه» و سوییچ فعال/غیرفعال، بدون رفرش کل جدول
 * - انتخاب چندتایی + عملیات گروهی (فعال/غیرفعال، ویژه، تخفیف، موجودی، حذف)
 * - فیلتر دسته‌بندی / وضعیت / موجودی که در URL می‌ماند (قابل اشتراک و بوکمارک)
 * - خروجی CSV از لیست فعلی و نمای کارتی روی موبایل
 *
 * همه‌ی تغییرات optimistic هستند: اول در UI اعمال می‌شوند و اگر سرور خطا داد برمی‌گردند.
 * سمت سرور تغییری لازم ندارد؛ از همان PUT /products/:id و GET /admin/products استفاده می‌شود.
 */

const STATUS_FILTERS = [['', 'همه'], ['active', 'فعال'], ['inactive', 'غیرفعال']];
const STOCK_FILTERS = [['', 'همه'], ['low', 'رو به اتمام'], ['out', 'ناموجود']];
const PAGE_SIZES = [15, 30, 60];

const LIMITS = {
  price: { min: 0, max: 1e11 },
  discount: { min: 0, max: 90 },
  stock: { min: 0, max: 1e6 },
};

const clampField = (field, value) => {
  const { min, max } = LIMITS[field];
  const n = Math.round(Number(toEn(String(value)).replace(/[^\d.]/g, '')));
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
};

/** اجرای دسته‌ای با سقف هم‌زمانی تا سرور و rate limiter اذیت نشوند. */
async function runBatch(items, fn, size = 4) {
  const result = { ok: [], failed: [] };
  for (let i = 0; i < items.length; i += size) {
    const slice = items.slice(i, i + size);
    // eslint-disable-next-line no-await-in-loop
    const settled = await Promise.allSettled(slice.map(fn));
    settled.forEach((r, j) => (r.status === 'fulfilled' ? result.ok : result.failed).push(slice[j]));
  }
  return result;
}

function exportCsv(products) {
  const head = ['کد', 'نام', 'دسته‌بندی', 'قیمت', 'تخفیف٪', 'قیمت نهایی', 'موجودی', 'وضعیت', 'ویژه'];
  const rows = products.map((p) => [
    p.productNumber ?? '', p.name, p.category?.name ?? '', p.price, p.discount || 0, finalPrice(p), p.stock,
    p.isActive ? 'فعال' : 'غیرفعال', p.isFeatured ? 'بله' : 'خیر',
  ]);
  const cell = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const csv = `\uFEFF${[head, ...rows].map((r) => r.map(cell).join(',')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `kalavaran-products-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** سلول عددی قابل ویرایش درجا. */
function InlineNumber({ value, field, onSave, display, className = '', label }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const start = () => { setDraft(String(value ?? 0)); setEditing(true); };
  const cancel = () => setEditing(false);
  const commit = () => {
    setEditing(false);
    const next = clampField(field, draft);
    if (next === null || next === value) return;
    onSave(next);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        inputMode="numeric"
        dir="ltr"
        aria-label={label}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        }}
        className="num h-9 w-28 rounded-lg border border-moss-500 bg-bone-50 px-2 text-center text-sm outline-none ring-2 ring-moss-100"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={start}
      title="برای ویرایش کلیک کنید"
      aria-label={`${label}: ${toFa(value ?? 0)}، ویرایش`}
      className={`num group/cell inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-dashed border-transparent px-2 transition-colors hover:border-bone-300 hover:bg-bone-100 ${className}`}
    >
      {display}
      <FiEdit2 size={11} className="text-ink-300 opacity-0 transition-opacity group-hover/cell:opacity-100" aria-hidden="true" />
    </button>
  );
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${checked ? 'bg-moss-600' : 'bg-bone-300'}`}
    >
      <span className={`inline-block size-5 rounded-full bg-bone-50 shadow-card transition-transform duration-200 ease-expo ${checked ? '-translate-x-[1.375rem]' : '-translate-x-0.5'}`} />
    </button>
  );
}

function StockControl({ product, onSet }) {
  const tone = product.stock === 0 ? 'text-berry-600' : product.stock <= 10 ? 'text-saffron-600' : 'text-ink-900';
  return (
    <div className="inline-flex items-center gap-0.5 rounded-xl border hairline bg-bone-50 p-0.5">
      <button type="button" aria-label="کم کردن موجودی" disabled={product.stock <= 0} onClick={() => onSet(product.stock - 1)} className="grid size-8 place-items-center rounded-lg text-ink-500 hover:bg-bone-200 disabled:opacity-30">
        <FiMinus size={13} />
      </button>
      <InlineNumber value={product.stock} field="stock" label="موجودی" onSave={onSet} className={`justify-center font-bold ${tone}`} display={toFa(product.stock)} />
      <button type="button" aria-label="افزایش موجودی" onClick={() => onSet(product.stock + 1)} className="grid size-8 place-items-center rounded-lg text-ink-500 hover:bg-bone-200">
        <FiPlus size={13} />
      </button>
    </div>
  );
}

function Chips({ options, value, onChange, label }) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl bg-bone-100 p-1" role="group" aria-label={label}>
      {options.map(([v, text]) => (
        <button
          key={v || 'all'}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={`min-h-8 rounded-lg px-3 text-xs font-semibold transition-colors ${value === v ? 'bg-bone-50 text-moss-900 shadow-card' : 'text-ink-500 hover:text-ink-900'}`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export default function AdminProducts() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [state, setState] = useState({ products: null, meta: null });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(params.get('search') || '');
  const [selected, setSelected] = useState(() => new Set());
  const [saving, setSaving] = useState(() => new Set());
  const [target, setTarget] = useState(null); // حذف تکی
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkInput, setBulkInput] = useState(null); // 'discount' | 'stock'
  const [bulkValue, setBulkValue] = useState('');
  const [busy, setBusy] = useState(false);
  const searchRef = useRef(null);

  const page = Number(params.get('page')) || 1;
  const limit = Number(params.get('limit')) || 15;
  const stock = params.get('stock') || '';
  const status = params.get('status') || '';
  const category = params.get('category') || '';
  const term = useDebounced(search, 400);

  const setParam = useCallback((patch) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, String(v)) : next.delete(k)));
      if (!('page' in patch)) next.delete('page');
      return next;
    }, { replace: true });
  }, [setParams]);

  useEffect(() => { if ((params.get('search') || '') !== term) setParam({ search: term }); }, [term]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    categoryApi.list().then(({ data }) => setCategories(data.categories || [])).catch(() => {});
  }, []);

  const load = useCallback(({ silent = false } = {}) => {
    if (!silent) setState((s) => ({ ...s, products: null }));
    return adminApi.products({
      page, limit, search: term || undefined, stock: stock || undefined, status: status || undefined, category: category || undefined,
    })
      .then(({ data }) => setState({ products: data.products, meta: data.meta }))
      .catch(() => setState({ products: [], meta: null }));
  }, [page, limit, term, stock, status, category]);

  useEffect(() => { load(); setSelected(new Set()); }, [load]);

  useHotkey('/', useCallback(() => searchRef.current?.focus(), []));

  const products = state.products || [];

  const patchLocal = useCallback((ids, patch) => {
    const set = new Set(ids.map(String));
    setState((s) => ({
      ...s,
      products: s.products?.map((p) => (set.has(String(p._id)) ? { ...p, ...(typeof patch === 'function' ? patch(p) : patch) } : p)),
    }));
  }, []);

  const markSaving = (id, on) => setSaving((prev) => {
    const next = new Set(prev);
    if (on) next.add(String(id)); else next.delete(String(id));
    return next;
  });

  /** تغییر تکی optimistic با بازگشت در صورت خطا. */
  const update = useCallback(async (product, patch, successMsg) => {
    const before = Object.fromEntries(Object.keys(patch).map((k) => [k, product[k]]));
    patchLocal([product._id], patch);
    markSaving(product._id, true);
    try {
      await productApi.update(product._id, patch);
      if (successMsg) toast.success(successMsg);
    } catch (err) {
      patchLocal([product._id], before);
      toast.error(err.message || 'ذخیره نشد');
    } finally {
      markSaving(product._id, false);
    }
  }, [patchLocal, toast]);

  const remove = async () => {
    setBusy(true);
    try {
      await productApi.remove(target._id);
      toast.success('محصول حذف شد');
      setTarget(null);
      load({ silent: true });
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };

  // انتخاب
  const allOnPage = products.length > 0 && products.every((p) => selected.has(String(p._id)));
  const toggleOne = (id) => setSelected((prev) => {
    const next = new Set(prev);
    const k = String(id);
    if (next.has(k)) next.delete(k); else next.add(k);
    return next;
  });
  const toggleAll = () => setSelected(allOnPage ? new Set() : new Set(products.map((p) => String(p._id))));
  const selectedProducts = useMemo(() => products.filter((p) => selected.has(String(p._id))), [products, selected]);

  /** عملیات گروهی. patchFor(product) مقدار جدید هر محصول را برمی‌گرداند. */
  const bulk = async (patchFor, label) => {
    const list = selectedProducts;
    if (!list.length) return;
    setBulkBusy(true);
    const snapshot = new Map(list.map((p) => [String(p._id), p]));
    list.forEach((p) => patchLocal([p._id], patchFor(p)));
    const { ok, failed } = await runBatch(list, (p) => productApi.update(p._id, patchFor(p)));
    failed.forEach((p) => {
      const orig = snapshot.get(String(p._id));
      patchLocal([p._id], Object.fromEntries(Object.keys(patchFor(p)).map((k) => [k, orig[k]])));
    });
    setBulkBusy(false);
    if (failed.length) toast.error(`${toFa(ok.length)} محصول ${label}، ${toFa(failed.length)} مورد ناموفق`);
    else toast.success(`${toFa(ok.length)} محصول ${label}`);
    setSelected(new Set(failed.map((p) => String(p._id))));
    // اگر فیلتر وضعیت/موجودی فعال است، ردیف‌هایی که دیگر با فیلتر نمی‌خوانند باید بروند
    if (status || stock) load({ silent: true });
  };

  const applyBulkInput = () => {
    const field = bulkInput;
    const mode = field === 'stock' && /^[+-]/.test(bulkValue.trim()) ? 'delta' : 'set';
    const raw = clampField(field === 'stock' && mode === 'delta' ? 'stock' : field, bulkValue.replace(/^[+-]/, ''));
    if (raw === null || bulkValue.trim() === '') { toast.error('یک عدد معتبر وارد کنید'); return; }
    const sign = bulkValue.trim().startsWith('-') ? -1 : 1;
    setBulkInput(null);
    setBulkValue('');
    if (field === 'discount') bulk(() => ({ discount: raw }), `تخفیف ٪${toFa(raw)} گرفت`);
    else bulk((p) => ({ stock: mode === 'delta' ? Math.max(0, p.stock + sign * raw) : raw }), 'موجودی‌شان به‌روز شد');
  };

  const confirmBulkDelete = async () => {
    setBulkBusy(true);
    const { ok, failed } = await runBatch(selectedProducts, (p) => productApi.remove(p._id), 3);
    setBulkBusy(false);
    setBulkDelete(false);
    if (failed.length) toast.error(`${toFa(ok.length)} حذف شد، ${toFa(failed.length)} مورد ناموفق`);
    else toast.success(`${toFa(ok.length)} محصول حذف شد`);
    setSelected(new Set());
    load({ silent: true });
  };

  // خلاصه‌ی همین صفحه
  const summary = useMemo(() => ({
    out: products.filter((p) => p.stock === 0).length,
    low: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    inactive: products.filter((p) => !p.isActive).length,
    value: products.reduce((sum, p) => sum + finalPrice(p) * (p.stock || 0), 0),
  }), [products]);

  const filtersActive = Boolean(term || stock || status || category);

  const rowActions = (p) => (
    <div className="flex items-center justify-end gap-0.5">
      <button
        type="button"
        onClick={() => update(p, { isFeatured: !p.isFeatured }, p.isFeatured ? 'از ویژه‌ها برداشته شد' : 'به ویژه‌ها اضافه شد')}
        aria-label={p.isFeatured ? 'حذف از ویژه' : 'افزودن به ویژه'}
        aria-pressed={Boolean(p.isFeatured)}
        title="محصول ویژه"
        className={`grid size-9 place-items-center rounded-lg transition-colors ${p.isFeatured ? 'text-saffron-600 hover:bg-saffron-50' : 'text-ink-300 hover:bg-bone-200 hover:text-saffron-600'}`}
      >
        <FiStar size={16} className={p.isFeatured ? 'fill-saffron-500' : ''} />
      </button>
      {p.slug && (
        <a href={`/products/${p.slug}`} target="_blank" rel="noreferrer" aria-label="مشاهده در سایت" title="مشاهده در سایت" className="grid size-9 place-items-center rounded-lg text-ink-400 hover:bg-moss-50 hover:text-moss-700">
          <FiEye size={15} />
        </a>
      )}
      <Link to={`/admin/products/${p._id}/edit`} aria-label="ویرایش کامل" title="ویرایش کامل" className="grid size-9 place-items-center rounded-lg text-ink-400 hover:bg-moss-50 hover:text-moss-700"><FiEdit2 size={15} /></Link>
      <button type="button" onClick={() => setTarget(p)} aria-label="حذف" title="حذف" className="grid size-9 place-items-center rounded-lg text-ink-400 hover:bg-berry-100 hover:text-berry-600"><FiTrash2 size={15} /></button>
    </div>
  );

  const priceCell = (p) => (
    <div className="flex flex-col items-start">
      <InlineNumber value={p.price} field="price" label="قیمت پایه" onSave={(v) => update(p, { price: v }, 'قیمت ذخیره شد')} display={toman(p.price, { suffix: false })} />
      {p.discount > 0 && <span className="num px-2 text-2xs text-ink-400">نهایی: {toman(finalPrice(p), { suffix: false })}</span>}
    </div>
  );

  const discountCell = (p) => (
    <InlineNumber
      value={p.discount || 0} field="discount" label="درصد تخفیف"
      onSave={(v) => update(p, { discount: v }, v ? `تخفیف ٪${toFa(v)} ثبت شد` : 'تخفیف برداشته شد')}
      className={p.discount > 0 ? 'font-semibold text-berry-600' : 'text-ink-300'}
      display={p.discount > 0 ? `٪${toFa(p.discount)}` : '—'}
    />
  );

  return (
    <>
      <Seo title="مدیریت محصولات" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">محصولات</h1>
          {state.meta && <p className="num mt-1.5 text-sm text-ink-500">{toFa(state.meta.total)} کالا{filtersActive ? ' با این فیلترها' : ''}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="md" icon={FiDownload} disabled={!products.length} onClick={() => { exportCsv(products); toast.info('فایل CSV ساخته شد'); }}>CSV</Button>
          <Button to="/admin/products/images" variant="outline" icon={FiImage} size="md">تعویض فله‌ای تصاویر</Button>
          <Button to="/admin/products/new" icon={FiPlus} size="md">محصول جدید</Button>
        </div>
      </div>

      {/* خلاصه‌ی سریع که خودش فیلتر هم هست */}
      {state.products && (
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ['ناموجود در این صفحه', summary.out, 'text-berry-600', () => setParam({ stock: stock === 'out' ? '' : 'out' }), stock === 'out'],
            ['رو به اتمام', summary.low, 'text-saffron-600', () => setParam({ stock: stock === 'low' ? '' : 'low' }), stock === 'low'],
            ['غیرفعال', summary.inactive, 'text-ink-700', () => setParam({ status: status === 'inactive' ? '' : 'inactive' }), status === 'inactive'],
            ['ارزش موجودی (تومان)', summary.value, 'text-moss-900', null, false],
          ].map(([label, n, tone, onClick, active]) => {
            const Tag = onClick ? 'button' : 'div';
            return (
              <Tag
                key={label}
                {...(onClick ? { type: 'button', onClick, 'aria-pressed': active } : {})}
                className={`rounded-2xl border bg-bone-50 p-4 text-right transition-colors ${active ? 'border-moss-500 ring-2 ring-moss-100' : 'hairline'} ${onClick ? 'hover:border-moss-300' : ''}`}
              >
                <p className="text-2xs font-medium text-ink-400">{label}</p>
                <p className={`num mt-1 truncate text-xl font-extrabold ${tone}`}>{label.startsWith('ارزش') ? toman(n, { suffix: false }) : toFa(n)}</p>
              </Tag>
            );
          })}
        </div>
      )}

      {/* فیلترها */}
      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative w-full lg:max-w-xs">
          <FiSearch className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={17} />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجوی نام محصول  ( / )"
            aria-label="جست‌وجو"
            className="field bg-bone-50 pr-11"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setParam({ category: e.target.value })}
          aria-label="فیلتر دسته‌بندی"
          className="field w-full bg-bone-50 lg:w-52"
        >
          <option value="">همه‌ی دسته‌بندی‌ها</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <div className="flex flex-wrap gap-2">
          <Chips label="وضعیت" options={STATUS_FILTERS} value={status} onChange={(v) => setParam({ status: v })} />
          <Chips label="موجودی" options={STOCK_FILTERS} value={stock} onChange={(v) => setParam({ stock: v })} />
        </div>
        <div className="flex items-center gap-2 lg:mr-auto">
          {filtersActive && (
            <button type="button" onClick={() => { setSearch(''); setParams({}, { replace: true }); }} className="btn btn-ghost btn-sm gap-1 text-xs">
              <FiX size={14} /> پاک کردن فیلترها
            </button>
          )}
          <button type="button" onClick={() => load({ silent: true })} aria-label="تازه‌سازی" className="grid size-10 place-items-center rounded-xl text-ink-500 hover:bg-bone-200">
            <FiRefreshCw size={16} />
          </button>
          <select value={limit} onChange={(e) => setParam({ limit: Number(e.target.value) === 15 ? '' : e.target.value })} aria-label="تعداد در صفحه" className="field h-10 w-24 bg-bone-50 px-3 text-xs">
            {PAGE_SIZES.map((n) => <option key={n} value={n}>{toFa(n)} تایی</option>)}
          </select>
        </div>
      </div>

      <p className="mt-3 text-2xs text-ink-400">نکته: روی قیمت، تخفیف یا موجودی کلیک کن تا همان‌جا ویرایش شود. Enter ذخیره، Esc انصراف.</p>

      {/* جدول (دسکتاپ) */}
      <div className="mt-3 overflow-hidden rounded-2xl border hairline bg-bone-50">
        {state.products === null ? (
          <div className="p-5"><RowsSkeleton rows={8} /></div>
        ) : products.length === 0 ? (
          <EmptyState title="محصولی پیدا نشد" description="فیلترها یا عبارت جست‌وجو را تغییر دهید یا محصول جدیدی بسازید." action="محصول جدید" to="/admin/products/new" />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[60rem] text-sm">
                <thead className="bg-bone-100 text-2xs uppercase tracking-wide text-ink-400">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <input type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="انتخاب همه" className="size-4 accent-moss-700" />
                    </th>
                    {['کد', 'محصول', 'دسته‌بندی', 'قیمت', 'تخفیف', 'موجودی', 'فعال', ''].map((h) => (
                      <th key={h || 'actions'} className="px-3 py-3 text-right font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y hairline">
                  {products.map((p) => {
                    const isSel = selected.has(String(p._id));
                    const isSaving = saving.has(String(p._id));
                    return (
                      <tr key={p._id} className={`transition-colors ${isSel ? 'bg-moss-50/70' : 'hover:bg-moss-50/30'} ${!p.isActive ? 'opacity-70' : ''} ${isSaving ? 'animate-pulse' : ''}`}>
                        <td className="px-4 py-2.5">
                          <input type="checkbox" checked={isSel} onChange={() => toggleOne(p._id)} aria-label={`انتخاب ${p.name}`} className="size-4 accent-moss-700" />
                        </td>
                        <td className="num px-3 py-2.5 font-semibold text-moss-700">
                          {p.productNumber ? toFa(String(p.productNumber).padStart(3, '0')) : '—'}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <SmartImage src={p.images?.[0]?.url} alt="" loading="lazy" className="size-11 shrink-0 rounded-lg object-cover" fallbackLabel="" />
                            <Link to={`/admin/products/${p._id}/edit`} className="line-clamp-2 max-w-[15rem] font-medium leading-6 hover:text-moss-700">{p.name}</Link>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-ink-500">{p.category?.name}</td>
                        <td className="px-3 py-2.5">{priceCell(p)}</td>
                        <td className="px-3 py-2.5">{discountCell(p)}</td>
                        <td className="px-3 py-2.5"><StockControl product={p} onSet={(v) => update(p, { stock: Math.max(0, v) })} /></td>
                        <td className="px-3 py-2.5">
                          <Switch checked={Boolean(p.isActive)} label={p.isActive ? 'غیرفعال کردن' : 'فعال کردن'} onChange={() => update(p, { isActive: !p.isActive }, p.isActive ? 'محصول غیرفعال شد' : 'محصول فعال شد')} />
                        </td>
                        <td className="px-3 py-2.5">{rowActions(p)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* کارت‌ها (موبایل) */}
            <div className="divide-y hairline md:hidden">
              <label className="flex items-center gap-3 bg-bone-100 px-4 py-3 text-xs font-semibold text-ink-500">
                <input type="checkbox" checked={allOnPage} onChange={toggleAll} className="size-4 accent-moss-700" />
                انتخاب همه‌ی این صفحه
              </label>
              {products.map((p) => {
                const isSel = selected.has(String(p._id));
                return (
                  <div key={p._id} className={`p-4 ${isSel ? 'bg-moss-50/70' : ''} ${!p.isActive ? 'opacity-75' : ''}`}>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" checked={isSel} onChange={() => toggleOne(p._id)} aria-label={`انتخاب ${p.name}`} className="mt-1 size-4 shrink-0 accent-moss-700" />
                      <SmartImage src={p.images?.[0]?.url} alt="" loading="lazy" className="size-14 shrink-0 rounded-xl object-cover" fallbackLabel="" />
                      <div className="min-w-0 flex-1">
                        <Link to={`/admin/products/${p._id}/edit`} className="line-clamp-2 text-sm font-semibold leading-6">{p.name}</Link>
                        <p className="num mt-0.5 text-2xs text-ink-400">
                          {p.productNumber ? `کد ${toFa(String(p.productNumber).padStart(3, '0'))} · ` : ''}{p.category?.name}
                        </p>
                      </div>
                      <Switch checked={Boolean(p.isActive)} label={p.isActive ? 'غیرفعال کردن' : 'فعال کردن'} onChange={() => update(p, { isActive: !p.isActive }, p.isActive ? 'محصول غیرفعال شد' : 'محصول فعال شد')} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-bone-100 p-2"><p className="px-2 text-2xs text-ink-400">قیمت</p>{priceCell(p)}</div>
                      <div className="rounded-xl bg-bone-100 p-2"><p className="px-2 text-2xs text-ink-400">تخفیف</p>{discountCell(p)}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <StockControl product={p} onSet={(v) => update(p, { stock: Math.max(0, v) })} />
                      {rowActions(p)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Pagination page={state.meta?.page || 1} pages={state.meta?.pages || 1} onChange={(n) => setParam({ page: n === 1 ? '' : n })} />

      {/* نوار عملیات گروهی */}
      {selected.size > 0 && (
        <div className="admin-bulk-bar fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-4xl animate-fade-up rounded-2xl bg-ink-900 p-3 text-bone-50 shadow-pop sm:inset-x-6" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
          {bulkInput ? (
            <form onSubmit={(e) => { e.preventDefault(); applyBulkInput(); }} className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold">
                {bulkInput === 'discount' ? 'درصد تخفیف (۰ تا ۹۰):' : 'موجودی جدید (مثلاً ۲۰، یا +۵ / -۳ برای تغییر نسبی):'}
              </span>
              <input
                autoFocus dir="ltr" inputMode="numeric" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)}
                className="num h-9 w-28 rounded-lg border-0 bg-bone-50 px-2 text-center text-sm text-ink-900 outline-none"
                aria-label="مقدار"
              />
              <button type="submit" className="btn btn-sm gap-1 bg-saffron-500 text-xs text-ink-900 hover:bg-saffron-300"><FiCheck size={14} /> اعمال روی {toFa(selected.size)} مورد</button>
              <button type="button" onClick={() => { setBulkInput(null); setBulkValue(''); }} className="btn btn-sm text-xs text-bone-200 hover:bg-ink-700">انصراف</button>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="num ml-2 text-xs font-bold">{toFa(selected.size)} انتخاب شده</span>
              {[
                [FiEye, 'فعال', () => bulk(() => ({ isActive: true }), 'فعال شد')],
                [FiEyeOff, 'غیرفعال', () => bulk(() => ({ isActive: false }), 'غیرفعال شد')],
                [FiStar, 'ویژه', () => bulk(() => ({ isFeatured: true }), 'ویژه شد')],
                [FiStar, 'حذف ویژه', () => bulk(() => ({ isFeatured: false }), 'از ویژه‌ها خارج شد')],
                [FiPercent, 'تخفیف', () => setBulkInput('discount')],
                [FiPlus, 'موجودی', () => setBulkInput('stock')],
              ].map(([Icon, label, onClick]) => (
                <button key={label} type="button" disabled={bulkBusy} onClick={onClick} className="btn btn-sm gap-1.5 text-xs text-bone-50 hover:bg-ink-700 disabled:opacity-50">
                  <Icon size={14} /> {label}
                </button>
              ))}
              <button type="button" disabled={bulkBusy} onClick={() => setBulkDelete(true)} className="btn btn-sm gap-1.5 text-xs text-berry-100 hover:bg-berry-600 disabled:opacity-50">
                <FiTrash2 size={14} /> حذف
              </button>
              <button type="button" onClick={() => setSelected(new Set())} aria-label="لغو انتخاب" className="mr-auto grid size-9 place-items-center rounded-lg text-bone-200 hover:bg-ink-700">
                {bulkBusy ? <FiRefreshCw size={15} className="animate-spin" /> : <FiX size={16} />}
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(target)} onClose={() => setTarget(null)} onConfirm={remove} loading={busy}
        title="حذف محصول"
        description={`«${target?.name}» و همه نظرات آن حذف می‌شود. اگر فقط می‌خواهید از فروشگاه پنهان شود، آن را غیرفعال کنید.`}
        confirmText="حذف کن"
      />
      <ConfirmDialog
        open={bulkDelete} onClose={() => setBulkDelete(false)} onConfirm={confirmBulkDelete} loading={bulkBusy}
        title={`حذف ${toFa(selected.size)} محصول`}
        description="این محصولات و همه‌ی نظراتشان برای همیشه حذف می‌شوند. اگر فقط می‌خواهید از فروشگاه پنهان شوند، «غیرفعال» را بزنید."
        confirmText="حذف همه"
      />
    </>
  );
}
