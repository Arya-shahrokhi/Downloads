import { env } from '../config/env.js';

/**
 * Optional 301 to the canonical origin defined by SITE_URL
 * (e.g. http://www.kalavaran.ir/x → https://kalavaran.ir/x).
 * Enabled with SEO_REDIRECT_TO_CANONICAL_HOST=true. Health checks are exempt so
 * platform probes that call the container directly keep working.
 */
let canonical = null;
try { canonical = new URL(env.seo.siteUrl); } catch { canonical = null; }

export function canonicalHost(req, res, next) {
  if (!env.seo.redirectToCanonicalHost || !canonical) return next();
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (req.path === '/api/health') return next();

  const host = req.get('host');
  const proto = req.protocol; // respects X-Forwarded-Proto because of `trust proxy`
  if (host === canonical.host && `${proto}:` === canonical.protocol) return next();
  return res.redirect(301, `${canonical.origin}${req.originalUrl}`);
}
