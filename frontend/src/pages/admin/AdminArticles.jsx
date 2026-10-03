import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import Button from '../../components/ui/Button.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { RowsSkeleton } from '../../components/ui/Skeleton.jsx';
import Seo from '../../components/common/Seo.jsx';
import { adminApi, articleApi } from '../../services/endpoints.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useDebounced } from '../../hooks/index.js';
import { toFa, faDate } from '../../utils/format.js';

export default function AdminArticles() {
  const toast = useToast();
  const [state, setState] = useState({ articles: null, meta: null });
  const [page, setPage] = useState(1);
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const term = useDebounced(search, 400);

  const status = params.get('status') || undefined;

  const load = () => {
    setState((s) => ({ ...s, articles: null }));
    adminApi.articles({ page, limit: 20, search: term || undefined, status })
      .then(({ data }) => setState({ articles: data.articles, meta: data.meta }))
      .catch(() => setState({ articles: [], meta: null }));
  };

  useEffect(load, [page, term, status]);

  const remove = async () => {
    setBusy(true);
    try {
      await articleApi.remove(target._id);
      toast.success('مقاله حذف شد');
      setTarget(null);
      load();
    } catch (err) { toast.error(err.message); } finally { setBusy(false); }
  };

  const togglePublish = async (a) => {
    try {
      await articleApi.update(a._id, { isPublished: !a.isPublished });
      toast.success(a.isPublished ? 'مقاله پنهان شد' : 'مقاله منتشر شد');
      load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <>
      <Seo title="مدیریت مقالات" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">مجله گیاهان</h1>
          {state.meta && <p className="num mt-1.5 text-sm text-ink-500">{toFa(state.meta.total)} مقاله</p>}
        </div>
        <Button to="/admin/articles/new" icon={FiPlus} size="md">مقاله جدید</Button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <FiSearch className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={17} />
        <input
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="جست‌وجوی عنوان یا محتوا" aria-label="جست‌وجو"
          className="field bg-bone-50 pr-11"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border hairline bg-bone-50">
        {state.articles === null ? (
          <div className="p-5"><RowsSkeleton rows={8} /></div>
        ) : state.articles.length === 0 ? (
          <EmptyState title="مقالهٌ پیدا نشد" description="عبارت جست‌وجو را تغییر دهید یا مقاله جدیدی بسازید." action="مقاله جدید" to="/admin/articles/new" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[50rem] text-sm">
              <thead className="bg-bone-100 text-2xs uppercase tracking-wide text-ink-400">
                <tr>
                  {['عنوان', 'تگ', 'تاریخ', 'وضعیت', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-right font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y hairline">
                {state.articles.map((a) => (
                  <tr key={a._id} className="transition-colors hover:bg-moss-50/40">
                    <td className="px-4 py-3">
                      <Link to={`/admin/articles/${a._id}/edit`} className="max-w-[20rem] line-clamp-1 font-medium hover:text-moss-700">{a.title}</Link>
                    </td>
                    <td className="px-4 py-3 text-2xs text-ink-500">{a.tag}</td>
                    <td className="num px-4 py-3 text-2xs">{faDate(new Date(a.createdAt))}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => togglePublish(a)}
                        className={`rounded-full px-2.5 py-1 text-2xs font-semibold transition-colors ${
                          a.isPublished ? 'bg-moss-100 text-moss-700 hover:bg-moss-200' : 'bg-bone-200 text-ink-500 hover:bg-bone-300'
                        }`}
                      >
                        {a.isPublished ? 'منتشر' : 'پیش‌نویس'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/admin/articles/${a._id}/edit`} aria-label="ویرایش" className="rounded-lg p-2 text-ink-400 hover:bg-moss-100 hover:text-moss-700">
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          type="button" onClick={() => setTarget(a)} aria-label="حذف"
                          className="rounded-lg p-2 text-ink-400 hover:bg-berry-100 hover:text-berry-600"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!target}
        onClose={() => setTarget(null)}
        onConfirm={remove}
        loading={busy}
        danger
        title="حذف مقاله"
        description={`مقاله «${target?.title}» حذف می‌شود و قابل بازیابی نخواهد بود.`}
        confirmText="بله، حذف کن"
      />
    </>
  );
}
