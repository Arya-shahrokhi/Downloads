import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SITE, absoluteUrl, canonicalPathFor, fullTitle, jsonLdString, robotsFor,
} from '@shared/seo/index.js';

/**
 * Reusable SEO component (title, description, robots, canonical, Open Graph,
 * Twitter/X, extra meta, JSON-LD).
 *
 * Usage:
 *   <Seo seo={data.seo} />                    // prebuilt by the backend/shared builders
 *   <Seo title="..." description="..." />     // legacy props still work everywhere
 *
 * All managed tags carry `data-seo`; the server-injected ones use the same
 * attribute, so on navigation we replace them instead of duplicating.
 * robots/canonical default to the shared URL policy (private pages → noindex,
 * filter/sort/search URLs → noindex,follow + clean canonical).
 */
export const siteUrl = () => (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '');

export default function Seo({
  seo, title, description, image, imageAlt, canonical, robots, type, jsonLd, meta,
}) {
  const { pathname, search } = useLocation();
  const payload = JSON.stringify({ seo, title, description, image, imageAlt, canonical, robots, type, jsonLd, meta, pathname, search });

  useEffect(() => {
    const base = siteUrl();
    const s = seo || {};
    const t = s.title || fullTitle(title);
    const d = s.description || description || SITE.defaultDescription;
    const r = robots || s.robots || robotsFor(pathname, search);
    const cPath = canonical ?? s.canonicalPath ?? canonicalPathFor(pathname, search);
    const cUrl = cPath && !/noindex/.test(r) ? absoluteUrl(base, cPath) : (cPath ? absoluteUrl(base, cPath) : '');
    const img = absoluteUrl(base, s.image || image || SITE.defaultImage);
    const alt = s.imageAlt || imageAlt || SITE.defaultImageAlt;
    const ld = [...(s.jsonLd || []), ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])];

    document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
    document.title = t;
    const add = (tag, attrs, text) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      el.setAttribute('data-seo', '');
      if (text) el.textContent = text;
      document.head.appendChild(el);
    };
    const name = (n, c) => c && add('meta', { name: n, content: c });
    const prop = (p, c) => c && add('meta', { property: p, content: c });

    name('description', d);
    name('robots', r);
    if (cUrl) add('link', { rel: 'canonical', href: cUrl });
    prop('og:site_name', SITE.name);
    prop('og:locale', SITE.locale);
    prop('og:type', s.ogType || type || 'website');
    prop('og:title', t);
    prop('og:description', d);
    if (cUrl) prop('og:url', cUrl);
    prop('og:image', img);
    prop('og:image:alt', alt);
    name('twitter:card', 'summary_large_image');
    name('twitter:title', t);
    name('twitter:description', d);
    name('twitter:image', img);
    [...(s.meta || []), ...(meta || [])].forEach((m) => (m.property ? prop(m.property, m.content) : name(m.name, m.content)));
    ld.filter(Boolean).forEach((data) => add('script', { type: 'application/ld+json' }, jsonLdString(data)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  return null;
}
