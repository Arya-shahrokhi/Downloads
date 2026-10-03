import Input from '../../components/ui/Input.jsx';
import { siteUrl } from '../../components/common/Seo.jsx';
import { toFa } from '../../utils/format.js';

const TITLE_IDEAL = 65;   // same limits the shared builders truncate to
const DESC_IDEAL = 158;

const Counter = ({ value = '', ideal, max }) => {
  const n = value.length;
  const tone = n === 0 ? 'text-ink-300' : n > max ? 'text-berry-600' : n > ideal ? 'text-saffron-700' : 'text-moss-700';
  return <span className={`num text-2xs ${tone}`}>{toFa(n)} / {toFa(ideal)}</span>;
};

/**
 * SEO panel shared by the product and category admin forms.
 * Empty fields = automatic values (the preview shows exactly what will be used).
 * The backend normalises the slug to clean ASCII and records a 301 from the old URL.
 */
export default function SeoFields({
  value, onChange, pathPrefix, currentSlug, previewTitle, previewDescription, errors = {},
}) {
  const slugPreview = (value.slug || currentSlug || '').trim().toLowerCase().replace(/\s+/g, '-') || '…';
  const host = siteUrl().replace(/^https?:\/\//, '');
  const slugChanged = currentSlug && value.slug && value.slug.trim().toLowerCase() !== currentSlug;

  return (
    <section className="rounded-2xl border hairline bg-bone-50 p-5 sm:p-6">
      <h2 className="text-base font-bold">سئو و نشانی صفحه</h2>
      <p className="mt-1.5 text-xs leading-6 text-ink-400">همه‌ی فیلدها اختیاری‌اند؛ اگر خالی بمانند مقدار خودکار استفاده می‌شود.</p>

      <div className="mt-5 grid gap-4">
        <Input
          label="نامک (slug)"
          dir="ltr"
          placeholder={currentSlug || 'gol-gavzaban'}
          value={value.slug || ''}
          error={errors.slug}
          maxLength={100}
          hint={slugChanged
            ? 'نشانی قبلی به‌طور خودکار با ریدایرکت ۳۰۱ به نشانی جدید منتقل می‌شود.'
            : 'حروف انگلیسی کوچک، عدد و خط تیره. متن فارسی خودکار به لاتین تبدیل می‌شود.'}
          onChange={(e) => onChange({ slug: e.target.value })}
        />

        <div>
          <div className="flex items-end justify-between gap-2">
            <label className="label" htmlFor="seo-title">عنوان سئو</label>
            <Counter value={value.seoTitle} ideal={TITLE_IDEAL} max={90} />
          </div>
          <input
            id="seo-title" maxLength={90} value={value.seoTitle || ''} placeholder={previewTitle}
            onChange={(e) => onChange({ seoTitle: e.target.value })}
            className={`field ${errors.seoTitle ? 'field-error' : ''}`}
          />
          {errors.seoTitle && <p className="mt-1.5 text-xs text-berry-600">{errors.seoTitle}</p>}
        </div>

        <div>
          <div className="flex items-end justify-between gap-2">
            <label className="label" htmlFor="seo-desc">توضیح متا</label>
            <Counter value={value.seoDescription} ideal={DESC_IDEAL} max={200} />
          </div>
          <textarea
            id="seo-desc" rows={3} maxLength={200} value={value.seoDescription || ''} placeholder={previewDescription}
            onChange={(e) => onChange({ seoDescription: e.target.value })}
            className={`field h-auto resize-none py-3 leading-7 ${errors.seoDescription ? 'field-error' : ''}`}
          />
          {errors.seoDescription && <p className="mt-1.5 text-xs text-berry-600">{errors.seoDescription}</p>}
        </div>

        {/* پیش‌نمایش نتیجه‌ی گوگل */}
        <div className="rounded-xl border hairline bg-white p-4" aria-label="پیش‌نمایش نتیجه جست‌وجو">
          <p className="truncate text-2xs text-ink-400" dir="ltr">{host}{pathPrefix}{slugPreview}</p>
          <p className="mt-1 line-clamp-1 text-[0.95rem] font-medium text-[#1a0dab]">{previewTitle}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-6 text-ink-500">{previewDescription}</p>
        </div>
      </div>
    </section>
  );
}
