# SEO implementation – Kalavaran

## Architecture
- `shared/seo/*`: framework-free SEO core used by BOTH Express and React (titles, descriptions, canonical/robots policy, JSON-LD builders, category copy, static page meta). `shared/content/journal.js`: journal articles (moved from Journal.jsx).
- Backend `src/seo/*`: server-side <head> injection per URL (html.js), HTTP status resolution 200/301/404/410 (pageResolver.js), dynamic `sitemap.xml` with images, `robots.txt`, canonical-host redirect (middleware/seo.js).
- MongoDB: Product `seoTitle/seoDescription`; Category `seoTitle/seoDescription/intro/faqs`; new `SeoRedirect` (301 history for renamed slugs, 410 for deleted products). All optional with defaults — old documents stay valid.
- Slugs: Persian → clean ASCII (`گل گاوزبان` → `gol-gavzaban`, categories → `herbal-teas`, `medicinal-plants`…).

## After deploy
1. Set env: `SITE_URL`, `SEO_ALLOW_INDEXING=true` (false on staging), optional `SEO_REDIRECT_TO_CANONICAL_HOST`, `SEO_SAME_AS`; frontend `VITE_SITE_URL`.
2. `npm run seo:migrate --workspace backend` (dry run) → `-- --apply` (add `--reslug-all` to regenerate old slugify slugs). Old URLs 301 automatically.
3. `npm run seo:audit --workspace backend` → duplicate/missing titles & descriptions, alt, slugs, redirect chains.

## Pre-existing bugs fixed
- `backend/src/routes/index.js` duplicate import (server crashed on start).
- `AppRoutes.jsx` broken JSX + missing AdminArticles/ArticleForm imports (build failed).
- Admin article list called a non-existent endpoint; article text index missing (search 500); drafts readable publicly.
- Product JSON-LD price was Toman labelled as IRR (10× too low) → now Rial.
- Header logo loaded an 843 KB PNG → WebP variants (3–18 KB).

## Completed in the follow-up pass
- **Category page (`Products.jsx`)**: uses the shared `buildCategorySeo` / `buildStaticSeo` (same tags as the server). Intro paragraphs render under the H1 and the FAQs render as an accordion under the grid, both on page 1 only, so the FAQPage JSON-LD matches visible content exactly. Empty categories get `noindex, follow` (same as the server) and unknown slugs render the 404 page.
- **Pagination**: public listings pass `hrefFor`, so every page number and prev/next is a real `<a href>` (`rel="prev"/"next"`, page 1 has no `?page=`). Admin/account tables keep button mode.
- **Footer**: category links come from the live category list (clean slugs), with clean-slug fallbacks. Social icons render only when `VITE_SOCIAL_*` is set; WhatsApp falls back to `wa.me/<SITE.telephone>`. Email is a `mailto:` link.
- **Admin forms**: new shared `pages/admin/SeoFields.jsx` (slug, SEO title, meta description, live Google preview built by the shared builder). Product form and category modal both use it. The category modal also edits the intro and up to 12 FAQs, and has a "fill empty fields from default copy" button.
- **Missing/deleted product**: API 404/410 now renders `NotFound` (with a 410 variant) instead of an error box, with `noindex, follow` and no canonical. Old slugs returned with `redirect` are replaced in the address bar. Missing journal articles also render `NotFound`.
- **Images**: `shared/seo/images.js` adds Cloudinary `f_auto,q_auto,c_limit,w_N` delivery (AVIF/WebP + resizing). `SmartImage` renders a srcset (320 to 1200 px); the server preload (`responsiveImage`) uses the same URLs; `og:image` for Cloudinary uses a 1200 px JPEG.
- **Journal**: `hooks/useArticles.js` merges admin-written (DB) articles with the static ones (DB wins by slug, same rule as the sitemap). This covers the Journal list, article pages (shared `buildArticleSeo`, link to the related category) and the home teaser.

## Audit scripts (run in production after deploy)

Two scripts to verify the SEO implementation and catch issues:

### `npm run seo:audit --workspace backend`
Checks:
- Redirect chains (A→B→C that should collapse to A→C)
- Orphaned redirects (point to deleted/inactive items)
- Missing product images or bad Cloudinary URLs
- Category intro/content issues
- Article body/image completeness
- Slug health (should be ASCII-only)
- Sitemap generation and RFC-3986 URL compliance

### `npm run link:check --workspace backend`
Scans:
- Category intros for links to non-existent products/categories
- Article `relatedCategory` fields
- Old Persian slugs in article bodies


## Dependency fix
- Added omitted backend runtime dependencies `helmet`, `express-mongo-sanitize`, and `express-rate-limit` to `backend/package.json`. Run `npm install` from the project root (the workspace root) before starting the API.
