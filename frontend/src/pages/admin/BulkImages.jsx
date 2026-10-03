import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAlertTriangle, FiArrowRight, FiCheckCircle, FiFolder, FiImage, FiRefreshCw, FiTrash2, FiUploadCloud, FiXCircle,
} from 'react-icons/fi';
import Button from '../../components/ui/Button.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import SmartImage from '../../components/ui/SmartImage.jsx';
import Seo from '../../components/common/Seo.jsx';
import { adminApi } from '../../services/endpoints.js';
import { useToast } from '../../context/ToastContext.jsx';
import { toEn, toFa } from '../../utils/format.js';

const CHUNK = 10; // سرور حداکثر ۲۰ فایل در هر درخواست می‌پذیرد
const MAX_SIDE = 1200;
const ACCEPT = '.jpg,.jpeg,.png,.webp,.avif';

/** یکسان‌سازی متن فارسی برای مقایسه نام فایل با نام محصول. */
const norm = (s) => toEn(String(s || ''))
  .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/ة/g, 'ه').replace(/[أإآ]/g, 'ا')
  .replace(/[\u064B-\u0652\u200c\u200d\u200e\u200f]/g, '')
  .replace(/[\s_\-.()،,]+/g, '')
  .toLowerCase();

const baseName = (filename) => filename
  .replace(/\.[^.]+$/, '')
  .replace(/[-_ ](300|500|800|1200)$/, '')
  .replace(/\s*\(\d+\)$/, '')
  .trim();

/** تطبیق خودکار: ۱) کد محصول  ۲) نام یا slug دقیق  ۳) نام محصول داخل نام فایل */
function autoMatch(filename, products) {
  const raw = toEn(baseName(filename));
  const code = raw.match(/^(?:p|product|kod|کد)?[\s_-]*0*(\d{1,4})(?:[\s_-]|$)/i);
  if (code) {
    const n = Number(code[1]);
    const hit = products.find((p) => p.productNumber === n);
    if (hit) return { productId: hit._id, how: 'code' };
  }
  const key = norm(raw);
  const exact = products.find((p) => norm(p.name) === key || norm(p.slug) === key);
  if (exact) return { productId: exact._id, how: 'name' };
  let best = null;
  for (const p of products) {
    const n = norm(p.name);
    if (n.length >= 3 && key.includes(n) && (!best || n.length > norm(best.name).length)) best = p;
  }
  if (best) return { productId: best._id, how: 'fuzzy' };
  return { productId: '', how: 'none' };
}

/** کوچک‌سازی و تبدیل به WebP در مرورگر تا آپلود سریع و سبک باشد. */
async function optimize(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', 0.86));
    if (!blob || (scale === 1 && blob.size >= file.size)) return file;
    return new File([blob], `${baseName(file.name)}.webp`, { type: 'image/webp' });
  } catch {
    return file;
  }
}

const HOW = {
  code: { label: 'با کد', cls: 'bg-moss-100 text-moss-700' },
  name: { label: 'با نام', cls: 'bg-moss-100 text-moss-700' },
  fuzzy: { label: 'حدسی، بررسی کنید', cls: 'bg-saffron-100 text-saffron-700' },
  manual: { label: 'دستی', cls: 'bg-bone-200 text-ink-700' },
  none: { label: 'پیدا نشد', cls: 'bg-berry-100 text-berry-600' },
};

const kb = (n) => `${toFa(Math.max(1, Math.round(n / 1024)))} KB`;

export default function BulkImages() {
  const toast = useToast();
  const [products, setProducts] = useState(null);
  const [rows, setRows] = useState([]);
  const [mode, setMode] = useState('replace');
  const [shrink, setShrink] = useState(true);
  const [filter, setFilter] = useState('all');
  const [drag, setDrag] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);
  const folderRef = useRef(null);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const loadIndex = () => adminApi.imageIndex()
    .then(({ data }) => setProducts(data.products))
    .catch((err) => { toast.error(err.message); setProducts([]); });

  useEffect(() => { loadIndex(); }, []);
  useEffect(() => () => rowsRef.current.forEach((r) => URL.revokeObjectURL(r.preview)), []);

  const byId = useMemo(() => new Map((products || []).map((p) => [p._id, p])), [products]);

  const addFiles = (list) => {
    if (!products) return;
    const files = Array.from(list || []).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f.name));
    if (!files.length) { toast.error('فایل تصویری معتبری انتخاب نشد'); return; }
    setRows((prev) => {
      const taken = new Set(prev.map((r) => r.productId).filter(Boolean));
      const next = files.map((file, i) => {
        const m = autoMatch(file.name, products);
        // اگر محصول قبلاً تصویر گرفته، دوباره خودکار انتخاب نشود
        if (m.productId && taken.has(m.productId)) { m.productId = ''; m.how = 'none'; }
        if (m.productId) taken.add(m.productId);
        return {
          key: `${Date.now()}-${i}-${file.name}`, file, preview: URL.createObjectURL(file),
          productId: m.productId, how: m.how, status: 'idle', error: '',
        };
      });
      return [...prev, ...next];
    });
  };

  const update = (key, patch) => setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const remove = (key) => setRows((prev) => {
    const r = prev.find((x) => x.key === key);
    if (r) URL.revokeObjectURL(r.preview);
    return prev.filter((x) => x.key !== key);
  });
  const clearAll = () => { rows.forEach((r) => URL.revokeObjectURL(r.preview)); setRows([]); setProgress(0); };
  const clearDone = () => setRows((prev) => prev.filter((r) => { if (r.status === 'done') URL.revokeObjectURL(r.preview); return r.status !== 'done'; }));

  const counts = useMemo(() => {
    const ids = rows.map((r) => r.productId).filter(Boolean);
    const dupIds = new Set(ids.filter((id, i) => ids.indexOf(id) !== i));
    return {
      total: rows.length,
      matched: rows.filter((r) => r.productId).length,
      unmatched: rows.filter((r) => !r.productId).length,
      fuzzy: rows.filter((r) => r.how === 'fuzzy').length,
      dupIds,
      ready: rows.filter((r) => r.productId && !dupIds.has(r.productId) && r.status !== 'done'),
      done: rows.filter((r) => r.status === 'done').length,
      failed: rows.filter((r) => r.status === 'error').length,
    };
  }, [rows]);

  const visible = rows.filter((r) => {
    if (filter === 'unmatched') return !r.productId;
    if (filter === 'check') return r.how === 'fuzzy' || counts.dupIds.has(r.productId);
    if (filter === 'error') return r.status === 'error';
    return true;
  });

  const run = async () => {
    setConfirm(false);
    setRunning(true);
    setProgress(0);
    const queue = counts.ready;
    let finished = 0;
    for (let i = 0; i < queue.length; i += CHUNK) {
      const batch = queue.slice(i, i + CHUNK);
      batch.forEach((r) => update(r.key, { status: 'uploading', error: '' }));
      try {
        const fd = new FormData();
        const files = shrink ? await Promise.all(batch.map((r) => optimize(r.file))) : batch.map((r) => r.file);
        files.forEach((f) => fd.append('images', f));
        fd.append('map', JSON.stringify(batch.map((r) => r.productId)));
        fd.append('mode', mode);
        const { data } = await adminApi.bulkImages(fd);
        data.results.forEach((res, j) => {
          const r = batch[j];
          update(r.key, res.ok ? { status: 'done', newUrl: res.url } : { status: 'error', error: res.error });
        });
      } catch (err) {
        batch.forEach((r) => update(r.key, { status: 'error', error: err.message }));
      }
      finished += batch.length;
      setProgress(Math.round((finished / queue.length) * 100));
    }
    setRunning(false);
    await loadIndex();
    const failed = rowsRef.current.filter((r) => r.status === 'error').length;
    if (failed) toast.error(`${toFa(failed)} تصویر با خطا مواجه شد؛ ردیف‌های قرمز را بررسی کنید`);
    else toast.success('همه تصاویر جایگزین شدند');
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <>
      <Seo title="تعویض فله‌ای تصاویر محصولات" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin/products" className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-moss-700">
            <FiArrowRight size={14} /> بازگشت به محصولات
          </Link>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">تعویض فله‌ای تصاویر</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-7 text-ink-500">
            تصاویر را یکجا بکشید و رها کنید. اگر نام فایل <b className="num">کد محصول</b> (مثل <span className="num" dir="ltr">012.jpg</span>)
            یا <b>نام دقیق محصول</b> (مثل «عرق نعناع.webp») باشد، خودکار به محصول وصل می‌شود؛ بقیه را از فهرست انتخاب کنید.
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`mt-6 grid place-items-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          drag ? 'border-moss-500 bg-moss-50' : 'border-bone-300 bg-bone-50'
        }`}
      >
        <FiUploadCloud size={34} className="text-moss-600" />
        <p className="mt-3 text-sm font-semibold">تصاویر را اینجا رها کنید</p>
        <p className="mt-1 text-xs text-ink-400">JPG، PNG، WEBP یا AVIF · بدون محدودیت تعداد</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button size="sm" icon={FiImage} disabled={!products} onClick={() => fileRef.current?.click()}>انتخاب تصاویر</Button>
          <Button size="sm" variant="outline" icon={FiFolder} disabled={!products} onClick={() => folderRef.current?.click()}>انتخاب پوشه</Button>
        </div>
        <input ref={fileRef} type="file" accept={ACCEPT} multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
        <input ref={folderRef} type="file" webkitdirectory="" directory="" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
        {!products && <p className="mt-3 text-xs text-ink-400">در حال بارگذاری فهرست محصولات…</p>}
      </div>

      {rows.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
            {[
              ['all', `همه ${toFa(counts.total)}`],
              ['unmatched', `بدون محصول ${toFa(counts.unmatched)}`],
              ['check', `نیاز به بررسی ${toFa(counts.fuzzy + counts.dupIds.size)}`],
              ['error', `خطا ${toFa(counts.failed)}`],
            ].map(([k, label]) => (
              <button
                key={k} type="button" onClick={() => setFilter(k)}
                className={`num rounded-full px-3 py-1.5 font-medium transition-colors ${filter === k ? 'bg-ink-900 text-bone-50' : 'bg-bone-50 text-ink-500 hover:bg-bone-200'}`}
              >{label}</button>
            ))}
            <span className="grow" />
            {counts.done > 0 && <Button size="sm" variant="ghost" onClick={clearDone}>پاک کردن انجام‌شده‌ها</Button>}
            <Button size="sm" variant="ghost" icon={FiTrash2} onClick={clearAll} disabled={running}>پاک کردن همه</Button>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border hairline bg-bone-50">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-sm">
                <thead className="bg-bone-100 text-2xs uppercase tracking-wide text-ink-400">
                  <tr>
                    {['تصویر جدید', 'فایل', 'محصول مقصد', 'تصویر فعلی', 'وضعیت', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-right font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y hairline">
                  {visible.map((r) => {
                    const p = byId.get(r.productId);
                    const dup = r.productId && counts.dupIds.has(r.productId);
                    const how = HOW[r.how] || HOW.none;
                    return (
                      <tr key={r.key} className={r.status === 'error' ? 'bg-berry-100/40' : r.status === 'done' ? 'bg-moss-50/50' : ''}>
                        <td className="px-4 py-3"><img src={r.preview} alt="" className="size-14 rounded-lg object-cover" /></td>
                        <td className="px-4 py-3">
                          <p className="max-w-[12rem] truncate font-medium" dir="auto" title={r.file.name}>{r.file.name}</p>
                          <p className="num mt-0.5 text-2xs text-ink-400">{kb(r.file.size)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={r.productId}
                            disabled={running || r.status === 'done'}
                            onChange={(e) => update(r.key, { productId: e.target.value, how: e.target.value ? 'manual' : 'none', status: 'idle', error: '' })}
                            className={`field h-10 max-w-[17rem] text-sm ${dup || !r.productId ? 'field-error' : ''}`}
                          >
                            <option value="">— انتخاب محصول —</option>
                            {(products || []).map((x) => (
                              <option key={x._id} value={x._id}>
                                {x.productNumber ? `${toFa(String(x.productNumber).padStart(3, '0'))} · ` : ''}{x.name}
                              </option>
                            ))}
                          </select>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <span className={`rounded-full px-2 py-0.5 text-2xs font-semibold ${how.cls}`}>{how.label}</span>
                            {dup && <span className="rounded-full bg-berry-100 px-2 py-0.5 text-2xs font-semibold text-berry-600">تکراری</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {p ? (
                            <SmartImage
                              src={r.status === 'done' ? r.newUrl : p.image} alt="" loading="lazy"
                              className="size-14 rounded-lg object-cover opacity-80" fallbackLabel="بدون تصویر"
                            />
                          ) : <span className="text-ink-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {r.status === 'done' && <span className="inline-flex items-center gap-1 font-semibold text-moss-700"><FiCheckCircle /> جایگزین شد</span>}
                          {r.status === 'uploading' && <span className="inline-flex items-center gap-1 text-ink-500"><FiRefreshCw className="animate-spin" /> در حال ارسال</span>}
                          {r.status === 'error' && <span className="inline-flex items-start gap-1 text-berry-600"><FiXCircle className="mt-0.5 shrink-0" /> {r.error}</span>}
                          {r.status === 'idle' && (r.productId && !dup
                            ? <span className="text-ink-500">آماده</span>
                            : <span className="inline-flex items-center gap-1 text-saffron-700"><FiAlertTriangle /> {dup ? 'یک محصول، دو تصویر' : 'محصول را انتخاب کنید'}</span>)}
                        </td>
                        <td className="px-4 py-3">
                          <button type="button" onClick={() => remove(r.key)} disabled={running} aria-label="حذف ردیف" className="rounded-lg p-2 text-ink-300 hover:bg-berry-100 hover:text-berry-600">
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sticky bottom-0 mt-4 flex flex-wrap items-center gap-4 rounded-2xl border hairline bg-bone-50/95 p-4 backdrop-blur">
            <fieldset className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" name="mode" checked={mode === 'replace'} onChange={() => setMode('replace')} />
                جایگزینی کامل (فقط تصویر جدید)
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="mode" checked={mode === 'primary'} onChange={() => setMode('primary')} />
                تصویر اصلی شود، بقیه بمانند
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={shrink} onChange={(e) => setShrink(e.target.checked)} />
                بهینه‌سازی (حداکثر ۱۲۰۰px، WebP)
              </label>
            </fieldset>
            <span className="grow" />
            {running && (
              <div className="flex w-40 items-center gap-2">
                <div className="h-2 grow overflow-hidden rounded-full bg-bone-200">
                  <div className="h-full bg-moss-600 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="num text-xs text-ink-500">{toFa(progress)}٪</span>
              </div>
            )}
            <Button icon={FiUploadCloud} loading={running} disabled={!counts.ready.length || running} onClick={() => setConfirm(true)}>
              {`اعمال روی ${toFa(counts.ready.length)} محصول`}
            </Button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={run}
        danger={mode === 'replace'}
        title="تعویض تصاویر"
        confirmText="بله، جایگزین کن"
        description={`تصویر ${toFa(counts.ready.length)} محصول ${mode === 'replace' ? 'به‌طور کامل جایگزین می‌شود و تصاویر قبلی از محصول حذف می‌شوند' : 'به‌عنوان تصویر اصلی اضافه می‌شود و تصاویر قبلی باقی می‌مانند'}.${counts.unmatched ? ` ${toFa(counts.unmatched)} فایل بدون محصول نادیده گرفته می‌شود.` : ''}`}
      />
    </>
  );
}
