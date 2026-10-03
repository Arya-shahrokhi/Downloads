import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiActivity, FiArrowLeft, FiArrowRight, FiBookOpen, FiClock, FiSearch, FiShield } from 'react-icons/fi';
import Seo, { siteUrl } from '../components/common/Seo.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { SkeletonBlock } from '../components/ui/Skeleton.jsx';
import NotFound from './NotFound.jsx';
import { useArticle, useArticles } from '../hooks/useArticles.js';
import { buildArticleSeo, buildStaticSeo } from '@shared/seo/index.js';
import { findCategoryContent } from '@shared/seo/categoryContent.js';
import SmartImage from '../components/ui/SmartImage.jsx';
import { useReveal } from '../hooks/index.js';
import { faDate, toFa } from '../utils/format.js';

/**
 * مجله: مقاله‌های ثابت (shared/content/journal.js) + مقاله‌هایی که در پنل ادمین
 * نوشته می‌شوند (MongoDB) با هم ادغام می‌شوند؛ hooks/useArticles.js.
 * مقاله‌ی دیتابیس با slug یکسان، نسخه‌ی ثابت را جایگزین می‌کند (همان قاعده‌ی sitemap).
 */


const ALL = 'همه';

const HEALTH_FACTS = [
  {
    icon: FiActivity,
    eyebrow: 'زنجبیل',
    title: 'برای تهوع، شواهد امیدوارکننده است؛ نه معجزه',
    text: 'مرورهای پژوهشی، اثر احتمالی زنجبیل را روی بعضی انواع تهوع نشان می‌دهند، اما نتیجه به نوع مصرف و شرایط فرد بستگی دارد.',
    source: 'NCCIH',
    href: 'https://www.nccih.nih.gov/health/ginger',
  },
  {
    icon: FiBookOpen,
    eyebrow: 'بابونه',
    title: 'یک فنجان معمولی با مکمل غلیظ یکی نیست',
    text: 'بابونه در مقدارهای رایج غذایی و چای معمولاً قابل‌تحمل است؛ درباره مکمل‌ها و مصرف طولانی‌مدت، احتیاط و مشورت مهم‌تر می‌شود.',
    source: 'NCCIH',
    href: 'https://www.nccih.nih.gov/health/chamomile',
  },
  {
    icon: FiShield,
    eyebrow: 'ایمنی',
    title: 'طبیعی بودن، به‌معنای بی‌خطر بودن نیست',
    text: 'گیاهان می‌توانند با داروها تداخل داشته باشند. در بارداری، بیماری زمینه‌ای یا مصرف داروی منظم، قبل از مصرف درمانی سؤال کنید.',
    source: 'راهنمای ایمنی',
    href: 'https://www.nccih.nih.gov/health/herbsataglance',
  },
];

function HealthFacts() {
  return (
    <section className="journal-facts mt-16 overflow-hidden rounded-[2rem] bg-moss-900 text-bone-50 sm:mt-20" aria-labelledby="health-facts-title">
      <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[.7fr_1.3fr] lg:p-12">
        <div className="journal-facts__pattern absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <p className="text-2xs font-bold tracking-[.18em] text-saffron-300">دانستنی‌های سلامت</p>
          <h2 id="health-facts-title" className="mt-3 max-w-[12ch] text-3xl font-black leading-[1.35] sm:text-4xl">فکت‌های کوتاه، ادعاهای کمتر</h2>
          <p className="mt-5 max-w-[36ch] text-sm leading-8 text-bone-200/75">
            هر نکته را با منبع معتبر و زبان ساده می‌خوانیم. این‌ها اطلاعات عمومی‌اند، نه نسخه درمانی.
          </p>
          <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-bone-50/15 bg-bone-50/10 px-3 py-2 text-2xs text-bone-100/80">
            <FiShield size={13} /> منبع‌محور و محتاط
          </span>
        </div>
        <div className="relative grid gap-3 sm:grid-cols-3">
          {HEALTH_FACTS.map(({ icon: Icon, eyebrow, title, text, source, href }) => (
            <article key={title} className="journal-fact rounded-2xl border border-bone-50/12 bg-bone-50/[.07] p-5">
              <Icon size={20} className="text-saffron-300" aria-hidden="true" />
              <p className="mt-7 text-2xs font-bold tracking-[.12em] text-saffron-200">{eyebrow}</p>
              <h3 className="mt-2 text-base font-extrabold leading-7">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-bone-200/70">{text}</p>
              <a href={href} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-2xs font-bold text-saffron-200 hover:text-bone-50">
                منبع: {source} <FiArrowLeft size={12} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** کارت مقاله با ظاهر شدن تدریجی هنگام ورود به دید. */
function ArticleCard({ article, featured = false }) {
  const [ref, visible] = useReveal();

  return (
    <article
      ref={ref}
      className={`group transition-[opacity,transform] duration-700 ease-expo ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      } ${featured ? 'md:col-span-2 md:grid md:grid-cols-2 md:items-center md:gap-8' : ''}`}
    >
      <Link to={`/journal/${article.slug}`} className="block overflow-hidden rounded-2xl bg-bone-100">
        <SmartImage
          src={article.image}
          alt=""
          loading="lazy"
          decoding="async"
          width="900" height="560"
          sizes={featured ? '(max-width: 768px) 92vw, 46vw' : '(max-width: 768px) 92vw, 30vw'}
          className={`w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105 ${featured ? 'aspect-[16/11]' : 'aspect-[16/10]'}`}
          fallbackLabel=""
        />
      </Link>

      <div className={featured ? 'mt-5 md:mt-0' : 'mt-4'}>
        <div className="flex items-center gap-2 text-2xs text-ink-400">
          <span className="font-semibold text-moss-600">{article.tag}</span>
          <span>·</span>
          <span className="num flex items-center gap-1"><FiClock size={11} />{toFa(article.minutes)} دقیقه</span>
          <span>·</span>
          {article.date && <span className="num">{faDate(article.date)}</span>}
        </div>
        <h3 className={`mt-2 font-bold leading-7 ${featured ? 'text-xl sm:text-2xl' : 'text-[1.05rem]'}`}>
          <Link to={`/journal/${article.slug}`} className="hover:text-moss-700">{article.title}</Link>
        </h3>
        <p className={`mt-2 leading-7 text-ink-500 ${featured ? 'text-[0.95rem]' : 'text-sm'}`}>{article.excerpt}</p>
        <Link
          to={`/journal/${article.slug}`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-moss-700 transition-colors hover:text-moss-900"
        >
          خواندن مقاله
          <FiArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

/** نمای یک مقاله. */
function ArticleView({ article, articles }) {
  const index = articles.findIndex((a) => a.slug === article.slug);
  const next = articles.length > 1 ? articles[(index + 1) % articles.length] : null;
  const related = article.relatedCategory ? findCategoryContent({ slug: article.relatedCategory }) : null;

  return (
    <>
      {/* Article + BreadcrumbList JSON-LD from the same shared builder the server uses */}
      <Seo seo={buildArticleSeo(article, { siteUrl: siteUrl() })} />

      <div className="border-b hairline bg-bone-100">
        <div className="wrap max-w-[74ch] py-10 sm:py-14">
          <nav className="mb-4 flex min-w-0 items-center gap-2 overflow-hidden text-2xs text-ink-400" aria-label="مسیر">
            <Link to="/" className="hover:text-moss-700">خانه</Link>
            <span>/</span>
            <Link to="/journal" className="hover:text-moss-700">مجله گیاهان</Link>
            <span>/</span>
            <span className="truncate text-ink-700">{article.tag}</span>
          </nav>

          <h1 className="text-[clamp(1.6rem,4.5vw,2.5rem)] font-extrabold leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-ink-400">
            <span className="chip bg-moss-100 text-moss-900">{article.tag}</span>
            <span className="num flex items-center gap-1.5"><FiClock size={13} />{toFa(article.minutes)} دقیقه مطالعه</span>
            {article.date && <span className="num">{faDate(article.date)}</span>}
          </div>
        </div>
      </div>

      <div className="wrap max-w-[74ch] py-10">
        <SmartImage
          src={article.image}
          alt=""
          width="900" height="500"
          sizes="(max-width: 1024px) 92vw, 74ch"
          className="aspect-[16/9] w-full rounded-2xl object-cover"
          fallbackLabel=""
        />

        <div className="mt-9">
          <p className="border-r-2 border-moss-300 pr-5 text-lg font-medium leading-9 text-ink-700">
            {article.excerpt}
          </p>
          {(article.body || []).map((p, i) => (
            <p key={i} className="mt-6 text-[0.98rem] leading-9 text-ink-700">{p}</p>
          ))}
        </div>

        {related && (
          <Link
            to={`/category/${related.slug}`}
            className="mt-10 flex items-center justify-between gap-4 rounded-2xl border hairline bg-moss-50 p-5 text-sm font-semibold text-moss-900 transition-colors hover:bg-moss-100"
          >
            <span>مشاهده و خرید {related.names?.[0] || 'محصولات مرتبط'} در کالاوران</span>
            <FiArrowLeft size={16} className="shrink-0" />
          </Link>
        )}

        <p className="mt-10 rounded-2xl bg-saffron-50 p-5 text-sm leading-7 text-ink-700">
          این نوشته تجربه‌ی عطاری است، نه توصیه‌ی پزشکی. برای شرایط خاص، بارداری یا
          مصرف همزمان دارو، با پزشک مشورت کنید.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t hairline pt-7">
          <Link to="/journal" className="btn-outline btn-sm gap-2">
            <FiArrowRight size={15} /> همه‌ی مقاله‌ها
          </Link>
{next && (
          <Link to={`/journal/${next.slug}`} className="group max-w-[26rem] text-left">
              <span className="block text-2xs text-ink-400">مقاله‌ی بعدی</span>
              <span className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-moss-700 group-hover:text-moss-900">
                {next.title}
                <FiArrowLeft size={15} className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

function ArticleRoute({ slug, articles }) {
  const { article, status } = useArticle(slug);
  if (status === 'notfound') return <NotFound />; // server answers 404 for this URL too
  if (status === 'error') {
    return (
      <div className="wrap py-20">
        <EmptyState icon={FiSearch} title="مقاله بارگذاری نشد" description="اتصال را بررسی کنید و دوباره تلاش کنید." action="همه‌ی مقاله‌ها" to="/journal" />
      </div>
    );
  }
  if (!article) {
    return (
      <div className="wrap max-w-[74ch] space-y-4 py-14">
        <SkeletonBlock className="h-10 w-3/4" />
        <SkeletonBlock className="h-4 w-40" />
        <SkeletonBlock className="aspect-[16/9] w-full rounded-2xl" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
    );
  }
  return <ArticleView article={article} articles={articles} />;
}

export default function Journal() {
  const { slug } = useParams();
  const [tag, setTag] = useState(ALL);
  const { articles } = useArticles(); // static + admin-written (DB) articles

  const tags = useMemo(() => [ALL, ...Array.from(new Set(articles.map((a) => a.tag).filter(Boolean)))], [articles]);
  const filtered = useMemo(
    () => (tag === ALL ? articles : articles.filter((a) => a.tag === tag)),
    [tag, articles],
  );

  if (slug) return <ArticleRoute key={slug} slug={slug} articles={articles} />;

  return (
    <>
      <Seo seo={buildStaticSeo('/journal', { siteUrl: siteUrl() })} />

      <div className="border-b hairline bg-bone-100">
        <div className="wrap py-12 sm:py-16">
          <p className="text-2xs font-bold uppercase tracking-[0.14em] text-moss-600">مجله گیاهان</p>
          <h1 className="mt-3 text-[clamp(1.7rem,4.5vw,2.6rem)] font-extrabold tracking-tight">
            پیش از خرید، کمی بدانید
          </h1>
          <p className="mt-4 max-w-[56ch] text-base leading-8 text-ink-500">
            چهل سال تجربه‌ی دکان، بدون ادعای درمان. هر نوشته کوتاه است و به یک
            پرسش عملی جواب می‌دهد.
          </p>
        </div>
      </div>

      <div className="wrap py-10">
        {/* فیلتر موضوعی، بدون رفت‌وبرگشت به سرور */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="موضوع مقاله‌ها">
          {tags.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tag === t}
              onClick={() => setTag(t)}
              className={`h-9 rounded-xl px-3.5 text-sm font-medium transition-colors ${
                tag === t ? 'bg-moss-700 text-bone-50' : 'bg-bone-100 text-ink-500 hover:bg-moss-50 hover:text-moss-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-9 grid gap-9 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <ArticleCard key={a.slug} article={a} featured={tag === ALL && i === 0} />
          ))}
        </div>
        <HealthFacts />
      </div>
    </>
  );
}
