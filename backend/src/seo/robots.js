import { env } from '../config/env.js';

/**
 * robots.txt
 *
 * Important detail: the React app loads its data from /api/products,
 * /api/categories and /api/articles. Googlebot must be allowed to fetch those
 * while rendering, otherwise product pages would look empty to Google. The rest
 * of /api is blocked, and every API response also carries `X-Robots-Tag: noindex`
 * so raw JSON never shows up in search results.
 *
 * Pages like /login use a `noindex` meta tag instead of Disallow, because a
 * disallowed page can't be crawled and its noindex would never be seen.
 */
export function buildRobots() {
  const site = env.seo.siteUrl;

  if (!env.seo.allowIndexing) {
    return [
      '# Indexing disabled (SEO_ALLOW_INDEXING=false). Staging / development environment.',
      'User-agent: *',
      'Disallow: /',
      '',
    ].join('\n');
  }

  return [
    '# robots.txt – کالاوران',
    'User-agent: *',
    'Allow: /',
    '',
    '# Private areas',
    'Disallow: /admin',
    'Disallow: /account',
    'Disallow: /checkout',
    'Disallow: /cart',
    '',
    '# API: only the public catalogue endpoints the app needs for rendering',
    'Disallow: /api/',
    'Allow: /api/products',
    'Allow: /api/categories',
    'Allow: /api/articles',
    '',
    '# Crawl traps: sort and price/rating filter combinations (pages stay reachable, not crawled)',
    'Disallow: /*?*sort=',
    'Disallow: /*?*minPrice=',
    'Disallow: /*?*maxPrice=',
    'Disallow: /*?*minRating=',
    '',
    `Sitemap: ${site}/sitemap.xml`,
    '',
  ].join('\n');
}
