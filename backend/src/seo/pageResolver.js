import mongoose from 'mongoose';
import { Article, Category, Product, SeoRedirect } from '../models/index.js';
import {
  STATIC_ARTICLES, STATIC_PAGES, buildArticleSeo, buildCategorySeo, buildNotFoundSeo, buildProductSeo,
  buildStaticSeo, canonicalPathFor, isPrivatePath, normalizePath, pageNumberFrom, robotsFor, fullTitle,
} from './shared.js';
import { seoOptions, shareImageFor } from './context.js';

const PER_PAGE = 12; // same page size as pages/Products.jsx
const isObjectId = (v) => /^[0-9a-f]{24}$/i.test(v || '');
const safeDecode = (v) => { try { return decodeURIComponent(v); } catch { return v; } };

/** Private SPA routes: must work (HTTP 200) but never be indexed. */
function privateSeo(pathname, opts) {
  const known = STATIC_PAGES[pathname];
  return {
    ...(buildNotFoundSeo(opts)),
    title: fullTitle(known?.title || 'حساب کاربری'),
    description: known?.description || '',
    robots: 'noindex, nofollow',
    canonicalPath: null,
  };
}

const dbReady = () => mongoose.connection.readyState === 1;

/**
 * Decides HTTP status + SEO data for any non-API GET request.
 * Returns { redirect } | { status, seo }.
 */
export async function resolvePage(req) {
  const opts = seoOptions();
  const rawPath = req.path;
  const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';

  // 1) URL hygiene: /products/ → /products, //a → /a, /index.html → /
  const normalized = normalizePath(rawPath);
  if (rawPath === '/index.html') return { redirect: `/${search}` };
  if (normalized !== rawPath) return { redirect: `${normalized}${search}` };

  const pathname = safeDecode(normalized);

  // 2) Stored redirects / tombstones (renamed or deleted products & categories)
  if (dbReady()) {
    const hit = await SeoRedirect.findOneAndUpdate({ fromPath: pathname }, { $inc: { hits: 1 } }, { new: true }).lean();
    if (hit?.statusCode === 301 && hit.toPath) return { redirect: `${hit.toPath}${search}` };
    if (hit?.statusCode === 410) return { status: 410, seo: buildNotFoundSeo({ ...opts, gone: true }) };
  }

  // 3) Private routes
  if (isPrivatePath(pathname) && pathname !== '/404') {
    return { status: 200, seo: privateSeo(pathname, opts) };
  }

  // 4) Static pages
  if (STATIC_PAGES[pathname]) {
    return { status: 200, seo: buildStaticSeo(pathname, { ...opts, search }) };
  }

  // 5) Product detail
  let m = pathname.match(/^\/products\/([^/]+)$/);
  if (m && dbReady()) {
    const key = m[1];
    if (isObjectId(key)) {
      const byId = await Product.findOne({ _id: key, isActive: true }).select('slug').lean();
      if (byId) return { redirect: `/products/${byId.slug}` };
    }
    const product = await Product.findOne({ slug: key.toLowerCase(), isActive: true })
      .populate('category', 'name slug isActive')
      .lean({ virtuals: true });
    if (product) {
      if (product.slug !== key) return { redirect: `/products/${product.slug}` }; // case normalisation
      const seo = buildProductSeo(product, { ...opts, shareImage: shareImageFor(product.images?.[0]?.url) });
      return { status: 200, seo };
    }
    return { status: 404, seo: buildNotFoundSeo(opts) };
  }

  // 6) Category listing
  m = pathname.match(/^\/category\/([^/]+)$/);
  if (m && dbReady()) {
    const slug = m[1];
    const category = await Category.findOne({ slug: { $in: [slug, slug.toLowerCase()] }, isActive: true }).lean();
    if (!category) return { status: 404, seo: buildNotFoundSeo(opts) };
    if (category.slug !== slug) return { redirect: `/category/${category.slug}${search}` };

    const page = pageNumberFrom(search);
    const filter = { category: category._id, isActive: true };
    const [products, total] = await Promise.all([
      Product.find(filter).select('name slug').sort({ productNumber: 1, name: 1 })
        .skip((page - 1) * PER_PAGE).limit(PER_PAGE).lean(),
      Product.countDocuments(filter),
    ]);
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (page > pages) return { status: 404, seo: buildNotFoundSeo(opts) }; // ?page=999
    const seo = buildCategorySeo(category, { ...opts, search, products, perPage: PER_PAGE });
    if (total === 0) seo.robots = 'noindex, follow'; // empty category = thin content
    return { status: 200, seo };
  }

  // 7) Journal article (DB first, then the static fallback list)
  m = pathname.match(/^\/journal\/([^/]+)$/);
  if (m) {
    const slug = m[1];
    const dbArticle = dbReady() ? await Article.findOne({ slug, isPublished: true }).lean() : null;
    const article = dbArticle
      ? { ...STATIC_ARTICLES.find((a) => a.slug === slug), ...dbArticle }
      : STATIC_ARTICLES.find((a) => a.slug === slug);
    if (article) return { status: 200, seo: buildArticleSeo(article, opts) };
    return { status: 404, seo: buildNotFoundSeo(opts) };
  }

  // 8) DB unavailable: don't claim 404 for dynamic routes, serve the app with safe defaults.
  if (!dbReady() && /^\/(products|category)\//.test(pathname)) {
    return {
      status: 200,
      seo: {
        ...buildNotFoundSeo(opts),
        title: fullTitle(''),
        robots: robotsFor(pathname, search),
        canonicalPath: canonicalPathFor(pathname, search),
      },
    };
  }

  // 9) Everything else is a real 404 (the SPA renders its NotFound page).
  return { status: 404, seo: buildNotFoundSeo(opts) };
}
