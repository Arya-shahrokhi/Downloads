import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiArrowLeft, FiBookOpen, FiCheck, FiClock, FiSearch, FiShield, FiX } from 'react-icons/fi';
import Seo from '../components/common/Seo.jsx';
import { toFa } from '../utils/format.js';

const FACTS = [
  { id: 1, topic: 'زنجبیل', tag: 'گوارش', icon: FiActivity, title: 'زنجبیل برای بعضی انواع تهوع شواهد امیدوارکننده دارد', summary: 'مرورهای پژوهشی اثر احتمالی زنجبیل را در تهوع بارداری و چند موقعیت دیگر نشان داده‌اند؛ نتیجه برای همه یکسان نیست.', detail: 'NCCIH می‌گوید شواهد درباره انواع تهوع متفاوت است و بیشتر پژوهش‌ها روی مکمل بوده‌اند، نه صرفاً چای یا مقدار غذایی. مصرف خوراکی می‌تواند در بعضی افراد سوزش معده یا ناراحتی گوارشی ایجاد کند.', source: 'NCCIH', href: 'https://www.nccih.nih.gov/health/ginger', time: 3 },
  { id: 2, topic: 'بابونه', tag: 'آرامش', icon: FiBookOpen, title: 'چای بابونه با مکمل غلیظ یک چیز نیست', summary: 'بابونه در مقدارهای رایج چای و غذا معمولاً قابل‌تحمل است؛ درباره دوزهای درمانی و تداخل‌ها باید محتاط بود.', detail: 'حساسیت به گیاهان خانواده کاسنیان، احتمال تداخل با وارفارین و بعضی داروهای آرام‌بخش از نکات ایمنی مهم‌اند. اگر داروی منظم مصرف می‌کنید، قبل از مصرف درمانی مشورت کنید.', source: 'NCCIH', href: 'https://www.nccih.nih.gov/health/chamomile', time: 4 },
  { id: 3, topic: 'ایمنی', tag: 'ایمنی مصرف', icon: FiShield, title: 'طبیعی بودن، به‌معنای بی‌خطر بودن نیست', summary: 'گیاهان هم ماده فعال دارند و می‌توانند با داروها، بارداری یا بیماری‌های زمینه‌ای تداخل داشته باشند.', detail: 'قاعده ساده کالاوران: مصرف غذایی با مصرف درمانی یکی نیست. برای بارداری، شیردهی، بیماری زمینه‌ای یا مصرف داروی منظم، مقدار و نوع گیاه را با پزشک یا داروساز چک کنید.', source: 'NCCIH', href: 'https://www.nccih.nih.gov/health/herbsataglance', time: 3 },
  { id: 4, topic: 'زردچوبه', tag: 'مکمل‌ها', icon: FiShield, title: 'زردچوبه در غذا با مکمل کورکومین فرق دارد', summary: 'ادعاهای مکمل‌ها را نباید مستقیم به مقدار معمول ادویه در غذا تعمیم داد.', detail: 'برخی مکمل‌ها برای افزایش جذب، فلفل سیاه یا پیپرین دارند. این ترکیبات می‌توانند ریسک تداخل و عارضه را تغییر دهند؛ برای مصرف مکملی، برچسب و نظر متخصص مهم است.', source: 'Frontiers in Pharmacology', href: 'https://doi.org/10.3389/fphar.2020.01021', time: 5 },
  { id: 5, topic: 'چای سبز', tag: 'کافئین', icon: FiActivity, title: 'چای سبز هم کافئین دارد', summary: 'برای عصر و شب، مقدار کافئین می‌تواند روی خواب بعضی افراد اثر بگذارد.', detail: 'مقدار کافئین به نوع چای، اندازه برگ و زمان دم‌کشیدن بستگی دارد. اگر به کافئین حساس هستید، مصرف را به نیمه اول روز منتقل کنید و واکنش بدن‌تان را ببینید.', source: 'راهنمای مصرف مسئولانه', href: 'https://www.nccih.nih.gov/health/green-tea', time: 3 },
  { id: 6, topic: 'نگهداری', tag: 'کیفیت', icon: FiCheck, title: 'نور، گرما و رطوبت دشمن گیاه خشک‌اند', summary: 'ظرف دربسته و جای خنک و تاریک، ساده‌ترین کار برای حفظ عطر و کیفیت است.', detail: 'قفسه بالای گاز انتخاب خوبی نیست. اگر رنگ، بو یا بافت گیاه تغییر کرده، به‌جای اعتماد به ظاهر بسته، آن را مصرف نکنید.', source: 'راهنمای نگهداری کالاوران', href: '/journal/negahdari-giah', time: 4 },
  { id: 7, topic: 'نعناع', tag: 'گوارش', icon: FiActivity, title: 'شواهد نعناع بیشتر درباره روغن نعناع است، نه هر فنجان چای', summary: 'مطالعات کوتاه‌مدت، برای روغن نعناع در علائم سندرم روده تحریک‌پذیر سیگنال‌هایی از فایده نشان داده‌اند؛ چای نعناع همان داده را ندارد.', detail: 'مرورهای پژوهشی میان برگ، چای و روغن نعناع تفاوت می‌گذارند. روغن نعناع ممکن است در بعضی افراد سوزش معده یا رفلاکس را بدتر کند و جای درمان تشخیصی گوارشی نیست.', source: 'Alimentary Pharmacology & Therapeutics', href: 'https://doi.org/10.1111/apt.14519', time: 5 },
  { id: 8, topic: 'چای سبز', tag: 'ایمنی مصرف', icon: FiShield, title: 'چای سبز دم‌کرده با عصاره غلیظ یکی نیست', summary: 'مصرف معمول چای سبز عموماً با عصاره‌های پرغلظت مکمل‌ها قابل مقایسه نیست؛ نگرانی اصلی بیشتر درباره مکمل‌های EGCG است.', detail: 'EFSA گزارش کرده دوزهای ۸۰۰ میلی‌گرم EGCG در روز یا بیشتر از طریق مکمل با افزایش آنزیم‌های کبدی همراه بوده‌اند. مکمل را با معده خالی مصرف نکنید و در بیماری کبدی یا مصرف دارو، مشورت کنید.', source: 'EFSA / NCCIH', href: 'https://doi.org/10.2903/j.efsa.2018.5239', time: 5 },
  { id: 9, topic: 'دارچین', tag: 'قند خون', icon: FiBookOpen, title: 'دارچین ممکن است اثر محدود داشته باشد، اما درمان دیابت نیست', summary: 'مرورهای جدید نتایج امیدوارکننده اما ناهمگون گزارش می‌کنند؛ گونه، مقدار و شکل مصرف روی نتیجه اثر دارد.', detail: 'NCCIH می‌گوید شواهد هنوز برای توصیه دارچین به‌عنوان درمان کافی نیست. دارچین در مقدار غذایی معمولاً ایمن است، اما مصرف زیاد و طولانی‌مدت، به‌ویژه از نوع کاسیا، به‌دلیل کومارین برای افراد حساس به کبد مهم است.', source: 'NCCIH', href: 'https://www.nccih.nih.gov/health/cinnamon', time: 4 },
  { id: 10, topic: 'آشواگاندا', tag: 'مکمل‌ها', icon: FiShield, title: 'آشواگاندا برای مصرف کوتاه‌مدت بررسی شده، نه بی‌نهایت', summary: 'NCCIH می‌گوید ایمنی مصرف کوتاه‌مدت تا حدود سه ماه بهتر شناخته شده، اما درباره مصرف طولانی‌مدت داده کافی نداریم.', detail: 'خواب‌آلودگی و ناراحتی گوارشی ممکن است رخ دهد و موارد نادری از آسیب کبدی گزارش شده است. با داروهای تیروئید، فشار خون، دیابت، آرام‌بخش‌ها و داروهای ضدتشنج ممکن است تداخل داشته باشد.', source: 'NCCIH', href: 'https://www.nccih.nih.gov/health/ashwagandha', time: 4 },
];

const TOPICS = ['همه', ...Array.from(new Set(FACTS.map((fact) => fact.tag)))];

export default function HealthFacts() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('همه');
  const [openId, setOpenId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('fa');
    return FACTS.filter((fact) => {
      const matchesTopic = topic === 'همه' || fact.tag === topic;
      const haystack = `${fact.topic} ${fact.title} ${fact.summary} ${fact.detail}`.toLocaleLowerCase('fa');
      return matchesTopic && (!q || haystack.includes(q));
    });
  }, [query, topic]);

  return (
    <>
      <Seo title="جست‌وجوی فکت‌های سلامت" description="فکت‌های کوتاه و منبع‌دار درباره گیاهان، دمنوش‌ها و مصرف مسئولانه." />
      <header className="health-facts-hero relative overflow-hidden bg-moss-900 text-bone-50">
        <div className="health-facts-hero__pattern absolute inset-0" aria-hidden="true" />
        <div className="wrap relative py-14 sm:py-20">
          <Link to="/journal" className="mb-8 inline-flex items-center gap-2 text-xs text-bone-200/70 hover:text-bone-50"><FiArrowLeft size={14} /> بازگشت به مجله</Link>
          <div className="max-w-2xl">
            <p className="text-2xs font-bold tracking-[.18em] text-saffron-300">مرکز فکت‌های سلامت</p>
            <h1 className="mt-4 text-[clamp(2rem,5vw,4rem)] font-black leading-[1.25] tracking-tight">کمتر حدس بزن، بهتر انتخاب کن</h1>
            <p className="mt-5 max-w-[58ch] text-sm leading-8 text-bone-200/75 sm:text-base">فکت‌های کوتاه و قابل جست‌وجو درباره گیاهان و خوراکی‌ها؛ با زبان ساده، منبع روشن و بدون وعده درمان.</p>
          </div>
          <div className="mt-9 max-w-2xl">
            <label className="relative block">
              <FiSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-moss-700" size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="مثلاً زنجبیل، خواب، ایمنی..." className="health-facts-search w-full rounded-2xl border-0 bg-bone-50 py-4 pl-12 pr-12 text-sm text-ink-900 shadow-pop outline-none placeholder:text-ink-400 focus:ring-4 focus:ring-saffron-300/30" aria-label="جست‌وجوی فکت سلامت" />
              {query && <button type="button" onClick={() => setQuery('')} className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-ink-400 hover:bg-bone-100 hover:text-ink-900" aria-label="پاک کردن جست‌وجو"><FiX size={16} /></button>}
            </label>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="فیلتر موضوع">
              {TOPICS.map((item) => <button key={item} type="button" onClick={() => setTopic(item)} className={`rounded-full px-3 py-2 text-2xs font-bold transition-[background-color,color,transform] duration-200 active:scale-95 ${topic === item ? 'bg-saffron-500 text-ink-900' : 'border border-bone-50/20 bg-bone-50/10 text-bone-100 hover:bg-bone-50/20'}`}>{item}</button>)}
            </div>
          </div>
        </div>
      </header>

      <main className="wrap py-10 sm:py-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="text-2xs font-bold tracking-[.14em] text-moss-600">کتابخانه سلامت</p><h2 className="mt-2 text-2xl font-extrabold">فکت‌های قابل استفاده</h2></div>
          <span className="num text-sm text-ink-400">{toFa(filtered.length)} نتیجه</span>
        </div>

        {filtered.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map(({ id, icon: Icon, topic: factTopic, tag, title, summary, detail, source, href, time }) => {
              const expanded = openId === id;
              return (
                <article key={id} className={`health-fact-card rounded-3xl border p-5 sm:p-7 ${expanded ? 'health-fact-card--open border-moss-300 bg-moss-50' : 'hairline bg-bone-50'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-saffron-100 text-moss-800"><Icon size={21} /></span>
                    <span className="chip bg-bone-100 text-ink-500">{tag}</span>
                  </div>
                  <p className="mt-6 text-2xs font-bold tracking-[.12em] text-moss-600">{factTopic}</p>
                  <h3 className="mt-2 text-xl font-extrabold leading-8 text-ink-900">{title}</h3>
                  <p className="mt-3 text-sm leading-8 text-ink-600">{summary}</p>
                  {expanded && <p className="health-fact-card__detail mt-4 border-t hairline pt-4 text-sm leading-8 text-ink-700">{detail}</p>}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <span className="num flex items-center gap-1.5 text-2xs text-ink-400"><FiClock size={12} /> {toFa(time)} دقیقه مطالعه</span>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setOpenId(expanded ? null : id)} className="text-sm font-bold text-moss-700 hover:text-moss-900">{expanded ? 'بستن' : 'جزئیات فکت'}</button>
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="inline-flex items-center gap-1.5 text-2xs font-bold text-ink-400 hover:text-moss-700">منبع <FiArrowLeft size={12} /></a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-bone-100 px-6 py-16 text-center"><FiSearch className="mx-auto text-moss-600" size={28} /><h3 className="mt-4 text-lg font-bold">فکتی با این جست‌وجو پیدا نشد</h3><p className="mt-2 text-sm text-ink-500">موضوع را کوتاه‌تر بنویس یا یکی از فیلترها را امتحان کن.</p></div>
        )}

        <div className="mt-12 rounded-3xl bg-saffron-50 p-6 text-sm leading-8 text-ink-700 sm:p-8"><strong>یادآوری مهم:</strong> این صفحه برای آگاهی عمومی است، نه تشخیص یا درمان. در بارداری، بیماری زمینه‌ای یا مصرف دارو، قبل از مصرف درمانی گیاهان با پزشک یا داروساز مشورت کنید.</div>
      </main>
    </>
  );
}
