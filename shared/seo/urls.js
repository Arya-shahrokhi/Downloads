/**
 * URL policy: canonical URLs and robots directives.
 *
 * Rules (shared by server and client so they always agree):
 *  - Canonical = path without trailing slash + only the "page" param (when > 1).
 *  - Filter / sort / search URLs are crawlable (links are followed) but not
 *    indexed: `noindex, follow`. Their canonical points to the clean listing.
 *  - Private areas (account, admin, checkout, cart, auth) are `noindex, nofollow`.
 */

export const PRIVATE_PREFIXES = ['/admin', '/account', '/checkout', '/cart', '/login', '/register', '/404'];

/** Query params that create a genuinely different, indexable page. */
const INDEXABLE_PARAMS = ['page'];

export function normalizeSiteUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return raw.replace(/\/+$/, '');
}

export function normalizePath(pathname = '/') {
  let path = String(pathname || '/').split('#')[0].split('?')[0];
  if (!path.startsWith('/')) path = `/${path}`;
  path = path.replace(/\/{2,}/g, '/');
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path || '/';
}

export function absoluteUrl(siteUrl, pathOrUrl = '/') {
  if (!pathOrUrl) return normalizeSiteUrl(siteUrl) || '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith('//')) return `https:${pathOrUrl}`;
  const base = normalizeSiteUrl(siteUrl);
  const raw = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  const qIndex = raw.indexOf('?');
  const path = qIndex === -1 ? raw : raw.slice(0, qIndex);
  const query = qIndex === -1 ? '' : raw.slice(qIndex);
  // Encode non-ASCII (Persian) path segments so the URL is valid everywhere
  // (sitemaps require RFC-3986 URLs). Already-encoded input stays unchanged.
  const encoded = path.split('/').map((seg) => {
    try { return encodeURIComponent(decodeURIComponent(seg)); } catch { return encodeURIComponent(seg); }
  }).join('/');
  return `${base}${encoded}${query}`;
}

function toParams(search) {
  if (!search) return new URLSearchParams();
  if (search instanceof URLSearchParams) return search;
  if (typeof search === 'object') {
    const p = new URLSearchParams();
    Object.entries(search).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') p.set(k, String(v)); });
    return p;
  }
  return new URLSearchParams(String(search).replace(/^\?/, ''));
}

export function pageNumberFrom(search) {
  const n = Number.parseInt(toParams(search).get('page') || '1', 10);
  return Number.isFinite(n) && n > 1 ? n : 1;
}

/** Canonical path (relative) for a location. */
export function canonicalPathFor(pathname, search) {
  const path = normalizePath(pathname);
  const params = toParams(search);
  const kept = new URLSearchParams();
  INDEXABLE_PARAMS.forEach((key) => {
    const value = params.get(key);
    if (key === 'page') {
      const n = Number.parseInt(value || '1', 10);
      if (Number.isFinite(n) && n > 1) kept.set('page', String(n));
    } else if (value) kept.set(key, value);
  });
  const qs = kept.toString();
  return qs ? `${path}?${qs}` : path;
}

export function isPrivatePath(pathname) {
  const path = normalizePath(pathname);
  return PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** robots meta value for a location. */
export function robotsFor(pathname, search) {
  if (isPrivatePath(pathname)) return 'noindex, nofollow';
  const params = toParams(search);
  const hasNonIndexable = [...params.keys()].some((k) => !INDEXABLE_PARAMS.includes(k) && params.get(k) !== '');
  if (hasNonIndexable) return 'noindex, follow';
  return 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
}

export const isIndexable = (robots) => /(^|,\s*)index\b/.test(robots || '') && !/noindex/.test(robots || '');
