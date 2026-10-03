/**
 * Page-level SEO builders. Each returns a plain object consumed by
 *   - backend/src/seo/html.js   (injects tags into the raw HTML response)
 *   - frontend <Seo seo={...} /> (keeps tags correct during client navigation)
 *
 * Shape:
 * {
 *   title, description, canonicalPath, robots,
 *   image, imageAlt, imageWidth, imageHeight, ogType,
 *   meta: [{ property|name, content }],   // extra OG/product tags
 *   jsonLd: [ ...objects ],
 *   preloadImage: { href, srcset, sizes } | null
 * }
 */
import { SITE, toSchemaPrice } from './site.js';
import { STATIC_PAGES, NOT_FOUND_PAGE, GONE_PRODUCT_PAGE } from './pages.js';
import { findCategoryContent } from './categoryContent.js';
import { findProductSeoContent } from './productContent.js';
import { absoluteUrl, canonicalPathFor, robotsFor } from './urls.js';
import { cleanText, sentences, toFaDigits, truncate } from './text.js';
import { CLOUDINARY_WIDTHS, cloudinarySrcSet, cloudinaryUrl, isCloudinaryUrl } from './images.js';
import {
  articleLd, breadcrumbLd, collectionPageLd, faqLd, finalPriceToman, organizationLd, productLd, websiteLd,
} from './jsonld.js';

const TITLE_MAX = 65;
const DESC_MAX = 158;

export function fullTitle(title, { absolute = false } = {}) {
  const t = cleanText(title);
  if (!t) return SITE.defaultTitle;
  if (absolute || t.includes(SITE.name)) return t;
  return `${t}${SITE.titleSeparator}${SITE.name}`;
}

/** Descriptive, unique alt text for product images. */
export function productImageAlt(product, index = 0) {
  const custom = cleanText(product?.images?.[index]?.alt);
  const name = cleanText(product?.name);
  if (custom && custom !== name) return custom;
  const cat = cleanText(product?.category?.name);
  const base = cat ? `${name}، ${cat} کالاوران` : `${name} کالاوران`;
  return index > 0 ? `${base}، تصویر ${toFaDigits(index + 1)}` : base;
}

/**
 * Responsive source set for an image, identical to what <SmartImage> renders
 * (so a server-side preload is actually reused by the browser):
 *  - local catalogue images → prebuilt -300/-500/-800 webp variants
 *  - Cloudinary uploads    → on-the-fly f_auto (AVIF/WebP) resized variants
 */
export function responsiveImage(url, widths = [300, 500, 800]) {
  if (isCloudinaryUrl(url)) {
    return { href: cloudinaryUrl(url, { width: 800 }), srcset: cloudinarySrcSet(url, CLOUDINARY_WIDTHS) };
  }
  if (typeof url !== 'string' || !url.startsWith('/images/') || !/\.(?:jpg|webp)$/.test(url)) return null;
  const base = url.replace(/\.(?:jpg|webp)$/, '');
  return { href: `${base}-${widths.at(-1)}.webp`, srcset: widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ') };
}

export function buildStaticSeo(pathname, { siteUrl, search, sameAs } = {}) {
  const page = STATIC_PAGES[pathname];
  if (!page) return null;
  const seo = {
    title: fullTitle(page.title, { absolute: page.absoluteTitle }),
    description: truncate(page.description, DESC_MAX),
    canonicalPath: canonicalPathFor(pathname, search),
    robots: robotsFor(pathname, search),
    image: absoluteUrl(siteUrl, SITE.defaultImage),
    imageAlt: SITE.defaultImageAlt,
    imageWidth: SITE.defaultImageWidth,
    imageHeight: SITE.defaultImageHeight,
    ogType: 'website',
    meta: [],
    jsonLd: [],
  };
  if (pathname === '/') seo.jsonLd = [organizationLd(siteUrl, { sameAs }), websiteLd(siteUrl)];
  return seo;
}

export function buildNotFoundSeo({ siteUrl, gone = false } = {}) {
  const page = gone ? GONE_PRODUCT_PAGE : NOT_FOUND_PAGE;
  return {
    title: fullTitle(page.title),
    description: page.description,
    canonicalPath: null,
    robots: 'noindex, follow',
    image: absoluteUrl(siteUrl, SITE.defaultImage),
    imageAlt: SITE.defaultImageAlt,
    ogType: 'website',
    meta: [],
    jsonLd: [],
  };
}

export function buildProductSeo(product, { siteUrl, shipping, shareImage } = {}) {
  const canonicalPath = `/products/${product.slug}`;
  const name = cleanText(product.name);
  const category = product.category || {};
  const weight = Number(product.weight) > 0 && product.unit ? ` ${toFaDigits(product.weight)} ${cleanText(product.unit)}` : '';
  // Unique hand-written copy per product (shared/seo/productContent.js). Admin overrides still win.
  const editorial = findProductSeoContent(product);

  const title = cleanText(product.seoTitle)
    || (editorial ? truncate(cleanText(editorial.title), TITLE_MAX) : '')
    || truncate(`خرید ${name}${weight}${category.name ? ` | ${cleanText(category.name)}` : ''}`, TITLE_MAX);

  const lead = cleanText(product.shortDescription);
  const body = cleanText(product.description);
  const mentionsName = [lead, body].some((t) => t.includes(name));
  const description = cleanText(product.seoDescription)
    || (editorial ? truncate(cleanText(editorial.description), DESC_MAX) : '')
    || truncate(sentences(mentionsName ? `خرید آنلاین ${name} از کالاوران` : `خرید آنلاین ${name}${weight} از کالاوران`, lead, body), DESC_MAX);

  const imageUrls = (product.images || []).map((i) => i?.url).filter(Boolean);
  const absImages = imageUrls.map((u) => absoluteUrl(siteUrl, u));
  const ogImage = shareImage || absImages[0] || absoluteUrl(siteUrl, SITE.defaultImage);
  const priceToman = finalPriceToman(product);
  const inStock = Number(product.stock || 0) > 0;

  const crumbs = [
    { name: 'خانه', path: '/' },
    { name: 'محصولات', path: '/products' },
    category.slug ? { name: category.name, path: `/category/${category.slug}` } : null,
    { name, path: canonicalPath },
  ].filter(Boolean);

  const preload = responsiveImage(imageUrls[0]);

  return {
    title: fullTitle(title),
    description,
    canonicalPath,
    robots: robotsFor(canonicalPath),
    image: ogImage,
    imageAlt: productImageAlt(product, 0),
    ogType: 'product',
    meta: [
      { property: 'product:price:amount', content: String(toSchemaPrice(priceToman)) },
      { property: 'product:price:currency', content: SITE.storeCurrency },
      { property: 'product:availability', content: inStock ? 'in stock' : 'out of stock' },
      { property: 'product:condition', content: 'new' },
      ...(category.name ? [{ property: 'product:category', content: cleanText(category.name) }] : []),
    ],
    jsonLd: [
      productLd(product, { siteUrl, canonicalPath, images: absImages, shipping }),
      breadcrumbLd(siteUrl, crumbs),
    ].filter(Boolean),
    preloadImage: preload ? { ...preload, sizes: '(max-width: 1024px) 92vw, 46vw' } : null,
  };
}

/** Merges DB overrides on top of the editorial defaults. */
export function categoryContentFor(category) {
  const defaults = findCategoryContent({ slug: category?.slug, name: category?.name }) || {};
  const intro = cleanText(category?.intro)
    ? String(category.intro).split(/\n{2,}|\r\n\r\n/).map(cleanText).filter(Boolean)
    : (defaults.intro || []);
  const faqs = Array.isArray(category?.faqs) && category.faqs.length ? category.faqs : (defaults.faqs || []);
  return {
    h1: cleanText(category?.name),
    seoTitle: cleanText(category?.seoTitle) || defaults.seoTitle || `خرید ${cleanText(category?.name)}`,
    seoDescription: cleanText(category?.seoDescription) || defaults.seoDescription
      || truncate(sentences(`خرید آنلاین ${cleanText(category?.name)} از عطاری آنلاین کالاوران`, category?.description), DESC_MAX),
    intro,
    faqs: faqs.map((f) => ({ question: cleanText(f.question), answer: cleanText(f.answer) })).filter((f) => f.question && f.answer),
  };
}

export function buildCategorySeo(category, { siteUrl, search, products = [], perPage = 12 } = {}) {
  const basePath = `/category/${category.slug}`;
  const canonicalPath = canonicalPathFor(basePath, search);
  const params = new URLSearchParams(typeof search === 'string' ? search.replace(/^\?/, '') : '');
  const page = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1);
  const content = categoryContentFor(category);
  const pageSuffix = page > 1 ? ` - صفحه ${toFaDigits(page)}` : '';

  const image = category.image?.url ? absoluteUrl(siteUrl, category.image.url) : absoluteUrl(siteUrl, SITE.defaultImage);
  const jsonLd = [
    collectionPageLd(siteUrl, {
      name: content.h1, description: content.seoDescription, canonicalPath, products, startIndex: (page - 1) * perPage,
    }),
    breadcrumbLd(siteUrl, [
      { name: 'خانه', path: '/' },
      { name: 'محصولات', path: '/products' },
      { name: content.h1, path: basePath },
    ]),
    // FAQs are only rendered on page 1, so only page 1 carries FAQPage markup.
    page === 1 ? faqLd(content.faqs) : null,
  ].filter(Boolean);

  return {
    title: fullTitle(`${content.seoTitle}${pageSuffix}`),
    description: page > 1 ? truncate(`${content.seoDescription} صفحه ${toFaDigits(page)}.`, DESC_MAX + 12) : truncate(content.seoDescription, DESC_MAX),
    canonicalPath,
    robots: robotsFor(basePath, search),
    image,
    imageAlt: `${content.h1} در کالاوران`,
    ogType: 'website',
    meta: [],
    jsonLd,
    content,
  };
}

export function buildArticleSeo(article, { siteUrl } = {}) {
  const canonicalPath = `/journal/${article.slug}`;
  const image = article.image ? absoluteUrl(siteUrl, article.image) : absoluteUrl(siteUrl, SITE.defaultImage);
  const published = article.date || article.createdAt;
  return {
    title: fullTitle(truncate(article.title, TITLE_MAX)),
    description: truncate(article.excerpt || (article.body || []).join(' '), DESC_MAX),
    canonicalPath,
    robots: robotsFor(canonicalPath),
    image,
    imageAlt: cleanText(article.title),
    ogType: 'article',
    meta: [
      ...(published ? [{ property: 'article:published_time', content: new Date(published).toISOString() }] : []),
      ...(article.updatedAt ? [{ property: 'article:modified_time', content: new Date(article.updatedAt).toISOString() }] : []),
      ...(article.tag ? [{ property: 'article:section', content: cleanText(article.tag) }] : []),
    ],
    jsonLd: [
      articleLd(article, { siteUrl, canonicalPath, image }),
      breadcrumbLd(siteUrl, [
        { name: 'خانه', path: '/' },
        { name: 'مجله گیاهان', path: '/journal' },
        { name: article.title, path: canonicalPath },
      ]),
    ].filter(Boolean),
  };
}
