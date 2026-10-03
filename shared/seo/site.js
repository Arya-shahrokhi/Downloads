/**
 * Single source of truth for brand-level SEO facts.
 *
 * Imported by BOTH the Express backend (server-side meta injection, sitemap,
 * JSON-LD) and the React frontend (client-side <Seo />), so titles, descriptions
 * and structured data can never drift apart between what crawlers see in the raw
 * HTML and what the rendered app shows.
 *
 * Only put facts here that are true and public. Nothing secret, nothing invented.
 */
export const SITE = {
  name: 'کالاوران',
  alternateName: 'Kalavaran',
  language: 'fa-IR',
  locale: 'fa_IR',
  titleSeparator: ' | ',
  defaultTitle: 'کالاوران | عطاری آنلاین، گیاهان دارویی، دمنوش و ادویه',
  defaultDescription:
    'عطاری آنلاین کالاوران: خرید گیاهان دارویی، دمنوش گیاهی، عرقیات سنتی، روغن‌های گیاهی پرس سرد و ادویه تازه با معرفی شفاف هر محصول و ارسال سریع.',
  // 1200×630 share card (Facebook, WhatsApp, Telegram, LinkedIn, X)
  defaultImage: '/images/og/kalavaran-og-default.jpg',
  defaultImageWidth: 1200,
  defaultImageHeight: 630,
  defaultImageAlt: 'کالاوران، فروشگاه آنلاین محصولات گیاهی و عطاری',
  logo: '/images/brand/kalavaran-logo-512.png',
  themeColor: '#f7f6f1',
  telephone: '+989027403331',
  email: 'info@kalavaran.ir',
  address: {
    streetAddress: 'ونک، ملاصدرا، شیراز شمالی، صائب تبریزی غربی، پلاک ۲۵، طبقه دوم',
    addressLocality: 'تهران',
    addressRegion: 'تهران',
    addressCountry: 'IR',
  },
  // Prices are stored in Toman. Schema.org needs an ISO‑4217 currency: IRR (Rial) = Toman × 10.
  storeCurrency: 'IRR',
  tomanToCurrency: 10,
  // Facts that are published on the /terms page of the site.
  returnDays: 7,
};

/** Toman → value in SITE.storeCurrency (Rial). */
export const toSchemaPrice = (toman) => Math.round(Number(toman || 0) * SITE.tomanToCurrency);

export default SITE;
