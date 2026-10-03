import { readFileSync, statSync } from 'node:fs';
import { absoluteUrl, escapeHtml, jsonLdString, SITE } from './shared.js';

/**
 * Server-side <head> injection for the SPA.
 *
 * Why: social crawlers (WhatsApp, Telegram, Facebook, LinkedIn, X) do NOT run
 * JavaScript, and Google indexes the raw HTML first and renders JS later. With
 * a plain Vite build every URL returned the same title/description, so every
 * shared product link showed the homepage preview. Now each URL's HTML already
 * contains its own title, description, canonical, Open Graph, Twitter and
 * JSON-LD before any JS runs. React then keeps them in sync on navigation.
 */

const START = '<!-- seo:start -->';
const END = '<!-- seo:end -->';

let cache = { file: null, mtime: 0, html: '' };

export function loadTemplate(file) {
  const { mtimeMs } = statSync(file);
  if (cache.file !== file || cache.mtime !== mtimeMs) {
    cache = { file, mtime: mtimeMs, html: readFileSync(file, 'utf8') };
  }
  return cache.html;
}

const attr = (name, value) => (value === undefined || value === null || value === '' ? '' : ` ${name}="${escapeHtml(value)}"`);
const metaName = (name, content) => (content ? `<meta name="${name}"${attr('content', content)} data-seo>` : '');
const metaProp = (property, content) => (content ? `<meta property="${property}"${attr('content', content)} data-seo>` : '');

/** Renders the full SEO tag block for a page. */
export function renderSeoTags(seo, { siteUrl }) {
  const canonical = seo.canonicalPath ? absoluteUrl(siteUrl, seo.canonicalPath) : '';
  const image = seo.image ? absoluteUrl(siteUrl, seo.image) : absoluteUrl(siteUrl, SITE.defaultImage);
  const tags = [
    `<title data-seo>${escapeHtml(seo.title || SITE.defaultTitle)}</title>`,
    metaName('description', seo.description),
    metaName('robots', seo.robots),
    canonical ? `<link rel="canonical"${attr('href', canonical)} data-seo>` : '',
    // Open Graph (Facebook, WhatsApp, Telegram, LinkedIn)
    metaProp('og:site_name', SITE.name),
    metaProp('og:locale', SITE.locale),
    metaProp('og:type', seo.ogType || 'website'),
    metaProp('og:title', seo.title),
    metaProp('og:description', seo.description),
    canonical ? metaProp('og:url', canonical) : '',
    metaProp('og:image', image),
    image.startsWith('https://') ? metaProp('og:image:secure_url', image) : '',
    metaProp('og:image:alt', seo.imageAlt),
    seo.imageWidth ? metaProp('og:image:width', String(seo.imageWidth)) : '',
    seo.imageHeight ? metaProp('og:image:height', String(seo.imageHeight)) : '',
    // X / Twitter
    metaName('twitter:card', 'summary_large_image'),
    metaName('twitter:title', seo.title),
    metaName('twitter:description', seo.description),
    metaName('twitter:image', image),
    metaName('twitter:image:alt', seo.imageAlt),
    // Extra (product:price, article:published_time, ...)
    ...(seo.meta || []).map((m) => (m.property ? metaProp(m.property, m.content) : metaName(m.name, m.content))),
    // JSON-LD
    ...(seo.jsonLd || []).map((data) => `<script type="application/ld+json" data-seo>${jsonLdString(data)}</script>`),
    // LCP hint: start downloading the main product image with the HTML
    seo.preloadImage
      ? `<link rel="preload" as="image"${attr('href', seo.preloadImage.href)}${attr('imagesrcset', seo.preloadImage.srcset)}${attr('imagesizes', seo.preloadImage.sizes)} fetchpriority="high" data-seo>`
      : '',
  ];
  return tags.filter(Boolean).join('\n    ');
}

export function injectSeo(html, seo, options) {
  const block = `${START}\n    ${renderSeoTags(seo, options)}\n    ${END}`;
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start !== -1 && end > start) {
    return html.slice(0, start) + block + html.slice(end + END.length);
  }
  // Fallback if the markers were stripped: drop the static <title>/description and append.
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="description"[^>]*>/i, '')
    .replace('</head>', `  ${block}\n  </head>`);
}
