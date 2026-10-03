/**
 * Cloudinary delivery helpers (shared by the React app and the Express SEO layer).
 *
 * Uploaded product images live on Cloudinary as the original file. Serving that
 * original to every device wastes bandwidth, so at delivery time we insert a
 * transformation right after `/image/upload/`:
 *
 *   f_auto  → Cloudinary picks AVIF or WebP per browser (JPEG/PNG fallback)
 *   q_auto  → perceptual quality
 *   c_limit,w_N → resize down to N px (never upscales)
 *
 * Non-Cloudinary URLs are returned unchanged, so callers can use these blindly.
 */

const CLD_RE = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/i;

// Transformation keys we recognise; a path segment made only of these is a
// transformation (not a folder), so it can be replaced safely.
const TRANSFORM_KEYS = new Set(['a', 'ar', 'b', 'bo', 'c', 'co', 'dpr', 'e', 'f', 'fl', 'g', 'h', 'l', 'o', 'q', 'r', 't', 'w', 'x', 'y', 'z']);
const isTransformSegment = (seg) => seg.split(',').every((part) => {
  const m = part.match(/^([a-z]{1,3})_.+$/);
  return Boolean(m && TRANSFORM_KEYS.has(m[1]));
});

/** Widths generated for Cloudinary srcset (covers cards on mobile → product hero on retina). */
export const CLOUDINARY_WIDTHS = [320, 480, 640, 800, 1200];

export const isCloudinaryUrl = (url) => typeof url === 'string' && CLD_RE.test(url);

/**
 * @param {string} url  original Cloudinary secure_url
 * @param {{ width?: number, format?: string, quality?: string, crop?: string }} opts
 */
export function cloudinaryUrl(url, { width, format = 'auto', quality = 'auto', crop = 'limit' } = {}) {
  const m = typeof url === 'string' ? url.match(CLD_RE) : null;
  if (!m) return url;
  const parts = m[2].split('/');
  // Drop earlier delivery transformations (idempotent) but never the version or the public id.
  while (parts.length > 1 && !/^v\d+$/.test(parts[0]) && isTransformSegment(parts[0])) parts.shift();
  const t = [`f_${format}`, `q_${quality}`, width ? `c_${crop},w_${Math.round(width)}` : null].filter(Boolean).join(',');
  return `${m[1]}${t}/${parts.join('/')}`;
}

export function cloudinarySrcSet(url, widths = CLOUDINARY_WIDTHS) {
  if (!isCloudinaryUrl(url)) return '';
  return widths.map((w) => `${cloudinaryUrl(url, { width: w })} ${w}w`).join(', ');
}

/** 1200px JPEG for og:image — chat apps still render JPEG previews most reliably. */
export const cloudinaryShareUrl = (url) => cloudinaryUrl(url, { width: 1200, format: 'jpg' });
