import { Article, Category, Product } from '../models/index.js';
import { STATIC_ARTICLES, STATIC_PAGES, absoluteUrl, escapeHtml } from './shared.js';
import { seoOptions } from './context.js';

/**
 * Dynamic sitemap.xml with image extension.
 *
 * Contains only canonical, indexable URLs that return HTTP 200:
 * static pages, active categories with products, active products and
 * published journal articles. No filter/sort/search/private URLs.
 * <lastmod> comes from real updatedAt values (Google ignores priority/changefreq).
 *
 * The 50,000 URL limit per file is far away (≈200 products today); if the
 * catalogue ever gets close, split into a sitemap index here.
 */

const TTL_MS = 10 * 60 * 1000;
let cached = { xml: '', at: 0 };

export const invalidateSitemap = () => { cached = { xml: '', at: 0 }; };

const iso = (d) => (d ? new Date(d).toISOString() : null);

function urlEntry(siteUrl, { path, lastmod, images = [] }) {
  const imgs = images
    .filter(Boolean)
    .slice(0, 5)
    .map((img) => `    <image:image><image:loc>${escapeHtml(absoluteUrl(siteUrl, img))}</image:loc></image:image>`)
    .join('\n');
  return [
    '  <url>',
    `    <loc>${escapeHtml(absoluteUrl(siteUrl, path))}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    imgs,
    '  </url>',
  ].filter(Boolean).join('\n');
}

export async function buildSitemap() {
  if (cached.xml && Date.now() - cached.at < TTL_MS) return cached.xml;
  const { siteUrl } = seoOptions();

  const [categories, products, dbArticles, counts] = await Promise.all([
    Category.find({ isActive: true }).select('slug updatedAt image').lean(),
    Product.find({ isActive: true }).select('slug updatedAt images category').sort({ productNumber: 1 }).lean(),
    Article.find({ isPublished: true }).select('slug updatedAt createdAt image').lean(),
    Product.aggregate([{ $match: { isActive: true } }, { $group: { _id: '$category', count: { $sum: 1 }, last: { $max: '$updatedAt' } } }]),
  ]);

  const countMap = new Map(counts.map((c) => [String(c._id), c]));
  const newestProduct = products.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), null);

  const entries = [];

  Object.entries(STATIC_PAGES)
    .filter(([, page]) => page.sitemap !== false)
    .forEach(([path]) => {
      const lastmod = ['/', '/products'].includes(path) ? iso(newestProduct) : null;
      entries.push({ path, lastmod });
    });

  categories
    .filter((c) => countMap.get(String(c._id))?.count > 0)
    .forEach((c) => {
      const stats = countMap.get(String(c._id));
      const last = [c.updatedAt, stats?.last].filter(Boolean).sort((a, b) => b - a)[0];
      entries.push({ path: `/category/${c.slug}`, lastmod: iso(last), images: [c.image?.url] });
    });

  products.forEach((p) => {
    entries.push({ path: `/products/${p.slug}`, lastmod: iso(p.updatedAt), images: (p.images || []).map((i) => i.url) });
  });

  const articleMap = new Map(STATIC_ARTICLES.map((a) => [a.slug, { path: `/journal/${a.slug}`, lastmod: iso(a.date), images: [a.image] }]));
  dbArticles.forEach((a) => {
    articleMap.set(a.slug, { path: `/journal/${a.slug}`, lastmod: iso(a.updatedAt || a.createdAt), images: [a.image] });
  });
  entries.push(...articleMap.values());

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries.map((e) => urlEntry(siteUrl, e)),
    '</urlset>',
    '',
  ].join('\n');

  cached = { xml, at: Date.now() };
  return xml;
}
