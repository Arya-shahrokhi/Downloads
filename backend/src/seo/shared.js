/**
 * Bridge to the framework-free modules in /shared (also used by the React app).
 * Keeping one implementation guarantees the server-rendered meta tags and the
 * client-side ones are identical.
 */
export * from '../../../shared/seo/index.js';
export { ARTICLES as STATIC_ARTICLES } from '../../../shared/content/journal.js';
