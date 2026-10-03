import { useEffect, useState } from 'react';
import { FiEdit2, FiLayers, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { RowsSkeleton } from '../../components/ui/Skeleton.jsx';
import Seo from '../../components/common/Seo.jsx';
import { categoryApi } from '../../services/endpoints.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useSubmit } from '../../hooks/index.js';
import { toFa } from '../../utils/format.js';
import SmartImage from '../../components/ui/SmartImage.jsx';
import SeoFields from './SeoFields.jsx';
import { categoryContentFor, findCategoryContent, fullTitle } from '@shared/seo/index.js';

const EMPTY = {
  name: '', description: '', image: '', order: 0, isActive: true,
  slug: '', seoTitle: '', seoDescription: '', intro: '', faqs: [],
};
const MAX_FAQS = 12; // same limit as the backend validator

/** کش دسته‌بندی‌های فروشگاه (MainLayout) را پاک می‌کند تا تغییرات ادمین فوراً در منو دیده شود. */
const clearStoreCategoryCache = () => {
  try { sessionStorage.removeItem('attari_categories'); } catch { /* حالت خصوصی */ }
};

export default function AdminCategories() {
  const toast = useToast();
  const [categories, setCategories] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => categoryApi.list({ all: 'true' })
    .then(({ data }) => setCategories(Array.isArray(data?.categories) ? data.categories : []))
    .catch((err) => { toast.error(err.message || 'دسته‌بندی‌ها بارگذاری نشد'); setCategories([]); });

  // قبلاً useEffect(load, []) بود: load یک Promise برمی‌گرداند و React آن را تابع cleanup
  // حساب می‌کرد؛ با ترک صفحه (و در StrictMode همان اول) خطای «destroy is not a function» می‌داد.
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const open = (c) => {
    setEditing(c || 'new');
    setForm(c ? {
      ...EMPTY, ...c,
      image: c.image?.url || '',
      intro: c.intro || '',
      faqs: (c.faqs || []).map((f) => ({ question: f.question || '', answer: f.answer || '' })),
    } : EMPTY);
    setErrors({});
  };

  const [save, saving] = useSubmit(async (e) => {
    e?.preventDefault?.();
    if (form.name.trim().length < 2) { setErrors({ name: 'نام دسته‌بندی الزامی است' }); return; }
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      order: Number(form.order) || 0,
      isActive: Boolean(form.isActive),
      ...(form.image ? { image: { url: form.image } } : {}),
      // SEO + page content. Empty = editorial defaults (shared/seo/categoryContent.js).
      slug: form.slug?.trim() || undefined,
      seoTitle: (form.seoTitle || '').trim(),
      seoDescription: (form.seoDescription || '').trim(),
      intro: (form.intro || '').trim(),
      faqs: (form.faqs || [])
        .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
        .filter((f) => f.question.length >= 3 && f.answer.length >= 3),
    };
    try {
      const res = editing === 'new' ? await categoryApi.create(payload) : await categoryApi.update(editing._id, payload);
      toast.success(res.message);
      clearStoreCategoryCache();
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message);
      setErrors(err.details || {});
    }
  });

  const setFaq = (i, patch) => setForm((f) => ({ ...f, faqs: f.faqs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)) }));
  const addFaq = () => setForm((f) => ({ ...f, faqs: [...(f.faqs || []), { question: '', answer: '' }].slice(0, MAX_FAQS) }));
  const removeFaq = (i) => setForm((f) => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }));

  // Editorial default copy for this category (what the storefront shows while the fields are empty).
  const defaults = findCategoryContent({ slug: editing?.slug, name: form.name });
  const fillDefaults = () => {
    if (!defaults) return;
    setForm((f) => ({
      ...f,
      seoTitle: f.seoTitle || defaults.seoTitle || '',
      seoDescription: f.seoDescription || defaults.seoDescription || '',
      intro: f.intro || (defaults.intro || []).join('\n\n'),
      faqs: f.faqs?.length ? f.faqs : (defaults.faqs || []).map((q) => ({ ...q })),
    }));
  };
  const effective = categoryContentFor({ ...form, slug: editing?.slug });

  const remove = async () => {
    setBusy(true);
    try {
      await categoryApi.remove(target._id);
      toast.success('دسته‌بندی حذف شد');
      clearStoreCategoryCache();
      setTarget(null);
      load();
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };

  return (
    <>
      <Seo title="مدیریت دسته‌بندی‌ها" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">دسته‌بندی‌ها</h1>
        <Button icon={FiPlus} size="md" onClick={() => open(null)}>دسته‌بندی جدید</Button>
      </div>

      {categories === null ? (
        <div className="mt-6 rounded-2xl border hairline bg-bone-50 p-5"><RowsSkeleton rows={5} /></div>
      ) : categories.length === 0 ? (
        <div className="mt-6 rounded-2xl border hairline bg-bone-50">
          <EmptyState icon={FiLayers} title="دسته‌بندی‌ای وجود ندارد" description="قفسه‌های فروشگاه را بسازید تا محصولات جای درست خود بنشینند." action="دسته‌بندی جدید" onAction={() => open(null)} />
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((c) => (
            <li key={c._id} className="flex gap-4 rounded-2xl border hairline bg-bone-50 p-4">
              {c.image?.url ? (
                <SmartImage src={c.image.url} alt="" loading="lazy" className="size-16 shrink-0 rounded-xl object-cover" fallbackLabel="" />
              ) : (
                <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-moss-50 text-moss-600"><FiLayers size={20} /></span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{c.name}</p>
                    <p className="num mt-1 text-2xs text-ink-400">
                      {toFa(c.productsCount ?? 0)} محصول
                      {c.activeProductsCount !== undefined && c.activeProductsCount !== c.productsCount
                        ? ` (${toFa(c.activeProductsCount)} فعال)` : ''}
                      {' · '}ترتیب {toFa(c.order ?? 0)}
                    </p>
                  </div>
                  {!c.isActive && <Badge tone="neutral">غیرفعال</Badge>}
                </div>
                <div className="mt-3 flex gap-1">
                  <button onClick={() => open(c)} aria-label="ویرایش" className="rounded-lg p-1.5 text-ink-400 hover:bg-moss-50 hover:text-moss-700"><FiEdit2 size={15} /></button>
                  <button onClick={() => setTarget(c)} aria-label="حذف" className="rounded-lg p-1.5 text-ink-400 hover:bg-berry-100 hover:text-berry-600"><FiTrash2 size={15} /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        size="lg"
        open={Boolean(editing)} onClose={() => setEditing(null)}
        title={editing === 'new' ? 'دسته‌بندی جدید' : 'ویرایش دسته‌بندی'}
        footer={(
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>انصراف</Button>
            <Button size="sm" loading={saving} onClick={save}>ذخیره</Button>
          </>
        )}
      >
        <form onSubmit={save} className="space-y-4" noValidate>
          <Input label="نام" value={form.name} error={errors.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <div>
            <label className="label" htmlFor="cdesc">توضیح</label>
            <textarea id="cdesc" rows={3} value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="field h-auto resize-none py-3 leading-7" />
          </div>
          <Input label="آدرس تصویر" placeholder="https://…" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
          <Input label="ترتیب نمایش" inputMode="numeric" className="num" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} />
          <label className="flex items-center gap-2.5 text-sm">
            <input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="size-4 accent-moss-700" />
            فعال
          </label>

          <SeoFields
            value={form}
            onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
            pathPrefix="/category/"
            currentSlug={editing && editing !== 'new' ? editing.slug : ''}
            previewTitle={fullTitle(effective.seoTitle)}
            previewDescription={effective.seoDescription}
            errors={errors}
          />

          <section className="rounded-2xl border hairline bg-bone-50 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold">محتوای صفحه‌ی دسته‌بندی</h2>
              {defaults && (
                <button type="button" onClick={fillDefaults} className="text-xs font-medium text-moss-700 underline hover:text-moss-900">
                  پر کردن فیلدهای خالی از متن پیش‌فرض
                </button>
              )}
            </div>
            <p className="mt-1.5 text-xs leading-6 text-ink-400">
              مقدمه زیر عنوان صفحه و پرسش‌ها پایین فهرست محصولات (فقط صفحه‌ی اول) نمایش داده می‌شوند. اسکیمای FAQ فقط از همین پرسش‌های قابل‌مشاهده ساخته می‌شود.
              {defaults ? ' خالی = متن پیش‌فرض.' : ''}
            </p>

            <div className="mt-4">
              <label className="label" htmlFor="cintro">مقدمه</label>
              <textarea
                id="cintro" rows={5} maxLength={5000} value={form.intro || ''}
                placeholder={(defaults?.intro || []).join('\n\n') || 'هر پاراگراف را با یک خط خالی جدا کنید.'}
                onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
                className={`field h-auto resize-y py-3 leading-7 ${errors.intro ? 'field-error' : ''}`}
              />
              <p className="mt-1.5 text-2xs text-ink-400">پاراگراف‌ها را با یک خط خالی از هم جدا کنید.</p>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-2">
                <span className="label mb-0">پرسش‌های رایج</span>
                <span className="num text-2xs text-ink-400">{toFa(form.faqs?.length || 0)} / {toFa(MAX_FAQS)}</span>
              </div>
              {!(form.faqs?.length) && defaults?.faqs?.length > 0 && (
                <p className="mt-2 text-2xs text-ink-400">فعلاً {toFa(defaults.faqs.length)} پرسش پیش‌فرض نمایش داده می‌شود.</p>
              )}
              <div className="mt-3 space-y-3">
                {(form.faqs || []).map((q, i) => (
                  <div key={i} className="relative rounded-xl border hairline bg-white p-3 pl-12">
                    <input
                      aria-label={`پرسش ${toFa(i + 1)}`} placeholder="پرسش" maxLength={200} value={q.question}
                      onChange={(e) => setFaq(i, { question: e.target.value })}
                      className="field h-10 text-sm font-medium"
                    />
                    <textarea
                      aria-label={`پاسخ ${toFa(i + 1)}`} placeholder="پاسخ" rows={2} maxLength={1200} value={q.answer}
                      onChange={(e) => setFaq(i, { answer: e.target.value })}
                      className="field mt-2 h-auto resize-y py-2.5 text-sm leading-7"
                    />
                    <button
                      type="button" onClick={() => removeFaq(i)} aria-label="حذف پرسش"
                      className="absolute left-2 top-2 grid size-8 place-items-center rounded-lg text-ink-400 hover:bg-berry-100 hover:text-berry-600"
                    >
                      <FiX size={15} />
                    </button>
                  </div>
                ))}
              </div>
              {(form.faqs?.length || 0) < MAX_FAQS && (
                <button type="button" onClick={addFaq} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-moss-700 hover:text-moss-900">
                  <FiPlus size={15} /> افزودن پرسش
                </button>
              )}
            </div>
          </section>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(target)} onClose={() => setTarget(null)} onConfirm={remove} loading={busy}
        title="حذف دسته‌بندی"
        description={`«${target?.name}» حذف می‌شود. اگر محصولی (فعال یا غیرفعال) داخل آن باشد، حذف انجام نمی‌شود.`}
        confirmText="حذف کن"
      />
    </>
  );
}
