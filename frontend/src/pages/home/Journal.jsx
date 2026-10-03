import { Link } from 'react-router-dom';
import SectionHeader from './SectionHeader.jsx';
import { toFa } from '../../utils/format.js';
import SmartImage from '../../components/ui/SmartImage.jsx';
import { useArticles } from '../../hooks/useArticles.js';
import { FiActivity, FiArrowLeft, FiShield } from 'react-icons/fi';

const TEASER_COUNT = 3;

export default function Journal() {
  // latest articles: static editorial + admin-written, newest first
  const ARTICLES = useArticles().articles.slice(0, TEASER_COUNT);
  return (
    <section className="wrap py-16 sm:py-20">
      <SectionHeader
        eyebrow="مجله گیاهان"
        title="قبل از خرید، بهتر انتخاب کن"
        description="راهنماهای کوتاه و کاربردی برای شناخت بهتر گیاهان، ادویه‌ها و روش مصرفشان."
        to="/journal"
        linkLabel="همه مقاله‌ها"
      />

      <div className="grid gap-8 md:grid-cols-3">
        {ARTICLES.map((a, i) => (
          <article key={a.slug} className={`group ${i === 0 ? 'md:col-span-1' : ''}`}>
            <Link to={`/journal/${a.slug}`} className="block overflow-hidden rounded-2xl bg-bone-100">
              <SmartImage
                src={a.image} alt="" loading="lazy" decoding="async" width="900" height="560"
                sizes="(max-width: 768px) 92vw, 30vw"
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                fallbackLabel=""
              />
            </Link>
            <div className="mt-4 flex items-center gap-2 text-2xs text-ink-400">
              <span className="font-semibold text-moss-600">{a.tag}</span>
              <span>·</span>
              <span className="num">{toFa(a.minutes)} دقیقه مطالعه</span>
            </div>
            <h3 className="mt-2 text-[1.05rem] font-bold leading-7">
              <Link to={`/journal/${a.slug}`} className="hover:text-moss-700">{a.title}</Link>
            </h3>
            <p className="mt-2 text-sm leading-7 text-ink-500">{a.excerpt}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 grid gap-4 rounded-3xl bg-saffron-50 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7">
        <span className="grid size-12 place-items-center rounded-2xl bg-saffron-500 text-ink-900"><FiActivity size={22} /></span>
        <div>
          <p className="text-2xs font-bold tracking-[.14em] text-moss-700">فکت سلامت این هفته</p>
          <p className="mt-1 text-sm leading-7 text-ink-700">زنجبیل ممکن است به کاهش بعضی انواع تهوع کمک کند؛ شواهد یکسان نیست و جای درمان پزشکی را نمی‌گیرد.</p>
        </div>
        <Link to="/health-facts" className="inline-flex items-center gap-2 text-sm font-bold text-moss-700 hover:text-moss-900">جست‌وجوی فکت‌ها <FiArrowLeft size={16} /></Link>
      </div>
      <div className="mt-5 flex items-center gap-2 text-2xs text-ink-400"><FiShield size={13} /> مطالب سلامت با نگاه احتیاطی و منبع‌محور نوشته می‌شوند.</div>
    </section>
  );
}
