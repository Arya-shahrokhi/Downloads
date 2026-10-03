import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { absoluteUrl, cloudinaryShareUrl, isCloudinaryUrl } from './shared.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const frontendDist = path.resolve(here, '../../../frontend/dist');
const frontendPublic = path.resolve(here, '../../../frontend/public');

/** Options every shared builder needs. Only public, non-secret values. */
export const seoOptions = () => ({
  siteUrl: env.seo.siteUrl,
  sameAs: env.seo.sameAs,
  shipping: { flat: env.shipping.flat, freeThreshold: env.shipping.freeThreshold },
});

const shareCache = new Map();

/**
 * Best image for link previews. Local catalogue images are WebP; some chat
 * apps still render JPEG previews more reliably, so when a same-name .jpg
 * exists next to the .webp we use it for og:image. Remote URLs pass through.
 */
export function shareImageFor(url) {
  if (!url) return null;
  if (isCloudinaryUrl(url)) return cloudinaryShareUrl(url);
  if (/^https?:\/\//i.test(url)) return url;
  if (shareCache.has(url)) return shareCache.get(url);
  let chosen = url;
  if (url.startsWith('/images/') && url.endsWith('.webp')) {
    const jpg = url.replace(/\.webp$/, '.jpg');
    if ([frontendDist, frontendPublic].some((root) => existsSync(path.join(root, jpg)))) chosen = jpg;
  }
  const abs = absoluteUrl(env.seo.siteUrl, chosen);
  shareCache.set(url, abs);
  return abs;
}
