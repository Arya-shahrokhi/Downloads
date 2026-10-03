import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';
import Logo from './Logo.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useSubmit } from '../../hooks/index.js';
import { SITE } from '@shared/seo/site.js';

/**
 * Fallback category links (clean ASCII slugs from shared/seo/categoryContent.js).
 * The old Persian slugs (/category/گیاهان-دارویی …) 404 after the SEO migration.
 * Normally the live category list from the API is used instead (see below).
 */
const FALLBACK_CATEGORIES = [
  { slug: 'medicinal-plants', name: 'گیاهان دارویی' },
  { slug: 'spices', name: 'ادویه‌ها' },
  { slug: 'herbal-teas', name: 'دمنوش‌ها' },
  { slug: 'herbal-distillates', name: 'عرقیات گیاهی' },
];
const MAX_FOOTER_CATEGORIES = 6;

const STATIC_COLUMNS = {
  shop: {
    title: 'فروشگاه',
    links: [
      { to: '/products', label: 'همه محصولات' },
      { to: '/premium-products', label: 'محصولات ممتاز' },
      { to: '/products?discounted=true', label: 'تخفیف‌دارها' },
      { to: '/products?popular=true', label: 'پرفروش‌ها' },
      { to: '/journal', label: 'مجله گیاهان' },
    ],
  },
  help: {
    title: 'راهنما',
    links: [
      { to: '/about', label: 'درباره ما' },
      { to: '/contact', label: 'تماس با ما' },
      { to: '/terms', label: 'قوانین و مقررات' },
      { to: '/privacy', label: 'حریم خصوصی' },
    ],
  },
};

/**
 * Social links come from env (frontend/.env: VITE_SOCIAL_*). Icons without a
 * real URL are not rendered at all – an href="#" link is a dead link for
 * users and crawlers. WhatsApp falls back to the shop's published phone number.
 */
const waFromPhone = SITE.telephone ? `https://wa.me/${SITE.telephone.replace(/\D/g, '')}` : '';
const SOCIALS = [
  { Icon: FiInstagram, label: 'اینستاگرام کالاوران', href: import.meta.env.VITE_SOCIAL_INSTAGRAM },
  { Icon: FaTelegramPlane, label: 'تلگرام کالاوران', href: import.meta.env.VITE_SOCIAL_TELEGRAM },
  { Icon: FaWhatsapp, label: 'واتس‌اپ کالاوران', href: import.meta.env.VITE_SOCIAL_WHATSAPP || waFromPhone },
].filter((s) => /^https?:\/\//i.test(s.href || ''));

export default function Footer({ categories = [] }) {
  const liveCategories = categories
    .filter((c) => c?.slug && c.isActive !== false && (c.productsCount ?? 1) > 0)
    .slice(0, MAX_FOOTER_CATEGORIES);
  const columns = [
    STATIC_COLUMNS.shop,
    {
      title: 'دسته‌بندی‌ها',
      links: (liveCategories.length ? liveCategories : FALLBACK_CATEGORIES)
        .map((c) => ({ to: `/category/${c.slug}`, label: c.name })),
    },
    STATIC_COLUMNS.help,
  ];

  const toast = useToast();
  const [email, setEmail] = useState('');

  const [subscribe, submitting] = useSubmit(async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error('ایمیل معتبر وارد کنید');
    await new Promise((r) => setTimeout(r, 600));
    setEmail('');
    return toast.success('ثبت شد. خبرهای فصلی برایتان می‌آید.');
  });

  return (
    <footer className="mt-24 bg-ink-900 text-bone-200">
      <div className="wrap grid gap-12 py-14 lg:grid-cols-[1.4fr_2fr_1.2fr] lg:gap-16">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo className="size-9 text-berry-600" />
            <span className="text-lg font-extrabold text-bone-50">کالاوران</span>
          </div>
          <p className="mt-4 max-w-[34ch] text-sm leading-7 text-bone-200/70">
            کالاوران انتخابی دقیق از گیاهان، ادویه‌ها و محصولات طبیعی است؛ شفاف، کاربردی و نزدیک به منبع.
          </p>
          {SOCIALS.length > 0 && (
            <div className="mt-6 flex gap-2">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label} href={href} target="_blank" rel="noopener noreferrer me" aria-label={label}
                  className="grid size-10 place-items-center rounded-xl bg-bone-50/8 text-bone-200 transition-colors duration-200 hover:bg-moss-600 hover:text-bone-50"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 min-[360px]:grid-cols-2 sm:grid-cols-3">
          {columns.map((col) => (
            <nav key={col.title}>
              <h3 className="mb-4 text-sm font-bold text-bone-50">{col.title}</h3>
              <ul className="space-y-2.5 text-sm text-bone-200/65">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="transition-colors hover:text-moss-300">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-bold text-bone-50">خبرهای خوش‌طعم</h3>
          <p className="mt-3 text-sm leading-7 text-bone-200/65">محصول تازه، راهنمای کاربردی و پیشنهادهای ویژه را مستقیم دریافت کن.</p>
          <form onSubmit={subscribe} className="mt-4 flex gap-2">
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل برای دریافت خبرها" aria-label="ایمیل"
              className="h-11 min-w-0 flex-1 rounded-xl border border-bone-50/12 bg-bone-50/8 px-4 text-sm text-bone-50 placeholder:text-bone-200/40 focus:border-moss-300 focus:outline-none"
            />
            <button type="submit" disabled={submitting} className="btn-accent btn-md shrink-0 px-4" aria-label="عضویت">
              <FiSend size={17} />
            </button>
          </form>

          <ul className="mt-7 space-y-3 text-sm text-bone-200/65">
            <li><a href="tel:09027403331" className="flex items-center gap-2.5 transition-colors hover:text-bone-50"><FiPhone size={15} className="text-moss-300" /><span className="num font-semibold" dir="ltr">0902-740-3331</span></a></li>
            <li><a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 transition-colors hover:text-bone-50"><FiMail size={15} className="text-moss-300" />{SITE.email}</a></li>
            <li className="flex items-start gap-2.5"><FiMapPin size={15} className="mt-1 shrink-0 text-moss-300" />ونک، ملاصدرا، شیراز شمالی، صائب تبریزی غربی، پلاک ۲۵</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bone-50/10">
        <div className="mobile-footer-clearance wrap flex flex-col items-center justify-between gap-3 pt-5 text-2xs text-bone-200/45 sm:flex-row">
          <p className="num">© ۱۴۰۵ کالاوران. تمام حقوق محفوظ است.</p>
          <p>ساخته‌شده با React، Node.js و MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
