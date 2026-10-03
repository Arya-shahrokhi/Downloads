import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowRight, FiSave } from 'react-icons/fi';
import Button from '../../components/ui/Button.jsx';
import Seo from '../../components/common/Seo.jsx';
import { articleApi } from '../../services/endpoints.js';
import { useToast } from '../../context/ToastContext.jsx';

const useSubmit = (onSubmit) => {
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    setBusy(true);
    try { await onSubmit(e); } catch (err) { } finally { setBusy(false); }
  };
  return [submit, busy];
};

export default function ArticleForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const [form, setForm] = useState({
    slug: '', title: '', excerpt: '', body: '', image: '', tag: '', minutes: 5, isPublished: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    articleApi.adminGet(id)
      .then(({ data }) => {
        setForm(prev => ({
          ...prev,
          ...data.article,
          body: Array.isArray(data.article.body) ? data.article.body.join('\n\n') : data.article.body,
        }));
      })
      .catch(err => { toast.error(err.message); navigate('/admin/articles'); })
      .finally(() => setLoading(false));
  }, [id]);

  const [save, saving] = useSubmit(async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.slug.trim()) next.slug = 'شناسه الزامی است';
    if (!form.title.trim()) next.title = 'عنوان الزامی است';
    if (!form.excerpt.trim()) next.excerpt = 'خلاصه الزامی است';
    if (!form.body.trim()) next.body = 'متن الزامی است';
    if (!form.tag.trim()) next.tag = 'تگ الزامی است';
    if (form.minutes < 1) next.minutes = 'مدت حداقل ۱ دقیقه';

    setErrors(next);
    if (Object.keys(next).length) return;

    const body = form.body
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p);

    try {
      if (id) {
        await articleApi.update(id, { ...form, body });
        toast.success('مقاله بروز شد');
      } else {
        await articleApi.create({ ...form, body });
        toast.success('مقاله ایجاد شد');
      }
      navigate('/admin/articles');
    } catch (err) { toast.error(err.message); }
  });

  if (loading) return <div className="py-16 text-center text-ink-400">در حال بارگذاری…</div>;

  return (
    <>
      <Seo title={id ? 'ویرایش مقاله' : 'مقاله جدید'} />
      <div className="mb-6">
        <button onClick={() => navigate('/admin/articles')} className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-moss-700">
          <FiArrowRight size={14} /> بازگشت
        </button>
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">{id ? 'ویرایش مقاله' : 'مقاله جدید'}</h1>
      </div>

      <form onSubmit={save} className="max-w-4xl space-y-5 rounded-2xl border hairline bg-bone-50 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">شناسه (slug)</label>
            <input
              type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="khavas-giahan-daroei" className={`field ${errors.slug ? 'field-error' : ''}`}
              disabled={saving}
            />
            {errors.slug && <p className="mt-1 text-xs text-berry-600">{errors.slug}</p>}
          </div>
          <div>
            <label className="label">تگ</label>
            <input
              type="text" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
              placeholder="گیاه‌شناسی، دمنوش، ادویه" className={`field ${errors.tag ? 'field-error' : ''}`}
              disabled={saving}
            />
            {errors.tag && <p className="mt-1 text-xs text-berry-600">{errors.tag}</p>}
          </div>
        </div>

        <div>
          <label className="label">عنوان</label>
          <input
            type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="خواص گیاهان دارویی…" className={`field ${errors.title ? 'field-error' : ''}`}
            disabled={saving}
          />
          {errors.title && <p className="mt-1 text-xs text-berry-600">{errors.title}</p>}
        </div>

        <div>
          <label className="label">خلاصه</label>
          <textarea
            value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="یک جملهٌ توضیحی…" rows={2} className={`field resize-none ${errors.excerpt ? 'field-error' : ''}`}
            disabled={saving}
          />
          {errors.excerpt && <p className="mt-1 text-xs text-berry-600">{errors.excerpt}</p>}
        </div>

        <div>
          <label className="label">متن مقاله (پاراگراف‌ها را با یک خط خالی جدا کنید)</label>
          <textarea
            value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="متن مقاله…" rows={12} className={`field resize-none font-mono text-sm ${errors.body ? 'field-error' : ''}`}
            disabled={saving}
          />
          {errors.body && <p className="mt-1 text-xs text-berry-600">{errors.body}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label">آدرس تصویر</label>
            <input
              type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/images/products/…" className="field"
              disabled={saving}
            />
          </div>
          <div>
            <label className="label">مدت خواندن (دقیقه)</label>
            <input
              type="number" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: Number(e.target.value) })}
              min="1" max="60" className={`field ${errors.minutes ? 'field-error' : ''}`}
              disabled={saving}
            />
            {errors.minutes && <p className="mt-1 text-xs text-berry-600">{errors.minutes}</p>}
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="rounded" disabled={saving}
              />
              <span className="text-sm">منتشر شده</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button icon={FiSave} loading={saving} type="submit">ذخیره</Button>
          <Button variant="ghost" type="button" onClick={() => navigate('/admin/articles')}>انصراف</Button>
        </div>
      </form>
    </>
  );
}
