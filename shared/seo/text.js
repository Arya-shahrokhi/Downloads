/** Small, dependency-free text helpers used for meta tags. */

const ZWNJ = '\u200c';

/** Removes HTML tags, control chars and repeated whitespace. Keeps the Persian ZWNJ. */
export function cleanText(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/[-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(new RegExp(`\\s*${ZWNJ}\\s*`, 'g'), ZWNJ)
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncates on a word boundary. Google shows ~150–160 chars of a description
 * and ~55–65 chars of a title; Persian glyphs are narrow so we allow a bit more.
 */
export function truncate(value, max = 160) {
  const text = cleanText(value);
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[\s،,.:;؛\-–]+$/u, '')}…`;
}

/** Joins non-empty sentence fragments with a Persian full stop. */
export function sentences(...parts) {
  return parts
    .map(cleanText)
    .filter(Boolean)
    .map((p) => (/[.!؟?…]$/u.test(p) ? p : `${p}.`))
    .join(' ');
}

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
export const toFaDigits = (value) => String(value ?? '').replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

/** Escapes a string for safe use inside an HTML attribute or text node. */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Serialises JSON-LD for inline <script>. Escaping "<" prevents a product
 * description containing "</script>" from breaking out of the tag (XSS).
 */
export function jsonLdString(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
