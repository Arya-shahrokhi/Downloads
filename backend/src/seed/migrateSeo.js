/**
 * One-off, idempotent SEO migration for an EXISTING database.
 *
 *   npm run seo:migrate            → dry run: prints what would change, writes nothing
 *   npm run seo:migrate -- --apply → applies the changes
 *   add --reslug-all to also replace readable-but-outdated ASCII slugs
 *
 * What it does:
 *  1. Gives every category / product a clean ASCII slug
 *       /category/گیاهان-دارویی  → /category/medicinal-plants
 *       /products/gl-gavzban      → /products/gol-gavzaban
 *     and records a 301 redirect from every old URL (no ranking or backlink is lost).
 *  2. Fills missing image alt texts with a descriptive default.
 *  3. Leaves every other field untouched. New SEO fields (seoTitle, seoDescription,
 *     intro, faqs) are optional and default to empty, so old documents stay valid.
 *
 * Safe to run multiple times.
 */
import { connectDB, disconnectDB } from '../config/db.js';
import { Category, Product, SeoRedirect } from '../models/index.js';
import { isCleanSlug, toSlug } from '../utils/slug.js';
import { categorySlugFor, productImageAlt } from '../seo/shared.js';

const APPLY = process.argv.includes('--apply');
// Also regenerate ASCII slugs that don't match the new transliteration
// (e.g. old slugify output like "gl-gavzban"). Old URLs get a 301.
const RESLUG_ALL = process.argv.includes('--reslug-all');
const log = (...a) => console.log(APPLY ? '[apply]' : '[dry-run]', ...a);

async function uniqueFor(Model, base, id, taken) {
  let slug = base;
  let i = 1;
  // eslint-disable-next-line no-await-in-loop
  while (taken.has(slug) || await Model.exists({ slug, _id: { $ne: id } })) slug = `${base}-${++i}`;
  taken.add(slug);
  return slug;
}

async function migrateCategories() {
  const taken = new Set();
  let changed = 0;
  const categories = await Category.find({});
  for (const c of categories) {
    const preferred = categorySlugFor(c.name) || toSlug(c.name);
    const needs = !isCleanSlug(c.slug) || (categorySlugFor(c.name) && c.slug !== preferred);
    if (!needs) { taken.add(c.slug); continue; }
    const next = await uniqueFor(Category, preferred, c._id, taken);
    if (next === c.slug) continue;
    log(`category  /category/${c.slug}  →  /category/${next}`);
    changed += 1;
    if (APPLY) {
      const old = c.slug;
      c.slug = next;
      await c.save();
      await SeoRedirect.recordMove(`/category/${old}`, `/category/${next}`, 'category');
    }
  }
  return changed;
}

async function migrateProducts() {
  const taken = new Set();
  let slugChanges = 0;
  let altChanges = 0;
  const products = await Product.find({}).populate('category', 'name');
  for (const p of products) {
    let dirty = false;
    const old = p.slug;

    const wanted = toSlug(p.name);
    const outdated = RESLUG_ALL && wanted && p.slug.replace(/-\d+$/, '') !== wanted;
    if (!isCleanSlug(p.slug) || outdated) {
      const next = await uniqueFor(Product, toSlug(p.name) || `product-${p.productNumber || p._id}`, p._id, taken);
      if (next !== p.slug) {
        log(`product   /products/${p.slug}  →  /products/${next}`);
        p.slug = next;
        slugChanges += 1;
        dirty = true;
      }
    } else taken.add(p.slug);

    (p.images || []).forEach((img, index) => {
      if (!img.alt || !String(img.alt).trim()) {
        img.alt = productImageAlt({ name: p.name, category: p.category, images: p.images }, index);
        altChanges += 1;
        dirty = true;
      }
    });

    if (APPLY && dirty) {
      await p.save();
      if (p.slug !== old) await SeoRedirect.recordMove(`/products/${old}`, `/products/${p.slug}`, 'product');
    }
  }
  return { slugChanges, altChanges };
}

const run = async () => {
  await connectDB();
  const categories = await migrateCategories();
  const { slugChanges, altChanges } = await migrateProducts();
  await SeoRedirect.syncIndexes();
  console.log('\n--- SEO migration summary ---');
  console.log(`categories re-slugged : ${categories}`);
  console.log(`products re-slugged   : ${slugChanges}`);
  console.log(`image alts filled     : ${altChanges}`);
  console.log(APPLY ? 'Changes written. Old URLs now 301 to the new ones.' : 'Nothing written. Re-run with --apply to save.');
};

run()
  .catch((err) => { console.error('[seo:migrate] failed:', err); process.exitCode = 1; })
  .finally(disconnectDB);
