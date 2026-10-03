import { asciiSlug, isCleanSlug } from './transliterate.js';

/**
 * Clean, ASCII, SEO-friendly slug: «گل گاوزبان» → "gol-gavzaban".
 *
 * Before: slugify(..., { strict: true }) produced either mangled
 * transliterations or empty strings for Persian names (then a timestamp was
 * used as the slug). Persian characters in URLs also get percent-encoded into
 * very long, unreadable links when shared.
 */
export const toSlug = (value) => asciiSlug(value);

export { isCleanSlug };

/** Normalises an admin-typed slug; returns '' when nothing usable remains. */
export const normalizeSlugInput = (value) => asciiSlug(value);

export const uniqueSlug = async (Model, value, ignoreId = null) => {
  const base = toSlug(value) || `item-${Date.now().toString(36)}`;
  let slug = base;
  let i = 1;
  while (await Model.exists({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) slug = `${base}-${++i}`;
  return slug;
};
