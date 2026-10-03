import path from 'node:path';
import { existsSync } from 'node:fs';
import { Router } from 'express';
import { env } from '../config/env.js';
import { buildRobots } from './robots.js';
import { buildSitemap } from './sitemap.js';
import { resolvePage } from './pageResolver.js';
import { injectSeo, loadTemplate } from './html.js';
import { frontendDist } from './context.js';

/** robots.txt + sitemap.xml – available in every environment (Vite proxies them in dev). */
export const seoRouter = Router();

seoRouter.get('/robots.txt', (_req, res) => {
  res.type('text/plain; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(buildRobots());
});

seoRouter.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const xml = await buildSitemap();
    res.type('application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    if (!env.seo.allowIndexing) res.set('X-Robots-Tag', 'noindex');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

/**
 * Production SPA handler: every non-API, non-file GET gets index.html with
 * page-specific <head> tags and the correct HTTP status (200 / 301 / 404 / 410).
 */
export function spaHandler() {
  const indexFile = path.join(frontendDist, 'index.html');

  return async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next();
    // Missing static files (e.g. /images/x.webp) must be a plain 404, not the app shell.
    if (path.extname(req.path) && req.path !== '/index.html') return next();
    if (!existsSync(indexFile)) return next();

    try {
      const result = await resolvePage(req);
      if (result.redirect) {
        res.set('Cache-Control', 'public, max-age=3600');
        return res.redirect(301, result.redirect);
      }

      const html = injectSeo(loadTemplate(indexFile), result.seo, { siteUrl: env.seo.siteUrl });
      res.status(result.status || 200);
      res.set('Content-Type', 'text/html; charset=utf-8');
      // HTML must revalidate so updated titles/prices reach users and crawlers fast.
      res.set('Cache-Control', 'no-cache');
      if (/noindex/.test(result.seo?.robots || '') || !env.seo.allowIndexing) {
        res.set('X-Robots-Tag', env.seo.allowIndexing ? result.seo.robots : 'noindex, nofollow');
      }
      return res.send(html);
    } catch (err) {
      // Never take the storefront down because of SEO: fall back to the plain shell.
      console.error('[seo] page resolution failed', err);
      return res.status(200).set('Cache-Control', 'no-cache').sendFile(indexFile);
    }
  };
}
