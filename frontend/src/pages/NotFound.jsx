import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Seo, { siteUrl } from '../components/common/Seo.jsx';
import { buildNotFoundSeo } from '@shared/seo/index.js';
import { toFa } from '../utils/format.js';

/**
 * Shared 404 / 410 page.
 *
 * Also rendered *inside* dynamic routes (missing product, category or article)
 * so visitors see the same page the server's 404/410 status describes, instead
 * of a generic error box. Always `noindex, follow`, no canonical.
 */
export default function NotFound({ gone = false }) {
  return (
    <>
      <Seo seo={buildNotFoundSeo({ siteUrl: siteUrl(), gone })} canonical="" />
      <div className="wrap grid min-h-[70dvh] place-items-center py-16 text-center">
        <div>
          <p className="num text-[clamp(4rem,18vw,9rem)] font-extrabold leading-none text-moss-100">{toFa(gone ? 410 : 404)}</p>
          <h1 className="-mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {gone ? 'این کالا دیگر عرضه نمی‌شود' : 'این قفسه خالی است'}
          </h1>
          <p className="mx-auto mt-4 max-w-[44ch] text-sm leading-8 text-ink-500">
            {gone
              ? 'این محصول از فروشگاه حذف شده است. جایگزین‌های مشابه را در فهرست محصولات ببینید.'
              : 'صفحه‌ای که دنبالش بودید جابه‌جا شده یا هرگز وجود نداشته. از فهرست محصولات شروع کنید.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="btn-primary btn-md">مشاهده محصولات <FiArrowLeft size={17} /></Link>
            <Link to="/" className="btn-outline btn-md">صفحه اصلی</Link>
          </div>
        </div>
      </div>
    </>
  );
}
