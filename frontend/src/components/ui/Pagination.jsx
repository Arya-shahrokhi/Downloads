import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toFa } from '../../utils/format.js';

const window5 = (page, pages) => {
  const list = [];
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  for (let i = start; i < start + 5 && i <= pages; i++) list.push(i);
  return list;
};

const NAV_CLS = 'grid size-9 shrink-0 place-items-center sm:size-10 rounded-lg text-ink-500 transition-colors hover:bg-moss-50 hover:text-moss-700';
const DISABLED_CLS = 'grid size-9 shrink-0 place-items-center sm:size-10 rounded-lg text-ink-500 opacity-35';
const numCls = (active) => `num grid size-9 shrink-0 place-items-center rounded-lg sm:size-10 text-sm font-medium transition-colors duration-150 ${
  active ? 'bg-moss-700 text-bone-50' : 'text-ink-500 hover:bg-moss-50 hover:text-moss-700'
}`;

/**
 * Pagination.
 *
 * Public listings pass `hrefFor(page)`: every page is then a real <a href>
 * (rendered via <Link>), so crawlers can discover page 2, 3, … and users can
 * open pages in a new tab. Client-side navigation still happens without a
 * reload; `onChange` (optional) runs after the click, e.g. to scroll.
 *
 * Admin/account tables keep the old button mode (only `onChange`), since
 * those pages are private and their page state is local.
 */
export default function Pagination({ page = 1, pages = 1, onChange, hrefFor }) {
  if (pages <= 1) return null;
  const items = window5(page, pages);
  const linkMode = typeof hrefFor === 'function';

  // Plain render helpers (not components) so nothing remounts between renders.
  const item = (target, className, children, extra = {}) => (linkMode ? (
    <Link key={target} to={hrefFor(target)} onClick={() => onChange?.(target)} className={className} {...extra}>
      {children}
    </Link>
  ) : (
    <button key={target} type="button" onClick={() => onChange?.(target)} className={className} {...extra}>{children}</button>
  ));

  const arrow = (target, disabled, label, rel, children) => (disabled
    ? <span className={DISABLED_CLS} aria-label={label} aria-disabled="true">{children}</span>
    : item(target, NAV_CLS, children, { 'aria-label': label, ...(linkMode ? { rel } : {}) }));

  return (
    <nav className="flex max-w-full items-center justify-center gap-1 overflow-x-auto pt-10" aria-label="صفحه‌بندی">
      {arrow(page - 1, page === 1, 'صفحه قبل', 'prev', <FiChevronRight size={18} />)}

      {items[0] > 1 && <span className="px-1 text-ink-300 sm:px-2">…</span>}

      {items.map((p) => (p === page
        ? <span key={p} aria-current="page" className={numCls(true)}>{toFa(p)}</span>
        : item(p, numCls(false), toFa(p), { 'aria-label': `صفحه ${toFa(p)}` })
      ))}

      {items.at(-1) < pages && <span className="px-1 text-ink-300 sm:px-2">…</span>}

      {arrow(page + 1, page === pages, 'صفحه بعد', 'next', <FiChevronLeft size={18} />)}
    </nav>
  );
}
